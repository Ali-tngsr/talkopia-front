// ==========================================
// Talkotopia — auth storage helpers (localStorage-backed)
// ==========================================
import type { AuthResponse, User } from './types';

const STORAGE_KEY = 'talkotopia-auth';

export interface StoredAuth {
  access_token: string;
  refresh_token: string;
  user: User;
}

export function getStoredAuth(): StoredAuth | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredAuth;
  } catch {
    return null;
  }
}

export function setStoredAuth(auth: StoredAuth): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
  // Notify listeners (e.g. Zustand store)
  window.dispatchEvent(new Event('talkotopia-auth-change'));
}

export function clearStoredAuth(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event('talkotopia-auth-change'));
}

export function setStoredLocale(locale: 'fa' | 'en'): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem('talkotopia-locale', locale);
}

/** Normalize an AuthResponse from the backend into our StoredAuth shape. */
export function toStoredAuth(res: AuthResponse): StoredAuth {
  return {
    access_token: res.access_token,
    refresh_token: res.refresh_token,
    user: res.user,
  };
}
