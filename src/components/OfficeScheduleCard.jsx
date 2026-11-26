import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getOfficeSchedule, updateOfficeSchedule, portalErrorMessage } from '../api/officePortal';
import { weekdayLabel } from '../api/offices';

// "ساعات العمل والسعة" on the company profile page (GET / PUT /office/schedule).
// Saving sends the daily capacity and all 7 days.

// Same limits as the backend (UpdateOfficeScheduleRequest)
const MIN_CAPACITY = 1;
const MAX_CAPACITY = 50;

// suggested times when a day that has none is opened
const DEFAULT_OPEN = '09:00';
const DEFAULT_CLOSE = '17:00';

// a new office has capacity 0 and all days closed
const toForm = (schedule) => ({
  capacity: schedule.dailyCapacity > 0 ? String(schedule.dailyCapacity) : '',
  days: schedule.days.map((d) => ({
    weekday: d.weekday, isClosed: d.isClosed, openTime: d.openTime ?? '', closeTime: d.closeTime ?? '',
  })),
});

const inputStyle = {
  padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1',
  fontSize: '14px', outline: 'none', backgroundColor: '#fff'
};
const gridStyle = { display: 'grid', gridTemplateColumns: '100px 90px 1fr 1fr', gap: '12px', alignItems: 'center' };
const labelStyle = { fontSize: '12px', fontWeight: '600', color: '#64748b' };

// Returns an Arabic message for the first problem, or '' when the schedule is valid
function findProblem({ capacity, days }) {
  const n = Number(capacity);
  if (!Number.isInteger(n) || n < MIN_CAPACITY || n > MAX_CAPACITY) {
    return `السعة اليومية يجب أن تكون عدداً صحيحاً بين ${MIN_CAPACITY} و ${MAX_CAPACITY}.`;
  }
  if (days.every((d) => d.isClosed)) return 'يجب أن يعمل المكتب يوماً واحداً على الأقل في الأسبوع.';
  for (const d of days) {
    if (d.isClosed) continue;
    if (!d.openTime || !d.closeTime) return `${weekdayLabel(d.weekday)}: حدّد وقت الفتح ووقت الإغلاق.`;
    // both are "HH:mm", so comparing the text compares the time
    if (d.openTime >= d.closeTime) return `${weekdayLabel(d.weekday)}: وقت الإغلاق يجب أن يكون بعد وقت الفتح.`;
  }
  return '';
}

export default function OfficeScheduleCard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [reloadKey, setReloadKey] = useState(0);
  const [result, setResult] = useState({ key: null, error: null });
  const [form, setForm] = useState({ capacity: '', days: [] });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saved, setSaved] = useState(false);

  const loading = result.key !== reloadKey;
  const loadError = loading ? null : result.error;
  const ready = !loading && !loadError;

  useEffect(() => {
    let ignore = false;
    getOfficeSchedule()
      .then((schedule) => {
        if (ignore) return;
        setForm(toForm(schedule));
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
  const change = (next) => {
    setForm(next);
    setSaved(false);
    setSaveError('');
  };
  const changeDay = (weekday, patch) =>
    change({ ...form, days: form.days.map((d) => (d.weekday === weekday ? { ...d, ...patch } : d)) });

  const toggleDay = (day, open) => changeDay(day.weekday, {
    isClosed: !open,
    openTime: open ? day.openTime || DEFAULT_OPEN : day.openTime,
    closeTime: open ? day.closeTime || DEFAULT_CLOSE : day.closeTime,
  });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaved(false);
    const problem = findProblem(form);
    setSaveError(problem);
    if (problem) return;

    const body = {
      dailyCapacity: Number(form.capacity),
      days: form.days.map((d) => ({
        weekday: d.weekday,
        isClosed: d.isClosed,
        openTime: d.isClosed ? null : d.openTime,
        closeTime: d.isClosed ? null : d.closeTime,
      })),
    };

    setSaving(true);
    try {
      const updated = await updateOfficeSchedule(body);
      setForm(toForm(updated));
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
        ساعات العمل والسعة اليومية
      </h2>

      {loading && <p style={{ fontSize: '13px', color: '#64748b' }}>جارٍ تحميل ساعات العمل…</p>}

      {loadError && (
        <div role="alert" style={{ fontSize: '13px', color: '#b91c1c' }}>
          <p style={{ margin: '0 0 12px' }}>{portalErrorMessage(loadError)}</p>
          <button type="button" onClick={() => setReloadKey((k) => k + 1)}
            style={{ color: '#104f55', border: '1.5px solid #104f55', backgroundColor: '#fff', borderRadius: '8px', padding: '8px 18px', fontWeight: '700', cursor: 'pointer' }}>
            إعادة المحاولة
          </button>
        </div>
      )}

      {ready && (
        <form onSubmit={handleSave} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px', fontSize: '14px', color: '#1e293b' }}>
            <span>السعة اليومية (عدد الفحوصات في اليوم)</span>
            <input type="number" inputMode="numeric" min={MIN_CAPACITY} max={MAX_CAPACITY} value={form.capacity}
              onChange={(e) => change({ ...form, capacity: e.target.value })}
              style={{ ...inputStyle, width: '100px', direction: 'ltr', textAlign: 'right' }} />
          </label>

          <div style={gridStyle}>
            <span style={labelStyle}>اليوم</span>
            <span style={labelStyle}>مفتوح</span>
            <span style={labelStyle}>من</span>
            <span style={labelStyle}>إلى</span>
          </div>

          {form.days.map((day) => {
            const name = weekdayLabel(day.weekday);
            const timeStyle = { ...inputStyle, width: '100%', opacity: day.isClosed ? 0.45 : 1 };
            return (
              <div key={day.weekday} data-testid={`day-${day.weekday}`} style={gridStyle}>
                <span style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>{name}</span>
                <input type="checkbox" aria-label={`${name} مفتوح`} checked={!day.isClosed}
                  onChange={(e) => toggleDay(day, e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: '#0d6e75', justifySelf: 'start' }} />
                <input type="time" aria-label={`${name} من`} disabled={day.isClosed}
                  value={day.isClosed ? '' : day.openTime}
                  onChange={(e) => changeDay(day.weekday, { openTime: e.target.value })} style={timeStyle} />
                <input type="time" aria-label={`${name} إلى`} disabled={day.isClosed}
                  value={day.isClosed ? '' : day.closeTime}
                  onChange={(e) => changeDay(day.weekday, { closeTime: e.target.value })} style={timeStyle} />
              </div>
            );
          })}

          {saveError && (
            <div role="alert" style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', borderRadius: '8px', padding: '10px 12px', fontSize: '12.5px' }}>
              {saveError}
            </div>
          )}
          {saved && (
            <div role="status" style={{ backgroundColor: '#e6f7f0', color: '#047857', borderRadius: '8px', padding: '10px 12px', fontSize: '12.5px' }}>
              تم حفظ ساعات العمل والسعة.
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            style={{
              alignSelf: 'flex-start', marginTop: '6px', backgroundColor: '#104f55', color: '#ffffff', padding: '10px 24px',
              borderRadius: '8px', fontWeight: '700', fontSize: '14px', border: 'none',
              cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1
            }}
          >
            {saving ? 'جارٍ الحفظ…' : 'حفظ ساعات العمل'}
          </button>
        </form>
      )}
    </div>
  );
}
