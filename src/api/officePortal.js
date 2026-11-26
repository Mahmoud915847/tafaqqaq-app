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

// GET /office/prices -> [{ id, propertyType, sizeBand, price }]
export function getOfficePrices() {
  return api('/office/prices');
}

// PUT /office/prices { items: [{ propertyType, sizeBand, price }] } -> the saved list
// Replaces the whole list (max 20 rows). Rows are matched by property type + size band.
export function updateOfficePrices(items) {
  return api('/office/prices', { method: 'PUT', body: { items } });
}

// GET /office/schedule -> { dailyCapacity, days: [7 x { weekday, isClosed, openTime, closeTime }] } (from Sunday)
export function getOfficeSchedule() {
  return api('/office/schedule');
}

// PUT /office/schedule { dailyCapacity: 1-50, days: all 7, times "HH:mm" } -> the saved schedule
export function updateOfficeSchedule(body) {
  return api('/office/schedule', { method: 'PUT', body });
}

// ---------- engineers ----------

// GET /office/engineers -> [{ id, fullName, email, phone, specialty, yearsExperience, syndicateNo,
//                             status: 'Active' | 'Deactivated', isActivated }]
export function listEngineers() {
  return api('/office/engineers');
}

// POST /office/engineers -> 201 { engineer, emailSent }; the engineer sets the password from the email link
export function createEngineer(body) {
  return api('/office/engineers', { method: 'POST', body });
}

// PUT /office/engineers/{id} (the email can't be changed) -> the updated engineer
export function updateEngineer(id, body) {
  return api(`/office/engineers/${encodeURIComponent(id)}`, { method: 'PUT', body });
}

// POST /office/engineers/{id}/deactivate | reactivate -> the updated engineer
// POST /office/engineers/{id}/resend-activation       -> { emailSent }
export function engineerAction(id, action) {
  return api(`/office/engineers/${encodeURIComponent(id)}/${action}`, { method: 'POST' });
}

export const SPECIALTIES = ['إنشائي', 'معماري', 'كهرباء', 'ميكانيك'];

export const EMPTY_ENGINEER = {
  fullName: '', email: '', phone: '', specialty: SPECIALTIES[0], yearsExperience: '', syndicateNo: '',
};

export const toEngineerForm = (e) => ({
  fullName: e.fullName, email: e.email, phone: e.phone ?? '', specialty: e.specialty,
  yearsExperience: String(e.yearsExperience), syndicateNo: e.syndicateNo,
});

export const toEngineerBody = (form) => ({
  fullName: form.fullName.trim(),
  phone: form.phone.trim(),
  specialty: form.specialty,
  yearsExperience: Number(form.yearsExperience),
  syndicateNo: form.syndicateNo.trim(),
});

// Same rules as the backend. Returns an Arabic message for the first problem, or ''.
export function findEngineerProblem(form, { withEmail = false } = {}) {
  if (!form.fullName.trim() || !form.phone.trim() || !form.syndicateNo.trim()) {
    return 'الاسم ورقم الهاتف ورقم النقابة حقول مطلوبة.';
  }
  const years = Number(form.yearsExperience);
  if (String(form.yearsExperience).trim() === '' || !Number.isInteger(years) || years < 0 || years > 60) {
    return 'سنوات الخبرة يجب أن تكون عدداً صحيحاً بين 0 و 60.';
  }
  if (withEmail && !/^[^\s@]+@[^\s@]+$/.test(form.email.trim())) return 'أدخل بريداً إلكترونياً صحيحاً.';
  return '';
}

export function engineerErrorMessage(err) {
  if (err?.status === 409) {
    // the backend has no error codes here, so we look at its text (never show it)
    if (/email/i.test(err.message)) return 'هذا البريد الإلكتروني مستخدم في حساب آخر.';
    if (/syndicate/i.test(err.message)) return 'يوجد مهندس في مكتبكم بنفس رقم النقابة.';
    return 'تغيّرت حالة المهندس. حدّثنا القائمة، حاول من جديد.';
  }
  if (err?.status === 404) return 'هذا المهندس غير موجود في مكتبكم.';
  return portalErrorMessage(err);
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
