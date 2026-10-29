
import json
import sys
import time
import requests


API_URL = "http://100.105.103.45:8000"


def main():
    text = sys.argv[1]
    reference = sys.argv[2]
    start = time.time()

    # Create job
    response = requests.post(
        f"{API_URL}/submit",
        json={"text": text},
        timeout=10,
    )


#    print("Status:", response.status_code, flush=True)
#    print("Response:", response.text, flush=True)

    response.raise_for_status()


    job_id = response.json()["job_id"]
    

    # Wait for job
    while True:
        response = requests.get(
            f"{API_URL}/status/{job_id}",
            timeout=10,
        )
        response.raise_for_status()

        status = response.json()["status"]

        if status == "done":
            break

        if status in ("failed", "error"):
            raise RuntimeError(f"Job failed: {status}")

        time.sleep(1)


    result = get_score(job_id,reference)

    # Add response time
    result["response_time_seconds"] = round(time.time() - start, 2)


    print(json.dumps(result))



def get_score(job_id, reference):
    response = requests.post(
        f"{API_URL}/score/{job_id}",
        json={"reference": reference},
        timeout=10,
    )
    response.raise_for_status()

    return response.json()

if __name__ == "__main__":
    main()

