import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agree, setAgree] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agree) {
      alert('يرجى الموافقة على الشروط وسياسة الخصوصية للمتابعة.');
      return;
    }
    if (password !== confirmPassword) {
      alert('كلمتا المرور غير متطابقتين.');
      return;
    }
    alert('تم إنشاء الحساب بنجاح! تم إرسال رابط تأكيد إلى بريدك.');
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
        padding: '48px 20px'
      }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '36px 40px',
          width: '100%',
          maxWidth: '480px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
          border: '1px solid #e2e8f0'
        }}>
          {/* Header matching 06 Register.png */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h1 style={{
              fontSize: '28px',
              fontWeight: '800',
              color: '#0c232f',
              marginBottom: '6px'
            }}>
              إنشاء حساب عميل
            </h1>
            <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>
              سجّل لتحجز فحص عقار وتتابع تقاريرك.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* الاسم الكامل */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#0c232f', marginBottom: '6px' }}>
                الاسم الكامل
              </label>
              <input
                type="text"
                required
                placeholder="الاسم الثلاثي"
                value={name}
                onChange={(e) => setName(e.target.value)}
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

            {/* رقم الهاتف */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#0c232f', marginBottom: '6px' }}>
                رقم الهاتف
              </label>
              <input
                type="tel"
                required
                placeholder="07X XXX XXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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

            {/* كلمة المرور وتأكيدها في سطر واحد matching 06 Register.png */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
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

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#0c232f', marginBottom: '6px' }}>
                  تأكيد كلمة المرور
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
            </div>

            {/* الشروط */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12px', color: '#475569' }}>
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  style={{ width: '15px', height: '15px', accentColor: '#0d6e75' }}
                />
                <span>أوافق على الشروط وسياسة الخصوصية</span>
              </label>
            </div>

            {/* زر إنشاء الحساب */}
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: '#0d6e75',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: '700',
                marginTop: '4px',
                cursor: 'pointer'
              }}
            >
              إنشاء الحساب
            </button>

            {/* نص تأكيد البريد matching 06 Register.png */}
            <div style={{ textAlign: 'center', fontSize: '11px', color: '#64748b' }}>
              بنرسل لك رابط تأكيد على بريدك الإلكتروني قبل تفعيل الحساب.
            </div>

            {/* رابط تسجيل الدخول */}
            <div style={{ textAlign: 'center', fontSize: '13px', color: '#64748b', marginTop: '6px' }}>
              عندك حساب؟{' '}
              <Link to="/login" style={{ color: '#0d6e75', fontWeight: '700', textDecoration: 'none' }}>
                دخول
              </Link>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
