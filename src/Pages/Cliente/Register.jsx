import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { api } from '../../api/client';

const labelStyle = { display: 'block', fontSize: '12px', fontWeight: '600', color: '#0c232f', marginBottom: '6px' };
const inputStyle = {
  width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #cbd5e1',
  fontSize: '13px', outline: 'none', backgroundColor: '#fff'
};
const ltrInput = { ...inputStyle, direction: 'ltr', textAlign: 'right' };

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!agree) return setError('يرجى الموافقة على الشروط وسياسة الخصوصية للمتابعة.');
    if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password))
      return setError('كلمة المرور يجب أن تكون 8 أحرف على الأقل وتحتوي على حرف ورقم.');
    if (password !== confirmPassword) return setError('كلمتا المرور غير متطابقتين.');

    setLoading(true);
    try {
      const cleanEmail = email.trim();
      await api('/auth/register', {
        method: 'POST',
        body: { email: cleanEmail, password, fullName: name.trim(), phone: phone.trim() },
      });
      navigate('/verify-otp', { state: { email: cleanEmail } });
    } catch (err) {
      if (err.status === 0) setError('تعذّر الاتصال بالخادم. تأكد أن الـ Backend شغّال.');
      else if (err.status === 409) setError('هذا البريد مسجّل مسبقًا. جرّب تسجيل الدخول.');
      else if (err.status === 400) setError(err.message || 'تأكد من صحة البيانات المدخلة.');
      else setError('حدث خطأ غير متوقع. حاول مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#edf4f5', direction: 'rtl', fontFamily: 'var(--font-family)' }}>
      <Navbar />

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 20px' }}>
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '36px 40px', width: '100%', maxWidth: '480px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0c232f', marginBottom: '6px' }}>إنشاء حساب عميل</h1>
            <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>سجّل لتحجز فحص عقار وتتابع تقاريرك.</p>
          </div>

          {error && (
            <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', marginBottom: '16px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={labelStyle}>الاسم الكامل</label>
              <input type="text" required placeholder="الاسم الثلاثي" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>البريد الإلكتروني</label>
              <input type="email" required placeholder="name@email.com" value={email} onChange={(e) => setEmail(e.target.value)} style={ltrInput} />
            </div>

            <div>
              <label style={labelStyle}>رقم الهاتف</label>
              <input type="tel" required placeholder="07X XXX XXXX" value={phone} onChange={(e) => setPhone(e.target.value)} style={ltrInput} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={labelStyle}>كلمة المرور</label>
                <input type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>تأكيد كلمة المرور</label>
                <input type="password" required placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={inputStyle} />
              </div>
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '-8px' }}>
              8 أحرف على الأقل، وتحتوي على حرف ورقم.
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12px', color: '#475569' }}>
              <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} style={{ width: '15px', height: '15px', accentColor: '#0d6e75' }} />
              <span>أوافق على الشروط وسياسة الخصوصية</span>
            </label>

            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#0d6e75', color: '#ffffff', fontSize: '14px', fontWeight: '700', marginTop: '4px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'جارٍ إنشاء الحساب...' : 'إنشاء الحساب'}
            </button>

            <div style={{ textAlign: 'center', fontSize: '11px', color: '#64748b' }}>
              سنرسل لك رمز تأكيد من 6 أرقام على بريدك الإلكتروني لتفعيل الحساب.
            </div>

            <div style={{ textAlign: 'center', fontSize: '13px', color: '#64748b', marginTop: '6px' }}>
              عندك حساب؟{' '}
              <Link to="/login" style={{ color: '#0d6e75', fontWeight: '700', textDecoration: 'none' }}>دخول</Link>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}