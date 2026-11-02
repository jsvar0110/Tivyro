import React, { useState, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../../auth/hook/useAuth.js'

const Nav = () => {
    const user = useSelector(state => state.auth.user)
    const cartItems = useSelector(state => state.cart?.items)
    const { handleLogout } = useAuth()
    const navigate = useNavigate()

    const [isSettingsOpen, setIsSettingsOpen] = useState(false)
    const settingsRef = useRef(null)

    const onLogout = async () => {
        setIsSettingsOpen(false)
        await handleLogout()
        navigate('/')
    }

    // Close settings dropdown on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (settingsRef.current && !settingsRef.current.contains(event.target)) {
                setIsSettingsOpen(false)
            }
        }
        if (isSettingsOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isSettingsOpen])

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
                    <button className="flex items-center gap-1.5 text-gray-600 hover:text-black transition-colors cursor-pointer bg-transparent border-none">
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

                            {/* Settings button with dropdown containing Logout */}
                            <div className="relative" ref={settingsRef}>
                                <button
                                    onClick={() => setIsSettingsOpen(prev => !prev)}
                                    aria-label="Settings"
                                    title="Settings"
                                    className="flex items-center justify-center p-1.5 text-gray-600 hover:text-black transition-opacity cursor-pointer bg-transparent border-none opacity-80 hover:opacity-100"
                                >
                                    <img
                                        src="/set-mode.svg"
                                        alt="Settings"
                                        className="w-[18px] h-[18px] object-contain"
                                    />
                                </button>

                                {/* Dropdown menu */}
                                {isSettingsOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 shadow-xl py-1 z-50 animate-fadeIn">
                                        <div className="px-4 py-2.5 border-b border-gray-100">
                                            <p className="text-[11px] font-bold uppercase text-black tracking-wider truncate">
                                                {user.fullname}
                                            </p>
                                            {user.email && (
                                                <p className="text-[10px] text-gray-500 truncate mt-0.5">
                                                    {user.email}
                                                </p>
                                            )}
                                            <span className="inline-block mt-1 text-[9px] font-bold tracking-widest uppercase bg-gray-100 text-gray-700 px-2 py-0.5">
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
