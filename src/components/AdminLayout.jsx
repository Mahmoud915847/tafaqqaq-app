import React from 'react';
import PortalLayout from './PortalLayout';

const SECTIONS = [
  {
    links: [{ label: 'طلبات الحسابات', path: '/admin/requests', icon: 'requests', also: '/admin/request/' }],
  },
  {
    heading: 'الإدارة',
    links: [
      { label: 'المكاتب', path: '/admin/offices', icon: 'office' },
      { label: 'سجل التغييرات', path: '/admin/audit-log', icon: 'log' },
    ],
  },
];

export default function AdminLayout() {
  return <PortalLayout label="حساب أدمن" sections={SECTIONS} />;
}
