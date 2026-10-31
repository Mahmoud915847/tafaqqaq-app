import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function RequestSubmitted() {
  const navigate = useNavigate();
  const [trackId, setTrackId] = useState('');
  const [trackEmail, setTrackEmail] = useState('');

  const handleTrack = (e) => {
    e.preventDefault();
    alert(`حالة الطلب ${trackId || 'REQ-2026-0047'}: قيد المراجعة من الأدمن.`);
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
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 20px',
        gap: '24px'
      }}>
        {/* Card 1: Confirmation Card matching 08 Request Submitted.png */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '40px 44px',
          width: '100%',
          maxWidth: '560px',
          textAlign: 'center',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
          border: '1px solid #e2e8f0'
        }}>
          {/* Green checkmark in pill */}
          <div style={{
            width: '180px',
            height: '56px',
            backgroundColor: '#e6f9f0',
            borderRadius: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            color: '#15803d',
            fontSize: '28px',
            fontWeight: 'bold'
          }}>
            ✓
          </div>

          <h1 style={{
            fontSize: '26px',
            fontWeight: '800',
            color: '#0c232f',
            marginBottom: '10px'
          }}>
            تم استلام طلبك
          </h1>

          <p style={{
            color: '#64748b',
            fontSize: '13px',
            lineHeight: 1.6,
            maxWidth: '460px',
            margin: '0 auto 24px'
          }}>
            بنرسل لك إشعار على بريدك بنتيجة المراجعة: قبول، أو رفض مع السبب، أو طلب معلومات إضافية. احتفظ برقم الطلب لمتابعة حالته.
          </p>

          {/* Request ID Display Box */}
          <div style={{
            backgroundColor: '#e6f4f5',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px' }}>
              رقم الطلب
            </div>
            <div style={{
              fontSize: '28px',
              fontWeight: '900',
              color: '#0d6e75',
              letterSpacing: '1px',
              fontFamily: 'monospace',
              marginBottom: '10px'
            }}>
              REQ-2026-0047
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
              <span style={{
                backgroundColor: '#fef3c7',
                color: '#b45309',
                fontSize: '11px',
                fontWeight: '700',
                padding: '3px 10px',
                borderRadius: '12px'
              }}>
                قيد المراجعة
              </span>
              <span style={{
                backgroundColor: '#e6f9f0',
                color: '#15803d',
                fontSize: '11px',
                fontWeight: '700',
                padding: '3px 10px',
                borderRadius: '12px'
              }}>
                تم الإرسال
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/')}
            style={{
              width: '100%',
              backgroundColor: '#0d6e75',
              color: '#ffffff',
              padding: '12px',
              borderRadius: '8px',
              fontWeight: '700',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            العودة للرئيسية
          </button>
        </div>

        {/* Card 2: Track Order Card matching 08 Request Submitted.png */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '28px 36px',
          width: '100%',
          maxWidth: '560px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
          border: '1px solid #e2e8f0'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0c232f', marginBottom: '16px', textAlign: 'center' }}>
            تتبّع طلبك
          </h2>

          <form onSubmit={handleTrack} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#0c232f', marginBottom: '6px' }}>
                  رقم الطلب
                </label>
                <input
                  type="text"
                  placeholder="REQ-2026-XXXX"
                  value={trackId}
                  onChange={(e) => setTrackId(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', direction: 'ltr', textAlign: 'right', backgroundColor: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#0c232f', marginBottom: '6px' }}>
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  placeholder="office@email.com"
                  value={trackEmail}
                  onChange={(e) => setTrackEmail(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', direction: 'ltr', textAlign: 'right', backgroundColor: '#fff' }}
                />
              </div>
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '11px',
                borderRadius: '8px',
                border: '1.5px solid #0d6e75',
                backgroundColor: '#ffffff',
                color: '#0d6e75',
                fontWeight: '700',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              تحقق من الحالة
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
