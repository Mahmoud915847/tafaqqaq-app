import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import OfficeAvatar from '../../components/OfficeAvatar';
import { getOffice, formatPrice, priceRowLabel, propertyTypeLabel, officeErrorMessage } from '../../api/offices';
import {
  createBooking, bookableDates, formatBookingDate, bookingNumber, bookingErrorMessage, MAX_DAYS_AHEAD,
} from '../../api/bookings';

const labelStyle = { display: 'block', fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '6px' };
const inputStyle = {
  width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1',
  fontSize: '13px', outline: 'none', backgroundColor: '#fff'
};
const numberInput = { ...inputStyle, direction: 'ltr', textAlign: 'right' };
const cardStyle = {
  backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0',
  padding: '24px 28px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
};
const primaryButton = {
  backgroundColor: '#0d6e75', color: '#ffffff', padding: '10px 24px', borderRadius: '8px',
  fontSize: '14px', fontWeight: '700', cursor: 'pointer', border: 'none'
};

// Same limits as the backend (BookingPropertyInput)
const LIMITS = {
  areaM2: { min: 10, max: 100000, label: 'المساحة' },
  floor: { min: -5, max: 100, label: 'رقم الطابق' },
  bedrooms: { min: 0, max: 50, label: 'غرف النوم' },
  bathrooms: { min: 0, max: 50, label: 'الحمامات' },
  buildingAge: { min: 0, max: 200, label: 'عمر البناء' },
};

// '' -> null, '12' -> 12 ; returns undefined when the text is not a valid number
function parseNumber(text, integer) {
  const t = String(text).trim();
  if (t === '') return null;
  const n = Number(t);
  if (!Number.isFinite(n)) return undefined;
  if (integer && !Number.isInteger(n)) return undefined;
  return n;
}

function MessageCard({ title, text, children }) {
  return (
    <div style={{ ...cardStyle, padding: '48px 24px', textAlign: 'center' }}>
      <div style={{ fontSize: '18px', fontWeight: '800', color: '#0c232f', marginBottom: text ? '6px' : 0 }}>{title}</div>
      {text && <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 18px', lineHeight: 1.7 }}>{text}</p>}
      {children}
    </div>
  );
}

export default function BookInspection() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const officeId = searchParams.get('company');

  // ----- office -----
  const [reloadKey, setReloadKey] = useState(0);
  const [result, setResult] = useState({ key: null, office: null, error: null });
  const requestKey = `${officeId}|${reloadKey}`;
  const loading = Boolean(officeId) && result.key !== requestKey;

  useEffect(() => {
    if (!officeId) return undefined;
    let ignore = false;
    getOffice(officeId)
      .then((office) => { if (!ignore) setResult({ key: requestKey, office, error: null }); })
      .catch((err) => { if (!ignore) setResult({ key: requestKey, office: null, error: err }); });
    return () => { ignore = true; };
  }, [officeId, requestKey]);

  const office = loading ? null : result.office;
  const loadError = loading ? null : result.error;

  // ----- form -----
  const [priceId, setPriceId] = useState('');
  const [area, setArea] = useState('');
  const [floor, setFloor] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [buildingAge, setBuildingAge] = useState('');
  const [hasElevator, setHasElevator] = useState(false);
  const [hasParking, setHasParking] = useState(false);
  const [address, setAddress] = useState('');
  const [date, setDate] = useState('');
  const [fullDates, setFullDates] = useState([]);   // days the backend said are FULLY_BOOKED

  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [booking, setBooking] = useState(null);     // the 201 response -> success screen

  const dates = useMemo(() => bookableDates(office?.workingHours), [office]);
  // A choice that is no longer offered (office reloaded) counts as not chosen
  const selectedPrice = office?.prices.find((p) => p.id === priceId) ?? null;
  const selectedDate = dates.some((d) => d.value === date) && !fullDates.includes(date) ? date : '';
  const isLand = selectedPrice?.propertyType === 'Land';

  const validate = () => {
    if (!selectedPrice) return 'اختر نوع العقار والمساحة من قائمة أسعار الشركة.';
    const values = { areaM2: parseNumber(area, false) };
    if (!isLand) {
      values.floor = parseNumber(floor, true);
      values.bedrooms = parseNumber(bedrooms, true);
      values.bathrooms = parseNumber(bathrooms, true);
      values.buildingAge = parseNumber(buildingAge, true);
    }
    if (values.areaM2 === null) return 'أدخل مساحة العقار.';
    for (const [key, value] of Object.entries(values)) {
      const { min, max, label } = LIMITS[key];
      if (value === undefined || (value !== null && (value < min || value > max))) {
        return `${label} يجب أن تكون رقماً بين ${min} و ${max}.`;
      }
    }
    const cleanAddress = address.trim();
    if (cleanAddress.length < 5 || cleanAddress.length > 300) return 'أدخل عنوان العقار (5 أحرف على الأقل).';
    if (!selectedDate) return 'اختر تاريخ الفحص.';
    return { values, cleanAddress };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    const checked = validate();
    if (typeof checked === 'string') {
      setFormError(checked);
      return;
    }

    const { values, cleanAddress } = checked;
    const body = {
      officeId: office.id,
      officePriceId: selectedPrice.id,
      scheduledDate: selectedDate,
      property: {
        areaM2: values.areaM2,
        floor: isLand ? null : values.floor,
        bedrooms: isLand ? null : values.bedrooms,
        bathrooms: isLand ? null : values.bathrooms,
        buildingAge: isLand ? null : values.buildingAge,
        hasElevator: isLand ? false : hasElevator,
        hasParking: isLand ? false : hasParking,
        address: cleanAddress,
        lat: null,   // the map comes later; the backend needs both or neither
        lng: null,
      },
    };

    setSubmitting(true);
    try {
      const created = await createBooking(body);
      setBooking(created);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      if (err.status === 401) {
        // the session expired: log in again and come back here
        navigate('/login', { replace: true, state: { from: location.pathname + location.search } });
        return;
      }
      setFormError(bookingErrorMessage(err));
      if (err.code === 'FULLY_BOOKED') setFullDates((list) => [...list, selectedDate]);
      // prices or hours changed since the page loaded: load the office again
      if (err.code === 'PRICE_NOT_FOUND' || err.code === 'OFFICE_CLOSED') setReloadKey((k) => k + 1);
    } finally {
      setSubmitting(false);
    }
  };

  // ----- page content -----
  let content;
  if (!officeId) {
    content = (
      <MessageCard title="اختر شركة أولاً" text="ابدأ من صفحة الشركات واضغط «احجز فحص» على الشركة التي تريدها.">
        <button type="button" onClick={() => navigate('/companies')} style={primaryButton}>تصفّح الشركات</button>
      </MessageCard>
    );
  } else if (booking) {
    // ----- success (G5): the booking details page comes with Person B's work -----
    content = (
      <div style={{ ...cardStyle, maxWidth: '560px', margin: '0 auto', textAlign: 'center', padding: '36px' }}>
        <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#e6f9f0', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', fontWeight: '800', margin: '0 auto 16px' }}>
          ✓
        </div>
        <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#0c232f', margin: '0 0 6px' }}>تم إرسال طلب الحجز</h2>
        <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 22px' }}>
          رقم الطلب <span style={{ fontWeight: '800', color: '#0c232f', direction: 'ltr', display: 'inline-block' }}>#{bookingNumber(booking.id)}</span>
        </p>

        <div style={{ textAlign: 'right', backgroundColor: '#f8fafc', borderRadius: '10px', padding: '16px 18px', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          {[
            ['الشركة', booking.officeName],
            ['العقار', `${propertyTypeLabel(booking.propertyType)}${booking.sizeBand ? ` · ${booking.sizeBand}` : ''}`],
            ['موعد الفحص', formatBookingDate(booking.scheduledDate)],
            ['السعر المبدئي', formatPrice(booking.initialPrice)],
            ['الحالة', 'بانتظار رد الشركة'],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
              <span style={{ color: '#64748b' }}>{k}</span>
              <span style={{ fontWeight: '700', color: '#0c232f' }}>{v}</span>
            </div>
          ))}
        </div>

        <p style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.7, margin: '0 0 20px' }}>
          الشركة بتراجع طلبك، بتعيّن المهندس، وبتحدد السعر النهائي. بيوصلك إشعار للموافقة على السعر قبل الدفع.
        </p>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button type="button" onClick={() => navigate('/bookings')} style={primaryButton}>حجوزاتي</button>
          <button type="button" onClick={() => navigate('/companies')}
            style={{ ...primaryButton, backgroundColor: '#ffffff', color: '#0d6e75', border: '1.5px solid #0d6e75' }}>
            تصفّح الشركات
          </button>
        </div>
      </div>
    );
  } else if (loading && !office) {
    content = <MessageCard title="جارٍ تحميل بيانات الشركة…" />;
  } else if (loadError?.status === 404) {
    content = (
      <MessageCard title="هذه الشركة غير متاحة للحجز حالياً" text="اختر شركة أخرى من قائمة الشركات.">
        <button type="button" onClick={() => navigate('/companies')} style={primaryButton}>تصفّح الشركات</button>
      </MessageCard>
    );
  } else if (loadError) {
    content = (
      <MessageCard title={officeErrorMessage(loadError)}>
        <button type="button" onClick={() => setReloadKey((k) => k + 1)}
          style={{ ...primaryButton, backgroundColor: '#ffffff', color: '#0d6e75', border: '1.5px solid #0d6e75' }}>
          إعادة المحاولة
        </button>
      </MessageCard>
    );
  } else {
    const openDayNames = office.workingHours.filter((h) => !h.isClosed).length;

    content = (
      <form onSubmit={handleSubmit} noValidate style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '28px', alignItems: 'start' }}>
        {/* Main Form Cards on Right (Child 1 in RTL) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Card 1: بيانات العقار */}
          <div style={cardStyle}>
            <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#0c232f', marginBottom: '18px' }}>
              بيانات العقار
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Row 1: price row (property type + size band) and area */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={labelStyle}>نوع العقار والمساحة</label>
                  <select value={selectedPrice ? priceId : ''} onChange={(e) => setPriceId(e.target.value)} style={inputStyle}>
                    <option value="">اختر من قائمة أسعار الشركة</option>
                    {office.prices.map((p) => <option key={p.id} value={p.id}>{priceRowLabel(p)}</option>)}
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>المساحة (م²)</label>
                  <input type="number" inputMode="decimal" min="10" placeholder="140" value={area}
                    onChange={(e) => setArea(e.target.value)} style={numberInput} />
                </div>
              </div>

              {!isLand && (
                <>
                  {/* Row 2 */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div>
                      <label style={labelStyle}>رقم الطابق <span style={{ fontWeight: 400 }}>(اختياري)</span></label>
                      <input type="number" inputMode="numeric" placeholder="3" value={floor}
                        onChange={(e) => setFloor(e.target.value)} style={numberInput} />
                    </div>
                    <div>
                      <label style={labelStyle}>غرف النوم <span style={{ fontWeight: 400 }}>(اختياري)</span></label>
                      <input type="number" inputMode="numeric" min="0" placeholder="3" value={bedrooms}
                        onChange={(e) => setBedrooms(e.target.value)} style={numberInput} />
                    </div>
                  </div>

                  {/* Row 3 */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div>
                      <label style={labelStyle}>عمر البناء (سنة) <span style={{ fontWeight: 400 }}>(اختياري)</span></label>
                      <input type="number" inputMode="numeric" min="0" placeholder="20" value={buildingAge}
                        onChange={(e) => setBuildingAge(e.target.value)} style={numberInput} />
                    </div>
                    <div>
                      <label style={labelStyle}>الحمامات <span style={{ fontWeight: 400 }}>(اختياري)</span></label>
                      <input type="number" inputMode="numeric" min="0" placeholder="2" value={bathrooms}
                        onChange={(e) => setBathrooms(e.target.value)} style={numberInput} />
                    </div>
                  </div>

                  {/* Row 4: Checkboxes */}
                  <div style={{ display: 'flex', gap: '24px', paddingTop: '4px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#334155' }}>
                      <input type="checkbox" checked={hasElevator} onChange={(e) => setHasElevator(e.target.checked)}
                        style={{ width: '16px', height: '16px', accentColor: '#0d6e75' }} />
                      <span>فيه مصعد</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#334155' }}>
                      <input type="checkbox" checked={hasParking} onChange={(e) => setHasParking(e.target.checked)}
                        style={{ width: '16px', height: '16px', accentColor: '#0d6e75' }} />
                      <span>فيه موقف</span>
                    </label>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Card 2: الموقع والموعد */}
          <div style={cardStyle}>
            <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#0c232f', marginBottom: '18px' }}>
              الموقع والموعد
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={labelStyle}>عنوان العقار</label>
                <input type="text" maxLength={300} value={address} onChange={(e) => setAddress(e.target.value)}
                  placeholder="مثال: خلدا، شارع وصفي التل، عمارة 12" style={inputStyle} />
              </div>

              {/* Map placeholder matching 09 Book Inspection.png (pin selection comes later) */}
              <div style={{
                backgroundColor: '#f1f5f9', borderRadius: '10px', height: '120px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: '6px', color: '#64748b', fontSize: '13px', border: '1px dashed #cbd5e1'
              }}>
                <span style={{ fontSize: '22px' }}>📍</span>
                <span>تحديد الموقع على الخريطة (قريباً)</span>
              </div>

              <div>
                <label style={labelStyle}>تاريخ الفحص</label>
                <select value={selectedDate} onChange={(e) => setDate(e.target.value)} style={inputStyle}>
                  <option value="">اختر يوماً</option>
                  {dates.map((d) => {
                    const full = fullDates.includes(d.value);
                    return (
                      <option key={d.value} value={d.value} disabled={full}>
                        {d.label}{full ? ' (محجوز بالكامل)' : ''}
                      </option>
                    );
                  })}
                </select>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px' }}>
                  من الغد حتى {MAX_DAYS_AHEAD} يوماً، وفقط في أيام دوام الشركة ({openDayNames} أيام بالأسبوع).
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Left Column: ملخص الحجز Card matching 09 Book Inspection.png */}
        <div style={{ ...cardStyle, padding: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#0c232f', marginBottom: '16px' }}>
            ملخص الحجز
          </h2>

          {/* Office Profile snippet */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <OfficeAvatar office={office} size={44} />
            <div>
              <Link to={`/company/${office.id}`} style={{ fontSize: '15px', fontWeight: '800', color: '#0c232f' }}>
                {office.name}
              </Link>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                {office.city}{office.ratingCount > 0 ? ` • ★ ${Number(office.ratingAvg).toFixed(1)}` : ''}
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
              <span style={{ color: '#64748b' }}>العقار</span>
              <span style={{ fontWeight: '600', color: '#0c232f' }}>
                {selectedPrice ? `${propertyTypeLabel(selectedPrice.propertyType)}${selectedPrice.sizeBand ? ` · ${selectedPrice.sizeBand}` : ''}` : '—'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
              <span style={{ color: '#64748b' }}>الموعد</span>
              <span style={{ fontWeight: '600', color: '#0c232f' }}>{selectedDate ? formatBookingDate(selectedDate) : '—'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#64748b' }}>سعر الفحص المبدئي</span>
              <span style={{ fontSize: '18px', fontWeight: '800', color: '#0d6e75' }}>
                {selectedPrice ? formatPrice(selectedPrice.price) : `من ${formatPrice(office.startingPrice)}`}
              </span>
            </div>
            <p style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
              السعر النهائي بتحدده الشركة بعد مراجعة تفاصيل العقار، وبتوصلك إشعار للموافقة عليه قبل الدفع.
            </p>
          </div>

          {formError && (
            <div role="alert" style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', borderRadius: '8px', padding: '10px 12px', fontSize: '12.5px', lineHeight: 1.6, marginBottom: '12px' }}>
              {formError}
              {formError.includes('طلبات مفتوحة') && (
                <div style={{ marginTop: '6px' }}>
                  <Link to="/bookings" style={{ color: '#b91c1c', fontWeight: '700' }}>عرض حجوزاتي</Link>
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            style={{
              width: '100%', backgroundColor: '#0d6e75', color: '#ffffff', padding: '12px', borderRadius: '8px',
              fontWeight: '700', fontSize: '14px', border: 'none', marginBottom: '12px',
              cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1
            }}
          >
            {submitting ? 'جارٍ إرسال الطلب…' : 'أرسل طلب الحجز'}
          </button>

          <div style={{ fontSize: '11px', color: '#64748b', textAlign: 'center', lineHeight: 1.5 }}>
            ما بيتم الدفع الآن، الدفع بيتفعل بعد موافقة الشركة وموافقتك على السعر.
          </div>
        </div>
      </form>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f5f9fa', direction: 'rtl', fontFamily: 'var(--font-family)' }}>
      <Navbar />

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px 80px', width: '100%', flex: 1 }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
          <Link to="/companies" style={{ color: '#0d6e75', fontWeight: '600' }}>الشركات</Link>
          {office && (
            <>
              <span style={{ margin: '0 8px' }}>/</span>
              <Link to={`/company/${office.id}`} style={{ color: '#0d6e75', fontWeight: '600' }}>{office.name}</Link>
            </>
          )}
          <span style={{ margin: '0 8px' }}>/</span>
          <span style={{ color: '#0c232f', fontWeight: '600' }}>حجز فحص</span>
        </div>

        {/* Title & Subtitle */}
        {!booking && (
          <div style={{ marginBottom: '28px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0c232f', margin: '0 0 6px' }}>
              حجز فحص عقار
            </h1>
            <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
              عبّي بيانات العقار، والشركة بتعيّن المهندس وبتأكد الموعد.
            </p>
          </div>
        )}

        {content}
      </main>

      <Footer />
    </div>
  );
}