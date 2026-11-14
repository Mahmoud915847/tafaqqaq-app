import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/forgot-password-sent', {
      state: { email: email.trim() || 'client@email.com' }
    });
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

            {/* Submit Button */}
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: '#0d6e75',
                color: '#ffffff',
                fontSize: '15px',
                fontWeight: '700',
                cursor: 'pointer',
                border: 'none',
                marginTop: '4px',
                transition: 'background-color 0.15s'
              }}
            >
              أرسل رابط الاستعادة
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
