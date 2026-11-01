import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { api } from '../../api/client';

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB, same limit as the backend

const labelStyle = { display: 'block', fontSize: '12px', fontWeight: '600', color: '#0c232f', marginBottom: '6px' };
const inputStyle = { width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', backgroundColor: '#fff' };
const ltrInput = { ...inputStyle, direction: 'ltr', textAlign: 'right' };
const row = { display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '14px' };

function FileBox({ label, hint, accept, file, onPick, required, full }) {
  const inputRef = useRef(null);
  return (
    <div
      onClick={() => inputRef.current?.click()}
      style={{
        gridColumn: full ? '1 / -1' : 'auto',
        border: `1.5px dashed ${file ? '#0d6e75' : '#cbd5e1'}`,
        borderRadius: '10px',
        padding: '20px 14px',
        textAlign: 'center',
        backgroundColor: file ? '#e6f4f5' : '#f8fafc',
        cursor: 'pointer',
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        style={{ display: 'none' }}
        onChange={(e) => onPick(e.target.files?.[0] ?? null)}
      />
      <div style={{ fontSize: '20px', marginBottom: '6px' }}>{file ? '✅' : '⬆️'}</div>
      <div style={{ fontSize: '12px', color: '#475569', fontWeight: '600' }}>
        {label}{required && ' *'}
      </div>
      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', direction: 'ltr', wordBreak: 'break-all' }}>
        {file ? file.name : hint}
      </div>
    </div>
  );
}

export default function RegisterCompany() {
  const navigate = useNavigate();

  const [companyName, setCompanyName] = useState('');
  const [crNumber, setCrNumber] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [city, setCity] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [licenseFile, setLicenseFile] = useState(null);
  const [crFile, setCrFile] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fail = (msg) => {
    setError(msg);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!licenseFile) return fail('يرجى رفع صورة أو ملف الترخيص.');
    if (!crFile) return fail('يرجى رفع صورة أو ملف السجل التجاري.');
    for (const f of [licenseFile, crFile, logoFile]) {
      if (f && f.size > MAX_SIZE) return fail(`الملف "${f.name}" أكبر من 5 ميغابايت.`);
    }

    const form = new FormData();
    form.append('OfficeName', companyName.trim());
    form.append('CommercialRegNo', crNumber.trim());
    form.append('LicenseNo', licenseNumber.trim());
    form.append('City', city);
    form.append('ContactName', contactName.trim());
    form.append('Email', email.trim());
    form.append('Phone', phone.trim());
    form.append('Description', description.trim());
    form.append('LicenseFile', licenseFile);
    form.append('CommercialRegFile', crFile);
    if (logoFile) form.append('LogoFile', logoFile);

    setLoading(true);
    try {
      const data = await api('/office-requests', { method: 'POST', form });
      navigate('/request-submitted', { state: { referenceNo: data.referenceNo, email: email.trim() } });
    } catch (err) {
      if (err.status === 0) fail('تعذّر الاتصال بالخادم. تأكد أن الـ Backend شغّال.');
      else if (err.status === 400 || err.status === 409) fail(err.message || 'تأكد من صحة البيانات والملفات.');
      else fail('حدث خطأ غير متوقع. حاول مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#edf4f5', direction: 'rtl', fontFamily: 'var(--font-family)' }}>
      <Navbar />

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 20px' }}>
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '36px 44px', width: '100%', maxWidth: '680px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0' }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0c232f', marginBottom: '8px' }}>
              طلب إنشاء حساب مكتب هندسي
            </h1>
            <p style={{ color: '#64748b', fontSize: '13px', margin: 0, lineHeight: 1.6 }}>
              بعد إرسال الطلب، بيراجعه الأدمن، وبتوصلك رسالة بالقبول أو الرفض مع السبب. ما بتقدر تستقبل حجوزات قبل الموافقة.
            </p>
          </div>

          <div style={{ backgroundColor: '#fef3c7', borderRadius: '10px', padding: '14px 18px', marginBottom: '24px' }}>
            <div style={{ fontSize: '13px', fontWeight: '800', color: '#b45309', marginBottom: '4px' }}>
              هاد طلب مو تسجيل: ما بينفتح لك حساب فوراً.
            </div>
            <p style={{ fontSize: '12px', color: '#92400e', margin: 0, lineHeight: 1.6 }}>
              بعد ما يراجع الأدمن ترخيصك وبياناتك، بنرسل لك رابط على الإيميل لتعيين كلمة المرور، وبعدها بتضيف مهندسينك وأسعارك وأيام الدوام من لوحة التحكم.
            </p>
          </div>

          {error && (
            <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', marginBottom: '16px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={row}>
              <div>
                <label style={labelStyle}>اسم الشركة أو المكتب</label>
                <input type="text" required placeholder="مثال: مكتب الأفق الهندسي" value={companyName} onChange={(e) => setCompanyName(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>رقم السجل التجاري</label>
                <input type="text" required placeholder="XXXXXXX" value={crNumber} onChange={(e) => setCrNumber(e.target.value)} style={ltrInput} />
              </div>
            </div>

            <div style={row}>
              <div>
                <label style={labelStyle}>رقم ترخيص المكتب (نقابة المهندسين)</label>
                <input type="text" required placeholder="XXXX" value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} style={ltrInput} />
              </div>
              <div>
                <label style={labelStyle}>المدينة</label>
                <select required value={city} onChange={(e) => setCity(e.target.value)} style={{ ...inputStyle, color: city ? '#1e293b' : '#94a3b8' }}>
                  <option value="">اختر المدينة</option>
                  <option value="عمّان">عمّان</option>
                  <option value="إربد">إربد</option>
                  <option value="الزرقاء">الزرقاء</option>
                  <option value="العقبة">العقبة</option>
                  <option value="السلط">السلط</option>
                  <option value="مأدبا">مأدبا</option>
                </select>
              </div>
            </div>

            <div style={row}>
              <div>
                <label style={labelStyle}>اسم الشخص المسؤول</label>
                <input type="text" required placeholder="الاسم الكامل" value={contactName} onChange={(e) => setContactName(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>رقم الهاتف</label>
                <input type="tel" required placeholder="07X XXX XXXX" value={phone} onChange={(e) => setPhone(e.target.value)} style={ltrInput} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>البريد الإلكتروني (لإرسال رابط تعيين كلمة المرور)</label>
              <input type="email" required placeholder="office@email.com" value={email} onChange={(e) => setEmail(e.target.value)} style={ltrInput} />
            </div>

            <div>
              <label style={labelStyle}>وصف الشركة</label>
              <textarea rows={3} placeholder="سنة التأسيس، التخصصات، نوع العقارات التي تفحصها" value={description} onChange={(e) => setDescription(e.target.value)} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '4px' }}>
              <FileBox label="ارفع صورة الترخيص" hint="JPG أو PNG أو PDF، حتى 5 ميغابايت" accept=".jpg,.jpeg,.png,.pdf" file={licenseFile} onPick={setLicenseFile} required />
              <FileBox label="ارفع السجل التجاري" hint="JPG أو PNG أو PDF، حتى 5 ميغابايت" accept=".jpg,.jpeg,.png,.pdf" file={crFile} onPick={setCrFile} required />
              <FileBox label="ارفع شعار الشركة (اختياري)" hint="PNG أو JPG، حتى 5 ميغابايت" accept=".jpg,.jpeg,.png" file={logoFile} onPick={setLogoFile} full />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#0d6e75', color: '#ffffff', fontSize: '14px', fontWeight: '700', marginTop: '8px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'جارٍ إرسال الطلب...' : 'أرسل الطلب'}
            </button>

            <div style={{ textAlign: 'center', fontSize: '13px', color: '#64748b' }}>
              عندك حساب مكتب?{' '}
              <Link to="/login" style={{ color: '#0d6e75', fontWeight: '700', textDecoration: 'none' }}>تسجيل الدخول</Link>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}