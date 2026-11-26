import React, { useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { resetPassword, authErrorMessage } from '../../api/auth';

// The link in the email is {FrontendBaseUrl}/reset-password?token=... and is valid for 1 hour.

// Same rule as the backend (TokenPasswordRequest): 8+ characters, at least one letter and one number
const PASSWORD_RULE = /^(?=.*[A-Za-z])(?=.*\d).{8,100}$/;
const PASSWORD_MESSAGE = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل، وتحتوي على حرف ورقم.';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!PASSWORD_RULE.test(password)) {
      setError(PASSWORD_MESSAGE);
      return;
    }
    if (password !== confirmPassword) {
      setError('كلمتا المرور غير متطابقتين.');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, password);
      navigate('/login', {
        replace: true,
        state: { notice: 'تم تغيير كلمة المرور. سجّل دخولك بكلمة المرور الجديدة.' }
      });
    } catch (err) {
      // 400 without field errors = the link is invalid, expired or already used
      if (err.status === 400 && !err.errors) navigate('/reset-link-invalid', { replace: true });
      else if (err.status === 400) setError(PASSWORD_MESSAGE);
      else setError(authErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // no token in the URL = broken link
  if (!token) return <Navigate to="/reset-link-invalid" replace />;

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#edf4f5',
      direction: 'rtl',
      fontFamily: 'var(--font-family)'
    }}>
      <Navbar />

      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px'
      }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          padding: '36px 36px 28px',
          width: '100%',
          maxWidth: '440px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
          border: '1px solid #e2e8f0',
          textAlign: 'center'
        }}>
          {/* Badge */}
          <div style={{ marginBottom: '14px' }}>
            <span style={{
              backgroundColor: '#e6f7f0',
              color: '#059669',
              fontSize: '11.5px',
              fontWeight: '700',
              padding: '5px 14px',
              borderRadius: '20px',
              display: 'inline-block'
            }}>
              الرابط صالح لمدة ساعة واحدة
            </span>
          </div>

          {/* Heading */}
          <h1 style={{
            fontSize: '22px',
            fontWeight: '800',
            color: '#0c232f',
            marginBottom: '6px'
          }}>
            إعادة تعيين كلمة المرور
          </h1>

          {/* Subtitle */}
          <p style={{
            color: '#64748b',
            fontSize: '13px',
            marginBottom: '22px'
          }}>
            اختر كلمة مرور جديدة لحسابك في تفقّد وبعدها سجل دخولك بها.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ textAlign: 'right' }}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '600',
                color: '#0c232f',
                marginBottom: '6px'
              }}>
                كلمة المرور الجديدة
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13px',
                  outline: 'none',
                  backgroundColor: '#ffffff'
                }}
              />
            </div>

            <div style={{ marginBottom: '6px' }}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '600',
                color: '#0c232f',
                marginBottom: '6px'
              }}>
                تأكيد كلمة المرور
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13px',
                  outline: 'none',
                  backgroundColor: '#ffffff'
                }}
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
              <div role="alert" style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', borderRadius: '8px', padding: '10px 12px', fontSize: '12.5px', lineHeight: 1.6, marginBottom: '12px' }}>
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
            textAlign: 'center',
            marginTop: '16px',
            lineHeight: 1.6
          }}>
            الرابط منتهي أو ما اشتغل؟{' '}
            <Link to="/forgot-password" style={{ color: '#0d6e75', fontWeight: '600' }}>
              اطلب رابط جديد من صفحة "نسيت كلمة المرور"
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
