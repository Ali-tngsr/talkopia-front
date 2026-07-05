'use client';

import React, { createContext, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import en from '@/messages/en.json';
import fa from '@/messages/fa.json';

export type Locale = 'en' | 'fa';
type Messages = typeof en;

const messages: Record<Locale, Messages> = { en, fa };

function lookup(obj: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

function format(value: unknown): string | unknown[] {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') return value;
  if (value === undefined || value === null) return '';
  return String(value);
}

type TFunc = (path: string, vars?: Record<string, string | number>) => string;
type TRaw = <T = unknown>(path: string) => T;

interface I18nContextValue {
  locale: Locale;
  t: TFunc;
  raw: TRaw;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  const value = useMemo<I18nContextValue>(() => {
    const dict = messages[locale] ?? messages.en;
    const t: TFunc = (path, vars) => {
      const v = lookup(dict, path);
      let str = typeof v === 'string' ? v : '';
      if (vars) {
        for (const [k, val] of Object.entries(vars)) {
          str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(val));
        }
      }
      return str;
    };
    const raw: TRaw = (path) => {
      const v = lookup(dict, path);
      return v as never;
    };
    return { locale, t, raw };
  }, [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}

type TranslationFn = {
  (path: string, vars?: Record<string, string | number>): string;
  raw: <T = unknown>(path: string) => T;
};

export function useTranslations(namespace?: string): TranslationFn {
  const { t, raw } = useI18n();
  return useMemo<TranslationFn>(() => {
    const fn = ((path: string, vars?: Record<string, string | number>) => {
      const fullPath = namespace ? `${namespace}.${path}` : path;
      const result = t(fullPath, vars);
      if (result === undefined || result === '') {
        return t(path, vars) || path;
      }
      return result;
    }) as TranslationFn;
    Object.defineProperty(fn, 'raw', {
      value: <T = unknown,>(path: string): T => {
        const fullPath = namespace ? `${namespace}.${path}` : path;
        return raw<T>(fullPath);
      },
      writable: false,
      configurable: true,
    });
    return fn;
  }, [t, raw, namespace]);
}

export function useLocale(): Locale {
  const { locale } = useI18n();
  return locale;
}

export function useIsRtl(): boolean {
  return useLocale() === 'fa';
}

export { format };
