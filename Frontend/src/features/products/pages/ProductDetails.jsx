import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { useProduct } from '../hooks/useProduct';
import { useCart } from "../../cart/hook/useCart.js"

const ProductDetail = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);

    const [selectedAttributes, setSelectedAttributes] = useState({});
    const navigate = useNavigate();
    const { handleGetProductById } = useProduct();
    const { handleAddItem } = useCart()

    async function fetchProductDetails() {
        try {
            const data = await handleGetProductById(productId);
            // Handle both cases depending on how API is structured
            setProduct(data?.product || data);
        } catch (error) {
            console.error("Failed to fetch product details", error);
        }
    }

    // useEffect(() => {
    //     if (product?.variants?.length > 0) {
    //         setSelectedAttributes(product.variants[0].attributes || {});   // BUG
    //     }
    // }, [product]);

    const availableAttributes = useMemo(() => {
        if (!product?.variants) return {};
        const attrs = {};
        product.variants.forEach(variant => {
            if (variant.attributes) {
                Object.entries(variant.attributes).forEach(([key, value]) => {
                    if (!attrs[key]) attrs[key] = new Set();
                    attrs[key].add(value);
                });
            }
        });
        Object.keys(attrs).forEach(key => { attrs[key] = Array.from(attrs[key]); });
        return attrs;
    }, [product]);

    useEffect(() => {
        fetchProductDetails();
    }, [productId]);

    // Reset image selection when variant changes
    useEffect(() => {
        setSelectedImage(0);
    }, [selectedAttributes]);

    console.log("Product Details:", product); // Debugging line to check the product data

    // Compute the active display values by merging selected variant over main product
    const activeProduct = useMemo(() => {
        if (!product) return null;

        // No variant selected — use main product as-is
        // new
        if (!product.variants?.length || Object.keys(selectedAttributes).length === 0) {
            return {
                title: product.title,
                description: product.description,
                price: product.price,
                images: product.images && product.images.length > 0 ? product.images : [{ url: '/Tivyro.png' }],
                stock: product.stock,
                variantId: null,
            };
        }

        const variant = product.variants.find(v => {
            if (!v.attributes) return false;
            const vKeys = Object.keys(v.attributes);
            const sKeys = Object.keys(selectedAttributes);
            return vKeys.length === sKeys.length &&
                vKeys.every(k => v.attributes[k] === selectedAttributes[k]);
        });
        if (!variant) return null;

        // Merge: variant value wins if present, else fall back to main product
        return {
            title: product.title,                                           // always from product
            description: product.description,                               // always from product
            price: variant.price?.amount != null ? variant.price : product.price,
            images: variant.images && variant.images.length > 0
                ? variant.images
                : (product.images && product.images.length > 0 ? product.images : [{ url: '/Tivyro.png' }]),
            stock: variant.stock ?? product.stock,
            variantId: variant._id,
        };
    }, [product, selectedAttributes]);

    console.log({ product, activeProduct }); // Debugging line to check the product and variant IDs

    // new
    const handleAttributeChange = (attrName, value) => {
        // clicking the already-selected value clears selection → back to base product
        if (selectedAttributes[attrName] === value) {
            setSelectedAttributes({});
            return;
        }
        const newAttrs = { ...selectedAttributes, [attrName]: value };
        const exactMatch = product.variants.find(v => {
            const vAttrs = v.attributes || {};
            return Object.keys(newAttrs).every(k => newAttrs[k] === vAttrs[k]) &&
                Object.keys(vAttrs).every(k => newAttrs[k] === vAttrs[k]);
        });
        if (exactMatch) {
            setSelectedAttributes(exactMatch.attributes);
        } else {
            const fallback = product.variants.find(v => v.attributes && v.attributes[attrName] === value);
            setSelectedAttributes(fallback ? fallback.attributes : newAttrs);
        }
    };

    if (!product || !activeProduct) {
        return (
            <div className="min-h-screen flex items-center justify-center selection:bg-[#C9A96E]/30" style={{ backgroundColor: '#fbf9f6' }}>
                <p style={{ fontFamily: "'Inter', sans-serif", color: '#B5ADA3' }} className="text-[10px] uppercase tracking-[0.2em] font-medium animate-pulse">
                    Retrieving piece...
                </p>
            </div>
        );
    }

    const images = activeProduct.images;
    const isOutOfStock = activeProduct.stock !== undefined && activeProduct.stock !== null && activeProduct.stock <= 0;

    return (
        <>
            {/* Google Fonts */}
            <link
                href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
                rel="stylesheet"
            />

            <div
                className="min-h-screen selection:bg-[#C9A96E]/30 pb-24"
                style={{ backgroundColor: '#fbf9f6', fontFamily: "'Inter', sans-serif" }}
            >
                {/* ── Navbar ── */}
                <nav className="px-8 lg:px-16 xl:px-24 pt-10 pb-6 flex items-center justify-between border-b" style={{ borderColor: '#e4e2df' }}>
                    <Link to="/"
                        className="text-sm font-medium tracking-[0.35em] uppercase hover:opacity-80 transition-opacity"
                        style={{ fontFamily: "'Cormorant Garamond', serif", color: '#C9A96E' }}
                    >
                        Tivyro.
                    </Link>
                    <button
                        onClick={() => navigate(-1)}
                        className="text-[10px] uppercase tracking-[0.2em] font-medium transition-colors hover:text-[#C9A96E]"
                        style={{ color: '#7A6E63' }}
                    >
                        Return to Archive
                    </button>
                </nav>

                <div className="max-w-7xl mx-auto px-8 lg:px-16 xl:px-24 pt-12 lg:pt-20">
                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">

                        {/* ── LEFT: Image Gallery ── */}
                        <div className="w-full lg:w-[70%] flex flex-col-reverse md:flex-row gap-4 lg:gap-6">

                            {/* Thumbnails (Vertical on Desktop, Horizontal on Mobile) */}
                            {images.length > 1 && (
                                <div className="flex flex-row md:flex-col gap-4 overflow-x-auto md:overflow-y-auto pb-2 md:pb-0 scrollbar-hide w-full md:w-20 lg:w-24 flex-shrink-0 md:max-h-[calc(100vh-200px)]">
                                    {images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedImage(idx)}
                                            className={`flex-shrink-0 w-20 md:w-full aspect-[4/5] overflow-hidden transition-all duration-300 ${selectedImage === idx ? 'opacity-100 ring-1 ring-[#C9A96E] ring-offset-2' : 'opacity-50 hover:opacity-100'}`}
                                            style={{ backgroundColor: '#f5f3f0', '--tw-ring-offset-color': '#fbf9f6' }}
                                        >
                                            <img

                                                src={img.url} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Main Image */}
                            <div className="relative w-full aspect-4/5 overflow-hidden group" style={{ backgroundColor: '#f5f3f0' }}>
                                <img
                                    src={images[selectedImage]?.url || images[0].url}
                                    alt={product.title}
                                    className="w-full h-full object-cover transition-opacity duration-500"

                                />
                                {images.length > 1 && (
                                    <>
                                        <button
                                            onClick={() => setSelectedImage(prev => prev === 0 ? images.length - 1 : prev - 1)}
                                            className="absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 border"
                                            style={{ backgroundColor: 'rgba(251,249,246,0.8)', borderColor: '#e4e2df', color: '#1b1c1a' }}
                                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fbf9f6'}
                                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(251,249,246,0.8)'}
                                            aria-label="Previous image"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M15 19l-7-7 7-7" /></svg>
                                        </button>
                                        <button
                                            onClick={() => setSelectedImage(prev => prev === images.length - 1 ? 0 : prev + 1)}
                                            className="absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 border"
                                            style={{ backgroundColor: 'rgba(251,249,246,0.8)', borderColor: '#e4e2df', color: '#1b1c1a' }}
                                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fbf9f6'}
                                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(251,249,246,0.8)'}
                                            aria-label="Next image"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M9 5l7 7-7 7" /></svg>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* ── RIGHT: Product Details ── */}
                        <div className="w-full lg:w-[30%] lg:sticky lg:top-24 flex flex-col pt-4">

                            <h1
                                className="text-4xl md:text-5xl lg:text-6xl font-light leading-[1.05] mb-6"
                                style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}
                            >
                                {product.title}
                            </h1>

                            <div className="mb-8">
                                <span
                                    className="text-sm uppercase tracking-[0.2em] font-medium"
                                    style={{ color: '#1b1c1a' }}
                                >
                                    {activeProduct.price?.currency} {activeProduct.price?.amount?.toLocaleString()}
                                </span>
                            </div>

                            <div className="h-px w-full mb-8" style={{ backgroundColor: '#e4e2df' }} />

                            <div className="mb-12">
                                <h3 className="text-[10px] uppercase tracking-[0.24em] font-medium mb-4" style={{ color: '#C9A96E' }}>
                                    The Details
                                </h3>
                                <p className="text-sm leading-relaxed" style={{ color: '#7A6E63' }}>
                                    {product.description}
                                </p>
                            </div>

                            {/* ── Variant Selector ── */}
                            {product.variants && product.variants.length > 0 && (
                                <div className="mb-10">
                                    <h3
                                        className="text-[10px] uppercase tracking-[0.24em] font-medium mb-5"
                                        style={{ color: '#C9A96E' }}
                                    >
                                        Variants
                                    </h3>

                                    {Object.entries(availableAttributes).map(([attrName, values]) => (
                                        <div key={attrName} className="mb-6">
                                            <h3 className="text-[10px] uppercase tracking-[0.24em] font-medium mb-3" style={{ color: '#C9A96E' }}>
                                                {attrName}
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {values.map(val => {
                                                    const isSelected = selectedAttributes[attrName] === val;
                                                    return (
                                                        <button
                                                            key={val}
                                                            onClick={() => handleAttributeChange(attrName, val)}
                                                            className={`px-4 py-2 text-[11px] uppercase tracking-[0.15em] font-medium transition-all duration-300 border ${isSelected ? 'border-[#1b1c1a] bg-[#1b1c1a] text-[#fbf9f6]' : 'border-[#d0c5b5] text-[#1b1c1a] hover:border-[#1b1c1a]'}`}
                                                        >
                                                            {val}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}

                                    {/* Stock indicator for selected variant */}
                                    {selectedAttributes !== null && activeProduct.stock !== undefined && (
                                        <p
                                            className="mt-4 text-[10px] uppercase tracking-[0.15em] font-medium"
                                            style={{
                                                color: isOutOfStock ? '#c0392b' : '#7A6E63',
                                            }}
                                        >
                                            {isOutOfStock
                                                ? 'Out of stock'
                                                : `${activeProduct.stock} in stock`}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex flex-col gap-4 mt-auto">
                                <button
                                    className="w-full py-4 text-[11px] uppercase tracking-[0.25em] font-medium transition-all duration-300"
                                    disabled={isOutOfStock}
                                    style={{
                                        backgroundColor: isOutOfStock ? '#B5ADA3' : '#1b1c1a',
                                        color: '#fbf9f6',
                                        fontFamily: "'Inter', sans-serif",
                                        cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                                        opacity: isOutOfStock ? 0.6 : 1,
                                    }}
                                    onMouseEnter={e => {
                                        if (!isOutOfStock) {
                                            e.currentTarget.style.backgroundColor = '#C9A96E';
                                            e.currentTarget.style.color = '#1b1c1a';
                                        }
                                    }}
                                    onMouseLeave={e => {
                                        if (!isOutOfStock) {
                                            e.currentTarget.style.backgroundColor = '#1b1c1a';
                                            e.currentTarget.style.color = '#fbf9f6';
                                        }
                                    }}

                                    onClick={() => {
                                        handleAddItem({
                                            productId: product._id,
                                            variantId: activeProduct.variantId,
                                        })
                                    }}
                                >
                                    {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                                </button>

                                <button
                                    className="w-full py-4 text-[11px] uppercase tracking-[0.25em] font-medium transition-all duration-300 border"
                                    disabled={isOutOfStock}
                                    style={{
                                        backgroundColor: 'transparent',
                                        borderColor: isOutOfStock ? '#e4e2df' : '#d0c5b5',
                                        color: isOutOfStock ? '#B5ADA3' : '#1b1c1a',
                                        fontFamily: "'Inter', sans-serif",
                                        cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                                        opacity: isOutOfStock ? 0.6 : 1,
                                    }}
                                    onMouseEnter={e => {
                                        if (!isOutOfStock) {
                                            e.currentTarget.style.borderColor = '#C9A96E';
                                        }
                                    }}
                                    onMouseLeave={e => {
                                        if (!isOutOfStock) {
                                            e.currentTarget.style.borderColor = '#d0c5b5';
                                        }
                                    }}
                                >
                                    Buy Now
                                </button>
                            </div>

                            {/* Extra elegant details */}
                            <div className="mt-14 space-y-4 text-[10px] uppercase tracking-[0.1em]" style={{ color: '#B5ADA3' }}>
                                <div className="flex justify-between border-b pb-3" style={{ borderColor: '#e4e2df' }}>
                                    <span>Shipping</span>
                                    <span>Complimentary over INR 15,000</span>
                                </div>
                                <div className="flex justify-between border-b pb-3" style={{ borderColor: '#e4e2df' }}>
                                    <span>Returns</span>
                                    <span>Within 14 days of delivery</span>
                                </div>
                                <div className="flex justify-between border-b pb-3" style={{ borderColor: '#e4e2df' }}>
                                    <span>Authenticity</span>
                                    <span>100% Guaranteed</span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductDetail;