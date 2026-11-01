import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router'

const Nav = () => {
    const user = useSelector(state => state.auth.user)
    const cartItems = useSelector(state => state.cart?.items)

    return (
        <>
            {/* Load fonts */}
            <link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;0,6..96,700;1,6..96,400&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
            <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

            <style>{`
                .material-symbols-outlined {
                    font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
                    display: inline-block;
                    vertical-align: middle;
                    line-height: 1;
                }
                * { border-radius: 0px !important; }
            `}</style>

            {/* Top announcement bar */}
            {/* <aside style={{ fontFamily: "'Inter', sans-serif" }} className="w-full bg-black text-white py-2 px-6 text-[10px] font-semibold tracking-widest uppercase flex flex-col sm:flex-row items-center justify-between z-50">
                <span>FREE DELIVERY ON ORDERS ABOVE ₹999</span>
                <div className="flex items-center gap-3 mt-1 sm:mt-0 text-gray-300">
                    <a href="#" className="hover:text-white transition-colors">DOWNLOAD APP</a>
                    <span>|</span>
                    <a href="#" className="hover:text-white transition-colors">TRACK ORDER</a>
                    <span>|</span>
                    <a href="#" className="hover:text-white transition-colors">HELP</a>
                </div>
            </aside> */}

            {/* Main Navbar */}
            <header className="w-full sticky top-0 z-[100] flex items-center justify-between px-6 md:px-16 h-20 bg-white border-b border-gray-200" style={{ fontFamily: "'Inter', sans-serif" }}>
                {/* LEFT: MEN + WOMEN only */}
                <nav className="flex items-center gap-8">
                    <Link to="/men" className="text-black text-[11px] font-semibold tracking-widest uppercase border-b border-black pb-0.5 hover:text-gray-500 hover:border-gray-500 transition-colors no-underline">MEN</Link>
                    <Link to="/women" className="text-gray-600 text-[11px] font-semibold tracking-widest uppercase hover:text-black transition-colors no-underline">WOMEN</Link>
                </nav>

                {/* CENTER: Brand logo */}
                <div className="absolute left-1/2 -translate-x-1/2">
                    <Link to="/" className="no-underline" style={{ fontFamily: "'Bodoni Moda', serif", fontSize: '28px', fontWeight: '700', letterSpacing: '0.18em', color: '#000', textTransform: 'uppercase' }}>
                        TIVYRO
                    </Link>
                </div>

                {/* RIGHT: Actions */}
                <div className="flex items-center gap-6">
                    {/* Search */}
                    <button className="flex items-center gap-1.5 text-gray-600 hover:text-black transition-colors">
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>search</span>
                        <span className="hidden md:inline text-[11px] font-semibold tracking-widest uppercase">SEARCH</span>
                    </button>

                    {/* Auth */}
                    {user ? (
                        <div className="flex items-center gap-4">
                            <span className="text-[11px] font-medium tracking-wider text-black" style={{ fontFamily: "'Inter', sans-serif" }}>
                                {user.fullname}
                            </span>
                            {user.role === 'seller' && (
                                <Link to="/seller/dashboard" className="text-[11px] font-semibold tracking-widest uppercase bg-black text-white px-4 py-2 hover:bg-gray-800 transition-colors no-underline">
                                    DASHBOARD
                                </Link>
                            )}
                        </div>
                    ) : (
                        <Link to="/login" className="flex items-center gap-1.5 text-gray-600 hover:text-black transition-colors no-underline">
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>person</span>
                            <span className="hidden md:inline text-[11px] font-semibold tracking-widest uppercase">SIGN IN</span>
                        </Link>
                    )}

                    {/* Cart */}
                    <Link to="/cart" className="relative flex items-center gap-1.5 text-black hover:text-gray-600 transition-colors no-underline" aria-label="Cart">
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>shopping_bag</span>
                        <span className="text-[11px] font-semibold tracking-widest uppercase">CART ({cartItems?.length || 0})</span>
                    </Link>
                </div>
            </header>
        </>
    )
}

export default Nav
