import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import PortalHeader from './PortalHeader';
import PortalSidebar from './PortalSidebar';
import './PortalLayout.css';

// Header + fixed right sidebar, used by the admin, office and engineer portals.
// The page itself is rendered in <Outlet />.
//   label    : account type in the header
//   name     : header name (defaults to the logged-in user)
//   sections : sidebar items, see PortalSidebar
//   bottom   : items above "تسجيل الخروج"
export default function PortalLayout({ label, name, sections, bottom }) {
  const [menuOpen, setMenuOpen] = useState(false);   // only used on narrow screens

  return (
    <div className="portal-layout">
      <PortalHeader label={label} name={name} menuOpen={menuOpen} onMenu={() => setMenuOpen((open) => !open)} />

      <PortalSidebar sections={sections} bottom={bottom} open={menuOpen} onNavigate={() => setMenuOpen(false)} />
      {menuOpen && <div className="portal-backdrop" onClick={() => setMenuOpen(false)} />}

      <main className="portal-main">
        <Outlet />
      </main>
    </div>
  );
}
