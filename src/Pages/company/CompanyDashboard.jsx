import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CompanySidebar from '../../components/CompanySidebar';

export default function CompanyDashboard() {
  const navigate = useNavigate();

  const chartData = [
    { day: 'أحد', count: 6 },
    { day: 'اثنين', count: 5 },
    { day: 'ثلاثاء', count: 5 },
    { day: 'أربعاء', count: 4 },
    { day: 'خميس', count: 4 },
    { day: 'جمعة', count: 2 },
    { day: 'سبت', count: 3 }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      direction: 'rtl',
      fontFamily: 'Cairo, Tajawal, sans-serif',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Top Portal Header */}
      <header style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '0 32px',
        height: '68px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0
      }}>
        {/* Right Brand & Portal Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link to="/" style={{ fontSize: '24px', fontWeight: '800', color: '#0d6e75', textDecoration: 'none', letterSpacing: '-0.5px' }}>
            تفقّد
          </Link>
          <span style={{
            backgroundColor: '#e0f0f2',
            color: '#0d6e75',
            fontSize: '13px',
            fontWeight: '600',
            padding: '4px 12px',
            borderRadius: '16px'
          }}>
            حساب شركة
          </span>
        </div>

        {/* Left Office Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '15px', fontWeight: '600', color: '#1e293b' }}>مكتب الأفق الهندسي</span>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '8px',
            backgroundColor: '#0d6e75',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '700',
            fontSize: '17px'
          }}>
            أ
          </div>
        </div>
      </header>

      {/* Main Body with Sidebar (Sidebar is Child 1 -> Far Right in RTL) */}
      <div style={{ display: 'flex', flex: 1, minHeight: 'calc(100vh - 68px)' }}>
        <CompanySidebar />

        {/* Main Content Area (Child 2 -> Left side in RTL) */}
        <main style={{ flex: 1, padding: '36px 48px', overflowY: 'auto' }}>
          <div style={{ maxWidth: '1040px' }}>
            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
              <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#0c232f', margin: '0 0 6px' }}>
                أهلاً، مكتب الأفق
              </h1>
              <p style={{ color: '#64748b', fontSize: '15px', margin: 0 }}>
                ملخص نشاط مكتبك
              </p>
            </div>

            {/* Alert Notification Banner */}
            <div style={{
              backgroundColor: '#fffbeb',
              border: '1px solid #fcd34d',
              borderRadius: '12px',
              padding: '16px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '28px'
            }}>
              <span style={{ fontSize: '15px', fontWeight: '700', color: '#92400e' }}>
                عندك 3 طلبات جديدة بانتظار التعيين
              </span>
              <button
                type="button"
                onClick={() => navigate('/company/orders')}
                style={{
                  backgroundColor: '#0d6e75',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 22px',
                  borderRadius: '8px',
                  fontWeight: '700',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                عرض الطلبات
              </button>
            </div>

            {/* 4 Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
              {/* Stat 1: طلبات جديدة */}
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                padding: '20px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
              }}>
                <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px', fontWeight: '600', textAlign: 'right' }}>
                  طلبات جديدة
                </div>
                <div style={{ fontSize: '32px', fontWeight: '800', color: '#d97706', textAlign: 'center' }}>
                  3
                </div>
              </div>

              {/* Stat 2: قيد التنفيذ */}
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                padding: '20px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
              }}>
                <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px', fontWeight: '600', textAlign: 'right' }}>
                  قيد التنفيذ
                </div>
                <div style={{ fontSize: '32px', fontWeight: '800', color: '#0d6e75', textAlign: 'center' }}>
                  5
                </div>
              </div>

              {/* Stat 3: مكتملة هذا الشهر */}
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                padding: '20px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
              }}>
                <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px', fontWeight: '600', textAlign: 'right' }}>
                  مكتملة هذا الشهر
                </div>
                <div style={{ fontSize: '32px', fontWeight: '800', color: '#0d6e75', textAlign: 'center' }}>
                  21
                </div>
              </div>

              {/* Stat 4: التقييم */}
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                padding: '20px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
              }}>
                <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px', fontWeight: '600', textAlign: 'right' }}>
                  التقييم
                </div>
                <div style={{ fontSize: '30px', fontWeight: '800', color: '#0d6e75', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '26px' }}>★</span>
                  <span>4.8</span>
                </div>
              </div>
            </div>

            {/* Bottom 2 Cards Grid: Weekly Chart & New Requests */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '20px' }}>
              {/* فحوصات آخر 7 أيام (Right Card in RTL) */}
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                padding: '24px 28px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
              }}>
                <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0c232f', marginBottom: '24px', textAlign: 'center' }}>
                  فحوصات آخر 7 أيام
                </h2>

                <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', height: '170px', paddingBottom: '8px' }}>
                  {chartData.map((item, idx) => {
                    const barHeight = item.count * 20; // 6 -> 120px, 2 -> 40px
                    return (
                      <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', width: '42px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b' }}>
                          {item.count}
                        </span>
                        <div style={{
                          width: '36px',
                          height: `${barHeight}px`,
                          backgroundColor: '#0d6e75',
                          borderRadius: '6px 6px 0 0'
                        }} />
                        <span style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                          {item.day}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* طلبات جديدة (Left Card in RTL) */}
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
              }}>
                <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0c232f', marginBottom: '20px' }}>
                  طلبات جديدة
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[
                    { title: 'شقة، خلدا، عمّان', sub: 'عميل · الأحد 25 أكتوبر' },
                    { title: 'فيلا، دابوق، عمّان', sub: 'عميلة · الثلاثاء 27 أكتوبر' },
                    { title: 'مكتب، الشميساني', sub: 'عميل · الأربعاء 28 أكتوبر' }
                  ].map((order, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingBottom: '14px',
                        borderBottom: idx < 2 ? '1px solid #f1f5f9' : 'none'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '15px', fontWeight: '700', color: '#0c232f' }}>
                          {order.title}
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                          {order.sub}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => navigate('/company/orders')}
                        style={{
                          backgroundColor: '#0d6e75',
                          color: '#ffffff',
                          border: 'none',
                          padding: '7px 16px',
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        عيّن مهندس
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
