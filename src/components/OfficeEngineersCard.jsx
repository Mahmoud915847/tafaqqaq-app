import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import EngineerFields from './EngineerFields';
import {
  listEngineers, updateEngineer, engineerAction, toEngineerForm, toEngineerBody, findEngineerProblem,
  engineerErrorMessage, portalErrorMessage,
} from '../api/officePortal';

// "المهندسون" on the company profile page (GET / PUT / deactivate / reactivate / resend-activation).
// Engineers are never deleted: deactivating blocks their login and keeps their names on old reports.

const thStyle = { padding: '12px 16px', fontWeight: '600' };
const tdStyle = { padding: '14px 16px', color: '#475569' };
const actionStyle = { fontWeight: '600', cursor: 'pointer', background: 'none', border: 'none', fontSize: '13px' };
const outlineButton = {
  color: '#104f55', border: '1.5px solid #104f55', backgroundColor: '#fff', borderRadius: '8px',
  padding: '8px 18px', fontWeight: '700', fontSize: '13px', cursor: 'pointer'
};

function statusOf(engineer) {
  if (engineer.status === 'Deactivated') return { label: 'معطّل', color: '#64748b', background: '#f1f5f9' };
  if (!engineer.isActivated) return { label: 'بانتظار تفعيل الحساب', color: '#d97706', background: '#fffbeb' };
  return { label: 'متاح', color: '#059669', background: '#e6f7f0' };
}

export default function OfficeEngineersCard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [reloadKey, setReloadKey] = useState(0);
  const [result, setResult] = useState({ key: null, engineers: [], error: null });
  const [busyId, setBusyId] = useState(null);      // the row an action is running on
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);    // { id, form }
  const [editError, setEditError] = useState('');
  const [saving, setSaving] = useState(false);

  const loading = result.key !== reloadKey;
  const loadError = loading ? null : result.error;
  const engineers = result.engineers;
  const ready = result.key !== null && !result.error;   // stays on screen while the list refreshes

  useEffect(() => {
    let ignore = false;
    listEngineers()
      .then((list) => { if (!ignore) setResult({ key: reloadKey, engineers: list, error: null }); })
      .catch((err) => {
        if (ignore) return;
        // the session expired: log in again and come back here
        if (err.status === 401) navigate('/login', { replace: true, state: { from: location.pathname } });
        else setResult({ key: reloadKey, engineers: [], error: err });
      });
    return () => { ignore = true; };
  }, [reloadKey, navigate, location.pathname]);

  const replaceRow = (updated) =>
    setResult((r) => ({ ...r, engineers: r.engineers.map((e) => (e.id === updated.id ? updated : e)) }));

  const goToLogin = () => navigate('/login', { replace: true, state: { from: location.pathname } });

  const runAction = async (engineer, action) => {
    if (action === 'deactivate' && !window.confirm(`تعطيل حساب ${engineer.fullName}؟ لن يتمكن من تسجيل الدخول.`)) return;
    setNotice('');
    setError('');
    setBusyId(engineer.id);
    try {
      const data = await engineerAction(engineer.id, action);
      if (action === 'resend-activation') {
        if (data.emailSent) setNotice(`أرسلنا رابط تفعيل جديداً إلى ${engineer.email}.`);
        else setError('تعذّر إرسال البريد. حاول لاحقاً.');
      } else {
        replaceRow(data);
        if (editing?.id === engineer.id) setEditing(null);
        setNotice(action === 'deactivate' ? `تم تعطيل حساب ${data.fullName}.` : `تم تفعيل حساب ${data.fullName} من جديد.`);
      }
    } catch (err) {
      if (err.status === 401) return goToLogin();
      setError(engineerErrorMessage(err));
      // the list on screen is out of date: load it again
      if ((err.status === 409 || err.status === 404)) setReloadKey((k) => k + 1);
    } finally {
      setBusyId(null);
    }
  };

  const startEdit = (engineer) => {
    setNotice('');
    setError('');
    setEditError('');
    setEditing({ id: engineer.id, form: toEngineerForm(engineer) });
  };

  const changeEdit = (field, value) => {
    setEditError('');
    setEditing((current) => ({ ...current, form: { ...current.form, [field]: value } }));
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    const problem = findEngineerProblem(editing.form);
    setEditError(problem);
    if (problem) return;

    setSaving(true);
    try {
      const updated = await updateEngineer(editing.id, toEngineerBody(editing.form));
      replaceRow(updated);
      setEditing(null);
      setNotice(`تم حفظ بيانات ${updated.fullName}.`);
    } catch (err) {
      if (err.status === 401) return goToLogin();
      setEditError(engineerErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{
      backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0',
      padding: '28px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
          المهندسون {ready ? `(${engineers.length})` : ''}
        </h2>

        <Link
          to="/company/add-engineer"
          style={{
            backgroundColor: '#104f55', color: '#ffffff', padding: '8px 18px', borderRadius: '8px',
            fontWeight: '700', fontSize: '13px', textDecoration: 'none', boxShadow: '0 2px 6px rgba(16, 79, 85, 0.2)'
          }}
        >
          إضافة مهندس
        </Link>
      </div>

      {loading && !ready && <p style={{ fontSize: '13px', color: '#64748b' }}>جارٍ تحميل المهندسين…</p>}

      {loadError && (
        <div role="alert" style={{ fontSize: '13px', color: '#b91c1c' }}>
          <p style={{ margin: '0 0 12px' }}>{portalErrorMessage(loadError)}</p>
          <button type="button" onClick={() => setReloadKey((k) => k + 1)} style={outlineButton}>إعادة المحاولة</button>
        </div>
      )}

      {error && (
        <div role="alert" style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', borderRadius: '8px', padding: '10px 12px', fontSize: '12.5px', marginBottom: '12px' }}>
          {error}
        </div>
      )}
      {notice && (
        <div role="status" style={{ backgroundColor: '#e6f7f0', color: '#047857', borderRadius: '8px', padding: '10px 12px', fontSize: '12.5px', marginBottom: '12px' }}>
          {notice}
        </div>
      )}

      {ready && engineers.length === 0 && (
        <p style={{ fontSize: '13px', color: '#b45309', backgroundColor: '#fffbeb', borderRadius: '8px', padding: '10px 12px', margin: 0, lineHeight: 1.6 }}>
          لا يوجد مهندسون. يحتاج المكتب إلى مهندس مفعّل واحد على الأقل حتى يظهر للعملاء.
        </p>
      )}

      {ready && engineers.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
              <th style={thStyle}>الاسم</th>
              <th style={thStyle}>التخصص</th>
              <th style={thStyle}>الخبرة (سنوات)</th>
              <th style={thStyle}>الحالة</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {engineers.map((eng) => {
              const status = statusOf(eng);
              const busy = busyId === eng.id;
              return (
                <tr key={eng.id} style={{ borderBottom: '1px solid #f1f5f9', opacity: busy ? 0.6 : 1 }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: '700', color: '#0f172a' }}>{eng.fullName}</div>
                    <div style={{ fontSize: '12px', color: '#64748b', direction: 'ltr', textAlign: 'right' }}>{eng.email}</div>
                  </td>
                  <td style={tdStyle}>{eng.specialty}</td>
                  <td style={tdStyle}>{eng.yearsExperience}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ backgroundColor: status.background, color: status.color, fontSize: '12px', fontWeight: '700', padding: '3px 10px', borderRadius: '12px' }}>
                      {status.label}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <button type="button" disabled={busy} onClick={() => startEdit(eng)} style={{ ...actionStyle, color: '#104f55' }}>
                        تعديل
                      </button>
                      {eng.status === 'Active' && !eng.isActivated && (
                        <button type="button" disabled={busy} onClick={() => runAction(eng, 'resend-activation')} style={{ ...actionStyle, color: '#104f55' }}>
                          إعادة إرسال الرابط
                        </button>
                      )}
                      {eng.status === 'Active' ? (
                        <button type="button" disabled={busy} onClick={() => runAction(eng, 'deactivate')} style={{ ...actionStyle, color: '#dc2626' }}>
                          تعطيل
                        </button>
                      ) : (
                        <button type="button" disabled={busy} onClick={() => runAction(eng, 'reactivate')} style={{ ...actionStyle, color: '#059669' }}>
                          تفعيل
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {editing && (
        <form onSubmit={saveEdit} noValidate aria-label="تعديل المهندس"
          style={{ marginTop: '20px', border: '1px solid #cce3e6', backgroundColor: '#f8fafc', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a', margin: '0 0 14px' }}>تعديل بيانات المهندس</h3>
          <EngineerFields values={editing.form} onChange={changeEdit} />
          {editError && (
            <div role="alert" style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', borderRadius: '8px', padding: '10px 12px', fontSize: '12.5px', marginTop: '14px' }}>
              {editError}
            </div>
          )}
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <button type="submit" disabled={saving}
              style={{ backgroundColor: '#104f55', color: '#ffffff', padding: '10px 24px', borderRadius: '8px', fontWeight: '700', fontSize: '14px', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
              {saving ? 'جارٍ الحفظ…' : 'حفظ بيانات المهندس'}
            </button>
            <button type="button" onClick={() => setEditing(null)} style={outlineButton}>إلغاء</button>
          </div>
        </form>
      )}

      <p style={{ fontSize: '12px', color: '#64748b', marginTop: '20px', lineHeight: 1.5, textAlign: 'center' }}>
        تغيير السعر أو عدد المهندسين بيتسجل ويظهر للأدمن. الحذف غير متاح للمهندسين: بنعطل الحساب عشان تظل أسماؤهم على التقارير القديمة.
      </p>
    </div>
  );
}
