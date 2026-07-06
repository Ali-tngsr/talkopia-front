import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Locale } from './i18n';
import type { Role, User } from './types';
import { getStoredAuth, clearStoredAuth } from './auth-storage';
import { logoutUser } from './auth';

export type ViewKey =
  | 'home'
  | 'courses'
  | 'course-watch'
  | 'checkout'
  | 'certificate'
  | 'auth-login'
  | 'auth-register'
  | 'auth-otp'
  | 'auth-forgot'
  | 'student'
  | 'teacher'
  | 'admin'
  | 'downloads';

export interface CartItem {
  /** Course UUID from backend */
  id?: string;
  slug: string;
  title: string;
  price: number;
  priceLabel: string;
  instructor: string;
  tag: string;
  emoji: string;
}

interface AppState {
  locale: Locale;
  setLocale: (l: Locale) => void;
  toggleLocale: () => void;

  view: ViewKey;
  viewParams: Record<string, string>;
  navigate: (view: ViewKey, params?: Record<string, string>) => void;

  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (slug: string) => void;
  clearCart: () => void;

  authOpen: boolean;
  authMode: 'login' | 'register' | 'otp' | 'forgot';
  setAuthMode: (m: 'login' | 'register' | 'otp' | 'forgot') => void;
  openAuth: (m?: 'login' | 'register') => void;
  closeAuth: () => void;

  /** Current logged-in user (mirrors localStorage 'talkotopia-auth'). */
  user: User | null;
  /** Derived role shortcut: 'guest' when no user. */
  role: Role | 'guest';
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  /** Re-read auth from storage (call after login/register/refresh). */
  syncAuth: () => void;
}

function readInitialUser(): User | null {
  if (typeof window === 'undefined') return null;
  return getStoredAuth()?.user ?? null;
}

function roleOf(user: User | null): Role | 'guest' {
  return user?.role ?? 'guest';
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      locale: 'fa',
      setLocale: (l) => {
        set({ locale: l });
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('talkotopia-locale', l);
          window.dispatchEvent(new Event('talkotopia-locale-change'));
        }
      },
      toggleLocale: () => {
        const next = get().locale === 'fa' ? 'en' : 'fa';
        get().setLocale(next);
      },

      view: 'home',
      viewParams: {},
      navigate: (view, params = {}) => {
        set({ view, viewParams: params });
        if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
      },

      cart: [],
      addToCart: (item) => {
        const cart = get().cart;
        if (cart.some((c) => c.slug === item.slug)) return;
        set({ cart: [...cart, item] });
      },
      removeFromCart: (slug) => set({ cart: get().cart.filter((c) => c.slug !== slug) }),
      clearCart: () => set({ cart: [] }),

      authOpen: false,
      authMode: 'login',
      setAuthMode: (m) => set({ authMode: m }),
      openAuth: (m = 'login') => set({ authOpen: true, authMode: m }),
      closeAuth: () => set({ authOpen: false }),

      user: readInitialUser(),
      role: roleOf(readInitialUser()),
      setUser: (user) => set({ user, role: roleOf(user) }),
      syncAuth: () => {
        const auth = getStoredAuth();
        set({ user: auth?.user ?? null, role: roleOf(auth?.user ?? null) });
      },
      logout: async () => {
        await logoutUser();
        clearStoredAuth();
        set({ user: null, role: 'guest' });
        get().navigate('home');
      },
    }),
    {
      name: 'talkotopia-store',
      partialize: (s) => ({ locale: s.locale, cart: s.cart }),
    }
  )
);

// Cross-tab + same-tab auth sync: when localStorage changes, refresh store.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'talkotopia-auth') {
      useAppStore.getState().syncAuth();
    }
  });
  window.addEventListener('talkotopia-auth-change', () => {
    useAppStore.getState().syncAuth();
  });
}
