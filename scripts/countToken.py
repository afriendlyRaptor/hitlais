

import sys
import json
import requests

API_URL = "http://100.105.103.45:8000/token-count"


def count_tokens(text: str) -> int:
    response = requests.post(
        API_URL,
        json={"text": text},
        timeout=30,
    )
    response.raise_for_status()
    return response.json()["token_count"]


def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Expected a text argument"}))
        sys.exit(1)

    try:
        text = sys.argv[1]
        result = count_tokens(text)
        print(json.dumps(result))

    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)


if __name__ == "__main__":
    main()

