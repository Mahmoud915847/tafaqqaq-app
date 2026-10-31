import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CompanySidebar from '../../components/CompanySidebar';

export default function AddEngineer() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [specialty, setSpecialty] = useState('إنشائي');
  const [expYears, setExpYears] = useState('');
  const [syndicateNo, setSyndicateNo] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      navigate('/company/profile');
    }, 1500);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      direction: 'rtl',
      fontFamily: 'var(--font-family)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Top Navbar */}
      <header style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '12px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Right Brand & Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link to="/" style={{ fontSize: '22px', fontWeight: '800', color: '#104f55', textDecoration: 'none' }}>
            تفقّد
          </Link>
          <span style={{
            backgroundColor: '#e6f0f1',
            color: '#104f55',
            fontSize: '12px',
            fontWeight: '700',
            padding: '3px 10px',
            borderRadius: '16px'
          }}>
            حساب شركة
          </span>
        </div>

        {/* Left Office Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b' }}>مكتب الأفق الهندسي</span>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            backgroundColor: '#104f55',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '700',
            fontSize: '16px'
          }}>
            أ
          </div>
        </div>
      </header>

      {/* Main Body with Sidebar */}
      <div style={{ display: 'flex', flex: 1 }}>
        {/* Main Content Area */}
        <main style={{ flex: 1, padding: '40px 48px', overflowY: 'auto' }}>
          <div style={{ maxWidth: '780px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: '32px' }}>
              <h1 style={{ fontSize: '30px', fontWeight: '800', color: '#0f172a', margin: '0 0 8px' }}>
                إضافة مهندس
              </h1>
              <p style={{ color: '#64748b', fontSize: '15px', margin: 0 }}>
                المهندس بيشتغل تحت مكتبك وبتظهر أسماؤهم على التقارير.
              </p>
            </div>

            {/* Form Card */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              padding: '36px 40px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', marginBottom: '20px' }}>
                إضافة مهندس جديد
              </h2>

              {/* Alert Note */}
              <div style={{
                backgroundColor: '#edf5f6',
                color: '#104f55',
                borderRadius: '10px',
                padding: '14px 18px',
                fontSize: '13px',
                fontWeight: '600',
                lineHeight: 1.6,
                marginBottom: '28px',
                border: '1px solid #cce3e6'
              }}>
                بنرسل للمهندس رابط لتعيين كلمة المرور، الرابط صالح لمدة 48 ساعة. أنت ما بتحدد كلمة مرور له.
              </div>

              {isSuccess ? (
                <div style={{ textAlign: 'center', padding: '30px 10px' }}>
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
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', marginBottom: '6px' }}>
                    تم إنشاء حساب المهندس بنجاح!
                  </h3>
                  <p style={{ color: '#64748b', fontSize: '14px' }}>
                    تم إرسال رابط التفعيل إلى {email}. جاري إعادتك للملف...
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                  {/* Row 1: التخصص & الاسم الكامل */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '18px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1e293b', marginBottom: '6px' }}>
                        التخصص
                      </label>
                      <select
                        value={specialty}
                        onChange={(e) => setSpecialty(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px',
                          borderRadius: '10px',
                          border: '1px solid #cbd5e1',
                          fontSize: '14px',
                          outline: 'none',
                          backgroundColor: '#ffffff'
                        }}
                      >
                        <option value="إنشائي">إنشائي</option>
                        <option value="معماري">معماري</option>
                        <option value="كهرباء">كهرباء</option>
                        <option value="ميكانيك">ميكانيك</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1e293b', marginBottom: '6px' }}>
                        الاسم الكامل
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="مثال: م. أحمد"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px',
                          borderRadius: '10px',
                          border: '1px solid #cbd5e1',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                  {/* Row 2: رقم عضوية النقابة & سنوات الخبرة */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1e293b', marginBottom: '6px' }}>
                        رقم عضوية النقابة
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="XXXX"
                        value={syndicateNo}
                        onChange={(e) => setSyndicateNo(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px',
                          borderRadius: '10px',
                          border: '1px solid #cbd5e1',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1e293b', marginBottom: '6px' }}>
                        سنوات الخبرة
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="مثال: 10"
                        value={expYears}
                        onChange={(e) => setExpYears(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px',
                          borderRadius: '10px',
                          border: '1px solid #cbd5e1',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                  {/* Row 3: رقم الهاتف & البريد الإلكتروني */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '18px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1e293b', marginBottom: '6px' }}>
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
                          padding: '12px',
                          borderRadius: '10px',
                          border: '1px solid #cbd5e1',
                          fontSize: '14px',
                          outline: 'none',
                          direction: 'ltr',
                          textAlign: 'right'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#1e293b', marginBottom: '6px' }}>
                        البريد الإلكتروني (لرابط التفعيل)
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="engineer@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px',
                          borderRadius: '10px',
                          border: '1px solid #cbd5e1',
                          fontSize: '14px',
                          outline: 'none',
                          direction: 'ltr',
                          textAlign: 'right'
                        }}
                      />
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: 'flex', gap: '14px', marginTop: '12px' }}>
                    <button
                      type="submit"
                      style={{
                        backgroundColor: '#104f55',
                        color: '#ffffff',
                        padding: '12px 28px',
                        borderRadius: '10px',
                        fontSize: '15px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(16, 79, 85, 0.2)'
                      }}
                    >
                      إنشاء حساب المهندس
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate('/company/profile')}
                      style={{
                        backgroundColor: '#ffffff',
                        color: '#475569',
                        border: '1px solid #cbd5e1',
                        padding: '12px 24px',
                        borderRadius: '10px',
                        fontSize: '15px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      إلغاء
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </main>

        {/* Sidebar on the Right */}
        <CompanySidebar />
      </div>
    </div>
  );
}
