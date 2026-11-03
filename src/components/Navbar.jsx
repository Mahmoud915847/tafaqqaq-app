import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api, clearSession, getToken, getUser } from '../api/client';

const HOME_BY_ROLE = {
  Admin: { path: '/admin/requests', label: 'لوحة الأدمن' },
  Office: { path: '/company/dashboard', label: 'لوحة المكتب' },
  Engineer: { path: '/engineer/inspections', label: 'مهامي' },
};

export default function Navbar({ selectedCount = 0 }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(getUser());

  // Check the saved token once. A bad or expired token logs the user out (api() clears the session on 401).
  useEffect(() => {
    if (!getToken()) return;
    api('/auth/me').catch((err) => {
      if (err.status === 401) setUser(null);
    });
  }, []);

  const handleLogout = () => {
    clearSession();
    setUser(null);
    navigate('/');
  };

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const linkStyle = (active) => ({
    fontSize: '15px',
    fontWeight: active ? '700' : '600',
    color: active ? '#0d6e75' : '#1e293b',
    transition: 'color 0.2s',
  });

  const showBookings = !user || user.role === 'Client';
  const roleHome = user ? HOME_BY_ROLE[user.role] : null;

  return (
    <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', direction: 'rtl' }}>
        {/* Right Section: Logo & Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{ width: '32px', height: '32px', backgroundColor: '#0d6e75', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontSize: '20px', fontWeight: '800', lineHeight: 1 }}>
              ت
            </div>
            <span style={{ fontSize: '24px', fontWeight: '800', color: '#0d6e75', letterSpacing: '-0.5px' }}>تفقّد</span>
          </Link>

          <nav style={{ display: 'flex', alignItems: 'center', gap: '26px' }}>
            <Link to="/" style={linkStyle(isActive('/'))}>الرئيسية</Link>
            <Link to="/companies" style={linkStyle(isActive('/companies'))}>الشركات</Link>
            <Link to="/compare" style={{ ...linkStyle(isActive('/compare')), position: 'relative' }}>
              قارن
              {selectedCount > 0 && (
                <span style={{ position: 'absolute', top: '-8px', left: '-14px', backgroundColor: '#0d6e75', color: '#fff', fontSize: '11px', padding: '1px 6px', borderRadius: '10px' }}>
                  {selectedCount}
                </span>
              )}
            </Link>
            {showBookings && (
              <Link to="/bookings" style={linkStyle(isActive('/bookings') || location.pathname.startsWith('/booking'))}>حجوزاتي</Link>
            )}
            {roleHome && (
              <Link to={roleHome.path} style={linkStyle(location.pathname.startsWith(roleHome.path))}>{roleHome.label}</Link>
            )}
          </nav>
        </div>

        {/* Left Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {user ? (
            <>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#475569', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                أهلاً، {user.fullName}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                style={{ padding: '7px 20px', borderRadius: '8px', border: '1.5px solid #0d6e75', color: '#0d6e75', fontSize: '14px', fontWeight: '700', backgroundColor: '#ffffff', cursor: 'pointer' }}
              >
                خروج
              </button>
            </>
          ) : (
            <>
              <Link to="/register-company" style={{ fontSize: '14px', fontWeight: '600', color: '#475569', textDecoration: 'none' }}>
                للمكاتب الهندسية
              </Link>
              <Link to="/login" style={{ padding: '7px 20px', borderRadius: '8px', border: '1.5px solid #0d6e75', color: '#0d6e75', fontSize: '14px', fontWeight: '700', backgroundColor: '#ffffff', textDecoration: 'none' }}>
                دخول
              </Link>
              <Link to="/register" style={{ padding: '8px 20px', borderRadius: '8px', backgroundColor: '#0d6e75', color: '#ffffff', fontSize: '14px', fontWeight: '700', textDecoration: 'none' }}>
                إنشاء حساب
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}