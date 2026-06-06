/**
 * lib/auth/role-mapping.ts
 *
 * DEV-ONLY: Static email → role mapping for local dashboard testing.
 *
 * Architecture note: This file is the ONLY place that needs to change when
 * production RBAC lands. Replace `DEV_ROLE_MAP` lookup with a
 * `getUserRoleFromDB(email)` async call — all callers stay identical.
 */

import type { UserRole } from '@/shared/types';

// ─── Role Labels (human-readable) ────────────────────────────────────────────

export const ROLE_LABELS: Record<UserRole, string> = {
  RESEARCH_SUPERVISOR: 'Supervisor',
  RESEARCH_SCHOLAR: 'Scholar',
  INSTITUTION_ADMIN: 'Admin',
};

// ─── Core resolver ───────────────────────────────────────────────────────────

/**
 * Returns the platform role for a given email dynamically based on development patterns.
 * 
 * Pattern:
 * - username contains '.' -> INSTITUTION_ADMIN
 * - username contains letters + numbers -> RESEARCH_SCHOLAR
 * - username contains only letters -> RESEARCH_SUPERVISOR
 * - fallback -> RESEARCH_SCHOLAR
 *
 * @returns The UserRole resolved from email pattern.
 */
export function getRoleForEmail(email: string): UserRole {
  const normalized = email.trim().toLowerCase();
  const username = normalized.split('@')[0];

  if (username.includes('.')) {
    return 'INSTITUTION_ADMIN';
  } else if (/[a-zA-Z]/.test(username) && /[0-9]/.test(username)) {
    return 'RESEARCH_SCHOLAR';
  } else if (/^[a-zA-Z]+$/.test(username)) {
    return 'RESEARCH_SUPERVISOR';
  }

  return 'RESEARCH_SCHOLAR';
}

/**
 * Returns true if the email maps to a valid role. Since pattern-based routing
 * resolves a role for all inputs, this helper is preserved and always returns true.
 */
export function isEmailAllowed(email: string): boolean {
  return true;
}
