import React, { useEffect, useState } from 'react';
import { useProduct } from '../hooks/useProduct.js';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

/* ── Theme Toggle Button ── */
const ThemeToggle = ({ isDark, onToggle }) => (
  <button
    onClick={onToggle}
    aria-label="Toggle dark/light mode"
    title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    className="relative w-12 h-6 rounded-full transition-all duration-300 focus:outline-none flex-shrink-0"
    style={{
      backgroundColor: isDark ? '#C9A96E' : '#d0c5b5',
      boxShadow: isDark ? '0 0 10px rgba(201,169,110,0.4)' : 'none',
    }}
  >
    <span
      className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm"
      style={{
        backgroundColor: isDark ? '#1b1814' : '#fbf9f6',
        transform: isDark ? 'translateX(24px)' : 'translateX(0)',
      }}
    >
      {isDark ? (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="#C9A96E" stroke="none">
          <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
        </svg>
      ) : (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#7A6E63" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      )}
    </span>
  </button>
);

/* ── tiny image-carousel for each product card ── */
const ImageCarousel = ({ images, title, isDark }) => {
  const [idx, setIdx] = useState(0);

  const noBg = isDark ? '#1e1c18' : '#f0ede8';
  const noTextColor = isDark ? '#6b6258' : '#B5ADA3';

  if (!images || images.length === 0) {
    return (
      <div
        className="w-full aspect-[4/5] flex flex-col items-center justify-center gap-3"
        style={{ backgroundColor: noBg }}
      >
        <svg className="w-8 h-8" fill="none" stroke="#C9A96E" strokeWidth="1" viewBox="0 0 24 24">
          <rect x="3" y="3" width="18" height="18" rx="1" />
          <path d="M3 16l5-5 4 4 3-3 6 6" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="8.5" cy="8.5" r="1.5" />
        </svg>
        <span className="text-[9px] uppercase tracking-[0.22em]" style={{ color: noTextColor }}>
          No Image
        </span>
      </div>
    );
  }

  const prev = (e) => { e.stopPropagation(); setIdx(i => (i - 1 + images.length) % images.length); };
  const next = (e) => { e.stopPropagation(); setIdx(i => (i + 1) % images.length); };

  return (
    <div className="relative w-full aspect-[4/5] overflow-hidden group" style={{ backgroundColor: noBg }}>
      <img
        src={images[idx].url}
        alt={`${title} — image ${idx + 1}`}
        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
      />

      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{ backgroundColor: 'rgba(27,24,20,0.65)', color: '#fbf9f6' }}
            aria-label="Previous image"
          >‹</button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{ backgroundColor: 'rgba(27,24,20,0.65)', color: '#fbf9f6' }}
            aria-label="Next image"
          >›</button>

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setIdx(i); }}
                className="w-1.5 h-1.5 rounded-full transition-all duration-200"
                style={{ backgroundColor: i === idx ? '#C9A96E' : 'rgba(255,255,255,0.5)' }}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}

      <div
        className="absolute top-2 right-2 text-[9px] uppercase tracking-[0.15em] px-2 py-0.5"
        style={{ backgroundColor: 'rgba(27,24,20,0.55)', color: '#fbf9f6' }}
      >
        {idx + 1} / {images.length}
      </div>
    </div>
  );
};

/* ── Product Card ── */
const ProductCard = ({ product, isDark }) => {
  const navigate = useNavigate();
  const { price, title, description, images, createdAt } = product;

  const formattedDate = new Date(createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  const currencySymbol = price.currency === 'INR' ? '₹'
    : price.currency === 'USD' ? '$'
      : price.currency === 'EUR' ? '€'
        : price.currency === 'GBP' ? '£'
          : price.currency;

  const cardBg      = isDark ? '#1c1a16' : '#fff';
  const cardBorder  = isDark ? '#2e2b25' : '#ebe8e3';
  const titleColor  = isDark ? '#f0ede6' : '#1b1c1a';
  const descColor   = isDark ? '#8a8070' : '#7A6E63';
  const metaColor   = isDark ? '#6b6258' : '#B5ADA3';

  return (
    <article
      className="flex flex-col group cursor-pointer transition-all duration-300"
      style={{
        backgroundColor: cardBg,
        border: `1px solid ${cardBorder}`,
        boxShadow: isDark ? '0 2px 12px rgba(0,0,0,0.35)' : '0 1px 6px rgba(180,165,140,0.08)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = isDark
          ? '0 8px 32px rgba(0,0,0,0.55), 0 0 0 1px rgba(201,169,110,0.18)'
          : '0 8px 32px rgba(180,165,140,0.22), 0 0 0 1px rgba(201,169,110,0.22)';
        e.currentTarget.style.borderColor = 'rgba(201,169,110,0.35)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = isDark ? '0 2px 12px rgba(0,0,0,0.35)' : '0 1px 6px rgba(180,165,140,0.08)';
        e.currentTarget.style.borderColor = cardBorder;
      }}
    >
      <ImageCarousel images={images} title={title} isDark={isDark} />

      <div className="flex flex-col flex-1 p-5 gap-3">
        <div className="flex items-start justify-between gap-3">
          <h2
            className="text-base font-light leading-snug flex-1 min-w-0 truncate"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: titleColor, fontSize: '1.1rem' }}
            title={title}
          >
            {title}
          </h2>
          <span className="text-sm font-medium shrink-0" style={{ color: '#C9A96E', fontFamily: "'Inter', sans-serif" }}>
            {currencySymbol}{price.amount.toLocaleString('en-IN')}
          </span>
        </div>

        <p className="text-xs leading-relaxed line-clamp-2 flex-1" style={{ color: descColor }}>
          {description || 'No description provided.'}
        </p>

        <div
          className="flex items-center justify-between pt-2"
          style={{ borderTop: `1px solid ${isDark ? '#2e2b25' : '#ebe8e3'}` }}
        >
          <span className="text-[9px] uppercase tracking-[0.18em]" style={{ color: metaColor }}>{formattedDate}</span>
          <span className="text-[9px] uppercase tracking-[0.18em]" style={{ color: metaColor }}>
            {images?.length ?? 0} {images?.length === 1 ? 'photo' : 'photos'}
          </span>
        </div>
      </div>
    </article>
  );
};

/* ── Empty State ── */
const EmptyState = ({ onAdd, isDark }) => (
  <div className="flex flex-col items-center justify-center py-28 gap-6">
    <div
      className="w-16 h-16 flex items-center justify-center"
      style={{ border: `1px solid ${isDark ? '#3a3528' : '#d0c5b5'}` }}
    >
      <svg className="w-7 h-7" fill="none" stroke="#C9A96E" strokeWidth="1" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    </div>
    <div className="text-center">
      <p className="text-2xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif", color: isDark ? '#f0ede6' : '#1b1c1a' }}>
        No listings yet
      </p>
      <p className="text-xs mt-2 tracking-wide" style={{ color: isDark ? '#8a8070' : '#7A6E63' }}>
        Your published products will appear here.
      </p>
    </div>
    <button
      onClick={onAdd}
      className="px-8 py-3 text-[10px] uppercase tracking-[0.28em] font-medium transition-all duration-300"
      style={{ backgroundColor: '#1b1c1a', color: '#fbf9f6' }}
      onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#C9A96E'; e.currentTarget.style.color = '#1b1c1a'; }}
      onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#1b1c1a'; e.currentTarget.style.color = '#fbf9f6'; }}
    >
      Create First Listing
    </button>
  </div>
);

/* ── Dashboard ── */
const Dashboard = () => {
  const { handleGetSellerProduct } = useProduct();
  const sellerProducts = useSelector(state => state.product.sellerProducts);
  const navigate = useNavigate();

  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('tivyro-theme');
    return saved ? saved === 'dark' : false;
  });

  const toggleTheme = () => {
    setIsDark(prev => {
      const next = !prev;
      localStorage.setItem('tivyro-theme', next ? 'dark' : 'light');
      return next;
    });
  };

  useEffect(() => {
    handleGetSellerProduct();
  }, []);

  const totalImages = (sellerProducts ?? []).reduce((sum, p) => sum + (p.images?.length ?? 0), 0);

  /* theme tokens */
  const bg             = isDark ? '#12110e' : '#fbf9f6';
  const headerColor    = isDark ? '#f0ede6' : '#1b1c1a';
  const borderColor    = isDark ? '#2e2b25' : '#ebe8e3';
  const backColor      = isDark ? '#6b6258' : '#B5ADA3';
  const statsBg        = isDark ? 'rgba(201,169,110,0.06)' : 'transparent';
  const statsValColor  = isDark ? '#f0ede6' : '#1b1c1a';
  const statsLblColor  = isDark ? '#6b6258' : '#B5ADA3';
  const sectionColor   = isDark ? '#8a8070' : '#7A6E63';

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />
      <style>{`
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: ${isDark ? '#1c1a16' : '#f5f2ee'}; }
        ::-webkit-scrollbar-thumb { background: ${isDark ? 'rgba(201,169,110,0.35)' : 'rgba(201,169,110,0.45)'}; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #C9A96E; }
        * { scrollbar-width: thin; scrollbar-color: ${isDark ? 'rgba(201,169,110,0.35)' : 'rgba(201,169,110,0.45)'} ${isDark ? '#1c1a16' : '#f5f2ee'}; }
      `}</style>

      <div
        className="min-h-screen selection:bg-[#C9A96E]/30 transition-colors duration-300"
        style={{ backgroundColor: bg, fontFamily: "'Inter', sans-serif" }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 xl:px-20">

          {/* ── Top Bar ── */}
          <div className="pt-10 pb-0 flex items-center justify-between gap-4">
            <div className="flex items-center gap-5">
              <button
                onClick={() => navigate(-1)}
                className="text-lg transition-colors duration-200 leading-none"
                style={{ color: backColor }}
                aria-label="Go back"
                onMouseEnter={e => e.currentTarget.style.color = '#C9A96E'}
                onMouseLeave={e => e.currentTarget.style.color = backColor}
              >←</button>
              <span
                className="text-[23px] font-medium tracking-[0.32em] uppercase"
                style={{ fontFamily: "'Cormorant Garamond', serif", color: '#ffa600ff' }}
              >
                Tivyro.
              </span>
            </div>

            <div className="flex items-center gap-4">
              <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
              <button
                onClick={() => navigate('/seller/create-product')}
                className="flex items-center gap-2 px-5 py-2.5 text-[10px] uppercase tracking-[0.25em] font-medium transition-all duration-300"
                style={{ backgroundColor: isDark ? '#C9A96E' : '#1b1c1a', color: isDark ? '#1b1c1a' : '#fbf9f6' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#C9A96E'; e.currentTarget.style.color = '#1b1c1a'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = isDark ? '#C9A96E' : '#1b1c1a'; e.currentTarget.style.color = isDark ? '#1b1c1a' : '#fbf9f6'; }}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                New Listing
              </button>
            </div>
          </div>

          {/* decorative separator */}
          <div className="mt-6 h-px" style={{ background: `linear-gradient(to right, transparent, ${borderColor}, transparent)` }} />

          {/* ── Page Header ── */}
          <div className="pt-8 pb-0">
            <h1
              className="text-4xl lg:text-5xl font-light leading-tight"
              style={{ fontFamily: "'Cormorant Garamond', serif", color: headerColor }}
            >
              My Listings
            </h1>
            <div className="mt-4 w-14 h-px" style={{ backgroundColor: '#C9A96E' }} />
          </div>

          {/* ── Stats strip ── */}
          {sellerProducts && sellerProducts.length > 0 && (
            <div
              className="mt-8 grid grid-cols-3 divide-x text-center transition-colors duration-300"
              style={{ border: `1px solid ${borderColor}`, backgroundColor: statsBg }}
            >
              {[
                { label: 'Total Listings', value: sellerProducts.length },
                { label: 'Total Photos',   value: totalImages },
                {
                  label: 'Latest',
                  value: new Date(
                    Math.max(...sellerProducts.map(p => new Date(p.createdAt)))
                  ).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                },
              ].map(({ label, value }) => (
                <div key={label} className="py-5 px-4" style={{ borderColor }}>
                  <p className="text-2xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif", color: statsValColor }}>
                    {value}
                  </p>
                  <p className="text-[9px] uppercase tracking-[0.2em] mt-1" style={{ color: statsLblColor }}>
                    {label}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* ── Content ── */}
          <div className="pb-24">
            {!sellerProducts || sellerProducts.length === 0 ? (
              <EmptyState onAdd={() => navigate('/seller/create-product')} isDark={isDark} />
            ) : (
              <>
                <div className="mt-10 mb-6 flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-[0.28em] font-medium" style={{ color: sectionColor }}>
                    {sellerProducts.length} {sellerProducts.length === 1 ? 'product' : 'products'}
                  </span>
                  <div className="flex-1 ml-6 h-px" style={{ backgroundColor: borderColor }} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {sellerProducts.map(product => (
                    <ProductCard key={product._id} product={product} isDark={isDark} />
                  ))}
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </>
  );
};

export default Dashboard;
