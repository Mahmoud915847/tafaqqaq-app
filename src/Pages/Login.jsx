import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { api, saveSession } from '../api/client';

const HOME_BY_ROLE = {
  Admin: '/admin/requests',
  Office: '/company/dashboard',
  Engineer: '/engineer/inspections',
  Client: '/bookings',
};

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api('/auth/login', {
        method: 'POST',
        body: { email: email.trim(), password },
      });
      saveSession(data.token, data.user);
      navigate(HOME_BY_ROLE[data.user.role] ?? '/', { replace: true });
    } catch (err) {
      if (err.status === 401) setError('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
      else if (err.code === 'EMAIL_NOT_VERIFIED') setError('لم يتم تأكيد بريدك بعد. أدخل رمز التحقق الذي وصلك.');
      else if (err.code === 'NOT_ACTIVATED') setError('لم يتم تفعيل هذا الحساب بعد. استخدم الرابط المرسل إلى بريدك.');
      else if (err.status === 403) setError('هذا الحساب موقوف. يرجى التواصل مع الدعم.');
      else setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
        padding: '48px 20px'
      }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '36px 40px',
          width: '100%',
          maxWidth: '460px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
          border: '1px solid #e2e8f0',
          
        }}>
          {/* Header matching 05 Login.png */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h1 style={{
              fontSize: '28px',
              fontWeight: '800',
              color: '#0c232f',
              marginBottom: '6px'
            }}>
              أهلاً فيك
            </h1>
            <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>
        
              سجّل دخولك لمتابعة حجوزاتك
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* البريد الإلكتروني */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#0c232f', marginBottom: '6px' }}>
                البريد الإلكتروني
              </label>
              <input
                type="email"
                required
                placeholder="name@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13px',
                  outline: 'none',
                  direction: 'ltr',
                  textAlign: 'right',
                  backgroundColor: '#fff'
                }}
              />
            </div>

            {/* كلمة المرور */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#0c232f', marginBottom: '6px' }}>
                كلمة المرور
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13px',
                  outline: 'none',
                  backgroundColor: '#fff'
                }}
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>

              <button
                type="button"
                onClick={() => alert('تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني.')}
                style={{ color: '#0d6e75', fontWeight: '600', fontSize: '12px', cursor: 'pointer' }}
              >
                نسيت كلمة المرور؟
              </button>
            </div>

            {error && (
              <div
                role="alert"
                style={{
                  backgroundColor: '#fdecea',
                  color: '#b42318',
                  border: '1px solid #f5c2c0',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  fontSize: '12px',
                }}
              >
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
                fontSize: '14px',
                fontWeight: '700',
                marginTop: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'جارٍ الدخول...' : 'دخول'}
            </button>

            {/* Register Link */}
            <div style={{ textAlign: 'center', fontSize: '13px', color: '#64748b' }}>
              ما عندك حساب؟{' '}
              <Link to="/register" style={{ color: '#0d6e75', fontWeight: '700', textDecoration: 'none' }}>
                إنشاء حساب
              </Link>
            </div>

            {/* Office Account CTA Box matching 05 Login.png */}
            <div style={{
              backgroundColor: '#e6f4f5',
              borderRadius: '10px',
              padding: '16px 18px',
              marginTop: '4px'
            }}>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#0c232f', marginBottom: '4px' }}>
                عندك مكتب هندسي؟
              </div>
              <p style={{ fontSize: '12px', color: '#475569', margin: '0 0 8px', lineHeight: 1.5 }}>
                حسابات المكاتب ينشئها الأدمن، قدّم طلب وبنراجعه.
              </p>
              <Link
                to="/register-company"
                style={{
                  color: '#0d6e75',
                  fontSize: '12px',
                  fontWeight: '700',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span>اطلب حساب مكتب</span>
                <span>←</span>
              </Link>
            </div>

            {/* Demo Shortcuts matching 05 Login.png */}
            <div style={{
              paddingTop: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              fontSize: '12px',
              color: '#64748b'
            }}>
              <span>عرض تجريبي لدخول:</span>
              <Link to="/company/dashboard" style={{ color: '#0d6e75', fontWeight: '700' }}>
                مكتب
              </Link>
              <span>·</span>
              <Link to="/engineer/inspections" style={{ color: '#0d6e75', fontWeight: '700' }}>
                مهندس
              </Link>
              <span>·</span>
              <Link to="/admin/requests" style={{ color: '#0d6e75', fontWeight: '700' }}>
                أدمن
              </Link>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
