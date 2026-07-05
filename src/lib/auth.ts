// ==========================================
// Talkotopia — Auth API client
// ==========================================
import axios from 'axios';
import { http, apiBaseUrl, getApiError } from './http';
import {
  getStoredAuth,
  setStoredAuth,
  clearStoredAuth,
  toStoredAuth,
} from './auth-storage';
import type {
  AuthResponse,
  ForgotPasswordPayload,
  LoginPayload,
  RefreshResponse,
  RegisterPayload,
  ResetPasswordPayload,
  StoredAuth,
  User,
  VerifyOtpPayload,
} from './types';

export interface RegisterResult {
  message: string;
  dev_otp?: string;
}

/** Step 1 of register flow — creates inactive user + sends OTP. */
export async function registerUser(payload: RegisterPayload): Promise<RegisterResult> {
  try {
    const res = await http.post<RegisterResult>('/auth/register', payload);
    return res.data;
  } catch (err) {
    throw new Error(getApiError(err, 'ثبت‌نام ناموفق بود.'));
  }
}

/** Step 2 of register flow — verifies OTP, activates user, returns tokens. */
export async function verifyOtp(payload: VerifyOtpPayload): Promise<StoredAuth> {
  try {
    const res = await http.post<AuthResponse>('/auth/verify-otp', payload);
    const auth = toStoredAuth(res.data);
    setStoredAuth(auth);
    return auth;
  } catch (err) {
    throw new Error(getApiError(err, 'تأیید کد ناموفق بود.'));
  }
}

/** Login flow — returns tokens + user. */
export async function loginUser(payload: LoginPayload): Promise<StoredAuth> {
  try {
    const res = await http.post<AuthResponse>('/auth/login', payload);
    const auth = toStoredAuth(res.data);
    setStoredAuth(auth);
    return auth;
  } catch (err) {
    throw new Error(getApiError(err, 'ورود ناموفق بود.'));
  }
}

/** Forgot password — sends reset link to email (no auth). */
export async function forgotPassword(payload: ForgotPasswordPayload): Promise<{ message: string }> {
  try {
    const res = await http.post<{ message: string }>('/auth/forgot-password', payload);
    return res.data;
  } catch (err) {
    throw new Error(getApiError(err, 'درخواست بازنشانی رمز ناموفق بود.'));
  }
}

/** Reset password with token from email. */
export async function resetPassword(payload: ResetPasswordPayload): Promise<{ message: string }> {
  try {
    const res = await http.post<{ message: string }>('/auth/reset-password', payload);
    return res.data;
  } catch (err) {
    throw new Error(getApiError(err, 'بازنشانی رمز عبور ناموفق بود.'));
  }
}

/** Refresh access token using the stored refresh token (without interceptors). */
export async function refreshTokens(): Promise<StoredAuth | null> {
  const current = getStoredAuth();
  if (!current?.refresh_token) return null;
  try {
    const res = await axios.post<RefreshResponse>(
      `${apiBaseUrl}/auth/refresh`,
      { refresh_token: current.refresh_token },
      { headers: { 'Content-Type': 'application/json' } },
    );
    const next: StoredAuth = {
      ...current,
      access_token: res.data.access_token,
      refresh_token: res.data.refresh_token,
    };
    setStoredAuth(next);
    return next;
  } catch {
    clearStoredAuth();
    return null;
  }
}

/** Logout — invalidates refresh token on server + clears local state. */
export async function logoutUser(): Promise<void> {
  try {
    await http.post('/auth/logout');
  } catch {
    // Even if the server call fails, clear locally
  }
  clearStoredAuth();
}

/** Synchronously read the current user (or null) from storage. */
export function getCurrentUser(): User | null {
  return getStoredAuth()?.user ?? null;
}

/** Synchronously read the current auth state (or null) from storage. */
export function getCurrentAuth(): StoredAuth | null {
  return getStoredAuth();
}
