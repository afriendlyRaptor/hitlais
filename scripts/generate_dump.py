from pathlib import Path
import pyarrow.dataset as ds
import tiktoken

BACKEND_ROOT = Path(__file__).resolve().parent.parent

DATASET_DIR = BACKEND_ROOT / "dataset" / "dodis-historical-documents" / "data"
OUTPUT_FILE = BACKEND_ROOT / "document_sort_lenght_newer1990.txt"

def count_tokens(text: str, model: str = "gpt-4o") -> int:
    encoding = tiktoken.encoding_for_model(model)
    return len(encoding.encode(text))

def main():
    print("Reading dataset...")

    dataset = ds.dataset(str(DATASET_DIR), format="parquet")
    documentIds = []

    columns = [
        "id",
        "title",
        "summary",
        "language",
        "transcript_txt",
        "combined_text",
        "date_begin",
        "date_end",
    ]

    available_columns = [
        column for column in columns
        if column in dataset.schema.names
    ]

    table = dataset.to_table(columns=available_columns)
    documents = []

    for row in table.to_pylist():
        date_end = row.get("date_end")

        if row.get("language") != "German":
            continue

        if not date_end or str(date_end)[:4] <= "1990":
            continue

        text = row.get("transcript_txt") or row.get("combined_text") or ""
        text = str(text)


        if count_tokens(text) < 1300:
            continue

        if count_tokens(text) > 1700:
            continue

        summary = row.get("summary") or ""
        summary = str(summary)

        docId = row.get("id")

        documents.append({
            "id": docId,
            "date_begin": row.get("date_begin"),
            "date_end": date_end,
            "length": len(text),
            "preview": text[:100].replace("\n", " "),
            "summary": summary.replace("\n", " "),
        })
        documentIds.append(docId)

    documents.sort(key=lambda document: document["length"], reverse=True)

    print(f"Found {len(documents)} documents after 1990.")
    print(f"Writing {OUTPUT_FILE}...")

    with open(OUTPUT_FILE, "w", encoding="utf-8") as file:
        for document in documents:
            file.write(
                f"ID: {document['id']}\n"
                f"Date begin: {document['date_begin']}\n"
                f"Date end: {document['date_end']}\n"
                f"Length: {document['length']}\n"
                f"Summary: {document['summary']}\n"
                f"{'-' * 80}\n"
            )
        file.write(str(documentIds))

    print("Done.")

if __name__ == "__main__":
    main()
