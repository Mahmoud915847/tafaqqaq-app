import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { api, saveSession } from '../../api/client';

const EMPTY = ['', '', '', '', '', ''];

export default function VerifyOtp() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const email = state?.email;

  const [digits, setDigits] = useState(EMPTY);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [seconds, setSeconds] = useState(60);
  const refs = useRef([]);

  // No email (page opened directly) -> back to register
  useEffect(() => {
    if (!email) navigate('/register', { replace: true });
  }, [email, navigate]);

  // Resend countdown
  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const verify = async (code) => {
    setError('');
    setInfo('');
    setLoading(true);
    try {
      const data = await api('/auth/verify-otp', { method: 'POST', body: { email, code } });
      saveSession(data.token, data.user);
      navigate('/bookings', { replace: true });
    } catch (err) {
      if (err.status === 0) setError('تعذّر الاتصال بالخادم. تأكد أن الـ Backend شغّال.');
      else if (err.status === 429) setError('محاولات خاطئة كثيرة. اطلب رمزًا جديدًا.');
      else if (err.status === 400) setError('الرمز غير صحيح أو منتهي الصلاحية.');
      else setError('حدث خطأ غير متوقع. حاول مرة أخرى.');
      setDigits(EMPTY);
      refs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (i, value) => {
    const v = value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[i] = v;
    setDigits(next);
    if (v && i < 5) refs.current[i + 1]?.focus();
    if (next.every((d) => d !== '')) verify(next.join(''));
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const handlePaste = (e) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!text) return;
    e.preventDefault();
    const next = [...EMPTY];
    text.split('').forEach((c, idx) => (next[idx] = c));
    setDigits(next);
    if (text.length === 6) verify(text);
    else refs.current[text.length]?.focus();
  };

  const resend = async () => {
    setError('');
    setInfo('');
    try {
      await api('/auth/resend-otp', { method: 'POST', body: { email } });
      setInfo('أرسلنا رمزًا جديدًا إلى بريدك.');
      setSeconds(60);
      setDigits(EMPTY);
      refs.current[0]?.focus();
    } catch {
      setError('تعذّر إرسال الرمز. حاول مرة أخرى.');
    }
  };

  if (!email) return null;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#edf4f5', direction: 'rtl', fontFamily: 'var(--font-family)' }}>
      <Navbar />

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 20px' }}>
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '36px 40px', width: '100%', maxWidth: '440px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0', textAlign: 'center' }}>
          <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0c232f', marginBottom: '8px' }}>تأكيد البريد الإلكتروني</h1>
          <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '4px' }}>أرسلنا رمزًا من 6 أرقام إلى</p>
          <p style={{ color: '#0c232f', fontSize: '13px', fontWeight: '700', direction: 'ltr', marginBottom: '24px' }}>{email}</p>

          {error && (
            <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', marginBottom: '16px' }}>{error}</div>
          )}
          {info && (
            <div style={{ backgroundColor: '#e6f9f0', color: '#15803d', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', marginBottom: '16px' }}>{info}</div>
          )}

          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', direction: 'ltr', marginBottom: '20px' }}>
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => (refs.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                autoFocus={i === 0}
                disabled={loading}
                value={d}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={handlePaste}
                style={{ width: '44px', height: '52px', textAlign: 'center', fontSize: '22px', fontWeight: '700', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: '#fff' }}
              />
            ))}
          </div>

          <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '14px' }}>
            الرمز صالح لمدة 10 دقائق، ولديك 5 محاولات.
          </p>

          {seconds > 0 ? (
            <p style={{ fontSize: '13px', color: '#64748b' }}>
              إعادة إرسال الرمز بعد 00:{String(seconds).padStart(2, '0')}
            </p>
          ) : (
            <button onClick={resend} style={{ color: '#0d6e75', fontWeight: '700', fontSize: '13px' }}>
              إعادة إرسال الرمز
            </button>
          )}

          <div style={{ marginTop: '20px', fontSize: '13px', color: '#64748b' }}>
            <Link to="/register" style={{ color: '#0d6e75', fontWeight: '700' }}>تعديل البريد</Link>
            {' · '}
            <Link to="/login" style={{ color: '#0d6e75', fontWeight: '700' }}>دخول</Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}