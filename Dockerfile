# ---- build the Next.js app ----
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Inlined into the client bundle at build time
ARG NEXT_PUBLIC_ADMIN_PASSWORD
ENV NEXT_PUBLIC_ADMIN_PASSWORD=$NEXT_PUBLIC_ADMIN_PASSWORD
RUN npm run build

# ---- run: Node only ----
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0

# Prepared documents (run preprocess/prepare-documents.mjs before building)
COPY data ./data

COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public

# Mount at runtime:
#   /app/logs  (study logs)
EXPOSE 3000
CMD ["node", "server.js"]
