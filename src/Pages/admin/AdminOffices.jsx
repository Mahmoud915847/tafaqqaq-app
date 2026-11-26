import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';
import AdminAuditLog from '../../components/AdminAuditLog';
import { getUser } from '../../api/client';
import { listAdminOffices, suspendOffice, reactivateOffice, adminErrorMessage } from '../../api/admin';

const PAGE_SIZE = 20;
const REASON_MIN = 5;     // same limits as the backend (SuspendOfficeRequest)
const REASON_MAX = 500;

const TABS = [
  { key: '', label: 'الكل' },
  { key: 'Active', label: 'نشطة' },
  { key: 'Incomplete', label: 'ملفه غير مكتمل' },
  { key: 'Suspended', label: 'موقوفة' },
];

const BADGES = {
  Active: { text: 'نشطة', style: { backgroundColor: '#e6f7f0', color: '#059669', border: '1px solid #a7f3d0' } },
  Incomplete: { text: 'ملفه غير مكتمل', style: { backgroundColor: '#fffbeb', color: '#d97706', border: '1px solid #fde68a' } },
  Suspended: { text: 'موقوفة', style: { backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' } },
};

const thStyle = { padding: '16px 20px', fontWeight: '600' };
const cellStyle = { padding: '16px 20px', color: '#475569' };
const actionStyle = { fontWeight: '700', fontSize: '13px', cursor: 'pointer', background: 'none', border: 'none' };
const outlineButton = { border: '1.5px solid #104f55', color: '#104f55', backgroundColor: '#fff', borderRadius: '8px', padding: '8px 16px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' };
const boxStyle = { borderRadius: '8px', padding: '10px 14px', fontSize: '13px', marginBottom: '16px' };

export default function AdminOffices() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();

  const [status, setStatus] = useState('');
  const [searchText, setSearchText] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [reload, setReload] = useState(0);
  const [result, setResult] = useState({ key: null, data: null, error: null });
  const [counts, setCounts] = useState(null);          // kept while a new tab loads

  const [suspending, setSuspending] = useState(null);  // the office being suspended
  const [reason, setReason] = useState('');
  const [reasonError, setReasonError] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState(null);          // { ok, text }
  const [changes, setChanges] = useState(0);           // refreshes the audit log

  const requestKey = JSON.stringify([status, search, page, reload]);
  const loading = result.key !== requestKey;
  const data = loading ? null : result.data;
  const loadError = loading ? null : result.error;

  useEffect(() => {
    let ignore = false;
    listAdminOffices({ status, search, page, pageSize: PAGE_SIZE })
      .then((response) => {
        if (ignore) return;
        setResult({ key: requestKey, data: response, error: null });
        setCounts(response.statusCounts);
      })
      .catch((err) => {
        if (ignore) return;
        // the session expired: log in again and come back here
        if (err.status === 401) navigate('/login', { replace: true, state: { from: location.pathname } });
        else setResult({ key: requestKey, data: null, error: err });
      });
    return () => { ignore = true; };
  }, [status, search, page, requestKey, navigate, location.pathname]);

  const countOf = (key) => {
    if (!counts) return null;
    return key ? counts[key] ?? 0 : Object.values(counts).reduce((sum, n) => sum + n, 0);
  };

  const chooseTab = (key) => {
    setStatus(key);
    setPage(1);
    setSuspending(null);
    setNotice(null);
  };

  const submitSearch = (e) => {
    e.preventDefault();
    setSearch(searchText.trim());
    setPage(1);
    setSuspending(null);
  };

  const openSuspend = (office) => {
    setSuspending(office);
    setReason('');
    setReasonError('');
    setNotice(null);
  };

  // after suspend / reactivate: new list, new counts, new log rows
  const refresh = () => {
    setReload((n) => n + 1);
    setChanges((n) => n + 1);
  };

  const fail = (err) => {
    if (err.status === 401) {
      navigate('/login', { replace: true, state: { from: location.pathname } });
      return;
    }
    setNotice({ ok: false, text: adminErrorMessage(err) });
    // what is on screen is out of date
    if (err.status === 409 || err.status === 404) {
      setSuspending(null);
      refresh();
    }
  };

  const emailNote = (sent) => (sent ? ' أرسلنا بريداً إلى مدير المكتب.' : ' تعذّر إرسال البريد إلى مدير المكتب.');

  const confirmSuspend = async (e) => {
    e.preventDefault();
    const text = reason.trim();
    if (text.length < REASON_MIN || text.length > REASON_MAX) {
      setReasonError(`اكتب سبب الإيقاف (من ${REASON_MIN} إلى ${REASON_MAX} حرف).`);
      return;
    }
    setBusy(true);
    setNotice(null);
    try {
      const response = await suspendOffice(suspending.id, text);
      setNotice({ ok: response.emailSent, text: `تم تعليق حساب ${suspending.name}.${emailNote(response.emailSent)}` });
      setSuspending(null);
      refresh();
    } catch (err) {
      fail(err);
    } finally {
      setBusy(false);
    }
  };

  const reactivate = async (office) => {
    setBusy(true);
    setNotice(null);
    setSuspending(null);
    try {
      const response = await reactivateOffice(office.id);
      const state = response.status === 'Active' ? 'وصار ظاهراً للعملاء' : 'لكن ملفه غير مكتمل فلا يظهر للعملاء بعد';
      setNotice({ ok: response.emailSent, text: `تمت إعادة تفعيل ${office.name}، ${state}.${emailNote(response.emailSent)}` });
      refresh();
    } catch (err) {
      fail(err);
    } finally {
      setBusy(false);
    }
  };

  const pages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', direction: 'rtl', fontFamily: 'var(--font-family)', display: 'flex', flexDirection: 'column' }}>
      {/* Top header */}
      <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '12px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link to="/" style={{ fontSize: '22px', fontWeight: '800', color: '#104f55', textDecoration: 'none' }}>تفقّد</Link>
          <span style={{ backgroundColor: '#e6f0f1', color: '#104f55', fontSize: '12px', fontWeight: '700', padding: '3px 10px', borderRadius: '16px' }}>
            حساب أدمن
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b' }}>{user?.fullName ?? 'الأدمن'}</span>
          <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#104f55', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '16px' }}>
            {(user?.fullName ?? 'د').charAt(0)}
          </div>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1 }}>
        <main style={{ flex: 1, padding: '40px 48px', overflowY: 'auto' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ marginBottom: '28px' }}>
              <h1 style={{ fontSize: '30px', fontWeight: '800', color: '#0f172a', margin: '0 0 8px' }}>
                المكاتب وسجل التغييرات
              </h1>
              <p style={{ color: '#64748b', fontSize: '15px', margin: 0 }}>
                إدارة حسابات المكاتب ومتابعة تغييرات الأسعار وأعداد المهندسين.
              </p>
            </div>

            {/* Tabs + search */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {TABS.map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    aria-pressed={status === tab.key}
                    onClick={() => chooseTab(tab.key)}
                    style={{
                      padding: '8px 16px', borderRadius: '20px', border: '1px solid', fontSize: '13px', fontWeight: '700', cursor: 'pointer',
                      backgroundColor: status === tab.key ? '#e6f0f1' : '#ffffff',
                      color: status === tab.key ? '#104f55' : '#475569',
                      borderColor: status === tab.key ? '#104f55' : '#cbd5e1',
                    }}
                  >
                    {tab.label}{countOf(tab.key) === null ? '' : ` (${countOf(tab.key)})`}
                  </button>
                ))}
              </div>
              <form onSubmit={submitSearch} role="search" style={{ display: 'flex', gap: '8px' }}>
                <input type="search" aria-label="بحث عن مكتب" placeholder="الاسم أو المدينة أو رقم الترخيص" value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ width: '240px', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }} />
                <button type="submit" style={outlineButton}>بحث</button>
              </form>
            </div>

            {notice && (
              <div role={notice.ok ? 'status' : 'alert'}
                style={{ ...boxStyle, ...(notice.ok ? { backgroundColor: '#e6f7f0', color: '#047857' } : { backgroundColor: '#fef3c7', color: '#b45309' }) }}>
                {notice.text}
              </div>
            )}

            {loadError && (
              <div role="alert" style={{ ...boxStyle, backgroundColor: '#fee2e2', color: '#b91c1c', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{adminErrorMessage(loadError)}</span>
                <button type="button" onClick={() => setReload((n) => n + 1)} style={outlineButton}>إعادة المحاولة</button>
              </div>
            )}

            {/* Suspend: the reason is required and emailed to the office */}
            {suspending && (
              <form onSubmit={confirmSuspend} aria-label="تعليق المكتب"
                style={{ backgroundColor: '#fff', border: '1.5px solid #fecaca', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a', marginBottom: '6px' }}>تعليق حساب {suspending.name}</h2>
                <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '10px' }}>
                  لن يظهر المكتب للعملاء حتى ترفع التعليق. السبب يُرسل إلى مدير المكتب ويُحفظ في السجل.
                </p>
                <textarea aria-label="سبب الإيقاف" rows={3} maxLength={REASON_MAX} value={reason}
                  onChange={(e) => { setReason(e.target.value); setReasonError(''); }}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', resize: 'vertical', fontFamily: 'inherit' }} />
                {reasonError && <div role="alert" style={{ color: '#b91c1c', fontSize: '13px', marginTop: '6px' }}>{reasonError}</div>}
                <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                  <button type="submit" disabled={busy}
                    style={{ backgroundColor: '#dc2626', color: '#fff', border: 'none', borderRadius: '8px', padding: '9px 20px', fontWeight: '700', fontSize: '13px', cursor: busy ? 'not-allowed' : 'pointer', opacity: busy ? 0.7 : 1 }}>
                    {busy ? 'جارٍ التعليق…' : 'تأكيد التعليق'}
                  </button>
                  <button type="button" onClick={() => setSuspending(null)} style={outlineButton}>إلغاء</button>
                </div>
              </form>
            )}

            {/* Offices Table Card */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', marginBottom: '36px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                    <th style={thStyle}>المكتب</th>
                    <th style={thStyle}>المدينة</th>
                    <th style={thStyle}>المهندسون</th>
                    <th style={thStyle}>الأسعار</th>
                    <th style={thStyle}>الحالة</th>
                    <th style={{ ...thStyle, textAlign: 'center' }}>إجراء</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr><td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>جارٍ التحميل…</td></tr>
                  )}
                  {data && data.items.length === 0 && (
                    <tr><td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>لا توجد مكاتب مطابقة.</td></tr>
                  )}
                  {data && data.items.map((office) => {
                    const badge = BADGES[office.status] ?? { text: office.status, style: {} };
                    return (
                      <tr key={office.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ fontWeight: '700', color: '#0f172a' }}>{office.name}</div>
                          <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                            ترخيص {office.licenseNo}{office.ownerEmail ? <> · <span dir="ltr">{office.ownerEmail}</span></> : null}
                          </div>
                        </td>
                        <td style={cellStyle}>{office.city}</td>
                        <td style={cellStyle}>{office.activeEngineers}</td>
                        <td style={cellStyle}>{office.priceCount}</td>
                        <td style={{ padding: '16px 20px' }}>
                          <span style={{ padding: '4px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: '700', whiteSpace: 'nowrap', ...badge.style }}>
                            {badge.text}
                          </span>
                        </td>
                        <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                          {office.status === 'Suspended' ? (
                            <button type="button" disabled={busy} onClick={() => reactivate(office)} style={{ ...actionStyle, color: '#104f55' }}>
                              إعادة التفعيل
                            </button>
                          ) : (
                            <button type="button" disabled={busy} onClick={() => openSuspend(office)} style={{ ...actionStyle, color: '#dc2626' }}>
                              تعليق الحساب
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {data && data.total > PAGE_SIZE && (
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', alignItems: 'center', padding: '14px', fontSize: '13px', color: '#64748b' }}>
                  <button type="button" disabled={page <= 1} onClick={() => setPage(page - 1)} style={{ ...outlineButton, opacity: page <= 1 ? 0.4 : 1 }}>السابق</button>
                  <span>صفحة {page} من {pages}</span>
                  <button type="button" disabled={page >= pages} onClick={() => setPage(page + 1)} style={{ ...outlineButton, opacity: page >= pages ? 0.4 : 1 }}>التالي</button>
                </div>
              )}
            </div>

            <AdminAuditLog refreshKey={changes} />
          </div>
        </main>

        {/* Sidebar */}
        <AdminSidebar />
      </div>
    </div>
  );
}
