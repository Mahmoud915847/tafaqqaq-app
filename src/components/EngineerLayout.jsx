import React from 'react';
import PortalLayout from './PortalLayout';

const SECTIONS = [
  {
    links: [
      { label: 'فحوصاتي', path: '/engineer/inspections', icon: 'orders' },
      // the report screens are still sample data (they wait for the bookings backend)
      { label: 'كتابة تقرير', path: '/engineer/write-report/1038', icon: 'report', also: '/engineer/write-report' },
    ],
  },
];

const BOTTOM = [{ label: 'إدارة الملف', path: '/engineer/profile', icon: 'office' }];

export default function EngineerLayout() {
  return <PortalLayout label="حساب مهندس" sections={SECTIONS} bottom={BOTTOM} />;
}
