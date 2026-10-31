import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function InspectionReport() {
  const { id } = useParams();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleRateSubmit = (e) => {
    e.preventDefault();
    setRatingSubmitted(true);
    alert('شكراً لتقييمك!');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f5f9fa', direction: 'rtl', fontFamily: 'var(--font-family)' }}>
      <Navbar />

      <main style={{ maxWidth: '1040px', margin: '0 auto', padding: '32px 24px 80px', width: '100%', flex: 1 }}>
        {/* Header matching 13 Report.png */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0c232f', margin: '0 0 6px' }}>
              تقرير فحص عقار
            </h1>
            <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>
              شقة، الجبيهة، عمّان • صدر بتاريخ 8 أكتوبر 2026 • RPT-2026-0142
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={handlePrint}
              style={{
                padding: '8px 18px',
                borderRadius: '8px',
                border: '1.5px solid #0d6e75',
                backgroundColor: '#ffffff',
                color: '#0d6e75',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              تحميل PDF
            </button>

            <Link
              to="/bookings"
              style={{
                padding: '8px 18px',
                borderRadius: '8px',
                border: '1.5px solid #0d6e75',
                backgroundColor: '#ffffff',
                color: '#0d6e75',
                fontSize: '13px',
                fontWeight: '700',
                textDecoration: 'none'
              }}
            >
              رجوع لحجوزاتي
            </Link>
          </div>
        </div>

        {/* Summary Card matching 13 Report.png */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '28px 36px',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
        }}>
          {/* Circular Score Ring on Left */}
          <div style={{ position: 'relative', width: '84px', height: '84px', flexShrink: 0 }}>
            <svg width="84" height="84" viewBox="0 0 84 84">
              <circle cx="42" cy="42" r="36" fill="none" stroke="#e2e8f0" strokeWidth="6" />
              <circle
                cx="42"
                cy="42"
                r="36"
                fill="none"
                stroke="#10b981"
                strokeWidth="6"
                strokeDasharray="226"
                strokeDashoffset="41"
                strokeLinecap="round"
                transform="rotate(-90 42 42)"
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
              <span style={{ fontSize: '24px', fontWeight: '800', color: '#0c232f', lineHeight: 1 }}>82</span>
              <span style={{ fontSize: '10px', color: '#64748b' }}>من 100</span>
            </div>
          </div>

          {/* General Assessment in Center */}
          <div style={{ textAlign: 'center', maxWidth: '360px' }}>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>التقييم العام</div>
            <div style={{ fontSize: '20px', fontWeight: '800', color: '#0c232f', marginBottom: '4px' }}>
              حالة جيدة بشكل عام
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              مع ملاحظات على العزل والرطوبة بحاجة لمعالجة.
            </div>
          </div>

          {/* Details on Right */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', textAlign: 'right' }}>
            <div>
              <span style={{ color: '#64748b' }}>الشركة: </span>
              <span style={{ fontWeight: '700', color: '#0c232f' }}>شركة البنيان للفحص</span>
            </div>
            <div>
              <span style={{ color: '#64748b' }}>المهندس: </span>
              <span style={{ fontWeight: '700', color: '#0c232f' }}>م. عمر</span>
            </div>
            <div>
              <span style={{ color: '#64748b' }}>نوع العقار: </span>
              <span style={{ fontWeight: '700', color: '#0c232f' }}>شقة • 118 م² • الطابق 2</span>
            </div>
            <div>
              <span style={{ color: '#64748b' }}>عمر البناء: </span>
              <span style={{ fontWeight: '700', color: '#0c232f' }}>11 سنة</span>
            </div>
          </div>
        </div>

        {/* 5 Category Cards matching 13 Report.png */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          {/* Card 1: الحالة الإنشائية */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
            padding: '24px 28px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{
                backgroundColor: '#e6f9f0',
                color: '#15803d',
                fontSize: '11px',
                fontWeight: '700',
                padding: '3px 10px',
                borderRadius: '10px'
              }}>
                سليم
              </span>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0c232f', margin: 0 }}>
                الحالة الإنشائية
              </h3>
            </div>
            <p style={{ fontSize: '13px', color: '#475569', marginBottom: '16px', margin: '0 0 16px 0', textAlign: 'right' }}>
              لا توجد شروخ إنشائية ظاهرة في الجدران أو الأعمدة، والأساسات بحالة جيدة.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <div style={{ backgroundColor: '#e2e8f0', borderRadius: '8px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '12px' }}>صورة 1</div>
              <div style={{ backgroundColor: '#e2e8f0', borderRadius: '8px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '12px' }}>صورة 2</div>
              <div style={{ backgroundColor: '#e2e8f0', borderRadius: '8px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '12px' }}>صورة 3</div>
            </div>
          </div>

          {/* Card 2: الكهرباء */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
            padding: '24px 28px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{
                backgroundColor: '#e6f9f0',
                color: '#15803d',
                fontSize: '11px',
                fontWeight: '700',
                padding: '3px 10px',
                borderRadius: '10px'
              }}>
                سليم
              </span>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0c232f', margin: 0 }}>
                الكهرباء
              </h3>
            </div>
            <p style={{ fontSize: '13px', color: '#475569', marginBottom: '16px', margin: '0 0 16px 0', textAlign: 'right' }}>
              اللوحة الرئيسية مطابقة والتمديدات سليمة ومؤرضة.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <div style={{ backgroundColor: '#e2e8f0', borderRadius: '8px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '12px' }}>صورة 1</div>
              <div style={{ backgroundColor: '#e2e8f0', borderRadius: '8px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '12px' }}>صورة 2</div>
              <div style={{ backgroundColor: '#e2e8f0', borderRadius: '8px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '12px' }}>صورة 3</div>
            </div>
          </div>

          {/* Card 3: السباكة */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
            padding: '24px 28px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{
                backgroundColor: '#fef3c7',
                color: '#b45309',
                fontSize: '11px',
                fontWeight: '700',
                padding: '3px 10px',
                borderRadius: '10px'
              }}>
                يحتاج صيانة
              </span>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0c232f', margin: 0 }}>
                السباكة
              </h3>
            </div>
            <p style={{ fontSize: '13px', color: '#475569', marginBottom: '16px', margin: '0 0 16px 0', textAlign: 'right' }}>
              تسريب بسيط تحت مغسلة الحمام الرئيسي، يُنصح بالإصلاح.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <div style={{ backgroundColor: '#e2e8f0', borderRadius: '8px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '12px' }}>صورة 1</div>
              <div style={{ backgroundColor: '#e2e8f0', borderRadius: '8px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '12px' }}>صورة 2</div>
              <div style={{ backgroundColor: '#e2e8f0', borderRadius: '8px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '12px' }}>صورة 3</div>
            </div>
          </div>

          {/* Card 4: العزل والرطوبة */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
            padding: '24px 28px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{
                backgroundColor: '#fee2e2',
                color: '#b91c1c',
                fontSize: '11px',
                fontWeight: '700',
                padding: '3px 10px',
                borderRadius: '10px'
              }}>
                حالة سيئة
              </span>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0c232f', margin: 0 }}>
                العزل والرطوبة
              </h3>
            </div>
            <p style={{ fontSize: '13px', color: '#475569', marginBottom: '16px', margin: '0 0 16px 0', textAlign: 'right' }}>
              آثار رطوبة واضحة في سقف غرفة النوم الشمالية، تحتاج معالجة العزل.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <div style={{ backgroundColor: '#e2e8f0', borderRadius: '8px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '12px' }}>صورة 1</div>
              <div style={{ backgroundColor: '#e2e8f0', borderRadius: '8px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '12px' }}>صورة 2</div>
              <div style={{ backgroundColor: '#e2e8f0', borderRadius: '8px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '12px' }}>صورة 3</div>
            </div>
          </div>

          {/* Card 5: التشطيبات */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
            padding: '24px 28px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{
                backgroundColor: '#e6f9f0',
                color: '#15803d',
                fontSize: '11px',
                fontWeight: '700',
                padding: '3px 10px',
                borderRadius: '10px'
              }}>
                سليم
              </span>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0c232f', margin: 0 }}>
                التشطيبات
              </h3>
            </div>
            <p style={{ fontSize: '13px', color: '#475569', marginBottom: '16px', margin: '0 0 16px 0', textAlign: 'right' }}>
              الدهان والبلاط والنوافذ بحالة جيدة مع ملاحظات تجميلية بسيطة.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <div style={{ backgroundColor: '#e2e8f0', borderRadius: '8px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '12px' }}>صورة 1</div>
              <div style={{ backgroundColor: '#e2e8f0', borderRadius: '8px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '12px' }}>صورة 2</div>
              <div style={{ backgroundColor: '#e2e8f0', borderRadius: '8px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '12px' }}>صورة 3</div>
            </div>
          </div>
        </div>

        {/* Rating Card matching 13 Report.png */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '14px',
          border: '1px solid #e2e8f0',
          padding: '28px 36px',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0c232f', marginBottom: '6px' }}>
            قيّم الشركة
          </h3>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '14px' }}>
            كيف كانت تجربتك مع شركة البنيان للفحص؟
          </p>

          {/* Stars */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', fontSize: '24px', color: '#d97706', marginBottom: '18px', cursor: 'pointer' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} onClick={() => setRating(star)}>
                {star <= rating ? '★' : '☆'}
              </span>
            ))}
          </div>

          <form onSubmit={handleRateSubmit} style={{ maxWidth: '520px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#0c232f', marginBottom: '6px', textAlign: 'right' }}>
                تعليقك (اختياري)
              </label>
              <input
                type="text"
                placeholder="اكتب رأيك هنا"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', backgroundColor: '#fff' }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                backgroundColor: '#0d6e75',
                color: '#ffffff',
                padding: '11px',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              أرسل التقييم
            </button>
          </form>

          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '16px' }}>
            أعدّ هذا التقرير المهندس المسؤول عن الفحص، وهو المسؤول عن التقييم الفني.
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
