import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CompanySidebar from '../../components/CompanySidebar';

export default function CompanyOrders() {
  const [activeTab, setActiveTab] = useState('new');
  const [selectedOrderId, setSelectedOrderId] = useState('1');
  const [selectedEngineer, setSelectedEngineer] = useState('khaled');
  const [finalPrice, setFinalPrice] = useState('75');
  const [reason, setReason] = useState('المساحة 140 م² وعمر البناء أكثر من 20 سنة');

  const orders = [
    {
      id: '1',
      title: 'شقة، خلدا، عمّان',
      subtitle: 'عميل · الأحد 25 أكتوبر',
      size: 'شقة · 140 م²',
      dateHeading: 'شقة، خلدا · الأحد 25 أكتوبر',
      initialPrice: '60',
      statusBadge: 'جديد'
    },
    {
      id: '2',
      title: 'فيلا، دابوق، عمّان',
      subtitle: 'عميلة · الثلاثاء 27 أكتوبر',
      size: 'فيلا · 280 م²',
      dateHeading: 'فيلا، دابوق · الثلاثاء 27 أكتوبر',
      initialPrice: '120',
      statusBadge: 'جديد'
    },
    {
      id: '3',
      title: 'مكتب، الشميساني',
      subtitle: 'عميل · الأربعاء 28 أكتوبر',
      size: 'مكتب · 90 م²',
      dateHeading: 'مكتب، الشميساني · الأربعاء 28 أكتوبر',
      initialPrice: '90',
      statusBadge: 'جديد'
    }
  ];

  const currentOrder = orders.find(o => o.id === selectedOrderId) || orders[0];

  const engineers = [
    { id: 'khaled', name: 'م. خالد', specialty: 'إنشائي', exp: '12 سنة' },
    { id: 'lina', name: 'م. لينا', specialty: 'معماري', exp: '9 سنوات' },
    { id: 'omar', name: 'م. عمر', specialty: 'كهرباء', exp: '15 سنة' }
  ];

  const handleSendPrice = () => {
    alert(`تم تعيين المهندس وإرسال السعر المقترح (${finalPrice} د.أ) للعميل بنجاح!`);
  };

  const handleReject = () => {
    if (window.confirm('هل أنت متأكد من رفض الطلب؟')) {
      alert('تم رفض الطلب.');
    }
  };

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
        {/* Right Brand & Badge */}
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

      {/* Main Body with Sidebar (Child 1 is Sidebar -> Far Right) */}
      <div style={{ display: 'flex', flex: 1, minHeight: 'calc(100vh - 68px)' }}>
        <CompanySidebar />

        {/* Main Content Area (Child 2 -> Left side) */}
        <main style={{ flex: 1, padding: '36px 48px', overflowY: 'auto' }}>
          <div style={{ maxWidth: '1040px' }}>
            {/* Header */}
            <div style={{ marginBottom: '20px' }}>
              <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#0c232f', margin: '0 0 6px' }}>
                الطلبات وتعيين المهندس
              </h1>
              <p style={{ color: '#64748b', fontSize: '15px', margin: 0 }}>
                اقبل الطلب، عيّن مهندس، وحدد السعر النهائي ليوافق عليه العميل.
              </p>
            </div>

            {/* Filter Tabs / Pills */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
              {[
                { key: 'new', label: 'جديدة (3)', active: true },
                { key: 'awaiting', label: 'بانتظار العميل (2)' },
                { key: 'progress', label: 'قيد التنفيذ (5)' },
                { key: 'completed', label: 'مكتملة' }
              ].map((tab) => {
                const isSelected = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    style={{
                      padding: '6px 16px',
                      borderRadius: '20px',
                      border: 'none',
                      fontSize: '13px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      backgroundColor: isSelected ? '#dcfce7' : '#e0f0f2',
                      color: isSelected ? '#15803d' : '#0d6e75',
                      transition: 'all 0.2s'
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* 2-Column Grid: In RTL, Item 1 is Right Column (Orders List), Item 2 is Left Column (Details) */}
            <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px', alignItems: 'start' }}>
              {/* Right Column in RTL: Orders List Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {orders.map((o) => {
                  const isSelected = selectedOrderId === o.id;
                  return (
                    <div
                      key={o.id}
                      onClick={() => setSelectedOrderId(o.id)}
                      style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '12px',
                        border: isSelected ? '2px solid #0d6e75' : '1px solid #e2e8f0',
                        padding: '18px 20px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0c232f', margin: 0 }}>
                          {o.title}
                        </h3>
                        <span style={{
                          backgroundColor: '#fef3c7',
                          color: '#b45309',
                          fontSize: '11px',
                          fontWeight: '700',
                          padding: '2px 8px',
                          borderRadius: '10px'
                        }}>
                          {o.statusBadge}
                        </span>
                      </div>
                      <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>
                        {o.subtitle}
                      </div>
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                        {o.size}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Left Column in RTL: Selected Order Assignment Details */}
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                padding: '28px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0c232f', margin: 0 }}>
                    {currentOrder.dateHeading}
                  </h2>
                  <span style={{
                    backgroundColor: '#fef3c7',
                    color: '#b45309',
                    fontSize: '11px',
                    fontWeight: '700',
                    padding: '2px 8px',
                    borderRadius: '10px'
                  }}>
                    جديد
                  </span>
                </div>

                <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', marginBottom: '14px' }}>
                  المهندسون المتاحون بهذا اليوم
                </div>

                {/* Engineers Radio List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                  {engineers.map((eng) => {
                    const isSelected = selectedEngineer === eng.id;
                    return (
                      <div
                        key={eng.id}
                        onClick={() => setSelectedEngineer(eng.id)}
                        style={{
                          border: isSelected ? '1.5px solid #0d6e75' : '1px solid #e2e8f0',
                          backgroundColor: isSelected ? '#f0f9fa' : '#ffffff',
                          borderRadius: '10px',
                          padding: '12px 16px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        <div style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          border: isSelected ? '5px solid #0d6e75' : '2px solid #cbd5e1',
                          backgroundColor: '#ffffff'
                        }} />
                        <span style={{ fontWeight: '700', color: '#0c232f', fontSize: '14px' }}>
                          {eng.name}
                        </span>
                        <span style={{ color: '#64748b', fontSize: '13px' }}>
                          · {eng.specialty} · {eng.exp}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Price Adjustment */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '18px',
                  paddingTop: '16px',
                  borderTop: '1px solid #f1f5f9'
                }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
                      السعر المبدئي
                    </div>
                    <div style={{ fontSize: '22px', fontWeight: '800', color: '#0c232f' }}>
                      {currentOrder.initialPrice} د.أ
                    </div>
                  </div>

                  <div style={{ width: '150px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '6px' }}>
                      السعر النهائي (د.أ)
                    </label>
                    <input
                      type="number"
                      value={finalPrice}
                      onChange={(e) => setFinalPrice(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '16px',
                        fontWeight: '700',
                        color: '#0c232f',
                        outline: 'none',
                        textAlign: 'center',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                {/* Reason Input */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '6px' }}>
                    سبب التعديل (يظهر للعميل)
                  </label>
                  <input
                    type="text"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                      color: '#0c232f',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '12px', marginBottom: '14px' }}>
                  <button
                    type="button"
                    onClick={handleSendPrice}
                    style={{
                      backgroundColor: '#0d6e75',
                      color: '#ffffff',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    أرسل السعر للعميل
                  </button>

                  <button
                    type="button"
                    onClick={handleReject}
                    style={{
                      backgroundColor: '#ffffff',
                      color: '#dc2626',
                      border: '1px solid #ef4444',
                      padding: '12px 20px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    رفض الطلب
                  </button>
                </div>

                <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
                  بعد الإرسال، بيوصل العميل إشعار للموافقة على السعر قبل الدفع.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
