import { api } from './client';

// ---------- admin: offices and audit log (Admin role only) ----------

// '' / null values are left out of the URL
function query(params) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') search.append(key, value);
  });
  const text = search.toString();
  return text ? `?${text}` : '';
}

// GET /admin/offices?status=&search=&page=&pageSize=
// -> { total, page, pageSize, statusCounts: { Active, Incomplete, Suspended }, items: [...] }
export function listAdminOffices(filters) {
  return api(`/admin/offices${query(filters)}`);
}

// POST /admin/offices/{id}/suspend { reason: 5-500 characters } -> { status, emailSent }
export function suspendOffice(id, reason) {
  return api(`/admin/offices/${encodeURIComponent(id)}/suspend`, { method: 'POST', body: { reason } });
}

// POST /admin/offices/{id}/reactivate -> { status: 'Active' | 'Incomplete', emailSent }
export function reactivateOffice(id) {
  return api(`/admin/offices/${encodeURIComponent(id)}/reactivate`, { method: 'POST' });
}

// GET /admin/audit-logs?action=&search=&from=yyyy-MM-dd&to=&page=&pageSize=
// -> { total, page, pageSize, items: [{ id, createdAt, action, oldValue, newValue, officeName, actorEmail }] }
export function listAuditLogs(filters) {
  return api(`/admin/audit-logs${query(filters)}`);
}

// GET /admin/audit-logs/actions -> ['PriceAdded', ...]
export function listAuditActions() {
  return api('/admin/audit-logs/actions');
}

export function adminErrorMessage(err) {
  if (err?.status === 0) return err.message;                 // server unreachable (already Arabic)
  if (err?.status === 400) return 'تأكد من صحة البيانات المدخلة.';
  if (err?.status === 403) return 'هذه الصفحة للأدمن فقط.';
  if (err?.status === 404) return 'هذا المكتب غير موجود. حدّثنا القائمة.';
  if (err?.status === 409) return 'تغيّرت حالة المكتب. حدّثنا القائمة، حاول من جديد.';
  if (err?.status === 429) {
    const minutes = Math.max(1, Math.ceil((err.retryAfterSeconds ?? 60) / 60));
    return `حاولت كثيراً، حاول مجدداً بعد ${minutes} دقيقة.`;
  }
  return 'حدث خطأ غير متوقع. حاول مرة أخرى.';
}
