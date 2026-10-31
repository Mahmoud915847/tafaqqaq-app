import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function MyBookings() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');

  const bookings = [
    {
      id: '1042',
      title: 'شقة، خلدا، عمّان',
      company: 'مكتب الأفق الهندسي',
      engineer: 'المهندس: لم يُعيَّن بعد • الأحد 25 أكتوبر',
      badgeText: 'بانتظار موافقتك على السعر',
      badgeBg: '#fef3c7',
      badgeColor: '#b45309',
      priceText: 'السعر المقترح: 75 د.أ',
      actionText: 'راجع السعر',
      actionType: 'primary',
      link: '/booking/1042',
      category: 'pending_approval'
    },
    {
      id: '1043',
      title: 'فيلا، دابوق، عمّان',
      company: 'شركة الركائز للاستشارات',
      engineer: 'المهندس: لم يُعيَّن بعد • الثلاثاء 27 أكتوبر',
      badgeText: 'بانتظار رد الشركة',
      badgeBg: '#e0f2fe',
      badgeColor: '#0369a1',
      priceText: 'السعر المبدئي: 90 د.أ',
      actionText: 'التفاصيل',
      actionType: 'outline',
      link: '/booking/1043',
      category: 'awaiting_reply'
    },
    {
      id: '1038',
      title: 'أرض، مأدبا',
      company: 'شركة البنيان للفحص',
      engineer: 'م. لينا • الخميس 22 أكتوبر',
      badgeText: 'قيد التنفيذ',
      badgeBg: '#e0f2fe',
      badgeColor: '#0369a1',
      priceText: 'مدفوع: 55 د.أ',
      actionText: 'تابع الفحص',
      actionType: 'outline',
      link: '/booking/1038',
      category: 'in_progress'
    },
    {
      id: '1035',
      title: 'شقة، الجبيهة، عمّان',
      company: 'شركة البنيان للفحص',
      engineer: 'م. عمر • 8 أكتوبر',
      badgeText: 'مكتمل',
      badgeBg: '#e6f9f0',
      badgeColor: '#15803d',
      priceText: 'مدفوع: 48 د.أ',
      actionText: 'عرض التقرير',
      actionType: 'primary',
      link: '/report/RPT-2026-0142',
      category: 'completed'
    },
    {
      id: '1029',
      title: 'شقة، تلاع العلي، عمّان',
      company: 'مكتب المعمار الاستشاري',
      engineer: 'م. هبة • 5 أكتوبر',
      badgeText: 'مكتمل',
      badgeBg: '#e6f9f0',
      badgeColor: '#15803d',
      priceText: 'مدفوع: 75 د.أ',
      actionText: 'عرض التقرير',
      actionType: 'primary',
      link: '/report/RPT-2026-0142',
      category: 'completed'
    }
  ];

  const filtered = bookings.filter(b => {
    if (filter === 'awaiting_reply') return b.category === 'awaiting_reply';
    if (filter === 'in_progress') return b.category === 'in_progress' || b.category === 'pending_approval';
    if (filter === 'completed') return b.category === 'completed';
    return true;
  });

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f5f9fa',
      direction: 'rtl',
      fontFamily: 'var(--font-family)'
    }}>
      <Navbar />

      <main style={{ maxWidth: '1040px', margin: '0 auto', padding: '36px 24px 80px', width: '100%', flex: 1 }}>
        {/* Header matching 10 My Bookings.png */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <button
            type="button"
            onClick={() => navigate('/companies')}
            style={{
              backgroundColor: '#0d6e75',
              color: '#ffffff',
              padding: '10px 22px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            حجز جديد
          </button>

          <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#0c232f', margin: 0 }}>
            حجوزاتي
          </h1>
        </div>

        {/* Filter Pills matching 10 My Bookings.png */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', justifyContent: 'flex-start' }}>
          {[
            { key: 'all', label: 'الكل (5)' },
            { key: 'awaiting_reply', label: 'بانتظار الرد (1)' },
            { key: 'in_progress', label: 'قيد التنفيذ (2)' },
            { key: 'completed', label: 'مكتملة (2)' }
          ].map((pill) => {
            const isSel = filter === pill.key;
            return (
              <button
                key={pill.key}
                type="button"
                onClick={() => setFilter(pill.key)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '16px',
                  border: '1px solid',
                  borderColor: isSel ? '#0d6e75' : '#e2e8f0',
                  backgroundColor: isSel ? '#e0f0f2' : '#ffffff',
                  color: isSel ? '#0d6e75' : '#475569',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                {pill.label}
              </button>
            );
          })}
        </div>

        {/* Bookings List Cards matching 10 My Bookings.png */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filtered.map((b) => (
            <div
              key={b.id}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
                padding: '20px 28px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              {/* Action Button on Left */}
              <button
                type="button"
                onClick={() => navigate(b.link)}
                style={{
                  padding: '9px 24px',
                  borderRadius: '8px',
                  border: b.actionType === 'outline' ? '1.5px solid #0d6e75' : 'none',
                  backgroundColor: b.actionType === 'outline' ? '#ffffff' : '#0d6e75',
                  color: b.actionType === 'outline' ? '#0d6e75' : '#ffffff',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                {b.actionText}
              </button>

              {/* Status Badge & Price Center */}
              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <span style={{
                  backgroundColor: b.badgeBg,
                  color: b.badgeColor,
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '3px 10px',
                  borderRadius: '12px'
                }}>
                  {b.badgeText}
                </span>
                <span style={{ fontSize: '13px', color: '#1e293b', fontWeight: '600' }}>
                  {b.priceText}
                </span>
              </div>

              {/* Booking Info on Right */}
              <div style={{ textAlign: 'right' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0c232f', margin: '0 0 4px' }}>
                  {b.title}
                </h3>
                <div style={{ fontSize: '13px', color: '#475569', marginBottom: '3px' }}>
                  {b.company}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  {b.engineer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
