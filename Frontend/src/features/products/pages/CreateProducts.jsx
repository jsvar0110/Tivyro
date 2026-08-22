import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useProduct } from '../hooks/useProduct';

const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP'];
const MAX_IMAGES = 7;

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

/* ── CreateProduct ── */
const CreateProduct = () => {
    const { handleCreateProduct } = useProduct();
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

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priceAmount: '',
        priceCurrency: 'INR',
    });
    const [images, setImages] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef(null);

    /* theme tokens */
    const bg             = isDark ? '#12110e' : '#fbf9f6';
    const headerColor    = isDark ? '#f0ede6' : '#1b1c1a';
    const borderColor    = isDark ? '#2e2b25' : '#ebe8e3';
    const backColor      = isDark ? '#6b6258' : '#B5ADA3';
    const inputColor     = isDark ? '#e8e2d8' : '#1b1c1a';
    const inputBorder    = isDark ? '#3a3528' : '#d0c5b5';
    const labelColor     = isDark ? '#8a8070' : '#7A6E63';
    const subLabelColor  = isDark ? '#6b6258' : '#B5ADA3';
    const dropZoneBg     = isDark ? '#1a1814' : 'transparent';
    const dropZoneBorder = isDark ? '#3a3528' : '#d0c5b5';
    const optionBg       = isDark ? '#1a1814' : '#fbf9f6';

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const addFiles = (files) => {
        const remaining = MAX_IMAGES - images.length;
        if (remaining <= 0) return;
        const toAdd = Array.from(files).slice(0, remaining);
        const newImages = toAdd.map(file => ({ file, preview: URL.createObjectURL(file) }));
        setImages(prev => [...prev, ...newImages]);
    };

    const handleFileChange = (e) => { addFiles(e.target.files); e.target.value = ''; };

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
    }, [images]);

    const handleDragOver  = (e) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = () => setIsDragging(false);

    const removeImage = (index) => {
        setImages(prev => {
            const updated = [...prev];
            URL.revokeObjectURL(updated[index].preview);
            updated.splice(index, 1);
            return updated;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('priceAmount', formData.priceAmount);
            data.append('priceCurrency', formData.priceCurrency);
            images.forEach(img => data.append('images', img.file));
            await handleCreateProduct(data);
            navigate('/');
        } catch (err) {
            console.error('Failed to create product', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClass = "w-full bg-transparent outline-none py-2.5 text-sm transition-colors duration-300";
    const makeInputStyle = () => ({ color: inputColor, borderBottom: `1px solid ${inputBorder}`, fontFamily: "'Inter', sans-serif" });
    const handleFocus = (e) => { e.target.style.borderBottomColor = '#C9A96E'; };
    const handleBlur  = (e) => { e.target.style.borderBottomColor = inputBorder; };

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
                {/* ── Sticky Top Bar ── */}
                <div
                    className="sticky top-0 z-20 px-6 lg:px-16 xl:px-24 py-3 flex items-center justify-between gap-4 transition-colors duration-300"
                    style={{
                        backgroundColor: isDark ? 'rgba(18,17,14,0.92)' : 'rgba(251,249,246,0.92)',
                        backdropFilter: 'blur(12px)',
                        borderBottom: `1px solid ${borderColor}`,
                    }}
                >
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="text-lg transition-colors duration-200 leading-none"
                            style={{ color: backColor }}
                            aria-label="Go back"
                            onMouseEnter={e => e.currentTarget.style.color = '#C9A96E'}
                            onMouseLeave={e => e.currentTarget.style.color = backColor}
                        >←</button>
                        <span
                            className="text-[18px] font-medium tracking-[0.28em] uppercase"
                            style={{ fontFamily: "'Cormorant Garamond', serif", color: '#ffa600ff' }}
                        >
                            Tivyro.
                        </span>
                    </div>

                    <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
                </div>

                <div className="max-w-6xl mx-auto px-6 lg:px-16 xl:px-24">

                    {/* ── Page Header ── */}
                    <div className="pt-6 pb-0">
                        <h1
                            className="text-3xl lg:text-4xl font-light leading-tight"
                            style={{ fontFamily: "'Cormorant Garamond', serif", color: headerColor }}
                        >
                            New Listing
                        </h1>
                        <div className="mt-3 w-12 h-px" style={{ backgroundColor: '#C9A96E' }} />
                    </div>

                    {/* ── Form ── */}
                    <form onSubmit={handleSubmit} className="pt-6 pb-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 lg:items-start">

                            {/* ── LEFT COLUMN ── */}
                            <div className="flex flex-col gap-6">

                                {/* Title */}
                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="cp-title" className="text-[10px] uppercase tracking-[0.2em] font-medium" style={{ color: labelColor }}>
                                        Product Title
                                    </label>
                                    <input
                                        id="cp-title" type="text" name="title"
                                        value={formData.title} onChange={handleChange}
                                        required placeholder="e.g. Oversized Linen Shirt"
                                        className={inputClass} style={makeInputStyle()}
                                        onFocus={handleFocus} onBlur={handleBlur}
                                    />
                                </div>

                                {/* Description */}
                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="cp-description" className="text-[10px] uppercase tracking-[0.2em] font-medium" style={{ color: labelColor }}>
                                        Description
                                    </label>
                                    <textarea
                                        id="cp-description" name="description"
                                        value={formData.description} onChange={handleChange}
                                        rows={4} placeholder="Describe the product — material, fit, details..."
                                        className="w-full bg-transparent outline-none py-2.5 text-sm transition-colors duration-300 resize-none leading-relaxed"
                                        style={makeInputStyle()} onFocus={handleFocus} onBlur={handleBlur}
                                    />
                                </div>

                                {/* Price */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] uppercase tracking-[0.2em] font-medium" style={{ color: labelColor }}>Price</label>
                                    <div className="flex gap-4 items-end">
                                        <div className="flex flex-col gap-1 flex-[3]">
                                            <span className="text-[9px] uppercase tracking-[0.18em]" style={{ color: subLabelColor }}>Amount</span>
                                            <input
                                                id="cp-priceAmount" type="number" name="priceAmount"
                                                value={formData.priceAmount} onChange={handleChange}
                                                required min="0" step="0.01" placeholder="0.00"
                                                className={inputClass} style={makeInputStyle()}
                                                onFocus={handleFocus} onBlur={handleBlur}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1 flex-[1]">
                                            <span className="text-[9px] uppercase tracking-[0.18em]" style={{ color: subLabelColor }}>Currency</span>
                                            <select
                                                id="cp-priceCurrency" name="priceCurrency"
                                                value={formData.priceCurrency} onChange={handleChange}
                                                className="w-full bg-transparent outline-none py-2.5 text-sm cursor-pointer appearance-none transition-colors duration-300"
                                                style={makeInputStyle()} onFocus={handleFocus} onBlur={handleBlur}
                                            >
                                                {CURRENCIES.map(c => (
                                                    <option key={c} value={c} style={{ backgroundColor: optionBg, color: inputColor }}>{c}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Publish — desktop (left column, always visible) */}
                                <div className="hidden lg:block mt-2">
                                    <button
                                        type="submit" disabled={isSubmitting}
                                        className="w-full py-3.5 text-[11px] uppercase tracking-[0.3em] font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                        style={{ backgroundColor: isSubmitting ? '#7A6E63' : '#C9A96E', color: '#1b1c1a', fontFamily: "'Inter', sans-serif" }}
                                        onMouseEnter={e => { if (!isSubmitting) e.currentTarget.style.backgroundColor = '#b8924a'; }}
                                        onMouseLeave={e => { if (!isSubmitting) e.currentTarget.style.backgroundColor = '#C9A96E'; }}
                                    >
                                        {isSubmitting ? 'Publishing...' : 'Publish Listing'}
                                    </button>
                                </div>
                            </div>

                            {/* ── RIGHT COLUMN: Images ── */}
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-[10px] uppercase tracking-[0.2em] font-medium" style={{ color: labelColor }}>Images</label>
                                    <span className="text-[10px]" style={{ color: subLabelColor }}>{images.length}/{MAX_IMAGES}</span>
                                </div>

                                {/* Drop Zone */}
                                {images.length < MAX_IMAGES && (
                                    <div
                                        onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}
                                        onClick={() => fileInputRef.current?.click()}
                                        className="border border-dashed px-6 py-10 flex flex-col items-center gap-3 cursor-pointer transition-all duration-300"
                                        style={{
                                            borderColor: isDragging ? '#C9A96E' : dropZoneBorder,
                                            backgroundColor: isDragging ? 'rgba(201,169,110,0.06)' : dropZoneBg,
                                        }}
                                    >
                                        <div
                                            className="w-9 h-9 flex items-center justify-center border transition-colors duration-300"
                                            style={{ borderColor: isDragging ? '#C9A96E' : dropZoneBorder, color: isDragging ? '#C9A96E' : subLabelColor }}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                            </svg>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm leading-relaxed" style={{ color: labelColor }}>
                                                Drop images here or{' '}
                                                <span style={{ color: '#C9A96E', textDecoration: 'underline', textUnderlineOffset: '2px' }}>tap to upload</span>
                                            </p>
                                            <p className="text-[10px] uppercase tracking-[0.15em] mt-1.5" style={{ color: subLabelColor }}>
                                                Up to {MAX_IMAGES} images
                                            </p>
                                        </div>
                                        <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
                                    </div>
                                )}

                                {/* Previews */}
                                {images.length > 0 && (
                                    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-1.5 mt-0.5">
                                        {images.map((img, index) => (
                                            <div
                                                key={index}
                                                className="relative aspect-square overflow-hidden group"
                                                style={{ backgroundColor: isDark ? '#2a2620' : '#eae8e5' }}
                                            >
                                                <img src={img.preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                                                <button
                                                    type="button" onClick={() => removeImage(index)}
                                                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs font-medium tracking-widest uppercase"
                                                    style={{ backgroundColor: 'rgba(27,24,20,0.6)', color: '#fbf9f6' }}
                                                    aria-label={`Remove image ${index + 1}`}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Publish — mobile only */}
                        <div className="mt-6 lg:hidden">
                            <button
                                type="submit" disabled={isSubmitting}
                                className="w-full py-3.5 text-[11px] uppercase tracking-[0.3em] font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ backgroundColor: isSubmitting ? '#7A6E63' : '#C9A96E', color: '#1b1c1a', fontFamily: "'Inter', sans-serif" }}
                                onMouseEnter={e => { if (!isSubmitting) e.currentTarget.style.backgroundColor = '#b8924a'; }}
                                onMouseLeave={e => { if (!isSubmitting) e.currentTarget.style.backgroundColor = '#C9A96E'; }}
                            >
                                {isSubmitting ? 'Publishing...' : 'Publish Listing'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default CreateProduct;