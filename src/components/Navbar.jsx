import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api, clearSession, getToken, getUser } from '../api/client';
import './Navbar.css';

// Dashboard link for the non-client roles
const HOME_BY_ROLE = {
  Admin: { path: '/admin/requests', label: 'لوحة الأدمن' },
  Office: { path: '/company/dashboard', label: 'لوحة المكتب' },
  Engineer: { path: '/engineer/inspections', label: 'مهامي' },
};

const ROLE_LABEL = { Client: 'عميل', Office: 'حساب مكتب', Engineer: 'مهندس', Admin: 'أدمن' };

const BuildingIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 21V5.5A1.5 1.5 0 0 1 5.5 4h8A1.5 1.5 0 0 1 15 5.5V21M15 10h3.5A1.5 1.5 0 0 1 20 11.5V21M2.5 21h19M8 8h3M8 12h3M8 16h3"
      stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ChevronIcon = ({ open }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"
    style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>
    <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const MenuIcon = ({ open }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    {open
      ? <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      : <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
  </svg>
);

export default function Navbar({ selectedCount = 0 }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(getUser());
  const [menuOpen, setMenuOpen] = useState(false); // mobile menu
  const [userOpen, setUserOpen] = useState(false); // user dropdown
  const [scrolled, setScrolled] = useState(false);
  const userRef = useRef(null);

  // Check the saved token once. A bad or expired token logs the user out (api() clears the session on 401).
  useEffect(() => {
    if (!getToken()) return;
    api('/auth/me').catch((err) => {
      if (err.status === 401) setUser(null);
    });
  }, []);

  // Soft shadow once the page is scrolled
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the menus when the page changes
  useEffect(() => {
    setMenuOpen(false);
    setUserOpen(false);
  }, [location.pathname]);

  // Close the user dropdown when clicking outside it or pressing Escape
  useEffect(() => {
    if (!userOpen) return;
    const onClick = (e) => { if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setUserOpen(false); };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [userOpen]);

  const handleLogout = () => {
    clearSession();
    setUser(null);
    setUserOpen(false);
    navigate('/');
  };

  const isActive = (link) => {
    if (link.to === '/') return location.pathname === '/';
    return location.pathname.startsWith(link.to) || (link.also && location.pathname.startsWith(link.also));
  };

  const roleHome = user ? HOME_BY_ROLE[user.role] : null;
  const links = [
    { to: '/', label: 'الرئيسية' },
    { to: '/companies', label: 'الشركات' },
    { to: '/compare', label: 'قارن', badge: selectedCount },
    ...(!user || user.role === 'Client' ? [{ to: '/bookings', label: 'حجوزاتي', also: '/booking/' }] : []),
    ...(roleHome ? [{ to: roleHome.path, label: roleHome.label }] : []),
  ];

  const initial = (user?.fullName || '؟').trim().charAt(0);

  return (
    <header className={`tq-nav${scrolled ? ' is-scrolled' : ''}`}>
      <div className="tq-nav__inner">
        {/* Logo (right side, RTL) */}
        <Link to="/" className="tq-nav__brand" aria-label="تفقد - الصفحة الرئيسية">
          <img src="/tafaqqad-logo.svg" alt="تفقد" />
        </Link>

        {/* Main links (on mobile this becomes the dropdown panel) */}
        <nav className={`tq-nav__links${menuOpen ? ' is-open' : ''}`} aria-label="القائمة الرئيسية">
          {links.map((link) => {
            const active = isActive(link);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`tq-nav__link${active ? ' is-active' : ''}`}
                aria-current={active ? 'page' : undefined}
              >
                {link.label}
                {link.badge > 0 && <span className="tq-nav__badge">{link.badge}</span>}
              </Link>
            );
          })}
          {!user && (
            <Link to="/register-company" className="tq-nav__link tq-nav__mobile-only">
              للمكاتب الهندسية
            </Link>
          )}
        </nav>

        {/* Actions (left side) */}
        <div className="tq-nav__actions">
          {user ? (
            <div className="tq-user" ref={userRef}>
              <button
                type="button"
                className="tq-user__chip"
                onClick={() => setUserOpen((o) => !o)}
                aria-haspopup="menu"
                aria-expanded={userOpen}
              >
                <span className="tq-user__avatar">{initial}</span>
                <span className="tq-user__name">{user.fullName}</span>
                <ChevronIcon open={userOpen} />
              </button>

              {userOpen && (
                <div className="tq-user__menu" role="menu">
                  <div className="tq-user__head">
                    <strong>{user.fullName}</strong>
                    <span className="tq-user__email">{user.email}</span>
                    <span className="tq-user__role">{ROLE_LABEL[user.role] ?? user.role}</span>
                  </div>
                  {roleHome ? (
                    <Link to={roleHome.path} role="menuitem" className="tq-user__item">{roleHome.label}</Link>
                  ) : (
                    <Link to="/bookings" role="menuitem" className="tq-user__item">حجوزاتي</Link>
                  )}
                  <button type="button" role="menuitem" className="tq-user__item is-danger" onClick={handleLogout}>
                    تسجيل الخروج
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/register-company" className="tq-nav__office">
                <BuildingIcon />
                للمكاتب الهندسية
              </Link>
              <span className="tq-nav__divider" aria-hidden="true" />
              <Link to="/login" className="tq-btn tq-btn--outline">دخول</Link>
              <Link to="/register" className="tq-btn tq-btn--primary">إنشاء حساب</Link>
            </>
          )}

          <button
            type="button"
            className="tq-nav__burger"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
          >
            <MenuIcon open={menuOpen} />
          </button>
        </div>
      </div>
    </header>
  );
}
