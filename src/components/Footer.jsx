import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer({ showCompanyBanner = false }) {
  return (
    <footer style={{ marginTop: 'auto', direction: 'rtl', fontFamily: 'var(--font-family)' }}>
      {showCompanyBanner && (
        <div style={{
          maxWidth: '1240px',
          margin: '40px auto 40px',
          padding: '0 24px'
        }}>
          <div style={{
            backgroundColor: '#0d6e75',
            color: '#ffffff',
            padding: '48px 32px',
            borderRadius: '16px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px'
          }}>
            <h2 style={{ fontSize: '26px', fontWeight: '800', margin: 0 }}>
              عندك مكتب أو شركة هندسية؟
            </h2>
            <p style={{
              color: '#e6f4f5',
              fontSize: '15px',
              maxWidth: '720px',
              margin: '0 auto',
              lineHeight: 1.7
            }}>
              قدّم طلب لإنشاء حساب مكتب، بعد مراجعة الأدمن لترخيصك، بنرسل لك رابط لتعيين كلمة المرور، وبتضيف مهندسينك وأسعارك من لوحة التحكم.
            </p>
            <Link
              to="/register-company"
              style={{
                backgroundColor: '#ffffff',
                color: '#0d6e75',
                padding: '12px 28px',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '15px',
                marginTop: '8px',
                display: 'inline-block',
                transition: 'transform 0.15s',
                textDecoration: 'none'
              }}
            >
              اطلب حساب مكتب
            </Link>
          </div>
        </div>
      )}

      {/* Dark Navy Footer matching Footer.png */}
      <div style={{
        backgroundColor: '#0b2631',
        color: '#ffffff',
        padding: '36px 24px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px'
      }}>
        {/* Brand Name */}
        <Link to="/" style={{ fontSize: '24px', fontWeight: '800', color: '#ffffff', textDecoration: 'none' }}>
          تفقّد
        </Link>

        {/* Links row matching Footer.png */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          fontSize: '14px',
          color: '#cbd5e1',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <Link to="/companies" style={{ textDecoration: 'none', color: '#cbd5e1', transition: 'color 0.2s' }}>
            الشركات
          </Link>
          <Link to="/compare" style={{ textDecoration: 'none', color: '#cbd5e1', transition: 'color 0.2s' }}>
            قارن
          </Link>
          <Link to="/book-inspection" style={{ textDecoration: 'none', color: '#cbd5e1', transition: 'color 0.2s' }}>
            حجز فحص
          </Link>
          <Link to="/register-company" style={{ textDecoration: 'none', color: '#cbd5e1', transition: 'color 0.2s' }}>
            طلب حساب مكتب
          </Link>
        </div>

        {/* Project note matching Footer.png */}
        <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
          مشروع تخرج جامعي ، عمّان، الأردن
        </div>
      </div>
    </footer>
  );
}
