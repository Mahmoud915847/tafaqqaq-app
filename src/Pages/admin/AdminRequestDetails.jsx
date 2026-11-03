import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';
import { api, getToken, getUser } from '../../api/client';

const BADGES = {
  Pending: { text: 'قيد المراجعة', style: { backgroundColor: '#fffbeb', color: '#d97706', border: '1px solid #fde68a' } },
  InfoRequested: { text: 'معلومات مطلوبة', style: { backgroundColor: '#e0f2fe', color: '#0369a1', border: '1px solid #bae6fd' } },
  Approved: { text: 'مقبولة', style: { backgroundColor: '#e6f7f0', color: '#059669', border: '1px solid #a7f3d0' } },
  Rejected: { text: 'مرفوضة', style: { backgroundColor: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca' } },
};

const DOC_LABELS = { License: 'صورة الترخيص', CommercialReg: 'السجل التجاري', Logo: 'شعار المكتب' };

const cardStyle = { backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' };

function Field({ title, ltr, children }) {
  return (
    <div>
      <div style={{ color: '#64748b', fontSize: '12px', marginBottom: '4px' }}>{title}</div>
      <div style={{ fontWeight: '600', color: '#1e293b', ...(ltr ? { direction: 'ltr', textAlign: 'right' } : {}) }}>{children}</div>
    </div>
  );
}

function Chip({ ok, children }) {
  return (
    <span style={{ backgroundColor: ok ? '#e6f7f0' : '#fee2e2', color: ok ? '#059669' : '#b91c1c', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '700' }}>
      {ok ? '✓' : '✗'} {children}
    </span>
  );
}

export default function AdminRequestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = getUser();

  const [data, setData] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [notes, setNotes] = useState('');
  const [verifiedSyndicate, setVerifiedSyndicate] = useState(false);
  const [verifiedCR, setVerifiedCR] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState(null); // { type: 'success' | 'warn' | 'error', text }

  const load = useCallback(async () => {
    try {
      const d = await api(`/admin/office-requests/${id}`);
      setData(d);
      setLoadError('');
    } catch (err) {
      if (err.status === 401) navigate('/login', { replace: true });
      else if (err.status === 404) setLoadError('الطلب غير موجود.');
      else if (err.status === 0) setLoadError('تعذّر الاتصال بالخادم. تأكد أن الـ Backend شغّال.');
      else setLoadError('تعذّر تحميل الطلب.');
    }
  }, [id, navigate]);

  useEffect(() => {
    load();
  }, [load]);

  // Sends a decision, then reloads the request so the page shows the new status
  const act = async (path, body, successText, emailFailedText) => {
    setNotice(null);
    setBusy(true);
    try {
      const res = await api(`/admin/office-requests/${id}/${path}`, { method: 'POST', body });
      if (res?.emailSent === false) setNotice({ type: 'warn', text: emailFailedText });
      else setNotice({ type: 'success', text: successText });
      setNotes('');
      await load();
    } catch (err) {
      if (err.status === 0) setNotice({ type: 'error', text: 'تعذّر الاتصال بالخادم.' });
      else setNotice({ type: 'error', text: err.message || 'حدث خطأ غير متوقع.' });
    } finally {
      setBusy(false);
    }
  };

  const handleApprove = () =>
    act(
      'approve',
      { note: notes.trim() || null },
      'تم قبول الطلب وأُرسل رابط تفعيل الحساب لبريد المكتب.',
      'تم قبول الطلب، لكن تعذّر إرسال البريد. استخدم "إعادة إرسال رابط التفعيل".'
    );

  const handleRequestInfo = () => {
    if (!notes.trim()) return setNotice({ type: 'error', text: 'اكتب المعلومات المطلوبة في حقل الملاحظات.' });
    act('request-info', { message: notes.trim() }, 'تم إرسال طلب استكمال المعلومات إلى المكتب.', 'تم تسجيل الطلب، لكن تعذّر إرسال البريد.');
  };

  const handleReject = () => {
    if (!notes.trim()) return setNotice({ type: 'error', text: 'اكتب سبب الرفض في حقل الملاحظات.' });
    if (!window.confirm('هل أنت متأكد من رفض طلب المكتب؟')) return;
    act('reject', { reason: notes.trim() }, 'تم رفض الطلب وإبلاغ المكتب بالسبب.', 'تم رفض الطلب، لكن تعذّر إرسال البريد.');
  };

  const handleResend = () =>
    act('resend-activation', null, 'تم إرسال رابط تفعيل جديد إلى المكتب.', 'تعذّر إرسال البريد.');

  // Files are not public: fetch with the token, then show the file in a new tab
  const openDocument = async (doc) => {
    const win = window.open('', '_blank');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/office-requests/${id}/documents/${doc.id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error('failed');
      const url = URL.createObjectURL(await res.blob());
      if (win) win.location.href = url;
      else window.open(url, '_blank');
    } catch {
      win?.close();
      setNotice({ type: 'error', text: 'تعذّر فتح المستند.' });
    }
  };

  const badge = data ? BADGES[data.status] ?? BADGES.Pending : null;
  const noticeColors = {
    success: { bg: '#e6f7f0', color: '#059669', border: '#a7f3d0' },
    warn: { bg: '#fffbeb', color: '#b45309', border: '#fde68a' },
    error: { bg: '#fee2e2', color: '#b91c1c', border: '#fecaca' },
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', direction: 'rtl', fontFamily: 'var(--font-family)', display: 'flex', flexDirection: 'column' }}>
      <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '12px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link to="/" style={{ fontSize: '22px', fontWeight: '800', color: '#104f55', textDecoration: 'none' }}>تفقّد</Link>
          <span style={{ backgroundColor: '#e6f0f1', color: '#104f55', fontSize: '12px', fontWeight: '700', padding: '3px 10px', borderRadius: '16px' }}>حساب أدمن</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b' }}>{user?.fullName ?? 'الأدمن'}</span>
          <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#104f55', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '16px' }}>
            {(user?.fullName ?? 'د').charAt(0)}
          </div>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1 }}>
        <main style={{ flex: 1, padding: '36px 48px', overflowY: 'auto' }}>
          <div style={{ maxWidth: '1020px', margin: '0 auto' }}>
            <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px' }}>
              <Link to="/admin/requests" style={{ color: '#104f55', fontWeight: '600' }}>طلبات الحسابات</Link>
              <span style={{ margin: '0 8px' }}>/</span>
              <span style={{ color: '#0f172a', fontWeight: '600', fontFamily: 'monospace' }}>{data?.referenceNo ?? '...'}</span>
            </div>

            {loadError && (
              <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', fontSize: '13px' }}>{loadError}</div>
            )}
            {!data && !loadError && <div style={{ color: '#64748b' }}>جارٍ التحميل...</div>}

            {data && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
                  <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', margin: 0, fontFamily: 'monospace' }}>{data.referenceNo}</h1>
                  <span style={{ padding: '4px 14px', borderRadius: '16px', fontSize: '13px', fontWeight: '700', ...badge.style }}>{badge.text}</span>
                </div>

                {notice && (
                  <div style={{ backgroundColor: noticeColors[notice.type].bg, color: noticeColors[notice.type].color, border: `1px solid ${noticeColors[notice.type].border}`, borderRadius: '8px', padding: '10px 14px', fontSize: '13px', fontWeight: '600', marginBottom: '20px' }}>
                    {notice.text}
                  </div>
                )}

                {data.previousReferenceNo && (
                  <div style={{ backgroundColor: '#f1f5f9', borderRadius: '10px', padding: '12px 16px', fontSize: '13px', color: '#334155', marginBottom: '20px', lineHeight: 1.6 }}>
                    هذا طلب مُعاد بعد رفض الطلب السابق <b style={{ fontFamily: 'monospace' }}>{data.previousReferenceNo}</b>
                    {data.previousAdminNotes && <> — سبب الرفض السابق: {data.previousAdminNotes}</>}
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '28px', alignItems: 'start' }}>
                  {/* Office info, documents, automatic checks */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ ...cardStyle, padding: '28px' }}>
                      <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', marginBottom: '20px' }}>بيانات المكتب</h2>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px 24px', fontSize: '14px' }}>
                        <Field title="اسم المكتب">{data.officeName}</Field>
                        <Field title="رقم السجل التجاري">{data.commercialRegNo}</Field>
                        <Field title="رقم ترخيص النقابة">{data.licenseNo}</Field>
                        <Field title="المدينة">{data.city}</Field>
                        <Field title="الشخص المسؤول">{data.contactName}</Field>
                        <Field title="البريد الإلكتروني" ltr>{data.email}</Field>
                        <Field title="الهاتف" ltr>{data.phone}</Field>
                        <Field title="تاريخ التقديم">{new Date(data.submittedAt).toLocaleString('en-GB')}</Field>
                      </div>
                      {data.description && (
                        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                          <div style={{ color: '#64748b', fontSize: '12px', marginBottom: '4px' }}>الوصف</div>
                          <p style={{ color: '#334155', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>{data.description}</p>
                        </div>
                      )}
                    </div>

                    <div style={{ ...cardStyle, padding: '24px 28px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', marginBottom: '16px' }}>المستندات المرفقة</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        {data.documents.map((doc) => (
                          <div
                            key={doc.id}
                            onClick={() => openDocument(doc)}
                            style={{ backgroundColor: '#e2e8f0', borderRadius: '12px', padding: '28px 16px', textAlign: 'center', color: '#475569', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}
                          >
                            {DOC_LABELS[doc.type] ?? doc.type} 📄
                            <div style={{ fontSize: '11px', fontWeight: '500', marginTop: '6px', direction: 'ltr', wordBreak: 'break-all' }}>{doc.fileName}</div>
                            <div style={{ fontSize: '12px', color: '#104f55', marginTop: '6px' }}>اضغط للمعاينة</div>
                          </div>
                        ))}
                        {data.documents.length === 0 && <div style={{ color: '#64748b', fontSize: '13px' }}>لا توجد مستندات.</div>}
                      </div>
                    </div>

                    <div style={{ ...cardStyle, padding: '24px 28px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', marginBottom: '14px' }}>فحوصات تلقائية</h3>
                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <Chip ok={data.autoChecks.licenseNotUsedByOffice}>رقم الترخيص غير مكرر</Chip>
                        <Chip ok={data.autoChecks.emailNotUsedByUser}>البريد غير مستخدم</Chip>
                        <Chip ok={data.autoChecks.noOtherOpenRequest}>لا يوجد طلب مفتوح آخر بنفس البيانات</Chip>
                      </div>
                    </div>
                  </div>

                  {/* Decision panel */}
                  <div style={{ ...cardStyle, position: 'sticky', top: '24px', padding: '28px 24px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', marginBottom: '20px' }}>قرار الأدمن</h3>

                    {(data.status === 'Pending' || data.status === 'InfoRequested') ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                        {data.status === 'InfoRequested' && (
                          <div style={{ fontSize: '13px', color: '#0369a1', backgroundColor: '#e0f2fe', borderRadius: '8px', padding: '10px 12px', lineHeight: 1.6 }}>
                            بانتظار رد المكتب على طلب المعلومات الإضافية.
                          </div>
                        )}

                        {data.status === 'Pending' && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#1e293b', fontWeight: '600', cursor: 'pointer' }}>
                              <input type="checkbox" checked={verifiedSyndicate} onChange={(e) => setVerifiedSyndicate(e.target.checked)} style={{ width: '16px', height: '16px', accentColor: '#104f55' }} />
                              <span>تحققت من الترخيص مع نقابة المهندسين</span>
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#1e293b', fontWeight: '600', cursor: 'pointer' }}>
                              <input type="checkbox" checked={verifiedCR} onChange={(e) => setVerifiedCR(e.target.checked)} style={{ width: '16px', height: '16px', accentColor: '#104f55' }} />
                              <span>تحققت من السجل التجاري</span>
                            </label>
                          </div>
                        )}

                        <div>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '6px' }}>ملاحظات أو سبب الرفض</label>
                          <textarea
                            rows={3}
                            maxLength={500}
                            placeholder="اكتب سبب الرفض أو المعلومات المطلوبة"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', resize: 'vertical' }}
                          />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {data.status === 'Pending' && (
                            <>
                              <button
                                type="button"
                                onClick={handleApprove}
                                disabled={busy || !data.canApprove || !verifiedSyndicate || !verifiedCR}
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#104f55', color: '#ffffff', fontSize: '14px', fontWeight: '700', cursor: 'pointer', opacity: busy || !data.canApprove || !verifiedSyndicate || !verifiedCR ? 0.5 : 1 }}
                              >
                                قبول وإنشاء الحساب
                              </button>
                              {!data.canApprove && (
                                <div style={{ fontSize: '12px', color: '#b91c1c' }}>لا يمكن القبول: أحد الفحوصات التلقائية فشل.</div>
                              )}
                              {data.canApprove && (!verifiedSyndicate || !verifiedCR) && (
                                <div style={{ fontSize: '12px', color: '#64748b' }}>فعّل خانتي التحقق أولاً لتفعيل زر القبول.</div>
                              )}

                              <button
                                type="button"
                                onClick={handleRequestInfo}
                                disabled={busy}
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1.5px solid #104f55', backgroundColor: '#ffffff', color: '#104f55', fontSize: '14px', fontWeight: '700', cursor: 'pointer', opacity: busy ? 0.5 : 1 }}
                              >
                                طلب معلومات إضافية
                              </button>
                            </>
                          )}

                          <button
                            type="button"
                            onClick={handleReject}
                            disabled={busy}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #fecaca', backgroundColor: '#ffffff', color: '#dc2626', fontSize: '14px', fontWeight: '700', cursor: 'pointer', opacity: busy ? 0.5 : 1 }}
                          >
                            رفض الطلب
                          </button>
                        </div>

                        {data.status === 'Pending' && (
                          <p style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.5, margin: '6px 0 0', textAlign: 'center' }}>
                            عند القبول، بيرسل للمكتب رابط لتعيين كلمة المرور (صالح 48 ساعة). المكتب ما بيظهر للعملاء قبل ما يكمّل ملفه.
                          </p>
                        )}
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', color: '#334155', lineHeight: 1.6 }}>
                        <div>
                          {data.status === 'Approved' ? 'تمت الموافقة على هذا الطلب.' : 'تم رفض هذا الطلب.'}
                        </div>
                        {data.reviewedBy && <div>بواسطة: <b>{data.reviewedBy}</b></div>}
                        {data.reviewedAt && <div>بتاريخ: {new Date(data.reviewedAt).toLocaleString('en-GB')}</div>}
                        {data.adminNotes && (
                          <div style={{ backgroundColor: '#f1f5f9', borderRadius: '8px', padding: '10px 12px' }}>{data.adminNotes}</div>
                        )}
                        {data.status === 'Approved' && (
                          <button
                            type="button"
                            onClick={handleResend}
                            disabled={busy}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1.5px solid #104f55', backgroundColor: '#ffffff', color: '#104f55', fontSize: '14px', fontWeight: '700', cursor: 'pointer', opacity: busy ? 0.5 : 1 }}
                          >
                            إعادة إرسال رابط التفعيل
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </main>

        <AdminSidebar />
      </div>
    </div>
  );
}