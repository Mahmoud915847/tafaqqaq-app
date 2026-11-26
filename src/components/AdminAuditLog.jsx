import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { listAuditLogs, listAuditActions, adminErrorMessage } from '../api/admin';
import { activityText, actionLabel, formatActivityTime } from '../api/activity';

// "سجل التغييرات" on the admin offices page (GET /admin/audit-logs + /actions)

const PAGE_SIZE = 20;
const NO_FILTERS = { action: '', search: '', from: '', to: '' };

const labelStyle = { display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', fontWeight: '600', color: '#64748b' };
const inputStyle = { padding: '8px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', backgroundColor: '#fff' };
const smallButton = { border: '1.5px solid var(--primary)', color: 'var(--primary)', backgroundColor: '#fff', borderRadius: '8px', padding: '8px 16px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' };

// refreshKey changes when the page does something that adds a log row
export default function AdminAuditLog({ refreshKey }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [draft, setDraft] = useState(NO_FILTERS);        // what is typed
  const [filters, setFilters] = useState(NO_FILTERS);    // what is applied
  const [page, setPage] = useState(1);
  const [reload, setReload] = useState(0);
  const [formError, setFormError] = useState('');
  const [actions, setActions] = useState([]);
  const [result, setResult] = useState({ key: null, data: null, error: null });

  const requestKey = JSON.stringify([filters, page, reload, refreshKey]);
  const loading = result.key !== requestKey;
  const data = loading ? null : result.data;
  const loadError = loading ? null : result.error;

  useEffect(() => {
    let ignore = false;
    listAuditLogs({ ...filters, page, pageSize: PAGE_SIZE })
      .then((response) => { if (!ignore) setResult({ key: requestKey, data: response, error: null }); })
      .catch((err) => {
        if (ignore) return;
        if (err.status === 401) navigate('/login', { replace: true, state: { from: location.pathname } });
        else setResult({ key: requestKey, data: null, error: err });
      });
    return () => { ignore = true; };
  }, [filters, page, requestKey, navigate, location.pathname]);

  // the choices of the action filter (the log itself still works if this fails)
  useEffect(() => {
    let ignore = false;
    listAuditActions()
      .then((list) => { if (!ignore) setActions(list); })
      .catch(() => {});
    return () => { ignore = true; };
  }, [reload, refreshKey]);

  const set = (field) => (e) => {
    const { value } = e.target;
    setFormError('');
    setDraft((d) => ({ ...d, [field]: value }));
  };

  const apply = (e) => {
    e.preventDefault();
    if (draft.from && draft.to && draft.from > draft.to) {
      setFormError('تاريخ البداية يجب أن يسبق تاريخ النهاية.');
      return;
    }
    setFilters({ ...draft, search: draft.search.trim() });
    setPage(1);
  };

  const clear = () => {
    setDraft(NO_FILTERS);
    setFilters(NO_FILTERS);
    setFormError('');
    setPage(1);
  };

  const pages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1;

  return (
    <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', padding: '28px 32px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
      <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', marginBottom: '20px' }}>
        سجل التغييرات
      </h2>

      <form onSubmit={apply} aria-label="تصفية السجل" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: '12px' }}>
        <label style={labelStyle}>
          نوع العملية
          <select name="action" value={draft.action} onChange={set('action')} style={inputStyle}>
            <option value="">كل العمليات</option>
            {actions.map((a) => <option key={a} value={a}>{actionLabel(a)}</option>)}
          </select>
        </label>
        <label style={labelStyle}>
          بحث في التفاصيل
          <input name="search" type="search" value={draft.search} onChange={set('search')} style={inputStyle} />
        </label>
        <label style={labelStyle}>
          من تاريخ
          <input name="from" type="date" value={draft.from} onChange={set('from')} style={inputStyle} />
        </label>
        <label style={labelStyle}>
          إلى تاريخ
          <input name="to" type="date" value={draft.to} onChange={set('to')} style={inputStyle} />
        </label>
        <button type="submit" style={{ ...smallButton, backgroundColor: 'var(--primary)', color: '#fff' }}>تطبيق</button>
        <button type="button" onClick={clear} style={smallButton}>مسح</button>
      </form>

      {formError && <div role="alert" style={{ color: '#b91c1c', fontSize: '13px', marginBottom: '8px' }}>{formError}</div>}
      {loading && <p style={{ fontSize: '13px', color: '#64748b', padding: '12px 0' }}>جارٍ تحميل السجل…</p>}

      {loadError && (
        <div role="alert" style={{ fontSize: '13px', color: '#b91c1c', padding: '12px 0' }}>
          <p style={{ marginBottom: '10px' }}>{adminErrorMessage(loadError)}</p>
          <button type="button" onClick={() => setReload((n) => n + 1)} style={smallButton}>إعادة المحاولة</button>
        </div>
      )}

      {data && data.items.length === 0 && (
        <p style={{ fontSize: '13px', color: '#64748b', padding: '12px 0' }}>لا توجد عمليات مطابقة.</p>
      )}

      {data && data.items.map((row, index) => (
        <div key={row.id} data-testid="audit-row"
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', padding: '14px 0', borderTop: index > 0 ? '1px solid #f1f5f9' : 'none', fontSize: '14px' }}>
          <div style={{ minWidth: 0, overflowWrap: 'anywhere' }}>
            <div style={{ color: '#1e293b', fontWeight: '500' }}>
              {row.officeName && <strong>{row.officeName}: </strong>}
              {activityText(row)}
            </div>
            {row.actorEmail && <div style={{ fontSize: '12px', color: '#94a3b8' }}>بواسطة <span dir="ltr">{row.actorEmail}</span></div>}
          </div>
          <span style={{ color: '#94a3b8', fontSize: '13px', whiteSpace: 'nowrap' }}>{formatActivityTime(row.createdAt)}</span>
        </div>
      ))}

      {data && data.total > PAGE_SIZE && (
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', alignItems: 'center', marginTop: '16px', fontSize: '13px', color: '#64748b' }}>
          <button type="button" disabled={page <= 1} onClick={() => setPage(page - 1)} style={{ ...smallButton, opacity: page <= 1 ? 0.4 : 1 }}>السابق</button>
          <span>صفحة {page} من {pages}</span>
          <button type="button" disabled={page >= pages} onClick={() => setPage(page + 1)} style={{ ...smallButton, opacity: page >= pages ? 0.4 : 1 }}>التالي</button>
        </div>
      )}
    </div>
  );
}
