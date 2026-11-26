import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import CompanySidebar from '../../components/CompanySidebar';
import EngineerFields from '../../components/EngineerFields';
import {
  createEngineer, getOfficeProfile, toEngineerBody, findEngineerProblem, engineerErrorMessage, EMPTY_ENGINEER,
} from '../../api/officePortal';

export default function AddEngineer() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState(EMPTY_ENGINEER);
  const [officeName, setOfficeName] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [created, setCreated] = useState(null);   // the 201 response -> success panel

  // only for the name in the header
  useEffect(() => {
    let ignore = false;
    getOfficeProfile()
      .then((profile) => { if (!ignore) setOfficeName(profile.name); })
      .catch((err) => {
        if (!ignore && err.status === 401) navigate('/login', { replace: true, state: { from: location.pathname } });
      });
    return () => { ignore = true; };
  }, [navigate, location.pathname]);

  const changeField = (field, value) => {
    setError('');
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const problem = findEngineerProblem(form, { withEmail: true });
    setError(problem);
    if (problem) return;

    setSaving(true);
    try {
      setCreated(await createEngineer({ ...toEngineerBody(form), email: form.email.trim() }));
    } catch (err) {
      if (err.status === 401) navigate('/login', { replace: true, state: { from: location.pathname } });
      else setError(engineerErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const addAnother = () => {
    setForm(EMPTY_ENGINEER);
    setCreated(null);
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
          <span style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b' }}>{officeName}</span>
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
            {officeName.trim().charAt(0)}
          </div>
        </div>
      </header>

      {/* Main Body with Sidebar */}
      <div style={{ display: 'flex', flex: 1 }}>
        {/* Main Content Area */}
        <main style={{ flex: 1, padding: '40px 48px', overflowY: 'auto' }}>
          <div style={{ maxWidth: '780px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: '32px' }}>
              <h1 style={{ fontSize: '30px', fontWeight: '800', color: '#0f172a', margin: '0 0 8px' }}>
                إضافة مهندس
              </h1>
              <p style={{ color: '#64748b', fontSize: '15px', margin: 0 }}>
                المهندس بيشتغل تحت مكتبك وبتظهر أسماؤهم على التقارير.
              </p>
            </div>

            {/* Form Card */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              padding: '36px 40px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', marginBottom: '20px' }}>
                إضافة مهندس جديد
              </h2>

              {/* Alert Note */}
              <div style={{
                backgroundColor: '#edf5f6',
                color: '#104f55',
                borderRadius: '10px',
                padding: '14px 18px',
                fontSize: '13px',
                fontWeight: '600',
                lineHeight: 1.6,
                marginBottom: '28px',
                border: '1px solid #cce3e6'
              }}>
                بنرسل للمهندس رابط لتعيين كلمة المرور، الرابط صالح لمدة 48 ساعة. أنت ما بتحدد كلمة مرور له.
              </div>

              {created ? (
                <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: '#e6f7f0',
                    color: '#059669',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '28px',
                    margin: '0 auto 16px'
                  }}>
                    ✓
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', marginBottom: '6px' }}>
                    تم إنشاء حساب المهندس {created.engineer.fullName}
                  </h3>
                  <p style={{ color: created.emailSent ? '#64748b' : '#b45309', fontSize: '14px', marginBottom: '20px' }}>
                    {created.emailSent
                      ? `أرسلنا رابط التفعيل إلى ${created.engineer.email}، وهو صالح لمدة 48 ساعة.`
                      : 'تعذّر إرسال رابط التفعيل. استخدم «إعادة إرسال الرابط» من صفحة الملف.'}
                  </p>
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                    <button type="button" onClick={() => navigate('/company/profile')}
                      style={{ backgroundColor: '#104f55', color: '#ffffff', padding: '10px 24px', borderRadius: '10px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', border: 'none' }}>
                      العودة للملف
                    </button>
                    <button type="button" onClick={addAnother}
                      style={{ backgroundColor: '#ffffff', color: '#475569', border: '1px solid #cbd5e1', padding: '10px 24px', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                      إضافة مهندس آخر
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                  <EngineerFields values={form} onChange={changeField} withEmail />

                  {error && (
                    <div role="alert" style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', borderRadius: '10px', padding: '12px 14px', fontSize: '13px' }}>
                      {error}
                    </div>
                  )}

                  {/* Action buttons */}
                  <div style={{ display: 'flex', gap: '14px', marginTop: '12px' }}>
                    <button
                      type="submit"
                      disabled={saving}
                      style={{
                        backgroundColor: '#104f55',
                        color: '#ffffff',
                        padding: '12px 28px',
                        borderRadius: '10px',
                        fontSize: '15px',
                        fontWeight: '700',
                        cursor: saving ? 'not-allowed' : 'pointer',
                        opacity: saving ? 0.7 : 1,
                        boxShadow: '0 4px 12px rgba(16, 79, 85, 0.2)'
                      }}
                    >
                      {saving ? 'جارٍ الإنشاء…' : 'إنشاء حساب المهندس'}
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate('/company/profile')}
                      style={{
                        backgroundColor: '#ffffff',
                        color: '#475569',
                        border: '1px solid #cbd5e1',
                        padding: '12px 24px',
                        borderRadius: '10px',
                        fontSize: '15px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      إلغاء
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </main>

        {/* Sidebar on the Right */}
        <CompanySidebar />
      </div>
    </div>
  );
}
