import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function Home() {
  const navigate = useNavigate();

  const topCompanies = [
    {
      id: 'al-ofoq',
      name: 'مكتب الأفق الهندسي',
      initial: 'أ',
      city: 'عمّان، الأردن',
      rating: '4.8',
      reviews: '126',
      engineers: '14 مهندس',
      experience: 'خبرة 18 سنة',
      price: '60'
    },
    {
      id: 'al-bunyan',
      name: 'شركة البنيان للفحص',
      initial: 'ب',
      city: 'إربد، الأردن',
      rating: '4.6',
      reviews: '89',
      engineers: '9 مهندس',
      experience: 'خبرة 12 سنة',
      price: '45'
    },
    {
      id: 'al-meamar',
      name: 'مكتب المعمار الاستشاري',
      initial: 'م',
      city: 'الزرقاء، الأردن',
      rating: '4.5',
      reviews: '64',
      engineers: '6 مهندس',
      experience: 'خبرة 9 سنة',
      price: '40'
    }
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f5f9fa', direction: 'rtl', fontFamily: 'var(--font-family)' }}>
      <Navbar />

      <main style={{ flex: 1 }}>
        {/* HERO SECTION matching 01 Home.png */}
        <section style={{
          maxWidth: '1240px',
          margin: '0 auto',
          padding: '60px 24px 70px',
          display: 'grid',
          gridTemplateColumns: '1.1fr 0.9fr',
          gap: '48px',
          alignItems: 'center'
        }}>
          {/* Right Hero Content */}
          <div>
            <div style={{
              display: 'inline-block',
              padding: '6px 14px',
              backgroundColor: '#e6f9f0',
              color: '#15803d',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: '700',
              marginBottom: '20px'
            }}>
              شركات هندسية موثقة في الأردن
            </div>

            <h1 style={{
              fontSize: '46px',
              fontWeight: '900',
              color: '#0c232f',
              lineHeight: 1.3,
              marginBottom: '20px'
            }}>
              افحص العقار قبل ما تشتريه،<br />
              بتقرير تقدر تثق فيه
            </h1>

            <p style={{
              fontSize: '16px',
              color: '#475569',
              lineHeight: 1.8,
              marginBottom: '32px',
              maxWidth: '540px'
            }}>
              اختار شركة هندسية حسب التقييم والسعر، احجز موعد الفحص، واستلم تقرير مفصل بالصور وتقييم لكل بند.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button
                type="button"
                onClick={() => navigate('/companies')}
                style={{
                  backgroundColor: '#0d6e75',
                  color: '#ffffff',
                  padding: '12px 28px',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: '700',
                  boxShadow: '0 2px 8px rgba(13, 110, 117, 0.25)',
                  cursor: 'pointer'
                }}
              >
                ابحث عن شركة
              </button>
              

              <button
                type="button"
                onClick={() => navigate('/compare')}
                style={{
                  backgroundColor: '#ffffff',
                  color: '#0d6e75',
                  border: '1.5px solid #0d6e75',
                  padding: '11px 26px',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                قارن الشركات
              </button>
            </div>
          </div>

          {/* Left Hero Card matching 01 Home.png */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '24px 28px',
              width: '100%',
              maxWidth: '430px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
            }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <span style={{ fontSize: '12px', color: '#64748b' }}>تقرير رقم 0142-2026-RPT</span>
                <span style={{
                  backgroundColor: '#e6f9f0',
                  color: '#15803d',
                  fontSize: '12px',
                  fontWeight: '700',
                  padding: '3px 10px',
                  borderRadius: '12px'
                }}>
                  مكتمل
                </span>
              </div>

              {/* Score & General Status */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#0c232f', margin: '0 0 4px' }}>
                    حالة جيدة بشكل عام
                  </h3>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
                    مع ملاحظات على العزل والرطوبة بحاجة لمعالجة.
                  </p>
                </div>

                {/* Circular Score Gauge */}
                <div style={{ position: 'relative', width: '74px', height: '74px', flexShrink: 0 }}>
                  <svg width="74" height="74" viewBox="0 0 74 74">
                    <circle cx="37" cy="37" r="32" fill="none" stroke="#e2e8f0" strokeWidth="5" />
                    <circle
                      cx="37"
                      cy="37"
                      r="32"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="5"
                      strokeDasharray="201"
                      strokeDashoffset="36"
                      strokeLinecap="round"
                      transform="rotate(-90 37 37)"
                    />
                  </svg>
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{ fontSize: '20px', fontWeight: '800', color: '#0c232f', lineHeight: 1 }}>82</span>
                    <span style={{ fontSize: '9px', color: '#64748b' }}>من 100</span>
                  </div>
                </div>
              </div>

              {/* 5 Category Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { name: 'الحالة الإنشائية', status: 'سليم', bg: '#e6f9f0', text: '#15803d' },
                  { name: 'الكهرباء', status: 'سليم', bg: '#e6f9f0', text: '#15803d' },
                  { name: 'السباكة', status: 'يحتاج صيانة', bg: '#fef3c7', text: '#b45309' },
                  { name: 'العزل والرطوبة', status: 'حالة سيئة', bg: '#fee2e2', text: '#b91c1c' },
                  { name: 'التشطيبات', status: 'سليم', bg: '#e6f9f0', text: '#15803d' }
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', color: '#334155', fontWeight: '600' }}>
                      {item.name}
                    </span>
                    <span style={{
                      backgroundColor: item.bg,
                      color: item.text,
                      fontSize: '11px',
                      fontWeight: '700',
                      padding: '3px 10px',
                      borderRadius: '10px'
                    }}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: كيف بتشتغل المنصة matching 01 Home.png */}
        <section style={{ maxWidth: '1240px', margin: '0 auto', padding: '30px 24px 70px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#0c232f', textAlign: 'center', marginBottom: '36px' }}>
            كيف بتشتغل المنصة
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            {[
              {
                num: '1',
                title: 'اختار الشركة',
                desc: 'قارن بين الشركات حسب التقييم، السعر، وعدد المهندسين.'
              },
              {
                num: '2',
                title: 'احجز موعد',
                desc: 'عبّي بيانات العقار واختار اليوم المناسب من أيام توفر الشركة.'
              },
              {
                num: '3',
                title: 'ادفع وتابع',
                desc: 'الشركة بتعيّن مهندس وتتحدد السعر النهائي، وبتدفع أونلاين.'
              },
              {
                num: '4',
                title: 'استلم التقرير',
                desc: 'تقرير مفصل بالصور، وقيّم الشركة بعد ما يخلص الفحص.'
              }
            ].map((step, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '14px',
                  border: '1px solid #e2e8f0',
                  padding: '24px 20px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: '#e0f2fe',
                  color: '#0284c7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '800',
                  fontSize: '16px'
                }}>
                  {step.num}
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0c232f', margin: 0 }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3: شركات الأعلى تقييماً matching 01 Home.png */}
        <section style={{ maxWidth: '1240px', margin: '0 auto', padding: '10px 24px 70px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#0c232f', margin: 0 }}>
              شركات الأعلى تقييماً
            </h2>
            <Link to="/companies" style={{ fontSize: '14px', fontWeight: '700', color: '#0d6e75' }}>
              عرض كل الشركات
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {topCompanies.map((c) => (
              <div
                key={c.id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  padding: '24px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}
              >
                {/* Header row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '46px',
                      height: '46px',
                      backgroundColor: '#0d6e75',
                      color: '#ffffff',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      fontWeight: '800'
                    }}>
                      {c.initial}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0c232f', margin: '0 0 3px' }}>
                        {c.name}
                      </h3>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>
                        {c.city}
                      </div>
                    </div>
                  </div>

                  <span style={{
                    backgroundColor: '#e6f9f0',
                    color: '#15803d',
                    fontSize: '12px',
                    fontWeight: '700',
                    padding: '3px 10px',
                    borderRadius: '12px'
                  }}>
                    موثّقة
                  </span>
                </div>

                {/* Rating */}
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#d97706', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>★</span>
                  <span>{c.rating} ({c.reviews} تقييم)</span>
                </div>

                {/* Stats */}
                <div style={{ fontSize: '13px', color: '#64748b' }}>
                  {c.engineers} &nbsp; {c.experience}
                </div>

                {/* Price and CTA */}
                <div style={{ marginTop: 'auto', paddingTop: '8px' }}>
                  <div style={{ fontSize: '14px', color: '#0c232f', marginBottom: '10px' }}>
                    ابتداءً من <span style={{ fontWeight: '800', color: '#0d6e75', fontSize: '18px' }}>{c.price} د.أ</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate(`/book-inspection?company=${c.id}`)}
                    style={{
                      width: '100%',
                      backgroundColor: '#0d6e75',
                      color: '#ffffff',
                      padding: '10px',
                      borderRadius: '8px',
                      fontWeight: '700',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    احجز فحص
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 4: ليش تفقّد؟ matching 01 Home.png */}
        <section style={{ maxWidth: '1240px', margin: '0 auto', padding: '10px 24px 60px' }}>
          <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#0c232f', textAlign: 'center', marginBottom: '32px' }}>
            ليش تفقّد؟
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '28px 24px',
              textAlign: 'center'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0c232f', marginBottom: '12px' }}>
                دفع آمن
              </h3>
              <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.7, margin: 0 }}>
                بتدفع بعد ما تتفق على السعر النهائي، والمبلغ بيتحرّر بعد تسليم التقرير.
              </p>
            </div>

            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '28px 24px',
              textAlign: 'center'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0c232f', marginBottom: '12px' }}>
                شركات موثّقة
              </h3>
              <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.7, margin: 0 }}>
                الأدمن بيراجع ترخيص الشركة وعضوية النقابة قبل ما تظهر بالمنصة.
              </p>
            </div>

            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '28px 24px',
              textAlign: 'center'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0c232f', marginBottom: '12px' }}>
                تقرير مفصّل
              </h3>
              <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.7, margin: 0 }}>
                صور وتقييم لكل بند، وسجل للعقار بتقدر ترجعله بأي وقت.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer showCompanyBanner={true} />
    </div>
  );
}
