import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router';
import { getOrderDetails } from '../service/cart.api.js';

const tokens = {
    surface: '#fbf9f6',
    surfaceLow: '#f5f3f0',
    surfaceHigh: '#eae8e5',
    onSurface: '#1b1c1a',
    onSurfaceVariant: '#4d463a',
    secondary: '#7A6E63',
    primaryDark: '#745a27',
    outlineVariant: '#d0c5b5',
    outline: '#7f7668',
};

const formatCurrency = (amount, currency = 'INR') => {
    try {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency
        }).format(Number(amount || 0));
    } catch {
        return `${currency} ${Number(amount || 0).toLocaleString('en-IN')}`;
    }
};

const OrderSuccess = () => {
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const orderId = queryParams.get('order_id');

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch actual order details from MongoDB
    useEffect(() => {
        let cancelled = false;

        const fetchOrder = async () => {
            if (!orderId) {
                setError('Order reference is missing.');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError('');

                const data = await getOrderDetails(orderId);

                if (!cancelled) {
                    setOrder(data.order);
                }

            } catch (err) {
                console.error('Failed to fetch order:', err);

                if (!cancelled) {
                    setError(
                        err.response?.data?.message ||
                        'Unable to retrieve your order details.'
                    );
                }

            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchOrder();

        return () => {
            cancelled = true;
        };

    }, [orderId]);

    return (
        <>
            <link
                href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
                rel="stylesheet"
            />

            <div
                className="min-h-screen pb-24"
                style={{
                    backgroundColor: tokens.surface,
                    fontFamily: "'Inter', sans-serif"
                }}
            >
                <main className="pt-10 sm:pt-16 px-4 sm:px-8 md:px-12 max-w-6xl mx-auto">

                    {/* LOADING */}
                    {loading && (
                        <div className="py-32 text-center">
                            <p className="text-sm tracking-widest uppercase text-gray-500">
                                Loading your order details...
                            </p>
                        </div>
                    )}

                    {/* ERROR */}
                    {!loading && error && (
                        <div className="py-24 text-center space-y-6">
                            <h1
                                className="text-4xl"
                                style={{
                                    fontFamily: "'Cormorant Garamond', serif"
                                }}
                            >
                                Order details unavailable
                            </h1>

                            <p className="text-sm text-gray-500">
                                {error}
                            </p>

                            <Link
                                to="/"
                                className="inline-block px-8 py-4 bg-black text-white text-xs uppercase tracking-widest"
                            >
                                Return Home
                            </Link>
                        </div>
                    )}

                    {/* SUCCESS */}
                    {!loading && !error && order && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                            {/* LEFT COLUMN */}
                            <div className="lg:col-span-7 space-y-10">

                                <section className="space-y-5">

                                    <span className="text-[10px] tracking-[0.2em] uppercase text-gray-500">
                                        Transaction Complete
                                    </span>

                                    <h1
                                        className="text-5xl sm:text-6xl leading-tight font-light"
                                        style={{
                                            fontFamily: "'Cormorant Garamond', serif",
                                            color: tokens.onSurface
                                        }}
                                    >
                                        Your order is <br />
                                        <i>confirmed.</i>
                                    </h1>

                                    <div className="pt-4">
                                        <p className="text-xs uppercase tracking-widest text-gray-500">
                                            Order Reference
                                        </p>

                                        <p
                                            className="mt-2 text-xl"
                                            style={{
                                                fontFamily: "'Cormorant Garamond', serif",
                                                color: tokens.primaryDark
                                            }}
                                        >
                                            #{order.orderId}
                                        </p>
                                    </div>

                                </section>

                                {/* ORDER SUMMARY */}
                                <section
                                    className="p-5 sm:p-8 space-y-7"
                                    style={{
                                        backgroundColor: tokens.surfaceLow
                                    }}
                                >

                                    <h2
                                        className="text-xl pb-4"
                                        style={{
                                            fontFamily: "'Cormorant Garamond', serif",
                                            borderBottom: `1px solid ${tokens.outlineVariant}`
                                        }}
                                    >
                                        Order Summary
                                    </h2>

                                    {order.items?.map((item, index) => {

                                        const image =
                                            item.images?.[0]?.url;

                                        const currency =
                                            item.price?.currency ||
                                            order.price?.currency ||
                                            'INR';

                                        const unitPrice =
                                            Number(item.price?.amount || 0);

                                        const quantity =
                                            Number(item.quantity || 1);

                                        return (
                                            <div
                                                key={`${item.productId}-${item.variantId}-${index}`}
                                                className="flex gap-4 sm:gap-6 items-center"
                                            >

                                                {/* PRODUCT IMAGE */}
                                                <div
                                                    className="w-20 h-28 sm:w-24 sm:h-32 shrink-0 overflow-hidden"
                                                    style={{
                                                        backgroundColor: tokens.surfaceHigh
                                                    }}
                                                >
                                                    {image ? (
                                                        <img
                                                            src={image}
                                                            alt={item.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="h-full flex items-center justify-center text-xs text-gray-400">
                                                            No Image
                                                        </div>
                                                    )}
                                                </div>

                                                {/* PRODUCT DETAILS */}
                                                <div className="flex-1 space-y-2">

                                                    <h3
                                                        className="text-lg"
                                                        style={{
                                                            fontFamily: "'Cormorant Garamond', serif"
                                                        }}
                                                    >
                                                        {item.title}
                                                    </h3>

                                                    <p className="text-xs text-gray-500">
                                                        Quantity: {quantity}
                                                    </p>

                                                    <p className="text-xs text-gray-500">
                                                        Unit Price: {formatCurrency(unitPrice, currency)}
                                                    </p>

                                                    <p className="font-semibold text-sm">
                                                        {formatCurrency(unitPrice * quantity, currency)}
                                                    </p>

                                                </div>

                                            </div>
                                        );
                                    })}

                                    {/* TOTAL */}
                                    <div
                                        className="pt-6 flex justify-between items-center"
                                        style={{
                                            borderTop: `1px solid ${tokens.outlineVariant}`
                                        }}
                                    >

                                        <span
                                            className="text-lg"
                                            style={{
                                                fontFamily: "'Cormorant Garamond', serif"
                                            }}
                                        >
                                            Amount Paid
                                        </span>

                                        <span
                                            className="text-xl font-semibold"
                                            style={{
                                                color: tokens.primaryDark
                                            }}
                                        >
                                            {formatCurrency(
                                                order.price?.amount,
                                                order.price?.currency
                                            )}
                                        </span>

                                    </div>

                                </section>
                            </div>

                            {/* RIGHT COLUMN */}
                            <div className="lg:col-span-5 space-y-10">

                                <section className="space-y-5">

                                    <h2
                                        className="text-2xl italic"
                                        style={{
                                            fontFamily: "'Cormorant Garamond', serif"
                                        }}
                                    >
                                        Payment Details
                                    </h2>

                                    <div className="flex justify-between border-b border-gray-200 pb-4">

                                        <span className="text-xs uppercase tracking-widest text-gray-500">
                                            Payment Status
                                        </span>

                                        <span className="text-xs font-semibold uppercase tracking-widest text-green-700">
                                            {order.status}
                                        </span>

                                    </div>

                                    <div className="flex justify-between border-b border-gray-200 pb-4">

                                        <span className="text-xs uppercase tracking-widest text-gray-500">
                                            Order ID
                                        </span>

                                        <span className="text-xs break-all text-right ml-4">
                                            {order.orderId}
                                        </span>

                                    </div>

                                    <div className="pt-5 space-y-3">

                                        <h3
                                            className="text-xl italic"
                                            style={{
                                                fontFamily: "'Cormorant Garamond', serif"
                                            }}
                                        >
                                            What's Next?
                                        </h3>

                                        <p
                                            className="text-sm leading-relaxed"
                                            style={{
                                                color: tokens.onSurfaceVariant
                                            }}
                                        >
                                            Your payment has been successfully
                                            verified. Keep your order reference
                                            for future enquiries.
                                        </p>

                                    </div>

                                </section>

                                {/* ACTION BUTTONS */}
                                <div className="flex flex-col gap-4 pt-6">

                                    <Link
                                        to="/"
                                        className="py-5 px-8 text-center text-xs uppercase tracking-[0.2em]"
                                        style={{
                                            backgroundColor: tokens.primaryDark,
                                            color: '#ffffff'
                                        }}
                                    >
                                        Continue Shopping
                                    </Link>

                                    <Link
                                        to="/cart"
                                        className="py-5 px-8 text-center text-xs uppercase tracking-[0.2em] border"
                                        style={{
                                            borderColor: tokens.outline,
                                            color: tokens.onSurface
                                        }}
                                    >
                                        View Cart
                                    </Link>

                                </div>

                            </div>

                        </div>
                    )}

                </main>
            </div>
        </>
    );
};

export default OrderSuccess;