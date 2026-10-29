
#!/usr/bin/env python3

import sys
import json
import os
from pathlib import Path

import pyarrow.dataset as ds

sys.stdout.reconfigure(encoding="utf-8")

# ---------------------------------------------------------
# Configuration
# ---------------------------------------------------------


BACKEND_ROOT = Path(__file__).resolve().parent.parent

DATASET_DIR = (
    BACKEND_ROOT
    / "dataset"
    / "dodis-historical-documents"
    / "data"
)

# ---------------------------------------------------------
# Helpers
# ---------------------------------------------------------

def output(data, exit_code=0):
    """Print JSON and exit."""
    print(json.dumps(data, ensure_ascii=False))
    sys.exit(exit_code)


def find_document(document_id):
    """
    Find a Dodis document by its ID in the Parquet dataset.
    """

    if not DATASET_DIR.exists():
        raise FileNotFoundError(
            f"Dataset directory does not exist: {DATASET_DIR}"
        )

    # Treat the directory containing the parquet files as
    # one Arrow dataset.
    dataset = ds.dataset(
        str(DATASET_DIR),
        format="parquet",
    )

    # Only read the columns we actually need.
    columns = [
        "id",
        "title",
        "language",
        "summary",
        "summary_in_text_language",
        "english_summary",
        "transcript_txt",
        "combined_text",
        "link",
    ]

    # Some datasets may not contain every optional column.
    available_columns = [
        column
        for column in columns
        if column in dataset.schema.names
    ]

    # Filter directly in Arrow.
    #
    # This is preferable to loading every document into Python.
    table = dataset.to_table(
        filter=ds.field("id") == int(document_id),
        columns=available_columns,
    )

    if table.num_rows == 0:
        return None

    if table.num_rows > 1:
        raise RuntimeError(
            f"Multiple documents found with id {document_id}"
        )

    row = table.to_pylist()[0]

    return row


# ---------------------------------------------------------
# Main
# ---------------------------------------------------------

def main():
    if len(sys.argv) < 2:
        output({
            "error": "Missing document ID"
        }, 1)

    document_id = sys.argv[1].strip()

    if not document_id.isdigit():
        output({
            "error": "Document ID must be numeric"
        }, 1)

    try:
        row = find_document(document_id)

        if row is None:
            output({
                "error": f"Document {document_id} not found"
            }, 1)

        # -------------------------------------------------
        # transcript text
        # -------------------------------------------------
        #
        # Fall back to combined_text if transcript_txt
        # isn't available.
        #
        raw_text = (
            row.get("transcript_txt")
            or row.get("combined_text")
            or ""
        )

        # -------------------------------------------------
        # Summary
        # -------------------------------------------------
        #
        # Fall back to summary and then english_summary.
        #
        summary = (
            row.get("summary_in_text_language")
            or row.get("summary")
            or row.get("english_summary")
            or ""
        )

        result = {
            "id": row.get("id"),
            "title": row.get("title"),
            "language": row.get("language"),
            "transcript": raw_text,
            "summary": summary,
            "link": row.get("link"),
        }

        output(result)

    except Exception as e:
        output({
            "error": str(e)
        }, 1)


if __name__ == "__main__":
    main()
