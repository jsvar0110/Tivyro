import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useCart } from '../hook/useCart.js'
import { Link, useNavigate } from 'react-router'

const Cart = () => {
    const cartItems = useSelector(state => state.cart.items) || []
    const { handleGetCart, handleIncrementCartItem } = useCart()
    const navigate = useNavigate()

    // Keep the first code's local quantity handling.
    const [quantities, setQuantities] = useState({})
    const [isPromoOpen, setIsPromoOpen] = useState(false)

    useEffect(() => {
        handleGetCart()
    }, [])

    useEffect(() => {
        if (cartItems.length) {
            const initial = {}
            cartItems.forEach(item => {
                initial[item._id] = item.quantity ?? 1
            })
            setQuantities(initial)
        }
    }, [cartItems])

    const changeQty = (id, delta) => {
        setQuantities(prev => ({
            ...prev,
            [id]: Math.max(1, (prev[id] ?? 1) + delta),
        }))
    }

    const getVariantDetails = (product, variantId) => {
        if (!product?.variants || !variantId) return null
        return product.variants.find(v => v._id === variantId) ?? null
    }

    const getDisplayImage = (product, variant) => {
        if (variant?.images?.length) return variant.images[0].url
        if (product?.images?.length) return product.images[0].url
        return null
    }

    const formatCurrency = (amount, currency = 'INR') =>
        `${currency === 'INR' ? '₹' : `${currency} `}${Number(amount ?? 0).toLocaleString('en-IN')}`

    // Keep the first code's total calculation.
    const subtotal = cartItems.reduce((sum, item) => {
        const qty = quantities[item._id] ?? item.quantity ?? 1
        return sum + (item.price?.amount ?? 0) * qty
    }, 0)

    const freeShippingThreshold = 15000
    const shippingFree = subtotal >= freeShippingThreshold
    const totalPieces = cartItems.length

    return (
        <div className="bg-surface text-on-surface antialiased min-h-screen flex flex-col selection:bg-primary-container selection:text-on-primary-container">
            <style>{`
                ::-webkit-scrollbar {
                    width: 4px;
                }

                ::-webkit-scrollbar-track {
                    background: #131410;
                }

                ::-webkit-scrollbar-thumb {
                    background: #4d463a;
                }

                ::-webkit-scrollbar-thumb:hover {
                    background: #c9a96e;
                }
            `}</style>

            {/* NAVBAR */}
            <nav className="w-full border-b border-outline-variant/40 px-6 md:px-container-padding py-6">
                <div className="max-w-[1300px] mx-auto flex items-center justify-between">
                    <Link
                        to="/"
                        className="font-display-lg text-headline-sm text-primary tracking-tighter hover:opacity-80 transition-opacity"
                    >
                        Tivyro.
                    </Link>

                    <button
                        onClick={() => navigate(-1)}
                        className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors uppercase tracking-widest"
                    >
                        Return to Archive
                    </button>
                </div>
            </nav>

            {/* Main Content Canvas */}
            <main className="flex-1 w-full max-w-[1300px] mx-auto pt-16 lg:pt-28 pb-stack-lg px-6 md:px-container-padding">
                {cartItems.length === 0 ? (
                    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
                        <div className="font-label-caps text-label-caps tracking-widest text-primary uppercase mb-3">
                            Couture Private Vault
                        </div>

                        <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight">
                            Your Shopping Bag is Empty
                        </h1>

                        <p className="text-body-md text-on-surface-variant mt-3 max-w-md">
                            No pieces have been reserved yet. Explore the archive and curate your collection.
                        </p>

                        <Link
                            to="/"
                            className="mt-8 px-8 py-4 bg-primary-container hover:bg-primary text-[#12110e] font-label-caps text-label-caps uppercase tracking-widest font-bold transition-all duration-200"
                        >
                            Explore the Archive
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Editorial Stage Banner / Title Hierarchy */}
                        <div className="mb-stack-md flex flex-col md:flex-row md:items-baseline justify-between gap-4 border-b border-outline-variant/40 pb-6">
                            <div>
                                <div className="text-primary font-label-caps text-label-caps tracking-widest uppercase mb-1">
                                    Couture Private Vault
                                </div>

                                <h1 className="font-headline-md text-headline-md md:font-display-lg md:text-display-lg text-on-surface tracking-tight">
                                    Shopping Bag
                                    <span className="font-body-lg text-body-lg text-outline font-normal align-middle ml-2">
                                        ({totalPieces} {totalPieces === 1 ? 'piece' : 'pieces'} reserved)
                                    </span>
                                </h1>
                            </div>

                            <div className="flex items-center gap-3 text-on-surface-variant text-body-md font-body-md bg-surface-container-low px-4 py-2 border border-outline-variant/50">
                                <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                                <span>Items allocated safely</span>
                            </div>
                        </div>

                        {/* 2-Column Responsive Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">

                            {/* LEFT COLUMN: Cart Items */}
                            <div className="lg:col-span-8 flex flex-col gap-6">

                                {/* Complimentary Express Courier Banner */}
                                <div className="bg-surface-container-low border border-outline-variant p-6 relative overflow-hidden">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-center gap-3 text-primary">
                                            <span className="material-symbols-outlined text-2xl">verified</span>

                                            <div>
                                                <h4 className="font-title-lg text-title-lg text-on-surface leading-tight">
                                                    Complimentary White-Glove Dispatch Unlocked
                                                </h4>

                                                <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                                                    Your luxury order qualifies for climate-controlled transport and signature wooden presentation coffer.
                                                </p>
                                            </div>
                                        </div>

                                        <span className="font-label-caps text-label-caps text-primary border border-primary/40 px-2.5 py-1 whitespace-nowrap bg-primary/5">
                                            TIER I ATTAINED
                                        </span>
                                    </div>

                                    <div className="w-full bg-surface-container-highest h-1 mt-4 overflow-hidden">
                                        <div className="bg-primary h-full transition-all duration-700" style={{ width: '100%' }}></div>
                                    </div>
                                </div>

                                {/* Cart Items List Container */}
                                <div className="divide-y divide-outline-variant/40 border border-outline-variant bg-surface-container-low">
                                    {cartItems.map(item => {
                                        const product = item.product
                                        const variantId = item.variant
                                        const variant = getVariantDetails(product, variantId) || product?.variants?.[0] || {}
                                        const image = getDisplayImage(product, variant)
                                        const attributes = variant.attributes || {}
                                        const qty = quantities[item._id] ?? item.quantity ?? 1
                                        const unitPrice = item.price?.amount ?? variant?.price?.amount ?? product?.price?.amount ?? 0
                                        const stock = variant?.stock
                                        const variantPrice = variant?.price


                                        return (
                                            <article
                                                key={item._id}
                                                className="p-6 md:p-8 flex flex-col sm:flex-row gap-6 transition-colors hover:bg-surface-container/60"
                                            >
                                                {/* Product Image */}
                                                <div className="w-full sm:w-36 h-48 bg-surface-container flex-shrink-0 overflow-hidden relative border border-outline-variant/60">
                                                    {image ? (
                                                        <img
                                                            src={image}
                                                            alt={product?.title}
                                                            className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-outline">
                                                            No Image
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Details & Actions */}
                                                <div className="flex-1 flex flex-col justify-between">
                                                    <div>
                                                        <div className="flex justify-between items-start gap-4">
                                                            <div>
                                                                <span className="font-label-caps text-label-caps text-outline uppercase tracking-widest">
                                                                    Sartorial Haute Couture
                                                                </span>

                                                                <h2 className="font-title-lg text-title-lg text-on-surface hover:text-primary transition-colors mt-0.5">
                                                                    {product?.title}
                                                                </h2>
                                                            </div>

                                                            <button
                                                                title="Remove piece"
                                                                className="text-on-surface-variant hover:text-error transition-colors p-1"
                                                                onClick={() => console.log('TODO: Remove', item._id)}
                                                            >
                                                                <span className="material-symbols-outlined text-xl">
                                                                    delete
                                                                </span>
                                                            </button>
                                                        </div>

                                                        {/* Attributes */}
                                                        {Object.keys(attributes).length > 0 && (
                                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-body-md font-body-md text-on-surface-variant">
                                                                {Object.entries(attributes).map(([key, value], i) => (
                                                                    <React.Fragment key={key}>
                                                                        <div>
                                                                            <span className="capitalize">{key}</span>:{' '}
                                                                            <strong className="text-on-surface font-medium">
                                                                                {value}
                                                                            </strong>
                                                                        </div>

                                                                        {i < Object.entries(attributes).length - 1 && (
                                                                            <span className="text-outline-variant">•</span>
                                                                        )}
                                                                    </React.Fragment>
                                                                ))}
                                                            </div>
                                                        )}

                                                        {stock !== undefined && (
                                                            <div className="mt-3 text-label-caps text-label-caps text-outline uppercase tracking-widest">
                                                                {stock > 0 ? `${stock} in stock` : 'Out of stock'}
                                                            </div>
                                                        )}

                                                        {
                                                            unitPrice !== variantPrice.amount && (
                                                                <>
                                                                {
                                                                unitPrice > variantPrice.amount
                                                                ? <p className='text-[10px] uppercase tracking-[0.15em] mb-4 text-green-800 font-bold' > you will get this at {formatCurrency(variantPrice.amount, variantPrice.currency)} save {Math.abs(variantPrice.amount - unitPrice)}.  </p>
                                                                    : <p className='text-[10px] uppercase tracking-[0.15em] mb-4 text-red-600 font-bold' > Warning this product will cost you {Math.abs(variantPrice.amount - unitPrice)} more.  </p>

                                                                }
                                                                </>
                                                            )
                                                        }

                                                    </div>

                                                    {/* Price & Quantity Row */}
                                                    <div className="flex flex-wrap items-end justify-between gap-4 mt-6 pt-4 border-t border-outline-variant/30">
                                                        {/* Stepper */}
                                                        <div className="flex items-center border border-outline-variant bg-surface-container">
                                                            <button
                                                                onClick={() => changeQty(item._id, -1)}
                                                                className="w-9 h-9 flex items-center justify-center text-on-surface hover:text-primary hover:bg-surface-container-high transition-colors"
                                                                aria-label="Decrease quantity"
                                                            >
                                                                <span className="material-symbols-outlined text-sm">
                                                                    remove
                                                                </span>
                                                            </button>

                                                            <span className="w-10 text-center font-body-md text-body-md font-semibold text-on-surface">
                                                                {qty}
                                                            </span>

                                                            <button
                                                                onClick={() =>
                                                                    handleIncrementCartItem({
                                                                        productId: product?._id,
                                                                        variantId,
                                                                    })
                                                                }
                                                                className="w-9 h-9 flex items-center justify-center text-on-surface hover:text-primary hover:bg-surface-container-high transition-colors"
                                                                aria-label="Increase quantity"
                                                            >
                                                                <span className="material-symbols-outlined text-sm">
                                                                    add
                                                                </span>
                                                            </button>
                                                        </div>

                                                        {/* Price Breakdown */}
                                                        <div className="text-right">
                                                            <div className="font-body-md text-body-md text-outline">
                                                                Unit {formatCurrency(unitPrice, item.price?.currency)}
                                                            </div>

                                                            <div className="font-headline-sm text-headline-sm text-primary font-medium">
                                                                {formatCurrency(unitPrice * qty, item.price?.currency)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </article>
                                        )
                                    })}
                                </div>

                                {/* Promo Code Section — styling from second code */}
                                <div className="bg-surface-container-low border border-outline-variant p-6">
                                    <div
                                        className="flex items-center justify-between cursor-pointer"
                                        onClick={() => setIsPromoOpen(!isPromoOpen)}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary text-xl">
                                                loyalty
                                            </span>

                                            <span className="font-title-lg text-title-lg text-on-surface">
                                                Privilege Passcode / Gift Certificate
                                            </span>
                                        </div>

                                        <span
                                            className={`material-symbols-outlined text-on-surface-variant transition-transform ${
                                                isPromoOpen ? 'rotate-180' : ''
                                            }`}
                                        >
                                            expand_more
                                        </span>
                                    </div>

                                    {isPromoOpen && (
                                        <div className="mt-4 pt-4 border-t border-outline-variant/40 flex flex-col sm:flex-row gap-3">
                                            <div className="relative flex-1">
                                                <input
                                                    type="text"
                                                    placeholder="Enter VIP Invitation or Promo Code"
                                                    className="w-full bg-surface-container border border-outline-variant focus:border-primary text-on-surface font-body-md text-body-md px-4 py-3 outline-none transition-colors"
                                                />
                                            </div>

                                            <button className="px-6 py-3 bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant text-on-surface font-label-caps text-label-caps uppercase transition-colors tracking-widest">
                                                Apply Code
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Client Assurance Badges */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                                    <div className="flex items-start gap-3 p-4 bg-surface-container-low border border-outline-variant/60">
                                        <span className="material-symbols-outlined text-primary text-xl mt-0.5">
                                            diamond
                                        </span>

                                        <div>
                                            <p className="font-label-caps text-label-caps text-on-surface">
                                                Authenticity Guaranteed
                                            </p>
                                            <p className="text-xs text-outline mt-0.5">
                                                Serial numbered certificate included with archival seal.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 p-4 bg-surface-container-low border border-outline-variant/60">
                                        <span className="material-symbols-outlined text-primary text-xl mt-0.5">
                                            lock
                                        </span>

                                        <div>
                                            <p className="font-label-caps text-label-caps text-on-surface">
                                                Encrypted Vault
                                            </p>
                                            <p className="text-xs text-outline mt-0.5">
                                                Level-4 biometric and end-to-end tokenized billing.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 p-4 bg-surface-container-low border border-outline-variant/60">
                                        <span className="material-symbols-outlined text-primary text-xl mt-0.5">
                                            published_with_changes
                                        </span>

                                        <div>
                                            <p className="font-label-caps text-label-caps text-on-surface">
                                                14-Day Bespoke Returns
                                            </p>
                                            <p className="text-xs text-outline mt-0.5">
                                                Complimentary courier retrieval from your residence.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT COLUMN: Order Summary */}
                            <aside className="lg:col-span-4 sticky top-28">
                                <div className="bg-surface-container-low border border-outline-variant p-6 md:p-8 flex flex-col gap-6 shadow-[0px_4px_20px_rgba(0,0,0,0.5)]">
                                    <div className="border-b border-outline-variant/50 pb-4">
                                        <h3 className="font-headline-sm text-headline-sm text-on-surface tracking-tight">
                                            Order Summary
                                        </h3>

                                        <p className="text-xs text-outline mt-1 font-body-md text-body-md">
                                            Prices inclusive of duty &amp; bespoke finishing
                                        </p>
                                    </div>

                                    {/* Financial Line Items */}
                                    <div className="flex flex-col gap-3.5 text-body-md font-body-md">
                                        <div className="flex justify-between items-center text-on-surface-variant">
                                            <span>Subtotal ({cartItems.length} items)</span>
                                            <span className="text-on-surface font-medium">
                                                {formatCurrency(subtotal)}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center text-on-surface-variant">
                                            <span>Estimated Shipping</span>
                                            <span className="text-primary font-label-caps text-label-caps">
                                                {shippingFree ? 'COMPLIMENTARY' : 'CALCULATED AT CHECKOUT'}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center text-on-surface-variant">
                                            <span>Duties &amp; Taxes</span>
                                            <span className="text-on-surface font-medium">
                                                INCLUDED
                                            </span>
                                        </div>

                                        <div className="border-t border-outline-variant/40 pt-4 mt-2">
                                            <div className="flex justify-between items-baseline">
                                                <div>
                                                    <span className="font-headline-sm text-headline-sm text-on-surface">
                                                        Total Amount
                                                    </span>

                                                    <span className="block text-xs text-outline">
                                                        Net billing payable
                                                    </span>
                                                </div>

                                                <div className="text-right">
                                                    <span className="font-headline-md text-headline-md text-primary font-normal tracking-tight">
                                                        {formatCurrency(subtotal)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Checkout Call to Action */}
                                    <div className="flex flex-col gap-3 pt-2">
                                        <button
                                            id="proceed-checkout"
                                            className="w-full py-4 px-6 bg-primary-container hover:bg-primary text-[#12110e] font-label-caps text-label-caps uppercase tracking-widest font-bold flex items-center justify-center gap-3 transition-all duration-200 active:scale-95 shadow-md group"
                                        >
                                            <span>Proceed to Checkout</span>
                                            <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">
                                                east
                                            </span>
                                        </button>

                                        <button
                                            onClick={() => navigate('/')}
                                            className="w-full py-3 px-6 bg-transparent border border-outline-variant hover:border-primary text-on-surface font-label-caps text-label-caps uppercase tracking-wider transition-colors"
                                        >
                                            Continue Shopping
                                        </button>
                                    </div>

                                    {/* Payment Methods & Security */}
                                    <div className="border-t border-outline-variant/40 pt-4 flex flex-col gap-4">
                                        <div className="flex items-center justify-between text-outline text-xs">
                                            <span className="font-label-caps text-label-caps uppercase">
                                                Accepted Instruments
                                            </span>

                                            <span>256-bit SSL Bank Grade</span>
                                        </div>

                                        <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono text-outline">
                                            <div className="py-2 bg-surface-container border border-outline-variant/40 flex items-center justify-center">
                                                VISA
                                            </div>
                                            <div className="py-2 bg-surface-container border border-outline-variant/40 flex items-center justify-center">
                                                MC
                                            </div>
                                            <div className="py-2 bg-surface-container border border-outline-variant/40 flex items-center justify-center">
                                                AMEX
                                            </div>
                                            <div className="py-2 bg-surface-container border border-outline-variant/40 flex items-center justify-center">
                                                UPI
                                            </div>
                                        </div>

                                        <p className="text-[11px] leading-relaxed text-outline text-center">
                                            By proceeding to checkout, you acknowledge compliance with Tivyro Private Client terms of exclusivity and bespoke fabrication guidelines.
                                        </p>
                                    </div>
                                </div>
                            </aside>
                        </div>

                        {/* Editorial Footer / Client Care */}
                        <div className="mt-stack-lg border-t border-outline-variant/40 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-body-md font-body-md text-on-surface-variant">
                            <div className="flex items-center gap-4">
                                <span className="font-display-lg text-headline-sm text-primary tracking-tighter">
                                    Tivyro.
                                </span>

                                <span className="text-outline">|</span>

                                <span className="text-xs">
                                    Bespoke Suite &amp; Fine Couture
                                </span>
                            </div>

                            <div className="flex items-center gap-6 text-xs text-outline">
                                <Link className="hover:text-primary transition-colors" to="/">
                                    Client Services
                                </Link>
                                <Link className="hover:text-primary transition-colors" to="/">
                                    Care Instructions
                                </Link>
                                <Link className="hover:text-primary transition-colors" to="/">
                                    Worldwide Vault Shipping
                                </Link>
                                <Link className="hover:text-primary transition-colors" to="/">
                                    Privacy Policy
                                </Link>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    )
}

export default Cart
