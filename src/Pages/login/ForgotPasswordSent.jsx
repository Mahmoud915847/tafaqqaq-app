import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const MailIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7a939f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

export default function ForgotPasswordSent() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || 'client@email.com';

  const [timeLeft, setTimeLeft] = useState(60);

  // 1-minute countdown to 0
  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleResend = () => {
    if (timeLeft === 0) {
      setTimeLeft(60);
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
          {/* Icon */}
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            backgroundColor: '#e6eff2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <MailIcon />
          </div>

          {/* Heading */}
          <h1 style={{
            fontSize: '22px',
            fontWeight: '800',
            color: '#0c232f',
            marginBottom: '8px'
          }}>
            تحقق من بريدك الإلكتروني
          </h1>

          {/* Subtitle */}
          <p style={{
            color: '#64748b',
            fontSize: '13px',
            marginBottom: '20px'
          }}>
            أرسلنا رابط إعادة التعيين إلى{' '}
            <span style={{ fontWeight: '700', color: '#0c232f', direction: 'ltr', display: 'inline-block' }}>
              {email}
            </span>
          </p>

          {/* Return to Login Button */}
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
              marginBottom: '14px',
              border: 'none',
              transition: 'background-color 0.15s'
            }}
          >
            العودة لتسجيل الدخول
          </button>

          {/* Resend text with live countdown from 1 minute to 0 */}
          <p style={{
            fontSize: '12px',
            color: '#64748b',
            marginBottom: '16px'
          }}>
            لم يصلك الرابط؟{' '}
            {timeLeft > 0 ? (
              <span style={{ color: '#0d6e75', fontWeight: '700' }}>
                إعادة الإرسال بعد {formatTime(timeLeft)}
              </span>
            ) : (
              <span
                onClick={handleResend}
                style={{
                  color: '#0d6e75',
                  fontWeight: '700',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                إعادة الإرسال الآن
              </span>
            )}
          </p>

          {/* Notice Box */}
          <div style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #f1f5f9',
            borderRadius: '8px',
            padding: '12px 14px',
            fontSize: '11.5px',
            color: '#64748b',
            lineHeight: 1.6,
            marginBottom: '18px'
          }}>
            الرابط صالح لمدة ساعة واحدة ويعمل مرة واحدة فقط. إذا لم يصلك شيء، تأكد من البريد الذي كتبته أو تحقق من مجلد الرسائل غير المرغوب فيها.
          </div>

          {/* Bottom Link */}
          <div style={{ fontSize: '12.5px' }}>
            <Link to="/forgot-password" style={{ color: '#0d6e75', fontWeight: '600' }}>
              تعديل البريد الإلكتروني
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
