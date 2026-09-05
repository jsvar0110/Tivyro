import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useProduct } from '../hooks/useProduct.js';

const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'JPY'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const currencySymbol = (c) =>
  c === 'INR' ? '₹' : c === 'USD' ? '$' : c === 'EUR' ? '€' : c === 'GBP' ? '£' : c === 'JPY' ? '¥' : c;

const ThemeToggle = ({ isDark, onToggle }) => (
  <button
    onClick={onToggle}
    aria-label="Toggle dark/light mode"
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
          <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      )}
    </span>
  </button>
);

const ImageCarousel = ({ images, title, isDark, aspectClass = 'aspect-[4/5]' }) => {
  const [idx, setIdx] = useState(0);
  const noBg = isDark ? '#1e1c18' : '#f0ede8';
  const noTextColor = isDark ? '#6b6258' : '#B5ADA3';

  if (!images || images.length === 0) {
    return (
      <div className={`w-full ${aspectClass} flex flex-col items-center justify-center gap-2`} style={{ backgroundColor: noBg }}>
        <svg className="w-7 h-7" fill="none" stroke="#C9A96E" strokeWidth="1" viewBox="0 0 24 24">
          <rect x="3" y="3" width="18" height="18" rx="1" />
          <path d="M3 16l5-5 4 4 3-3 6 6" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="8.5" cy="8.5" r="1.5" />
        </svg>
        <span className="text-[9px] uppercase tracking-[0.22em]" style={{ color: noTextColor }}>No Image</span>
      </div>
    );
  }

  const prev = (e) => { e.stopPropagation(); setIdx(i => (i - 1 + images.length) % images.length); };
  const next = (e) => { e.stopPropagation(); setIdx(i => (i + 1) % images.length); };

  return (
    <div className={`relative w-full ${aspectClass} overflow-hidden group`} style={{ backgroundColor: noBg }}>
      <img src={images[idx].url} alt={`${title} ${idx + 1}`} className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105" />
      {images.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ backgroundColor: 'rgba(27,24,20,0.65)', color: '#fbf9f6' }}>&#8249;</button>
          <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ backgroundColor: 'rgba(27,24,20,0.65)', color: '#fbf9f6' }}>&#8250;</button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, i) => (
              <button key={i} onClick={(e) => { e.stopPropagation(); setIdx(i); }} className="w-1.5 h-1.5 rounded-full transition-all duration-200" style={{ backgroundColor: i === idx ? '#C9A96E' : 'rgba(255,255,255,0.5)' }} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const AttributeChip = ({ attrKey, attrValue, onRemove, isDark }) => (
  <div
    className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] uppercase tracking-[0.15em]"
    style={{ backgroundColor: isDark ? 'rgba(201,169,110,0.08)' : 'rgba(201,169,110,0.12)', border: '1px solid rgba(201,169,110,0.3)', color: '#C9A96E' }}
  >
    <span>{attrKey}: {attrValue}</span>
    {onRemove && (
      <button onClick={onRemove} className="leading-none hover:opacity-70 transition-opacity ml-0.5" aria-label={`Remove ${attrKey}`}>&#215;</button>
    )}
  </div>
);

const VariantCard = ({ variant, isDark, onStockUpdate }) => {
  const [stockDelta, setStockDelta] = useState(variant.stock ?? 0);
  const [isSaving, setIsSaving] = useState(false);

  const cardBg = isDark ? '#1c1a16' : '#fff';
  const cardBorder = isDark ? '#2e2b25' : '#ebe8e3';
  const textColor = isDark ? '#f0ede6' : '#1b1c1a';
  const mutedColor = isDark ? '#8a8070' : '#7A6E63';

  const attrEntries = variant.attributes
    ? (variant.attributes instanceof Map ? Array.from(variant.attributes.entries()) : Object.entries(variant.attributes))
    : [];

  const handleSave = async () => {
    setIsSaving(true);
    try { await onStockUpdate(variant._id, stockDelta); }
    finally { setIsSaving(false); }
  };

  return (
    <article
      className="flex flex-col transition-all duration-300"
      style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}`, boxShadow: isDark ? '0 2px 12px rgba(0,0,0,0.35)' : '0 1px 6px rgba(180,165,140,0.08)' }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = isDark ? '0 8px 28px rgba(0,0,0,0.5), 0 0 0 1px rgba(201,169,110,0.18)' : '0 8px 28px rgba(180,165,140,0.22), 0 0 0 1px rgba(201,169,110,0.22)'; e.currentTarget.style.borderColor = 'rgba(201,169,110,0.35)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = isDark ? '0 2px 12px rgba(0,0,0,0.35)' : '0 1px 6px rgba(180,165,140,0.08)'; e.currentTarget.style.borderColor = cardBorder; }}
    >
      <ImageCarousel images={variant.images ?? []} title="variant" isDark={isDark} aspectClass="aspect-square" />
      <div className="p-4 flex flex-col gap-3 flex-1">
        {attrEntries.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {attrEntries.map(([k, v]) => <AttributeChip key={k} attrKey={k} attrValue={v} isDark={isDark} />)}
          </div>
        )}
        <div className="flex items-center justify-between">
          {variant.price?.amount != null ? (
            <>
              <span className="text-sm font-semibold" style={{ color: '#C9A96E' }}>
                {currencySymbol(variant.price.currency)}{variant.price.amount.toLocaleString('en-IN')}
              </span>
              <span className="text-[9px] uppercase tracking-[0.18em]" style={{ color: mutedColor }}>{variant.price.currency}</span>
            </>
          ) : (
            <span className="text-xs italic" style={{ color: mutedColor }}>Base price</span>
          )}
        </div>
        <div style={{ height: '1px', backgroundColor: isDark ? '#2e2b25' : '#ebe8e3' }} />
        <div className="flex flex-col gap-2">
          <span className="text-[9px] uppercase tracking-[0.2em]" style={{ color: mutedColor }}>Stock</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setStockDelta(s => Math.max(0, s - 1))} className="w-7 h-7 flex items-center justify-center text-sm transition-all duration-200" style={{ border: '1px solid rgba(201,169,110,0.4)', color: '#C9A96E' }} onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(201,169,110,0.12)'; }} onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}>&#8722;</button>
            <span className="min-w-[2rem] text-center text-sm font-medium" style={{ color: textColor }}>{stockDelta}</span>
            <button onClick={() => setStockDelta(s => s + 1)} className="w-7 h-7 flex items-center justify-center text-sm transition-all duration-200" style={{ border: '1px solid rgba(201,169,110,0.4)', color: '#C9A96E' }} onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(201,169,110,0.12)'; }} onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}>&#43;</button>
            <button onClick={handleSave} disabled={isSaving} className="flex-1 py-1.5 text-[9px] uppercase tracking-[0.22em] font-medium transition-all duration-200 disabled:opacity-50" style={{ backgroundColor: '#C9A96E', color: '#12110e' }} onMouseEnter={e => { if (!isSaving) e.currentTarget.style.backgroundColor = '#b8924a'; }} onMouseLeave={e => { if (!isSaving) e.currentTarget.style.backgroundColor = '#C9A96E'; }}>
              {isSaving ? 'Saving...' : 'Save Stock'}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

const SellerProductDetails = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const { handleGetProductById, handleAddProductVariant } = useProduct();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('tivyro-theme');
    return saved ? saved === 'dark' : true;
  });
  const toggleTheme = () => setIsDark(prev => { const next = !prev; localStorage.setItem('tivyro-theme', next ? 'dark' : 'light'); return next; });

  const [attrKey, setAttrKey] = useState('');
  const [attrValue, setAttrValue] = useState('');
  const [selectedSize, setSelectedSize] = useState(''); //Size
  const [attributes, setAttributes] = useState({});
  const [variantImages, setVariantImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [variantPrice, setVariantPrice] = useState('');
  const [variantCurrency, setVariantCurrency] = useState('INR');
  const [variantStock, setVariantStock] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  async function fetchProduct() {
    setIsLoading(true);
    try {
      const data = await handleGetProductById(productId);
      setProduct(data?.product || data);
    } catch (err) { console.error('Failed to fetch product', err); }
    finally { setIsLoading(false); }
  }

  useEffect(() => { fetchProduct(); }, [productId]);

  const addFiles = useCallback((files) => {

    const availableSlots = 7 - variantImages.length;
    const incoming = Array.from(files)
    const toAdd = incoming.slice(0, availableSlots)

    if (incoming.length > availableSlots) {
      alert(`You can upload up to 7 images . ${toAdd.length} added`)
    }

    setVariantImages(prev => [...prev, ...toAdd.map(f => ({ file: f, preview: URL.createObjectURL(f) }))]);
  }, [variantImages]);

  const handleDrop = useCallback((e) => {
    e.preventDefault(); setIsDragging(false);
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
  }, [addFiles]);

  const removeVariantImage = (index) => {
    setVariantImages(prev => { const updated = [...prev]; URL.revokeObjectURL(updated[index].preview); updated.splice(index, 1); return updated; });
  };



  const toggleSize = (size) => {
    if (selectedSize === size) {
      setSelectedSize('');
      setAttributes(prev => { const next = { ...prev }; delete next.Size; return next; });
    } else {
      setSelectedSize(size);
      setAttributes(prev => ({ ...prev, Size: size }));
    }
  };


  const addAttribute = () => {
    if (!attrKey.trim() || !attrValue.trim()) return;
    if (attrKey.trim().toLowerCase() === 'size') {
      alert('Use the Size selector above instead.');
      return;
    }
    setAttributes(prev => ({ ...prev, [attrKey.trim()]: attrValue.trim() }));
    setAttrKey(''); setAttrValue('');
  };

  const removeAttribute = (k) => setAttributes(prev => { const next = { ...prev }; delete next[k]; return next; });

  const handleSubmitVariant = async (e) => {
    e.preventDefault();

    if (Object.keys(attributes).length == 0) {
      alert('Atleast one attribute is required')
      return;
    }



    const newVariant = {
      images: variantImages.map(img => ({ url: img.preview, file: img.file })),
      stock: variantStock,
      price: variantPrice
        ? { amount: parseFloat(variantPrice), currency: variantCurrency }
        : undefined, //Now Price is optional 
      attributes
    };

    // Storing locally immediately, before the API call finishes

    setProduct(prev => ({ ...prev, variants: [...(prev?.variants ?? []), newVariant] }))
    setAttributes({});
    setAttributes({});
    setSelectedSize('');   // NEW
    setVariantImages([]);
    setVariantPrice('');
    setVariantCurrency('INR');
    setVariantStock(0)
    setAttrKey('')
    setAttrValue('');

    setIsSubmitting(true)

    try {

      await handleAddProductVariant(productId, newVariant)
      fetchProduct()

    } catch (err) {

      console.error('failed to create variant', err)
      fetchProduct() // Revert to the server state if API call fails

    } finally {
      setIsSubmitting(false)
    }

  };


  const handleStockUpdate = async (variantId, newStock) => {
    console.log('Update stock:', variantId, newStock);
  };

  const bg = isDark ? '#12110e' : '#fbf9f6';
  const cardBg = isDark ? '#1c1a16' : '#fff';
  const headerColor = isDark ? '#f0ede6' : '#1b1c1a';
  const borderColor = isDark ? '#2e2b25' : '#ebe8e3';
  const backColor = isDark ? '#6b6258' : '#B5ADA3';
  const labelColor = isDark ? '#8a8070' : '#7A6E63';
  const subLabelColor = isDark ? '#6b6258' : '#B5ADA3';
  const inputColor = isDark ? '#e8e2d8' : '#1b1c1a';
  const inputBorder = isDark ? '#3a3528' : '#d0c5b5';
  const optionBg = isDark ? '#1a1814' : '#fbf9f6';
  const dropZoneBorder = isDark ? '#3a3528' : '#d0c5b5';
  const descColor = isDark ? '#8a8070' : '#7A6E63';

  const inputClass = 'w-full bg-transparent outline-none py-2.5 text-sm transition-colors duration-300';
  const makeInputStyle = () => ({ color: inputColor, borderBottom: `1px solid ${inputBorder}`, fontFamily: "'Inter', sans-serif" });
  const handleFocus = (e) => { e.target.style.borderBottomColor = '#C9A96E'; };
  const handleBlur = (e) => { e.target.style.borderBottomColor = inputBorder; };

  const formattedDate = product?.createdAt ? new Date(product.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '--';

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: bg }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(201,169,110,0.3)', borderTopColor: '#C9A96E' }} />
          <span className="text-[10px] uppercase tracking-[0.28em]" style={{ color: subLabelColor }}>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
      <style>{`
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: ${isDark ? '#1c1a16' : '#f5f2ee'}; }
        ::-webkit-scrollbar-thumb { background: ${isDark ? 'rgba(201,169,110,0.35)' : 'rgba(201,169,110,0.45)'}; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #C9A96E; }
        * { scrollbar-width: thin; scrollbar-color: ${isDark ? 'rgba(201,169,110,0.35)' : 'rgba(201,169,110,0.45)'} ${isDark ? '#1c1a16' : '#f5f2ee'}; }
        input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;}
        select option { background-color: ${optionBg}; color: ${inputColor}; }
      `}</style>

      <div className="min-h-screen selection:bg-[#C9A96E]/30 transition-colors duration-300" style={{ backgroundColor: bg, fontFamily: "'Inter', sans-serif" }}>

        {/* Top Bar */}
        <div className="sticky top-0 z-30 px-6 lg:px-12 xl:px-20 py-3 flex items-center justify-between gap-4 transition-colors duration-300"
          style={{ backgroundColor: isDark ? 'rgba(18,17,14,0.92)' : 'rgba(251,249,246,0.92)', backdropFilter: 'blur(14px)', borderBottom: `1px solid ${borderColor}` }}>
          <div className="flex items-center gap-5">
            <button onClick={() => navigate(-1)} className="text-lg transition-colors duration-200 leading-none" style={{ color: backColor }}
              onMouseEnter={e => e.currentTarget.style.color = '#C9A96E'} onMouseLeave={e => e.currentTarget.style.color = backColor}>
              &#8592;
            </button>
            <span className="text-[20px] font-medium tracking-[0.28em] uppercase" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#ffa600' }}>
              Tivyro.
            </span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
            <button
              onClick={() => document.getElementById('create-variant-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center gap-2 px-5 py-2.5 text-[10px] uppercase tracking-[0.25em] font-medium transition-all duration-300"
              style={{ backgroundColor: '#C9A96E', color: '#12110e' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#b8924a'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#C9A96E'; }}>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              Add Variant
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 xl:px-20">
          <div className="mt-8 h-px" style={{ background: `linear-gradient(to right, transparent, ${borderColor}, transparent)` }} />

          {/* Page Header */}
          <div className="pt-8 pb-0">
            <h1 className="text-4xl lg:text-5xl font-light leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif", color: headerColor }}>
              {product?.title || 'Product Details'}
            </h1>
            <div className="mt-3 w-14 h-px" style={{ backgroundColor: '#C9A96E' }} />
            {product?.description && (
              <p className="mt-4 max-w-xl text-sm leading-relaxed" style={{ color: descColor }}>{product.description}</p>
            )}
          </div>

          {/* Two-column layout */}
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 lg:gap-12 items-start">

            {/* LEFT � product image + stats */}
            <div className="flex flex-col gap-6">
              <ImageCarousel images={product?.images ?? []} title={product?.title ?? ''} isDark={isDark} aspectClass="aspect-[4/5] lg:aspect-[3/4]" />
              <div className="grid grid-cols-3 divide-x text-center"
                style={{ border: `1px solid ${borderColor}`, backgroundColor: isDark ? 'rgba(201,169,110,0.04)' : 'transparent' }}>
                {[
                  { label: 'Base Price', value: `${currencySymbol(product?.price?.currency)}${(product?.price?.amount ?? 0).toLocaleString('en-IN')}` },
                  { label: 'Variants', value: product?.variants?.length ?? 0 },
                  { label: 'Created', value: formattedDate },
                ].map(({ label, value }) => (
                  <div key={label} className="py-4 px-3" style={{ borderColor }}>
                    <p className="text-lg font-light" style={{ fontFamily: "'Cormorant Garamond', serif", color: isDark ? '#f0ede6' : '#1b1c1a' }}>{value}</p>
                    <p className="text-[9px] uppercase tracking-[0.2em] mt-1" style={{ color: subLabelColor }}>{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT � Create Variant form */}
            <div id="create-variant-form">
              <div className="flex flex-col gap-6 p-6"
                style={{ backgroundColor: cardBg, border: `1px solid ${borderColor}`, borderLeft: '4px solid #C9A96E', boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.4)' : '0 2px 12px rgba(180,165,140,0.1)' }}>
                <div>
                  <h2 className="text-2xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif", color: headerColor }}>New Variant</h2>
                  <p className="text-[10px] uppercase tracking-[0.2em] mt-1" style={{ color: subLabelColor }}>Define attributes, images, price & stock</p>
                </div>
                <form onSubmit={handleSubmitVariant} className="flex flex-col gap-6">


                  {/* Size */}
                  <div className="flex flex-col gap-3">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-medium" style={{ color: labelColor }}>Size</label>
                    <div className="flex flex-wrap gap-2">
                      {SIZES.map(size => {
                        const isSelected = selectedSize === size;
                        return (
                          <button
                            key={size}
                            type="button"
                            onClick={() => toggleSize(size)}
                            className="w-10 h-10 flex items-center justify-center text-xs uppercase tracking-wider transition-all duration-200"
                            style={{
                              border: `1px solid ${isSelected ? '#C9A96E' : inputBorder}`,
                              backgroundColor: isSelected ? '#C9A96E' : 'transparent',
                              color: isSelected ? '#12110e' : labelColor,
                            }}
                          >
                            {size}
                          </button>
                        );
                      })}
                    </div>
                  </div>


                  {/* Attributes */}
                  <div className="flex flex-col gap-3">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-medium" style={{ color: labelColor }}>Attributes</label>
                    <div className="flex gap-2 items-end">
                      <div className="flex flex-col gap-0.5 flex-1">
                        <span className="text-[9px] uppercase tracking-[0.15em]" style={{ color: subLabelColor }}>Key</span>
                        <input type="text" value={attrKey} onChange={e => setAttrKey(e.target.value)} placeholder="e.g. Color"
                          className={inputClass} style={makeInputStyle()} onFocus={handleFocus} onBlur={handleBlur}
                          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addAttribute())} />
                      </div>
                      <div className="flex flex-col gap-0.5 flex-1">
                        <span className="text-[9px] uppercase tracking-[0.15em]" style={{ color: subLabelColor }}>Value</span>
                        <input type="text" value={attrValue} onChange={e => setAttrValue(e.target.value)} placeholder="e.g. Red"
                          className={inputClass} style={makeInputStyle()} onFocus={handleFocus} onBlur={handleBlur}
                          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addAttribute())} />
                      </div>
                      <button type="button" onClick={addAttribute}
                        className="px-4 py-2.5 text-[10px] uppercase tracking-[0.2em] font-medium transition-all duration-200 shrink-0"
                        style={{ border: '1px solid rgba(201,169,110,0.5)', color: '#C9A96E', backgroundColor: 'transparent' }}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(201,169,110,0.1)'; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}>Add</button>
                    </div>
                    {Object.keys(attributes).length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {Object.entries(attributes).map(([k, v]) => (
                          <AttributeChip key={k} attrKey={k} attrValue={v} onRemove={() => removeAttribute(k)} isDark={isDark} />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Images */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] uppercase tracking-[0.2em] font-medium" style={{ color: labelColor }}>Variant Images</label>
                      <span className="text-[10px]" style={{ color: subLabelColor }}>{variantImages.length}/7</span>
                    </div>
                    {variantImages.length < 7 && (
                      <div onDrop={handleDrop} onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)}
                        onClick={() => fileInputRef.current?.click()}
                        className="border border-dashed px-4 py-6 flex flex-col items-center gap-2 cursor-pointer transition-all duration-300"
                        style={{ borderColor: isDragging ? '#C9A96E' : dropZoneBorder, backgroundColor: isDragging ? 'rgba(201,169,110,0.06)' : 'transparent' }}>
                        <svg className="w-5 h-5" fill="none" stroke={isDragging ? '#C9A96E' : subLabelColor} strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                        </svg>
                        <p className="text-xs" style={{ color: labelColor }}>
                          Drop images or <span style={{ color: '#C9A96E', textDecoration: 'underline', textUnderlineOffset: '2px' }}>browse</span>
                        </p>
                        <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={e => { addFiles(e.target.files); e.target.value = ''; }} className="hidden" />
                      </div>
                    )}
                    {variantImages.length > 0 && (
                      <div className="grid grid-cols-4 gap-1.5">
                        {variantImages.map((img, i) => (
                          <div key={i} className="relative aspect-square overflow-hidden group" style={{ backgroundColor: isDark ? '#2a2620' : '#eae8e5' }}>
                            <img src={img.preview} alt={`Variant preview ${i + 1}`} className="w-full h-full object-cover" />
                            <button type="button" onClick={() => removeVariantImage(i)}
                              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs uppercase tracking-widest"
                              style={{ backgroundColor: 'rgba(27,24,20,0.65)', color: '#fbf9f6' }}>Remove</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Price */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-medium" style={{ color: labelColor }}>Price</label>
                    <div className="flex gap-3 items-end">
                      <div className="flex flex-col gap-0.5 flex-[3]">
                        <span className="text-[9px] uppercase tracking-[0.15em]" style={{ color: subLabelColor }}>Amount</span>
                        <input type="number" value={variantPrice} onChange={e => setVariantPrice(e.target.value)} min="0" step="0.01" placeholder="0.00"
                          className={inputClass} style={makeInputStyle()} onFocus={handleFocus} onBlur={handleBlur} />
                      </div>
                      <div className="flex flex-col gap-0.5 flex-[1]">
                        <span className="text-[9px] uppercase tracking-[0.15em]" style={{ color: subLabelColor }}>Currency</span>
                        <select value={variantCurrency} onChange={e => setVariantCurrency(e.target.value)}
                          className="w-full bg-transparent outline-none py-2.5 text-sm cursor-pointer appearance-none transition-colors duration-300"
                          style={makeInputStyle()} onFocus={handleFocus} onBlur={handleBlur}>
                          {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Stock */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-medium" style={{ color: labelColor }}>Initial Stock</label>
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => setVariantStock(s => Math.max(0, s - 1))}
                        className="w-9 h-9 flex items-center justify-center text-sm transition-all duration-200"
                        style={{ border: `1px solid ${inputBorder}`, color: '#C9A96E' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#C9A96E'; e.currentTarget.style.backgroundColor = 'rgba(201,169,110,0.08)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = inputBorder; e.currentTarget.style.backgroundColor = 'transparent'; }}>&#8722;</button>
                      <input type="number" value={variantStock} onChange={e => setVariantStock(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-16 text-center bg-transparent outline-none py-1.5 text-sm font-medium transition-colors duration-300"
                        style={{ color: inputColor, borderBottom: `1px solid ${inputBorder}` }} onFocus={handleFocus} onBlur={handleBlur} />
                      <button type="button" onClick={() => setVariantStock(s => s + 1)}
                        className="w-9 h-9 flex items-center justify-center text-sm transition-all duration-200"
                        style={{ border: `1px solid ${inputBorder}`, color: '#C9A96E' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#C9A96E'; e.currentTarget.style.backgroundColor = 'rgba(201,169,110,0.08)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = inputBorder; e.currentTarget.style.backgroundColor = 'transparent'; }}>&#43;</button>
                      <span className="text-[10px] uppercase tracking-[0.15em]" style={{ color: subLabelColor }}>units</span>
                    </div>
                  </div>

                  {/* Submit */}
                  <button type="submit" disabled={isSubmitting}
                    className="w-full py-4 text-[11px] uppercase tracking-[0.3em] font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                    style={{ backgroundColor: isSubmitting ? '#7A6E63' : '#C9A96E', color: '#12110e', fontFamily: "'Inter', sans-serif" }}
                    onMouseEnter={e => { if (!isSubmitting) e.currentTarget.style.backgroundColor = '#b8924a'; }}
                    onMouseLeave={e => { if (!isSubmitting) e.currentTarget.style.backgroundColor = '#C9A96E'; }}>
                    {isSubmitting ? 'Creating Variant...' : 'Create Variant'}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Variants Grid */}
          <div className="mt-16 pb-24">
            <div className="flex items-center gap-6 mb-8">
              <h2 className="text-2xl lg:text-3xl font-light whitespace-nowrap" style={{ fontFamily: "'Cormorant Garamond', serif", color: headerColor }}>
                Product Variants
              </h2>
              <div className="flex items-center gap-3">
                <div className="w-8 h-px" style={{ backgroundColor: '#C9A96E' }} />
                <span className="text-[10px] uppercase tracking-[0.25em]" style={{ color: isDark ? '#8a8070' : '#7A6E63' }}>
                  {product?.variants?.length ?? 0} {(product?.variants?.length ?? 0) === 1 ? 'variant' : 'variants'}
                </span>
              </div>
              <div className="flex-1 h-px" style={{ backgroundColor: borderColor }} />
            </div>

            {!product?.variants || product.variants.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-5">
                <div className="w-14 h-14 flex items-center justify-center" style={{ border: `1px solid ${isDark ? '#3a3528' : '#d0c5b5'}` }}>
                  <svg className="w-6 h-6" fill="none" stroke="#C9A96E" strokeWidth="1" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif", color: isDark ? '#f0ede6' : '#1b1c1a' }}>No variants yet</p>
                  <p className="text-xs mt-2 tracking-wide" style={{ color: descColor }}>Use the form above to create your first product variant.</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {product.variants.map((variant, i) => (
                  <VariantCard key={variant._id ?? i} variant={variant} isDark={isDark} onStockUpdate={handleStockUpdate} />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
};

export default SellerProductDetails;
