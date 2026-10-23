/**
 * Lets participants type in their own user id.
 * Turn off once the id is provided by the OIDC header.
 */
export const ALLOW_MANUAL_USER_ID = true;

/**
 * Password for the admin panel (click the ID in the app bar).
 * Client-side only, meant for testing: set VITE_ADMIN_PASSWORD, don't rely on it for security.
 */
export const ADMIN_PASSWORD: string =
  import.meta.env.VITE_ADMIN_PASSWORD ?? 'adminPassword';
