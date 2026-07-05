// ==========================================
// Talkotopia — HTTP client (axios + JWT interceptors + Accept-Language)
// ==========================================
import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type { ApiError, RefreshResponse } from './types';
import { getStoredAuth, setStoredAuth, clearStoredAuth } from './auth-storage';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';
const API_PREFIX = process.env.NEXT_PUBLIC_API_PREFIX ?? '/api/v1';

export const apiBaseUrl = `${API_URL}${API_PREFIX}`;

/** Primary axios instance — sends credentials and language on every request. */
export const http: AxiosInstance = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 20_000,
});

// ====== Request interceptor: attach access token + language ======
http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const auth = getStoredAuth();
  if (auth?.access_token) {
    config.headers.Authorization = `Bearer ${auth.access_token}`;
  }
  // Pick language from localStorage (set by i18n store) — default to fa
  if (typeof window !== 'undefined') {
    const locale = (window.localStorage.getItem('talkotopia-locale') as 'fa' | 'en') ?? 'fa';
    config.headers['Accept-Language'] = locale;
  }
  return config;
});

// ====== Response interceptor: auto-refresh on 401 ======
let isRefreshing = false;
let refreshSubscribers: Array<(token: string | null) => void> = [];

function subscribeTokenRefresh(cb: (token: string | null) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string | null) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // 401 → try refresh once, otherwise logout
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const auth = getStoredAuth();

      if (!auth?.refresh_token) {
        clearStoredAuth();
        if (typeof window !== 'undefined') window.location.href = '/';
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Queue this request until the ongoing refresh finishes
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh((newToken) => {
            if (!newToken) {
              reject(error);
              return;
            }
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(http(originalRequest));
          });
        });
      }

      isRefreshing = true;
      try {
        const res = await axios.post<RefreshResponse>(
          `${apiBaseUrl}/auth/refresh`,
          { refresh_token: auth.refresh_token },
          { headers: { 'Content-Type': 'application/json' } },
        );
        const newAuth = {
          ...auth,
          access_token: res.data.access_token,
          refresh_token: res.data.refresh_token,
        };
        setStoredAuth(newAuth);
        onRefreshed(newAuth.access_token);
        originalRequest.headers.Authorization = `Bearer ${newAuth.access_token}`;
        return http(originalRequest);
      } catch (refreshError) {
        onRefreshed(null);
        clearStoredAuth();
        if (typeof window !== 'undefined') window.location.href = '/';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

/** Extract a friendly Persian/English error message from an Axios error. */
export function getApiError(err: unknown, fallback = 'خطای ناشناخته رخ داد'): string {
  if (axios.isAxiosError<ApiError>(err)) {
    const data = err.response?.data;
    if (data?.message) {
      return Array.isArray(data.message) ? data.message.join(' · ') : data.message;
    }
    if (err.message === 'Network Error') {
      return 'ارتباط با سرور برقرار نشد. لطفاً اتصال اینترنت خود را بررسی کنید.';
    }
  }
  return fallback;
}
