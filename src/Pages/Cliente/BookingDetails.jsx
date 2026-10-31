import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function BookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const bookingId = id || '1042';

  const [isCancelled, setIsCancelled] = useState(false);

  const handleApprove = () => {
    navigate(`/payment/${bookingId}`);
  };

  const handleReject = () => {
    if (window.confirm('هل أنت متأكد من رفض السعر المقترح وإلغاء الحجز؟')) {
      setIsCancelled(true);
    }
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

      <main style={{ maxWidth: '1080px', margin: '0 auto', padding: '32px 24px 80px', width: '100%', flex: 1 }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
          <Link to="/bookings" style={{ color: '#0d6e75', fontWeight: '600' }}>
            حجوزاتي
          </Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <span style={{ color: '#0c232f', fontWeight: '600' }}>حجز رقم #{bookingId}</span>
        </div>

        {/* Title & Badge matching 11 Booking Details.png */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0c232f', margin: 0 }}>
            شقة، خلدا، عمّان
          </h1>
          <span style={{
            backgroundColor: isCancelled ? '#fee2e2' : '#fef3c7',
            color: isCancelled ? '#b91c1c' : '#b45309',
            fontSize: '12px',
            fontWeight: '700',
            padding: '4px 12px',
            borderRadius: '12px'
          }}>
            {isCancelled ? 'تم إلغاء الحجز' : 'بانتظار موافقتك على السعر'}
          </span>
        </div>

        {/* 6 Step Cards Stepper matching 11 Booking Details.png */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '12px',
          marginBottom: '28px'
        }}>
          {/* Step 1: أُرسل الطلب */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '16px 10px',
            textAlign: 'center'
          }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 8px',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              ✓
            </div>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#0c232f', marginBottom: '3px' }}>
              أُرسل الطلب
            </div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>
              12 أكتوبر
            </div>
          </div>

          {/* Step 2: قبلت الشركة */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '16px 10px',
            textAlign: 'center'
          }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 8px',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              ✓
            </div>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#0c232f', marginBottom: '3px' }}>
              قبلت الشركة
            </div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>
              12 أكتوبر
            </div>
          </div>

          {/* Step 3: عُيّن مهندس */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '16px 10px',
            textAlign: 'center'
          }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 8px',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              ✓
            </div>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#0c232f', marginBottom: '3px' }}>
              عُيّن مهندس
            </div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>
              13 أكتوبر
            </div>
          </div>

          {/* Step 4: موافقة السعر (Active) */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '2px solid #0d6e75',
            padding: '16px 10px',
            textAlign: 'center'
          }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: '#0d6e75',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 8px',
              fontSize: '13px',
              fontWeight: 'bold'
            }}>
              4
            </div>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#0d6e75', marginBottom: '3px' }}>
              موافقة السعر
            </div>
            <div style={{ fontSize: '11px', color: '#b45309', fontWeight: '700' }}>
              بانتظارك
            </div>
          </div>

          {/* Step 5: الدفع */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '16px 10px',
            textAlign: 'center'
          }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              border: '1.5px solid #cbd5e1',
              color: '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 8px',
              fontSize: '13px',
              fontWeight: 'bold'
            }}>
              5
            </div>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#64748b', marginBottom: '3px' }}>
              الدفع
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>
              —
            </div>
          </div>

          {/* Step 6: الفحص والتقرير */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '16px 10px',
            textAlign: 'center'
          }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              border: '1.5px solid #cbd5e1',
              color: '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 8px',
              fontSize: '13px',
              fontWeight: 'bold'
            }}>
              6
            </div>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#64748b', marginBottom: '3px' }}>
              الفحص والتقرير
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>
              —
            </div>
          </div>
        </div>

        {/* 2-Column Layout matching 11 Booking Details.png */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px', alignItems: 'start' }}>
          {/* Right Column: السعر النهائي من الشركة Card (Child 1 in RTL) */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '28px 32px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <span style={{
                backgroundColor: '#fef3c7',
                color: '#b45309',
                fontSize: '12px',
                fontWeight: '700',
                padding: '3px 10px',
                borderRadius: '12px'
              }}>
                بانتظار قرارك
              </span>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0c232f', margin: 0 }}>
                السعر النهائي من الشركة
              </h2>
            </div>

            {/* Price Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px' }}>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '2px' }}>السعر المبدئي</div>
                <div style={{ fontSize: '20px', fontWeight: '700', color: '#64748b' }}>60 د.أ</div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '2px' }}>السعر النهائي</div>
                <div style={{ fontSize: '36px', fontWeight: '900', color: '#0d6e75', lineHeight: 1 }}>
                  75 د.أ
                </div>
              </div>
            </div>

            {/* Amber Reason Notice Box */}
            <div style={{
              backgroundColor: '#fef3c7',
              borderRadius: '10px',
              padding: '14px 18px',
              marginBottom: '24px',
              fontSize: '13px',
              color: '#92400e',
              lineHeight: 1.6
            }}>
              سبب التعديل من الشركة: المساحة 140 م² وعمر البناء أكثر من 20 سنة.
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '14px', marginBottom: '16px' }}>
              <button
                type="button"
                onClick={handleReject}
                style={{
                  flex: 1,
                  padding: '11px',
                  borderRadius: '8px',
                  border: '1.5px solid #ef4444',
                  backgroundColor: '#ffffff',
                  color: '#dc2626',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                أرفض وألغي الحجز
              </button>

              <button
                type="button"
                onClick={handleApprove}
                style={{
                  flex: 1,
                  padding: '11px',
                  borderRadius: '8px',
                  backgroundColor: '#0d6e75',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                أوافق وأتابع للدفع
              </button>
            </div>

            <div style={{ fontSize: '11px', color: '#64748b', textAlign: 'center', lineHeight: 1.5 }}>
              ما بيتم الدفع إلا بعد موافقتك، والمبلغ بيتحرر للشركة بعد تسليم التقرير.
            </div>
          </div>

          {/* Left Column: 3 Cards (Child 2 in RTL) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Card 1: المهندس المعيّن */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              border: '1px solid #e2e8f0',
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#0d6e75',
                  color: '#ffffff',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  fontWeight: '800'
                }}>
                  ل
                </div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: '800', color: '#0c232f' }}>
                    م. لينا
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    معماري • 9 سنوات خبرة
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '14px', fontWeight: '700', color: '#0c232f' }}>
                المهندس المعيّن
              </div>
            </div>

            {/* Card 2: الشركة */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              border: '1px solid #e2e8f0',
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#0d6e75',
                  color: '#ffffff',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  fontWeight: '800'
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

              <div style={{ fontSize: '14px', fontWeight: '700', color: '#0c232f' }}>
                الشركة
              </div>
            </div>

            {/* Card 3: بيانات العقار والموعد */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              border: '1px solid #e2e8f0',
              padding: '20px 24px'
            }}>
              <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#0c232f', marginBottom: '14px', textAlign: 'right' }}>
                بيانات العقار والموعد
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: '600', color: '#0c232f' }}>شقة • 140 م² • الطابق 3</span>
                  <span style={{ color: '#64748b' }}>العقار</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: '600', color: '#0c232f' }}>خلدا، عمّان</span>
                  <span style={{ color: '#64748b' }}>العنوان</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: '600', color: '#0c232f' }}>أكثر من 20 سنة</span>
                  <span style={{ color: '#64748b' }}>عمر البناء</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: '600', color: '#0c232f' }}>الأحد 25 أكتوبر</span>
                  <span style={{ color: '#64748b' }}>الموعد</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
