import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { api } from '../../api/client';

// Activation page for office managers and engineers.
// The link in their email is {FrontendBaseUrl}/set-password?token=... and is valid for 48 hours.

const AlertIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

// Same rule as the backend (TokenPasswordRequest): 8+ characters, at least one letter and one number
const PASSWORD_RULE = /^(?=.*[A-Za-z])(?=.*\d).{8,100}$/;

const pageStyle = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#edf4f5',
  direction: 'rtl',
  fontFamily: 'var(--font-family)'
};

const mainStyle = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '40px 20px'
};

const cardStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '20px',
  padding: '36px 36px 28px',
  width: '100%',
  maxWidth: '440px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
  border: '1px solid #e2e8f0',
  textAlign: 'center'
};

const labelStyle = {
  display: 'block',
  fontSize: '12px',
  fontWeight: '600',
  color: '#0c232f',
  marginBottom: '6px'
};

const inputStyle = {
  width: '100%',
  padding: '11px 14px',
  borderRadius: '8px',
  border: '1px solid #cbd5e1',
  fontSize: '13px',
  outline: 'none',
  backgroundColor: '#ffffff'
};

export default function SetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [linkInvalid, setLinkInvalid] = useState(!token); // no token in the URL = broken link

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!PASSWORD_RULE.test(password)) {
      setError('كلمة المرور يجب أن تكون 8 أحرف على الأقل، وتحتوي على حرف ورقم.');
      return;
    }
    if (password !== confirmPassword) {
      setError('كلمتا المرور غير متطابقتين.');
      return;
    }

    setLoading(true);
    try {
      await api('/auth/set-password', { method: 'POST', body: { token, password } });
      navigate('/login', {
        replace: true,
        state: { notice: 'تم حفظ كلمة المرور وتفعيل حسابك. سجّل دخولك الآن.' }
      });
    } catch (err) {
      if (err.status === 400 && !err.errors) setLinkInvalid(true); // invalid, expired or already used
      else if (err.status === 400) setError('كلمة المرور يجب أن تكون 8 أحرف على الأقل، وتحتوي على حرف ورقم.');
      else if (err.status === 403) setError('هذا الحساب موقوف. يرجى التواصل مع الدعم.');
      else if (err.status === 429) {
        const minutes = Math.max(1, Math.ceil((err.retryAfterSeconds ?? 60) / 60));
        setError(`حاولت كثيراً، حاول مجدداً بعد ${minutes} دقيقة.`);
      }
      else if (err.status === 0) setError(err.message);
      else setError('حدث خطأ غير متوقع.');
    } finally {
      setLoading(false);
    }
  };

  // Invalid, expired or already-used link
  if (linkInvalid) {
    return (
      <div style={pageStyle}>
        <Navbar />
        <main style={mainStyle}>
          <div style={cardStyle}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              backgroundColor: '#fef3c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <AlertIcon />
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#0c232f', marginBottom: '20px' }}>
              الرابط غير صالح أو منتهي
            </h1>
            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #f1f5f9',
              borderRadius: '8px',
              padding: '12px 14px',
              fontSize: '11.5px',
              color: '#64748b',
              lineHeight: 1.6,
              marginBottom: '18px',
              textAlign: 'right'
            }}>
              روابط تفعيل الحساب صالحة لمدة 48 ساعة وتعمل مرة واحدة فقط.
              <br />
              • المكاتب: اطلب رابطاً جديداً من إدارة تفقّد.
              <br />
              • المهندسون: اطلب رابطاً جديداً من مكتبك.
              <br />
              إذا كنت قد عيّنت كلمة المرور من قبل، سجّل دخولك مباشرة أو استخدم "نسيت كلمة المرور".
            </div>
            <button
              type="button"
              onClick={() => navigate('/login')}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: '#0d6e75',
                color: '#ffffff',
                fontSize: '15px',
                fontWeight: '700',
                cursor: 'pointer',
                marginBottom: '16px',
                border: 'none'
              }}
            >
              العودة لتسجيل الدخول
            </button>
            <div style={{ fontSize: '12.5px' }}>
              <Link to="/forgot-password" style={{ color: '#0d6e75', fontWeight: '600' }}>
                نسيت كلمة المرور؟
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <Navbar />

      <main style={mainStyle}>
        <div style={cardStyle}>
          {/* Badge */}
          <div style={{ marginBottom: '14px', textAlign: 'right' }}>
            <span style={{
              backgroundColor: '#e6f7f0',
              color: '#059669',
              fontSize: '11.5px',
              fontWeight: '700',
              padding: '5px 14px',
              borderRadius: '20px',
              display: 'inline-block'
            }}>
              الرابط صالح لمدة 48 ساعة
            </span>
          </div>

          {/* Heading */}
          <h1 style={{
            fontSize: '22px',
            fontWeight: '800',
            color: '#0c232f',
            marginBottom: '6px',
            textAlign: 'right'
          }}>
            تعيين كلمة المرور
          </h1>

          {/* Subtitle */}
          <p style={{
            color: '#64748b',
            fontSize: '13px',
            marginBottom: '22px',
            textAlign: 'right'
          }}>
            أهلاً بك، اختر كلمة مرور لحسابك في تفقّد. بعدها سجّل دخولك بها.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ textAlign: 'right' }}>
            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>كلمة المرور الجديدة</label>
              <input
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: '6px' }}>
              <label style={labelStyle}>تأكيد كلمة المرور</label>
              <input
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={inputStyle}
              />
            </div>

            {/* Helper text */}
            <p style={{
              fontSize: '11.5px',
              color: '#64748b',
              marginBottom: '18px'
            }}>
              8 أحرف على الأقل، وتحتوي على حرف ورقم.
            </p>

            {error && (
              <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', borderRadius: '8px', padding: '10px 12px', fontSize: '13px', marginBottom: '14px' }}>
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: '#0d6e75',
                color: '#ffffff',
                fontSize: '15px',
                fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                border: 'none',
                transition: 'background-color 0.15s'
              }}
            >
              {loading ? 'جارٍ الحفظ…' : 'حفظ كلمة المرور'}
            </button>
          </form>

          {/* Bottom Note */}
          <p style={{
            fontSize: '11.5px',
            color: '#64748b',
            textAlign: 'right',
            marginTop: '16px',
            lineHeight: 1.6
          }}>
            الرابط منتهي أو ما اشتغل؟ اطلب رابطاً جديداً من مكتبك أو من إدارة تفقّد.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}