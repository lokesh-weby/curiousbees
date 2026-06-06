/**
 * proxy.ts — Next.js Request Proxy
 *
 * Enforces role-based route protection for all portal routes.
 * Runs at the edge (before page render) on every matching request.
 * Modernized for Next.js 16 Proxy API.
 *
 * Flow:
 *  1. Public route → pass through immediately
 *  2. No cb-role cookie → redirect to /login
 *  3. cb-role cookie present but route not allowed → redirect to /auth/unauthorized
 *  4. All checks pass → allow request
 *
 * Cookie: `cb-role` — set by useStore after successful login.
 */

import { NextRequest, NextResponse } from 'next/server';
import { isPublicRoute, isRouteAllowedForRole } from '@/lib/auth/permissions';
import { ROLE_COOKIE_NAME } from '@/shared/constants/src';
import type { UserRole } from '@/shared/types';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.info('[Proxy] Intercepted request for path:', pathname);

  // 1. Always allow public routes without any auth check
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // 2. Read the role cookie
  const roleCookie = request.cookies.get(ROLE_COOKIE_NAME);
  const role = roleCookie?.value as UserRole | undefined;

  // 3. No role cookie → user is not logged in → redirect to login
  if (!role) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 4. Validate the role value is a known role
  const validRoles: UserRole[] = ['INSTITUTION_ADMIN', 'RESEARCH_SUPERVISOR', 'RESEARCH_SCHOLAR'];
  if (!validRoles.includes(role)) {
    // Corrupt/unknown cookie — clear it and send to login
    const loginUrl = new URL('/login', request.url);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete(ROLE_COOKIE_NAME);
    return response;
  }

  // 5. Check if the role is allowed on this route
  if (!isRouteAllowedForRole(role, pathname)) {
    // User is authenticated but lacks permission for this route
    const unauthorizedUrl = new URL('/auth/unauthorized', request.url);
    unauthorizedUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(unauthorizedUrl);
  }

  // 6. All checks passed — proceed
  return NextResponse.next();
}

// ─── Matcher Config ───────────────────────────────────────────────────────────
// Only run proxy on portal routes (not static files, _next, api proxies)

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public folder assets
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|js|css|woff2?)$).*)',
  ],
};
