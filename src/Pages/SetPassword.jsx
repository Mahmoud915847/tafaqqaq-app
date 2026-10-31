import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function SetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'engineer'; // 'engineer' | 'office'
  const name = searchParams.get('name') || 'م. لينا';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password.length < 8) {
      alert('يجب أن تتكون كلمة المرور من 8 أحرف على الأقل.');
      return;
    }
    if (password !== confirmPassword) {
      alert('كلمتا المرور غير متطابقتين.');
      return;
    }

    setIsSuccess(true);
    setTimeout(() => {
      if (role === 'office') {
        navigate('/company/dashboard');
      } else {
        navigate('/engineer/inspections');
      }
    }, 1500);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#eaf3f5',
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
          borderRadius: '24px',
          padding: '44px 48px',
          width: '100%',
          maxWidth: '520px',
          boxShadow: '0 8px 30px rgba(16, 79, 85, 0.06)',
          border: '1px solid #e2e8f0',
          textAlign: 'center'
        }}>
          {/* Validity Badge */}
          <div style={{ display: 'inline-block', marginBottom: '20px' }}>
            <span style={{
              backgroundColor: '#e6f7f0',
              color: '#059669',
              fontSize: '12px',
              fontWeight: '700',
              padding: '6px 16px',
              borderRadius: '20px'
            }}>
              الرابط صالح لمدة 48 ساعة
            </span>
          </div>

          {/* Title & Greeting */}
          <h1 style={{
            fontSize: '28px',
            fontWeight: '800',
            color: '#0f3d46',
            marginBottom: '8px'
          }}>
            تعيين كلمة المرور
          </h1>

          <p style={{
            color: '#64748b',
            fontSize: '14px',
            lineHeight: 1.6,
            maxWidth: '420px',
            margin: '0 auto 28px'
          }}>
            أهلاً {name}، اختار كلمة مرور لحسابك في تفقّد، بعدها بتدخل مباشرة.
          </p>

          {isSuccess ? (
            <div style={{ padding: '24px 10px' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: '#e6f7f0',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                margin: '0 auto 16px'
              }}>
                ✓
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
                تم تعيين كلمة المرور بنجاح!
              </h2>
              <p style={{ color: '#64748b', fontSize: '14px' }}>
                جاري تسجيل دخولك تلقائياً...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'right' }}>
              {/* كلمة المرور الجديدة */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1e293b', marginBottom: '6px' }}>
                  كلمة المرور الجديدة
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '13px 14px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: '#fff'
                  }}
                />
              </div>

              {/* تأكيد كلمة المرور */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1e293b', marginBottom: '6px' }}>
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
                    padding: '13px 14px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: '#fff'
                  }}
                />
              </div>

              {/* Hint */}
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '-6px' }}>
                8 أحرف على الأقل، وتحتوي على حرف ورقم.
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '10px',
                  backgroundColor: '#104f55',
                  color: '#ffffff',
                  fontSize: '15px',
                  fontWeight: '700',
                  marginTop: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(16, 79, 85, 0.2)',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => (e.target.style.backgroundColor = '#0b3d42')}
                onMouseOut={(e) => (e.target.style.backgroundColor = '#104f55')}
              >
                حفظ والدخول
              </button>

              {/* Footer text */}
              <p style={{
                textAlign: 'center',
                fontSize: '12px',
                color: '#64748b',
                margin: '12px 0 0',
                lineHeight: 1.5
              }}>
                الرابط منتهي أو ما اشتغل؟ اطلب رابط جديد من مكتبك أو من الأدمن.
              </p>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
