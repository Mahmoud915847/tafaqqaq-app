import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';

export default function AdminRequestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const requestId = id || 'REQ-2026-0047';

  const [verifiedSyndicate, setVerifiedSyndicate] = useState(true);
  const [verifiedCR, setVerifiedCR] = useState(true);
  const [notes, setNotes] = useState('');
  const [isDone, setIsDone] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const handleApprove = () => {
    if (!verifiedSyndicate || !verifiedCR) {
      alert('يرجى التحقق من ترخيص النقابة والسجل التجاري قبل الموافقة.');
      return;
    }
    setIsDone(true);
    setStatusMessage('تم قبول الطلب بنجاح وأُرسل رابط تفعيل الحساب لبريد المكتب.');
    setTimeout(() => {
      navigate('/admin/offices');
    }, 1500);
  };

  const handleRequestInfo = () => {
    if (!notes.trim()) {
      alert('يرجى كتابة الملاحظات أو المعلومات المطلوبة في الحقل المخصص.');
      return;
    }
    setIsDone(true);
    setStatusMessage('تم إرسال طلب استكمال معلومات إلى بريد المكتب.');
    setTimeout(() => {
      navigate('/admin/requests');
    }, 1500);
  };

  const handleReject = () => {
    if (!notes.trim()) {
      alert('يرجى توضيح سبب الرفض للمكتب.');
      return;
    }
    if (window.confirm('هل أنت متأكد من رفض طلب المكتب؟')) {
      setIsDone(true);
      setStatusMessage('تم رفض الطلب وإبلاغ المكتب بالسبب.');
      setTimeout(() => {
        navigate('/admin/requests');
      }, 1500);
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
        <main style={{ flex: 1, padding: '36px 48px', overflowY: 'auto' }}>
          <div style={{ maxWidth: '1020px', margin: '0 auto' }}>
            {/* Breadcrumb */}
            <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px' }}>
              <Link to="/admin/requests" style={{ color: '#104f55', fontWeight: '600' }}>
                طلبات الحسابات
              </Link>
              <span style={{ margin: '0 8px' }}>/</span>
              <span style={{ color: '#0f172a', fontWeight: '600' }}>{requestId}</span>
            </div>

            {/* Header with Title and Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px' }}>
              <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', margin: 0, fontFamily: 'monospace' }}>
                {requestId}
              </h1>
              <span style={{
                backgroundColor: '#fffbeb',
                color: '#d97706',
                border: '1px solid #fde68a',
                padding: '4px 14px',
                borderRadius: '16px',
                fontSize: '13px',
                fontWeight: '700'
              }}>
                قيد المراجعة
              </span>
            </div>

            {/* 2-Column Grid: Left decision card, Right office details */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 320px',
              gap: '28px',
              alignItems: 'start'
            }}>
              {/* Right Column: Office Information & Docs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Card 1: بيانات المكتب */}
                <div style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  padding: '28px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                }}>
                  <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', marginBottom: '20px' }}>
                    بيانات المكتب
                  </h2>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px 24px', fontSize: '14px' }}>
                    <div>
                      <div style={{ color: '#64748b', fontSize: '12px', marginBottom: '4px' }}>اسم المكتب</div>
                      <div style={{ fontWeight: '700', color: '#0f172a' }}>مكتب النور الهندسي</div>
                    </div>

                    <div>
                      <div style={{ color: '#64748b', fontSize: '12px', marginBottom: '4px' }}>رقم السجل التجاري</div>
                      <div style={{ fontWeight: '600', color: '#1e293b' }}>2003-48817</div>
                    </div>

                    <div>
                      <div style={{ color: '#64748b', fontSize: '12px', marginBottom: '4px' }}>رقم ترخيص النقابة</div>
                      <div style={{ fontWeight: '600', color: '#1e293b' }}>5120</div>
                    </div>

                    <div>
                      <div style={{ color: '#64748b', fontSize: '12px', marginBottom: '4px' }}>المدينة</div>
                      <div style={{ fontWeight: '600', color: '#1e293b' }}>عمّان</div>
                    </div>

                    <div>
                      <div style={{ color: '#64748b', fontSize: '12px', marginBottom: '4px' }}>الشخص المسؤول</div>
                      <div style={{ fontWeight: '600', color: '#1e293b' }}>سامر الخطيب</div>
                    </div>

                    <div>
                      <div style={{ color: '#64748b', fontSize: '12px', marginBottom: '4px' }}>البريد الإلكتروني</div>
                      <div style={{ fontWeight: '600', color: '#1e293b', direction: 'ltr', textAlign: 'right' }}>
                        nour.office@email.com
                      </div>
                    </div>

                    <div>
                      <div style={{ color: '#64748b', fontSize: '12px', marginBottom: '4px' }}>الهاتف</div>
                      <div style={{ fontWeight: '600', color: '#1e293b', direction: 'ltr', textAlign: 'right' }}>
                        07 9XXX XXXX
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                    <div style={{ color: '#64748b', fontSize: '12px', marginBottom: '4px' }}>الوصف</div>
                    <p style={{ color: '#334155', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
                      مكتب هندسي متخصص بفحص الشقق والفلل، تأسس عام 2014.
                    </p>
                  </div>
                </div>

                {/* Card 2: المستندات المرفقة */}
                <div style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  padding: '24px 28px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', marginBottom: '16px' }}>
                    المستندات المرفقة
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={{
                      backgroundColor: '#e2e8f0',
                      borderRadius: '12px',
                      padding: '36px 16px',
                      textAlign: 'center',
                      color: '#475569',
                      fontSize: '14px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                    onClick={() => alert('معاينة صورة الترخيص')}
                    >
                      صورة الترخيص 📄
                    </div>

                    <div style={{
                      backgroundColor: '#e2e8f0',
                      borderRadius: '12px',
                      padding: '36px 16px',
                      textAlign: 'center',
                      color: '#475569',
                      fontSize: '14px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                    onClick={() => alert('معاينة السجل التجاري')}
                    >
                      السجل التجاري 📑
                    </div>
                  </div>
                </div>

                {/* Card 3: فحوصات تلقائية */}
                <div style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  padding: '24px 28px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', marginBottom: '14px' }}>
                    فحوصات تلقائية
                  </h3>

                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <span style={{
                      backgroundColor: '#e6f7f0',
                      color: '#059669',
                      padding: '6px 14px',
                      borderRadius: '20px',
                      fontSize: '13px',
                      fontWeight: '700'
                    }}>
                      ✓ رقم الترخيص غير مكرر
                    </span>

                    <span style={{
                      backgroundColor: '#e6f7f0',
                      color: '#059669',
                      padding: '6px 14px',
                      borderRadius: '20px',
                      fontSize: '13px',
                      fontWeight: '700'
                    }}>
                      ✓ البريد غير مستخدم
                    </span>
                  </div>
                </div>
              </div>

              {/* Left Column: Admin Decision Panel */}
              <div style={{
                position: 'sticky',
                top: '24px',
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                padding: '28px 24px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', marginBottom: '20px' }}>
                  قرار الأدمن
                </h3>

                {isDone ? (
                  <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <div style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '50%',
                      backgroundColor: '#e6f7f0',
                      color: '#059669',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      margin: '0 auto 12px'
                    }}>
                      ✓
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>
                      {statusMessage}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>جاري التحويل...</div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    {/* Checklist */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#1e293b', fontWeight: '600', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={verifiedSyndicate}
                          onChange={(e) => setVerifiedSyndicate(e.target.checked)}
                          style={{ width: '16px', height: '16px', accentColor: '#104f55' }}
                        />
                        <span>تحققت من الترخيص مع نقابة المهندسين</span>
                      </label>

                      <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#1e293b', fontWeight: '600', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={verifiedCR}
                          onChange={(e) => setVerifiedCR(e.target.checked)}
                          style={{ width: '16px', height: '16px', accentColor: '#104f55' }}
                        />
                        <span>تحققت من السجل التجاري</span>
                      </label>
                    </div>

                    {/* Notes textarea */}
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '6px' }}>
                        ملاحظات أو سبب الرفض
                      </label>
                      <textarea
                        rows={3}
                        placeholder="اكتب سبب الرفض أو المعلومات المطلوبة"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          fontSize: '13px',
                          outline: 'none',
                          resize: 'vertical'
                        }}
                      />
                    </div>

                    {/* Buttons */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <button
                        type="button"
                        onClick={handleApprove}
                        style={{
                          width: '100%',
                          padding: '12px',
                          borderRadius: '8px',
                          backgroundColor: '#104f55',
                          color: '#ffffff',
                          fontSize: '14px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          boxShadow: '0 4px 10px rgba(16, 79, 85, 0.2)'
                        }}
                      >
                        قبول وإنشاء الحساب
                      </button>

                      <button
                        type="button"
                        onClick={handleRequestInfo}
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '8px',
                          border: '1.5px solid #104f55',
                          backgroundColor: '#ffffff',
                          color: '#104f55',
                          fontSize: '14px',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        طلب معلومات إضافية
                      </button>

                      <button
                        type="button"
                        onClick={handleReject}
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '8px',
                          border: '1px solid #fecaca',
                          backgroundColor: '#ffffff',
                          color: '#dc2626',
                          fontSize: '14px',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        رفض الطلب
                      </button>
                    </div>

                    <p style={{
                      fontSize: '11px',
                      color: '#64748b',
                      lineHeight: 1.5,
                      margin: '6px 0 0',
                      textAlign: 'center'
                    }}>
                      عند القبول، بيرسل للمكتب رابط لتعيين كلمة المرور (صالح 48 ساعة). المكتب ما بيظهر للعملاء قبل ما يكمّل ملفه.
                    </p>
                  </div>
                )}
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
