
#!/usr/bin/env python3

import sys
import json

from bert_score import score as bert_score
from rouge_score import rouge_scorer


def compare_texts(reference: str, candidate: str) -> dict:
    """
    Compare two texts using BERTScore and ROUGE.

    Scores are returned from 0 to 100.
    """

    reference = reference.strip()
    candidate = candidate.strip()

    if not reference:
        raise ValueError("Reference text cannot be empty.")

    if not candidate:
        raise ValueError("Candidate text cannot be empty.")

    # BERTScore returns:
    # precision, recall, F1

    P, R, F1 = bert_score(
        [candidate],
        [reference],
        lang="de",
        verbose=False,
    )

    bert_precision = float(P[0])
    bert_recall = float(R[0])
    bert_f1 = float(F1[0])

    # Convert 0-1 -> 0-100
    bert_precision_100 = bert_precision * 100
    bert_recall_100 = bert_recall * 100
    bert_f1_100 = bert_f1 * 100

    # ROUGE
    scorer = rouge_scorer.RougeScorer(
        ["rouge1", "rouge2", "rougeL"],
        use_stemmer=True,
    )

    rouge = scorer.score(reference, candidate)

    rouge1 = rouge["rouge1"].fmeasure * 100
    rouge2 = rouge["rouge2"].fmeasure * 100
    rougeL = rouge["rougeL"].fmeasure * 100

    # Average ROUGE F1
    rouge_average = (rouge1 + rouge2 + rougeL) / 3

    return {
        "bert_score": {
            "precision": round(bert_precision_100, 2),
            "recall": round(bert_recall_100, 2),
            "f1": round(bert_f1_100, 2),
        },
        "rouge": {
            "rouge1": round(rouge1, 2),
            "rouge2": round(rouge2, 2),
            "rougeL": round(rougeL, 2),
            "average": round(rouge_average, 2),
        },
    }


def main():
    """
    Expected input:

    {
        "reference": "The original text",
        "candidate": "The generated text"
    }

    Can be passed as the first command-line argument.
    """

    if len(sys.argv) < 2:
        print(json.dumps({
            "error": "Expected JSON argument containing reference and candidate"
        }))
        sys.exit(1)

    try:
        data = json.loads(sys.argv[1])

        reference = data.get("reference", "")
        candidate = data.get("candidate", "")

        result = compare_texts(reference, candidate)

        print(json.dumps(result))

    except Exception as e:
        print(json.dumps({
            "error": str(e)
        }))
        sys.exit(1)


if __name__ == "__main__":
    main()
