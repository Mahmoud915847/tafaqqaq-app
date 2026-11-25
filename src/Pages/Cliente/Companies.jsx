import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import {
  listOffices, formatPrice, officeErrorMessage,
  PROPERTY_TYPES, SORT_OPTIONS,
} from '../../api/offices';
import { useCompare, MAX_COMPARE, MIN_COMPARE } from '../../hooks/useCompare';
import OfficeAvatar from '../../components/OfficeAvatar';

const PAGE_SIZE = 10;

const DEFAULT_FILTERS = {
  city: '',          // '' = all cities
  propertyType: '',  // '' = all types
  maxPrice: '',      // '' = any price
  minRating: '',     // '' = any rating
  sort: 'rating',
};

const MAX_PRICE_OPTIONS = [50, 80, 100, 150];

const RATING_PILLS = [
  { key: '', label: 'الكل' },
  { key: '4', label: '4 فما فوق' },
  { key: '4.5', label: '4.5 فما فوق' },
];

const selectStyle = {
  width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1',
  fontSize: '13px', outline: 'none', backgroundColor: '#fff', color: '#1e293b'
};

const labelStyle = { display: 'block', fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '6px' };

const pagerButton = (disabled) => ({
  padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff',
  color: disabled ? '#94a3b8' : '#0d6e75', fontSize: '13px', fontWeight: '700',
  cursor: disabled ? 'not-allowed' : 'pointer'
});

export default function Companies() {
  const navigate = useNavigate();
  const compare = useCompare();

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);
  const [result, setResult] = useState({ key: null, data: null, error: '' }); // last answer from the API
  const [lastData, setLastData] = useState(null);   // kept while the next page loads (no flicker)
  const [compareMsg, setCompareMsg] = useState('');

  // One key per request: when it differs from the last answer's key, we are loading
  const requestKey = JSON.stringify({ filters, page, reloadKey });
  const loading = result.key !== requestKey;

  // Load the list whenever the filters or the page change
  useEffect(() => {
    let ignore = false;                         // drop answers that arrive after a newer request
    const { filters: f, page: p } = JSON.parse(requestKey);
    listOffices({ ...f, page: p, pageSize: PAGE_SIZE })
      .then((res) => {
        if (ignore) return;
        setResult({ key: requestKey, data: res, error: '' });
        setLastData(res);
      })
      .catch((err) => { if (!ignore) setResult({ key: requestKey, data: null, error: officeErrorMessage(err) }); });
    return () => { ignore = true; };
  }, [requestKey]);

  const data = loading ? lastData : result.data;
  const error = loading ? '' : result.error;

  const setFilter = (key, value) => {
    setFilters((f) => ({ ...f, [key]: value }));
    setPage(1);                                 // new filters start from the first page
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  };

  const toggleCompare = (id) => {
    const ok = compare.toggle(id);
    setCompareMsg(ok ? '' : `يمكنك مقارنة ${MAX_COMPARE} شركات كحد أقصى في وقت واحد.`);
  };

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const cities = data?.cities ?? [];
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const hasFilters = JSON.stringify(filters) !== JSON.stringify(DEFAULT_FILTERS);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f5f9fa', direction: 'rtl', fontFamily: 'var(--font-family)' }}>
      <Navbar/>

      <main style={{ maxWidth: '1240px', margin: '0 auto', padding: '36px 24px 80px', width: '100%', flex: 1 }}>
        {/* Header row matching 02 Offices.png */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0c232f', margin: '0 0 6px' }}>
              الشركات الهندسية
            </h1>
            <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
              {data ? `${total} شركة موثّقة تطابق بحثك` : 'جارٍ تحميل الشركات…'}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: '#64748b' }}>ترتيب حسب:</span>
            <select
              value={filters.sort}
              onChange={(e) => setFilter('sort', e.target.value)}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                fontSize: '13px',
                color: '#1e293b',
                fontWeight: '600',
                outline: 'none'
              }}
            >
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        {/* 2-Column Grid: Filter on right (280px), Companies List on left (1fr) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '28px', alignItems: 'start' }}>
          {/* Companies List (Left in RTL, Child 1) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', opacity: loading && data ? 0.6 : 1, transition: 'opacity 0.15s' }}>
            {compareMsg && (
              <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a', color: '#92400e', borderRadius: '10px', padding: '10px 14px', fontSize: '13px' }}>
                {compareMsg}
              </div>
            )}

            {/* Error */}
            {error && (
              <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', borderRadius: '14px', padding: '20px 24px', fontSize: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{error}</span>
                <button type="button" onClick={() => setReloadKey((k) => k + 1)}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #b91c1c', backgroundColor: '#ffffff', color: '#b91c1c', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>
                  إعادة المحاولة
                </button>
              </div>
            )}

            {/* First load */}
            {!error && loading && !data && (
              <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '40px', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>
                جارٍ تحميل الشركات…
              </div>
            )}

            {/* Empty */}
            {!error && data && items.length === 0 && (
              <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '40px', textAlign: 'center' }}>
                <div style={{ fontSize: '16px', fontWeight: '800', color: '#0c232f', marginBottom: '6px' }}>
                  لا توجد شركات تطابق بحثك
                </div>
                <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 16px' }}>
                  جرّب تغيير المدينة أو السعر أو التقييم.
                </p>
                {hasFilters && (
                  <button type="button" onClick={resetFilters}
                    style={{ padding: '8px 20px', borderRadius: '8px', backgroundColor: '#0d6e75', color: '#ffffff', fontSize: '13px', fontWeight: '700', cursor: 'pointer', border: 'none' }}>
                    مسح الفلاتر
                  </button>
                )}
              </div>
            )}

            {!error && items.map((c) => {
              const isCompared = compare.has(c.id);

              return (
                <div
                  key={c.id}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '14px',
                    border: '1px solid #e2e8f0',
                    padding: '18px 24px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  {/* Action Buttons on Left */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                      type="button"
                      onClick={() => toggleCompare(c.id)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: '1.5px solid #0d6e75',
                        backgroundColor: isCompared ? '#e0f0f2' : '#ffffff',
                        color: '#0d6e75',
                        fontSize: '13px',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      {isCompared ? 'تمت الإضافة ✓' : 'أضف للمقارنة'}
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate(`/book-inspection?company=${c.id}`)}
                      style={{
                        padding: '8px 20px',
                        borderRadius: '8px',
                        backgroundColor: '#0d6e75',
                        color: '#ffffff',
                        fontSize: '13px',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      احجز فحص
                    </button>
                  </div>

                  {/* Price */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>ابتداءً من</div>
                    <div style={{ fontSize: '20px', fontWeight: '800', color: '#0d6e75' }}>
                      {formatPrice(c.startingPrice)}
                    </div>
                  </div>

                  {/* Rating */}
                  <div style={{ fontSize: '13px', fontWeight: '700', color: c.ratingCount > 0 ? '#d97706' : '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {c.ratingCount > 0 ? (
                      <>
                        <span>★</span>
                        <span>{Number(c.ratingAvg).toFixed(1)} ({c.ratingCount} تقييم)</span>
                      </>
                    ) : (
                      <span>جديد · لا تقييمات بعد</span>
                    )}
                  </div>

                  {/* Company Info & Avatar on Right */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                        <span style={{
                          backgroundColor: '#e6f9f0',
                          color: '#15803d',
                          fontSize: '11px',
                          fontWeight: '700',
                          padding: '2px 8px',
                          borderRadius: '10px'
                        }}>
                          موثّقة
                        </span>
                        <Link to={`/company/${c.id}`} style={{ fontSize: '16px', fontWeight: '800', color: '#0c232f' }}>
                          {c.name}
                        </Link>
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>
                        {c.engineerCount} مهندس • {c.dailyCapacity} فحوصات يومياً • {c.city}
                      </div>
                    </div>

                    <OfficeAvatar office={c} />
                  </div>
                </div>
              );
            })}

            {/* Paging */}
            {!error && totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
                <button type="button" disabled={page <= 1 || loading} onClick={() => setPage((p) => p - 1)} style={pagerButton(page <= 1 || loading)}>
                  السابق
                </button>
                <span style={{ fontSize: '13px', color: '#475569', fontWeight: '600' }}>
                  صفحة {page} من {totalPages}
                </span>
                <button type="button" disabled={page >= totalPages || loading} onClick={() => setPage((p) => p + 1)} style={pagerButton(page >= totalPages || loading)}>
                  التالي
                </button>
              </div>
            )}
          </div>

          {/* Filters Card (Right in RTL, Child 2) */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '800', margin: 0, color: '#0c232f' }}>
                تصفية النتائج
              </h2>
              {hasFilters && (
                <button type="button" onClick={resetFilters}
                  style={{ background: 'none', border: 'none', color: '#0d6e75', fontSize: '12px', fontWeight: '700', cursor: 'pointer', padding: 0 }}>
                  مسح الكل
                </button>
              )}
            </div>

            {/* City (from the API) */}
            <div style={{ marginBottom: '18px' }}>
              <label style={labelStyle}>المدينة</label>
              <select value={filters.city} onChange={(e) => setFilter('city', e.target.value)} style={selectStyle}>
                <option value="">الكل</option>
                {cities.map((city) => <option key={city} value={city}>{city}</option>)}
              </select>
            </div>

            {/* Property Type */}
            <div style={{ marginBottom: '18px' }}>
              <label style={labelStyle}>نوع العقار</label>
              <select value={filters.propertyType} onChange={(e) => setFilter('propertyType', e.target.value)} style={selectStyle}>
                <option value="">الكل</option>
                {PROPERTY_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>

            {/* Max Price */}
            <div style={{ marginBottom: '18px' }}>
              <label style={labelStyle}>السعر الأقصى</label>
              <select value={filters.maxPrice} onChange={(e) => setFilter('maxPrice', e.target.value)} style={selectStyle}>
                <option value="">أي سعر</option>
                {MAX_PRICE_OPTIONS.map((p) => <option key={p} value={p}>{formatPrice(p)}</option>)}
              </select>
            </div>

            {/* Rating Pills matching 02 Offices.png */}
            <div>
              <label style={{ ...labelStyle, marginBottom: '8px' }}>التقييم</label>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {RATING_PILLS.map((pill) => {
                  const isSel = filters.minRating === pill.key;
                  return (
                    <button
                      key={pill.key || 'all'}
                      type="button"
                      onClick={() => setFilter('minRating', pill.key)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '16px',
                        border: '1px solid',
                        borderColor: isSel ? '#0d6e75' : '#e2e8f0',
                        backgroundColor: isSel ? '#e0f0f2' : '#ffffff',
                        color: isSel ? '#0d6e75' : '#475569',
                        fontSize: '12px',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      {pill.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Compare Bar: only when something is selected */}
        {compare.count > 0 && (
          <div style={{
            marginTop: '32px',
            backgroundColor: '#e6f4f5',
            border: '1px solid #bce3e5',
            borderRadius: '12px',
            padding: '16px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button
                type="button"
                disabled={compare.count < MIN_COMPARE}
                onClick={() => navigate('/compare')}
                style={{
                  backgroundColor: '#0d6e75',
                  color: '#ffffff',
                  padding: '10px 24px',
                  borderRadius: '8px',
                  fontWeight: '700',
                  fontSize: '14px',
                  border: 'none',
                  cursor: compare.count < MIN_COMPARE ? 'not-allowed' : 'pointer',
                  opacity: compare.count < MIN_COMPARE ? 0.5 : 1
                }}
              >
                قارن الآن
              </button>
              <button type="button" onClick={() => { compare.clear(); setCompareMsg(''); }}
                style={{ background: 'none', border: 'none', color: '#0d6e75', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>
                إلغاء الاختيار
              </button>
            </div>

            <span style={{ fontSize: '14px', fontWeight: '700', color: '#0c232f' }}>
              {compare.count === 1
                ? 'اخترت شركة واحدة، اختر شركة أخرى على الأقل للمقارنة'
                : `تم اختيار ${compare.count === 2 ? 'شركتين' : `${compare.count} شركات`} للمقارنة`}
            </span>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}