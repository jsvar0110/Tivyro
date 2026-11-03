import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useProduct } from '../hooks/useProduct.js';
import { Link, useNavigate } from 'react-router';
import { ProductGridSkeleton } from '../../Shared/components/Loader.jsx';

export default function Home() {
  const products = useSelector((state) => state.product.products);
  const { handleGetAllProducts } = useProduct();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [hoveredId, setHoveredId] = useState(null);
  const [imgIndex, setImgIndex] = useState({});
  const timerRef = useRef({});

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    handleGetAllProducts().catch(console.error).finally(() => setLoading(false));
  }, []);

  const filtered = (products || []).filter((p) => {
    const q = search.toLowerCase();
    return p.title?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q);
  });

  function handleCardEnter(id, count) {
    setHoveredId(id);
    if (count <= 1) return;
    setImgIndex((prev) => ({ ...prev, [id]: 0 }));
    let i = 0;
    timerRef.current[id] = setInterval(() => {
      i = (i + 1) % count;
      setImgIndex((prev) => ({ ...prev, [id]: i }));
    }, 900);
  }

  function handleCardLeave(id) {
    setHoveredId(null);
    clearInterval(timerRef.current[id]);
    setImgIndex((prev) => ({ ...prev, [id]: 0 }));
  }

  return (
    <>
      {/* Google Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;0,6..96,700;1,6..96,400&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      <style>{`
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24; display: inline-block; vertical-align: middle; line-height: 1; }
        .product-card { transition: transform 0.3s cubic-bezier(.22,1,.36,1); }
        .product-card:hover { transform: translateY(-4px); }
        .card-img { transition: transform 0.5s cubic-bezier(.22,1,.36,1); }
        .product-card:hover .card-img { transform: scale(1.06); }
      `}</style>

      <div style={{ fontFamily: "'Inter', sans-serif", backgroundColor: '#f9f9f9', color: '#1a1c1c' }} className="min-h-screen flex flex-col">

        {/* ── HERO SECTION ── */}
        <section className="relative overflow-hidden bg-[#f0f0f0] border-b border-gray-200 min-h-[520px] sm:min-h-[600px] md:min-h-[700px] flex flex-col justify-between">
          {/* Watermark */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center pointer-events-none select-none z-0 overflow-hidden">
            <span style={{ fontFamily: "'Bodoni Moda', serif", fontSize: 'clamp(54px, 15vw, 190px)', fontWeight: '700', color: 'rgb(8 0 0 / 88%)', letterSpacing: '-0.02em', whiteSpace: 'nowrap', textTransform: 'uppercase', lineHeight: 1 }}>
              TIVYRO
            </span>
          </div>

          <div className="relative z-10 flex-1 flex flex-col justify-between px-4 sm:px-8 md:px-16 pt-8 sm:pt-12 pb-8 sm:pb-10">
            {/* Top left italic */}
            <p style={{ fontFamily: "'Bodoni Moda', serif", fontStyle: 'italic', color: '#555' }} className="text-sm sm:text-base md:text-lg">
              FASHION THAT MOVES WITH YOU.
            </p>

            {/* Model image (center-right) */}
            <div className="absolute right-0 top-0 bottom-0 w-[55%] sm:w-[45%] md:w-[40%] flex items-center justify-center overflow-hidden pointer-events-none opacity-40 sm:opacity-85 md:opacity-100">
              <img
                src="/model.png"
                alt="Fashion model"
                style={{ filter: 'grayscale(50%) contrast(1.1)', width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
              />
            </div>

            {/* Bottom: buttons + collection tag */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mt-auto pt-6 sm:pt-8 border-t border-gray-300">
              <div className="flex flex-wrap items-center gap-4 sm:gap-8">
                <a href="#products" style={{ backgroundColor: '#000', color: '#fff', padding: '12px 28px', fontSize: '11px', fontWeight: '700', letterSpacing: '0.18em', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-block', border: '1px solid #000', transition: 'all 0.15s' }}
                  onMouseEnter={e => { e.target.style.backgroundColor = '#fff'; e.target.style.color = '#000'; }}
                  onMouseLeave={e => { e.target.style.backgroundColor = '#000'; e.target.style.color = '#fff'; }}>
                  SHOP NOW
                </a>
                <a href="#products" style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#000', borderBottom: '1px solid #000', paddingBottom: '2px', textDecoration: 'none' }}>
                  EXPLORE NEW IN
                </a>
              </div>
              <span style={{ fontSize: '10px', fontWeight: '600', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#777' }}>
                NEW COLLECTION 2024
              </span>
            </div>
          </div>
        </section>

        {/* ── CATEGORY SECTION ── */}
        <section style={{ backgroundColor: '#000', color: '#fff' }} className="py-12 sm:py-16 px-4 sm:px-8 md:px-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-8 md:mb-10 border-b border-gray-700 pb-4 sm:pb-6">
            <div>
              <p style={{ fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#888', marginBottom: '6px' }}>COLLECTIONS</p>
              <h2 style={{ fontFamily: "'Bodoni Moda', serif", letterSpacing: '0.1em', textTransform: 'uppercase' }} className="text-2xl sm:text-3xl md:text-[32px] font-normal">
                CURATED CATEGORIES
              </h2>
            </div>
          </div>

          {/* Exactly TWO cards: MEN and WOMEN only */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* MEN */}
            <div className="group flex flex-col sm:flex-row gap-5 sm:gap-6 items-center border border-gray-700 p-5 sm:p-6 bg-[#111]">
              <div className="w-full sm:w-1/2 aspect-[4/3] sm:aspect-square overflow-hidden bg-gray-800 flex-shrink-0">
                <img src="/men-gender-model.jpg" alt="Men's fashion" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(50%)' }} className="group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="flex flex-col justify-between h-full py-1 sm:py-2 w-full">
                <div>
                  <h3 style={{ fontFamily: "'Bodoni Moda', serif", textTransform: 'uppercase', marginBottom: '8px' }} className="text-xl sm:text-2xl md:text-[26px] font-normal">MEN</h3>
                  <p className="text-xs sm:text-sm text-gray-400 mb-4 sm:mb-6">Elevated everyday essentials.</p>
                </div>
                <Link to="/men" style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#fff', borderBottom: '1px solid #fff', paddingBottom: '2px', textDecoration: 'none', alignSelf: 'flex-start' }}>
                  SHOP MEN →
                </Link>
              </div>
            </div>

            {/* WOMEN */}
            <div className="group flex flex-col sm:flex-row gap-5 sm:gap-6 items-center border border-gray-700 p-5 sm:p-6 bg-[#111]">
              <div className="w-full sm:w-1/2 aspect-[4/3] sm:aspect-square overflow-hidden bg-gray-800 flex-shrink-0">
                <img src="/gender-model-p.jpeg" alt="Women's fashion" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(50%)' }} className="group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="flex flex-col justify-between h-full py-1 sm:py-2 w-full">
                <div>
                  <h3 style={{ fontFamily: "'Bodoni Moda', serif", textTransform: 'uppercase', marginBottom: '8px' }} className="text-xl sm:text-2xl md:text-[26px] font-normal">WOMEN</h3>
                  <p className="text-xs sm:text-sm text-gray-400 mb-4 sm:mb-6">Effortless style for every you.</p>
                </div>
                <Link to="/women" style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#fff', borderBottom: '1px solid #fff', paddingBottom: '2px', textDecoration: 'none', alignSelf: 'flex-start' }}>
                  SHOP WOMEN →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── NEW VIBES BANNER ── */}
        <section className="bg-[#e8e8e8] py-12 sm:py-16 px-4 sm:px-8 md:px-16 border-b border-gray-200">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-center">
            <div className="md:col-span-6 flex flex-col gap-4 sm:gap-6">
              <span style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.22em', textTransform: 'uppercase', border: '1px solid #aaa', padding: '4px 12px', display: 'inline-block', color: '#555', backgroundColor: '#fff', alignSelf: 'flex-start' }}>
                NEW SEASON
              </span>
              <h2 style={{ fontFamily: "'Bodoni Moda', serif", fontSize: 'clamp(38px, 6vw, 84px)', fontWeight: '400', letterSpacing: '-0.02em', textTransform: 'uppercase', color: '#000', lineHeight: 1 }}>
                NEW<br />VIBES
              </h2>
              <p style={{ fontSize: '15px', fontWeight: '300', color: '#555', maxWidth: '400px', lineHeight: '1.6' }}>
                Discover everything new and now.
              </p>
              <a href="#products" style={{ backgroundColor: '#000', color: '#fff', padding: '14px 28px', fontSize: '11px', fontWeight: '700', letterSpacing: '0.18em', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-block', border: '1px solid #000', alignSelf: 'flex-start', cursor: 'pointer', transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.color = '#000'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#000'; e.currentTarget.style.color = '#fff'; }}>
                EXPLORE COLLECTION
              </a>
            </div>
            <div className="md:col-span-6 flex justify-center md:justify-end">
              <div style={{ width: '100%', maxWidth: '420px', aspectRatio: '4/5', overflow: 'hidden', backgroundColor: '#ccc', border: '1px solid #ddd' }}>
                <img src="https://images.unsplash.com/photo-1536766820879-059fec98ec0a?w=600&q=80" alt="New vibes" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%) contrast(1.1)' }} />
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURES STRIP ── */}
        <section className="bg-white border-b border-gray-200 py-8 sm:py-10 px-4 sm:px-8 md:px-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:gap-4 lg:gap-0 lg:divide-x divide-gray-200">
            {[
              { icon: 'local_shipping', title: 'FAST DELIVERY', desc: 'Quick & safe delivery' },
              { icon: 'inventory_2', title: 'EASY RETURNS', desc: 'Within 15 days' },
              { icon: 'verified', title: 'QUALITY ASSURED', desc: 'Best fashion, best quality' },
              { icon: 'lock', title: 'SECURE PAYMENT', desc: '100% secure checkout' },
            ].map((f) => (
              <div key={f.title} className="flex items-start gap-4 py-4 sm:py-3 sm:px-4 lg:px-6 first:pl-0">
                <span className="material-symbols-outlined" style={{ fontSize: '26px', color: '#000' }}>{f.icon}</span>
                <div>
                  <h4 style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#000' }}>{f.title}</h4>
                  <p style={{ fontSize: '12px', color: '#777', marginTop: '3px' }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── BEST OF TIVYRO (Product Grid) ── */}
        <section className="bg-white py-12 sm:py-16 px-4 sm:px-8 md:px-16" id="products">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-gray-200">
            <div>
              <p style={{ fontSize: '10px', fontWeight: '600', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#777', marginBottom: '4px' }}>CURATION</p>
              <h2 style={{ fontFamily: "'Bodoni Moda', serif", letterSpacing: '0.1em', textTransform: 'uppercase', color: '#000' }} className="text-2xl sm:text-3xl md:text-[32px] font-normal">
                BEST OF TIVYRO
              </h2>
            </div>
            <a href="#" style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#000', borderBottom: '1px solid #000', paddingBottom: '2px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', alignSelf: 'flex-start' }}>
              VIEW ALL <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_forward</span>
            </a>
          </div>

          {/* Search bar */}
          <div className="mb-6 sm:mb-8">
            <input
              type="text"
              placeholder="Search products…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-72 max-w-full"
              style={{ border: '1px solid #ddd', padding: '10px 16px', fontSize: '13px', outline: 'none', fontFamily: "'Inter', sans-serif", borderRadius: '0' }}
              onFocus={e => e.target.style.borderColor = '#000'}
              onBlur={e => e.target.style.borderColor = '#ddd'}
            />
          </div>

          {/* Product Grid */}
          {loading ? (<ProductGridSkeleton />) : filtered.length === 0 ? (
            <div className="text-center py-20 sm:py-24">
              <p style={{ fontSize: '20px', fontFamily: "'Bodoni Moda', serif", color: '#999' }}>No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6 lg:gap-8">
              {filtered.map((product) => {
                const imgs = product.images || [];
                const currentImg = imgs.length > 0
                  ? imgs[imgIndex[product._id] ?? 0]?.url
                  : 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&q=80';
                const isHovered = hoveredId === product._id;

                return (
                  <div
                    key={product._id}
                    className="product-card group flex flex-col cursor-pointer"
                    onClick={() => navigate(`/product/${product._id}`)}
                    onMouseEnter={() => handleCardEnter(product._id, imgs.length)}
                    onMouseLeave={() => handleCardLeave(product._id)}
                  >
                    {/* Image container */}
                    <div className="relative overflow-hidden bg-gray-100 mb-2.5 sm:mb-4" style={{ aspectRatio: '3/4' }}>
                      <img
                        src={currentImg}
                        alt={product.title}
                        className="card-img w-full h-full object-cover"
                        style={{ filter: 'grayscale(20%)' }}
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&q=80'; }}
                      />
                      {/* Wishlist button */}
                      <button
                        aria-label="Add to wishlist"
                        onClick={(e) => e.stopPropagation()}
                        className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 sm:p-2 flex items-center justify-center cursor-pointer transition-opacity"
                        style={{ backgroundColor: 'rgba(255,255,255,0.9)', border: 'none', opacity: isHovered ? 1 : 0.7 }}
                      >
                        <span className="material-symbols-outlined text-[16px] sm:text-[18px] text-black">favorite</span>
                      </button>
                    </div>

                    {/* Card info */}
                    <div className="flex flex-col gap-1">
                      <h3 style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '0.04em' }} className="text-xs sm:text-sm font-medium text-black uppercase line-clamp-1">
                        {product.title}
                      </h3>
                      <p className="text-[11px] sm:text-xs text-gray-500 line-clamp-1 sm:line-clamp-2">{product.description}</p>
                      <p className="text-xs sm:text-sm font-semibold text-black mt-1">
                        ₹{product.price?.amount?.toLocaleString('en-IN')}
                        <span className="text-[10px] sm:text-[11px] text-gray-400 ml-1">{product.price?.currency}</span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ backgroundColor: '#fff', borderTop: '1px solid #e5e5e5' }} className="px-4 sm:px-8 md:px-16 py-12 md:py-16 flex flex-col md:flex-row justify-between items-start gap-8 md:gap-10">
          <div className="flex flex-col gap-3 max-w-xs">
            <span style={{ fontFamily: "'Bodoni Moda', serif", fontSize: '24px', fontWeight: '700', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#000' }}>TIVYRO</span>
            <p style={{ fontSize: '12px', color: '#777', lineHeight: '1.6' }}>Curated for the discerning few. Strict monochrome forms and uncompromising materials.</p>
            <p style={{ fontSize: '10px', color: '#999', letterSpacing: '0.12em', textTransform: 'uppercase' }}>© 2026 TIVYRO. ALL RIGHTS RESERVED.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-8 sm:gap-12 md:gap-16 w-full sm:w-auto">
            <div className="flex flex-col gap-2.5">
              <span style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#000' }}>EXPLORE</span>
              {['MEN', 'WOMEN', 'NEW IN', 'SALE'].map(l => (
                <Link key={l} to={l === 'MEN' ? '/men' : l === 'WOMEN' ? '/women' : '/'} style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#777', textDecoration: 'none' }} className="hover:text-black transition-colors">{l}</Link>
              ))}
            </div>
            <div className="flex flex-col gap-2.5">
              <span style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#000' }}>SUPPORT</span>
              {['SHIPPING & RETURNS', 'PRIVACY POLICY', 'TERMS OF SERVICE', 'HELP'].map(l => (
                <a key={l} href="#" style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#777', textDecoration: 'none' }} className="hover:text-black transition-colors">{l}</a>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
