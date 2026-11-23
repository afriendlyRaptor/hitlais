"""
make_govreport_samples.py
=========================

Picks random gov_report documents of about 1500 tokens and converts them into
the same JSON format as the DODIS example file (e.g. 61409.json):

    {id, title, language, transcript, summary, link, sentences: [
        {index, paragraph, text, tokens}, ...
    ]}

How it works
------------
1. Go through every *.json file in  <input-dir>/crs  and  <input-dir>/gao.
2. Build the plain text ("transcript") of each report and ESTIMATE its token
   count from the number of characters (chars / 4). No real tokenizer is used
   here, so this step is fast.
3. Keep all reports whose estimate is within  target-tokens +- tolerance.
4. Randomly pick  --num-docs  of them.
5. Only for these picked documents: split the transcript into sentences with
   pysbd (a rule-based sentence splitter that handles abbreviations like
   "U.S." or "P.L. 111-148") and count the real tokens of every sentence.
6. Write one  <id>.json  per document into --output-dir (file name = id,
   e.g. 94-953.json or AIMD-95-182.json).

Requirements
------------
    pip install pysbd requests         # (+ tiktoken if you use --tokenizer tiktoken)

Examples
--------
    # defaults: 20 docs, 1500 +- 200 tokens, token counting via the API
    python make_govreport_samples.py --input-dir gov_report --output-dir out_samples

    # 10 docs, reproducible, count tokens locally with tiktoken
    python make_govreport_samples.py --input-dir gov_report --output-dir out_samples \
        --num-docs 10 --seed 42 --tokenizer tiktoken

    # other target size
    python make_govreport_samples.py --input-dir gov_report --output-dir out_samples \
        --target-tokens 3000 --tolerance 300

Parameters
----------
    --input-dir        folder that contains the sub folders crs and gao
    --output-dir       folder for the result files (created if missing)
    --subfolders       sub folders to search            (default: crs gao)
    --num-docs         how many documents to sample     (default: 20)
    --target-tokens    wanted document length           (default: 1500)
    --tolerance        allowed +- deviation             (default: 200)
    --chars-per-token  used for the estimate            (default: 4.0)
    --tokenizer        "api" (like countToken.py) or "tiktoken"  (default: api)
    --api-url          URL of the token-count API       (default: URL from countToken.py)
    --language         pysbd language code, e.g. en, de, fr (default: en)
    --seed             random seed for reproducible sampling (default: none)
"""

import argparse
import json
import random
from pathlib import Path

import pysbd
import requests

DEFAULT_API_URL = "http://100.105.103.45:8000/token-count"

# name written into the "language" field of the output files
LANGUAGE_NAMES = {"en": "English", "de": "German", "fr": "French", "it": "Italian"}


# ----------------------------------------------------------------------------
# 1. Build the text of a report
# ----------------------------------------------------------------------------

def sections_to_blocks(sections, level=1):
    """Turn nested sections into a flat list of text blocks (= paragraphs).

    A section title becomes a markdown heading ("# Title", "## Subtitle", ...),
    every paragraph string becomes one block.
    """
    blocks = []
    for section in sections:
        title = (section.get("section_title") or "").strip()
        if title:
            blocks.append("#" * level + " " + title)
        blocks.extend(p.strip() for p in section.get("paragraphs", []) if p.strip())
        # an untitled section (CRS root) does not add a heading level
        sub_level = level + 1 if title else level
        blocks.extend(sections_to_blocks(section.get("subsections", []), sub_level))
    return blocks


def get_sections(data):
    """CRS files use the key "reports" (one dict), GAO files use "report" (a list)."""
    if isinstance(data.get("reports"), dict):
        return [data["reports"]]
    return data.get("report", [])


def get_summary(data):
    """CRS: "summary" is a list of strings. GAO: "highlight" is a list of sections."""
    if data.get("summary"):
        return " ".join(data["summary"])
    parts = []
    for section in data.get("highlight", []):
        parts.extend(section.get("paragraphs", []))
    return " ".join(parts)


def build_transcript(data):
    return "\n\n".join(sections_to_blocks(get_sections(data)))


# ----------------------------------------------------------------------------
# 2. Find candidate documents (token count only estimated)
# ----------------------------------------------------------------------------

def find_candidates(input_dir, subfolders, min_tokens, max_tokens, chars_per_token):
    candidates = []
    for subfolder in subfolders:
        files = sorted((input_dir / subfolder).rglob("*.json"))
        print(f"Scanning {len(files)} files in {input_dir / subfolder} ...")
        for path in files:
            with open(path, encoding="utf-8") as f:
                data = json.load(f)
            transcript = build_transcript(data)
            estimated_tokens = len(transcript) / chars_per_token
            if min_tokens <= estimated_tokens <= max_tokens:
                candidates.append((path, data, transcript))
    return candidates


# ----------------------------------------------------------------------------
# 3. Sentences + real token counts
# ----------------------------------------------------------------------------

def make_token_counter(tokenizer, api_url):
    """Return a function  text -> number of tokens."""
    if tokenizer == "tiktoken":
        import tiktoken
        encoding = tiktoken.encoding_for_model("gpt-4o")
        return lambda text: len(encoding.encode(text))

    session = requests.Session()  # re-uses the connection, faster for many calls

    def count_with_api(text):
        response = session.post(api_url, json={"text": text}, timeout=30)
        response.raise_for_status()
        return response.json()["token_count"]

    return count_with_api


def split_into_sentences(transcript, language, count_tokens):
    """Return the sentence list in the format of 61409.json.

    "paragraph" = index of the block separated by a blank line.
    Every line of a paragraph is sentenized on its own.
    """
    sentences = []
    segmenter = pysbd.Segmenter(language=language, clean=False)
    for paragraph_index, paragraph in enumerate(transcript.split("\n\n")):
        for line in paragraph.split("\n"):
            for text in segmenter.segment(line):
                text = text.strip()
                if not text:
                    continue
                sentences.append({
                    "index": len(sentences),
                    "paragraph": paragraph_index,
                    "text": text,
                    "tokens": count_tokens(text),
                })
    return sentences


# ----------------------------------------------------------------------------
# main
# ----------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description="Sample gov_report documents and sentenize them.")
    parser.add_argument("--input-dir", required=True, type=Path)
    parser.add_argument("--output-dir", required=True, type=Path)
    parser.add_argument("--subfolders", nargs="+", default=["crs", "gao"])
    parser.add_argument("--num-docs", type=int, default=20)
    parser.add_argument("--target-tokens", type=int, default=1500)
    parser.add_argument("--tolerance", type=int, default=200)
    parser.add_argument("--chars-per-token", type=float, default=4.0)
    parser.add_argument("--tokenizer", choices=["api", "tiktoken"], default="api")
    parser.add_argument("--api-url", default=DEFAULT_API_URL)
    parser.add_argument("--language", default="en")
    parser.add_argument("--seed", type=int, default=None)
    args = parser.parse_args()

    # step 1 + 2: find documents with roughly the wanted length
    candidates = find_candidates(
        args.input_dir,
        args.subfolders,
        args.target_tokens - args.tolerance,
        args.target_tokens + args.tolerance,
        args.chars_per_token,
    )
    print(f"{len(candidates)} documents are in the range "
          f"{args.target_tokens} +- {args.tolerance} tokens (estimated).")

    # step 3: random selection
    if args.seed is not None:
        random.seed(args.seed)
    selected = random.sample(candidates, min(args.num_docs, len(candidates)))

    # step 4: sentenize + count tokens, write one file per document
    count_tokens = make_token_counter(args.tokenizer, args.api_url)
    args.output_dir.mkdir(parents=True, exist_ok=True)

    for path, data, transcript in selected:
        doc_id = data.get("id") or path.stem
        sentences = split_into_sentences(transcript, args.language, count_tokens)

        result = {
            "id": doc_id,
            "title": (data.get("title") or "").strip(),
            "language": LANGUAGE_NAMES.get(args.language, args.language),
            "transcript": transcript,
            "summary": get_summary(data),
            "link": data.get("url", ""),  # only GAO files have a url
            "sentences": sentences,
        }

        output_path = args.output_dir / f"{doc_id}.json"
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(result, f, ensure_ascii=False, indent=2)

        total = sum(s["tokens"] for s in sentences)
        print(f"{output_path.name}: {len(sentences)} sentences, {total} tokens")

    print("Done.")


if __name__ == "__main__":
    main()
