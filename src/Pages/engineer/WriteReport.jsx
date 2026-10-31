import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import EngineerSidebar from '../../components/EngineerSidebar';

export default function WriteReport() {
  const { id } = useParams();
  const navigate = useNavigate();
  const bookingId = id || '1038';

  const [sections, setSections] = useState({
    structural: {
      status: 'clean', // clean | maint | bad
      notes: 'لا توجد شروخ إنشائية ظاهرة، والأساسات بحالة جيدة.',
      photos: ['صورة 1', 'صورة 2']
    },
    electrical: {
      status: 'clean',
      notes: 'اللوحة الرئيسية مطابقة والتمديدات سليمة.',
      photos: ['صورة 1', 'صورة 2']
    },
    plumbing: {
      status: 'maint',
      notes: 'تسريب بسيط تحت مغسلة الحمام الرئيسي.',
      photos: ['صورة 1', 'صورة 2']
    },
    insulation: {
      status: 'bad',
      notes: 'آثار رطوبة في سقف غرفة النوم الشمالية.',
      photos: ['صورة 1', 'صورة 2']
    },
    finishing: {
      status: 'clean',
      notes: 'الدهان والبلاط والنوافذ بحالة جيدة.',
      photos: ['صورة 1', 'صورة 2']
    }
  });

  const [summary, setSummary] = useState('حالة جيدة بشكل عام، مع ملاحظات على العزل والرطوبة بحاجة لمعالجة.');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate score dynamically
  const calculateScore = () => {
    let score = 0;
    Object.values(sections).forEach((s) => {
      if (s.status === 'clean') score += 20;
      else if (s.status === 'maint') score += 12;
      else if (s.status === 'bad') score += 5;
    });
    return score;
  };

  const totalScore = calculateScore();

  const handleStatusChange = (sectionKey, newStatus) => {
    setSections({
      ...sections,
      [sectionKey]: { ...sections[sectionKey], status: newStatus }
    });
  };

  const handleNotesChange = (sectionKey, text) => {
    setSections({
      ...sections,
      [sectionKey]: { ...sections[sectionKey], notes: text }
    });
  };

  const handleAddPhoto = (sectionKey) => {
    const photoCount = sections[sectionKey].photos.length + 1;
    setSections({
      ...sections,
      [sectionKey]: {
        ...sections[sectionKey],
        photos: [...sections[sectionKey].photos, `صورة ${photoCount}`]
      }
    });
  };

  const handleGenerateAI = () => {
    setIsGeneratingAI(true);
    setTimeout(() => {
      setSummary(
        'بناءً على التقييم الميداني، العقار بحالة إنشائية وكهربائية وتشطيبية ممتازة، ولكن يوصى بمعالجة فورية لمصدر الرطوبة في سقف غرفة النوم وعزل تسريب المغسلة لتفادي تفاقم الضرر.'
      );
      setIsGeneratingAI(false);
    }, 900);
  };

  const handleSubmit = (isDraft = false) => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      if (isDraft) {
        alert('تم حفظ المسودة بنجاح.');
      } else {
        alert('تم إصدار التقرير بنجاح وإرسال إشعار للعميل والمكتب!');
        navigate('/engineer/inspections');
      }
    }, 700);
  };

  const sectionTitles = {
    structural: 'الحالة الإنشائية',
    electrical: 'الكهرباء',
    plumbing: 'السباكة',
    insulation: 'العزل والرطوبة',
    finishing: 'التشطيبات'
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
        <main style={{ flex: 1, padding: '36px 48px', overflowY: 'auto' }}>
          <div style={{ maxWidth: '1060px', margin: '0 auto' }}>
            {/* Page Header */}
            <div style={{ marginBottom: '28px' }}>
              <h1 style={{ fontSize: '30px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px' }}>
                كتابة تقرير
              </h1>
              <p style={{ color: '#64748b', fontSize: '15px', margin: 0 }}>
                أرض، مأدبا · حجز #{bookingId}
              </p>
            </div>

            {/* 2-Column Form Layout: Main evaluation forms (right) & Gauge card (left) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 280px',
              gap: '28px',
              alignItems: 'start'
            }}>
              {/* Main Evaluation Sections */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {Object.keys(sectionTitles).map((secKey) => {
                  const sec = sections[secKey];
                  return (
                    <div
                      key={secKey}
                      style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '16px',
                        border: '1px solid #e2e8f0',
                        padding: '24px 28px',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                      }}
                    >
                      {/* Section Header with Status Buttons */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                          {sectionTitles[secKey]}
                        </h2>

                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(secKey, 'clean')}
                            style={{
                              padding: '6px 16px',
                              borderRadius: '8px',
                              fontSize: '13px',
                              fontWeight: '700',
                              cursor: 'pointer',
                              border: sec.status === 'clean' ? 'none' : '1px solid #e2e8f0',
                              backgroundColor: sec.status === 'clean' ? '#10b981' : '#ffffff',
                              color: sec.status === 'clean' ? '#ffffff' : '#64748b',
                              transition: 'all 0.2s'
                            }}
                          >
                            سليم
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStatusChange(secKey, 'maint')}
                            style={{
                              padding: '6px 16px',
                              borderRadius: '8px',
                              fontSize: '13px',
                              fontWeight: '700',
                              cursor: 'pointer',
                              border: sec.status === 'maint' ? 'none' : '1px solid #e2e8f0',
                              backgroundColor: sec.status === 'maint' ? '#f59e0b' : '#ffffff',
                              color: sec.status === 'maint' ? '#ffffff' : '#64748b',
                              transition: 'all 0.2s'
                            }}
                          >
                            يحتاج صيانة
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStatusChange(secKey, 'bad')}
                            style={{
                              padding: '6px 16px',
                              borderRadius: '8px',
                              fontSize: '13px',
                              fontWeight: '700',
                              cursor: 'pointer',
                              border: sec.status === 'bad' ? 'none' : '1px solid #e2e8f0',
                              backgroundColor: sec.status === 'bad' ? '#ef4444' : '#ffffff',
                              color: sec.status === 'bad' ? '#ffffff' : '#64748b',
                              transition: 'all 0.2s'
                            }}
                          >
                            حالة سيئة
                          </button>
                        </div>
                      </div>

                      {/* ملاحظات المهندس */}
                      <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '13px', color: '#64748b', fontWeight: '600', marginBottom: '6px' }}>
                          ملاحظات المهندس
                        </label>
                        <input
                          type="text"
                          value={sec.notes}
                          onChange={(e) => handleNotesChange(secKey, e.target.value)}
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            borderRadius: '8px',
                            border: '1px solid #cbd5e1',
                            fontSize: '14px',
                            outline: 'none'
                          }}
                        />
                      </div>

                      {/* Photo attachments */}
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {sec.photos.map((p, pIdx) => (
                          <div
                            key={pIdx}
                            style={{
                              backgroundColor: '#e2e8f0',
                              color: '#475569',
                              padding: '12px 20px',
                              borderRadius: '8px',
                              fontSize: '13px',
                              fontWeight: '600',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              minWidth: '85px'
                            }}
                          >
                            {p}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => handleAddPhoto(secKey)}
                          style={{
                            border: '1.5px dashed #cbd5e1',
                            backgroundColor: '#ffffff',
                            color: '#104f55',
                            padding: '12px 18px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: '700',
                            cursor: 'pointer'
                          }}
                        >
                          + إضافة صورة
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* Section 6: الملخص العام */}
                <div style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  padding: '24px 28px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                      الملخص العام
                    </h2>
                    <span style={{
                      backgroundColor: '#e6f0f1',
                      color: '#104f55',
                      fontSize: '12px',
                      fontWeight: '700',
                      padding: '2px 8px',
                      borderRadius: '12px'
                    }}>
                      اختياري
                    </span>
                  </div>

                  <label style={{ display: 'block', fontSize: '13px', color: '#64748b', fontWeight: '600', marginBottom: '6px' }}>
                    ملخص للعميل
                  </label>
                  <textarea
                    rows={3}
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '14px',
                      outline: 'none',
                      lineHeight: 1.6,
                      marginBottom: '16px'
                    }}
                  />

                  {/* AI Suggestion Button */}
                  <button
                    type="button"
                    onClick={handleGenerateAI}
                    disabled={isGeneratingAI}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1.5px solid #104f55',
                      backgroundColor: '#ffffff',
                      color: '#104f55',
                      fontSize: '14px',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      cursor: isGeneratingAI ? 'wait' : 'pointer'
                    }}
                  >
                    <span>✨</span>
                    <span>{isGeneratingAI ? 'جاري توليد الملخص الذكي...' : 'اقترح ملخصاً بالذكاء الاصطناعي'}</span>
                  </button>

                  <p style={{
                    fontSize: '12px',
                    color: '#64748b',
                    margin: '10px 0 0',
                    lineHeight: 1.5,
                    textAlign: 'center'
                  }}>
                    المساعد يلخص ملاحظاتك ويشرحها بلغة بسيطة بناءً على تقييمك، أنت المسؤول عن التقييم الفني.
                  </p>
                </div>
              </div>

              {/* Left Column: Circular Score & Action Panel */}
              <div style={{
                position: 'sticky',
                top: '24px',
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                padding: '28px 24px',
                textAlign: 'center',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', marginBottom: '20px' }}>
                  الدرجة العامة
                </h3>

                {/* Circular Score Gauge */}
                <div style={{
                  width: '110px',
                  height: '110px',
                  borderRadius: '50%',
                  border: '8px solid #10b981',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px'
                }}>
                  <span style={{ fontSize: '32px', fontWeight: '900', color: '#0f172a', lineHeight: 1 }}>
                    {totalScore}
                  </span>
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>
                    من 100
                  </span>
                </div>

                <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '20px', lineHeight: 1.4 }}>
                  بتحسب تلقائياً من تقييم البنود الخمسة.
                </p>

                {/* Metrics */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                    <span style={{ color: '#64748b' }}>البنود المكتملة</span>
                    <span style={{ fontWeight: '700', color: '#0f172a' }}>5 من 5</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                    <span style={{ color: '#64748b' }}>الصور المرفقة</span>
                    <span style={{ fontWeight: '700', color: '#0f172a' }}>10</span>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => handleSubmit(false)}
                    disabled={isSubmitting}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: '#104f55',
                      color: '#ffffff',
                      fontSize: '14px',
                      fontWeight: '700',
                      boxShadow: '0 4px 10px rgba(16, 79, 85, 0.2)',
                      cursor: 'pointer'
                    }}
                  >
                    إصدار التقرير
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSubmit(true)}
                    disabled={isSubmitting}
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
                    حفظ كمسودة
                  </button>
                </div>

                <p style={{ fontSize: '11px', color: '#94a3b8', margin: '14px 0 0', lineHeight: 1.4 }}>
                  بعد الإصدار بيوصل العميل إشعار، وما بتقدر تعدّل التقرير.
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* Sidebar on Right */}
        <EngineerSidebar />
      </div>
    </div>
  );
}
