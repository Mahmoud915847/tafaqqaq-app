import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getOfficeDashboard, getOfficeActivity, portalErrorMessage } from '../../api/officePortal';
import { activityText, formatActivityTime } from '../../api/activity';

// GET /office/dashboard + GET /office/activity

// where each checklist item is completed
const FIX_PAGE = {
  ENGINEER: '/company/engineers',
  PRICE: '/company/prices',
  CAPACITY: '/company/schedule',
  HOURS: '/company/schedule',
};

const cardStyle = {
  backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0',
  padding: '20px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
};
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px', marginBottom: '20px' };
const cardLabel = { fontSize: '13px', color: '#64748b', fontWeight: '600', marginBottom: '10px' };
const cardNumber = { fontSize: '32px', fontWeight: '800', color: 'var(--primary)' };
const cardNote = { fontSize: '12px', color: '#64748b', marginTop: '4px' };
const sectionTitle = { fontSize: '18px', fontWeight: '800', color: '#0c232f', marginBottom: '16px' };

function StatCard({ label, value, note, to }) {
  const content = (
    <>
      <div style={cardLabel}>{label}</div>
      <div style={cardNumber}>{value}</div>
      {note && <div style={cardNote}>{note}</div>}
    </>
  );
  return to
    ? <Link to={to} style={{ ...cardStyle, display: 'block' }}>{content}</Link>
    : <div style={cardStyle}>{content}</div>;
}

// suspended / not visible yet (with what is missing) / visible
function StatusCard({ dashboard }) {
  if (dashboard.status === 'Suspended') {
    return (
      <div role="alert" style={{ ...cardStyle, backgroundColor: 'var(--danger-bg)', borderColor: 'var(--danger-border)', color: 'var(--danger-text)', fontWeight: '700', marginBottom: '20px' }}>
        مكتبكم موقوف حالياً ولا يظهر للعملاء. يرجى التواصل مع الدعم.
      </div>
    );
  }
  if (dashboard.isLive) {
    return (
      <div style={{ ...cardStyle, backgroundColor: 'var(--success-bg)', borderColor: 'var(--success-border)', color: 'var(--success-text)', fontWeight: '700', marginBottom: '20px' }}>
        ✓ مكتبكم ظاهر للعملاء ويستقبل طلبات الحجز.
      </div>
    );
  }
  const done = dashboard.checklist.filter((c) => c.done).length;
  return (
    <div style={{ ...cardStyle, backgroundColor: '#fffbeb', borderColor: '#fcd34d', marginBottom: '20px' }}>
      <h2 style={{ ...sectionTitle, marginBottom: '4px' }}>أكمل ملف مكتبك ({done} من {dashboard.checklist.length})</h2>
      <p style={{ fontSize: '13px', color: '#92400e', margin: '0 0 14px' }}>لن يظهر المكتب للعملاء قبل إكمال هذه الخطوات.</p>
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {dashboard.checklist.map((item) => (
          <li key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', fontSize: '14px' }}>
            <span style={{ color: item.done ? 'var(--success-text)' : '#0c232f', fontWeight: '600' }}>
              {item.done ? '✓' : '○'} {item.label}
            </span>
            {!item.done && FIX_PAGE[item.key] && (
              <Link to={FIX_PAGE[item.key]} style={{ backgroundColor: 'var(--primary)', color: '#fff', padding: '6px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: '700' }}>
                أكمل
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function CompanyDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [reloadKey, setReloadKey] = useState(0);
  const [result, setResult] = useState({ key: null, dashboard: null, activity: [], error: null });

  const loading = result.key !== reloadKey;
  const dashboard = loading ? null : result.dashboard;
  const loadError = loading ? null : result.error;

  useEffect(() => {
    let ignore = false;
    // the dashboard first: it also refreshes the office status, which can add an activity row
    getOfficeDashboard()
      .then(async (data) => {
        const activity = await getOfficeActivity();
        if (!ignore) setResult({ key: reloadKey, dashboard: data, activity, error: null });
      })
      .catch((err) => {
        if (ignore) return;
        // the session expired: log in again and come back here
        if (err.status === 401) navigate('/login', { replace: true, state: { from: location.pathname } });
        else setResult({ key: reloadKey, dashboard: null, activity: [], error: err });
      });
    return () => { ignore = true; };
  }, [reloadKey, navigate, location.pathname]);

  return (
    <div style={{ maxWidth: '1040px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#0c232f', margin: '0 0 6px' }}>
          {dashboard ? `أهلاً، ${dashboard.name}` : 'لوحة التحكم'}
        </h1>
        <p style={{ color: '#64748b', fontSize: '15px', margin: 0 }}>ملخص نشاط مكتبك</p>
      </div>

      {loading && <div style={cardStyle}>جارٍ تحميل لوحة التحكم…</div>}

      {loadError && (
        <div role="alert" style={{ ...cardStyle, color: '#b91c1c', fontSize: '14px' }}>
          <p style={{ margin: '0 0 12px' }}>{portalErrorMessage(loadError)}</p>
          <button type="button" onClick={() => setReloadKey((k) => k + 1)}
            style={{ color: 'var(--primary)', border: '1.5px solid var(--primary)', backgroundColor: '#fff', borderRadius: '8px', padding: '8px 18px', fontWeight: '700', cursor: 'pointer' }}>
            إعادة المحاولة
          </button>
        </div>
      )}

      {dashboard && (
        <>
          <StatusCard dashboard={dashboard} />

          {/* Booking numbers: the backend sends fixed zeros until bookings are built, so we don't show them as real */}
          <div style={gridStyle}>
            <StatCard label="طلبات جديدة" value="—" note="قريباً" />
            <StatCard label="قيد التنفيذ" value="—" note="قريباً" />
            <StatCard label="مكتملة هذا الشهر" value="—" note="قريباً" />
            <StatCard
              label="التقييم"
              value={dashboard.ratingCount > 0 ? `★ ${Number(dashboard.ratingAvg).toFixed(1)}` : '—'}
              note={dashboard.ratingCount > 0 ? `من ${dashboard.ratingCount} تقييم` : 'لا توجد تقييمات بعد'}
            />
          </div>

          <div style={gridStyle}>
            <StatCard
              to="/company/engineers"
              label="المهندسون المفعّلون"
              value={dashboard.engineers.active}
              note={`${dashboard.engineers.pendingActivation} بانتظار التفعيل · ${dashboard.engineers.deactivated} معطّل`}
            />
            <StatCard to="/company/prices" label="عدد الأسعار" value={dashboard.priceCount} />
            <StatCard to="/company/schedule" label="السعة اليومية" value={dashboard.dailyCapacity} note="فحص في اليوم" />
            <StatCard to="/company/schedule" label="أيام الدوام" value={dashboard.openDays} note="في الأسبوع" />
          </div>

          <div style={cardStyle}>
            <h2 style={sectionTitle}>آخر النشاطات</h2>
            {result.activity.length === 0 ? (
              <p style={{ fontSize: '13px', color: '#64748b' }}>لا توجد نشاطات بعد.</p>
            ) : (
              <ul style={{ listStyle: 'none' }}>
                {result.activity.map((row, index) => (
                  <li key={`${row.createdAt}-${index}`} data-testid="activity-row"
                    style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', padding: '12px 0', borderTop: index > 0 ? '1px solid #f1f5f9' : 'none' }}>
                    <span style={{ fontSize: '14px', color: '#0c232f' }}>{activityText(row)}</span>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>{formatActivityTime(row.createdAt)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
