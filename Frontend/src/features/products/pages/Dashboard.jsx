import React, { useEffect, useState } from 'react';
import { useProduct } from '../hooks/useProduct.js';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

/* ── tiny image-carousel for each product card ── */
const ImageCarousel = ({ images, title }) => {
  const [idx, setIdx] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div
        className="w-full aspect-[4/5] flex flex-col items-center justify-center gap-3"
        style={{ backgroundColor: '#f0ede8' }}
      >
        <svg className="w-8 h-8" fill="none" stroke="#C9A96E" strokeWidth="1" viewBox="0 0 24 24">
          <rect x="3" y="3" width="18" height="18" rx="1" />
          <path d="M3 16l5-5 4 4 3-3 6 6" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="8.5" cy="8.5" r="1.5" />
        </svg>
        <span
          className="text-[9px] uppercase tracking-[0.22em]"
          style={{ color: '#B5ADA3' }}
        >
          No Image
        </span>
      </div>
    );
  }

  const prev = (e) => { e.stopPropagation(); setIdx(i => (i - 1 + images.length) % images.length); };
  const next = (e) => { e.stopPropagation(); setIdx(i => (i + 1) % images.length); };

  return (
    <div className="relative w-full aspect-[4/5] overflow-hidden group" style={{ backgroundColor: '#f0ede8' }}>
      <img
        src={images[idx].url}
        alt={`${title} — image ${idx + 1}`}
        className="w-full h-full object-cover transition-opacity duration-500"
      />

      {/* Prev / Next */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{ backgroundColor: 'rgba(27,24,20,0.60)', color: '#fbf9f6' }}
            aria-label="Previous image"
          >
            ‹
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{ backgroundColor: 'rgba(27,24,20,0.60)', color: '#fbf9f6' }}
            aria-label="Next image"
          >
            ›
          </button>

          {/* Dot indicators */}
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

      {/* Image count badge */}
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
const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { price, title, description, images, _id, createdAt } = product;

  const formattedDate = new Date(createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  const currencySymbol = price.currency === 'INR' ? '₹'
    : price.currency === 'USD' ? '$'
      : price.currency === 'EUR' ? '€'
        : price.currency === 'GBP' ? '£'
          : price.currency;

  return (
    <article
      className="flex flex-col group"
      style={{ backgroundColor: '#fff', border: '1px solid #ebe8e3' }}
    >
      {/* Image area */}
      <ImageCarousel images={images} title={title} />

      {/* Body */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Title + price row */}
        <div className="flex items-start justify-between gap-3">
          <h2
            className="text-base font-light leading-snug flex-1 min-w-0 truncate"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a', fontSize: '1.1rem' }}
            title={title}
          >
            {title}
          </h2>
          <span
            className="text-sm font-medium shrink-0"
            style={{ color: '#C9A96E', fontFamily: "'Inter', sans-serif" }}
          >
            {currencySymbol}{price.amount.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Description */}
        <p
          className="text-xs leading-relaxed line-clamp-2 flex-1"
          style={{ color: '#7A6E63' }}
        >
          {description || 'No description provided.'}
        </p>

        {/* Meta */}
        <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid #ebe8e3' }}>
          <span className="text-[9px] uppercase tracking-[0.18em]" style={{ color: '#B5ADA3' }}>
            {formattedDate}
          </span>
          <span className="text-[9px] uppercase tracking-[0.18em]" style={{ color: '#B5ADA3' }}>
            {images?.length ?? 0} {images?.length === 1 ? 'photo' : 'photos'}
          </span>
        </div>
      </div>
    </article>
  );
};

/* ── Empty State ── */
const EmptyState = ({ onAdd }) => (
  <div className="flex flex-col items-center justify-center py-28 gap-6">
    <div
      className="w-16 h-16 flex items-center justify-center"
      style={{ border: '1px solid #d0c5b5' }}
    >
      <svg className="w-7 h-7" fill="none" stroke="#C9A96E" strokeWidth="1" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    </div>
    <div className="text-center">
      <p
        className="text-2xl font-light"
        style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}
      >
        No listings yet
      </p>
      <p className="text-xs mt-2 tracking-wide" style={{ color: '#7A6E63' }}>
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

/* ── Dashboard (main) ── */
const Dashboard = () => {
  const { handleGetSellerProduct } = useProduct();
  const sellerProducts = useSelector(state => state.product.sellerProducts);
  const navigate = useNavigate();

  useEffect(() => {
    handleGetSellerProduct();
  }, []);

  const totalImages = (sellerProducts ?? []).reduce((sum, p) => sum + (p.images?.length ?? 0), 0);

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      <div
        className="min-h-screen selection:bg-[#C9A96E]/30"
        style={{ backgroundColor: '#fbf9f6', fontFamily: "'Inter', sans-serif" }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 xl:px-20">

          {/* ── Top Bar ── */}
          <div className="pt-10 pb-0 flex items-center justify-between gap-4">
            <div className="flex items-center gap-5">
              <button
                onClick={() => navigate(-1)}
                className="text-lg transition-colors duration-200 leading-none"
                style={{ color: '#B5ADA3' }}
                aria-label="Go back"
                onMouseEnter={e => e.currentTarget.style.color = '#C9A96E'}
                onMouseLeave={e => e.currentTarget.style.color = '#B5ADA3'}
              >
                ←
              </button>
              <span
                className="text-[23px] font-medium tracking-[0.32em] uppercase"
                style={{ fontFamily: "'Cormorant Garamond', serif", color: '#ffa600ff' }}
              >
                Tivyro.
              </span>
            </div>

            {/* New listing CTA */}
            <button
              onClick={() => navigate('/seller/create-product')}
              className="flex items-center gap-2 px-5 py-2.5 text-[10px] uppercase tracking-[0.25em] font-medium transition-all duration-300"
              style={{ backgroundColor: '#1b1c1a', color: '#fbf9f6' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#C9A96E'; e.currentTarget.style.color = '#1b1c1a'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#1b1c1a'; e.currentTarget.style.color = '#fbf9f6'; }}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              New Listing
            </button>
          </div>

          {/* ── Page Header ── */}
          <div className="pt-10 pb-0">
            <h1
              className="text-4xl lg:text-5xl font-light leading-tight"
              style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}
            >
              My Listings
            </h1>
            <div className="mt-4 w-14 h-px" style={{ backgroundColor: '#C9A96E' }} />
          </div>

          {/* ── Stats strip ── */}
          {sellerProducts && sellerProducts.length > 0 && (
            <div
              className="mt-8 grid grid-cols-3 divide-x text-center"
              style={{ border: '1px solid #ebe8e3', divideColor: '#ebe8e3' }}
            >
              {[
                { label: 'Total Listings', value: sellerProducts.length },
                { label: 'Total Photos', value: totalImages },
                {
                  label: 'Latest',
                  value: new Date(
                    Math.max(...sellerProducts.map(p => new Date(p.createdAt)))
                  ).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                },
              ].map(({ label, value }) => (
                <div key={label} className="py-5 px-4">
                  <p
                    className="text-2xl font-light"
                    style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}
                  >
                    {value}
                  </p>
                  <p className="text-[9px] uppercase tracking-[0.2em] mt-1" style={{ color: '#B5ADA3' }}>
                    {label}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* ── Content ── */}
          <div className="pb-24">
            {!sellerProducts || sellerProducts.length === 0 ? (
              <EmptyState onAdd={() => navigate('/seller/create-product')} />
            ) : (
              <>
                {/* Section label */}
                <div className="mt-10 mb-6 flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-[0.28em] font-medium" style={{ color: '#7A6E63' }}>
                    {sellerProducts.length} {sellerProducts.length === 1 ? 'product' : 'products'}
                  </span>
                  <div className="flex-1 ml-6 h-px" style={{ backgroundColor: '#ebe8e3' }} />
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {sellerProducts.map(product => (
                    <ProductCard key={product._id} product={product} />
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
