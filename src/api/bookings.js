import { api } from './client';

// ---------- client bookings API ----------

// POST /client/bookings (Client only)
// body: { officeId, officePriceId, scheduledDate: 'yyyy-MM-dd', property: {...} }
// 201 -> { id, status, scheduledDate, initialPrice, officeName, propertyType, sizeBand, emailSent, message }
export function createBooking(body) {
  return api('/client/bookings', { method: 'POST', body });
}

// ---------- booking dates (Jordan calendar) ----------

export const MIN_DAYS_AHEAD = 1;   // same rules as the backend (ClientBookingsController)
export const MAX_DAYS_AHEAD = 60;
export const MAX_OPEN_BOOKINGS = 5;

const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Today's date in Amman as { y, m, d }, whatever the computer's own time zone is
function ammanToday() {
  const [y, m, d] = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Amman' })
    .format(new Date()).split('-').map(Number);
  return { y, m, d };
}

function toIso(date) {
  return date.toISOString().slice(0, 10);   // the Date is built in UTC, so this is the plain day
}

const arabicDay = new Intl.DateTimeFormat('ar-u-nu-latn', {
  weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC',
});

// "2026-11-29" -> "الأحد، 29 نوفمبر"
export function formatBookingDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  return arabicDay.format(new Date(Date.UTC(y, m - 1, d)));
}

// The days a client may choose: tomorrow ... +60 days, only on the office's open weekdays.
// workingHours: [{ weekday: 'Sunday', isClosed: false, ... }] from GET /offices/{id}
// Returns [{ value: '2026-11-29', label: 'الأحد، 29 نوفمبر' }]
export function bookableDates(workingHours) {
  const open = new Set((workingHours ?? []).filter((h) => !h.isClosed).map((h) => h.weekday));
  const { y, m, d } = ammanToday();
  const days = [];
  for (let i = MIN_DAYS_AHEAD; i <= MAX_DAYS_AHEAD; i++) {
    const date = new Date(Date.UTC(y, m - 1, d + i));
    if (open.has(WEEKDAY_NAMES[date.getUTCDay()])) {
      const value = toIso(date);
      days.push({ value, label: formatBookingDate(value) });
    }
  }
  return days;
}

// Short booking number to show the client: first 8 characters of the GUID
export function bookingNumber(id) {
  return id ? id.slice(0, 8).toUpperCase() : '';
}

// ---------- errors ----------

// Arabic message for every error POST /client/bookings can return
export function bookingErrorMessage(err) {
  switch (err?.code) {
    case 'PRICE_NOT_FOUND': return 'خيار السعر الذي اخترته لم يعد متاحاً. حدّثنا قائمة الأسعار، اختر من جديد.';
    case 'LOCATION_INCOMPLETE': return 'موقع العقار غير مكتمل. حدّد الموقع من جديد أو اتركه فارغاً.';
    case 'DATE_TOO_SOON': return 'اختر تاريخاً يبدأ من الغد.';
    case 'DATE_TOO_FAR': return `يمكنك الحجز حتى ${MAX_DAYS_AHEAD} يوماً من اليوم فقط.`;
    case 'OFFICE_CLOSED': return 'الشركة لا تعمل في هذا اليوم. حدّثنا أيام الدوام، اختر يوماً آخر.';
    case 'TOO_MANY_OPEN_BOOKINGS': return `لديك ${MAX_OPEN_BOOKINGS} طلبات مفتوحة. أكمل أحدها أو ألغه قبل طلب جديد.`;
    case 'DUPLICATE_BOOKING': return 'لديك طلب مفتوح مع هذه الشركة في نفس اليوم.';
    case 'FULLY_BOOKED': return 'الشركة محجوزة بالكامل في هذا اليوم. اختر يوماً آخر.';
    case 'SLOT_BUSY': return 'هناك حجوزات كثيرة على هذا اليوم الآن. حاول مرة أخرى بعد لحظات.';
    case 'ACCOUNT_NOT_ACTIVE': return 'حسابك غير مفعّل حالياً. يرجى التواصل مع الدعم.';
    default: break;
  }
  if (err?.status === 0) return err.message;
  if (err?.status === 404) return 'هذه الشركة لم تعد متاحة للحجز.';
  if (err?.status === 429) {
    const minutes = Math.max(1, Math.ceil((err.retryAfterSeconds ?? 60) / 60));
    return `أرسلت طلبات كثيرة، حاول مجدداً بعد ${minutes} دقيقة.`;
  }
  if (err?.status === 400) return 'تأكد من صحة بيانات العقار والموعد.';
  return 'تعذّر إرسال الطلب. حاول مرة أخرى.';
}