import { api } from './client';

// ---------- public offices API (no login needed) ----------

// GET /offices -> { total, page, pageSize, cities: [], items: [...] }
// filters: { city, propertyType, maxPrice, minRating, search, sort: 'rating'|'price'|'newest', page, pageSize }
// Empty values ('' / null / undefined) are left out of the URL.
export function listOffices(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') params.append(key, value);
  });
  const query = params.toString();
  return api(`/offices${query ? `?${query}` : ''}`);
}

// GET /offices/{id} -> details with prices [{ id, propertyType, sizeBand, price }] and workingHours (from Saturday)
// A non-Active or unknown office returns 404.
export function getOffice(id) {
  return api(`/offices/${encodeURIComponent(id)}`);
}

// GET /offices/compare?ids=a,b,c -> { propertyTypes, offices, missingIds } (2 to 4 ids, else 400)
export function compareOffices(ids) {
  return api(`/offices/compare?ids=${ids.map(encodeURIComponent).join(',')}`);
}

// ---------- logo ----------

// The API returns logoUrl as "/api/offices/{id}/logo" (from the server root).
// VITE_API_URL already ends with /api, so we join it to the server origin instead,
// otherwise the address would become /api/api/...
const SERVER_ORIGIN = new URL(import.meta.env.VITE_API_URL).origin;

export function logoSrc(logoUrl) {
  if (!logoUrl) return null;                      // office has no logo: show a placeholder
  if (/^https?:\/\//i.test(logoUrl)) return logoUrl;
  return `${SERVER_ORIGIN}${logoUrl}`;
}

// ---------- labels (backend value <-> Arabic) ----------

export const PROPERTY_TYPES = [
  { value: 'Apartment', label: 'شقة' },
  { value: 'Villa', label: 'فيلا' },
  { value: 'Commercial', label: 'مكتب أو محل' },
  { value: 'Land', label: 'أرض' },
];

export function propertyTypeLabel(value) {
  return PROPERTY_TYPES.find((t) => t.value === value)?.label ?? value;
}

// Week order used by the public details response (starts on Saturday)
export const WEEKDAYS = [
  { value: 'Saturday', label: 'السبت' },
  { value: 'Sunday', label: 'الأحد' },
  { value: 'Monday', label: 'الاثنين' },
  { value: 'Tuesday', label: 'الثلاثاء' },
  { value: 'Wednesday', label: 'الأربعاء' },
  { value: 'Thursday', label: 'الخميس' },
  { value: 'Friday', label: 'الجمعة' },
];

export function weekdayLabel(value) {
  return WEEKDAYS.find((d) => d.value === value)?.label ?? value;
}

export const SORT_OPTIONS = [
  { value: 'rating', label: 'الأعلى تقييماً' },
  { value: 'price', label: 'الأقل سعراً' },
  { value: 'newest', label: 'الأحدث' },
];

// ---------- formatting ----------

// 60 -> "60 د.أ" ; null -> "—"
export function formatPrice(price) {
  if (price === null || price === undefined) return '—';
  return `${Number(price).toLocaleString('en-US', { maximumFractionDigits: 2 })} د.أ`;
}

// A price row as the client sees it: "شقة · حتى 120 م² — 60 د.أ"
export function priceRowLabel(row) {
  const type = propertyTypeLabel(row.propertyType);
  const band = row.sizeBand ? ` · ${row.sizeBand}` : '';
  return `${type}${band} — ${formatPrice(row.price)}`;
}

// "09:00" -> "9:00 ص" ; "15:00" -> "3:00 م"
export function formatTime(hhmm) {
  if (!hhmm) return '';
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h < 12 ? 'ص' : 'م';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${suffix}`;
}

// memberSince is UTC from the API -> "عضو منذ 2026" style year in Amman time
export function memberSinceYear(memberSince) {
  if (!memberSince) return null;
  const iso = /Z|[+-]\d\d:\d\d$/.test(memberSince) ? memberSince : `${memberSince}Z`;
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', timeZone: 'Asia/Amman' }).format(new Date(iso));
}

// ---------- errors ----------

// One Arabic message for any failed office call
export function officeErrorMessage(err) {
  if (err?.status === 0) return err.message;                 // server unreachable (already Arabic)
  if (err?.status === 404) return 'هذا المكتب غير متاح حالياً.';
  if (err?.status === 429) {
    const minutes = Math.max(1, Math.ceil((err.retryAfterSeconds ?? 60) / 60));
    return `حاولت كثيراً، حاول مجدداً بعد ${minutes} دقيقة.`;
  }
  return 'تعذّر تحميل البيانات. حاول مرة أخرى.';
}