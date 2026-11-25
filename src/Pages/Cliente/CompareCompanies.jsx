import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import OfficeAvatar from '../../components/OfficeAvatar';
import {
  compareOffices, formatPrice, memberSinceYear, officeErrorMessage, propertyTypeLabel,
} from '../../api/offices';
import { useCompare, removeManyFromCompare, MIN_COMPARE, MAX_COMPARE } from '../../hooks/useCompare';

const badgeBest = {
  backgroundColor: '#e6f9f0', color: '#15803d', fontSize: '11px', fontWeight: '700',
  padding: '2px 8px', borderRadius: '10px', marginLeft: '6px'
};

// Which offices hold the best value in a row. Returns a Set of office ids.
// Nothing is marked when values are missing or all equal.
function bestIds(offices, getValue, better) {
  const values = offices.map((o) => ({ id: o.id, v: getValue(o) })).filter((x) => x.v !== null && x.v !== undefined);
  if (values.length < 2) return new Set();
  const best = values.reduce((acc, x) => (better(x.v, acc) ? x.v : acc), values[0].v);
  const winners = values.filter((x) => x.v === best);
  if (winners.length === values.length) return new Set();
  return new Set(winners.map((x) => x.id));
}

const higher = (a, b) => a > b;
const lower = (a, b) => a < b;

function MessageCard({ title, text, children }) {
  return (
    <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '48px 24px', textAlign: 'center' }}>
      <div style={{ fontSize: '18px', fontWeight: '800', color: '#0c232f', marginBottom: text ? '6px' : 0 }}>{title}</div>
      {text && <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 18px' }}>{text}</p>}
      {children}
    </div>
  );
}

const primaryButton = {
  backgroundColor: '#0d6e75', color: '#ffffff', padding: '10px 24px', borderRadius: '8px',
  fontSize: '14px', fontWeight: '700', cursor: 'pointer', border: 'none'
};

export default function CompareCompanies() {
  const navigate = useNavigate();
  const compare = useCompare();

  const [reloadKey, setReloadKey] = useState(0);
  const [result, setResult] = useState({ key: null, data: null, error: null });

  const enough = compare.count >= MIN_COMPARE;
  const requestKey = `${compare.ids.join(',')}|${reloadKey}`;
  const loading = enough && result.key !== requestKey;

  useEffect(() => {
    if (!enough) return undefined;
    let ignore = false;
    const ids = requestKey.split('|')[0].split(',');
    compareOffices(ids)
      .then((data) => {
        if (ignore) return;
        // Offices that are no longer Active leave the selection; the list then reloads without them
        if (data.missingIds?.length) removeManyFromCompare(data.missingIds);
        setResult({ key: requestKey, data, error: null });
      })
      .catch((err) => { if (!ignore) setResult({ key: requestKey, data: null, error: err }); });
    return () => { ignore = true; };
  }, [enough, requestKey]);

  const data = loading ? null : result.data;
  const error = loading ? null : result.error;

  let content;
  if (!enough) {
    content = (
      <MessageCard
        title={compare.count === 1 ? 'اخترت شركة واحدة فقط' : 'لم تختر أي شركة للمقارنة'}
        text={`اختر من ${MIN_COMPARE} إلى ${MAX_COMPARE} شركات من صفحة الشركات لمقارنتها هنا.`}
      >
        <button type="button" onClick={() => navigate('/companies')} style={primaryButton}>
          تصفّح الشركات
        </button>
      </MessageCard>
    );
  } else if (loading) {
    content = <MessageCard title="جارٍ تحميل المقارنة…" />;
  } else if (error) {
    content = (
      <MessageCard title={officeErrorMessage(error)}>
        <button type="button" onClick={() => setReloadKey((k) => k + 1)}
          style={{ ...primaryButton, backgroundColor: '#ffffff', color: '#0d6e75', border: '1.5px solid #0d6e75' }}>
          إعادة المحاولة
        </button>
      </MessageCard>
    );
  } else {
    // Keep the order in which the client selected the offices
    const offices = [...data.offices].sort((a, b) => compare.ids.indexOf(a.id) - compare.ids.indexOf(b.id));
    const columns = `180px repeat(${offices.length}, 1fr)`;
    const anyRatings = offices.some((o) => o.ratingCount > 0);

    const rows = [
      {
        label: 'التقييم',
        best: anyRatings ? bestIds(offices, (o) => (o.ratingCount > 0 ? Number(o.ratingAvg) : null), higher) : new Set(),
        show: (o) => (o.ratingCount > 0 ? `★ ${Number(o.ratingAvg).toFixed(1)}` : 'لا تقييمات بعد'),
      },
      {
        label: 'عدد التقييمات',
        best: anyRatings ? bestIds(offices, (o) => o.ratingCount, higher) : new Set(),
        show: (o) => o.ratingCount,
      },
      { label: 'المدينة', best: new Set(), show: (o) => o.city },
      { label: 'عدد المهندسين', best: bestIds(offices, (o) => o.engineerCount, higher), show: (o) => o.engineerCount },
      { label: 'عضو في تفقّد منذ', best: new Set(), show: (o) => memberSinceYear(o.memberSince) ?? '—' },
      { label: 'ابتداءً من', best: bestIds(offices, (o) => o.startingPrice, lower), show: (o) => formatPrice(o.startingPrice), price: true },
      // One row per property type that at least one of these offices prices (cheapest price for that type)
      ...data.propertyTypes.map((type) => ({
        label: `فحص ${propertyTypeLabel(type)}`,
        best: bestIds(offices, (o) => o.cheapestByType?.[type] ?? null, lower),
        show: (o) => (o.cheapestByType?.[type] !== undefined ? formatPrice(o.cheapestByType[type]) : 'غير متوفر'),
        price: true,
      })),
      { label: 'السعة اليومية', best: bestIds(offices, (o) => o.dailyCapacity, higher), show: (o) => `${o.dailyCapacity} فحوصات` },
      { label: 'أيام الدوام', best: bestIds(offices, (o) => o.openDays, higher), show: (o) => `${o.openDays} أيام بالأسبوع` },
    ];

    content = (
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        overflow: 'hidden'
      }}>
        {/* Header row with companies (the label column is first = on the right in RTL) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: columns,
          borderBottom: '1px solid #e2e8f0',
          padding: '28px 20px 24px',
          alignItems: 'center'
        }}>
          <div></div>
          {offices.map((o) => (
            <div key={o.id} style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <OfficeAvatar office={o} size={42} />
              <Link to={`/company/${o.id}`} style={{ fontSize: '15px', fontWeight: '800', color: '#0c232f' }}>
                {o.name}
              </Link>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => navigate(`/book-inspection?company=${o.id}`)}
                  style={{
                    backgroundColor: '#0d6e75',
                    color: '#ffffff',
                    padding: '6px 20px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    border: 'none'
                  }}
                >
                  احجز
                </button>
                <button
                  type="button"
                  onClick={() => compare.remove(o.id)}
                  title="إزالة من المقارنة"
                  style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
                >
                  إزالة
                </button>
              </div>
            </div>
          ))}
        </div>

        {rows.map((row, i) => (
          <div
            key={row.label}
            style={{
              display: 'grid',
              gridTemplateColumns: columns,
              padding: '16px 20px',
              borderBottom: i === rows.length - 1 ? 'none' : '1px solid #f1f5f9',
              alignItems: 'center',
              fontSize: '14px'
            }}
          >
            <div style={{ textAlign: 'right', fontWeight: '600', color: '#64748b' }}>{row.label}</div>
            {offices.map((o) => {
              const isBest = row.best.has(o.id);
              return (
                <div key={o.id} style={{ textAlign: 'center' }}>
                  {isBest && <span style={badgeBest}>الأفضل</span>}
                  <span style={{
                    fontWeight: isBest ? '800' : '400',
                    color: isBest ? (row.price ? '#0d6e75' : '#0c232f') : '#334155'
                  }}>
                    {row.show(o)}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f5f9fa', direction: 'rtl', fontFamily: 'var(--font-family)' }}>
      <Navbar />

      <main style={{ maxWidth: '1080px', margin: '0 auto', padding: '36px 24px 80px', width: '100%', flex: 1 }}>
        {/* Header matching 04 Compare.png */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0c232f', margin: '0 0 6px' }}>
              مقارنة الشركات
            </h1>
            <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
              القيمة الأفضل بكل صف عليها علامة
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            {compare.count > 0 && (
              <button
                type="button"
                onClick={compare.clear}
                style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', backgroundColor: 'transparent', color: '#64748b', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}
              >
                مسح المقارنة
              </button>
            )}
            {!compare.isFull && (
              <button
                type="button"
                onClick={() => navigate('/companies')}
                style={{
                  padding: '8px 20px',
                  borderRadius: '8px',
                  border: '1.5px solid #0d6e75',
                  backgroundColor: '#ffffff',
                  color: '#0d6e75',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                إضافة شركة
              </button>
            )}
          </div>
        </div>

        {content}
      </main>

      <Footer />
    </div>
  );
}