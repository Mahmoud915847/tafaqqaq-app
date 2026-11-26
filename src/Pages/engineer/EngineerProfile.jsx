import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import OfficePage from '../../components/OfficePage';
import { getMe, authErrorMessage } from '../../api/auth';

// "إدارة الملف" for engineers. Read-only: the backend has no endpoint for an engineer to change
// their details (the office manager edits them), so only GET /auth/me is shown.

const cardStyle = {
  backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0',
  padding: '28px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
};
const labelStyle = { display: 'block', fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '6px' };
const inputStyle = {
  width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0',
  backgroundColor: '#f8fafc', fontSize: '14px', color: '#64748b'
};

export default function EngineerProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const [reloadKey, setReloadKey] = useState(0);
  const [result, setResult] = useState({ key: null, me: null, error: null });

  const loading = result.key !== reloadKey;
  const me = loading ? null : result.me;
  const loadError = loading ? null : result.error;

  useEffect(() => {
    let ignore = false;
    getMe()
      .then((data) => { if (!ignore) setResult({ key: reloadKey, me: data, error: null }); })
      .catch((err) => {
        if (ignore) return;
        // the session expired: log in again and come back here
        if (err.status === 401) navigate('/login', { replace: true, state: { from: location.pathname } });
        else setResult({ key: reloadKey, me: null, error: err });
      });
    return () => { ignore = true; };
  }, [reloadKey, navigate, location.pathname]);

  return (
    <OfficePage title="إدارة الملف">
      <div style={cardStyle}>
        <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', marginBottom: '20px' }}>البيانات الأساسية</h2>

        {loading && <p style={{ fontSize: '13px', color: '#64748b' }}>جارٍ تحميل بياناتك…</p>}

        {loadError && (
          <div role="alert" style={{ fontSize: '13px', color: '#b91c1c' }}>
            <p style={{ margin: '0 0 12px' }}>{authErrorMessage(loadError)}</p>
            <button type="button" onClick={() => setReloadKey((k) => k + 1)}
              style={{ color: 'var(--primary)', border: '1.5px solid var(--primary)', backgroundColor: '#fff', borderRadius: '8px', padding: '8px 18px', fontWeight: '700', cursor: 'pointer' }}>
              إعادة المحاولة
            </button>
          </div>
        )}

        {me && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
              <label>
                <span style={labelStyle}>الاسم الكامل</span>
                <input type="text" disabled value={me.fullName} style={inputStyle} />
              </label>
              <label>
                <span style={labelStyle}>البريد الإلكتروني</span>
                <input type="email" disabled value={me.email} style={{ ...inputStyle, direction: 'ltr', textAlign: 'right' }} />
              </label>
            </div>
            <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.7, margin: '0 0 16px' }}>
              بياناتك يعدّلها مدير المكتب. تواصل معه إذا احتجت تغيير شيء.
            </p>
            <Link to="/forgot-password" style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '14px' }}>
              تغيير كلمة المرور
            </Link>
          </>
        )}
      </div>
    </OfficePage>
  );
}
