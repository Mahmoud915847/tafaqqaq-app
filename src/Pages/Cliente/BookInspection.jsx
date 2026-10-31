import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function BookInspection() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [propertyType, setPropertyType] = useState('شقة');
  const [area, setArea] = useState('140');
  const [floor, setFloor] = useState('3');
  const [bedrooms, setBedrooms] = useState('3');
  const [bathrooms, setBathrooms] = useState('2');
  const [buildingAge, setBuildingAge] = useState('20');
  const [hasElevator, setHasElevator] = useState(true);
  const [hasParking, setHasParking] = useState(false);

  const [address, setAddress] = useState('خلدا، عمّان');
  const [date, setDate] = useState('الأحد 25 أكتوبر');

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/booking/1042');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f5f9fa',
      direction: 'rtl',
      fontFamily: 'var(--font-family)'
    }}>
      <Navbar />

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px 80px', width: '100%', flex: 1 }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
          <Link to="/companies" style={{ color: '#0d6e75', fontWeight: '600' }}>
            الشركات
          </Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <span style={{ color: '#0c232f', fontWeight: '600' }}>حجز فحص</span>
        </div>

        {/* Title & Subtitle */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0c232f', margin: '0 0 6px' }}>
            حجز فحص عقار
          </h1>
          <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
            عبّي بيانات العقار، والشركة بتعيّن المهندس وبتأكد الموعد.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '28px', alignItems: 'start' }}>
          {/* Main Form Cards on Right (Child 1 in RTL) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Card 1: بيانات العقار */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '24px 28px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
            }}>
              <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#0c232f', marginBottom: '18px' }}>
                بيانات العقار
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Row 1 */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '6px' }}>
                      نوع العقار
                    </label>
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', backgroundColor: '#fff' }}
                    >
                      <option value="شقة">شقة</option>
                      <option value="فيلا">فيلا</option>
                      <option value="مكتب">مكتب أو محل</option>
                      <option value="أرض">أرض</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '6px' }}>
                      المساحة (م²)
                    </label>
                    <input
                      type="text"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', direction: 'ltr', textAlign: 'right', backgroundColor: '#fff' }}
                    />
                  </div>
                </div>

                {/* Row 2 */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '6px' }}>
                      رقم الطابق
                    </label>
                    <input
                      type="text"
                      value={floor}
                      onChange={(e) => setFloor(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', direction: 'ltr', textAlign: 'right', backgroundColor: '#fff' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '6px' }}>
                      غرف النوم
                    </label>
                    <input
                      type="text"
                      value={bedrooms}
                      onChange={(e) => setBedrooms(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', direction: 'ltr', textAlign: 'right', backgroundColor: '#fff' }}
                    />
                  </div>
                </div>

                {/* Row 3 */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '6px' }}>
                      عمر البناء (سنة)
                    </label>
                    <input
                      type="text"
                      value={buildingAge}
                      onChange={(e) => setBuildingAge(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', direction: 'ltr', textAlign: 'right', backgroundColor: '#fff' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '6px' }}>
                      الحمامات
                    </label>
                    <input
                      type="text"
                      value={bathrooms}
                      onChange={(e) => setBathrooms(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', direction: 'ltr', textAlign: 'right', backgroundColor: '#fff' }}
                    />
                  </div>
                </div>

                {/* Row 4: Checkboxes */}
                <div style={{ display: 'flex', gap: '24px', paddingTop: '4px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#334155' }}>
                    <input
                      type="checkbox"
                      checked={hasElevator}
                      onChange={(e) => setHasElevator(e.target.checked)}
                      style={{ width: '16px', height: '16px', accentColor: '#0d6e75' }}
                    />
                    <span>فيه مصعد</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#334155' }}>
                    <input
                      type="checkbox"
                      checked={hasParking}
                      onChange={(e) => setHasParking(e.target.checked)}
                      style={{ width: '16px', height: '16px', accentColor: '#0d6e75' }}
                    />
                    <span>فيه موقف</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Card 2: الموقع والموعد */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '24px 28px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
            }}>
              <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#0c232f', marginBottom: '18px' }}>
                الموقع والموعد
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '6px' }}>
                    عنوان العقار
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="خلدا، عمّان"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', backgroundColor: '#fff' }}
                  />
                </div>

                {/* Map placeholder matching 09 Book Inspection.png */}
                <div style={{
                  backgroundColor: '#e2e8f0',
                  borderRadius: '10px',
                  height: '140px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  color: '#475569',
                  fontSize: '13px',
                  border: '1px solid #cbd5e1'
                }}>
                  <span style={{ fontSize: '22px' }}>📍</span>
                  <span>خريطة لتحديد الموقع (دبوس)</span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '6px' }}>
                    تاريخ الفحص
                  </label>
                  <select
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', backgroundColor: '#fff' }}
                  >
                    <option value="الأحد 25 أكتوبر">الأحد 25 أكتوبر</option>
                    <option value="الاثنين 26 أكتوبر">الاثنين 26 أكتوبر</option>
                    <option value="الثلاثاء 27 أكتوبر">الثلاثاء 27 أكتوبر</option>
                    <option value="الأربعاء 28 أكتوبر">الأربعاء 28 أكتوبر</option>
                    <option value="الخميس 29 أكتوبر">الخميس 29 أكتوبر</option>
                  </select>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px' }}>
                    متاح فقط في أيام دوام الشركة (الأحد - الخميس).
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Left Column: ملخص الحجز Card matching 09 Book Inspection.png */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}>
            <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#0c232f', marginBottom: '16px' }}>
              ملخص الحجز
            </h2>

            {/* Office Profile snippet */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                backgroundColor: '#0d6e75',
                color: '#ffffff',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontWeight: '800',
                flexShrink: 0
              }}>
                أ
              </div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: '800', color: '#0c232f' }}>
                  مكتب الأفق الهندسي
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  عمّان • ★ 4.8
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '18px', fontWeight: '800', color: '#0d6e75' }}>60 د.أ</span>
                <span style={{ fontSize: '13px', color: '#64748b' }}>سعر الفحص المبدئي</span>
              </div>
              <p style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                السعر النهائي بتحدده الشركة بعد مراجعة تفاصيل العقار، وبتوصلك إشعار للموافقة عليه قبل الدفع.
              </p>
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                backgroundColor: '#0d6e75',
                color: '#ffffff',
                padding: '12px',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '14px',
                cursor: 'pointer',
                marginBottom: '12px'
              }}
            >
              أرسل طلب الحجز
            </button>

            <div style={{ fontSize: '11px', color: '#64748b', textAlign: 'center', lineHeight: 1.5 }}>
              ما بيتم الدفع الآن، الدفع بيتفعل بعد موافقة الشركة وموافقتك على السعر.
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
