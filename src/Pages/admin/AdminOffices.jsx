import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';

export default function AdminOffices() {
  const [offices, setOffices] = useState([
    {
      id: 1,
      name: 'مكتب الأفق الهندسي',
      city: 'عمّان',
      engineers: 14,
      status: 'active',
      statusText: 'نشطة',
      badgeStyle: { backgroundColor: '#e6f7f0', color: '#059669', border: '1px solid #a7f3d0' }
    },
    {
      id: 2,
      name: 'شركة البنيان للفحص',
      city: 'إربد',
      engineers: 9,
      status: 'active',
      statusText: 'نشطة',
      badgeStyle: { backgroundColor: '#e6f7f0', color: '#059669', border: '1px solid #a7f3d0' }
    },
    {
      id: 3,
      name: 'مكتب النور الهندسي',
      city: 'عمّان',
      engineers: 0,
      status: 'incomplete',
      statusText: 'ملفه غير مكتمل',
      badgeStyle: { backgroundColor: '#fffbeb', color: '#d97706', border: '1px solid #fde68a' }
    },
    {
      id: 4,
      name: 'شركة الجسر للفحص الفني',
      city: 'العقبة',
      engineers: 7,
      status: 'suspended',
      statusText: 'موقوفة',
      badgeStyle: { backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }
    }
  ]);

  const [auditLogs, setAuditLogs] = useState([
    {
      id: 1,
      text: 'مكتب الأفق عدّل سعر الشقة (حتى 120 م²) من 55 إلى 60 د.أ',
      time: 'اليوم 10:20'
    },
    {
      id: 2,
      text: 'شركة البنيان أضافت مهندساً جديداً (م. رامي)',
      time: 'أمس'
    },
    {
      id: 3,
      text: 'الأدمن وافق على طلب REQ-2026-0043 وأرسل رابط التفعيل',
      time: '12 أكتوبر'
    },
    {
      id: 4,
      text: 'تم تعليق حساب شركة الجسر للفحص الفني بقرار الأدمن',
      time: '10 أكتوبر'
    }
  ]);

  const handleAction = (office) => {
    if (office.status === 'active') {
      if (window.confirm(`هل أنت متأكد من تعليق حساب ${office.name}؟`)) {
        setOffices(offices.map(o => o.id === office.id ? {
          ...o,
          status: 'suspended',
          statusText: 'موقوفة',
          badgeStyle: { backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }
        } : o));
        setAuditLogs([{
          id: Date.now(),
          text: `تم تعليق حساب ${office.name} بقرار الأدمن`,
          time: 'الآن'
        }, ...auditLogs]);
      }
    } else if (office.status === 'suspended') {
      setOffices(offices.map(o => o.id === office.id ? {
        ...o,
        status: 'active',
        statusText: 'نشطة',
        badgeStyle: { backgroundColor: '#e6f7f0', color: '#059669', border: '1px solid #a7f3d0' }
      } : o));
      setAuditLogs([{
        id: Date.now(),
        text: `تمت إعادة تفعيل حساب ${office.name}`,
        time: 'الآن'
      }, ...auditLogs]);
    } else if (office.status === 'incomplete') {
      alert(`تمت إعادة إرسال رابط التفعيل إلى بريد ${office.name} بنجاح.`);
    }
  };

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
            <div style={{ marginBottom: '32px' }}>
              <h1 style={{ fontSize: '30px', fontWeight: '800', color: '#0f172a', margin: '0 0 8px' }}>
                المكاتب وسجل التغييرات
              </h1>
              <p style={{ color: '#64748b', fontSize: '15px', margin: 0 }}>
                إدارة حسابات المكاتب ومتابعة تغييرات الأسعار وأعداد المهندسين.
              </p>
            </div>

            {/* Offices Table Card */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              marginBottom: '36px'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', fontSize: '14px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                    <th style={{ padding: '16px 20px', fontWeight: '600' }}>المكتب</th>
                    <th style={{ padding: '16px 20px', fontWeight: '600' }}>المدينة</th>
                    <th style={{ padding: '16px 20px', fontWeight: '600' }}>المهندسون</th>
                    <th style={{ padding: '16px 20px', fontWeight: '600' }}>الحالة</th>
                    <th style={{ padding: '16px 20px', fontWeight: '600', textAlign: 'center' }}>إجراء</th>
                  </tr>
                </thead>
                <tbody>
                  {offices.map((office) => (
                    <tr key={office.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '16px 20px', fontWeight: '700', color: '#0f172a' }}>
                        {office.name}
                      </td>
                      <td style={{ padding: '16px 20px', color: '#475569' }}>
                        {office.city}
                      </td>
                      <td style={{ padding: '16px 20px', color: '#475569' }}>
                        {office.engineers}
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '16px',
                          fontSize: '12px',
                          fontWeight: '700',
                          ...office.badgeStyle
                        }}>
                          {office.statusText}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                        {office.status === 'active' && (
                          <button
                            type="button"
                            onClick={() => handleAction(office)}
                            style={{
                              color: '#dc2626',
                              fontWeight: '700',
                              fontSize: '13px',
                              cursor: 'pointer'
                            }}
                          >
                            تعليق الحساب
                          </button>
                        )}
                        {office.status === 'suspended' && (
                          <button
                            type="button"
                            onClick={() => handleAction(office)}
                            style={{
                              color: '#104f55',
                              fontWeight: '700',
                              fontSize: '13px',
                              cursor: 'pointer'
                            }}
                          >
                            إعادة التفعيل
                          </button>
                        )}
                        {office.status === 'incomplete' && (
                          <button
                            type="button"
                            onClick={() => handleAction(office)}
                            style={{
                              color: '#104f55',
                              fontWeight: '700',
                              fontSize: '13px',
                              cursor: 'pointer'
                            }}
                          >
                            إعادة إرسال الرابط
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Audit Log Card */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              padding: '28px 32px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
            }}>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', marginBottom: '20px' }}>
                سجل التغييرات
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {auditLogs.map((log, idx) => (
                  <div
                    key={log.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '16px 0',
                      borderBottom: idx < auditLogs.length - 1 ? '1px solid #f1f5f9' : 'none',
                      fontSize: '14px'
                    }}
                  >
                    <span style={{ color: '#1e293b', fontWeight: '500' }}>
                      {log.text}
                    </span>
                    <span style={{ color: '#94a3b8', fontSize: '13px', whiteSpace: 'nowrap', marginRight: '16px' }}>
                      {log.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>

        {/* Sidebar on Right */}
        <AdminSidebar />
      </div>
    </div>
  );
}
