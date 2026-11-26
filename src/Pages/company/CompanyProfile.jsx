import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import CompanySidebar from '../../components/CompanySidebar';
import OfficePricesCard from '../../components/OfficePricesCard';
import OfficeScheduleCard from '../../components/OfficeScheduleCard';
import { getOfficeProfile, updateOfficeProfile, portalErrorMessage } from '../../api/officePortal';

const EMPTY_FORM = { name: '', city: '', phone: '', description: '' };

const toForm = (p) => ({ name: p.name, city: p.city, phone: p.phone ?? '', description: p.description ?? '' });

export default function CompanyProfile() {
  const navigate = useNavigate();
  const location = useLocation();

  // ----- basic data (GET / PUT /office/profile) -----
  const [reloadKey, setReloadKey] = useState(0);
  const [result, setResult] = useState({ key: null, profile: null, error: null });
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saved, setSaved] = useState(false);

  const loading = result.key !== reloadKey;
  const profile = loading ? null : result.profile;
  const loadError = loading ? null : result.error;

  useEffect(() => {
    let ignore = false;
    getOfficeProfile()
      .then((data) => {
        if (ignore) return;
        setForm(toForm(data));
        setResult({ key: reloadKey, profile: data, error: null });
      })
      .catch((err) => {
        if (ignore) return;
        // the session expired: log in again and come back here
        if (err.status === 401) navigate('/login', { replace: true, state: { from: location.pathname } });
        else setResult({ key: reloadKey, profile: null, error: err });
      });
    return () => { ignore = true; };
  }, [reloadKey, navigate, location.pathname]);

  const setField = (field) => (e) => {
    const { value } = e.target;
    setForm((f) => ({ ...f, [field]: value }));
    setSaved(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveError('');
    setSaved(false);
    const body = {
      name: form.name.trim(),
      city: form.city.trim(),
      phone: form.phone.trim(),
      description: form.description.trim() || null,
    };
    if (!body.name || !body.city || !body.phone) {
      setSaveError('اسم الشركة والمدينة والهاتف حقول مطلوبة.');
      return;
    }

    setSaving(true);
    try {
      const updated = await updateOfficeProfile(body);
      setForm(toForm(updated));
      setResult({ key: reloadKey, profile: updated, error: null });
      setSaved(true);
    } catch (err) {
      if (err.status === 401) navigate('/login', { replace: true, state: { from: location.pathname } });
      else setSaveError(portalErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const [engineers, setEngineers] = useState([
    { id: 1, name: 'م. خالد', specialty: 'إنشائي', exp: '12 سنة', status: 'متاح', statusType: 'active' },
    { id: 2, name: 'م. لينا', specialty: 'معماري', exp: '9 سنوات', status: 'متاح', statusType: 'active' },
    { id: 3, name: 'م. عمر', specialty: 'كهرباء', exp: '15 سنة', status: 'متاح', statusType: 'active' },
    { id: 4, name: 'م. هبة', specialty: 'ميكانيك', exp: '8 سنوات', status: 'بانتظار تفعيل الحساب', statusType: 'pending' }
  ]);

  const handleToggleStatus = (id) => {
    setEngineers(engineers.map(eng => {
      if (eng.id === id) {
        const isDeactivated = eng.status === 'معطل';
        return {
          ...eng,
          status: isDeactivated ? 'متاح' : 'معطل',
          statusType: isDeactivated ? 'active' : 'disabled'
        };
      }
      return eng;
    }));
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
            حساب شركة
          </span>
        </div>

        {/* Left Office Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b' }}>{profile?.name ?? ''}</span>
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
            {profile?.name?.trim().charAt(0) ?? ''}
          </div>
        </div>
      </header>

      {/* Main Body with Sidebar */}
      <div style={{ display: 'flex', flex: 1 }}>
        {/* Main Content Area */}
        <main style={{ flex: 1, padding: '36px 48px', overflowY: 'auto' }}>
          <div style={{ maxWidth: '1020px', margin: '0 auto' }}>
            {/* Top Title */}
            <div style={{ marginBottom: '28px' }}>
              <h1 style={{ fontSize: '30px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px' }}>
                الملف والمهندسون
              </h1>
            </div>

            {/* البيانات الأساسية، قائمة الأسعار، ساعات العمل */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              marginBottom: '28px'
            }}>
              {/* Card 1: البيانات الأساسية */}
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                padding: '28px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
              }}>
                <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', marginBottom: '20px' }}>
                  البيانات الأساسية
                </h2>

                {loading && <p style={{ fontSize: '13px', color: '#64748b' }}>جارٍ تحميل بيانات المكتب…</p>}

                {loadError && (
                  <div role="alert" style={{ fontSize: '13px', color: '#b91c1c' }}>
                    <p style={{ margin: '0 0 12px' }}>{portalErrorMessage(loadError)}</p>
                    <button type="button" onClick={() => setReloadKey((k) => k + 1)}
                      style={{ color: '#104f55', border: '1.5px solid #104f55', backgroundColor: '#fff', borderRadius: '8px', padding: '8px 18px', fontWeight: '700', cursor: 'pointer' }}>
                      إعادة المحاولة
                    </button>
                  </div>
                )}

                {profile && (
                <form onSubmit={handleSave} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '6px' }}>
                        اسم الشركة
                      </label>
                      <input
                        type="text"
                        value={form.name}
                        maxLength={200}
                        onChange={setField('name')}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '6px' }}>
                        رقم الترخيص (يعدّله الأدمن فقط)
                      </label>
                      <input
                        type="text"
                        disabled
                        value={profile.licenseNo}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '14px', color: '#64748b' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '6px' }}>
                        المدينة
                      </label>
                      <input
                        type="text"
                        value={form.city}
                        maxLength={80}
                        onChange={setField('city')}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '6px' }}>
                        الهاتف
                      </label>
                      <input
                        type="text"
                        value={form.phone}
                        maxLength={30}
                        onChange={setField('phone')}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', direction: 'ltr', textAlign: 'right' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '6px' }}>
                      الوصف
                    </label>
                    <textarea
                      rows={2}
                      value={form.description}
                      maxLength={1000}
                      onChange={setField('description')}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', resize: 'vertical' }}
                    />
                  </div>

                  {saveError && (
                    <div role="alert" style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', borderRadius: '8px', padding: '10px 12px', fontSize: '12.5px' }}>
                      {saveError}
                    </div>
                  )}
                  {saved && (
                    <div role="status" style={{ backgroundColor: '#e6f7f0', color: '#047857', borderRadius: '8px', padding: '10px 12px', fontSize: '12.5px' }}>
                      تم حفظ البيانات الأساسية.
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={saving}
                    style={{
                      alignSelf: 'flex-start', backgroundColor: '#104f55', color: '#ffffff', padding: '10px 24px',
                      borderRadius: '8px', fontWeight: '700', fontSize: '14px', boxShadow: '0 2px 8px rgba(16, 79, 85, 0.2)',
                      cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1
                    }}
                  >
                    {saving ? 'جارٍ الحفظ…' : 'حفظ التغييرات'}
                  </button>
                </form>
                )}
              </div>

              {/* Card 2: قائمة الأسعار */}
              <OfficePricesCard />

              {/* Card 3: ساعات العمل والسعة */}
              <OfficeScheduleCard />
            </div>

            {/* Bottom Card: المهندسون (4) */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '28px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                  المهندسون ({engineers.length})
                </h2>

                <Link
                  to="/company/add-engineer"
                  style={{
                    backgroundColor: '#104f55',
                    color: '#ffffff',
                    padding: '8px 18px',
                    borderRadius: '8px',
                    fontWeight: '700',
                    fontSize: '13px',
                    textDecoration: 'none',
                    boxShadow: '0 2px 6px rgba(16, 79, 85, 0.2)'
                  }}
                >
                  إضافة مهندس
                </Link>
              </div>

              {/* Table */}
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                    <th style={{ padding: '12px 16px', fontWeight: '600' }}>الاسم</th>
                    <th style={{ padding: '12px 16px', fontWeight: '600' }}>التخصص</th>
                    <th style={{ padding: '12px 16px', fontWeight: '600' }}>الخبرة</th>
                    <th style={{ padding: '12px 16px', fontWeight: '600' }}>الحالة</th>
                    <th style={{ padding: '12px 16px', fontWeight: '600', textAlign: 'center' }}>إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {engineers.map((eng) => (
                    <tr key={eng.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '14px 16px', fontWeight: '700', color: '#0f172a' }}>
                        {eng.name}
                      </td>
                      <td style={{ padding: '14px 16px', color: '#475569' }}>
                        {eng.specialty}
                      </td>
                      <td style={{ padding: '14px 16px', color: '#475569' }}>
                        {eng.exp}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        {eng.statusType === 'active' && (
                          <span style={{
                            backgroundColor: '#e6f7f0',
                            color: '#059669',
                            fontSize: '12px',
                            fontWeight: '700',
                            padding: '3px 10px',
                            borderRadius: '12px'
                          }}>
                            {eng.status}
                          </span>
                        )}
                        {eng.statusType === 'pending' && (
                          <span style={{
                            backgroundColor: '#fffbeb',
                            color: '#d97706',
                            fontSize: '12px',
                            fontWeight: '700',
                            padding: '3px 10px',
                            borderRadius: '12px'
                          }}>
                            {eng.status}
                          </span>
                        )}
                        {eng.statusType === 'disabled' && (
                          <span style={{
                            backgroundColor: '#f1f5f9',
                            color: '#94a3b8',
                            fontSize: '12px',
                            fontWeight: '700',
                            padding: '3px 10px',
                            borderRadius: '12px'
                          }}>
                            {eng.status}
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', fontSize: '13px' }}>
                          <button
                            type="button"
                            onClick={() => alert(`تعديل بيانات ${eng.name}`)}
                            style={{ color: '#104f55', fontWeight: '600', cursor: 'pointer' }}
                          >
                            تعديل
                          </button>

                          {eng.statusType === 'pending' ? (
                            <button
                              type="button"
                              onClick={() => alert(`تمت إعادة إرسال الرابط إلى ${eng.name}`)}
                              style={{ color: '#dc2626', fontWeight: '600', cursor: 'pointer' }}
                            >
                              إعادة إرسال الرابط
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(eng.id)}
                              style={{ color: '#dc2626', fontWeight: '600', cursor: 'pointer' }}
                            >
                              {eng.status === 'معطل' ? 'تفعيل' : 'تعطيل'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <p style={{
                fontSize: '12px',
                color: '#64748b',
                marginTop: '20px',
                lineHeight: 1.5,
                textAlign: 'center'
              }}>
                تغيير السعر أو عدد المهندسين بيتسجل ويظهر للأدمن. الحذف غير متاح للمهندسين: بنعطل الحساب عشان تظل أسماؤهم على التقارير القديمة.
              </p>
            </div>
          </div>
        </main>

        {/* Sidebar on Right */}
        <CompanySidebar />
      </div>
    </div>
  );
}
