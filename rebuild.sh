#!/usr/bin/env bash
set -Eeuo pipefail

echo "==> Pulling latest image..."
docker compose pull

echo "==> Recreating containers..."
docker compose up -d 

echo "==> Removing old unused images..."
docker image prune -f

echo "==> Done! Current image:"
docker image ls ghcr.io/afriendlyraptor/hitlais-server
