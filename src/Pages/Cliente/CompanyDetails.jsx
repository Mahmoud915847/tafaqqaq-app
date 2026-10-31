import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function CompanyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f5f9fa', direction: 'rtl', fontFamily: 'var(--font-family)' }}>
      <Navbar />

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px 80px', width: '100%', flex: 1 }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px' }}>
          <Link to="/companies" style={{ color: '#0d6e75', fontWeight: '600' }}>
            الشركات
          </Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <span style={{ color: '#0c232f', fontWeight: '600' }}>مكتب الأفق الهندسي</span>
        </div>

        {/* Top Header Card matching 03 Office Profile.png */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '32px 36px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
        }}>
          {/* Left Price and Book button */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '2px' }}>ابتداءً من</div>
            <div style={{ fontSize: '32px', fontWeight: '800', color: '#0d6e75', marginBottom: '12px' }}>
              60 د.أ
            </div>
            <button
              type="button"
              onClick={() => navigate('/book-inspection?company=al-ofoq')}
              style={{
                backgroundColor: '#0d6e75',
                color: '#ffffff',
                padding: '10px 28px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              احجز فحص
            </button>
          </div>

          {/* Right Info & Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <span style={{
                  backgroundColor: '#e6f9f0',
                  color: '#15803d',
                  fontSize: '12px',
                  fontWeight: '700',
                  padding: '3px 10px',
                  borderRadius: '12px'
                }}>
                  موثّقة من الأدمن
                </span>
                <span style={{ fontSize: '13px', color: '#64748b' }}>عمّان، الأردن</span>
                <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0c232f', margin: 0 }}>
                  مكتب الأفق الهندسي
                </h1>
              </div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>
                رقم الترخيص: 4821 • نقابة المهندسين الأردنيين
              </div>
            </div>

            <div style={{
              width: '64px',
              height: '64px',
              backgroundColor: '#0d6e75',
              color: '#ffffff',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '26px',
              fontWeight: '800'
            }}>
              أ
            </div>
          </div>
        </div>

        {/* 4 Metric Cards matching 03 Office Profile.png */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
            padding: '20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px' }}>التقييم</div>
            <div style={{ fontSize: '20px', fontWeight: '800', color: '#0c232f', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <span>(126)</span>
              <span>4.8</span>
              <span style={{ color: '#d97706' }}>★</span>
            </div>
          </div>

          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
            padding: '20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px' }}>المهندسون</div>
            <div style={{ fontSize: '20px', fontWeight: '800', color: '#0d6e75' }}>14 مهندس</div>
          </div>

          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
            padding: '20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px' }}>الخبرة</div>
            <div style={{ fontSize: '20px', fontWeight: '800', color: '#0d6e75' }}>18 سنة</div>
          </div>

          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
            padding: '20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px' }}>السعة اليومية</div>
            <div style={{ fontSize: '20px', fontWeight: '800', color: '#0d6e75' }}>6 فحوصات</div>
          </div>
        </div>

        {/* 2-Column Section matching 03 Office Profile.png */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px', marginBottom: '36px', alignItems: 'start' }}>
          {/* Right Column: About & Working Days (Child 1 in RTL) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Card: عن الشركة */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              border: '1px solid #e2e8f0',
              padding: '24px'
            }}>
              <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#0c232f', marginBottom: '10px' }}>
                عن الشركة
              </h2>
              <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.8, margin: 0 }}>
                مكتب هندسي تأسس في عمّان، متخصص بفحص الشقق والفلل والمباني التجارية قبل الشراء، فريقنا يضم مهندسين إنشائيين ومعماريين وكهرباء وميكانيك.
              </p>
            </div>

            {/* Card: أيام الدوام */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              border: '1px solid #e2e8f0',
              padding: '24px'
            }}>
              <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#0c232f', marginBottom: '14px' }}>
                أيام الدوام
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                  <span>الأحد - الأربعاء</span>
                  <span style={{ fontWeight: '600', color: '#0c232f' }}>9:00 - 15:00</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                  <span>الخميس</span>
                  <span style={{ fontWeight: '600', color: '#0c232f' }}>9:00 - 13:00</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                  <span>الجمعة والسبت</span>
                  <span style={{ fontWeight: '700', color: '#dc2626' }}>إجازة</span>
                </div>
              </div>
            </div>
          </div>

          {/* Left Column: قائمة الأسعار (Child 2 in RTL) */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
            padding: '24px'
          }}>
            <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#0c232f', marginBottom: '16px', textAlign: 'right' }}>
              قائمة الأسعار
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              {[
                { type: 'شقة (حتى 120 م²)', price: '60 د.أ' },
                { type: 'شقة (أكثر من 120 م²)', price: '80 د.أ' },
                { type: 'فيلا (حتى 300 م²)', price: '120 د.أ' },
                { type: 'مكتب أو محل تجاري', price: '90 د.أ' },
                { type: 'أرض', price: '70 د.أ' },
              ].map((p, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                  <span style={{ fontWeight: '800', color: '#0d6e75' }}>{p.price}</span>
                  <span style={{ color: '#334155', fontWeight: '500' }}>{p.type}</span>
                </div>
              ))}
            </div>

            <p style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
              السعر النهائي بتحدده الشركة بعد مراجعة تفاصيل العقار، وبتوصلك إشعار للموافقة عليه قبل الدفع.
            </p>
          </div>
        </div>

        {/* Reviews Section matching 03 Office Profile.png */}
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0c232f', marginBottom: '18px' }}>
            آراء العملاء
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              border: '1px solid #e2e8f0',
              padding: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#d97706' }}>★ 5.0</span>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#0c232f' }}>عميل</span>
              </div>
              <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.7, margin: 0 }}>
                فحص دقيق ومفصّل، والمهندس شرح لي كل الملاحظات بوضوح.
              </p>
            </div>

            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              border: '1px solid #e2e8f0',
              padding: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#d97706' }}>★ 4.5</span>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#0c232f' }}>عميلة</span>
              </div>
              <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.7, margin: 0 }}>
                التقرير كان واضح ومرتب، والسعر النهائي كان مطابق للمتفق عليه.
              </p>
            </div>

            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              border: '1px solid #e2e8f0',
              padding: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#d97706' }}>★ 4.8</span>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#0c232f' }}>عميل</span>
              </div>
              <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.7, margin: 0 }}>
                التزام بالموعد وصور واضحة لكل بند.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
