import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function Companies() {
  const navigate = useNavigate();

  const [selectedCity, setSelectedCity] = useState('الكل');
  const [propertyType, setPropertyType] = useState('شقة');
  const [maxPrice, setMaxPrice] = useState(80);
  const [ratingFilter, setRatingFilter] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [comparedIds, setComparedIds] = useState(['al-ofoq', 'al-bunyan']); // matches 02 Offices.png

  const allCompanies = [
    {
      id: 'al-ofoq',
      name: 'مكتب الأفق الهندسي',
      initial: 'أ',
      city: 'عمّان',
      engineers: 14,
      experience: 18,
      rating: 4.8,
      reviews: 126,
      price: 60
    },
    {
      id: 'al-bunyan',
      name: 'شركة البنيان للفحص',
      initial: 'ب',
      city: 'إربد',
      engineers: 9,
      experience: 12,
      rating: 4.6,
      reviews: 89,
      price: 45
    },
    {
      id: 'al-meamar',
      name: 'مكتب المعمار الاستشاري',
      initial: 'م',
      city: 'الزرقاء',
      engineers: 6,
      experience: 9,
      rating: 4.5,
      reviews: 64,
      price: 40
    },
    {
      id: 'al-rakaez',
      name: 'شركة الركائز للاستشارات',
      initial: 'ر',
      city: 'عمّان',
      engineers: 11,
      experience: 15,
      rating: 4.4,
      reviews: 71,
      price: 55
    },
    {
      id: 'al-nokhbah',
      name: 'مكتب النخبة الهندسي',
      initial: 'ن',
      city: 'عمّان',
      engineers: 5,
      experience: 7,
      rating: 4.3,
      reviews: 38,
      price: 35
    },
    {
      id: 'al-jisr',
      name: 'شركة الجسر للفحص الفني',
      initial: 'ج',
      city: 'العقبة',
      engineers: 7,
      experience: 10,
      rating: 4.2,
      reviews: 29,
      price: 50
    }
  ];

  const toggleCompare = (id) => {
    if (comparedIds.includes(id)) {
      setComparedIds(comparedIds.filter(item => item !== id));
    } else {
      if (comparedIds.length >= 3) {
        alert('يمكنك مقارنة 3 شركات كحد أقصى في وقت واحد.');
        return;
      }
      setComparedIds([...comparedIds, id]);
    }
  };

  const filteredCompanies = useMemo(() => {
    return allCompanies.filter(c => {
      if (selectedCity !== 'الكل' && c.city !== selectedCity) return false;
      if (c.price > maxPrice) return false;
      if (ratingFilter === '4.5' && c.rating < 4.5) return false;
      if (ratingFilter === '4.0' && c.rating < 4.0) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price') return a.price - b.price;
      return 0;
    });
  }, [selectedCity, maxPrice, ratingFilter, sortBy]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f5f9fa', direction: 'rtl', fontFamily: 'var(--font-family)' }}>
      <Navbar selectedCount={comparedIds.length} />

      <main style={{ maxWidth: '1240px', margin: '0 auto', padding: '36px 24px 80px', width: '100%', flex: 1 }}>
        {/* Header row matching 02 Offices.png */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0c232f', margin: '0 0 6px' }}>
              الشركات الهندسية
            </h1>
            <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
              {filteredCompanies.length} شركات موثّقة تطابق بحثك
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: '#64748b' }}>ترتيب حسب:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
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
              <option value="rating">الأعلى تقييماً</option>
              <option value="price">الأقل سعراً</option>
            </select>
          </div>
        </div>

        {/* 2-Column Grid: Filter on right (260px), Companies List on left (1fr) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '28px', alignItems: 'start' }}>
          {/* Companies List (Left in RTL, Child 1) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {filteredCompanies.map((c) => {
              const isCompared = comparedIds.includes(c.id);

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
                      {isCompared ? 'تمت الإضافة' : 'أضف للمقارنة'}
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
                      {c.price} د.أ
                    </div>
                  </div>

                  {/* Rating */}
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#d97706', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>★</span>
                    <span>{c.rating} ({c.reviews} تقييم)</span>
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
                        خبرة {c.experience} سنة • {c.engineers} مهندس • {c.city}
                      </div>
                    </div>

                    <div style={{
                      width: '44px',
                      height: '44px',
                      backgroundColor: '#0d6e75',
                      color: '#ffffff',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      fontWeight: '800',
                      flexShrink: 0
                    }}>
                      {c.initial}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Filters Card (Right in RTL, Child 2) */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}>
            <h2 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '20px', color: '#0c232f' }}>
              تصفية النتائج
            </h2>

            {/* City */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '6px' }}>
                المدينة
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', backgroundColor: '#fff', color: '#1e293b' }}
              >
                <option value="الكل">الكل</option>
                <option value="عمّان">عمّان</option>
                <option value="إربد">إربد</option>
                <option value="الزرقاء">الزرقاء</option>
                <option value="العقبة">العقبة</option>
              </select>
            </div>

            {/* Property Type */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '6px' }}>
                نوع العقار
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', backgroundColor: '#fff', color: '#1e293b' }}
              >
                <option value="شقة">شقة</option>
                <option value="فيلا">فيلا</option>
                <option value="مكتب">مكتب أو محل تجاري</option>
                <option value="أرض">أرض</option>
              </select>
            </div>

            {/* Max Price */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '6px' }}>
                السعر الأقصى
              </label>
              <select
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none', backgroundColor: '#fff', color: '#1e293b' }}
              >
                <option value={50}>50 د.أ</option>
                <option value={80}>80 د.أ</option>
                <option value={100}>100 د.أ</option>
                <option value={150}>150 د.أ</option>
              </select>
            </div>

            {/* Rating Pills matching 02 Offices.png */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '8px' }}>
                التقييم
              </label>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {[
                  { key: 'all', label: 'الكل' },
                  { key: '4.0', label: '4 فما فوق' },
                  { key: '4.5', label: '4.5 فما فوق' }
                ].map((pill) => {
                  const isSel = ratingFilter === pill.key;
                  return (
                    <button
                      key={pill.key}
                      type="button"
                      onClick={() => setRatingFilter(pill.key)}
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

        {/* Bottom Compare Notification Bar matching 02 Offices.png */}
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
          <button
            type="button"
            onClick={() => navigate('/compare')}
            style={{
              backgroundColor: '#0d6e75',
              color: '#ffffff',
              padding: '10px 24px',
              borderRadius: '8px',
              fontWeight: '700',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            قارن الآن
          </button>

          <span style={{ fontSize: '14px', fontWeight: '700', color: '#0c232f' }}>
            تم اختيار {comparedIds.length === 2 ? 'شركتين' : `${comparedIds.length} شركات`} للمقارنة
          </span>
        </div>
      </main>

      <Footer />
    </div>
  );
}
