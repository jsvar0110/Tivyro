import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useProduct } from '../hooks/useProduct.js';
import { Link, useNavigate } from 'react-router';

export default function Home() {
  const products = useSelector((state) => state.product.products);
  const { handleGetAllProducts } = useProduct();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [hoveredId, setHoveredId] = useState(null);
  const [imgIndex, setImgIndex] = useState({});
  const timerRef = useRef({});

  useEffect(() => { handleGetAllProducts(); }, []);

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
        <section className="relative overflow-hidden bg-[#f0f0f0] border-b border-gray-200" style={{ minHeight: '700px' }}>
          {/* Watermark */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center pointer-events-none select-none z-0 overflow-hidden">
            <span style={{ fontFamily: "'Bodoni Moda', serif", fontSize: '15vw', fontWeight: '700', color: 'rgb(8 0 0 / 88%)', letterSpacing: '-0.02em', whiteSpace: 'nowrap', textTransform: 'uppercase', lineHeight: 1 }}>
              TIVYRO
            </span>
          </div>

          <div className="relative z-10 h-full flex flex-col justify-between px-8 md:px-16 pt-12 pb-10" style={{ minHeight: '700px' }}>
            {/* Top left italic */}
            <p style={{ fontFamily: "'Bodoni Moda', serif", fontSize: '18px', fontStyle: 'italic', color: '#555' }}>
              FASHION THAT MOVES WITH YOU.
            </p>

            {/* Model image (center-right) */}
            <div className="absolute right-0 top-0 bottom-0 w-[45%] md:w-[40%] flex items-center justify-center overflow-hidden">
              <img
                src="/model.png"
                alt="Fashion model"
                style={{ filter: 'grayscale(50%) contrast(1.1)', width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
              />
            </div>

            {/* Bottom: buttons + collection tag */}
            <div className="flex items-end justify-between mt-auto pt-8 border-t border-gray-300">
              <div className="flex items-center gap-8">
                <a href="#products" style={{ backgroundColor: '#000', color: '#fff', padding: '14px 32px', fontSize: '11px', fontWeight: '700', letterSpacing: '0.18em', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-block', border: '1px solid #000', transition: 'all 0.15s' }}
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
        <section style={{ backgroundColor: '#000', color: '#fff' }} className="py-16 px-8 md:px-16">
          <div className="flex items-end justify-between mb-10 border-b border-gray-700 pb-6">
            <div>
              <p style={{ fontSize: '10px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#888', marginBottom: '8px' }}>COLLECTIONS</p>
              <h2 style={{ fontFamily: "'Bodoni Moda', serif", fontSize: '32px', fontWeight: '400', letterSpacing: '0.1em', textTransform: 'uppercase' }}>CURATED CATEGORIES</h2>
            </div>
          </div>

          {/* Exactly TWO cards: MEN and WOMEN only */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* MEN */}
            <div className="group flex flex-col sm:flex-row gap-6 items-center border border-gray-700 p-6 bg-[#111]">
              <div className="w-full sm:w-1/2 aspect-square overflow-hidden bg-gray-800 flex-shrink-0">
                <img src="/men-gender-model.jpg" alt="Men's fashion" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(50%)' }} className="group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="flex flex-col justify-between h-full py-2 w-full">
                <div>
                  <h3 style={{ fontFamily: "'Bodoni Moda', serif", fontSize: '26px', fontWeight: '400', textTransform: 'uppercase', marginBottom: '8px' }}>MEN</h3>
                  <p style={{ fontSize: '13px', color: '#aaa', marginBottom: '24px' }}>Elevated everyday essentials.</p>
                </div>
                <Link to="/?category=men" style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#fff', borderBottom: '1px solid #fff', paddingBottom: '2px', textDecoration: 'none', alignSelf: 'flex-start' }}>
                  SHOP MEN →
                </Link>
              </div>
            </div>

            {/* WOMEN */}
            <div className="group flex flex-col sm:flex-row gap-6 items-center border border-gray-700 p-6 bg-[#111]">
              <div className="w-full sm:w-1/2 aspect-square overflow-hidden bg-gray-800 flex-shrink-0">
                <img src="/gender-model-p.jpeg" alt="Women's fashion" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(50%)' }} className="group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="flex flex-col justify-between h-full py-2 w-full">
                <div>
                  <h3 style={{ fontFamily: "'Bodoni Moda', serif", fontSize: '26px', fontWeight: '400', textTransform: 'uppercase', marginBottom: '8px' }}>WOMEN</h3>
                  <p style={{ fontSize: '13px', color: '#aaa', marginBottom: '24px' }}>Effortless style for every you.</p>
                </div>
                <Link to="/?category=women" style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#fff', borderBottom: '1px solid #fff', paddingBottom: '2px', textDecoration: 'none', alignSelf: 'flex-start' }}>
                  SHOP WOMEN →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── NEW VIBES BANNER ── */}
        <section className="bg-[#e8e8e8] py-16 px-8 md:px-16 border-b border-gray-200">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
            <div className="md:col-span-6 flex flex-col gap-6">
              <span style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.22em', textTransform: 'uppercase', border: '1px solid #aaa', padding: '4px 12px', display: 'inline-block', color: '#555', backgroundColor: '#fff' }}>
                NEW SEASON
              </span>
              <h2 style={{ fontFamily: "'Bodoni Moda', serif", fontSize: 'clamp(48px, 6vw, 84px)', fontWeight: '400', letterSpacing: '-0.02em', textTransform: 'uppercase', color: '#000', lineHeight: 1 }}>
                NEW<br />VIBES
              </h2>
              <p style={{ fontSize: '16px', fontWeight: '300', color: '#555', maxWidth: '400px', lineHeight: '1.6' }}>
                Discover everything new and now.
              </p>
              <button style={{ backgroundColor: '#000', color: '#fff', padding: '16px 32px', fontSize: '11px', fontWeight: '700', letterSpacing: '0.18em', textTransform: 'uppercase', border: '1px solid #000', alignSelf: 'flex-start', cursor: 'pointer', transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.color = '#000'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#000'; e.currentTarget.style.color = '#fff'; }}>
                EXPLORE COLLECTION
              </button>
            </div>
            <div className="md:col-span-6 flex justify-end">
              <div style={{ width: '100%', maxWidth: '420px', aspectRatio: '4/5', overflow: 'hidden', backgroundColor: '#ccc', border: '1px solid #ddd' }}>
                <img src="https://images.unsplash.com/photo-1536766820879-059fec98ec0a?w=600&q=80" alt="New vibes" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%) contrast(1.1)' }} />
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURES STRIP ── */}
        <section className="bg-white border-b border-gray-200 py-10 px-8 md:px-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
            {[
              { icon: 'local_shipping', title: 'FAST DELIVERY', desc: 'Quick & safe delivery' },
              { icon: 'inventory_2', title: 'EASY RETURNS', desc: 'Within 15 days' },
              { icon: 'verified', title: 'QUALITY ASSURED', desc: 'Best fashion, best quality' },
              { icon: 'lock', title: 'SECURE PAYMENT', desc: '100% secure checkout' },
            ].map((f) => (
              <div key={f.title} className="flex items-start gap-4 py-6 sm:py-4 sm:px-6 first:pl-0">
                <span className="material-symbols-outlined" style={{ fontSize: '28px', color: '#000' }}>{f.icon}</span>
                <div>
                  <h4 style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#000' }}>{f.title}</h4>
                  <p style={{ fontSize: '12px', color: '#777', marginTop: '4px' }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── BEST OF TIVYRO (Product Grid) ── */}
        <section className="bg-white py-16 px-8 md:px-16" id="products">
          {/* Header */}
          <div className="flex items-end justify-between mb-10 pb-4 border-b border-gray-200">
            <div>
              <p style={{ fontSize: '10px', fontWeight: '600', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#777', marginBottom: '4px' }}>CURATION</p>
              <h2 style={{ fontFamily: "'Bodoni Moda', serif", fontSize: '32px', fontWeight: '400', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#000' }}>BEST OF TIVYRO</h2>
            </div>
            <a href="#" style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#000', borderBottom: '1px solid #000', paddingBottom: '2px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              VIEW ALL <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_forward</span>
            </a>
          </div>

          {/* Search bar */}
          <div className="mb-8">
            <input
              type="text"
              placeholder="Search products…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ border: '1px solid #ddd', padding: '10px 16px', fontSize: '13px', outline: 'none', width: '280px', fontFamily: "'Inter', sans-serif", borderRadius: '0' }}
              onFocus={e => e.target.style.borderColor = '#000'}
              onBlur={e => e.target.style.borderColor = '#ddd'}
            />
          </div>

          {/* Product Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <p style={{ fontSize: '24px', fontFamily: "'Bodoni Moda', serif", color: '#999' }}>No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
                    <div className="relative overflow-hidden bg-gray-100 mb-4" style={{ aspectRatio: '3/4' }}>
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
                        style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: 'rgba(255,255,255,0.9)', border: 'none', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: isHovered ? 1 : 0.6, transition: 'opacity 0.2s' }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#000' }}>favorite</span>
                      </button>
                    </div>

                    {/* Card info */}
                    <div className="flex flex-col gap-1">
                      <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: '500', color: '#000', textTransform: 'uppercase', letterSpacing: '0.04em' }} className="line-clamp-1">
                        {product.title}
                      </h3>
                      <p style={{ fontSize: '12px', color: '#888' }} className="line-clamp-2">{product.description}</p>
                      <p style={{ fontSize: '14px', fontWeight: '600', color: '#000', marginTop: '4px' }}>
                        ₹{product.price?.amount?.toLocaleString('en-IN')}
                        <span style={{ fontSize: '11px', color: '#999', marginLeft: '4px' }}>{product.price?.currency}</span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ backgroundColor: '#fff', borderTop: '1px solid #e5e5e5' }} className="px-8 md:px-16 py-16 flex flex-col md:flex-row justify-between items-start gap-10">
          <div className="flex flex-col gap-4 max-w-xs">
            <span style={{ fontFamily: "'Bodoni Moda', serif", fontSize: '24px', fontWeight: '700', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#000' }}>TIVYRO</span>
            <p style={{ fontSize: '12px', color: '#777', lineHeight: '1.6' }}>Curated for the discerning few. Strict monochrome forms and uncompromising materials.</p>
            <p style={{ fontSize: '10px', color: '#999', letterSpacing: '0.12em', textTransform: 'uppercase' }}>© 2026 TIVYRO. ALL RIGHTS RESERVED.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-10 md:gap-16">
            <div className="flex flex-col gap-3">
              <span style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#000' }}>EXPLORE</span>
              {['MEN', 'WOMEN', 'NEW IN', 'SALE'].map(l => (
                <a key={l} href="#" style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#777', textDecoration: 'none' }} className="hover:text-black transition-colors">{l}</a>
              ))}
            </div>
            <div className="flex flex-col gap-3">
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
