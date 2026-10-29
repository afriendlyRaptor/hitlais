

#!/usr/bin/env bash
set -Eeuo pipefail

IMAGE="hitlais-server"

echo "==> Removing old ${IMAGE} images..."
docker image rm -f $(docker image ls "$IMAGE" -q) 2>/dev/null || true

echo "==> Building ${IMAGE}..."
docker build --no-cache --tag "${IMAGE}:latest" .

echo "==> Recreating Compose containers..."
docker compose up -d --force-recreate

echo "==> Done! Current image:"
docker image ls "$IMAGE"
