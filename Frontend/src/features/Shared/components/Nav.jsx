import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router'

const Nav = () => {
    const navigate = useNavigate()
    const user = useSelector(state => state.auth.user)

    return (
        <nav className="fixed top-0 w-full z-50 bg-surface border-b border-outline-variant">

            {/* Navbar inner container */}
            <div className="flex justify-between items-center h-20 px-container-padding w-full max-w-[1440px] mx-auto">

                {/* ====================================================
                    LEFT SIDE — BRAND LOGO
                    ==================================================== */}
                <div className="flex items-center gap-6">
                    <Link
                        to="/"
                        className="font-display-lg text-display-lg text-primary tracking-tighter hover:opacity-80 transition-opacity"
                    >
                        Tivyro.
                    </Link>
                </div>

                {/* ====================================================
                    CENTER — NAVIGATION LINKS
                    ==================================================== */}
                <nav className="hidden md:flex items-center gap-6">
                    {[
                        { name: 'New In', path: '/' },
                        { name: 'Collections', path: '/' },
                        { name: 'Brands', path: '/' },
                        { name: 'Sale', path: '/' }
                    ].map((item) => (
                        <Link
                            key={item.name}
                            to={item.path}
                            className="nav-link text-[13px] font-medium no-underline text-on-surface-variant hover:text-primary transition-colors"
                            style={{
                                fontFamily: "'Geist', sans-serif",
                                letterSpacing: '0.04em'
                            }}
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>

                {/* ====================================================
                    RIGHT SIDE — USER ACTIONS
                    ==================================================== */}
                <div className="flex items-center gap-4 text-[13px]">

                    {user ? (
                        <>
                            {/* User Name */}
                            <span className="text-on-surface">
                                {user.fullname}
                            </span>

                            {/* Cart Icon */}
                            <Link to="/cart" className="text-on-surface-variant hover:text-primary transition-colors" title="Cart">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="8" cy="21" r="1"/>
                                    <circle cx="19" cy="21" r="1"/>
                                    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
                                </svg>
                            </Link>

                            {/* Seller Dashboard */}
                            {user.role === 'seller' && (
                                <Link
                                    to="/seller/dashboard"
                                    className="px-4 py-2 border border-outline-variant bg-surface-container hover:border-primary text-primary transition-all"
                                >
                                    Seller Dashboard
                                </Link>
                            )}
                        </>
                    ) : (
                        <>
                            {/* Sign In */}
                            <Link
                                to="/login"
                                className="text-on-surface-variant hover:text-primary transition-colors"
                            >
                                Sign In
                            </Link>

                            {/* Sign Up */}
                            <Link
                                to="/register"
                                className="px-4 py-2 border border-outline-variant bg-surface-container hover:border-primary text-primary transition-all"
                            >
                                Sign Up
                            </Link>
                        </>
                    )}

                </div>

            </div>
        </nav>
    )
}

export default Nav

