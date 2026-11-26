import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../api/client';

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
    <div style={{ maxWidth: '1000px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#0c232f', margin: '0 0 8px' }}>طلبات إنشاء حسابات المكاتب</h1>
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
              backgroundColor: activeTab === tab.key ? 'var(--primary-light)' : '#ffffff',
              color: activeTab === tab.key ? 'var(--primary)' : '#475569',
              borderColor: activeTab === tab.key ? 'var(--primary)' : '#cbd5e1',
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
                        backgroundColor: needsReview ? 'var(--primary)' : '#ffffff',
                        color: needsReview ? '#ffffff' : 'var(--primary)',
                        border: '1.5px solid var(--primary)',
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
  );
}