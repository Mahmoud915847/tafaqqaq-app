import React from 'react';
import { SPECIALTIES } from '../api/officePortal';

// The engineer inputs, shared by "إضافة مهندس" and the edit form on the company profile page.
// The email is only asked when adding: the backend doesn't allow changing it.

const labelStyle = { display: 'block', fontSize: '13px', fontWeight: '700', color: '#1e293b', marginBottom: '6px' };
const inputStyle = {
  width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1',
  fontSize: '14px', outline: 'none', backgroundColor: '#ffffff'
};
const ltrInput = { ...inputStyle, direction: 'ltr', textAlign: 'right' };

export default function EngineerFields({ values, onChange, withEmail = false }) {
  const set = (field) => (e) => onChange(field, e.target.value);
  // keep a specialty saved from elsewhere (Swagger, older data) selectable
  const options = SPECIALTIES.includes(values.specialty) ? SPECIALTIES : [values.specialty, ...SPECIALTIES];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
      <label>
        <span style={labelStyle}>الاسم الكامل</span>
        <input name="fullName" type="text" maxLength={150} placeholder="مثال: م. أحمد" value={values.fullName}
          onChange={set('fullName')} style={inputStyle} />
      </label>
      <label>
        <span style={labelStyle}>التخصص</span>
        <select name="specialty" value={values.specialty} onChange={set('specialty')} style={inputStyle}>
          {options.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </label>
      <label>
        <span style={labelStyle}>رقم عضوية النقابة</span>
        <input name="syndicateNo" type="text" maxLength={30} placeholder="XXXX" value={values.syndicateNo}
          onChange={set('syndicateNo')} style={inputStyle} />
      </label>
      <label>
        <span style={labelStyle}>سنوات الخبرة</span>
        <input name="yearsExperience" type="number" inputMode="numeric" min="0" max="60" placeholder="مثال: 10"
          value={values.yearsExperience} onChange={set('yearsExperience')} style={ltrInput} />
      </label>
      <label>
        <span style={labelStyle}>رقم الهاتف</span>
        <input name="phone" type="tel" maxLength={30} placeholder="07X XXX XXXX" value={values.phone}
          onChange={set('phone')} style={ltrInput} />
      </label>
      {withEmail && (
        <label>
          <span style={labelStyle}>البريد الإلكتروني (لرابط التفعيل)</span>
          <input name="email" type="email" maxLength={200} placeholder="engineer@email.com" value={values.email}
            onChange={set('email')} style={ltrInput} />
        </label>
      )}
    </div>
  );
}
