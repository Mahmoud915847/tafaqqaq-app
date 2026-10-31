import React from 'react';
import { Link } from 'react-router-dom';
import EngineerSidebar from '../../components/EngineerSidebar';

export default function EngineerInspections() {
  const stats = [
    { label: 'فحوصات اليوم', value: 0 },
    { label: 'قادمة', value: 3 },
    { label: 'بانتظار التقرير', value: 1 }
  ];

  const inspections = [
    {
      id: 1042,
      title: 'شقة، خلدا، عمّان',
      subtitle: 'الأحد 25 أكتوبر · عميل · شقة 140 م²',
      status: 'upcoming',
      badgeText: 'موعد قادم',
      badgeStyle: { backgroundColor: '#e0f2fe', color: '#0369a1' }
    },
    {
      id: 1038,
      title: 'أرض، مأدبا',
      subtitle: 'الخميس 22 أكتوبر · عميل · أرض 600 م²',
      status: 'pending_report',
      badgeText: 'بانتظار التقرير',
      badgeStyle: { backgroundColor: '#fffbeb', color: '#d97706' },
      action: {
        text: 'ابدأ التقرير',
        link: '/engineer/write-report/1038'
      }
    },
    {
      id: 1029,
      title: 'شقة، الرابية، عمّان',
      subtitle: '14 أكتوبر · عميلة · شقة 105 م²',
      status: 'completed',
      badgeText: 'مكتمل',
      badgeStyle: { backgroundColor: '#e6f7f0', color: '#059669' }
    }
  ];

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
            حساب مهندس
          </span>
        </div>

        {/* Left Engineer Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b' }}>م. لينا</span>
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
            ل
          </div>
        </div>
      </header>

      {/* Main Layout with Sidebar */}
      <div style={{ display: 'flex', flex: 1 }}>
        {/* Main Content Area */}
        <main style={{ flex: 1, padding: '40px 48px', overflowY: 'auto' }}>
          <div style={{ maxWidth: '960px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: '32px' }}>
              <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', margin: '0 0 8px' }}>
                فحوصاتي
              </h1>
              <p style={{ color: '#64748b', fontSize: '15px', margin: 0 }}>
                أهلاً م. لينا، هاي الفحوصات المسندة لك من المكتب.
              </p>
            </div>

            {/* Stat Counters */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '20px',
              marginBottom: '32px'
            }}>
              {stats.map((s, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    padding: '24px',
                    textAlign: 'center',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                  }}
                >
                  <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px', fontWeight: '600' }}>
                    {s.label}
                  </div>
                  <div style={{ fontSize: '36px', fontWeight: '800', color: '#0f172a' }}>
                    {s.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Inspection Cards List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {inspections.map((item) => (
                <div
                  key={item.id}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    padding: '24px 28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                    transition: 'border-color 0.2s'
                  }}
                >
                  {/* Info (Right side in RTL) */}
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px' }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
                      {item.subtitle}
                    </p>
                  </div>

                  {/* Actions / Badges (Left side in RTL) */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {item.action && (
                      <Link
                        to={item.action.link}
                        style={{
                          backgroundColor: '#104f55',
                          color: '#ffffff',
                          padding: '10px 22px',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '700',
                          textDecoration: 'none',
                          boxShadow: '0 2px 6px rgba(16, 79, 85, 0.2)'
                        }}
                      >
                        {item.action.text}
                      </Link>
                    )}

                    <span style={{
                      padding: '6px 14px',
                      borderRadius: '20px',
                      fontSize: '13px',
                      fontWeight: '700',
                      ...item.badgeStyle
                    }}>
                      {item.badgeText}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Sidebar on Right */}
        <EngineerSidebar />
      </div>
    </div>
  );
}
