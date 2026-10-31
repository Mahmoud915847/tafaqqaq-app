import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const bookingId = id || '1042';

  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      navigate('/bookings');
    }, 1500);
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

      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 24px 80px', width: '100%', flex: 1 }}>
        {/* Breadcrumb matching 12 Payment.png */}
        <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '28px' }}>
          <Link to={`/booking/${bookingId}`} style={{ color: '#0d6e75', fontWeight: '600' }}>
            حجز رقم #{bookingId}
          </Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <span style={{ color: '#0c232f', fontWeight: '600' }}>الدفع</span>
        </div>

        {isSuccess ? (
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '48px',
            textAlign: 'center',
            maxWidth: '480px',
            margin: '40px auto'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              backgroundColor: '#e6f9f0',
              color: '#15803d',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              fontWeight: 'bold',
              margin: '0 auto 16px'
            }}>
              ✓
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#0c232f', marginBottom: '8px' }}>
              تم الدفع بنجاح!
            </h2>
            <p style={{ color: '#64748b', fontSize: '13px' }}>
              تم حجز المبلغ بنجاح وسيتحرر للشركة بعد تسليم التقرير.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '28px', alignItems: 'start' }}>
            {/* Form Column on Right (Child 1 in RTL) matching 12 Payment.png */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '32px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0c232f', marginBottom: '24px', textAlign: 'right' }}>
                الدفع الإلكتروني
              </h2>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* رقم البطاقة */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#0c232f', marginBottom: '6px' }}>
                    رقم البطاقة
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="XXXX XXXX XXXX XXXX"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', direction: 'ltr', textAlign: 'right', backgroundColor: '#fff' }}
                  />
                </div>

                {/* اسم حامل البطاقة */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#0c232f', marginBottom: '6px' }}>
                    اسم حامل البطاقة
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="الاسم كما هو على البطاقة"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', backgroundColor: '#fff' }}
                  />
                </div>

                {/* تاريخ الانتهاء و CVV */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#0c232f', marginBottom: '6px' }}>
                      تاريخ الانتهاء
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', direction: 'ltr', textAlign: 'center', backgroundColor: '#fff' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#0c232f', marginBottom: '6px' }}>
                      CVV
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="XXX"
                      maxLength={4}
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', direction: 'ltr', textAlign: 'center', backgroundColor: '#fff' }}
                    />
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    backgroundColor: '#0d6e75',
                    color: '#ffffff',
                    padding: '13px',
                    borderRadius: '8px',
                    fontSize: '15px',
                    fontWeight: '700',
                    marginTop: '8px',
                    cursor: 'pointer'
                  }}
                >
                  ادفع 75 د.أ
                </button>

                <div style={{ fontSize: '11px', color: '#64748b', textAlign: 'center', marginTop: '2px' }}>
                  بياناتك محمية، المبلغ بيتحرر للشركة بعد تسليم التقرير.
                </div>
              </form>
            </div>

            {/* Left Summary Card (Child 2 in RTL) matching 12 Payment.png */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '24px 28px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
            }}>
              <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#0c232f', marginBottom: '20px' }}>
                ملخص الحجز
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: '700', color: '#0c232f' }}>مكتب الأفق الهندسي</span>
                  <span style={{ color: '#64748b' }}>الشركة</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: '700', color: '#0c232f' }}>شقة • خلدا</span>
                  <span style={{ color: '#64748b' }}>العقار</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: '700', color: '#0c232f' }}>الأحد 25 أكتوبر</span>
                  <span style={{ color: '#64748b' }}>الموعد</span>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '24px', fontWeight: '900', color: '#0d6e75' }}>
                  75 د.أ
                </span>
                <span style={{ fontSize: '14px', fontWeight: '700', color: '#0c232f' }}>
                  الإجمالي
                </span>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
