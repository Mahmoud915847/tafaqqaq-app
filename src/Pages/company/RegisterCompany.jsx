import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function RegisterCompany() {
  const navigate = useNavigate();

  const [companyName, setCompanyName] = useState('');
  const [crNumber, setCrNumber] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [city, setCity] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/request-submitted');
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
          padding: '36px 44px',
          width: '100%',
          maxWidth: '680px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
          border: '1px solid #e2e8f0'
        }}>
          {/* Header matching 07 Request Office Account.png */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h1 style={{
              fontSize: '26px',
              fontWeight: '800',
              color: '#0c232f',
              marginBottom: '8px'
            }}>
              طلب إنشاء حساب مكتب هندسي
            </h1>
            <p style={{ color: '#64748b', fontSize: '13px', margin: 0, lineHeight: 1.6 }}>
              بعد إرسال الطلب، بيراجعه الأدمن، وبتوصلك رسالة بالقبول أو الرفض مع السبب. ما بتقدر تستقبل حجوزات قبل الموافقة.
            </p>
          </div>

          {/* Amber Alert Notice matching 07 Request Office Account.png */}
          <div style={{
            backgroundColor: '#fef3c7',
            borderRadius: '10px',
            padding: '14px 18px',
            marginBottom: '24px'
          }}>
            <div style={{ fontSize: '13px', fontWeight: '800', color: '#b45309', marginBottom: '4px' }}>
              هاد طلب مو تسجيل: ما بينفتح لك حساب فوراً.
            </div>
            <p style={{ fontSize: '12px', color: '#92400e', margin: 0, lineHeight: 1.6 }}>
              بعد ما يراجع الأدمن ترخيصك وبياناتك، بنرسل لك رابط على الإيميل لتعيين كلمة المرور، وبعدها بتضيف مهندسينك وأسعارك وأيام الدوام من لوحة التحكم.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Row 1: اسم الشركة ورقم السجل التجاري */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#0c232f', marginBottom: '6px' }}>
                  اسم الشركة أو المكتب
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: مكتب الأفق الهندسي"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', backgroundColor: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#0c232f', marginBottom: '6px' }}>
                  رقم السجل التجاري
                </label>
                <input
                  type="text"
                  required
                  placeholder="XXXXXXX"
                  value={crNumber}
                  onChange={(e) => setCrNumber(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', direction: 'ltr', textAlign: 'right', backgroundColor: '#fff' }}
                />
              </div>
            </div>

            {/* Row 2: رقم ترخيص المكتب والمدينة */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#0c232f', marginBottom: '6px' }}>
                  رقم ترخيص المكتب (نقابة المهندسين)
                </label>
                <input
                  type="text"
                  required
                  placeholder="XXXX"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', direction: 'ltr', textAlign: 'right', backgroundColor: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#0c232f', marginBottom: '6px' }}>
                  المدينة
                </label>
                <select
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', backgroundColor: '#fff', color: city ? '#1e293b' : '#94a3b8' }}
                >
                  <option value="">اختر المدينة</option>
                  <option value="عمّان">عمّان</option>
                  <option value="إربد">إربد</option>
                  <option value="الزرقاء">الزرقاء</option>
                  <option value="العقبة">العقبة</option>
                  <option value="السلط">السلط</option>
                  <option value="مأدبا">مأدبا</option>
                </select>
              </div>
            </div>

            {/* Row 3: اسم الشخص المسؤول ورقم الهاتف */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#0c232f', marginBottom: '6px' }}>
                  اسم الشخص المسؤول
                </label>
                <input
                  type="text"
                  required
                  placeholder="الاسم الكامل"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', backgroundColor: '#fff' }}
                />
              </div>

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
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', direction: 'ltr', textAlign: 'right', backgroundColor: '#fff' }}
                />
              </div>
            </div>

            {/* Row 4: البريد الإلكتروني */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#0c232f', marginBottom: '6px' }}>
                البريد الإلكتروني (لإرسال رابط تعيين كلمة المرور)
              </label>
              <input
                type="email"
                required
                placeholder="office@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', direction: 'ltr', textAlign: 'right', backgroundColor: '#fff' }}
              />
            </div>

            {/* Row 5: وصف الشركة */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#0c232f', marginBottom: '6px' }}>
                وصف الشركة
              </label>
              <textarea
                rows={3}
                placeholder="سنة التأسيس، التخصصات، نوع العقارات التي تفحصها"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', resize: 'vertical', fontFamily: 'inherit', backgroundColor: '#fff' }}
              />
            </div>

            {/* Row 6: صندوقي رفع المستندات matching 07 Request Office Account.png */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '4px' }}>
              <div style={{
                border: '1.5px dashed #cbd5e1',
                borderRadius: '10px',
                padding: '20px 14px',
                textAlign: 'center',
                backgroundColor: '#f8fafc',
                cursor: 'pointer'
              }}>
                <div style={{ fontSize: '20px', marginBottom: '6px' }}>⬆️</div>
                <div style={{ fontSize: '12px', color: '#475569', fontWeight: '600' }}>
                  ارفع صورة الترخيص والسجل التجاري
                </div>
              </div>

              <div style={{
                border: '1.5px dashed #cbd5e1',
                borderRadius: '10px',
                padding: '20px 14px',
                textAlign: 'center',
                backgroundColor: '#f8fafc',
                cursor: 'pointer'
              }}>
                <div style={{ fontSize: '20px', marginBottom: '6px' }}>⬆️</div>
                <div style={{ fontSize: '12px', color: '#475569', fontWeight: '600' }}>
                  ارفع شعار الشركة (PNG أو JPG)
                </div>
              </div>
            </div>

            {/* زر الإرسال */}
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
                marginTop: '8px',
                cursor: 'pointer'
              }}
            >
              أرسل الطلب
            </button>

            {/* رابط تسجيل الدخول */}
            <div style={{ textAlign: 'center', fontSize: '13px', color: '#64748b' }}>
              عندك حساب مكتب؟{' '}
              <Link to="/login" style={{ color: '#0d6e75', fontWeight: '700', textDecoration: 'none' }}>
                تسجيل الدخول
              </Link>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
