import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar({ selectedCount = 0 }) {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '14px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        direction: 'rtl'
      }}>
        {/* Right Section: Logo & Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          {/* Logo with rounded teal square 'ت' matching Nav Bar.png */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#0d6e75',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontSize: '20px',
              fontWeight: '800',
              lineHeight: 1
            }}>
              ت
            </div>
            <span style={{ fontSize: '24px', fontWeight: '800', color: '#0d6e75', letterSpacing: '-0.5px' }}>
              تفقّد
            </span>
          </Link>

          {/* Links matching Nav Bar.png */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '26px' }}>
            <Link
              to="/"
              style={{
                fontSize: '15px',
                fontWeight: isActive('/') ? '700' : '600',
                color: isActive('/') ? '#0d6e75' : '#1e293b',
                transition: 'color 0.2s'
              }}
            >
              الرئيسية
            </Link>
            <Link
              to="/companies"
              style={{
                fontSize: '15px',
                fontWeight: isActive('/companies') ? '700' : '600',
                color: isActive('/companies') ? '#0d6e75' : '#1e293b',
                transition: 'color 0.2s'
              }}
            >
              الشركات
            </Link>
            <Link
              to="/compare"
              style={{
                fontSize: '15px',
                fontWeight: isActive('/compare') ? '700' : '600',
                color: isActive('/compare') ? '#0d6e75' : '#1e293b',
                position: 'relative',
                transition: 'color 0.2s'
              }}
            >
              قارن
              {selectedCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-8px',
                  left: '-14px',
                  backgroundColor: '#0d6e75',
                  color: '#fff',
                  fontSize: '11px',
                  padding: '1px 6px',
                  borderRadius: '10px'
                }}>
                  {selectedCount}
                </span>
              )}
            </Link>
            <Link
              to="/bookings"
              style={{
                fontSize: '15px',
                fontWeight: isActive('/bookings') || location.pathname.startsWith('/booking') ? '700' : '600',
                color: (isActive('/bookings') || location.pathname.startsWith('/booking')) ? '#0d6e75' : '#1e293b',
                transition: 'color 0.2s'
              }}
            >
              حجوزاتي
            </Link>
          </nav>
        </div>

        {/* Left Section: Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link
            to="/register-company"
            style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#475569',
              textDecoration: 'none'
            }}
          >
            للمكاتب الهندسية
          </Link>

          <Link
            to="/login"
            style={{
              padding: '7px 20px',
              borderRadius: '8px',
              border: '1.5px solid #0d6e75',
              color: '#0d6e75',
              fontSize: '14px',
              fontWeight: '700',
              backgroundColor: '#ffffff',
              textDecoration: 'none',
              transition: 'all 0.2s'
            }}
          >
            دخول
          </Link>

          <Link
            to="/register"
            style={{
              padding: '8px 20px',
              borderRadius: '8px',
              backgroundColor: '#0d6e75',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '700',
              textDecoration: 'none',
              transition: 'background-color 0.2s'
            }}
          >
            إنشاء حساب
          </Link>
        </div>
      </div>
    </header>
  );
}
