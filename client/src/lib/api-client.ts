import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

let authInitPromise: Promise<any> | null = null;
let authUnsubscribe: (() => void) | null = null;
let isAuthInitialized = false;

function waitForAuth(): Promise<any> {
  if (isAuthInitialized) {
    return Promise.resolve(auth.currentUser);
  }
  if (authInitPromise) return authInitPromise;

  authInitPromise = new Promise((resolve, reject) => {
    let settled = false;

    const cleanup = () => {
      if (settled) return;
      settled = true;
      if (authUnsubscribe) {
        authUnsubscribe();
        authUnsubscribe = null;
      }
    };

    const timeout = setTimeout(() => {
      cleanup();
      isAuthInitialized = true;
      resolve(auth.currentUser);
    }, 5000);

    authUnsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        clearTimeout(timeout);
        cleanup();
        isAuthInitialized = true;
        resolve(user);
      },
      (error) => {
        clearTimeout(timeout);
        cleanup();
        authInitPromise = null;
        reject(error);
      }
    );
  });

  return authInitPromise;
}

export function resetAuthPromise() {
  authInitPromise = null;
  isAuthInitialized = false;

  if (authUnsubscribe) {
    authUnsubscribe();
    authUnsubscribe = null;
  }
}

// ─────────────────────────────────────────────
// Auth headers (FIXED: no localStorage writes per request)
// ─────────────────────────────────────────────

export async function getAuthHeaders(): Promise<Record<string, string>> {
  await waitForAuth();

  const user = auth.currentUser;

  if (!user) {
    return {};
  }

  try {
    const token = await user.getIdToken();
    return { Authorization: `Bearer ${token}` };
  } catch (error) {
    console.error('[API] Failed to read Firebase ID token:', error);
  }

  return {};
}

// ─────────────────────────────────────────────
// Safe JSON
// ─────────────────────────────────────────────

export async function safeJson<T = unknown>(res: Response): Promise<T> {
  const contentType = res.headers.get('content-type') ?? '';

  if (!contentType.includes('application/json')) {
    const text = await res.text().catch(() => '');
    throw new Error(
      `Expected JSON but got ${contentType}. Status=${res.status}. Body=${text.slice(0, 200)}`
    );
  }

  return res.json() as Promise<T>;
}

// ─────────────────────────────────────────────
// Error reader
// ─────────────────────────────────────────────

export async function readApiError(res: Response): Promise<string> {
  try {
    const ct = res.headers.get('content-type') ?? '';

    if (ct.includes('application/json')) {
      const data = await res.json();
      return (
        data?.message ||
        (Array.isArray(data?.errors) ? data.errors.join(', ') : '') ||
        ''
      );
    }

    return await res.text();
  } catch {
    return '';
  }
}

// ─────────────────────────────────────────────
// Core Fetch Wrapper (stable + safe abort)
// ─────────────────────────────────────────────

export interface ApiRequestInit extends Omit<RequestInit, 'headers'> {
  headers?: Record<string, string>;
  skipAuth?: boolean;
}

export async function apiFetch(
  path: string,
  init: ApiRequestInit = {}
): Promise<Response> {
  const { skipAuth = false, headers = {}, ...rest } = init;

  const authHeaders = skipAuth ? {} : await getAuthHeaders();

  if (!skipAuth && Object.keys(authHeaders).length === 0) {
    const message = `Protected request ${path} attempted without Firebase auth headers.`;
    console.error('[API] Missing auth headers:', message);
    throw new Error(message);
  }

  const url = path.startsWith('http') ? path : `${API_URL}${path}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  console.info('[API] →', rest.method ?? 'GET', url);

  try {
    const res = await fetch(url, {
      ...rest,
      headers: {
        ...authHeaders,
        ...headers,
      },
      signal: controller.signal,
    });

    console.info('[API] ←', res.status, url);

    return res;
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw new Error(`Request timeout: ${path}`);
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

export async function apiGet<T = unknown>(path: string): Promise<T> {
  const res = await apiFetch(path);

  if (!res.ok) {
    const msg = await readApiError(res);
    throw new Error(msg || `HTTP ${res.status}`);
  }

  return safeJson<T>(res);
}

export async function apiMutate<T = unknown>(
  path: string,
  method: string,
  body?: unknown
): Promise<T> {
  const res = await apiFetch(path, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const msg = await readApiError(res);
    throw new Error(msg || `HTTP ${res.status}`);
  }

  return safeJson<T>(res);
}