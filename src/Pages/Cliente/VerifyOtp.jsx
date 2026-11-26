import React, { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { api, saveSession } from '../../api/client';
import { safeFrom } from '../../api/redirect';

const MailIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7a939f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const EMPTY = ['', '', '', '', '', ''];

// 429 from the rate limiter carries retryAfterSeconds; 429 from "5 wrong codes" does not.
function tooManyMessage(err) {
  if (err.retryAfterSeconds) {
    const minutes = Math.max(1, Math.ceil(err.retryAfterSeconds / 60));
    return `حاولت كثيراً، حاول مجدداً بعد ${minutes} دقيقة.`;
  }
  return 'تجاوزت عدد المحاولات الخاطئة. اطلب رمزاً جديداً.';
}

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email ?? '';
  const from = location.state?.from;  // the page the client wanted before login (e.g. the booking page)

  const [digits, setDigits] = useState(EMPTY);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); // the backend allows a new code every 60 seconds
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef([]);

  // 1-minute countdown to 0
  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  // Opened directly (no email from Register/Login): nothing to verify
  if (!email) return <Navigate to="/register" replace />;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const resetDigits = () => {
    setDigits(EMPTY);
    inputRefs.current[0]?.focus();
  };

  const handleResend = async () => {
    if (timeLeft > 0 || resending) return;
    setError('');
    setInfo('');
    setResending(true);
    try {
      await api('/auth/resend-otp', { method: 'POST', body: { email } });
      setInfo('أرسلنا رمزاً جديداً إلى بريدك.');
      setTimeLeft(60);
      resetDigits();
    } catch (err) {
      if (err.status === 429) setError(tooManyMessage(err));
      else if (err.status === 0) setError(err.message);
      else setError('تعذّر إرسال رمز جديد. حاول مرة أخرى.');
    } finally {
      setResending(false);
    }
  };

  const handleDigitChange = (index, value) => {
    const val = value.replace(/\D/g, '').slice(-1); // digits only
    const newDigits = [...digits];
    newDigits[index] = val;
    setDigits(newDigits);
    setError('');

    if (val && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Pasting "123456" fills all six boxes
  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    e.preventDefault();
    const newDigits = EMPTY.map((_, i) => pasted[i] ?? '');
    setDigits(newDigits);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = digits.join('');
    if (!/^\d{6}$/.test(code)) {
      setError('أدخل الرمز كاملاً (6 أرقام).');
      return;
    }

    setError('');
    setInfo('');
    setLoading(true);
    try {
      // On success the backend logs the client in right away
      const data = await api('/auth/verify-otp', { method: 'POST', body: { email, code } });
      saveSession(data.token, data.user);
      navigate(safeFrom(from) ?? '/bookings', { replace: true });
    } catch (err) {
      if (err.status === 400) setError('الرمز غير صحيح أو منتهي الصلاحية.');
      else if (err.status === 429) setError(tooManyMessage(err));
      else if (err.status === 0) setError(err.message);
      else setError('حدث خطأ غير متوقع.');
      resetDigits();
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
                  onPaste={handlePaste}
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

            {error && (
              <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', borderRadius: '8px', padding: '10px 12px', fontSize: '13px', marginBottom: '14px' }}>
                {error}
              </div>
            )}
            {info && (
              <div style={{ backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', color: '#047857', borderRadius: '8px', padding: '10px 12px', fontSize: '13px', marginBottom: '14px' }}>
                {info}
              </div>
            )}

            {/* Confirm Button */}
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
                marginBottom: '14px',
                border: 'none',
                transition: 'background-color 0.15s'
              }}
            >
              {loading ? 'جارٍ التحقق…' : 'تأكيد الرمز'}
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
                  cursor: resending ? 'wait' : 'pointer',
                  textDecoration: 'underline'
                }}
              >
                {resending ? 'جارٍ الإرسال…' : 'إعادة الإرسال الآن'}
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
            <Link to="/login" state={{ from }} style={{ color: '#0d6e75', fontWeight: '600' }}>
              العودة لتسجيل الدخول
            </Link>
            <Link to="/register" state={{ from }} style={{ color: '#0d6e75', fontWeight: '600' }}>
              تعديل البريد الإلكتروني
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}