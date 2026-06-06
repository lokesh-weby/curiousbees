/**
 * lib/auth/permissions.ts
 *
 * Defines which route prefixes each role is allowed to access.
 * Used by middleware.ts for edge-level route protection.
 *
 * Scalability note: extend `ROLE_PERMISSIONS` with new roles/routes as the
 * platform grows. No other file needs changing.
 */

import type { UserRole } from '@/shared/types';

// ─── Route Permission Matrix ──────────────────────────────────────────────────

/**
 * Maps each role to the list of route prefixes it is permitted to visit.
 * All portal routes NOT listed for a role will result in a redirect to
 * /auth/unauthorized.
 *
 * Rules are prefix-matched: '/dashboard' covers '/dashboard', '/dashboard/...', etc.
 */
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  INSTITUTION_ADMIN: [
    '/admin',
    '/dashboard',
    '/events',
    '/threads',
    '/researchers',
    '/opportunities',
    '/profile',
    '/workspace',
    '/notifications',
  ],
  RESEARCH_SUPERVISOR: [
    '/dashboard',
    '/events',
    '/threads',
    '/researchers',
    '/opportunities',
    '/profile',
    '/workspace',
    '/publications',
    '/reports',
    '/my-scholars',
    '/notifications',
    '/approval-requests',
  ],
  RESEARCH_SCHOLAR: [
    '/dashboard',
    '/events',
    '/threads',
    '/researchers',
    '/opportunities',
    '/profile',
    '/workspace',
    '/publications',
    '/reports',
    '/notifications',
  ],
};

// ─── Routes that are always public (no auth required) ────────────────────────

export const PUBLIC_ROUTES: string[] = [
  '/',
  '/login',
  '/signin',
  '/signup',
  '/about',
  '/features',
  '/auth',
  '/verification-pending',
];

// ─── Core Permission Check ────────────────────────────────────────────────────

/**
 * Returns true if the given role is allowed to access the given pathname.
 *
 * @param role     The user's current role
 * @param pathname The Next.js pathname being accessed (e.g. '/admin')
 */
export function isRouteAllowedForRole(role: UserRole, pathname: string): boolean {
  const allowed = ROLE_PERMISSIONS[role] ?? [];
  return allowed.some((prefix) => pathname === prefix || pathname.startsWith(prefix + '/'));
}

/**
 * Returns true if the pathname is a public route (no auth needed).
 */
export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + '/')
  );
}
