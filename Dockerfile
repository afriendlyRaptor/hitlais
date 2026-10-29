# ---- build the Next.js app ----
FROM node:22-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Inlined into the client bundle at build time
ARG NEXT_PUBLIC_ADMIN_PASSWORD
ENV NEXT_PUBLIC_ADMIN_PASSWORD=$NEXT_PUBLIC_ADMIN_PASSWORD
RUN npm run build

# ---- run: Node + the Python venv the scripts need ----
FROM node:22-slim
RUN apt-get update \
 && apt-get install -y --no-install-recommends python3 python3-venv \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app
ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0

# runScript.ts expects ./venv, ./requirements.txt and ./scripts next to server.js.
# CPU-only torch first (extra index, so PyPI still serves the build deps), otherwise pip pulls the multi-GB CUDA build.
COPY requirements.txt ./
RUN python3 -m venv venv \
 && venv/bin/pip install --no-cache-dir torch --extra-index-url https://download.pytorch.org/whl/cpu \
 && venv/bin/pip install --no-cache-dir -r requirements.txt
COPY scripts ./scripts

COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public

# Mount these at runtime:
#   /app/dataset  (dodis-historical-documents/data/*.parquet)
#   /app/logs     (study logs)
EXPOSE 3000
CMD ["node", "server.js"]
