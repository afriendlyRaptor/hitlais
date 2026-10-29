/**
 * SHA-256 (hex) of the token that protects GET /api/logs.
 * Only the hash is stored here; keep the token itself private.
 * Empty = the endpoint is disabled.
 *
 * Generate a token and its hash:
 *   TOKEN=$(openssl rand -hex 32); echo "$TOKEN"; printf %s "$TOKEN" | sha256sum
 */
export const LOG_EXPORT_TOKEN_SHA256 = '598ecd772dab0cd12bc2f760e9ce2cf4674892d40f522a9b5208c1a652073f73';

/*  TOKEN=$(openssl rand -hex 32); echo "$TOKEN"; printf %s "$TOKEN" | sha256sum */
