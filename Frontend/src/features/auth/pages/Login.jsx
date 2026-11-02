import { useState } from "react";
import { useAuth } from "../hook/useAuth";
import { useNavigate, useSearchParams, Link } from "react-router";
import ContinueWithGoogle from "../components/ContinueWithGoogle";

/* ─────────────────────────────────────────────────────────────────────────────
   Tivyro — Redesigned Editorial Login Page
   Inspired by Tivyro luxury fashion aesthetics.
   Features:
   - High-end editorial aesthetic with model visual and warm sandstone palette
   - Top navigation with Men, Women, New Arrivals, Collections, Sale pill
   - Editorial headline ("Discover Your Style") & call to action
   - Floating elevated login card with custom input fields, remember me,
     password visibility toggle, and Google authentication
   - Fully preserves core authentication logic & role-based routing
───────────────────────────────────────────────────────────────────────────── */

export default function Login() {
  const { handleLogin } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const googleError = params.get("error");

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage("");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const user = await handleLogin({ email: formData.email, password: formData.password });

      if (user?.role === "buyer") {
        navigate("/");
      } else if (user?.role === "seller") {
        navigate("/seller/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Login failed", error);
      setErrorMessage(
        error?.response?.data?.message || "Invalid email or password. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Editorial and Sans Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <div
        className="min-h-screen w-full relative flex flex-col justify-between overflow-x-hidden select-none bg-[#ded8d0]"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {/* ── Background Layer with Model Photograph & Sandstone Gradient ── */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src="/login-bg-model.jpg"
            alt="Tivyro Models"
            className="w-full h-full object-cover object-[58%_center] lg:object-[54%_center]"
            onError={(e) => {
              // Fallback to login-model.png if needed
              e.currentTarget.src = "/login-model.png";
            }}
          />

          {/* Left gradient blending seamlessly into the warm sandstone background */}
          <div
            className="absolute inset-0 hidden sm:block"
            style={{
              background:
                "linear-gradient(to right, #ded8d0 0%, #ded8d0 18%, rgba(222,216,208,0.85) 31%, rgba(222,216,208,0.2) 42%, transparent 180%)",
            }}
          />

          {/* Mobile backdrop tint for card contrast */}
          <div className="absolute inset-0 sm:hidden bg-[#ded8d0]/75 backdrop-blur-[2px]" />
        </div>

        {/* ── Top Navigation Bar ── */}
        <header className="relative z-20 w-full px-4 sm:px-8 lg:px-14 pt-4 sm:pt-6 flex items-center justify-between">
          <div className="flex items-center gap-10">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2.5 text-[#1c1a17] no-underline group"
              aria-label="Tivyro Home"
            >
              {/* Stylized Tivyro Emblem */}
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="transition-transform group-hover:scale-105"
              >
                <path d="M3 5.5L10.5 5.5L7 18.5H3L3 5.5Z" fill="#1c1a17" />
                <path d="M10.5 5.5L21 5.5L16.5 11.5H8.5L10.5 5.5Z" fill="#1c1a17" />
              </svg>
              <span className="text-xl font-bold tracking-tight text-[#1c1a17]">
                Tivyro
              </span>
            </Link>

            {/* Nav Links */}
            {/* <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#2d2924]">
              <Link
                to="/men"
                className="text-[#2d2924] hover:text-black transition-colors no-underline"
              >
                Men
              </Link>
              <Link
                to="/women"
                className="text-[#2d2924] hover:text-black transition-colors no-underline"
              >
                Women
              </Link>
              <Link
                to="/"
                className="text-[#2d2924] hover:text-black transition-colors no-underline"
              >
                New Arrivals
              </Link>
              <Link
                to="/"
                className="text-[#2d2924] hover:text-black transition-colors no-underline"
              >
                Collections
              </Link>
              <Link
                to="/"
                className="bg-[#fae1d3] text-[#9c431b] hover:bg-[#f6d4c2] px-3.5 py-1 rounded-full text-xs font-semibold tracking-wide transition-colors no-underline"
              >
                Sale
              </Link>
            </nav> */}
          </div>
        </header>

        {/* ── Main Hero Section ── */}
        <main className="relative z-10 flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14 py-6 sm:py-8 lg:py-4 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-10">
          {/* Left Column: Editorial Headline & Shop CTA */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center items-start pt-2 lg:pt-0">
            {/* Eyebrow */}
            <p className="text-[11px] font-semibold tracking-[0.24em] text-[#4d4841] uppercase mb-2.5 sm:mb-4">
              Fashion Meets Comfort
            </p>

            {/* Main Headline */}
            <h1
              className="text-[38px] sm:text-6xl lg:text-[72px] leading-[1.04] text-[#1c1a17] font-serif italic mb-3 sm:mb-5 tracking-normal font-normal"
              style={{
                fontFamily:
                  "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
              }}
            >
              Discover
              <br />
              Your Style
            </h1>

            {/* Subtext */}
            <p className="text-xs sm:text-[15px] leading-relaxed text-[#544f47] mb-4 sm:mb-8 max-w-[340px]">
              Trendy apparel, timeless pieces, and seasonal collections — all in
              one place.
            </p>

            {/* Carousel Navigation Indicators */}
            <div className="hidden sm:flex items-center gap-2 mt-8 sm:mt-16">
              <span className="w-8 h-1.5 bg-white rounded-full shadow-sm" />
              <span className="w-5 h-1.5 bg-black/25 rounded-full" />
            </div>
          </div>

          {/* Right Column: Floating Login Card */}
          <div className="w-full lg:w-auto flex justify-center lg:justify-end">
            <div
              className="w-full max-w-[430px] bg-white rounded-[24px] sm:rounded-[32px] p-5 sm:p-8 md:p-9 shadow-[0_24px_50px_rgba(25,20,15,0.09),0_2px_8px_rgba(0,0,0,0.03)] border border-white/80"
              style={{ backdropFilter: "blur(8px)" }}
            >
              {/* Card Title */}
              <h2
                className="text-[26px] sm:text-[32px] font-medium text-[#1c1a17] tracking-tight leading-tight mb-1.5 sm:mb-2"
                style={{
                  fontFamily:
                    "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                }}
              >
                Welcome Back
              </h2>

              {/* Card Subtitle */}
              <p className="text-xs sm:text-[13px] text-[#635d55] leading-relaxed mb-6">
                Log in to your Tivyro account and continue shopping your favorite
                styles.
              </p>

              {/* Error messages */}
              {errorMessage && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-red-600">
                    error
                  </span>
                  <span>{errorMessage}</span>
                </div>
              )}

              {googleError && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-red-600">
                    error
                  </span>
                  <span>Google sign-in was interrupted. Please try again.</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                {/* Email Address */}
                <div>
                  <div className="relative flex items-center border border-[#d9d4cd] rounded-xl px-3.5 py-2.5 focus-within:border-[#1c1a17] focus-within:ring-1 focus-within:ring-[#1c1a17] transition-all bg-[#ffffff]">
                    <span
                      className="material-symbols-outlined text-[#7b756e] text-[18px] mr-2.5 select-none pointer-events-none"
                      style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}
                    >
                      mail
                    </span>
                    <input
                      id="login-email"
                      name="email"
                      type="email"
                      placeholder="Email address"
                      required
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full text-sm text-[#1c1a17] placeholder:text-[#99948d] bg-transparent outline-none"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="relative flex items-center border border-[#d9d4cd] rounded-xl px-3.5 py-2.5 focus-within:border-[#1c1a17] focus-within:ring-1 focus-within:ring-[#1c1a17] transition-all bg-[#ffffff]">
                    <span
                      className="material-symbols-outlined text-[#7b756e] text-[18px] mr-2.5 select-none pointer-events-none"
                      style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}
                    >
                      lock
                    </span>
                    <input
                      id="login-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      required
                      autoComplete="current-password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full text-sm text-[#1c1a17] placeholder:text-[#99948d] bg-transparent outline-none pr-8"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label="Toggle password visibility"
                      className="absolute right-3 text-[#7b756e] hover:text-[#1c1a17] transition-colors p-1 flex items-center justify-center bg-transparent border-none cursor-pointer"
                    >
                      <span
                        className="material-symbols-outlined text-[18px]"
                        style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}
                      >
                        {showPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password Row */}
                <div className="flex items-center justify-between text-xs sm:text-[13px] pt-0.5">
                  <label
                    htmlFor="remember-me"
                    className="flex items-center gap-2 cursor-pointer select-none text-[#2d2924]"
                  >
                    <input
                      type="checkbox"
                      id="remember-me"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="sr-only"
                    />
                    <span
                      className={`w-4 h-4 rounded flex items-center justify-center transition-all border ${rememberMe
                          ? "bg-[#23201d] border-[#23201d]"
                          : "bg-white border-[#d9d4cd]"
                        }`}
                    >
                      {rememberMe && (
                        <svg
                          className="w-2.5 h-2.5 text-white"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </span>
                    <span className="font-normal text-[#2d2924]">
                      Remember me
                    </span>
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-[#2d2924] hover:text-black font-normal no-underline hover:underline transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#23201d] hover:bg-[#38342f] active:scale-[0.99] text-white py-3 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 flex items-center justify-center gap-2 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer mt-1"
                >
                  {isLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Logging in…</span>
                    </>
                  ) : (
                    "Log In"
                  )}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3 my-0.5">
                  <div className="flex-1 h-px bg-[#e5e1db]" />
                  <span className="text-[11px] text-[#8c867f] uppercase tracking-wider font-medium">
                    or continue with
                  </span>
                  <div className="flex-1 h-px bg-[#e5e1db]" />
                </div>

                {/* Google Sign-in */}
                <ContinueWithGoogle theme="light" />

                {/* Don't have an account link */}
                <p className="text-center text-xs sm:text-[13px] text-[#635d55] mt-1 mb-0">
                  Don&apos;t have an account?{" "}
                  <Link
                    to="/register"
                    className="font-semibold underline text-[#1c1a17] hover:opacity-80 transition-opacity ml-1 no-underline"
                  >
                    Create one
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </main>

        {/* ── Subtle bottom buffer ── */}
        <div className="relative z-10 pb-4" />
      </div>
    </>
  );
}
