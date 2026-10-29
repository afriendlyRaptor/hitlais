

import sys
import json
import tiktoken


def count_tokens(text: str) -> int:
    encoding = tiktoken.encoding_for_model("gpt-4o")
    return len(encoding.encode(text))


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
