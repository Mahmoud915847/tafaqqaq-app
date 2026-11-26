import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getOfficeProfile, updateOfficeProfile, portalErrorMessage } from '../api/officePortal';
import { useOffice } from '../hooks/useOffice';

// "البيانات الأساسية" on the "إدارة الملف" page (GET / PUT /office/profile)

const EMPTY_FORM = { name: '', city: '', phone: '', description: '' };

const toForm = (p) => ({ name: p.name, city: p.city, phone: p.phone ?? '', description: p.description ?? '' });

export default function OfficeProfileCard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setOfficeName } = useOffice();

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
      setOfficeName(updated.name);   // the header shows the new name
      setSaved(true);
    } catch (err) {
      if (err.status === 401) navigate('/login', { replace: true, state: { from: location.pathname } });
      else setSaveError(portalErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
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
            style={{ color: 'var(--primary)', border: '1.5px solid var(--primary)', backgroundColor: '#fff', borderRadius: '8px', padding: '8px 18px', fontWeight: '700', cursor: 'pointer' }}>
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
            alignSelf: 'flex-start', backgroundColor: 'var(--primary)', color: '#ffffff', padding: '10px 24px',
            borderRadius: '8px', fontWeight: '700', fontSize: '14px', boxShadow: 'var(--shadow-md)',
            cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1
          }}
        >
          {saving ? 'جارٍ الحفظ…' : 'حفظ التغييرات'}
        </button>
      </form>
      )}
    </div>
  );
}
