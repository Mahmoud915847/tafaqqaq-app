import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { clearSession } from '../api/client';

// The office portal sidebar. It is placed and styled by OfficeLayout (OfficeLayout.css).

const Icon = ({ children }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

const ICONS = {
  dashboard: <Icon><rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" /></Icon>,
  orders: <Icon><path d="m3 6 1.5 1.5L7 5M3 12l1.5 1.5L7 11M3 18l1.5 1.5L7 17M11 6h10M11 12h10M11 18h10" /></Icon>,
  prices: <Icon><path d="M12.6 2.6A2 2 0 0 0 11.2 2H4a2 2 0 0 0-2 2v7.2a2 2 0 0 0 .6 1.4l8.7 8.7a2.4 2.4 0 0 0 3.4 0l6.6-6.6a2.4 2.4 0 0 0 0-3.4z" /><circle cx="7.5" cy="7.5" r="1" /></Icon>,
  schedule: <Icon><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></Icon>,
  engineers: <Icon><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" /></Icon>,
  info: <Icon><path d="M3 10a2 2 0 0 1 .7-1.5l7-6a2 2 0 0 1 2.6 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M9 21v-7a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v7" /></Icon>,
  logout: <Icon><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /></Icon>,
};

const SECTIONS = [
  {
    links: [
      { label: 'لوحة التحكم', path: '/company/dashboard', icon: 'dashboard' },
      { label: 'الطلبات والتعيين', path: '/company/orders', icon: 'orders' },
    ],
  },
  {
    heading: 'إعدادات الخدمة',
    links: [
      { label: 'قائمة الأسعار', path: '/company/prices', icon: 'prices' },
      { label: 'ساعات العمل والسعة اليومية', path: '/company/schedule', icon: 'schedule' },
    ],
  },
  {
    heading: 'الفريق',
    links: [{ label: 'إدارة المهندسين', path: '/company/engineers', icon: 'engineers' }],
  },
];

export default function CompanySidebar({ open, onNavigate }) {
  const item = ({ label, path, icon }) => (
    // NavLink adds the "active" class by route (also for /company/engineers/add)
    <NavLink key={path} to={path} onClick={onNavigate} className="office-link">
      {ICONS[icon]}
      <span>{label}</span>
    </NavLink>
  );

  return (
    <aside className={`office-sidebar${open ? ' office-sidebar--open' : ''}`}>
      <nav className="office-sidebar__group" aria-label="أقسام المكتب">
        {SECTIONS.map((section) => (
          <div key={section.links[0].path} className="office-sidebar__group">
            {section.heading && <div className="office-sidebar__heading">{section.heading}</div>}
            {section.links.map(item)}
          </div>
        ))}
      </nav>

      <div className="office-sidebar__spacer" />

      <div className="office-sidebar__group office-sidebar__bottom">
        {item({ label: 'إدارة الملف', path: '/company/info', icon: 'info' })}
        <Link to="/login" onClick={clearSession} className="office-link office-link--logout">
          {ICONS.logout}
          <span>تسجيل الخروج</span>
        </Link>
      </div>
    </aside>
  );
}
