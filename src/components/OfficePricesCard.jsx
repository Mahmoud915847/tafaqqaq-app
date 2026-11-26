import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getOfficePrices, updateOfficePrices, portalErrorMessage } from '../api/officePortal';
import { PROPERTY_TYPES, propertyTypeLabel } from '../api/offices';

// "قائمة الأسعار" on the company profile page (GET / PUT /office/prices).
// Saving replaces the whole list.

// Same limits as the backend (UpdateOfficePricesRequest / OfficePriceItem)
const MAX_ROWS = 20;
const MIN_PRICE = 1;
const MAX_PRICE = 10000;

const toRows = (items) => items.map((p) => ({
  key: p.id, propertyType: p.propertyType, sizeBand: p.sizeBand ?? '', price: String(p.price),
}));

const labelStyle = { fontSize: '12px', fontWeight: '600', color: '#64748b' };
const inputStyle = {
  width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1',
  fontSize: '14px', outline: 'none', backgroundColor: '#fff'
};
const gridStyle = { display: 'grid', gridTemplateColumns: '1fr 1.4fr 0.7fr 64px', gap: '12px', alignItems: 'center' };
const outlineButton = {
  color: '#104f55', border: '1.5px solid #104f55', backgroundColor: '#fff', borderRadius: '8px',
  padding: '8px 18px', fontWeight: '700', fontSize: '13px', cursor: 'pointer'
};

// Returns an Arabic message for the first problem, or '' when the list is valid
function findProblem(rows) {
  const seen = new Set();
  for (const [index, row] of rows.entries()) {
    const price = Number(row.price);
    if (row.price.trim() === '' || !Number.isFinite(price) || price < MIN_PRICE || price > MAX_PRICE) {
      return `السطر ${index + 1}: السعر يجب أن يكون رقماً بين ${MIN_PRICE} و ${MAX_PRICE}.`;
    }
    const key = `${row.propertyType}|${row.sizeBand.trim().toLowerCase()}`;
    if (seen.has(key)) {
      return `السطر ${index + 1}: «${propertyTypeLabel(row.propertyType)}» مكرر بنفس وصف المساحة.`;
    }
    seen.add(key);
  }
  return '';
}

export default function OfficePricesCard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [reloadKey, setReloadKey] = useState(0);
  const [result, setResult] = useState({ key: null, error: null });
  const [rows, setRows] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saved, setSaved] = useState(false);

  const loading = result.key !== reloadKey;
  const loadError = loading ? null : result.error;
  const ready = !loading && !loadError;

  useEffect(() => {
    let ignore = false;
    getOfficePrices()
      .then((items) => {
        if (ignore) return;
        setRows(toRows(items));
        setResult({ key: reloadKey, error: null });
      })
      .catch((err) => {
        if (ignore) return;
        // the session expired: log in again and come back here
        if (err.status === 401) navigate('/login', { replace: true, state: { from: location.pathname } });
        else setResult({ key: reloadKey, error: err });
      });
    return () => { ignore = true; };
  }, [reloadKey, navigate, location.pathname]);

  // any edit hides the old messages
  const changeRows = (next) => {
    setRows(next);
    setSaved(false);
    setSaveError('');
  };
  const setCell = (key, field) => (e) => {
    const { value } = e.target;
    changeRows(rows.map((r) => (r.key === key ? { ...r, [field]: value } : r)));
  };
  const addRow = () => changeRows([...rows, { key: crypto.randomUUID(), propertyType: 'Apartment', sizeBand: '', price: '' }]);
  const removeRow = (key) => changeRows(rows.filter((r) => r.key !== key));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaved(false);
    const problem = findProblem(rows);
    setSaveError(problem);
    if (problem) return;

    const items = rows.map((r) => ({
      propertyType: r.propertyType,
      sizeBand: r.sizeBand.trim() || null,
      price: Number(r.price),
    }));

    setSaving(true);
    try {
      const updated = await updateOfficePrices(items);
      setRows(toRows(updated));
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
      backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0',
      padding: '28px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
    }}>
      <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', marginBottom: '20px' }}>
        قائمة الأسعار
      </h2>

      {loading && <p style={{ fontSize: '13px', color: '#64748b' }}>جارٍ تحميل الأسعار…</p>}

      {loadError && (
        <div role="alert" style={{ fontSize: '13px', color: '#b91c1c' }}>
          <p style={{ margin: '0 0 12px' }}>{portalErrorMessage(loadError)}</p>
          <button type="button" onClick={() => setReloadKey((k) => k + 1)} style={outlineButton}>إعادة المحاولة</button>
        </div>
      )}

      {ready && (
        <form onSubmit={handleSave} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {rows.length > 0 ? (
            <div style={gridStyle}>
              <span style={labelStyle}>نوع العقار</span>
              <span style={labelStyle}>وصف المساحة (اختياري)</span>
              <span style={labelStyle}>السعر (د.أ)</span>
              <span />
            </div>
          ) : (
            <p style={{ fontSize: '13px', color: '#b45309', backgroundColor: '#fffbeb', borderRadius: '8px', padding: '10px 12px', margin: 0, lineHeight: 1.6 }}>
              لا توجد أسعار. بدون سعر واحد على الأقل يبقى ملف المكتب غير مكتمل ولا يظهر للعملاء.
            </p>
          )}

          {rows.map((row, index) => (
            <div key={row.key} data-testid="price-row" style={gridStyle}>
              <select aria-label={`نوع العقار، السطر ${index + 1}`} value={row.propertyType}
                onChange={setCell(row.key, 'propertyType')} style={inputStyle}>
                {PROPERTY_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
              <input aria-label={`وصف المساحة، السطر ${index + 1}`} type="text" maxLength={60} value={row.sizeBand}
                placeholder="مثال: حتى 120 م²" onChange={setCell(row.key, 'sizeBand')} style={inputStyle} />
              <input aria-label={`السعر، السطر ${index + 1}`} type="number" inputMode="decimal" min={MIN_PRICE} max={MAX_PRICE}
                step="any" value={row.price} onChange={setCell(row.key, 'price')}
                style={{ ...inputStyle, direction: 'ltr', textAlign: 'right' }} />
              <button type="button" onClick={() => removeRow(row.key)}
                style={{ color: '#dc2626', fontWeight: '600', fontSize: '13px', cursor: 'pointer', background: 'none', border: 'none' }}>
                حذف
              </button>
            </div>
          ))}

          {saveError && (
            <div role="alert" style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', borderRadius: '8px', padding: '10px 12px', fontSize: '12.5px' }}>
              {saveError}
            </div>
          )}
          {saved && (
            <div role="status" style={{ backgroundColor: '#e6f7f0', color: '#047857', borderRadius: '8px', padding: '10px 12px', fontSize: '12.5px' }}>
              تم حفظ الأسعار.
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '4px' }}>
            <button
              type="submit"
              disabled={saving}
              style={{
                backgroundColor: '#104f55', color: '#ffffff', padding: '10px 24px', borderRadius: '8px',
                fontWeight: '700', fontSize: '14px', border: 'none',
                cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1
              }}
            >
              {saving ? 'جارٍ الحفظ…' : 'حفظ الأسعار'}
            </button>
            <button type="button" onClick={addRow} disabled={rows.length >= MAX_ROWS}
              style={{ ...outlineButton, opacity: rows.length >= MAX_ROWS ? 0.5 : 1, cursor: rows.length >= MAX_ROWS ? 'not-allowed' : 'pointer' }}>
              + إضافة سعر
            </button>
            <span style={{ fontSize: '12px', color: '#64748b' }}>{rows.length} من {MAX_ROWS}</span>
          </div>
        </form>
      )}
    </div>
  );
}
