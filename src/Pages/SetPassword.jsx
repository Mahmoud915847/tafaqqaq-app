import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { api } from '../api/client';

const labelStyle = { display: 'block', fontSize: '13px', fontWeight: '700', color: '#1e293b', marginBottom: '6px' };
const inputStyle = { width: '100%', padding: '13px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', backgroundColor: '#fff' };

export default function SetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // After success, go to the login page
  useEffect(() => {
    if (!isSuccess) return;
    const t = setTimeout(() => navigate('/login', { replace: true }), 2000);
    return () => clearTimeout(t);
  }, [isSuccess, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password))
      return setError('كلمة المرور يجب أن تكون 8 أحرف على الأقل وتحتوي على حرف ورقم.');
    if (password !== confirmPassword) return setError('كلمتا المرور غير متطابقتين.');

    setLoading(true);
    try {
      await api('/auth/set-password', { method: 'POST', body: { token, password } });
      setIsSuccess(true);
    } catch (err) {
      if (err.status === 0) setError('تعذّر الاتصال بالخادم. تأكد أن الـ Backend شغّال.');
      else if (err.status === 400) setError('الرابط غير صالح أو منتهي الصلاحية. اطلب رابطًا جديدًا من الأدمن أو من مكتبك.');
      else setError('حدث خطأ غير متوقع. حاول مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const cardStyle = {
    backgroundColor: '#ffffff', borderRadius: '24px', padding: '44px 48px', width: '100%', maxWidth: '520px',
    boxShadow: '0 8px 30px rgba(16, 79, 85, 0.06)', border: '1px solid #e2e8f0', textAlign: 'center',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#eaf3f5', direction: 'rtl', fontFamily: 'var(--font-family)' }}>
      <Navbar />

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 20px' }}>
        <div style={cardStyle}>
          {!token ? (
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0f3d46', marginBottom: '10px' }}>الرابط غير صالح</h1>
              <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.6, marginBottom: '20px' }}>
                افتح الرابط من الرسالة التي وصلتك على بريدك الإلكتروني، أو اطلب رابطًا جديدًا من الأدمن أو من مكتبك.
              </p>
              <Link to="/login" style={{ color: '#0d6e75', fontWeight: '700' }}>الذهاب إلى تسجيل الدخول</Link>
            </div>
          ) : isSuccess ? (
            <div style={{ padding: '24px 10px' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#e6f7f0', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', margin: '0 auto 16px' }}>✓</div>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>تم تعيين كلمة المرور بنجاح!</h2>
              <p style={{ color: '#64748b', fontSize: '14px' }}>جاري تحويلك إلى صفحة تسجيل الدخول...</p>
            </div>
          ) : (
            <>
              <div style={{ display: 'inline-block', marginBottom: '20px' }}>
                <span style={{ backgroundColor: '#e6f7f0', color: '#059669', fontSize: '12px', fontWeight: '700', padding: '6px 16px', borderRadius: '20px' }}>
                  الرابط صالح لمدة 48 ساعة
                </span>
              </div>

              <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0f3d46', marginBottom: '8px' }}>تعيين كلمة المرور</h1>
              <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.6, maxWidth: '420px', margin: '0 auto 28px' }}>
                أهلاً بك، اختار كلمة مرور لحسابك في تفقّد، وبعدها سجّل دخولك.
              </p>

              {error && (
                <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', marginBottom: '16px', textAlign: 'right' }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'right' }}>
                <div>
                  <label style={labelStyle}>كلمة المرور الجديدة</label>
                  <input type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>تأكيد كلمة المرور</label>
                  <input type="password" required placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={inputStyle} />
                </div>

                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '-6px' }}>8 أحرف على الأقل، وتحتوي على حرف ورقم.</div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{ width: '100%', padding: '14px', borderRadius: '10px', backgroundColor: '#104f55', color: '#ffffff', fontSize: '15px', fontWeight: '700', marginTop: '8px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, boxShadow: '0 4px 12px rgba(16, 79, 85, 0.2)' }}
                >
                  {loading ? 'جارٍ الحفظ...' : 'حفظ كلمة المرور'}
                </button>

                <p style={{ textAlign: 'center', fontSize: '12px', color: '#64748b', margin: '12px 0 0', lineHeight: 1.5 }}>
                  الرابط منتهي أو ما اشتغل؟ اطلب رابط جديد من مكتبك أو من الأدمن.
                </p>
              </form>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}