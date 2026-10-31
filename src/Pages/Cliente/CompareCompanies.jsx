import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function CompareCompanies() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f5f9fa', direction: 'rtl', fontFamily: 'var(--font-family)' }}>
      <Navbar selectedCount={2} />

      <main style={{ maxWidth: '1080px', margin: '0 auto', padding: '36px 24px 80px', width: '100%', flex: 1 }}>
        {/* Header matching 04 Compare.png */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0c232f', margin: '0 0 6px' }}>
              مقارنة الشركات
            </h1>
            <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
              القيمة الأفضل بكل صف عليها علامة
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/companies')}
            style={{
              padding: '8px 20px',
              borderRadius: '8px',
              border: '1.5px solid #0d6e75',
              backgroundColor: '#ffffff',
              color: '#0d6e75',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            إضافة شركة
          </button>
        </div>

        {/* Comparison Table Card matching 04 Compare.png */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          overflow: 'hidden'
        }}>
          {/* Header row with companies */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1.2fr 1.2fr 180px',
            borderBottom: '1px solid #e2e8f0',
            padding: '28px 20px 24px',
            alignItems: 'center'
          }}>
            {/* Leftmost Col 4 in LTR, 1st Col in RTL visual order (Left in screen: المعمار) */}
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                backgroundColor: '#0d6e75',
                color: '#ffffff',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontWeight: '800'
              }}>
                م
              </div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#0c232f' }}>
                مكتب المعمار الاستشاري
              </div>
              <button
                type="button"
                onClick={() => navigate('/book-inspection?company=al-meamar')}
                style={{
                  backgroundColor: '#0d6e75',
                  color: '#ffffff',
                  padding: '6px 20px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                احجز
              </button>
            </div>

            {/* Middle Company: البنيان */}
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                backgroundColor: '#0d6e75',
                color: '#ffffff',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontWeight: '800'
              }}>
                ب
              </div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#0c232f' }}>
                شركة البنيان للفحص
              </div>
              <button
                type="button"
                onClick={() => navigate('/book-inspection?company=al-bunyan')}
                style={{
                  backgroundColor: '#0d6e75',
                  color: '#ffffff',
                  padding: '6px 20px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                احجز
              </button>
            </div>

            {/* Right Company: الأفق */}
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                backgroundColor: '#0d6e75',
                color: '#ffffff',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontWeight: '800'
              }}>
                أ
              </div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#0c232f' }}>
                مكتب الأفق الهندسي
              </div>
              <button
                type="button"
                onClick={() => navigate('/book-inspection?company=al-ofoq')}
                style={{
                  backgroundColor: '#0d6e75',
                  color: '#ffffff',
                  padding: '6px 20px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                احجز
              </button>
            </div>

            {/* Far Right Label Header */}
            <div></div>
          </div>

          {/* Row 1: التقييم */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 1.2fr 180px', padding: '16px 20px', borderBottom: '1px solid #f1f5f9', alignItems: 'center', fontSize: '14px' }}>
            <div style={{ textAlign: 'center', color: '#334155' }}>4.5</div>
            <div style={{ textAlign: 'center', color: '#334155' }}>4.6</div>
            <div style={{ textAlign: 'center' }}>
              <span style={{ backgroundColor: '#e6f9f0', color: '#15803d', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '10px', marginLeft: '6px' }}>الأفضل</span>
              <span style={{ fontWeight: '800', color: '#0c232f' }}>4.8</span>
            </div>
            <div style={{ textAlign: 'right', fontWeight: '600', color: '#64748b' }}>التقييم</div>
          </div>

          {/* Row 2: عدد التقييمات */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 1.2fr 180px', padding: '16px 20px', borderBottom: '1px solid #f1f5f9', alignItems: 'center', fontSize: '14px' }}>
            <div style={{ textAlign: 'center', color: '#334155' }}>64</div>
            <div style={{ textAlign: 'center', color: '#334155' }}>89</div>
            <div style={{ textAlign: 'center' }}>
              <span style={{ backgroundColor: '#e6f9f0', color: '#15803d', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '10px', marginLeft: '6px' }}>الأفضل</span>
              <span style={{ fontWeight: '800', color: '#0c232f' }}>126</span>
            </div>
            <div style={{ textAlign: 'right', fontWeight: '600', color: '#64748b' }}>عدد التقييمات</div>
          </div>

          {/* Row 3: المدينة */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 1.2fr 180px', padding: '16px 20px', borderBottom: '1px solid #f1f5f9', alignItems: 'center', fontSize: '14px' }}>
            <div style={{ textAlign: 'center', color: '#334155' }}>الزرقاء</div>
            <div style={{ textAlign: 'center', color: '#334155' }}>إربد</div>
            <div style={{ textAlign: 'center', color: '#334155' }}>عمّان</div>
            <div style={{ textAlign: 'right', fontWeight: '600', color: '#64748b' }}>المدينة</div>
          </div>

          {/* Row 4: عدد المهندسين */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 1.2fr 180px', padding: '16px 20px', borderBottom: '1px solid #f1f5f9', alignItems: 'center', fontSize: '14px' }}>
            <div style={{ textAlign: 'center', color: '#334155' }}>6</div>
            <div style={{ textAlign: 'center', color: '#334155' }}>9</div>
            <div style={{ textAlign: 'center' }}>
              <span style={{ backgroundColor: '#e6f9f0', color: '#15803d', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '10px', marginLeft: '6px' }}>الأفضل</span>
              <span style={{ fontWeight: '800', color: '#0c232f' }}>14</span>
            </div>
            <div style={{ textAlign: 'right', fontWeight: '600', color: '#64748b' }}>عدد المهندسين</div>
          </div>

          {/* Row 5: سنوات الخبرة */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 1.2fr 180px', padding: '16px 20px', borderBottom: '1px solid #f1f5f9', alignItems: 'center', fontSize: '14px' }}>
            <div style={{ textAlign: 'center', color: '#334155' }}>9</div>
            <div style={{ textAlign: 'center', color: '#334155' }}>12</div>
            <div style={{ textAlign: 'center' }}>
              <span style={{ backgroundColor: '#e6f9f0', color: '#15803d', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '10px', marginLeft: '6px' }}>الأفضل</span>
              <span style={{ fontWeight: '800', color: '#0c232f' }}>18</span>
            </div>
            <div style={{ textAlign: 'right', fontWeight: '600', color: '#64748b' }}>سنوات الخبرة</div>
          </div>

          {/* Row 6: فحص شقة 120 م² */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 1.2fr 180px', padding: '16px 20px', borderBottom: '1px solid #f1f5f9', alignItems: 'center', fontSize: '14px' }}>
            <div style={{ textAlign: 'center' }}>
              <span style={{ backgroundColor: '#e6f9f0', color: '#15803d', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '10px', marginLeft: '6px' }}>الأفضل</span>
              <span style={{ fontWeight: '800', color: '#0d6e75' }}>40 د.أ</span>
            </div>
            <div style={{ textAlign: 'center', color: '#334155' }}>48 د.أ</div>
            <div style={{ textAlign: 'center', color: '#334155' }}>60 د.أ</div>
            <div style={{ textAlign: 'right', fontWeight: '600', color: '#64748b' }}>فحص شقة 120 م²</div>
          </div>

          {/* Row 7: السعة اليومية */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 1.2fr 180px', padding: '16px 20px', borderBottom: '1px solid #f1f5f9', alignItems: 'center', fontSize: '14px' }}>
            <div style={{ textAlign: 'center', color: '#334155' }}>3 فحوصات</div>
            <div style={{ textAlign: 'center', color: '#334155' }}>4 فحوصات</div>
            <div style={{ textAlign: 'center' }}>
              <span style={{ backgroundColor: '#e6f9f0', color: '#15803d', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '10px', marginLeft: '6px' }}>الأفضل</span>
              <span style={{ fontWeight: '800', color: '#0d6e75' }}>6 فحوصات</span>
            </div>
            <div style={{ textAlign: 'right', fontWeight: '600', color: '#64748b' }}>السعة اليومية</div>
          </div>

          {/* Row 8: أيام الدوام */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 1.2fr 180px', padding: '16px 20px', alignItems: 'center', fontSize: '14px' }}>
            <div style={{ textAlign: 'center', color: '#334155' }}>الأحد - الخميس</div>
            <div style={{ textAlign: 'center', color: '#334155' }}>الأحد - الخميس</div>
            <div style={{ textAlign: 'center', color: '#334155' }}>الأحد - الخميس</div>
            <div style={{ textAlign: 'right', fontWeight: '600', color: '#64748b' }}>أيام الدوام</div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
