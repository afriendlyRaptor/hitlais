#!/usr/bin/env bash
set -Eeuo pipefail

echo "==> Pulling latest images..."
docker compose pull

echo "==> Recreating containers..."
docker compose up -d

# The server shares the tailscale container's network, so it must be
# recreated after it, otherwise it keeps a stale network and nothing answers.
echo "==> Re-attaching server to the tailscale network..."
docker compose up -d --force-recreate server

echo "==> Removing old unused images..."
docker image prune -f

echo "==> Done! Current image:"
docker image ls ghcr.io/afriendlyraptor/hitlais-server
