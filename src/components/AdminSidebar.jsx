import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { clearSession } from '../api/client';

export default function AdminSidebar() {
  const location = useLocation();

  const links = [
    { label: 'طلبات الحسابات', path: '/admin/requests' },
    { label: 'المكاتب وسجل التغييرات', path: '/admin/offices' },
  ];

  return (
    <aside style={{
      width: '240px',
      backgroundColor: '#ffffff',
      borderLeft: '1px solid #e2e8f0',
      minHeight: 'calc(100vh - 61px)',
      padding: '24px 16px',
      display: 'flex',
      flexDirection: 'column',
      direction: 'rtl',
      boxSizing: 'border-box',
      flexShrink: 0
    }}>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        {links.map((link) => {
          const isRequests = link.label === 'طلبات الحسابات' && (location.pathname === '/admin/requests' || location.pathname.startsWith('/admin/request/'));
          const isOffices = link.label === 'المكاتب وسجل التغييرات' && location.pathname === '/admin/offices';
          const active = isRequests || isOffices;

          return (
            <Link
              key={link.path}
              to={link.path}
              style={{
                display: 'block',
                padding: '12px 18px',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: active ? '700' : '600',
                color: active ? '#0d6e75' : '#1e293b',
                backgroundColor: active ? '#e0f0f2' : 'transparent',
                transition: 'all 0.2s',
                textDecoration: 'none'
              }}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ paddingTop: '16px' }}>
        <Link
          to="/login"
          onClick={clearSession}
          style={{
            display: 'block',
            padding: '12px 18px',
            color: '#dc2626',
            fontSize: '15px',
            fontWeight: '600',
            textDecoration: 'none',
            borderRadius: '8px',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#fef2f2')}
          onMouseOut={(e) => (e.target.style.backgroundColor = 'transparent')}
        >
          تسجيل الخروج
        </Link>
      </div>
    </aside>
  );
}
