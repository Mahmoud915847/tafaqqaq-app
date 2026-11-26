import { formatPrice, propertyTypeLabel } from './offices';

// Audit log rows -> Arabic. Used by the office dashboard (and later the admin log).
// A row is { action, oldValue, newValue, createdAt (UTC) }.

// The backend writes prices as "Apartment (حتى 120 م²): 60 JOD"
function priceText(value) {
  const match = /^(\w+)(?: \((.*)\))?: ([\d.]+) JOD$/.exec(value ?? '');
  if (!match) return value ?? '';
  const [, type, band, price] = match;
  return `${propertyTypeLabel(type)}${band ? ` · ${band}` : ''} — ${formatPrice(Number(price))}`;
}

const SENTENCES = {
  OfficeApproved: () => 'اعتمد الأدمن حساب المكتب',
  // account requests: the value is "REQ-number: text" and there is no office yet
  OfficeRequestRejected: (r) => `رفض الأدمن طلب حساب ${r.newValue ?? ''}`,
  OfficeRequestInfoRequested: (r) => `طلب الأدمن معلومات إضافية للطلب ${r.newValue ?? ''}`,
  OfficeActivated: () => 'اكتمل ملف المكتب وصار ظاهراً للعملاء',
  OfficeBackToIncomplete: () => 'صار ملف المكتب غير مكتمل ولم يعد ظاهراً للعملاء',
  OfficeSuspended: (r) => `أوقف الأدمن المكتب${r.newValue ? `، السبب: ${r.newValue}` : ''}`,
  OfficeReactivated: () => 'أعاد الأدمن تفعيل المكتب',
  OfficeNameChanged: (r) => `تغيّر اسم المكتب من «${r.oldValue}» إلى «${r.newValue}»`,
  CapacityChanged: (r) => `تغيّرت السعة اليومية من ${r.oldValue} إلى ${r.newValue}`,
  PriceAdded: (r) => `أضيف سعر: ${priceText(r.newValue)}`,
  PriceChanged: (r) => `تغيّر سعر: ${priceText(r.oldValue)}، وصار ${priceText(r.newValue).split(' — ').pop()}`,
  PriceRemoved: (r) => `حُذف سعر: ${priceText(r.oldValue)}`,
  EngineerAdded: (r) => `أضيف المهندس ${r.newValue}`,
  EngineerDeactivated: (r) => `تعطّل حساب المهندس ${r.newValue}`,
  EngineerReactivated: (r) => `أعيد تفعيل حساب المهندس ${r.newValue}`,
};

// short names for the filter list
const LABELS = {
  OfficeApproved: 'اعتماد مكتب',
  OfficeRequestRejected: 'رفض طلب حساب',
  OfficeRequestInfoRequested: 'طلب معلومات إضافية',
  OfficeActivated: 'ظهور المكتب للعملاء',
  OfficeBackToIncomplete: 'ملف صار غير مكتمل',
  OfficeSuspended: 'إيقاف مكتب',
  OfficeReactivated: 'إعادة تفعيل مكتب',
  OfficeNameChanged: 'تغيير اسم المكتب',
  CapacityChanged: 'تغيير السعة اليومية',
  PriceAdded: 'إضافة سعر',
  PriceChanged: 'تغيير سعر',
  PriceRemoved: 'حذف سعر',
  EngineerAdded: 'إضافة مهندس',
  EngineerDeactivated: 'تعطيل مهندس',
  EngineerReactivated: 'إعادة تفعيل مهندس',
};

export function actionLabel(action) {
  return LABELS[action] ?? action;
}

// An action we don't know yet is shown by its code
export function activityText(row) {
  return SENTENCES[row.action]?.(row) ?? row.action;
}

const dateTime = new Intl.DateTimeFormat('ar-u-nu-latn', {
  day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Amman',
});

// The API sends UTC without a "Z"
export function formatActivityTime(createdAt) {
  if (!createdAt) return '';
  const iso = /Z|[+-]\d\d:\d\d$/.test(createdAt) ? createdAt : `${createdAt}Z`;
  return dateTime.format(new Date(iso));
}
