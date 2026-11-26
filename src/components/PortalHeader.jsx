import React from 'react';
import { Link } from 'react-router-dom';
import { getUser } from '../api/client';
import './PortalHeader.css';

// The top bar of the admin, office and engineer portals: logo + account type on the right,
// account name + first letter on the left.
//   label : "حساب أدمن" / "حساب شركة" / "حساب مهندس"
//   name  : defaults to the logged-in user's name (the office portal passes the office name)
//   onMenu: only for a layout whose sidebar is a drawer on narrow screens
export default function PortalHeader({ label, name, onMenu, menuOpen }) {
  const shownName = name ?? getUser()?.fullName ?? '';

  return (
    <header className={`portal-header${onMenu ? ' portal-header--menu' : ''}`}>
      <div className="portal-header__side">
        {onMenu && (
          <button type="button" className="portal-header__menu" aria-label="القائمة" aria-expanded={menuOpen} onClick={onMenu}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
        <Link to="/" className="portal-header__logo">
          <img src="/tafaqqad-logo.svg" alt="تفقّد" />
        </Link>
        <span className="portal-header__pill">{label}</span>
      </div>

      <div className="portal-header__side">
        <span className="portal-header__name">{shownName}</span>
        <div className="portal-header__avatar">{shownName.trim().charAt(0)}</div>
      </div>
    </header>
  );
}
