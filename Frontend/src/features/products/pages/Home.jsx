import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useProduct } from '../hooks/useProduct.js';
import { Link } from 'react-router';

/* ─────────────────────────────────────────────────────────────────────────────
   Tivyro — Home / Products Page
   Full product grid · Dark / Light mode toggle
   Fonts: Cormorant Garamond + Inter + Geist
   Tailwind CSS + Aurelian Dark design-system tokens
   Matches Login.jsx / Register.jsx design language exactly.
───────────────────────────────────────────────────────────────────────────── */

// const PLACEHOLDER_IMG =
//   'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&q=80';

const CATEGORIES = ['All', 'Clothing', 'Accessories', 'Footwear', 'Lifestyle'];

export default function Home() {
  const products = useSelector((state) => state.product.products);
  const { handleGetAllProducts } = useProduct();

  const [dark, setDark] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [hoveredId, setHoveredId] = useState(null);
  const [imgIndex, setImgIndex] = useState({});
  const timerRef = useRef({});

  useEffect(() => {
    handleGetAllProducts();
  }, []);

  /* ── Theme tokens (identical mapping as Login / Register) ── */
  const d = dark;
  const tk = {
    pageBg: d ? '#121317' : '#fbf9f6',
    cardBg: d ? '#1c1c1c' : '#ffffff',
    cardBorder: d ? '#252525' : '#e5e1db',
    inputBg: d ? '#1a1a1a' : '#f5f3f0',
    inputBorder: d ? '#2c2c2c' : '#ddd8d0',
    focusColor: d ? '#f5c342' : '#C9A96E',
    text: d ? '#e3e2e7' : '#1b1c1a',
    textMuted: d ? '#d2c5ae' : '#5a5650',
    textSubtle: d ? '#9b8f7b' : '#9b9490',
    golden: d ? '#f5c342' : 'rgb(201,169,110)',
    goldenBright: d ? '#f5c342' : 'rgb(255,187,0)',
    divider: d ? '#252525' : '#e5e1db',
    headerBg: d ? 'rgba(18,19,23,0.94)' : 'rgba(251,249,246,0.94)',
    footerBg: d ? '#0d0e12' : '#f5f3f0',
    orb1: d ? 'rgba(245,195,66,0.07)' : 'rgba(212,167,44,0.11)',
    orb2: d ? 'rgba(245,195,66,0.045)' : 'rgba(212,167,44,0.075)',
    glowFocus: d ? 'rgba(245,195,66,0.18)' : 'rgba(201,169,110,0.18)',
    cardGlow: d ? 'rgba(245,195,66,0.08)' : 'rgba(212,167,44,0.12)',
    cardShadow: d
      ? '0 16px 48px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.03)'
      : '0 8px 32px rgba(27,24,20,0.09), 0 0 0 1px rgba(27,24,20,0.04)',
    heroBg: d
      ? 'linear-gradient(135deg, #15161b 0%, #1a1a22 50%, #111217 100%)'
      : 'linear-gradient(135deg, #f5f2ec 0%, #ede8df 50%, #f8f5f0 100%)',
    sheen: d
      ? 'linear-gradient(90deg, transparent 0%, rgba(245,195,66,0.35) 40%, rgba(245,195,66,0.60) 50%, rgba(245,195,66,0.35) 60%, transparent 100%)'
      : 'linear-gradient(90deg, transparent 0%, rgba(201,169,110,0.35) 40%, rgba(201,169,110,0.55) 50%, rgba(201,169,110,0.35) 60%, transparent 100%)',
    submitBg: d ? '#f5c342' : '#1b1c1a',
    submitText: d ? '#111111' : '#fbf9f6',
    submitHoverBg: d ? '#e8b63a' : '#2d2e2c',
  };

  /* ── Filtered products ── */
  const filtered = (products || []).filter((p) => {
    const q = search.toLowerCase();
    return (
      p.title?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q)
    );
  });

  /* ── Image cycling on hover ── */
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
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&family=Geist:wght@400;500;600&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        rel="stylesheet"
      />

      <style>{`
        @keyframes orbFloat {
          0%,100% { transform: translateY(0) scale(1); }
          50%      { transform: translateY(-22px) scale(1.03); }
        }
        @keyframes revealUp {
          from { opacity:0; transform:translateY(28px) scale(0.97); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
        @keyframes sheenSlide {
          0%   { background-position:-200% center; }
          100% { background-position: 300% center; }
        }
        @keyframes fadeIn {
          from { opacity:0; transform:translateY(14px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes barGrow {
          from { width:0; }
          to   { width:3rem; }
        }
        @keyframes pulseDot {
          0%,100% { opacity:1; }
          50%     { opacity:0.3; }
        }

        .home-root { transition: background-color .35s, color .35s; }
        .home-orb1 { animation: orbFloat 9s ease-in-out infinite; }
        .home-orb2 { animation: orbFloat 13s ease-in-out infinite reverse; }
        .home-hero { animation: revealUp .6s cubic-bezier(.22,1,.36,1) both; }
        .home-bar  { animation: barGrow .65s .3s cubic-bezier(.22,1,.36,1) both; }
        .home-sheen {
          background-size: 200% auto;
          animation: sheenSlide 4s linear infinite;
        }
        .product-card {
          transition: transform .3s cubic-bezier(.22,1,.36,1), box-shadow .3s, border-color .3s;
          animation: fadeIn .5s ease both;
        }
        .product-card:hover { transform: translateY(-6px); }
        .card-img { transition: transform .55s cubic-bezier(.22,1,.36,1); }
        .product-card:hover .card-img { transform: scale(1.07); }

        .cat-btn { transition: background-color .2s, color .2s, border-color .2s, transform .15s; }
        .cat-btn:hover { transform: translateY(-1px); }

        .home-toggle-btn { transition: background-color .3s, color .3s; }

        .badge-pulse { animation: pulseDot 2.4s ease-in-out infinite; }

        .price-tag { transition: transform .2s; }
        .product-card:hover .price-tag { transform: scale(1.04); }

        .nav-link { transition: color .2s; }
        .wishlist-btn {
          transition: background-color .2s, transform .2s, opacity .25s;
        }
        .wishlist-btn:hover { transform: scale(1.14); }

        .add-cart-btn { transition: background-color .2s, color .2s, transform .15s; }
        .add-cart-btn:hover { transform: scale(1.04); }
      `}</style>

      <div
        className="home-root min-h-screen flex flex-col"
        style={{ backgroundColor: tk.pageBg, color: tk.text, fontFamily: "'Inter', sans-serif" }}
      >
        {/* ── Ambient orbs ── */}
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          <div
            className="home-orb1 absolute"
            style={{ top: '-12%', right: '-6%', width: '48vw', height: '48vw', borderRadius: '50%', background: `radial-gradient(circle,${tk.orb1} 0%,transparent 70%)`, filter: 'blur(40px)' }}
          />
          <div
            className="home-orb2 absolute"
            style={{ bottom: '-15%', left: '-5%', width: '40vw', height: '40vw', borderRadius: '50%', background: `radial-gradient(circle,${tk.orb2} 0%,transparent 70%)`, filter: 'blur(48px)' }}
          />
        </div>

        {/* ── Header ── */}
        <header
          className="sticky top-0 z-50 border-b backdrop-blur-md px-6"
          style={{ backgroundColor: tk.headerBg, borderColor: tk.divider }}
        >
          <div className="max-w-[1280px] mx-auto h-14 flex items-center justify-between">
            {/* Logo */}
            <Link
              to="/"
              style={{ fontFamily: "'Cormorant Garamond', serif", color: tk.text, fontSize: '22px', fontWeight: '500', letterSpacing: '0.12em', textDecoration: 'none' }}
            >
              Tivyro.
            </Link>

            {/* Nav */}
            <nav className="hidden md:flex items-center gap-6">
              {['New In', 'Collections', 'Brands', 'Sale'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="nav-link text-[13px] font-medium no-underline"
                  style={{ color: tk.textMuted, fontFamily: "'Geist', sans-serif", letterSpacing: '0.04em' }}
                  onMouseEnter={(e) => (e.target.style.color = tk.golden)}
                  onMouseLeave={(e) => (e.target.style.color = tk.textMuted)}
                >
                  {item}
                </a>
              ))}
            </nav>

            {/* Right controls */}
            <div className="flex items-center gap-3">
              {/* Theme toggle */}
              <button
                id="home-theme-toggle"
                aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
                onClick={() => setDark((v) => !v)}
                className="home-toggle-btn flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium tracking-wide cursor-pointer border"
                style={{ backgroundColor: tk.cardBg, borderColor: tk.cardBorder, color: tk.textMuted, fontFamily: "'Geist', sans-serif" }}
              >
                <span>{dark ? '☀️' : '🌙'}</span>
                <span>{dark ? 'Light' : 'Dark'}</span>
              </button>

              {/* Cart */}
              <button
                aria-label="View cart"
                className="relative flex items-center justify-center w-9 h-9 rounded-full border cursor-pointer"
                style={{ backgroundColor: tk.cardBg, borderColor: tk.cardBorder }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: tk.textMuted }}>shopping_bag</span>
                <span
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center"
                  style={{ backgroundColor: tk.golden, color: '#111', fontFamily: "'Geist', sans-serif" }}
                >
                  {(products || []).length}
                </span>
              </button>

              {/* Sign In */}
              <Link
                to="/login"
                className="text-[12px] font-semibold no-underline px-4 py-1.5 rounded tracking-[0.06em] uppercase"
                style={{ backgroundColor: tk.submitBg, color: tk.submitText, fontFamily: "'Geist', sans-serif" }}
              >
                Sign In
              </Link>
            </div>
          </div>
        </header>

        {/* ── Hero Banner ── */}
        <section
          className="home-hero relative overflow-hidden px-6 py-16 md:py-24"
          style={{ background: tk.heroBg }}
        >
          {/* Sheen top line */}
          <div
            aria-hidden="true"
            className="home-sheen absolute top-0 left-0 right-0 h-[1.5px]"
            style={{ background: tk.sheen }}
          />

          <div className="max-w-[1280px] mx-auto relative z-10">
            <div className="max-w-2xl">
              {/* Badge */}
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-5"
                style={{ border: `1px solid ${tk.golden}4d`, backgroundColor: `${tk.golden}12` }}
              >
                <span
                  className="badge-pulse w-1.5 h-1.5 rounded-full inline-block"
                  style={{ backgroundColor: tk.golden }}
                />
                <span
                  className="text-[11px] font-semibold tracking-[0.18em] uppercase"
                  style={{ color: tk.golden, fontFamily: "'Geist', sans-serif" }}
                >
                  New Season — 2026
                </span>
              </div>

              <h1
                className="font-light leading-[1.06] mb-4"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.8rem,6vw,5rem)', color: tk.text }}
              >
                Curated for the<br />
                <em style={{ color: tk.golden }}>Discerning Few.</em>
              </h1>

              {/* <p
                className="mb-8 max-w-lg leading-relaxed text-[15px]"
                style={{ color: tk.textMuted, fontFamily: "'Inter', sans-serif" }}
              >
                Discover premium products handpicked from the world's finest artisans and designers.
                Every piece tells a story worth wearing.
              </p> */}

              {/* Stats strip */}
              <div className="flex gap-8 flex-wrap">
                {[{ value: '50K+', label: 'Members' }, { value: '2K+', label: 'Brands' }, { value: '100%', label: 'Curated' }].map((s) => (
                  <div key={s.label}>
                    <p className="text-2xl font-bold" style={{ color: tk.golden, fontFamily: "'Inter', sans-serif" }}>{s.value}</p>
                    <p className="text-[11px] tracking-[0.1em] uppercase mt-0.5" style={{ color: tk.textSubtle, fontFamily: "'Geist', sans-serif" }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Accent bar */}
          <div
            className="home-bar absolute bottom-0 left-6 h-[3px] rounded-full"
            style={{ backgroundColor: tk.golden }}
          />
        </section>

        {/* ── Main Content ── */}
        <main className="flex-1 relative z-10 px-4 sm:px-6 py-10 max-w-[1280px] mx-auto w-full">

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8">

            {/* Search */}
            <div className="relative w-full sm:max-w-xs">
              <span
                className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ fontSize: '17px', color: tk.textSubtle }}
              >
                search
              </span>
              <input
                id="home-search"
                type="text"
                placeholder="Search products…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg text-sm"
                style={{
                  backgroundColor: tk.inputBg,
                  border: `1px solid ${tk.inputBorder}`,
                  color: tk.text,
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.85rem',
                  outline: 'none',
                  transition: 'border-color .2s, box-shadow .2s',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = tk.focusColor;
                  e.target.style.boxShadow = `0 0 0 3px ${tk.glowFocus}`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = tk.inputBorder;
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Category pills */}
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map((cat) => {
                const isActive = cat === activeCategory;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className="cat-btn px-4 py-1.5 rounded-full text-[12px] font-semibold tracking-[0.08em] uppercase cursor-pointer border"
                    style={{
                      backgroundColor: isActive ? tk.golden : tk.cardBg,
                      color: isActive ? '#111' : tk.textMuted,
                      borderColor: isActive ? tk.golden : tk.cardBorder,
                      fontFamily: "'Geist', sans-serif",
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section heading */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p
                className="text-[10px] font-semibold tracking-[0.2em] uppercase mb-1"
                style={{ color: tk.golden, fontFamily: "'Geist', sans-serif" }}
              >
                Our Collection
              </p>
              <h2
                className="font-light leading-tight"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.5rem,3vw,2rem)', color: tk.text }}
              >
                Featured <em style={{ color: tk.golden }}>Products</em>
              </h2>
            </div>
            <span
              className="text-sm"
              style={{ color: tk.textSubtle, fontFamily: "'Geist', sans-serif" }}
            >
              {filtered.length} item{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Product Grid */}
          {filtered.length === 0 ? (
            <EmptyState tk={tk} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((product, idx) => {
                const imgs = product.images || [];
                const currentImg =
                  imgs.length > 0
                    ? imgs[imgIndex[product._id] ?? 0]?.url
                    : null;
                const isHovered = hoveredId === product._id;

                return (
                  <div
                    key={product._id}
                    className="product-card relative rounded-xl overflow-hidden cursor-pointer"
                    style={{
                      backgroundColor: tk.cardBg,
                      border: `1px solid ${isHovered ? tk.golden + '55' : tk.cardBorder}`,
                      boxShadow: isHovered
                        ? `0 24px 56px rgba(0,0,0,0.5), 0 0 0 1px ${tk.golden}22`
                        : tk.cardShadow,
                      animationDelay: `${idx * 60}ms`,
                    }}
                    onMouseEnter={() => handleCardEnter(product._id, imgs.length)}
                    onMouseLeave={() => handleCardLeave(product._id)}
                  >
                    {/* Sheen line */}
                    <div
                      aria-hidden="true"
                      className="home-sheen absolute top-0 left-0 right-0 h-[1px] z-10 rounded-t-xl"
                      style={{ background: tk.sheen }}
                    />

                    {/* Image block */}
                    <div className="relative overflow-hidden" style={{ aspectRatio: '3/4' }}>
                      {currentImg ? (
                        <img
                          src={currentImg}
                          alt={product.title}
                          className="card-img w-full h-full object-cover"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <div
                          className="w-full h-full"
                          style={{ backgroundColor: dark ? '#1c1c1c' : '#f0ede6' }}
                        />
                      )}

                      {/* Gradient overlay */}
                      <div
                        className="absolute inset-0"
                        style={{
                          background: dark
                            ? 'linear-gradient(to top, rgba(18,19,23,0.85) 0%, rgba(18,19,23,0.1) 45%, transparent 100%)'
                            : 'linear-gradient(to top, rgba(251,249,246,0.75) 0%, transparent 55%)',
                        }}
                      />

                      {/* Image dots */}
                      {imgs.length > 1 && (
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                          {imgs.map((_, i) => (
                            <span
                              key={i}
                              className="rounded-full"
                              style={{
                                width: i === (imgIndex[product._id] ?? 0) ? '16px' : '6px',
                                height: '6px',
                                backgroundColor: i === (imgIndex[product._id] ?? 0) ? tk.golden : `${tk.golden}50`,
                                transition: 'width .3s, background-color .3s',
                              }}
                            />
                          ))}
                        </div>
                      )}

                      {/* Wishlist */}
                      <button
                        aria-label="Add to wishlist"
                        className="wishlist-btn absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center border"
                        style={{
                          backgroundColor: dark ? 'rgba(18,19,23,0.72)' : 'rgba(251,249,246,0.88)',
                          borderColor: tk.cardBorder,
                          backdropFilter: 'blur(6px)',
                          opacity: isHovered ? 1 : 0.55,
                        }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '16px', color: tk.golden }}>favorite</span>
                      </button>

                      {/* New badge */}
                      <div
                        className="absolute top-3 left-3 z-10 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-[0.12em] uppercase"
                        style={{ backgroundColor: tk.golden, color: '#111', fontFamily: "'Geist', sans-serif" }}
                      >
                        New
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="p-4 relative">
                      {/* Glow */}
                      <div
                        aria-hidden="true"
                        className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-16 pointer-events-none"
                        style={{ background: `radial-gradient(ellipse at top, ${tk.cardGlow} 0%, transparent 70%)` }}
                      />

                      <div className="relative z-[1]">
                        <h3
                          className="font-medium leading-snug mb-1 line-clamp-1 capitalize"
                          style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.08rem', color: tk.text, letterSpacing: '0.01em' }}
                        >
                          {product.title}
                        </h3>

                        <p
                          className="text-[12px] leading-relaxed mb-3 line-clamp-2"
                          style={{ color: tk.textSubtle, fontFamily: "'Inter', sans-serif" }}
                        >
                          {product.description}
                        </p>

                        {/* Price + CTA */}
                        <div className="flex items-end justify-between">
                          <div className="price-tag">
                            <p className="text-[10px] font-semibold tracking-[0.15em] uppercase" style={{ color: tk.textSubtle, fontFamily: "'Geist', sans-serif" }}>Price</p>
                            <p className="text-lg font-bold leading-none" style={{ color: tk.golden, fontFamily: "'Inter', sans-serif" }}>
                              ₹{product.price?.amount?.toLocaleString('en-IN')}
                              <span className="text-[11px] font-medium ml-1" style={{ color: tk.textSubtle }}>{product.price?.currency}</span>
                            </p>
                          </div>

                          <button
                            aria-label={`Add ${product.title} to cart`}
                            className="add-cart-btn flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold tracking-[0.06em] cursor-pointer border-none"
                            style={{
                              backgroundColor: isHovered ? tk.golden : `${tk.golden}1a`,
                              color: isHovered ? '#111' : tk.golden,
                              fontFamily: "'Geist', sans-serif",
                            }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>add_shopping_cart</span>
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>

        {/* ── Footer ── */}
        <footer
          className="py-5 px-6 border-t relative z-10 mt-10"
          style={{ backgroundColor: tk.footerBg, borderColor: tk.divider }}
        >
          <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <span style={{ fontFamily: "'Cormorant Garamond', serif", color: tk.golden, fontSize: '18px', fontWeight: '500', letterSpacing: '0.12em' }}>
                Tivyro.
              </span>
              <span className="text-[12px] font-medium" style={{ color: `${tk.golden}b0`, fontFamily: "'Geist', sans-serif" }}>
                © 2026 Tivyro. All rights reserved.
              </span>
            </div>
            <nav className="flex gap-5">
              {['Privacy Policy', 'Terms of Service', 'Help'].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-[12px] font-medium no-underline opacity-70 transition-[color,opacity] duration-200 hover:opacity-100"
                  style={{ color: tk.textSubtle, fontFamily: "'Geist', sans-serif" }}
                  onMouseEnter={(e) => (e.target.style.color = tk.golden)}
                  onMouseLeave={(e) => (e.target.style.color = tk.textSubtle)}
                >
                  {link}
                </a>
              ))}
            </nav>
          </div>
        </footer>
      </div>
    </>
  );
}

/* ── Empty state ── */
function EmptyState({ tk }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
        style={{ backgroundColor: `${tk.golden}14`, border: `1px solid ${tk.golden}30` }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '28px', color: tk.golden }}>search_off</span>
      </div>
      <h3
        className="font-light mb-2"
        style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.6rem', color: tk.text }}
      >
        No products found
      </h3>
      <p style={{ color: tk.textSubtle, fontSize: '0.875rem', fontFamily: "'Inter', sans-serif" }}>
        Try a different search term or browse all categories.
      </p>
    </div>
  );
}
