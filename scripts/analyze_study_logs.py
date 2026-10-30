#!/usr/bin/env python3
"""
analyze_study_logs.py
=====================
Reads every *.jsonl study log in a directory (one or more files per participant)
and writes a Markdown report + PNG graphs.

Usage
-----
    python analyze_study_logs.py LOG_DIR
    python analyze_study_logs.py LOG_DIR -o report.md --plots-dir report_plots
    python analyze_study_logs.py LOG_DIR --pattern "*.jsonl" --no-plots
    python analyze_study_logs.py LOG_DIR --latex-dir thesis/study   # LaTeX output location
    python analyze_study_logs.py LOG_DIR --no-latex                 # Markdown + PNG only

Output
------
    <output>.md                 the report (graphs linked as PNG)
    <output>_plots/*.png        graphs
    <output>_latex/tbl_*.tex    every table as a ready-to-\\input booktabs table float
    <output>_latex/figures/*.pdf  every graph as vector PDF
    <output>_latex/all.tex      \\input / \\includegraphics of all tables and figures
                                (needs \\usepackage{booktabs,graphicx})
    <output>_latex/main.tex     compilable wrapper (written only if missing); every .tex file carries
                                a `%! TEX root = main.tex` line so VimTeX/TeXstudio find the root

Requires Python 3.8+. Graphs need matplotlib (`pip install matplotlib`); without
it the report is still written, just without images.

How the numbers are derived
---------------------------
* Participants: grouped by the `userId` field of the events (files of the same
  user are merged and sorted by timestamp).
* Score events: every `rate_summary` + `summary_scores` pair (same `entry_id`)
  is one "generation". The first generation of a task is the automatic one made
  when the task opens ("initial"); the others are triggered by the user.
* Final score: the score that is "current" when the task is submitted
  (`submit_dialog_confirm`). It is the last generated score, unless a
  `history_restored` event happened after that, in which case the restored
  entry (looked up via its `entry_id`) is the final score.
  (The score shown in the UI, e.g. 9.41, equals ROUGE-L x 100; the report
  uses the raw 0-1 values of all four metrics.)
* Task time: `task_timer_start` -> `submit_dialog_confirm`.
* Manual selection: number of `sentence_toggled` events per task.
"""

import argparse
import glob
import json
import math
import os
import re
import sys
from collections import OrderedDict, defaultdict
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional, Tuple

METRICS = [
    ("bert_score", "BERTScore"),
    ("rouge1", "ROUGE-1"),
    ("rouge2", "ROUGE-2"),
    ("rougeL", "ROUGE-L"),
]


# --------------------------------------------------------------------------- #
# Data model
# --------------------------------------------------------------------------- #
@dataclass
class Attempt:
    n: int                       # 1-based position within the task
    entry_id: Any
    ts: int
    origin: str = "generated"    # "initial" | "generated"
    n_selected: Optional[int] = None
    summary_length: Optional[int] = None
    scores: Dict[str, Optional[float]] = field(default_factory=dict)


@dataclass
class Restore:
    ts: int
    entry_id: Any
    ui_score: Optional[float]
    n_selected: Optional[int]
    target: Optional[Attempt] = None


@dataclass
class TaskData:
    task_id: str
    document_id: Any = None
    instr_start: Optional[int] = None
    start: Optional[int] = None
    limit_s: Optional[int] = None
    end: Optional[int] = None
    last_ts: Optional[int] = None
    q_start: Optional[int] = None
    q_end: Optional[int] = None
    q_id: Optional[str] = None
    answers: Dict[str, Any] = field(default_factory=dict)
    attempts: List[Attempt] = field(default_factory=list)
    restores: List[Restore] = field(default_factory=list)
    toggles_on: int = 0
    toggles_off: int = 0
    clears: int = 0
    random_clicks: int = 0
    generate_clicks: int = 0
    submit_opens: int = 0
    submitted: bool = False
    # state tracking while parsing
    _by_entry: Dict[Any, Attempt] = field(default_factory=dict)
    _initial_pending: bool = False
    _current: Optional[Tuple[str, Any]] = None   # ("attempt", Attempt) | ("restore", Restore)
    final_src: Optional[Tuple[str, Any]] = None

    @property
    def toggles(self) -> int:
        return self.toggles_on + self.toggles_off

    @property
    def first(self) -> Optional[Attempt]:
        return self.attempts[0] if self.attempts else None

    @property
    def final_attempt(self) -> Optional[Attempt]:
        if not self.final_src:
            return None
        kind, obj = self.final_src
        return obj if kind == "attempt" else obj.target

    @property
    def final_scores(self) -> Dict[str, Optional[float]]:
        """Scores of the final entry; falls back to the UI score (= ROUGE-L x 100)."""
        att = self.final_attempt
        if att:
            return att.scores
        if self.final_src and self.final_src[0] == "restore":
            r = self.final_src[1]
            if r.ui_score is not None:
                return {"rougeL": r.ui_score / 100.0}
        return {}

    @property
    def work_seconds(self) -> Optional[float]:
        if self.start is None:
            return None
        end = self.end if self.end is not None else self.last_ts
        return None if end is None else (end - self.start) / 1000.0


@dataclass
class UserData:
    user: str
    files: List[str] = field(default_factory=list)
    n_events: int = 0
    first_ts: Optional[int] = None
    last_ts: Optional[int] = None
    doc_ids: Dict[str, Any] = field(default_factory=dict)
    tasks: "OrderedDict[str, TaskData]" = field(default_factory=OrderedDict)
    cmp_start: Optional[int] = None
    cmp_end: Optional[int] = None
    cmp_task: Optional[str] = None
    comparison: Dict[str, Any] = field(default_factory=dict)

    def task(self, tid: str) -> TaskData:
        if tid not in self.tasks:
            self.tasks[tid] = TaskData(tid)
        return self.tasks[tid]

    @property
    def task_order(self) -> List[str]:
        started = [(t.start, t.task_id) for t in self.tasks.values() if t.start]
        return [tid for _, tid in sorted(started)] or list(self.tasks)


# --------------------------------------------------------------------------- #
# Loading
# --------------------------------------------------------------------------- #
def load_events(directory: str, pattern: str) -> Dict[str, Tuple[List[dict], List[str]]]:
    paths = sorted(glob.glob(os.path.join(directory, pattern)))
    if not paths:
        sys.exit(f"No files matching {pattern!r} in {directory!r}")
    per_user: Dict[str, List[dict]] = defaultdict(list)
    files: Dict[str, List[str]] = defaultdict(list)
    seen = set()
    for path in paths:
        fallback = os.path.basename(path).split("_")[0]
        with open(path, encoding="utf-8") as fh:
            for lineno, line in enumerate(fh, 1):
                line = line.strip()
                if not line or line in seen:
                    continue
                seen.add(line)
                try:
                    ev = json.loads(line)
                except json.JSONDecodeError as exc:
                    print(f"warning: {path}:{lineno}: skipped invalid JSON ({exc})", file=sys.stderr)
                    continue
                if not isinstance(ev, dict) or "type" not in ev or "timestamp" not in ev:
                    continue
                user = str(ev.get("userId") or fallback)
                per_user[user].append(ev)
                if os.path.basename(path) not in files[user]:
                    files[user].append(os.path.basename(path))
    out = {}
    for user, evs in per_user.items():
        evs.sort(key=lambda e: e["timestamp"])      # stable: keeps file order on ties
        out[user] = (evs, files[user])
    return out


# --------------------------------------------------------------------------- #
# Per-user analysis
# --------------------------------------------------------------------------- #
def analyze_user(user: str, events: List[dict], files: List[str]) -> UserData:
    u = UserData(user=user, files=files, n_events=len(events))
    u.first_ts, u.last_ts = events[0]["timestamp"], events[-1]["timestamp"]

    for ev in events:
        typ, ts = ev["type"], ev["timestamp"]
        p = ev.get("payload") or {}
        kind, _, step_task = (ev.get("step") or "").partition(":")

        if typ == "study_plan":
            u.doc_ids = p.get("document_ids") or {}
            for tid, doc in u.doc_ids.items():
                u.task(tid).document_id = doc
            continue

        # ---- final A/B comparison step -------------------------------------
        if kind == "comparison":
            u.cmp_task = step_task or ev.get("taskId")
            if typ == "step_entered":
                u.cmp_start = ts
            elif typ == "comparison_submit":
                u.cmp_end = ts
                u.comparison = p
            continue

        if kind not in ("instructions", "task", "questionnaire") or not step_task:
            continue
        td = u.task(step_task)
        if ev.get("documentId") is not None and td.document_id is None:
            td.document_id = ev["documentId"]

        if kind == "instructions":
            if typ == "step_entered":
                td.instr_start = ts

        elif kind == "questionnaire":
            if typ == "step_entered":
                td.q_start = ts
            elif typ == "questionnaire_submit":
                td.q_end = ts
                td.q_id = p.get("questionnaire_id")
                td.answers = p.get("answers") or {}

        else:  # kind == "task"
            td.last_ts = ts
            if typ == "task_timer_start":
                td.start, td.limit_s = ts, p.get("seconds")
            elif typ == "first_tokens_selected":
                td._initial_pending = True
            elif typ in ("rate_summary", "summary_scores"):
                eid = p.get("entry_id")
                att = td._by_entry.get(eid)
                if att is None:
                    att = Attempt(n=len(td.attempts) + 1, entry_id=eid, ts=ts)
                    if td._initial_pending and not td.attempts:
                        att.origin = "initial"
                    td._initial_pending = False
                    td.attempts.append(att)
                    td._by_entry[eid] = att
                if typ == "rate_summary":
                    att.n_selected = len(p.get("selected_indexes") or [])
                    att.summary_length = p.get("summary_length")
                else:
                    for key, _ in METRICS:
                        if key in p:
                            att.scores[key] = p[key]
                    att.summary_length = att.summary_length or p.get("summary_length")
                td._current = ("attempt", att)
            elif typ == "history_restored":
                r = Restore(ts=ts, entry_id=p.get("entry_id"), ui_score=p.get("score"),
                            n_selected=len(p.get("selected_indexes") or []),
                            target=td._by_entry.get(p.get("entry_id")))
                if r.target is None:
                    print(f"warning: {user}/{td.task_id}: history_restored refers to unknown "
                          f"entry {r.entry_id}", file=sys.stderr)
                elif r.ui_score is not None and r.target.scores.get("rougeL") is not None \
                        and abs(r.target.scores["rougeL"] * 100 - r.ui_score) > 1e-6:
                    print(f"warning: {user}/{td.task_id}: restored UI score {r.ui_score:.4f} != "
                          f"ROUGE-L x 100 of entry {r.entry_id}", file=sys.stderr)
                td.restores.append(r)
                td._current = ("restore", r)
            elif typ == "sentence_toggled":
                if p.get("selected"):
                    td.toggles_on += 1
                else:
                    td.toggles_off += 1
            elif typ == "clear_all_sentences":
                td.clears += 1
            elif typ == "select_random_tokens":
                td.random_clicks += 1
            elif typ == "summary_button":
                td.generate_clicks += 1
            elif typ == "submit_dialog":
                if p.get("open"):
                    td.submit_opens += 1
            elif typ == "submit_dialog_confirm":
                td.end = ts
                td.submitted = True
                td.final_src = td._current

    for td in u.tasks.values():
        if td.final_src is None:             # never confirmed: use state at last event
            td.final_src = td._current
    return u


# --------------------------------------------------------------------------- #
# Formatting helpers
# --------------------------------------------------------------------------- #
def esc(x: Any) -> str:
    return str(x).replace("|", "\\|").replace("\r", "").replace("\n", "<br>")


@dataclass
class Table:
    name: str
    caption: str
    headers: List[str]
    rows: List[List[Any]]
    text_col: bool = False      # last column holds free text -> wrapped p{} column in LaTeX
    appendix: bool = False
    tex_drop: Tuple[str, ...] = ()   # header names left out of the LaTeX version only
    tex_group: bool = False          # LaTeX: show first column once per group, rule between groups


TABLES: List[Table] = []
FIGURES: List[Tuple[str, str]] = []          # (file stem, caption)


def md_table(headers: List[str], rows: List[List[Any]], name: Optional[str] = None,
             caption: str = "", text_col: bool = False, appendix: bool = False,
             tex_drop: Tuple[str, ...] = (), tex_group: bool = False) -> str:
    if name:                                  # also exported to LaTeX
        TABLES.append(Table(name, caption, list(headers), [list(r) for r in rows], text_col, appendix,
                            tuple(tex_drop), tex_group))
    out = ["| " + " | ".join(esc(h) for h in headers) + " |",
           "|" + "|".join("---" for _ in headers) + "|"]
    out += ["| " + " | ".join(esc(c) for c in r) + " |" for r in rows]
    return "\n".join(out) + "\n"


def fmt_dur(sec: Optional[float]) -> str:
    if sec is None:
        return "–"
    sec = int(round(sec))
    m, s = divmod(sec, 60)
    h, m = divmod(m, 60)
    return f"{h}h {m:02d}m {s:02d}s" if h else (f"{m}m {s:02d}s" if m else f"{s}s")


def fmt_num(x: Optional[float], d: int = 3) -> str:
    return "–" if x is None else f"{x:.{d}f}"


def fmt_change(first: Optional[float], final: Optional[float]) -> str:
    if first is None and final is None:
        return "–"
    if first is None or final is None:
        return f"{fmt_num(first)} → {fmt_num(final)}"
    return f"{first:.3f} → {final:.3f} ({final - first:+.3f})"


def mean(vals: List[float]) -> Optional[float]:
    vals = [v for v in vals if v is not None]
    return sum(vals) / len(vals) if vals else None


def is_num(v: Any) -> bool:
    return isinstance(v, (int, float)) and not isinstance(v, bool)


def utc(ts: Optional[int]) -> str:
    return "–" if ts is None else datetime.fromtimestamp(ts / 1000, tz=timezone.utc).strftime("%Y-%m-%d %H:%M:%S")


def final_via(td: TaskData) -> str:
    if not td.final_src:
        return "–"
    kind, obj = td.final_src
    total = len(td.attempts)
    if kind == "attempt":
        s = f"last generated (#{obj.n} of {total})"
    else:
        s = f"history restore → #{obj.target.n if obj.target else '?'} of {total}"
    return s if td.submitted else s + " (no submit event)"


# --------------------------------------------------------------------------- #
# Plots
# --------------------------------------------------------------------------- #
def save_all(fig, paths: List[str]) -> None:
    for pth in paths:
        fig.savefig(pth, dpi=130)


PALETTE = ["#0072B2", "#E69F00", "#009E73", "#D55E00", "#CC79A7", "#000000", "#56B4E9", "#F0E442"]
MARKERS = ["o", "s", "^", "v", "P", "X", "h", "<"]      # (no diamond/star: reserved for restore/final)


def make_colors(users: List[str]):
    """user -> (color, linestyle, marker). Colour-blind-safe palette for up to 8 users, tab20 beyond."""
    import matplotlib
    tab20 = matplotlib.colormaps["tab20"]
    styles = ["-", "--", "-.", ":"]
    out = {}
    for i, u in enumerate(users):
        color = PALETTE[i] if len(users) <= len(PALETTE) else tab20(i % 20)
        out[u] = (color, styles[(i // 8) % len(styles)] if len(users) > len(PALETTE) else "-",
                  MARKERS[i % len(MARKERS)])
    return out


def plot_scores(task_id: str, users: List[UserData], style: dict, paths: List[str]) -> bool:
    import matplotlib.pyplot as plt
    from matplotlib.lines import Line2D

    with_data = [u for u in users if task_id in u.tasks and u.tasks[task_id].attempts]
    if not with_data:
        return False
    fig, axes = plt.subplots(2, 2, figsize=(12, 8), sharex=True)
    for ax, (key, label) in zip(axes.flat, METRICS):
        for u in with_data:
            td = u.tasks[task_id]
            color, ls, mk = style[u.user]
            xs = [a.n for a in td.attempts if a.scores.get(key) is not None]
            ys = [a.scores[key] for a in td.attempts if a.scores.get(key) is not None]
            ax.plot(xs, ys, ls=ls, color=color, marker=mk, ms=5, lw=1.5, alpha=0.9)
            for r in td.restores:                       # history restores
                if r.target and r.target.scores.get(key) is not None:
                    ax.plot(r.target.n, r.target.scores[key], marker="D", ms=9, mfc="none",
                            mec=color, mew=1.5, ls="none", zorder=4)
            fa = td.final_attempt                       # final score
            if fa and fa.scores.get(key) is not None:
                ax.plot(fa.n, fa.scores[key], marker="*", ms=16, mfc=color, mec="black",
                        ls="none", zorder=5)
        ax.set_title(label)
        ax.set_ylabel("score (0–1)")
        ax.grid(alpha=0.3)
    for ax in axes[1]:
        ax.set_xlabel("generation # within task")
    maxn = max(len(u.tasks[task_id].attempts) for u in with_data)
    for ax in axes.flat:
        ax.set_xticks(range(1, maxn + 1))
    handles = [Line2D([0], [0], color=style[u.user][0], ls=style[u.user][1], marker=style[u.user][2], ms=5,
                      label=u.user) for u in with_data]
    handles += [Line2D([0], [0], marker="*", ms=14, mfc="white", mec="black", ls="none",
                       label="final score"),
                Line2D([0], [0], marker="D", ms=8, mfc="none", mec="black", ls="none",
                       label="entry restored via history")]
    ncol = min(6, len(handles))
    rows = math.ceil(len(handles) / ncol)
    fig.suptitle(f"{task_id}: score per generation (first generation = automatic initial summary)")
    fig.tight_layout(rect=[0, 0.045 * rows + 0.02, 1, 0.96])
    fig.legend(handles=handles, loc="lower center", ncol=ncol, frameon=False)
    save_all(fig, paths)
    plt.close(fig)
    return True


def plot_selection(users: List[UserData], tasks: List[str], style: dict, paths: List[str]) -> bool:
    import matplotlib.pyplot as plt
    if not users:
        return False
    fig, ax = plt.subplots(figsize=(max(7, 2.2 * len(tasks) + 0.5 * len(users)), 5))
    width = 0.8 / len(users)
    for i, u in enumerate(users):
        xs = [j + (i - (len(users) - 1) / 2) * width for j in range(len(tasks))]
        vals = [u.tasks[t].toggles if t in u.tasks else 0 for t in tasks]
        bars = ax.bar(xs, vals, width * 0.92, label=u.user, color=style[u.user][0])
        ax.bar_label(bars, padding=2, fontsize=8)
    ax.set_xticks(range(len(tasks)))
    ax.set_xticklabels(tasks)
    ax.set_ylabel("manual sentence toggles (select + deselect)")
    ax.set_title("Manual sentence selection per task and user")
    ax.grid(axis="y", alpha=0.3)
    ax.legend(title="user", ncol=max(1, min(4, len(users))))
    fig.tight_layout()
    save_all(fig, paths)
    plt.close(fig)
    return True


def plot_improvement(users: List[UserData], tasks: List[str], style: dict, paths: List[str]) -> bool:
    """Overall improvement (final - first) per user, task and metric."""
    import matplotlib.pyplot as plt
    if not users or not tasks:
        return False
    fig, axes = plt.subplots(2, 2, figsize=(min(15, max(12, 0.7 * len(users) * len(tasks) + 6)), 8), sharex=True)
    width = 0.8 / len(users)
    crowded = len(users) > 3                      # rotate value labels when bars get narrow
    any_data = False
    for ax, (key, label) in zip(axes.flat, METRICS):
        for i, u in enumerate(users):
            xs = [j + (i - (len(users) - 1) / 2) * width for j in range(len(tasks))]
            vals = []
            for t in tasks:
                td = u.tasks.get(t)
                f = td.first.scores.get(key) if td and td.first else None
                l = td.final_scores.get(key) if td else None
                vals.append(l - f if f is not None and l is not None else float("nan"))
            any_data = any_data or any(v == v for v in vals)
            bars = ax.bar(xs, [0 if v != v else v for v in vals], width * 0.92,
                          color=style[u.user][0], label=u.user)
            ax.bar_label(bars, labels=[f"{v:+.3f}" if v == v else "" for v in vals],
                         padding=2, fontsize=6.5 if crowded else 7, rotation=90 if crowded else 0)
        ax.axhline(0, color="black", lw=0.8)
        ax.set_title(f"{label}: final − first")
        ax.set_ylabel("improvement (score difference)")
        ax.set_xticks(range(len(tasks)))
        ax.set_xticklabels(tasks)
        ax.margins(y=0.22 if crowded else 0.15)
        ax.grid(axis="y", alpha=0.3)
    if not any_data:
        plt.close(fig)
        return False
    handles, labels = axes.flat[0].get_legend_handles_labels()
    fig.suptitle("Overall improvement from first to final score (positive = final score is higher)")
    fig.tight_layout(rect=[0, 0.06, 1, 0.96])
    fig.legend(handles, labels, loc="lower center", ncol=min(8, len(labels)), frameon=False, title="user")
    save_all(fig, paths)
    plt.close(fig)
    return True


# --------------------------------------------------------------------------- #
# Report
# --------------------------------------------------------------------------- #
def build_report(users: List[UserData], plots: Dict[str, Optional[str]], source_dir: str) -> str:
    tasks = sorted({t for u in users for t in u.tasks})
    L: List[str] = []
    add = L.append

    add("# Study log report\n")
    add(f"*Generated {datetime.now().strftime('%Y-%m-%d %H:%M')} from `{source_dir}` — "
        f"{len(users)} participant(s), {len(tasks)} task(s).*\n")
    add("**How to read the numbers**\n")
    add("- **Generation** = one `rate_summary`/`summary_scores` pair. Generation #1 is the automatic "
        "summary created when the task opens (all sentences selected); the rest are triggered by the user.")
    add("- **First score** = generation #1 of the task. **Final score** = the score in effect when the task "
        "was submitted: the last generated score, *unless* a history restore happened after it, in which "
        "case the restored entry counts.")
    add("- All scores are the raw 0–1 values (the score shown in the UI is ROUGE-L × 100). "
        "Cells read `first → final (Δ)`.")
    add("- **Task time** = timer start → submit confirmation. "
        "**Manual selection** = number of `sentence_toggled` events.\n")

    # ---- 1. overview --------------------------------------------------------
    add("## 1. Participants\n")
    rows = []
    for u in users:
        rows.append([u.user, ", ".join(u.files), u.n_events, utc(u.first_ts),
                     fmt_dur(((u.last_ts or 0) - (u.first_ts or 0)) / 1000),
                     " → ".join(u.task_order),
                     ", ".join(f"{t}: {d}" for t, d in u.doc_ids.items()) or "–"])
    add(md_table(["User", "Files", "Events", "Start (UTC)", "Total duration", "Task order", "Documents"], rows,
                 name="participants", caption="Participants.",
                 tex_drop=("Files", "Task order")))

    # ---- 2. scores ----------------------------------------------------------
    add("## 2. Scores: first vs. final per task\n")
    for t in tasks:
        add(f"### {t}\n")
        rows, pairs = [], {k: [] for k, _ in METRICS}
        len_pairs = []
        for u in users:
            td = u.tasks.get(t)
            if not td or not td.attempts:
                rows.append([u.user, "–", "–", "–", "–"] + ["–"] * len(METRICS))
                continue
            fs, f1 = td.final_scores, td.first.scores
            for k, _ in METRICS:
                if f1.get(k) is not None and fs.get(k) is not None:
                    pairs[k].append((f1[k], fs[k]))
            fa = td.final_attempt
            if td.first.summary_length is not None and fa and fa.summary_length is not None:
                len_pairs.append((td.first.summary_length, fa.summary_length))
            rows.append([u.user, len(td.attempts), len(td.restores), final_via(td),
                         f"{td.first.summary_length if td.first.summary_length is not None else '–'} → "
                         f"{fa.summary_length if fa and fa.summary_length is not None else '–'}"]
                        + [fmt_change(f1.get(k), fs.get(k)) for k, _ in METRICS])
        if len(users) > 1:
            def mrow(k):
                if not pairs[k]:
                    return "–"
                return fmt_change(mean([a for a, _ in pairs[k]]), mean([b for _, b in pairs[k]]))
            ml = (f"{mean([a for a, _ in len_pairs]):.0f} → {mean([b for _, b in len_pairs]):.0f}"
                  if len_pairs else "–")
            rows.append(["**mean**", "", "", "", ml] + [mrow(k) for k, _ in METRICS])
        add(md_table(["User", "Generations", "History restores", "Final chosen via",
                      "Summary length (chars)"] + [m for _, m in METRICS], rows,
                     name=f"scores_{t}", tex_drop=("Final chosen via",),
                     caption=f"{t}: first $\\rightarrow$ final score (difference in parentheses)."))
        if plots.get(f"scores_{t}"):
            add(f"![Score development {t}]({plots[f'scores_{t}']})\n")

    # ---- 2b. overall improvement ----------------------------------------------
    add("### Overall improvement (final − first)\n")
    rows = []
    for t in tasks:
        for u in users:
            td = u.tasks.get(t)
            if not td or not td.attempts:
                continue
            f1, fs = td.first.scores, td.final_scores
            rows.append([t, u.user] + [
                f"{fs[k] - f1[k]:+.3f}" if f1.get(k) is not None and fs.get(k) is not None else "–"
                for k, _ in METRICS])
    add(md_table(["Task", "User"] + [f"Δ {m}" for _, m in METRICS], rows, name="improvement",
                 caption="Improvement from first to final score (final $-$ first).", tex_group=True))
    if plots.get("improvement"):
        add(f"![Overall improvement]({plots['improvement']})\n")

    # ---- 3. time ------------------------------------------------------------
    add("## 3. Time spent per task\n")
    rows = []
    for t in tasks:
        for u in users:
            td = u.tasks.get(t)
            if not td:
                continue
            work = td.work_seconds
            pct = f"{100 * work / td.limit_s:.0f}%" if work is not None and td.limit_s else "–"
            instr = (td.start - td.instr_start) / 1000 if td.start and td.instr_start else None
            quest = (td.q_end - td.q_start) / 1000 if td.q_end and td.q_start else None
            rows.append([t, u.user, fmt_dur(work), fmt_dur(td.limit_s), pct, fmt_dur(instr), fmt_dur(quest)])
    add(md_table(["Task", "User", "Working time", "Time limit", "% of limit",
                  "Reading instructions", "Questionnaire"], rows,
                 name="time", caption="Time spent per task (working time = timer start until submission).",
                 tex_drop=("% of limit",), tex_group=True))
    if any(u.cmp_start and u.cmp_end for u in users):
        add("**Final comparison step**\n")
        add(md_table(["User", "Compared document", "Time"],
                     [[u.user, u.cmp_task or "–",
                       fmt_dur((u.cmp_end - u.cmp_start) / 1000 if u.cmp_start and u.cmp_end else None)]
                      for u in users], name="time_comparison", caption="Time spent on the final comparison step."))

    # ---- 4. manual selection ------------------------------------------------
    add("## 4. Manual sentence selection\n")
    rows = []
    for u in users:
        per = [u.tasks[t].toggles if t in u.tasks else 0 for t in tasks]
        rows.append([u.user] + per + [sum(per)])
    add("Manual toggles per user and task:\n")
    add(md_table(["User"] + tasks + ["Total"], rows, name="selection_totals",
                 caption="Manual sentence toggles per user and task."))
    if plots.get("selection"):
        add(f"![Manual selection]({plots['selection']})\n")
    rows = []
    for t in tasks:
        for u in users:
            td = u.tasks.get(t)
            if td:
                rows.append([t, u.user, td.toggles, td.toggles_on, td.toggles_off, td.clears,
                             td.random_clicks, td.generate_clicks, td.submit_opens])
    add("Details:\n")
    add(md_table(["Task", "User", "Toggles", "Selected", "Deselected", "'Clear all'",
                  "'Select random'", "Generate-summary clicks", "Submit dialog opened"], rows,
                 name="selection_details", caption="Interaction counts per task and user.",
                 tex_group=True))

    # ---- 5. questionnaires --------------------------------------------------
    add("## 5. Questionnaire answers\n")
    add("Numeric answers are compared side by side (mean over users in the last column); "
        "free-text answers are listed below each table.\n")
    for t in tasks:
        with_q = [u for u in users if t in u.tasks and u.tasks[t].answers]
        if not with_q:
            continue
        add(f"### {t}\n")
        keys: List[str] = []
        for u in with_q:
            for k in u.tasks[t].answers:
                if k not in keys:
                    keys.append(k)
        text_keys = [k for k in keys if any(isinstance(u.tasks[t].answers.get(k), str) for u in with_q)]
        num_keys = [k for k in keys if k not in text_keys]
        headers = ["Question"] + [u.user for u in with_q] + (["Mean"] if len(with_q) > 1 else [])
        rows = [["*(questionnaire)*"] + [u.tasks[t].q_id or "–" for u in with_q] + ([""] if len(with_q) > 1 else [])]
        for k in num_keys:
            vals = [u.tasks[t].answers.get(k) for u in with_q]
            row = [k] + ["–" if v is None else v for v in vals]
            if len(with_q) > 1:
                m = mean([v for v in vals if is_num(v)])
                row.append("–" if m is None else f"{m:.2f}")
            rows.append(row)
        add(md_table(headers, rows, name=f"questionnaire_{t}",
                     caption=f"{t}: questionnaire answers per user."))
        trows = [[k, u.user, u.tasks[t].answers.get(k)] for k in text_keys for u in with_q
                 if u.tasks[t].answers.get(k) not in (None, "")]
        if trows:
            add("Free-text answers:\n")
            add(md_table(["Question", "User", "Answer"], trows, name=f"freetext_{t}",
                         caption=f"{t}: free-text answers.", text_col=True))

    with_cmp = [u for u in users if u.comparison]
    if with_cmp:
        add("### Final comparison (generated vs. reference summary)\n")
        ans_keys: List[str] = []
        for u in with_cmp:
            for k in (u.comparison.get("answers") or {}):
                if k not in ans_keys:
                    ans_keys.append(k)
        text_keys = [k for k in ans_keys if any(isinstance((u.comparison.get("answers") or {}).get(k), str)
                                                for u in with_cmp)]
        rows = [[f, *[u.comparison.get(f, "–") for u in with_cmp]]
                for f in ("selected_position", "selected_source", "generated_position")]
        for k in ans_keys:
            if k not in text_keys:
                rows.append([k] + [(u.comparison.get("answers") or {}).get(k, "–") for u in with_cmp])
        add(md_table(["Item"] + [u.user for u in with_cmp], rows, name="final_comparison",
                     caption="Final comparison of generated vs. reference summary."))
        trows = [[k, u.user, (u.comparison.get("answers") or {}).get(k)] for k in text_keys for u in with_cmp
                 if (u.comparison.get("answers") or {}).get(k) not in (None, "")]
        if trows:
            add("Free-text answers:\n")
            add(md_table(["Question", "User", "Answer"], trows, name="final_comparison_text",
                         caption="Final comparison: free-text answers.", text_col=True))

    # ---- appendix -----------------------------------------------------------
    add("## Appendix: generation log per user and task\n")
    add("`◀ FINAL` marks the entry that counts as final score. `↩` rows are history restores "
        "(they show the scores of the entry that was restored).\n")
    for u in users:
        for t in [x for x in u.task_order if x in u.tasks] or list(u.tasks):
            td = u.tasks[t]
            if not td.attempts:
                continue
            add(f"### {u.user} – {t}\n")
            items = [(a.ts, 0, a) for a in td.attempts] + [(r.ts, 1, r) for r in td.restores]
            items.sort(key=lambda x: (x[0], x[1]))
            rows = []
            for ts, _, obj in items:
                rel = fmt_dur((ts - td.start) / 1000) if td.start else "–"
                if isinstance(obj, Attempt):
                    sc, n_sel, ln = obj.scores, obj.n_selected, obj.summary_length
                    label = f"#{obj.n} ({obj.origin})"
                    final = td.final_src == ("attempt", obj)
                else:
                    tgt = obj.target
                    sc = tgt.scores if tgt else {"rougeL": (obj.ui_score or 0) / 100}
                    n_sel, ln = obj.n_selected, tgt.summary_length if tgt else None
                    label = f"↩ restored #{tgt.n if tgt else '?'}"
                    final = td.final_src is not None and td.final_src[1] is obj
                rows.append([label, rel, n_sel if n_sel is not None else "–",
                             ln if ln is not None else "–"]
                            + [fmt_num(sc.get(k)) for k, _ in METRICS] + ["◀ FINAL" if final else ""])
            add(md_table(["Entry", "Time into task", "Sentences selected", "Summary length"]
                         + [m for _, m in METRICS] + [""], rows,
                         name=f"log_{u.user}_{t}", caption=f"Generation log of {u.user}, {t}.",
                         appendix=True))
    return "\n".join(L) + "\n"


# --------------------------------------------------------------------------- #
# LaTeX export
# --------------------------------------------------------------------------- #
_TEX_ESC = {"\\": r"\textbackslash{}", "&": r"\&", "%": r"\%", "$": r"\$", "#": r"\#", "_": r"\_",
            "{": r"\{", "}": r"\}", "~": r"\textasciitilde{}", "^": r"\textasciicircum{}",
            "→": r"$\rightarrow$", "–": "--", "↩": r"$\hookleftarrow$", "◀": r"$\blacktriangleleft$",
            "Δ": r"$\Delta$", "−": "$-$", "×": r"$\times$", "\r": ""}


def tex_escape(s: str) -> str:
    out = "".join(_TEX_ESC.get(ch, ch) for ch in s).replace("\n", " ")
    return re.sub(r"(?<![\w}])-(?=\d)", "$-$", out)          # proper minus sign for negative numbers


def tex_cell(x: Any) -> str:
    s = str(x)
    m = re.fullmatch(r"\*\*(.*)\*\*", s, re.S)
    if m:
        return r"\textbf{" + tex_escape(m.group(1)) + "}"
    m = re.fullmatch(r"\*(.*)\*", s, re.S)
    if m:
        return r"\textit{" + tex_escape(m.group(1)) + "}"
    return tex_escape(s)


def slug(name: str) -> str:
    return re.sub(r"[^A-Za-z0-9]+", "_", name).strip("_")


HEAD_COLOR = "white"      # header row background (white bold text)
ROW_COLOR = "blue!7"              # every other row
MEAN_COLOR = "white"            # highlighted 'mean' row


def tex_table(t: Table) -> str:
    keep = [i for i, h in enumerate(t.headers) if h not in t.tex_drop]
    headers = [t.headers[i] for i in keep]
    rows = [[r[i] for i in keep] for r in t.rows]
    n = len(headers)
    spec = ("l" * (n - 1) + r"p{0.6\linewidth}") if t.text_col else "l" + "c" * (n - 1)
    body = [r"\begin{tabular}{" + spec + "}", r"\toprule",
            r"\rowcolor{" + HEAD_COLOR + "}",
            " & ".join(r"\textcolor{black}{\textbf{" + tex_escape(h) + "}}" if h else "" for h in headers)
            + r" \\", r"\midrule"]
    prev = None
    wide = n > 6 and not t.text_col
    for r in rows:
        cells = [tex_cell(c) for c in r]
        if wide:                                             # "a → b (Δ)" on two lines: keeps wide tables legible
            for j, c in enumerate(r):
                m = re.fullmatch(r"(.+ → .+?) (\([+\-−]?[\d.]+\))", str(c))
                if m:
                    cells[j] = r"\shortstack{" + tex_escape(m.group(1)) + r"\\" + tex_escape(m.group(2)) + "}"
        pre = ""
        if str(r[0]) == "**mean**":                          # summary row stands out
            body.append(r"\midrule")
            pre = r"\rowcolor{" + MEAN_COLOR + "}"
        elif t.tex_group:                                    # one block per task
            if prev is not None and r[0] != prev:
                body.append(r"\midrule")
            if r[0] == prev:
                cells[0] = ""
            prev = r[0]
        body.append(pre + " & ".join(cells) + r" \\")
    body += [r"\bottomrule", r"\end{tabular}"]
    tab = "\n".join(body)
    if wide:                                                 # still too wide: scale to text width
        tab = "\\resizebox{\\linewidth}{!}{%\n" + tab + "%\n}"
    lines = [r"\begin{table}[htbp]", r"\centering", r"\small",
             r"\renewcommand{\arraystretch}{1.2}", r"\rowcolors{2}{" + ROW_COLOR + "}{white}"]
    if t.caption:
        lines.append(r"\caption{" + t.caption + "}")
    lines += [r"\label{tab:" + slug(t.name) + "}", tab, r"\end{table}", ""]
    return "\n".join(lines)


ROOT_HINT = "%! TEX root = main.tex\n"           # understood by VimTeX, TeXstudio, LaTeX Workshop

MAIN_TEX = r"""%! TEX root = main.tex
% Compilable wrapper so editors (VimTeX etc.) and `latexmk main.tex` have a root file.
% Auto-generated by analyze_study_logs.py and overwritten on each run - delete the
% line mentioning analyze_study_logs.py (and this one) to keep your own edits.
\documentclass[a4paper,11pt]{article}
\usepackage[utf8]{inputenc}
\usepackage[T1]{fontenc}
\usepackage[margin=2cm]{geometry}
\usepackage{booktabs}
\usepackage{graphicx}
\usepackage[table]{xcolor}   % shaded rows

\newcommand{\studydir}{.}   % folder holding tbl_*.tex and figures/ (relative to this file)

\begin{document}
\input{\studydir/all.tex}
\end{document}
"""


def write_latex(latex_dir: str) -> None:
    os.makedirs(latex_dir, exist_ok=True)
    folder = os.path.basename(os.path.normpath(latex_dir))
    inc = [ROOT_HINT.strip(),
           "% Generated by analyze_study_logs.py",
           "% Needs in the preamble:  \\usepackage{booktabs}  \\usepackage{graphicx}  \\usepackage[table]{xcolor}",
           "% \\studydir is the folder with tbl_*.tex and figures/. When embedding this in a larger document,",
           "% either keep the default folder name or put \\newcommand{\\studydir}{your/folder} before the \\input.",
           "% Tables are also available one by one as tbl_<name>.tex, figures as figures/<name>.pdf.",
           f"\\providecommand{{\\studydir}}{{{folder}}}", "",
           "% ---------------- tables ----------------"]
    for t in TABLES:
        fn = f"tbl_{slug(t.name)}.tex"
        with open(os.path.join(latex_dir, fn), "w", encoding="utf-8") as fh:
            fh.write(ROOT_HINT + tex_table(t))
        inc.append(("% (appendix) " if t.appendix else "") + f"\\input{{\\studydir/{fn}}}")
    inc += ["", "% ---------------- figures ----------------"]
    for stem, cap in FIGURES:
        inc += [r"\begin{figure}[htbp]", r"\centering",
                f"\\includegraphics[width=\\linewidth]{{\\studydir/figures/{stem}.pdf}}",
                f"\\caption{{{cap}}}", f"\\label{{fig:{slug(stem)}}}", r"\end{figure}", ""]
    with open(os.path.join(latex_dir, "all.tex"), "w", encoding="utf-8") as fh:
        fh.write("\n".join(inc) + "\n")
    main_path = os.path.join(latex_dir, "main.tex")
    old = ""
    if os.path.exists(main_path):
        with open(main_path, encoding="utf-8") as fh:
            old = fh.read()
    if not old or "analyze_study_logs.py" in old:       # missing, or ours (not taken over by the user)
        with open(main_path, "w", encoding="utf-8") as fh:
            fh.write(MAIN_TEX)


# --------------------------------------------------------------------------- #
def main() -> None:
    ap = argparse.ArgumentParser(description="Summarise study .jsonl logs into a Markdown report.")
    ap.add_argument("directory", help="directory containing the .jsonl log files")
    ap.add_argument("-o", "--output", default="study_report.md", help="Markdown file to write")
    ap.add_argument("--plots-dir", help="directory for PNG graphs (default: <output>_plots)")
    ap.add_argument("--pattern", default="*.jsonl", help="file glob inside the directory")
    ap.add_argument("--no-plots", action="store_true", help="skip graph generation")
    ap.add_argument("--latex-dir", help="directory for LaTeX tables/figures (default: <output>_latex)")
    ap.add_argument("--no-latex", action="store_true", help="do not write LaTeX files")
    args = ap.parse_args()

    raw = load_events(args.directory, args.pattern)
    users = [analyze_user(name, evs, files) for name, (evs, files) in sorted(raw.items())]
    tasks = sorted({t for u in users for t in u.tasks})

    out_path = os.path.abspath(args.output)
    plots_dir = os.path.abspath(args.plots_dir or os.path.splitext(out_path)[0] + "_plots")
    latex_dir = None if args.no_latex else os.path.abspath(
        args.latex_dir or os.path.splitext(out_path)[0] + "_latex")
    plots: Dict[str, Optional[str]] = {}
    if not args.no_plots:
        try:
            import matplotlib
            matplotlib.use("Agg")
            os.makedirs(plots_dir, exist_ok=True)
            if latex_dir:
                os.makedirs(os.path.join(latex_dir, "figures"), exist_ok=True)
            style = make_colors([u.user for u in users])
            rel = lambda p: os.path.relpath(p, os.path.dirname(out_path)).replace(os.sep, "/")

            def out_paths(stem: str) -> List[str]:          # PNG for Markdown, PDF for LaTeX
                ps = [os.path.join(plots_dir, stem + ".png")]
                if latex_dir:
                    ps.append(os.path.join(latex_dir, "figures", stem + ".pdf"))
                return ps

            for t in tasks:
                ps = out_paths(f"scores_{t}")
                if plot_scores(t, users, style, ps):
                    plots[f"scores_{t}"] = rel(ps[0])
                    FIGURES.append((f"scores_{t}", f"{t}: score development per generation "
                                    "(star = final score, diamond = entry restored via history)."))
            for key, fn, cap in [
                ("improvement", plot_improvement, "Overall improvement from first to final score."),
                ("selection", plot_selection, "Manual sentence toggles per task and user."),
            ]:
                stem = "improvement" if key == "improvement" else "manual_selection"
                ps = out_paths(stem)
                ok = fn(users, tasks, style, ps)
                if ok:
                    plots[key] = rel(ps[0])
                    FIGURES.append((stem, cap))
        except ImportError:
            print("warning: matplotlib not installed - report written without graphs "
                  "(pip install matplotlib)", file=sys.stderr)

    with open(out_path, "w", encoding="utf-8") as fh:
        fh.write(build_report(users, plots, args.directory))
    if latex_dir:
        write_latex(latex_dir)
    print(f"Wrote {out_path}" + (f" and {len(plots)} graph(s) in {plots_dir}" if plots else ""))
    if latex_dir:
        print(f"LaTeX files ({len(TABLES)} tables, {len(FIGURES)} figures) in {latex_dir} (compile main.tex)")


if __name__ == "__main__":
    main()
