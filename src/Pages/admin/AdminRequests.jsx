import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';

export default function AdminRequests() {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'pending' | 'info_needed' | 'accepted' | 'rejected'

  const requests = [
    {
      id: 'REQ-2026-0047',
      office: 'مكتب النور الهندسي',
      city: 'عمّان',
      license: '5120',
      date: '12 أكتوبر',
      status: 'pending',
      statusText: 'قيد المراجعة',
      badgeStyle: { backgroundColor: '#fffbeb', color: '#d97706', border: '1px solid #fde68a' }
    },
    {
      id: 'REQ-2026-0046',
      office: 'شركة الأساس للفحص',
      city: 'إربد',
      license: '4977',
      date: '11 أكتوبر',
      status: 'pending',
      statusText: 'قيد المراجعة',
      badgeStyle: { backgroundColor: '#fffbeb', color: '#d97706', border: '1px solid #fde68a' }
    },
    {
      id: 'REQ-2026-0045',
      office: 'مكتب الدار الاستشاري',
      city: 'الزرقاء',
      license: '5033',
      date: '10 أكتوبر',
      status: 'info_needed',
      statusText: 'معلومات مطلوبة',
      badgeStyle: { backgroundColor: '#e0f2fe', color: '#0369a1', border: '1px solid #bae6fd' }
    },
    {
      id: 'REQ-2026-0044',
      office: 'مكتب البناء الحديث',
      city: 'عمّان',
      license: '4801',
      date: '8 أكتوبر',
      status: 'accepted',
      statusText: 'مقبولة',
      badgeStyle: { backgroundColor: '#e6f7f0', color: '#059669', border: '1px solid #a7f3d0' }
    }
  ];

  const filteredRequests = requests.filter((r) => {
    if (activeTab === 'pending') return r.status === 'pending';
    if (activeTab === 'info_needed') return r.status === 'info_needed';
    if (activeTab === 'accepted') return r.status === 'accepted';
    if (activeTab === 'rejected') return r.status === 'rejected';
    return true;
  });

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      direction: 'rtl',
      fontFamily: 'var(--font-family)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Top Navbar */}
      <header style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '12px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Right Brand & Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link to="/" style={{ fontSize: '22px', fontWeight: '800', color: '#104f55', textDecoration: 'none' }}>
            تفقّد
          </Link>
          <span style={{
            backgroundColor: '#e6f0f1',
            color: '#104f55',
            fontSize: '12px',
            fontWeight: '700',
            padding: '3px 10px',
            borderRadius: '16px'
          }}>
            حساب أدمن
          </span>
        </div>

        {/* Left Admin Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b' }}>الأدمن</span>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            backgroundColor: '#104f55',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '700',
            fontSize: '16px'
          }}>
            د
          </div>
        </div>
      </header>

      {/* Main Layout with Sidebar */}
      <div style={{ display: 'flex', flex: 1 }}>
        {/* Main Content Area */}
        <main style={{ flex: 1, padding: '40px 48px', overflowY: 'auto' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: '28px' }}>
              <h1 style={{ fontSize: '30px', fontWeight: '800', color: '#0f172a', margin: '0 0 8px' }}>
                طلبات إنشاء حسابات المكاتب
              </h1>
              <p style={{ color: '#64748b', fontSize: '15px', margin: 0 }}>
                راجع الطلبات الواردة من الصفحة العامة، وأنشئ حساب المكتب عند الموافقة.
              </p>
            </div>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
              {[
                { key: 'pending', label: 'قيد المراجعة (2)' },
                { key: 'info_needed', label: 'معلومات مطلوبة (1)' },
                { key: 'accepted', label: 'مقبولة (12)' },
                { key: 'rejected', label: 'مرفوضة (3)' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    backgroundColor: activeTab === tab.key ? '#e6f0f1' : '#ffffff',
                    color: activeTab === tab.key ? '#104f55' : '#475569',
                    borderColor: activeTab === tab.key ? '#104f55' : '#cbd5e1',
                    transition: 'all 0.2s'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Requests Table Card */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', fontSize: '14px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                    <th style={{ padding: '16px 20px', fontWeight: '600' }}>رقم الطلب</th>
                    <th style={{ padding: '16px 20px', fontWeight: '600' }}>المكتب</th>
                    <th style={{ padding: '16px 20px', fontWeight: '600' }}>المدينة</th>
                    <th style={{ padding: '16px 20px', fontWeight: '600' }}>رقم الترخيص</th>
                    <th style={{ padding: '16px 20px', fontWeight: '600' }}>التاريخ</th>
                    <th style={{ padding: '16px 20px', fontWeight: '600' }}>الحالة</th>
                    <th style={{ padding: '16px 20px', fontWeight: '600', textAlign: 'center' }}>إجراء</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((req) => (
                    <tr key={req.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '16px 20px', fontWeight: '600', color: '#1e293b', fontFamily: 'monospace' }}>
                        {req.id}
                      </td>
                      <td style={{ padding: '16px 20px', fontWeight: '700', color: '#0f172a' }}>
                        {req.office}
                      </td>
                      <td style={{ padding: '16px 20px', color: '#475569' }}>
                        {req.city}
                      </td>
                      <td style={{ padding: '16px 20px', color: '#475569' }}>
                        {req.license}
                      </td>
                      <td style={{ padding: '16px 20px', color: '#475569' }}>
                        {req.date}
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '16px',
                          fontSize: '12px',
                          fontWeight: '700',
                          ...req.badgeStyle
                        }}>
                          {req.statusText}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                        {req.status !== 'accepted' ? (
                          <Link
                            to={`/admin/request/${req.id}`}
                            style={{
                              backgroundColor: '#104f55',
                              color: '#ffffff',
                              padding: '8px 18px',
                              borderRadius: '8px',
                              fontSize: '13px',
                              fontWeight: '700',
                              textDecoration: 'none',
                              display: 'inline-block'
                            }}
                          >
                            مراجعة
                          </Link>
                        ) : (
                          <span style={{ color: '#94a3b8' }}>—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>

        {/* Sidebar on Right */}
        <AdminSidebar />
      </div>
    </div>
  );
}
