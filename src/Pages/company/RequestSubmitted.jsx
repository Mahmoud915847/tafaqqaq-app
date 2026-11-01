import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { api } from '../../api/client';

const STATUS_LABELS = {
  Pending: 'قيد المراجعة',
  InfoRequested: 'مطلوب معلومات إضافية',
  Approved: 'تمت الموافقة',
  Rejected: 'مرفوض',
};
const STATUS_COLORS = {
  Pending: { bg: '#fef3c7', color: '#b45309' },
  InfoRequested: { bg: '#fef3c7', color: '#b45309' },
  Approved: { bg: '#e6f9f0', color: '#15803d' },
  Rejected: { bg: '#fee2e2', color: '#b91c1c' },
};

const cardStyle = { backgroundColor: '#ffffff', borderRadius: '16px', width: '100%', maxWidth: '560px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0' };
const labelStyle = { display: 'block', fontSize: '12px', fontWeight: '600', color: '#0c232f', marginBottom: '6px' };
const inputStyle = { width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', direction: 'ltr', textAlign: 'right', backgroundColor: '#fff' };

export default function RequestSubmitted() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const referenceNo = state?.referenceNo;

  const [trackId, setTrackId] = useState(referenceNo ?? '');
  const [trackEmail, setTrackEmail] = useState(state?.email ?? '');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    if (!trackId.trim() || !trackEmail.trim()) {
      setError('أدخل رقم الطلب والبريد الإلكتروني.');
      return;
    }
    setLoading(true);
    try {
      const data = await api('/office-requests/track', {
        method: 'POST',
        body: { referenceNo: trackId.trim(), email: trackEmail.trim() },
      });
      setResult(data);
    } catch (err) {
      if (err.status === 0) setError('تعذّر الاتصال بالخادم. تأكد أن الـ Backend شغّال.');
      else if (err.status === 404) setError('لم نجد طلبًا بهذه البيانات. تأكد من رقم الطلب والبريد.');
      else setError('حدث خطأ غير متوقع. حاول مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const colors = result ? STATUS_COLORS[result.status] ?? STATUS_COLORS.Pending : null;
  // For these two statuses the message is the admin's note, so it is worth showing.
  const showMessage = result && (result.status === 'InfoRequested' || result.status === 'Rejected') && result.message;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#edf4f5', direction: 'rtl', fontFamily: 'var(--font-family)' }}>
      <Navbar />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 20px', gap: '24px' }}>
        {/* Confirmation card: only right after a submission */}
        {referenceNo && (
          <div style={{ ...cardStyle, padding: '40px 44px', textAlign: 'center' }}>
            <div style={{ width: '180px', height: '56px', backgroundColor: '#e6f9f0', borderRadius: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#15803d', fontSize: '28px', fontWeight: 'bold' }}>
              ✓
            </div>

            <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0c232f', marginBottom: '10px' }}>تم استلام طلبك</h1>

            <p style={{ color: '#64748b', fontSize: '13px', lineHeight: 1.6, maxWidth: '460px', margin: '0 auto 24px' }}>
              بنرسل لك إشعار على بريدك بنتيجة المراجعة: قبول، أو رفض مع السبب، أو طلب معلومات إضافية. احتفظ برقم الطلب لمتابعة حالته.
            </p>

            <div style={{ backgroundColor: '#e6f4f5', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px' }}>رقم الطلب</div>
              <div style={{ fontSize: '28px', fontWeight: '900', color: '#0d6e75', letterSpacing: '1px', fontFamily: 'monospace', marginBottom: '10px', direction: 'ltr' }}>
                {referenceNo}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                <span style={{ backgroundColor: '#fef3c7', color: '#b45309', fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '12px' }}>قيد المراجعة</span>
                <span style={{ backgroundColor: '#e6f9f0', color: '#15803d', fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '12px' }}>تم الإرسال</span>
              </div>
            </div>

            <button type="button" onClick={() => navigate('/')} style={{ width: '100%', backgroundColor: '#0d6e75', color: '#ffffff', padding: '12px', borderRadius: '8px', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>
              العودة للرئيسية
            </button>
          </div>
        )}

        {/* Tracking card */}
        <div style={{ ...cardStyle, padding: '28px 36px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0c232f', marginBottom: '16px', textAlign: 'center' }}>تتبّع طلبك</h2>

          {error && (
            <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', marginBottom: '14px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleTrack} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={labelStyle}>رقم الطلب</label>
                <input type="text" placeholder="REQ-2026-XXXX" value={trackId} onChange={(e) => setTrackId(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>البريد الإلكتروني</label>
                <input type="email" placeholder="office@email.com" value={trackEmail} onChange={(e) => setTrackEmail(e.target.value)} style={inputStyle} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '11px', borderRadius: '8px', border: '1.5px solid #0d6e75', backgroundColor: '#ffffff', color: '#0d6e75', fontWeight: '700', fontSize: '14px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'جارٍ التحقق...' : 'تحقق من الحالة'}
            </button>
          </form>

          {result && (
            <div style={{ marginTop: '18px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>{result.officeName}</div>
              <div style={{ fontFamily: 'monospace', fontWeight: '800', color: '#0d6e75', direction: 'ltr', marginBottom: '10px' }}>{result.referenceNo}</div>
              <span style={{ backgroundColor: colors.bg, color: colors.color, fontSize: '12px', fontWeight: '700', padding: '4px 12px', borderRadius: '12px' }}>
                {STATUS_LABELS[result.status] ?? result.status}
              </span>

              {result.status === 'Approved' && (
                <p style={{ fontSize: '12px', color: '#475569', marginTop: '12px', lineHeight: 1.6 }}>
                  تمت الموافقة على طلبك. تحقق من بريدك للحصول على رابط تعيين كلمة المرور.
                </p>
              )}
              {showMessage && (
                <p style={{ fontSize: '12px', color: '#475569', marginTop: '12px', lineHeight: 1.6 }}>{result.message}</p>
              )}
              {result.canReapply && (
                <div style={{ marginTop: '12px' }}>
                  <Link to="/register-company" style={{ color: '#0d6e75', fontWeight: '700', fontSize: '13px' }}>
                    تقديم طلب جديد
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}