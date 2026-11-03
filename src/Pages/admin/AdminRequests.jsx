import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';
import { api, getUser } from '../../api/client';

const TABS = [
  { key: 'Pending', label: 'قيد المراجعة' },
  { key: 'InfoRequested', label: 'معلومات مطلوبة' },
  { key: 'Approved', label: 'مقبولة' },
  { key: 'Rejected', label: 'مرفوضة' },
];

const BADGES = {
  Pending: { text: 'قيد المراجعة', style: { backgroundColor: '#fffbeb', color: '#d97706', border: '1px solid #fde68a' } },
  InfoRequested: { text: 'معلومات مطلوبة', style: { backgroundColor: '#e0f2fe', color: '#0369a1', border: '1px solid #bae6fd' } },
  Approved: { text: 'مقبولة', style: { backgroundColor: '#e6f7f0', color: '#059669', border: '1px solid #a7f3d0' } },
  Rejected: { text: 'مرفوضة', style: { backgroundColor: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca' } },
};

const cellStyle = { padding: '16px 20px', color: '#475569' };

export default function AdminRequests() {
  const navigate = useNavigate();
  const user = getUser();
  const [activeTab, setActiveTab] = useState('Pending');
  const [items, setItems] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');

    api(`/admin/office-requests?status=${activeTab}&pageSize=100`)
      .then((data) => {
        if (cancelled) return;
        setItems(data.items ?? []);
        setCounts(data.counts ?? {});
      })
      .catch((err) => {
        if (cancelled) return;
        if (err.status === 401) navigate('/login', { replace: true });
        else if (err.status === 0) setError('تعذّر الاتصال بالخادم. تأكد أن الـ Backend شغّال.');
        else setError('تعذّر تحميل الطلبات. حاول مرة أخرى.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeTab, navigate]);

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
              <h1 style={{ fontSize: '30px', fontWeight: '800', color: '#0f172a', margin: '0 0 8px' }}>طلبات إنشاء حسابات المكاتب</h1>
              <p style={{ color: '#64748b', fontSize: '15px', margin: 0 }}>
                راجع الطلبات الواردة من الصفحة العامة، وأنشئ حساب المكتب عند الموافقة.
              </p>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: '1px solid',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    backgroundColor: activeTab === tab.key ? '#e6f0f1' : '#ffffff',
                    color: activeTab === tab.key ? '#104f55' : '#475569',
                    borderColor: activeTab === tab.key ? '#104f55' : '#cbd5e1',
                  }}
                >
                  {tab.label} ({counts[tab.key] ?? 0})
                </button>
              ))}
            </div>

            {error && (
              <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', marginBottom: '16px' }}>
                {error}
              </div>
            )}

            <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                    <th style={{ padding: '16px 20px', fontWeight: '600' }}>رقم الطلب</th>
                    <th style={{ padding: '16px 20px', fontWeight: '600' }}>المكتب</th>
                    <th style={{ padding: '16px 20px', fontWeight: '600' }}>المدينة</th>
                    <th style={{ padding: '16px 20px', fontWeight: '600' }}>رقم الترخيص</th>
                    <th style={{ padding: '16px 20px', fontWeight: '600' }}>التاريخ</th>
                    <th style={{ padding: '16px 20px', fontWeight: '600' }}>الحالة</th>
                    <th style={{ padding: '16px 20px', fontWeight: '600', textAlign: 'center' }}>إجراء</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr><td colSpan={7} style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>جارٍ التحميل...</td></tr>
                  )}
                  {!loading && !error && items.length === 0 && (
                    <tr><td colSpan={7} style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>لا توجد طلبات في هذه الحالة.</td></tr>
                  )}
                  {!loading && items.map((req) => {
                    const badge = BADGES[req.status] ?? BADGES.Pending;
                    const needsReview = req.status === 'Pending' || req.status === 'InfoRequested';
                    return (
                      <tr key={req.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ ...cellStyle, fontWeight: '600', color: '#1e293b', fontFamily: 'monospace' }}>{req.referenceNo}</td>
                        <td style={{ ...cellStyle, fontWeight: '700', color: '#0f172a' }}>
                          {req.officeName}
                          {req.isReapplication && (
                            <span style={{ marginRight: '8px', backgroundColor: '#f1f5f9', color: '#475569', fontSize: '11px', padding: '2px 8px', borderRadius: '10px' }}>
                              طلب مُعاد
                            </span>
                          )}
                        </td>
                        <td style={cellStyle}>{req.city}</td>
                        <td style={cellStyle}>{req.licenseNo}</td>
                        <td style={cellStyle}>{new Date(req.submittedAt).toLocaleDateString('en-GB')}</td>
                        <td style={{ padding: '16px 20px' }}>
                          <span style={{ padding: '4px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: '700', ...badge.style }}>{badge.text}</span>
                        </td>
                        <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                          <Link
                            to={`/admin/request/${req.id}`}
                            style={{
                              backgroundColor: needsReview ? '#104f55' : '#ffffff',
                              color: needsReview ? '#ffffff' : '#104f55',
                              border: '1.5px solid #104f55',
                              padding: '7px 18px',
                              borderRadius: '8px',
                              fontSize: '13px',
                              fontWeight: '700',
                              textDecoration: 'none',
                              display: 'inline-block',
                            }}
                          >
                            {needsReview ? 'مراجعة' : 'عرض'}
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>

        <AdminSidebar />
      </div>
    </div>
  );
}