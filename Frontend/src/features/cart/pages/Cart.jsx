import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useCart } from '../hook/useCart.js'
import { Link, useNavigate } from 'react-router'
import { useRazorpay } from "react-razorpay"

/* ─────────────────────────────────────────────────────────────────────────────
   Tivyro — Editorial Cart Page
   Styled to match the Home page aesthetic:
   - High-contrast minimalist monochrome luxury palette (#f9f9f9 bg, #000000 accents)
   - Bodoni Moda editorial serif typography + Inter clean sans
   - Minimalist sharp borders and structured layouts matching Home.jsx
   - 100% feature & functionality parity preserved (Razorpay checkout, item
     quantity adjustments, variant details, removal, clear cart, promo code)
───────────────────────────────────────────────────────────────────────────── */

const Cart = () => {
    const cart = useSelector(state => state.cart) || []
    const {
        handleGetCart,
        handleIncrementCartItem,
        handleDecrementCartItem,
        handleCreateCartOrder,
        handleVerifyCartOrder,
        handleRemoveCartItem,
        handleClearCart
    } = useCart()
    const navigate = useNavigate()
    const { error, isLoading, Razorpay } = useRazorpay()
    const user = useSelector(state => state.user)

    const [isPromoOpen, setIsPromoOpen] = useState(false)
    const [promoCode, setPromoCode] = useState('')
    const [isClearOpen, setIsClearOpen] = useState(false)
    const [isClearing, setIsClearing] = useState(false)

    useEffect(() => {
        handleGetCart()
    }, [])


    const confirmClear = async () => {
        setIsClearing(true)
        try {
            await handleClearCart()
            setIsClearOpen(false)
        } catch (err) {
            console.error('Failed to clear cart', err)
        } finally {
            setIsClearing(false)
        }
    }

    const getVariantDetails = (product, variantId) => {
        if (!product?.variants || !variantId) return null
        return product.variants
    }

    const getDisplayImage = (product, variant) => {
        if (variant?.images?.length) return variant.images[0].url
        if (product?.images?.length) return product.images[0].url
        return null
    }

    const formatCurrency = (amount, currency = 'INR') =>
        `${currency === 'INR' ? '₹' : `${currency} `}${Number(amount ?? 0).toLocaleString('en-IN')}`

    async function handleCheckout() {
        const order = await handleCreateCartOrder()

        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: order.amount, // Amount in paise
            currency: order.currency,
            name: "Tivyro",
            description: "Fashion Order Checkout",
            order_id: order.id,
            handler: async (response) => {
                const isValid = await handleVerifyCartOrder(response)
                if (isValid) {
                    navigate(`/order-success?order_id=${response?.razorpay_order_id}`)
                }
            },
            prefill: {
                name: user?.fullname,
                email: user?.email,
                contact: user?.contact,
            },
            theme: {
                color: "#000000",
            },
        }
        const razorpayInstance = new Razorpay(options)
        razorpayInstance.open();
    }

    return (
        <>
            {/* Google Fonts */}
            <link
                href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;0,6..96,700;1,6..96,400&family=Inter:wght@300;400;500;600;700&display=swap"
                rel="stylesheet"
            />
            <link
                href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
                rel="stylesheet"
            />

            <style>{`
                .material-symbols-outlined {
                    font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
                    display: inline-block;
                    vertical-align: middle;
                    line-height: 1;
                }
            `}</style>

            <div
                style={{ fontFamily: "'Inter', sans-serif", backgroundColor: '#f9f9f9', color: '#1a1c1c' }}
                className="min-h-screen flex flex-col"
            >
                {/* ── Sub-header / Breadcrumb Bar ── */}
                <div className="border-b border-gray-200 bg-white px-4 sm:px-8 md:px-16 py-3 sm:py-3.5">
                    <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] font-semibold tracking-widest uppercase">
                        <div className="flex items-center gap-2 text-gray-500">
                            <Link to="/" className="text-gray-500 hover:text-black transition-colors no-underline">
                                Home
                            </Link>
                            <span>/</span>
                            <span className="text-black">Shopping Bag</span>
                        </div>
                        <button
                            onClick={() => navigate(-1)}
                            className="text-gray-500 hover:text-black transition-colors flex items-center gap-1 cursor-pointer bg-transparent border-none"
                        >
                            <span className="material-symbols-outlined text-[14px]">arrow_back</span>
                            <span>Continue Shopping</span>
                        </button>
                    </div>
                </div>

                {/* ── Clear Cart Confirmation Modal ── */}
                {isClearOpen && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 px-6 backdrop-blur-[2px]">
                        <div className="bg-white border border-black max-w-md w-full p-8 shadow-2xl">
                            <span className="text-[10px] font-bold tracking-[0.22em] uppercase text-gray-400 block mb-2">
                                Confirmation
                            </span>
                            <h3
                                style={{ fontFamily: "'Bodoni Moda', serif" }}
                                className="text-2xl font-normal uppercase text-black"
                            >
                                Clear Shopping Bag?
                            </h3>
                            <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                                All pieces currently reserved in your bag will be removed. This action cannot be reversed.
                            </p>
                            <div className="flex justify-end gap-3 mt-8">
                                <button
                                    onClick={() => setIsClearOpen(false)}
                                    className="px-6 py-2.5 border border-gray-300 text-black uppercase tracking-widest text-[11px] font-semibold hover:border-black transition-colors bg-white cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmClear}
                                    disabled={isClearing}
                                    className="px-6 py-2.5 bg-black text-white uppercase tracking-widest text-[11px] font-semibold hover:bg-neutral-800 transition-colors disabled:opacity-50 cursor-pointer"
                                >
                                    {isClearing ? 'Clearing…' : 'Yes, Clear All'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Main Cart Container ── */}
                <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-16 py-8 sm:py-12">
                    {!cart?.items?.length ? (
                        /* Empty State */
                        <div className="min-h-[50vh] flex flex-col items-center justify-center text-center py-12 sm:py-16">
                            <span className="material-symbols-outlined text-5xl sm:text-6xl text-gray-300 mb-4">
                                shopping_bag
                            </span>
                            <span className="text-[10px] font-bold tracking-[0.24em] text-gray-400 uppercase mb-2">
                                Your Bag Is Empty
                            </span>
                            <h1
                                style={{ fontFamily: "'Bodoni Moda', serif" }}
                                className="text-2xl sm:text-3xl md:text-5xl font-normal uppercase text-black tracking-tight mb-4"
                            >
                                No Pieces Reserved
                            </h1>
                            <p className="text-sm sm:text-base text-gray-500 max-w-max leading-relaxed mb-8">
                                Your shopping bag is currently empty. Explore our latest arrivals and curated collections to find your perfect pieces.
                            </p>
                            <Link
                                to="/"
                                style={{
                                    backgroundColor: '#000',
                                    color: '#fff',
                                    padding: '14px 32px',
                                    fontSize: '11px',
                                    fontWeight: '700',
                                    letterSpacing: '0.18em',
                                    textTransform: 'uppercase',
                                    textDecoration: 'none',
                                    display: 'inline-block',
                                    border: '1px solid #000',
                                    transition: 'all 0.15s',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.color = '#000'; }}
                                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#000'; e.currentTarget.style.color = '#fff'; }}
                            >
                                Explore Collection →
                            </Link>
                        </div>
                    ) : (
                        <>
                            {/* Page Header */}
                            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 sm:pb-6 mb-6 sm:mb-8 border-b border-gray-200">
                                <div>
                                    <p className="text-[10px] font-bold tracking-[0.24em] uppercase text-gray-400 mb-1">
                                        Your Selection
                                    </p>
                                    <h1
                                        style={{ fontFamily: "'Bodoni Moda', serif" }}
                                        className="text-2xl sm:text-3xl md:text-4xl font-normal uppercase tracking-wide text-black"
                                    >
                                        Shopping Bag
                                        <span className="text-xs sm:text-sm font-normal text-gray-400 normal-case ml-2.5" style={{ fontFamily: "'Inter', sans-serif" }}>
                                            ({cart?.items?.length} {cart?.items?.length === 1 ? 'item' : 'items'})
                                        </span>
                                    </h1>
                                </div>

                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-gray-600 bg-white border border-gray-200 px-3.5 py-1.5">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span>Items allocated</span>
                                    </div>
                                    <button
                                        onClick={() => setIsClearOpen(true)}
                                        className="text-[11px] font-bold tracking-widest uppercase text-gray-500 hover:text-red-600 border border-gray-200 hover:border-red-300 bg-white px-3.5 py-1.5 transition-colors cursor-pointer"
                                    >
                                        Clear Bag
                                    </button>
                                </div>
                            </div>

                            {/* 2-Column Responsive Layout */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
                                {/* LEFT COLUMN: Items List + Assurances */}
                                <div className="lg:col-span-8 flex flex-col gap-6">

                                    {/* Complimentary Dispatch Announcement */}
                                    <div className="bg-white border border-gray-200 p-5 flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3.5">
                                            <span className="material-symbols-outlined text-2xl text-black">
                                                local_shipping
                                            </span>
                                            <div>
                                                <h4 className="text-xs font-bold tracking-wider uppercase text-black">
                                                    Complimentary Express Delivery
                                                </h4>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    Your order qualifies for fast priority dispatch and premium packaging.
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-bold tracking-widest uppercase border border-black px-2.5 py-1 bg-black text-white shrink-0">
                                            ACTIVE
                                        </span>
                                    </div>

                                    {/* Cart Items List */}
                                    <div className="bg-white border border-gray-200 divide-y divide-gray-200">
                                        {cart.items.map((item) => {
                                            const product = item.product
                                            const variantId = item.variant
                                            const variant = getVariantDetails(product, variantId) || product?.variants?.[0] || {}
                                            const image = getDisplayImage(product, variant)
                                            const attributes = variant.attributes || {}
                                            const qty = item.quantity ?? 1
                                            const unitPrice = item.price?.amount ?? variant?.price?.amount ?? product?.price?.amount ?? 0
                                            const stock = variant?.stock
                                            const variantPrice = variant?.price

                                            return (
                                                <article
                                                    key={item._id}
                                                    className="p-4 sm:p-6 md:p-8 flex flex-col sm:flex-row gap-4 sm:gap-6 transition-colors hover:bg-neutral-50/50"
                                                >
                                                    {/* Product Thumbnail */}
                                                    <div
                                                        className="w-full sm:w-36 aspect-[3/4] bg-gray-100 shrink-0 overflow-hidden relative border border-gray-200 cursor-pointer"
                                                        onClick={() => navigate(`/product/${product?._id}`)}
                                                    >
                                                        {image ? (
                                                            <img
                                                                src={image}
                                                                alt={product?.title}
                                                                className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 uppercase tracking-wider">
                                                                No Image
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Product Details & Actions */}
                                                    <div className="flex-1 flex flex-col justify-between">
                                                        <div>
                                                            <div className="flex justify-between items-start gap-4">
                                                                <div>
                                                                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 block mb-1">
                                                                        Tivyro Collection
                                                                    </span>
                                                                    <h2
                                                                        className="text-base font-semibold uppercase text-black hover:text-gray-600 transition-colors tracking-wide cursor-pointer"
                                                                        onClick={() => navigate(`/product/${product?._id}`)}
                                                                    >
                                                                        {product?.title}
                                                                    </h2>
                                                                </div>

                                                                <button
                                                                    title="Remove item"
                                                                    className="text-gray-400 hover:text-black transition-colors p-1 cursor-pointer bg-transparent border-none"
                                                                    onClick={() => handleRemoveCartItem({ productId: product?._id, variantId })}
                                                                >
                                                                    <span className="material-symbols-outlined text-[20px]">
                                                                        close
                                                                    </span>
                                                                </button>
                                                            </div>

                                                            {/* Attributes Tags */}
                                                            {Object.keys(attributes).length > 0 && (
                                                                <div className="flex flex-row flex-wrap gap-2 mt-3">
                                                                    {Object.entries(attributes).map(([key, value]) => (
                                                                        <span
                                                                            key={key}
                                                                            className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-gray-200 bg-gray-50 text-[11px] text-gray-700 tracking-wide uppercase"
                                                                        >
                                                                            <span className="text-gray-400">{key}:</span>
                                                                            <span className="font-semibold text-black">{value}</span>
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            )}

                                                            {/* Stock info */}
                                                            {stock !== undefined && (
                                                                <div className="mt-2 text-[11px] font-medium tracking-wider uppercase text-gray-500">
                                                                    {stock > 0 ? (
                                                                        <span className="text-emerald-700">● In Stock ({stock} available)</span>
                                                                    ) : (
                                                                        <span className="text-red-600">● Out of stock</span>
                                                                    )}
                                                                </div>
                                                            )}

                                                            {/* Price difference notice */}
                                                            {variantPrice && unitPrice !== variantPrice.amount && (
                                                                <div className="mt-2">
                                                                    {unitPrice > variantPrice.amount ? (
                                                                        <p className="text-[11px] uppercase tracking-wider text-emerald-800 font-semibold">
                                                                            Offer applied: {formatCurrency(variantPrice.amount, variantPrice.currency)} (You save {formatCurrency(unitPrice - variantPrice.amount)})
                                                                        </p>
                                                                    ) : (
                                                                        <p className="text-[11px] uppercase tracking-wider text-red-600 font-semibold">
                                                                            Price updated: {formatCurrency(variantPrice.amount - unitPrice)} difference
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Quantity Stepper & Price Row */}
                                                        <div className="flex flex-wrap items-end justify-between gap-4 mt-6 pt-4 border-t border-gray-100">
                                                            {/* Stepper */}
                                                            <div className="flex items-center border border-gray-300 bg-white">
                                                                <button
                                                                    onClick={() => handleDecrementCartItem({ productId: product?._id, variantId })}
                                                                    disabled={qty <= 1}
                                                                    className="w-8 h-8 flex items-center justify-center text-gray-700 hover:text-black hover:bg-gray-100 transition-colors border-none bg-transparent cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                                                                    aria-label="Decrease quantity"
                                                                >
                                                                    <span className="material-symbols-outlined text-[14px]">
                                                                        remove
                                                                    </span>
                                                                </button>
                                                                <span className="w-9 text-center text-xs font-semibold text-black">
                                                                    {qty}
                                                                </span>
                                                                <button
                                                                    onClick={() =>
                                                                        handleIncrementCartItem({
                                                                            productId: product?._id,
                                                                            variantId,
                                                                        })
                                                                    }
                                                                    className="w-8 h-8 flex items-center justify-center text-gray-700 hover:text-black hover:bg-gray-100 transition-colors border-none bg-transparent cursor-pointer"
                                                                    aria-label="Increase quantity"
                                                                >
                                                                    <span className="material-symbols-outlined text-[14px]">
                                                                        add
                                                                    </span>
                                                                </button>
                                                            </div>

                                                            {/* Price Breakdown */}
                                                            <div className="text-right">
                                                                <div className="text-[11px] text-gray-400 uppercase tracking-wider">
                                                                    Unit {formatCurrency(unitPrice, item.price?.currency)}
                                                                </div>
                                                                <div className="text-base font-bold text-black tracking-tight mt-0.5">
                                                                    {formatCurrency(unitPrice * qty, item.price?.currency)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </article>
                                            )
                                        })}
                                    </div>

                                    {/* Promo Code Accordion */}
                                    <div className="bg-white border border-gray-200 p-6">
                                        <div
                                            className="flex items-center justify-between cursor-pointer select-none"
                                            onClick={() => setIsPromoOpen(!isPromoOpen)}
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <span className="material-symbols-outlined text-black text-xl">
                                                    sell
                                                </span>
                                                <span className="text-xs font-bold tracking-widest uppercase text-black">
                                                    Promotional Code / Gift Voucher
                                                </span>
                                            </div>
                                            <span
                                                className={`material-symbols-outlined text-gray-400 transition-transform ${isPromoOpen ? 'rotate-180' : ''}`}
                                            >
                                                expand_more
                                            </span>
                                        </div>

                                        {isPromoOpen && (
                                            <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
                                                <input
                                                    type="text"
                                                    placeholder="Enter promo code"
                                                    value={promoCode}
                                                    onChange={e => setPromoCode(e.target.value)}
                                                    className="flex-1 bg-white border border-gray-300 text-black text-xs uppercase px-4 py-3 outline-none focus:border-black transition-colors rounded-none"
                                                    style={{ color: '#000000', colorScheme: 'light' }}
                                                />
                                                <button
                                                    className="px-6 py-3 bg-black text-white hover:bg-gray-800 text-[11px] font-bold tracking-widest uppercase transition-colors border border-black cursor-pointer"
                                                >
                                                    Apply Code
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Features Strip (matching Home.jsx exactly) */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                                        {[
                                            { icon: 'local_shipping', title: 'FAST DELIVERY', desc: 'Quick & safe delivery' },
                                            { icon: 'inventory_2', title: 'EASY RETURNS', desc: 'Within 15 days' },
                                            { icon: 'verified', title: 'QUALITY ASSURED', desc: 'Premium verified pieces' },
                                            { icon: 'lock', title: 'SECURE PAYMENT', desc: '100% secure checkout' },
                                        ].map((f) => (
                                            <div
                                                key={f.title}
                                                className="bg-white border border-gray-200 p-4 flex flex-col gap-2"
                                            >
                                                <span className="material-symbols-outlined text-2xl text-black">
                                                    {f.icon}
                                                </span>
                                                <div>
                                                    <h5 className="text-[10px] font-bold tracking-widest uppercase text-black">
                                                        {f.title}
                                                    </h5>
                                                    <p className="text-[11px] text-gray-500 mt-0.5">
                                                        {f.desc}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* RIGHT COLUMN: Sticky Order Summary */}
                                <aside className="lg:col-span-4 sticky top-28">
                                    <div className="bg-white border border-gray-200 p-6 md:p-8 flex flex-col gap-6 shadow-sm">
                                        <div className="border-b border-gray-200 pb-4">
                                            <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-gray-400 mb-1">
                                                Checkout Summary
                                            </p>
                                            <h3
                                                style={{ fontFamily: "'Bodoni Moda', serif" }}
                                                className="text-2xl font-normal uppercase text-black tracking-wide"
                                            >
                                                Order Summary
                                            </h3>
                                        </div>

                                        {/* Financial Breakdown */}
                                        <div className="flex flex-col gap-3.5 text-xs">
                                            <div className="flex justify-between items-center text-gray-600">
                                                <span>Subtotal ({cart.items.length} items)</span>
                                                <span className="font-semibold text-black">
                                                    {formatCurrency(cart.totalPrice)}
                                                </span>
                                            </div>

                                            <div className="flex justify-between items-center text-gray-600">
                                                <span>Standard Delivery</span>
                                                <span className="font-bold text-black uppercase tracking-wider text-[11px]">
                                                    COMPLIMENTARY
                                                </span>
                                            </div>

                                            <div className="flex justify-between items-center text-gray-600">
                                                <span>Estimated Tax &amp; GST</span>
                                                <span className="font-semibold text-black">
                                                    INCLUDED
                                                </span>
                                            </div>

                                            <div className="border-t border-gray-200 pt-4 mt-2">
                                                <div className="flex justify-between items-baseline">
                                                    <div>
                                                        <span className="text-sm font-bold uppercase tracking-wider text-black block">
                                                            Total Amount
                                                        </span>
                                                        <span className="text-[11px] text-gray-400">
                                                            Inclusive of all duties
                                                        </span>
                                                    </div>
                                                    <div className="text-right">
                                                        <span
                                                            style={{ fontFamily: "'Bodoni Moda', serif" }}
                                                            className="text-2xl font-normal text-black"
                                                        >
                                                            {formatCurrency(cart.totalPrice)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Checkout Actions */}
                                        <div className="flex flex-col gap-3 pt-2">
                                            <button
                                                id="proceed-checkout"
                                                onClick={handleCheckout}
                                                style={{
                                                    backgroundColor: '#000',
                                                    color: '#fff',
                                                    border: '1px solid #000',
                                                    transition: 'all 0.15s',
                                                }}
                                                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.color = '#000'; }}
                                                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#000'; e.currentTarget.style.color = '#fff'; }}
                                                className="w-full py-4 px-6 text-xs font-bold tracking-[0.18em] uppercase flex items-center justify-center gap-2.5 cursor-pointer shadow-sm"
                                            >
                                                <span>Proceed to Checkout</span>
                                                <span className="material-symbols-outlined text-[16px]">
                                                    arrow_forward
                                                </span>
                                            </button>

                                            <button
                                                onClick={() => navigate('/')}
                                                className="w-full py-3.5 px-6 bg-white border border-gray-300 hover:border-black text-black text-xs font-bold tracking-[0.18em] uppercase transition-colors cursor-pointer"
                                            >
                                                Continue Shopping
                                            </button>
                                        </div>

                                        {/* Security & Payment Icons */}
                                        <div className="border-t border-gray-100 pt-5 flex flex-col gap-3 text-center">
                                            <div className="flex items-center justify-between text-gray-400 text-[10px] font-bold tracking-widest uppercase">
                                                <span>ACCEPTED PAYMENTS</span>
                                                <span>256-BIT ENCRYPTION</span>
                                            </div>
                                            <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold tracking-wider text-gray-700 uppercase">
                                                <div className="py-2 bg-gray-50 border border-gray-200">VISA</div>
                                                <div className="py-2 bg-gray-50 border border-gray-200">MC</div>
                                                <div className="py-2 bg-gray-50 border border-gray-200">AMEX</div>
                                                <div className="py-2 bg-gray-50 border border-gray-200">UPI</div>
                                            </div>
                                            <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
                                                Transactions are encrypted and processed securely via Razorpay.
                                            </p>
                                        </div>
                                    </div>
                                </aside>
                            </div>
                        </>
                    )}
                </main>

                {/* ── Editorial Footer (matches Home.jsx) ── */}
                <footer style={{ backgroundColor: '#fff', borderTop: '1px solid #e5e5e5' }} className="px-4 sm:px-8 md:px-16 py-12 flex flex-col md:flex-row justify-between items-start gap-8 md:gap-10 mt-10 sm:mt-12">
                    <div className="flex flex-col gap-3 max-w-xs">
                        <span style={{ fontFamily: "'Bodoni Moda', serif", fontSize: '22px', fontWeight: '700', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#000' }}>
                            TIVYRO
                        </span>
                        <p style={{ fontSize: '12px', color: '#777', lineHeight: '1.6' }}>
                            Curated for the discerning few. Strict monochrome forms and uncompromising materials.
                        </p>
                        <p style={{ fontSize: '10px', color: '#999', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                            © 2026 TIVYRO. ALL RIGHTS RESERVED.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-8 sm:gap-12 md:gap-16 w-full sm:w-auto">
                        <div className="flex flex-col gap-2.5">
                            <span style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#000' }}>
                                EXPLORE
                            </span>
                            {['MEN', 'WOMEN', 'NEW IN', 'SALE'].map(l => (
                                <Link key={l} to={l === 'MEN' ? '/men' : l === 'WOMEN' ? '/women' : '/'} style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#777', textDecoration: 'none' }} className="hover:text-black transition-colors">
                                    {l}
                                </Link>
                            ))}
                        </div>
                        <div className="flex flex-col gap-2.5">
                            <span style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#000' }}>
                                SUPPORT
                            </span>
                            {['SHIPPING & RETURNS', 'PRIVACY POLICY', 'TERMS OF SERVICE', 'HELP'].map(l => (
                                <a key={l} href="#" style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#777', textDecoration: 'none' }} className="hover:text-black transition-colors">
                                    {l}
                                </a>
                            ))}
                        </div>
                    </div>
                </footer>
            </div>
        </>
    )
}

export default Cart
