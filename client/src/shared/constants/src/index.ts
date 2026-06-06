/**
 * Shared auth constants used across middleware, store, and helpers.
 * Isolates the cookie name from the middleware module to avoid import cycles.
 */

/** Cookie name used to persist the user's role for edge middleware reads */
export const ROLE_COOKIE_NAME = 'cb-role';
