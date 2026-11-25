import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import OfficeAvatar from '../../components/OfficeAvatar';
import {
  getOffice, formatPrice, formatTime, memberSinceYear, officeErrorMessage,
  propertyTypeLabel, weekdayLabel,
} from '../../api/offices';
import { useCompare, MAX_COMPARE } from '../../hooks/useCompare';

const cardStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '14px',
  border: '1px solid #e2e8f0',
  padding: '24px'
};

const metricCard = {
  backgroundColor: '#ffffff',
  borderRadius: '14px',
  border: '1px solid #e2e8f0',
  padding: '20px',
  textAlign: 'center'
};

const metricLabel = { fontSize: '12px', color: '#64748b', marginBottom: '6px' };
const metricValue = { fontSize: '20px', fontWeight: '800', color: '#0d6e75' };

// Joins days in a row that have the same hours:
// [Sat closed, Sun 9-15, Mon 9-15, ...] -> [{ label: 'الأحد - الأربعاء', hours: '9:00 ص - 3:00 م' }, ...]
function groupWorkingHours(days) {
  const groups = [];
  days.forEach((d) => {
    const hours = d.isClosed ? null : `${formatTime(d.openTime)} - ${formatTime(d.closeTime)}`;
    const last = groups[groups.length - 1];
    if (last && last.hours === hours) last.to = d.weekday;
    else groups.push({ from: d.weekday, to: d.weekday, hours });
  });
  return groups.map((g) => ({
    label: g.from === g.to ? weekdayLabel(g.from) : `${weekdayLabel(g.from)} - ${weekdayLabel(g.to)}`,
    hours: g.hours,
  }));
}

// One centered message card (loading, not found, error)
function MessageCard({ title, text, children }) {
  return (
    <div style={{ ...cardStyle, padding: '48px 24px', textAlign: 'center' }}>
      <div style={{ fontSize: '18px', fontWeight: '800', color: '#0c232f', marginBottom: text ? '6px' : 0 }}>{title}</div>
      {text && <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 18px' }}>{text}</p>}
      {children}
    </div>
  );
}

export default function CompanyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const compare = useCompare();

  const [reloadKey, setReloadKey] = useState(0);
  const [result, setResult] = useState({ key: null, office: null, error: null });
  const [compareMsg, setCompareMsg] = useState('');

  const requestKey = `${id}|${reloadKey}`;
  const loading = result.key !== requestKey;

  useEffect(() => {
    let ignore = false;
    getOffice(id)
      .then((office) => { if (!ignore) setResult({ key: requestKey, office, error: null }); })
      .catch((err) => { if (!ignore) setResult({ key: requestKey, office: null, error: err }); });
    return () => { ignore = true; };
  }, [id, requestKey]);

  const office = loading ? null : result.office;
  const error = loading ? null : result.error;

  const toggleCompare = () => {
    const ok = compare.toggle(office.id);
    setCompareMsg(ok ? '' : `يمكنك مقارنة ${MAX_COMPARE} شركات كحد أقصى في وقت واحد.`);
  };

  let content;
  if (loading) {
    content = <MessageCard title="جارٍ تحميل بيانات الشركة…" />;
  } else if (error?.status === 404) {
    content = (
      <MessageCard title="هذه الشركة غير متاحة حالياً" text="قد يكون الرابط خاطئاً، أو أن الشركة غير متاحة للحجز الآن.">
        <button type="button" onClick={() => navigate('/companies')}
          style={{ backgroundColor: '#0d6e75', color: '#ffffff', padding: '10px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', border: 'none' }}>
          تصفّح الشركات
        </button>
      </MessageCard>
    );
  } else if (error) {
    content = (
      <MessageCard title={officeErrorMessage(error)}>
        <button type="button" onClick={() => setReloadKey((k) => k + 1)}
          style={{ backgroundColor: '#ffffff', color: '#0d6e75', padding: '10px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', border: '1.5px solid #0d6e75' }}>
          إعادة المحاولة
        </button>
      </MessageCard>
    );
  } else {
    const isCompared = compare.has(office.id);
    const year = memberSinceYear(office.memberSince);
    const hourGroups = groupWorkingHours(office.workingHours ?? []);

    content = (
      <>
        {/* Top Header Card matching 03 Office Profile.png */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '32px 36px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
        }}>
          {/* Left Price and Book button */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '2px' }}>ابتداءً من</div>
            <div style={{ fontSize: '32px', fontWeight: '800', color: '#0d6e75', marginBottom: '12px' }}>
              {formatPrice(office.startingPrice)}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                type="button"
                onClick={() => navigate(`/book-inspection?company=${office.id}`)}
                style={{
                  backgroundColor: '#0d6e75',
                  color: '#ffffff',
                  padding: '10px 28px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  border: 'none'
                }}
              >
                احجز فحص
              </button>
              <button
                type="button"
                onClick={toggleCompare}
                style={{
                  backgroundColor: isCompared ? '#e0f0f2' : '#ffffff',
                  color: '#0d6e75',
                  padding: '8px 20px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  border: '1.5px solid #0d6e75'
                }}
              >
                {isCompared ? 'تمت الإضافة للمقارنة ✓' : 'أضف للمقارنة'}
              </button>
            </div>
          </div>

          {/* Right Info & Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <span style={{
                  backgroundColor: '#e6f9f0',
                  color: '#15803d',
                  fontSize: '12px',
                  fontWeight: '700',
                  padding: '3px 10px',
                  borderRadius: '12px'
                }}>
                  موثّقة من الأدمن
                </span>
                <span style={{ fontSize: '13px', color: '#64748b' }}>{office.city}، الأردن</span>
                <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0c232f', margin: 0 }}>
                  {office.name}
                </h1>
              </div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>
                {year ? `عضو في تفقّد منذ ${year}` : 'عضو في تفقّد'} • ترخيص تمت مراجعته من إدارة تفقّد
              </div>
            </div>

            <OfficeAvatar office={office} size={64} />
          </div>
        </div>

        {compareMsg && (
          <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a', color: '#92400e', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', marginBottom: '16px' }}>
            {compareMsg}
          </div>
        )}

        {/* 4 Metric Cards matching 03 Office Profile.png */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <div style={metricCard}>
            <div style={metricLabel}>التقييم</div>
            {office.ratingCount > 0 ? (
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#0c232f', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <span>({office.ratingCount})</span>
                <span>{Number(office.ratingAvg).toFixed(1)}</span>
                <span style={{ color: '#d97706' }}>★</span>
              </div>
            ) : (
              <div style={{ fontSize: '15px', fontWeight: '700', color: '#64748b', paddingTop: '4px' }}>لا تقييمات بعد</div>
            )}
          </div>

          <div style={metricCard}>
            <div style={metricLabel}>المهندسون</div>
            <div style={metricValue}>{office.engineerCount} مهندس</div>
          </div>

          <div style={metricCard}>
            <div style={metricLabel}>عضو منذ</div>
            <div style={metricValue}>{year ?? '—'}</div>
          </div>

          <div style={metricCard}>
            <div style={metricLabel}>السعة اليومية</div>
            <div style={metricValue}>{office.dailyCapacity} فحوصات</div>
          </div>
        </div>

        {/* 2-Column Section matching 03 Office Profile.png */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px', marginBottom: '36px', alignItems: 'start' }}>
          {/* Right Column: About & Working Days (Child 1 in RTL) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Card: عن الشركة */}
            <div style={cardStyle}>
              <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#0c232f', marginBottom: '10px' }}>
                عن الشركة
              </h2>
              <p style={{ fontSize: '13px', color: office.description ? '#475569' : '#94a3b8', lineHeight: 1.8, margin: 0, whiteSpace: 'pre-line' }}>
                {office.description || 'لم تضف الشركة وصفاً بعد.'}
              </p>
            </div>

            {/* Card: أيام الدوام */}
            <div style={cardStyle}>
              <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#0c232f', marginBottom: '14px' }}>
                أيام الدوام
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                {hourGroups.map((g) => (
                  <div key={g.label} style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                    <span>{g.label}</span>
                    {g.hours
                      ? <span style={{ fontWeight: '600', color: '#0c232f' }}>{g.hours}</span>
                      : <span style={{ fontWeight: '700', color: '#dc2626' }}>إجازة</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Left Column: قائمة الأسعار (Child 2 in RTL) */}
          <div style={cardStyle}>
            <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#0c232f', marginBottom: '16px', textAlign: 'right' }}>
              قائمة الأسعار
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              {office.prices.map((p) => (
                <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                  <span style={{ fontWeight: '800', color: '#0d6e75' }}>{formatPrice(p.price)}</span>
                  <span style={{ color: '#334155', fontWeight: '500' }}>
                    {propertyTypeLabel(p.propertyType)}{p.sizeBand ? ` (${p.sizeBand})` : ''}
                  </span>
                </div>
              ))}
            </div>

            <p style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
              السعر النهائي بتحدده الشركة بعد مراجعة تفاصيل العقار، وبتوصلك إشعار للموافقة عليه قبل الدفع.
            </p>
          </div>
        </div>

        {/* Reviews: real reviews come with Person B's work */}
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0c232f', marginBottom: '18px' }}>
            آراء العملاء
          </h2>
          <div style={{ ...cardStyle, textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
            {office.ratingCount > 0
              ? `${office.ratingCount} تقييم بمتوسط ${Number(office.ratingAvg).toFixed(1)} من 5. ستظهر تفاصيل الآراء هنا قريباً.`
              : 'لا توجد آراء بعد. ستظهر آراء العملاء هنا بعد أول فحص مكتمل.'}
          </div>
        </div>
      </>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f5f9fa', direction: 'rtl', fontFamily: 'var(--font-family)' }}>
      <Navbar />

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px 80px', width: '100%', flex: 1 }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px' }}>
          <Link to="/companies" style={{ color: '#0d6e75', fontWeight: '600' }}>
            الشركات
          </Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <span style={{ color: '#0c232f', fontWeight: '600' }}>{office?.name ?? '…'}</span>
        </div>

        {content}
      </main>

      <Footer />
    </div>
  );
}