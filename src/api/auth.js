import { api } from './client';

// ---------- password reset (no login needed) ----------

// POST /auth/forgot-password -> always 200, so nobody can discover which emails exist.
// A link (valid 1 hour, works once) is emailed only to an active account.
export function forgotPassword(email) {
  return api('/auth/forgot-password', { method: 'POST', body: { email } });
}

// POST /auth/reset-password -> 400 = the link is invalid, expired or already used
export function resetPassword(token, password) {
  return api('/auth/reset-password', { method: 'POST', body: { token, password } });
}

// ---------- errors ----------

// One Arabic message for the errors any auth call can return
export function authErrorMessage(err) {
  if (err?.status === 0) return err.message;                 // server unreachable (already Arabic)
  if (err?.status === 429) {
    const minutes = Math.max(1, Math.ceil((err.retryAfterSeconds ?? 60) / 60));
    return `حاولت كثيراً، حاول مجدداً بعد ${minutes} دقيقة.`;
  }
  return 'حدث خطأ غير متوقع. حاول مرة أخرى.';
}
