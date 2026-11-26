import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PortalLayout from './PortalLayout';
import { getOfficeProfile } from '../api/officePortal';
import { OfficeContext } from '../hooks/useOffice';

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
    links: [{ label: 'إدارة المهندسين', path: '/company/engineers', icon: 'people' }],
  },
];

const BOTTOM = [{ label: 'إدارة الملف', path: '/company/info', icon: 'office' }];

// The office portal: the shared layout with the office menu and the office name in the header.
export default function OfficeLayout() {
  const navigate = useNavigate();
  const [officeName, setOfficeName] = useState('');

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
      <PortalLayout label="حساب شركة" name={officeName} sections={SECTIONS} bottom={BOTTOM} />
    </OfficeContext.Provider>
  );
}
