import React, { useState, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate, useLocation } from 'react-router'
import { useAuth } from '../../auth/hook/useAuth.js'

const Nav = () => {
    const user = useSelector(state => state.auth.user)
    const cartItems = useSelector(state => state.cart?.items)
    const { handleLogout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const [isSettingsOpen, setIsSettingsOpen] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const settingsRef = useRef(null)
    const mobileMenuRef = useRef(null)

    const onLogout = async () => {
        setIsSettingsOpen(false)
        setIsMobileMenuOpen(false)
        await handleLogout()
        navigate('/')
    }

    // Close mobile menu and settings on route navigation
    useEffect(() => {
        setIsMobileMenuOpen(false)
        setIsSettingsOpen(false)
    }, [location.pathname])

    // Close settings dropdown on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (settingsRef.current && !settingsRef.current.contains(event.target)) {
                setIsSettingsOpen(false)
            }
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
                // If clicked outside mobile menu drawer (when clicking backdrop)
            }
        }
        if (isSettingsOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isSettingsOpen])

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [isMobileMenuOpen])

    const cartCount = cartItems?.length || 0

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

            {/* Main Navbar */}
            <header className="w-full sticky top-0 z-[100] flex items-center justify-between px-1 sm:px-6 md:px-12 lg:px-16 h-16 md:h-20 bg-white border-b border-gray-200 transition-all" style={{ fontFamily: "'Inter', sans-serif" }}>
                
                {/* MOBILE: Hamburger Button (< md) */}
                <div className="flex items-center md:hidden">
                    <button
                        onClick={() => setIsMobileMenuOpen(prev => !prev)}
                        aria-label="Toggle Navigation Menu"
                        className="p-2 -ml-2 text-black hover:text-gray-600 transition-colors bg-transparent border-none cursor-pointer flex items-center justify-center"
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
                            {isMobileMenuOpen ? 'close' : 'menu'}
                        </span>
                    </button>
                </div>

                {/* DESKTOP LEFT: MEN + WOMEN (>= md) */}
                <nav className="hidden md:flex items-center gap-6 lg:gap-8">
                    <Link
                        to="/men"
                        className={`text-[11px] font-semibold tracking-widest uppercase transition-colors no-underline pb-0.5 ${location.pathname === '/men' ? 'text-black border-b border-black' : 'text-gray-600 hover:text-black'}`}
                    >
                        MEN
                    </Link>
                    <Link
                        to="/women"
                        className={`text-[11px] font-semibold tracking-widest uppercase transition-colors no-underline pb-0.5 ${location.pathname === '/women' ? 'text-black border-b border-black' : 'text-gray-600 hover:text-black'}`}
                    >
                        WOMEN
                    </Link>
                </nav>

                {/* CENTER: Brand logo (Responsive sizing & placement) */}
                <div className="absolute left-1/2 -translate-x-1/2 flex items-center">
                    <Link
                        to="/"
                        className="no-underline transition-opacity hover:opacity-80"
                        style={{
                            fontFamily: "'Bodoni Moda', serif",
                            fontWeight: '700',
                            letterSpacing: '0.18em',
                            color: '#000',
                            textTransform: 'uppercase',
                        }}
                    >
                        <span className="text-xl sm:text-2xl md:text-[28px]">
                            TIVYRO
                        </span>
                    </Link>
                </div>

                {/* RIGHT: Actions */}
                <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
                    {/* Search - visible icon on all screens, text on md+ */}
                    <button
                        aria-label="Search"
                        className="flex items-center gap-1.5 text-gray-700 hover:text-black transition-colors cursor-pointer bg-transparent border-none p-1.5 sm:p-0"
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '19px' }}>search</span>
                        <span className="hidden lg:inline text-[11px] font-semibold tracking-widest uppercase">SEARCH</span>
                    </button>

                    {/* Auth */}
                    {user ? (
                        <div className="flex items-center gap-2 sm:gap-4">
                            {/* Fullname - hidden on mobile, visible on sm+ */}
                            <span className="hidden sm:inline-block max-w-[100px] md:max-w-[140px] truncate text-[11px] font-medium tracking-wider text-black" title={user.fullname}>
                                {user.fullname}
                            </span>

                            {/* Seller Dashboard link - hidden on small mobile, visible on md+ */}
                            {user.role === 'seller' && (
                                <Link to="/seller/dashboard" className="hidden md:inline-block text-[11px] font-semibold tracking-widest uppercase bg-black text-white px-3.5 py-1.5 hover:bg-gray-800 transition-colors no-underline">
                                    DASHBOARD
                                </Link>
                            )}

                            {/* Settings button with dropdown containing Logout */}
                            <div className="relative" ref={settingsRef}>
                                <button
                                    onClick={() => setIsSettingsOpen(prev => !prev)}
                                    aria-label="User Settings"
                                    title="Settings"
                                    className="flex items-center justify-center p-1.5 text-gray-700 hover:text-black transition-opacity cursor-pointer bg-transparent border-none opacity-85 hover:opacity-100"
                                >
                                    <img
                                        src="/set-mode.svg"
                                        alt="Settings"
                                        className="w-[18px] h-[18px] object-contain"
                                    />
                                </button>

                                {/* Dropdown menu */}
                                {isSettingsOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-52 sm:w-56 bg-white border border-gray-200 shadow-2xl py-1 z-50 animate-fadeIn">
                                        <div className="px-4 py-2.5 border-b border-gray-100 bg-gray-50/50">
                                            <p className="text-[11px] font-bold uppercase text-black tracking-wider truncate">
                                                {user.fullname}
                                            </p>
                                            {user.email && (
                                                <p className="text-[10px] text-gray-500 truncate mt-0.5">
                                                    {user.email}
                                                </p>
                                            )}
                                            <span className="inline-block mt-1.5 text-[9px] font-bold tracking-widest uppercase bg-black text-white px-2 py-0.5">
                                                {user.role}
                                            </span>
                                        </div>

                                        {user.role === 'seller' && (
                                            <Link
                                                to="/seller/dashboard"
                                                onClick={() => setIsSettingsOpen(false)}
                                                className="flex items-center gap-2.5 px-4 py-2 text-[11px] font-semibold tracking-widest uppercase text-gray-700 hover:text-black hover:bg-gray-50 transition-colors no-underline"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">dashboard</span>
                                                <span>Dashboard</span>
                                            </Link>
                                        )}

                                        <button
                                            onClick={onLogout}
                                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[11px] font-semibold tracking-widest uppercase text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors border-none bg-transparent cursor-pointer text-left"
                                        >
                                            <span className="material-symbols-outlined text-[16px]">logout</span>
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <Link to="/login" className="flex items-center gap-1.5 text-gray-700 hover:text-black transition-colors no-underline p-1.5 sm:p-0">
                            <span className="material-symbols-outlined" style={{ fontSize: '19px' }}>person</span>
                            <span className="hidden md:inline text-[11px] font-semibold tracking-widest uppercase">SIGN IN</span>
                        </Link>
                    )}

                    {/* Cart */}
                    <Link
                        to="/cart"
                        className="relative flex items-center gap-1.5 text-black hover:text-gray-600 transition-colors no-underline p-1.5 sm:p-0"
                        aria-label={`Cart with ${cartCount} items`}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>shopping_bag</span>
                        <span className="hidden md:inline text-[11px] font-semibold tracking-widest uppercase">
                            CART ({cartCount})
                        </span>
                        {/* Mobile Badge Pill */}
                        <span className="md:hidden flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-black text-white text-[10px] font-bold">
                            {cartCount}
                        </span>
                    </Link>
                </div>
            </header>

            {/* Mobile Menu Backdrop & Drawer */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-[150] md:hidden">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />

                    {/* Drawer Content */}
                    <div
                        ref={mobileMenuRef}
                        className="fixed inset-y-0 left-0 w-[82%] max-w-[340px] bg-white border-r border-gray-200 shadow-2xl flex flex-col justify-between z-10 animate-slideRight"
                    >
                        {/* Drawer Header */}
                        <div>
                            <div className="flex items-center justify-between px-6 h-16 border-b border-gray-200">
                                <span
                                    style={{
                                        fontFamily: "'Bodoni Moda', serif",
                                        fontWeight: '700',
                                        letterSpacing: '0.18em',
                                        color: '#000',
                                        fontSize: '20px',
                                        textTransform: 'uppercase',
                                    }}
                                >
                                    TIVYRO
                                </span>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    aria-label="Close Menu"
                                    className="p-2 text-gray-500 hover:text-black bg-transparent border-none cursor-pointer flex items-center"
                                >
                                    <span className="material-symbols-outlined text-[22px]">close</span>
                                </button>
                            </div>

                            {/* User Info Bar if Logged In */}
                            {user && (
                                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                                    <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Signed In As</p>
                                    <p className="text-sm font-semibold uppercase text-black tracking-wider truncate mt-0.5">
                                        {user.fullname}
                                    </p>
                                    {user.email && (
                                        <p className="text-xs text-gray-500 truncate mt-0.5">{user.email}</p>
                                    )}
                                    <span className="inline-block mt-2 text-[9px] font-bold tracking-widest uppercase bg-black text-white px-2 py-0.5">
                                        {user.role}
                                    </span>
                                </div>
                            )}

                            {/* Navigation Links */}
                            <nav className="flex flex-col py-3 divide-y divide-gray-100">
                                <Link
                                    to="/men"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center justify-between px-6 py-4 text-xs font-semibold tracking-widest uppercase text-black hover:bg-gray-50 transition-colors no-underline"
                                >
                                    <span>MEN</span>
                                    <span className="material-symbols-outlined text-[16px] text-gray-400">arrow_forward_ios</span>
                                </Link>
                                <Link
                                    to="/women"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center justify-between px-6 py-4 text-xs font-semibold tracking-widest uppercase text-black hover:bg-gray-50 transition-colors no-underline"
                                >
                                    <span>WOMEN</span>
                                    <span className="material-symbols-outlined text-[16px] text-gray-400">arrow_forward_ios</span>
                                </Link>
                                <Link
                                    to="/cart"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center justify-between px-6 py-4 text-xs font-semibold tracking-widest uppercase text-black hover:bg-gray-50 transition-colors no-underline"
                                >
                                    <span className="flex items-center gap-2">
                                        <span>SHOPPING BAG</span>
                                        <span className="bg-black text-white text-[10px] font-bold px-1.5 py-0.2">
                                            {cartCount}
                                        </span>
                                    </span>
                                    <span className="material-symbols-outlined text-[16px] text-gray-400">arrow_forward_ios</span>
                                </Link>

                                {user?.role === 'seller' && (
                                    <Link
                                        to="/seller/dashboard"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center justify-between px-6 py-4 text-xs font-semibold tracking-widest uppercase text-black hover:bg-gray-50 transition-colors no-underline"
                                    >
                                        <span className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[18px]">dashboard</span>
                                            <span>SELLER DASHBOARD</span>
                                        </span>
                                        <span className="material-symbols-outlined text-[16px] text-gray-400">arrow_forward_ios</span>
                                    </Link>
                                )}
                            </nav>
                        </div>

                        {/* Drawer Footer with Auth */}
                        <div className="p-6 border-t border-gray-200 bg-white">
                            {user ? (
                                <button
                                    onClick={onLogout}
                                    className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 text-xs font-semibold tracking-widest uppercase hover:bg-red-100 transition-colors border border-red-200 cursor-pointer"
                                >
                                    <span className="material-symbols-outlined text-[18px]">logout</span>
                                    <span>LOGOUT</span>
                                </button>
                            ) : (
                                <div className="flex flex-col gap-2.5">
                                    <Link
                                        to="/login"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="w-full py-3 bg-black text-white text-center text-xs font-semibold tracking-widest uppercase hover:bg-gray-800 transition-colors no-underline"
                                    >
                                        SIGN IN
                                    </Link>
                                    <Link
                                        to="/register"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="w-full py-3 border border-black text-black text-center text-xs font-semibold tracking-widest uppercase hover:bg-gray-50 transition-colors no-underline"
                                    >
                                        REGISTER
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Nav
