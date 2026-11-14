import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/login');
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
                transition: 'background-color 0.15s'
              }}
            >
              حفظ كلمة المرور
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
