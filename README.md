# HITLAIS

Web app for a user study on human-in-the-loop summarization. Participants read a document, select sentences, generate summaries, see how they score, and answer questionnaires. Everything they do is logged.

Built with Next.js, React and MUI. Scoring runs through Python scripts (`scripts/analyze.py`, `scripts/compare.py`).

## Run locally

```bash
npm install
npm run dev
```

The app is then available at http://localhost:3000.

## Configure the study

All settings are in `src/config/`.

| File | What it controls |
| --- | --- |
| `studyFlow.ts` | Order of tasks, their questionnaires and the final comparison steps (`STUDY_BLOCKS`, `COMPARISONS`) |
| `studyTasks.ts` | Task instructions and time limits |
| `questionnaires.ts` | Questionnaire questions |
| `documents.ts` | Document ids a participant can be assigned |
| `auth.ts` | Manual user id entry, admin panel password |
| `logExport.ts` | Hash of the token that protects the log export |

**Instruction images:** write `{{image:name.png}}` in an instruction text and put the file in `public/instructions/`.

**Admin password:** set `NEXT_PUBLIC_ADMIN_PASSWORD` at build time. This is only meant for testing.

## Logs

Events are written to `logs/<userId>_<date>.jsonl` in the app's working directory. In production this folder is mounted as a volume by the compose setup.

Export with the log token (the token whose SHA-256 is in `logExport.ts`):

```bash
curl -H "Authorization: Bearer $TOKEN" https://<host>/api/logs                  # list files
curl -H "Authorization: Bearer $TOKEN" "https://<host>/api/logs?file=<name>"    # download one
```

Analyze the downloaded files:

```bash
python analyze_study_logs.py LOG_DIR
```

## Deploy

Every push builds the Docker image in GitHub Actions and publishes it to `ghcr.io/afriendlyraptor/hitlais-server:latest`.

The server runs it from a separate Docker setup (`compose.yaml`) outside this repo. To update, run in that folder:

```bash
docker compose pull
docker compose up -d
docker image prune -f
```
