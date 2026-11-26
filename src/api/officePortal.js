import { api } from './client';

// ---------- the logged-in office's own portal (Office role only) ----------

// GET /office/profile -> { id, name, licenseNo, city, phone, description, status, dailyCapacity,
//                          ratingAvg, ratingCount, completeness }
export function getOfficeProfile() {
  return api('/office/profile');
}

// PUT /office/profile { name, city, phone, description } -> the updated profile
// The license number is changed by the admin only.
export function updateOfficeProfile(body) {
  return api('/office/profile', { method: 'PUT', body });
}

// ---------- errors ----------

// One Arabic message for any failed portal call
export function portalErrorMessage(err) {
  if (err?.status === 0) return err.message;                 // server unreachable (already Arabic)
  if (err?.status === 400) return 'تأكد من صحة البيانات المدخلة.';
  if (err?.status === 403) return 'مكتبكم موقوف حالياً. يرجى التواصل مع الدعم.';
  if (err?.status === 404) return 'لا يوجد مكتب مرتبط بهذا الحساب.';
  if (err?.status === 429) {
    const minutes = Math.max(1, Math.ceil((err.retryAfterSeconds ?? 60) / 60));
    return `حاولت كثيراً، حاول مجدداً بعد ${minutes} دقيقة.`;
  }
  return 'حدث خطأ غير متوقع. حاول مرة أخرى.';
}
