import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CompanySidebar from '../../components/CompanySidebar';

export default function CompanyProfile() {
  const [name, setName] = useState('مكتب الأفق الهندسي');
  const [city, setCity] = useState('عمّان');
  const [license, setLicense] = useState('4821');
  const [phone, setPhone] = useState('06 XXX XXXX');
  const [description, setDescription] = useState('مكتب هندسي متخصص بفحص الشقق والفلل والمباني التجارية.');

  const [engineers, setEngineers] = useState([
    { id: 1, name: 'م. خالد', specialty: 'إنشائي', exp: '12 سنة', status: 'متاح', statusType: 'active' },
    { id: 2, name: 'م. لينا', specialty: 'معماري', exp: '9 سنوات', status: 'متاح', statusType: 'active' },
    { id: 3, name: 'م. عمر', specialty: 'كهرباء', exp: '15 سنة', status: 'متاح', statusType: 'active' },
    { id: 4, name: 'م. هبة', specialty: 'ميكانيك', exp: '8 سنوات', status: 'بانتظار تفعيل الحساب', statusType: 'pending' }
  ]);

  const [prices, setPrices] = useState({
    aptSmall: '60',
    aptLarge: '80',
    villa: '120',
    commercial: '90'
  });

  const handleSave = (e) => {
    e.preventDefault();
    alert('تم حفظ التغييرات بنجاح!');
  };

  const handleToggleStatus = (id) => {
    setEngineers(engineers.map(eng => {
      if (eng.id === id) {
        const isDeactivated = eng.status === 'معطل';
        return {
          ...eng,
          status: isDeactivated ? 'متاح' : 'معطل',
          statusType: isDeactivated ? 'active' : 'disabled'
        };
      }
      return eng;
    }));
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
        <main style={{ flex: 1, padding: '36px 48px', overflowY: 'auto' }}>
          <div style={{ maxWidth: '1020px', margin: '0 auto' }}>
            {/* Top Title & Save Button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
              <div>
                <h1 style={{ fontSize: '30px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px' }}>
                  الملف والمهندسون
                </h1>
              </div>

              <button
                type="button"
                onClick={handleSave}
                style={{
                  backgroundColor: '#104f55',
                  color: '#ffffff',
                  padding: '10px 24px',
                  borderRadius: '8px',
                  fontWeight: '700',
                  fontSize: '14px',
                  boxShadow: '0 2px 8px rgba(16, 79, 85, 0.2)',
                  cursor: 'pointer'
                }}
              >
                حفظ التغييرات
              </button>
            </div>

            {/* Top 2 Cards: البيانات الأساسية & قائمة الأسعار */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1.4fr 0.9fr',
              gap: '24px',
              marginBottom: '28px'
            }}>
              {/* Card 1: البيانات الأساسية */}
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                padding: '28px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
              }}>
                <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', marginBottom: '20px' }}>
                  البيانات الأساسية
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '6px' }}>
                        اسم الشركة
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '6px' }}>
                        رقم الترخيص (يعدّله الأدمن فقط)
                      </label>
                      <input
                        type="text"
                        disabled
                        value={license}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '14px', color: '#64748b' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '6px' }}>
                        المدينة
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '6px' }}>
                        الهاتف
                      </label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', direction: 'ltr', textAlign: 'right' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '6px' }}>
                      الوصف
                    </label>
                    <textarea
                      rows={2}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', resize: 'vertical' }}
                    />
                  </div>
                </div>
              </div>

              {/* Card 2: قائمة الأسعار */}
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                padding: '28px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
              }}>
                <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', marginBottom: '20px' }}>
                  قائمة الأسعار
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', color: '#1e293b' }}>شقة (حتى 120 م²)</span>
                    <span style={{
                      backgroundColor: '#f1f5f9',
                      padding: '6px 14px',
                      borderRadius: '8px',
                      fontWeight: '800',
                      color: '#104f55',
                      fontSize: '14px'
                    }}>
                      {prices.aptSmall} د.أ
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', color: '#1e293b' }}>شقة (أكثر من 120 م²)</span>
                    <span style={{
                      backgroundColor: '#f1f5f9',
                      padding: '6px 14px',
                      borderRadius: '8px',
                      fontWeight: '800',
                      color: '#104f55',
                      fontSize: '14px'
                    }}>
                      {prices.aptLarge} د.أ
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', color: '#1e293b' }}>فيلا (حتى 300 م²)</span>
                    <span style={{
                      backgroundColor: '#f1f5f9',
                      padding: '6px 14px',
                      borderRadius: '8px',
                      fontWeight: '800',
                      color: '#104f55',
                      fontSize: '14px'
                    }}>
                      {prices.villa} د.أ
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', color: '#1e293b' }}>مكتب أو محل تجاري</span>
                    <span style={{
                      backgroundColor: '#f1f5f9',
                      padding: '6px 14px',
                      borderRadius: '8px',
                      fontWeight: '800',
                      color: '#104f55',
                      fontSize: '14px'
                    }}>
                      {prices.commercial} د.أ
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Card: المهندسون (4) */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '28px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                  المهندسون ({engineers.length})
                </h2>

                <Link
                  to="/company/add-engineer"
                  style={{
                    backgroundColor: '#104f55',
                    color: '#ffffff',
                    padding: '8px 18px',
                    borderRadius: '8px',
                    fontWeight: '700',
                    fontSize: '13px',
                    textDecoration: 'none',
                    boxShadow: '0 2px 6px rgba(16, 79, 85, 0.2)'
                  }}
                >
                  إضافة مهندس
                </Link>
              </div>

              {/* Table */}
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                    <th style={{ padding: '12px 16px', fontWeight: '600' }}>الاسم</th>
                    <th style={{ padding: '12px 16px', fontWeight: '600' }}>التخصص</th>
                    <th style={{ padding: '12px 16px', fontWeight: '600' }}>الخبرة</th>
                    <th style={{ padding: '12px 16px', fontWeight: '600' }}>الحالة</th>
                    <th style={{ padding: '12px 16px', fontWeight: '600', textAlign: 'center' }}>إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {engineers.map((eng) => (
                    <tr key={eng.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '14px 16px', fontWeight: '700', color: '#0f172a' }}>
                        {eng.name}
                      </td>
                      <td style={{ padding: '14px 16px', color: '#475569' }}>
                        {eng.specialty}
                      </td>
                      <td style={{ padding: '14px 16px', color: '#475569' }}>
                        {eng.exp}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        {eng.statusType === 'active' && (
                          <span style={{
                            backgroundColor: '#e6f7f0',
                            color: '#059669',
                            fontSize: '12px',
                            fontWeight: '700',
                            padding: '3px 10px',
                            borderRadius: '12px'
                          }}>
                            {eng.status}
                          </span>
                        )}
                        {eng.statusType === 'pending' && (
                          <span style={{
                            backgroundColor: '#fffbeb',
                            color: '#d97706',
                            fontSize: '12px',
                            fontWeight: '700',
                            padding: '3px 10px',
                            borderRadius: '12px'
                          }}>
                            {eng.status}
                          </span>
                        )}
                        {eng.statusType === 'disabled' && (
                          <span style={{
                            backgroundColor: '#f1f5f9',
                            color: '#94a3b8',
                            fontSize: '12px',
                            fontWeight: '700',
                            padding: '3px 10px',
                            borderRadius: '12px'
                          }}>
                            {eng.status}
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', fontSize: '13px' }}>
                          <button
                            type="button"
                            onClick={() => alert(`تعديل بيانات ${eng.name}`)}
                            style={{ color: '#104f55', fontWeight: '600', cursor: 'pointer' }}
                          >
                            تعديل
                          </button>

                          {eng.statusType === 'pending' ? (
                            <button
                              type="button"
                              onClick={() => alert(`تمت إعادة إرسال الرابط إلى ${eng.name}`)}
                              style={{ color: '#dc2626', fontWeight: '600', cursor: 'pointer' }}
                            >
                              إعادة إرسال الرابط
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(eng.id)}
                              style={{ color: '#dc2626', fontWeight: '600', cursor: 'pointer' }}
                            >
                              {eng.status === 'معطل' ? 'تفعيل' : 'تعطيل'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <p style={{
                fontSize: '12px',
                color: '#64748b',
                marginTop: '20px',
                lineHeight: 1.5,
                textAlign: 'center'
              }}>
                تغيير السعر أو عدد المهندسين بيتسجل ويظهر للأدمن. الحذف غير متاح للمهندسين: بنعطل الحساب عشان تظل أسماؤهم على التقارير القديمة.
              </p>
            </div>
          </div>
        </main>

        {/* Sidebar on Right */}
        <CompanySidebar />
      </div>
    </div>
  );
}
