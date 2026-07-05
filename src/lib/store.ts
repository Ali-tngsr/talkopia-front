import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Locale } from './i18n';

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
  | 'admin';

interface CartItem {
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

  role: 'guest' | 'student' | 'teacher' | 'admin';
  setRole: (r: 'guest' | 'student' | 'teacher' | 'admin') => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      locale: 'fa',
      setLocale: (l) => set({ locale: l }),
      toggleLocale: () => set({ locale: get().locale === 'fa' ? 'en' : 'fa' }),

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

      role: 'guest',
      setRole: (r) => set({ role: r }),
    }),
    {
      name: 'talkotopia-store',
      partialize: (s) => ({ locale: s.locale, cart: s.cart, role: s.role }),
    }
  )
);
