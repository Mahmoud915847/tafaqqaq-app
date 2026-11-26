import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { forgotPassword, authErrorMessage } from '../../api/auth';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const cleanEmail = email.trim();
    setLoading(true);
    try {
      await forgotPassword(cleanEmail);
      navigate('/forgot-password-sent', { state: { email: cleanEmail } });
    } catch (err) {
      setError(err.status === 400 ? 'أدخل بريداً إلكترونياً صحيحاً.' : authErrorMessage(err));
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
          {/* Heading */}
          <h1 style={{
            fontSize: '22px',
            fontWeight: '800',
            color: '#0c232f',
            marginBottom: '10px'
          }}>
            نسيت كلمة المرور؟
          </h1>

          {/* Subtitle */}
          <p style={{
            color: '#64748b',
            fontSize: '13px',
            lineHeight: 1.6,
            marginBottom: '24px'
          }}>
            اكتب بريدك الإلكتروني المسجل، وسنرسل لك رابط لإعادة تعيين كلمة المرور.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ textAlign: 'right' }}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '600',
                color: '#0c232f',
                marginBottom: '6px'
              }}>
                البريد الإلكتروني
              </label>
              <input
                type="email"
                placeholder="name@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13px',
                  outline: 'none',
                  backgroundColor: '#ffffff',
                  direction: 'ltr',
                  textAlign: 'right'
                }}
              />
            </div>

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
                marginTop: '4px',
                transition: 'background-color 0.15s'
              }}
            >
              {loading ? 'جارٍ الإرسال…' : 'أرسل رابط الاستعادة'}
            </button>
          </form>

          {/* Back to Login Link */}
          <div style={{ marginTop: '18px', fontSize: '12.5px' }}>
            <Link to="/login" style={{ color: '#0d6e75', fontWeight: '600' }}>
              تذكرت كلمة المرور؟ سجل دخولك
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
