import React, { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import CompanySidebar from './CompanySidebar';
import { getOfficeProfile } from '../api/officePortal';
import { OfficeContext } from '../hooks/useOffice';
import './OfficeLayout.css';

// Header + fixed right sidebar for every office page. The page itself is rendered in <Outlet />.
export default function OfficeLayout() {
  const navigate = useNavigate();
  const [officeName, setOfficeName] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);   // only used on narrow screens

  // the real office name for the header, loaded once
  useEffect(() => {
    let ignore = false;
    getOfficeProfile()
      .then((profile) => { if (!ignore) setOfficeName(profile.name); })
      .catch((err) => {
        // the session expired: log in again and come back here. Other errors are shown by the pages.
        if (!ignore && err.status === 401) navigate('/login', { replace: true, state: { from: window.location.pathname } });
      });
    return () => { ignore = true; };
  }, [navigate]);

  return (
    <OfficeContext.Provider value={{ officeName, setOfficeName }}>
      <div className="office-layout">
        <header className="office-header">
          <div className="office-header__brand">
            <button type="button" className="office-menu-button" aria-label="القائمة" aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link to="/" className="office-header__logo">
              <img src="/tafaqqad-logo.svg" alt="تفقّد" />
            </Link>
            <span className="office-header__pill">حساب شركة</span>
          </div>

          <div className="office-header__account">
            <span className="office-header__name">{officeName}</span>
            <div className="office-header__avatar">{officeName.trim().charAt(0)}</div>
          </div>
        </header>

        <CompanySidebar open={menuOpen} onNavigate={() => setMenuOpen(false)} />
        {menuOpen && <div className="office-backdrop" onClick={() => setMenuOpen(false)} />}

        <main className="office-main">
          <Outlet />
        </main>
      </div>
    </OfficeContext.Provider>
  );
}
