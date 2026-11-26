import React from 'react';
import OfficePage from '../../components/OfficePage';
import AdminAuditLog from '../../components/AdminAuditLog';

// "سجل التغييرات" (GET /admin/audit-logs)
export default function AdminAuditLogPage() {
  return (
    <OfficePage title="سجل التغييرات" width="1000px">
      <AdminAuditLog />
    </OfficePage>
  );
}
