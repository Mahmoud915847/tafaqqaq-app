import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const MailIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7a939f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || 'client@email.com';

  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const inputRefs = useRef([]);

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

  const handleDigitChange = (index, value) => {
    const val = value.slice(-1);
    const newDigits = [...digits];
    newDigits[index] = val;
    setDigits(newDigits);

    if (val && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

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
            marginBottom: '22px'
          }}>
            أرسلنا رمزاً من 6 أرقام إلى{' '}
            <span style={{ fontWeight: '700', color: '#0c232f', direction: 'ltr', display: 'inline-block' }}>
              {email}
            </span>
          </p>

          <form onSubmit={handleSubmit}>
            {/* OTP Inputs */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '8px',
              direction: 'ltr',
              marginBottom: '20px'
            }}>
              {digits.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (inputRefs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  autoFocus={i === 0}
                  onFocus={() => setFocusedIndex(i)}
                  onChange={(e) => handleDigitChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  style={{
                    width: '46px',
                    height: '52px',
                    textAlign: 'center',
                    fontSize: '20px',
                    fontWeight: '700',
                    borderRadius: '8px',
                    border: focusedIndex === i ? '1.5px solid #0d6e75' : '1.5px solid #cbd5e1',
                    outline: 'none',
                    backgroundColor: '#ffffff',
                    transition: 'border-color 0.15s'
                  }}
                />
              ))}
            </div>

            {/* Confirm Button */}
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
                marginBottom: '14px',
                border: 'none',
                transition: 'background-color 0.15s'
              }}
            >
              تأكيد الرمز
            </button>
          </form>

          {/* Resend text with live countdown from 1 minute to 0 */}
          <p style={{
            fontSize: '12px',
            color: '#64748b',
            marginBottom: '16px'
          }}>
            لم يصلك الرمز؟{' '}
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
            marginBottom: '20px'
          }}>
            الرمز صالح لمدة 10 دقائق. بعد 5 محاولات خاطئة ستحتاج رمز جديد.
          </div>

          {/* Bottom Links */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '12.5px'
          }}>
            <Link to="/login" style={{ color: '#0d6e75', fontWeight: '600' }}>
              العودة لتسجيل الدخول
            </Link>
            <Link to="/register" style={{ color: '#0d6e75', fontWeight: '600' }}>
              تعديل البريد الإلكتروني
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
