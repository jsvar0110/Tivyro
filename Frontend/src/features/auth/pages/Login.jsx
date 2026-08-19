import { useState } from "react";
import { useAuth } from "../hook/useAuth";
import { useNavigate } from "react-router";
import ContinueWithGoogle from "../components/ContinueWithGoogle";

/* ─────────────────────────────────────────────────────────────────────────────
   Snitch — Login Page (v2)
   Editorial split-panel · Dark / Light mode toggle
   Fonts: Cormorant Garamond (editorial headings) + Inter + Geist
   Tailwind CSS + Aurelian Dark design-system tokens
   Matches Register.jsx design language exactly.
───────────────────────────────────────────────────────────────────────────── */

export default function Login() {
  const { handleLogin } = useAuth();
  const navigate = useNavigate();

  const [dark, setDark] = useState(true);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await handleLogin({ email: formData.email, password: formData.password });
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  };

  /* ── Theme tokens (identical mapping as Register) ── */
  const d = dark;
  const tk = {
    pageBg:          d ? "#121317" : "#fbf9f6",
    cardBg:          d ? "#1c1c1c" : "#ffffff",
    cardBorder:      d ? "#252525" : "#e5e1db",
    inputBg:         d ? "#1a1a1a" : "#f5f3f0",
    inputBorder:     d ? "#2c2c2c" : "#ddd8d0",
    focusColor:      d ? "#f5c342" : "#C9A96E",
    text:            d ? "#e3e2e7" : "#1b1c1a",
    textMuted:       d ? "#d2c5ae" : "#5a5650",
    textSubtle:      d ? "#9b8f7b" : "#9b9490",
    golden:          d ? "#f5c342" : "#C9A96E",
    divider:         d ? "#252525" : "#e5e1db",
    headerBg:        d ? "rgba(18,19,23,0.92)" : "rgba(251,249,246,0.92)",
    footerBg:        d ? "#0d0e12" : "#f5f3f0",
    orb1:            d ? "rgba(245,195,66,0.07)" : "rgba(201,169,110,0.09)",
    orb2:            d ? "rgba(245,195,66,0.045)" : "rgba(201,169,110,0.06)",
    glowFocus:       d ? "rgba(245,195,66,0.18)"  : "rgba(201,169,110,0.18)",
    imgOpacity:      d ? 0.42 : 0.52,
    imgBlend:        d ? "luminosity" : "normal",
    imgFilter:       d ? "none" : "sepia(10%) brightness(0.9)",
    panelGrad:       d
      ? "linear-gradient(to right, transparent 55%, #121317 100%), linear-gradient(to top, rgba(18,19,23,0.72) 0%, rgba(18,19,23,0.1) 55%, transparent 100%)"
      : "linear-gradient(to right, transparent 55%, #fbf9f6 100%), linear-gradient(to top, rgba(27,24,20,0.55) 0%, rgba(27,24,20,0.08) 55%, transparent 100%)",
    heroText:        d ? "#e3e2e7" : "#ffffff",
    heroSub:         d ? "rgba(210,197,174,0.72)" : "rgba(255,255,255,0.72)",
    heroStatSub:     d ? "rgba(210,197,174,0.60)" : "rgba(255,255,255,0.60)",
    cardGlow:        d ? "rgba(245,195,66,0.09)" : "rgba(201,169,110,0.10)",
    submitBg:        d ? "#f5c342" : "#1b1c1a",
    submitText:      d ? "#111111" : "#fbf9f6",
    submitHoverBg:   d ? "#e8b63a" : "#2d2e2c",
    sheen: d
      ? "linear-gradient(90deg, transparent 0%, rgba(245,195,66,0.35) 40%, rgba(245,195,66,0.60) 50%, rgba(245,195,66,0.35) 60%, transparent 100%)"
      : "linear-gradient(90deg, transparent 0%, rgba(201,169,110,0.35) 40%, rgba(201,169,110,0.55) 50%, rgba(201,169,110,0.35) 60%, transparent 100%)",
  };

  const inputBase = {
    backgroundColor: tk.inputBg,
    border: `1px solid ${tk.inputBorder}`,
    color: tk.text,
    fontFamily: "'Inter', sans-serif",
    borderRadius: "0.25rem",
    outline: "none",
    width: "100%",
    fontSize: "0.875rem",
    lineHeight: "1.5",
    padding: "0.55rem 1rem 0.55rem 2.4rem",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  const onFocus = (e) => {
    e.target.style.borderColor = tk.focusColor;
    e.target.style.boxShadow = `0 0 0 3px ${tk.glowFocus}`;
  };
  const onBlur = (e) => {
    e.target.style.borderColor = tk.inputBorder;
    e.target.style.boxShadow = "none";
  };

  return (
    <>
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&family=Geist:wght@400;500;600&display=swap"
        rel="stylesheet"
      />

      <style>{`
        @keyframes orbFloat {
          0%,100% { transform: translateY(0) scale(1); }
          50%     { transform: translateY(-22px) scale(1.03); }
        }
        @keyframes revealUp {
          from { opacity:0; transform:translateY(24px) scale(0.98); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
        @keyframes barGrow {
          from { width:0; }
          to   { width:2.25rem; }
        }
        @keyframes sheenSlide {
          0%   { background-position:-200% center; }
          100% { background-position: 300% center; }
        }
        @keyframes spin { to { transform:rotate(360deg); } }
        @keyframes loginPulse { 0%,100%{opacity:1} 50%{opacity:.35} }

        .login-root  { transition: background-color .35s, color .35s; }
        .login-panel { animation: revealUp .5s cubic-bezier(.22,1,.36,1) both; }
        .login-hero  { animation: revealUp .55s .08s cubic-bezier(.22,1,.36,1) both; }
        .login-bar   { animation: barGrow  .65s .28s cubic-bezier(.22,1,.36,1) both; }
        .login-orb1  { animation: orbFloat 8s  ease-in-out infinite; }
        .login-orb2  { animation: orbFloat 11s ease-in-out infinite reverse; }
        .login-dot   { animation: loginPulse 2.4s ease-in-out infinite; }

        .login-spinner {
          width:16px; height:16px;
          border-radius:50%;
          animation:spin .7s linear infinite;
          flex-shrink:0;
        }

        .login-sheen {
          background-size: 200% auto;
          animation: sheenSlide 4s linear infinite;
        }

        .login-cta { transition: box-shadow .22s, transform .18s, background-color .2s, color .2s; }
        .login-cta:not(:disabled):hover  { transform:translateY(-1px); }
        .login-cta:not(:disabled):active { transform:translateY(0); }

        .login-toggle-btn { transition: background-color .3s, color .3s; }
      `}</style>

      <div
        className="login-root h-screen flex flex-col overflow-hidden"
        style={{ backgroundColor: tk.pageBg, color: tk.text, fontFamily: "'Inter', sans-serif" }}
      >
        {/* ── Ambient orbs ── */}
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          <div className="login-orb1 absolute" style={{ top:"-15%", right:"-8%", width:"50vw", height:"50vw", borderRadius:"50%", background:`radial-gradient(circle,${tk.orb1} 0%,transparent 70%)`, filter:"blur(40px)" }} />
          <div className="login-orb2 absolute" style={{ bottom:"-18%", left:"-8%", width:"42vw", height:"42vw", borderRadius:"50%", background:`radial-gradient(circle,${tk.orb2} 0%,transparent 70%)`, filter:"blur(48px)" }} />
        </div>

        {/* ── Header ── */}
        <header
          className="sticky top-0 z-50 border-b backdrop-blur-md px-6"
          style={{ backgroundColor: tk.headerBg, borderColor: tk.divider }}
        >
          <div className="max-w-[1280px] mx-auto h-14 flex items-center justify-between">
            <span style={{ fontFamily:"'Cormorant Garamond', serif", color: tk.golden, fontSize:"22px", fontWeight:"500", letterSpacing:"-0.01em", cursor:"pointer" }}>
              Snitch.
            </span>
            <div className="flex items-center gap-4">
              {/* Theme toggle */}
              <button
                id="login-theme-toggle"
                aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
                onClick={() => setDark(v => !v)}
                className="login-toggle-btn flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium tracking-wide cursor-pointer border"
                style={{ backgroundColor: tk.cardBg, borderColor: tk.cardBorder, color: tk.textMuted, fontFamily:"'Geist', sans-serif" }}
              >
                <span>{dark ? "☀️" : "🌙"}</span>
                <span>{dark ? "Light" : "Dark"}</span>
              </button>

              <a
                href="/register"
                className="text-sm font-medium tracking-[0.04em] no-underline transition-colors duration-200"
                style={{ color: tk.textMuted, fontFamily:"'Geist', sans-serif" }}
                onMouseEnter={e => e.target.style.color = tk.golden}
                onMouseLeave={e => e.target.style.color = tk.textMuted}
              >
                Register
              </a>
            </div>
          </div>
        </header>

        {/* ── Main ── */}
        <main className="flex-1 flex overflow-hidden relative z-10 min-h-0">

          {/* LEFT: Editorial image panel */}
          <div className="hidden lg:block lg:w-[46%] relative login-hero overflow-hidden">
            <div className="absolute inset-0 z-0">
              <img
                src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1974&auto=format&fit=crop"
                alt="Snitch Fashion Editorial"
                style={{ width:"100%", height:"100%", objectFit:"cover", opacity: tk.imgOpacity, mixBlendMode: tk.imgBlend, filter: tk.imgFilter, transition:"opacity .4s, filter .4s" }}
              />
              <div className="absolute inset-0" style={{ background: tk.panelGrad }} />
            </div>

            {/* Panel content */}
            <div className="relative z-10 flex flex-col justify-between h-full px-12 py-10">
              {/* Badge */}
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full w-fit"
                style={{ border:`1px solid ${tk.golden}4d`, backgroundColor:`${tk.golden}18` }}
              >
                <span className="login-dot w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: tk.golden }} />
                <span className="text-xs font-semibold tracking-[0.18em] uppercase" style={{ color: tk.golden, fontFamily:"'Geist', sans-serif" }}>
                  Members Only
                </span>
              </div>

              {/* Bottom copy */}
              <div>
                <h2
                  className="font-light leading-[1.08] mb-4"
                  style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"clamp(2.4rem,3.6vw,3.2rem)", color: tk.heroText }}
                >
                  Welcome<br />
                  <em style={{ color: tk.golden }}>Back.</em>
                </h2>
                
                <div className="flex gap-7">
                  {[{ value:"50K+", label:"Members" }, { value:"2K+", label:"Brands" }, { value:"100%", label:"Premium" }].map(s => (
                    <div key={s.label}>
                      <p className="text-xl font-bold" style={{ color: tk.golden, fontFamily:"'Inter', sans-serif" }}>{s.value}</p>
                      <p className="text-[11px] tracking-[0.1em] uppercase mt-0.5" style={{ color: tk.heroStatSub, fontFamily:"'Geist', sans-serif" }}>{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Form panel */}
          <div
            className="w-full lg:w-[54%] flex flex-col items-center justify-center overflow-y-auto relative z-10 px-6 sm:px-10 lg:px-12 py-4"
            style={{ backgroundColor: tk.pageBg }}
          >
            <div className="login-panel w-full max-w-[430px]">

              {/* Mobile brand mark */}
              <div className="lg:hidden mb-6">
                <span className="text-sm tracking-[0.3em] uppercase" style={{ fontFamily:"'Cormorant Garamond', serif", color: tk.golden }}>
                  Snitch.
                </span>
              </div>

              {/* Card */}
              <div
                className="relative rounded-lg px-6 py-8"
                style={{
                  backgroundColor: tk.cardBg,
                  border: `1px solid ${tk.cardBorder}`,
                  boxShadow: dark
                    ? "0 28px 56px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03)"
                    : "0 12px 40px rgba(27,24,20,0.10), 0 0 0 1px rgba(27,24,20,0.04)",
                  transition: "background-color .35s, border-color .35s, box-shadow .35s",
                }}
              >
                {/* Sheen line */}
                <div
                  aria-hidden="true"
                  className="login-sheen absolute top-0 left-0 right-0 h-[1px] rounded-t-lg"
                  style={{ background: tk.sheen }}
                />

                {/* Golden glow */}
                <div
                  aria-hidden="true"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-28 pointer-events-none"
                  style={{ background:`radial-gradient(ellipse at center, ${tk.cardGlow} 0%, transparent 70%)` }}
                />

                {/* ── Card Header ── */}
                <div className="mb-6 text-center relative z-[1]">
                  <div
                    className="inline-flex items-center justify-center w-11 h-11 rounded-full mb-3"
                    style={{ border:`1px solid ${tk.golden}40`, backgroundColor:`${tk.golden}18` }}
                  >
                    <span className="material-symbols-outlined" style={{ color: tk.golden, fontSize:"20px" }}>lock_open</span>
                  </div>

                  <p className="text-[10px] font-semibold tracking-[0.2em] uppercase mb-1" style={{ color: tk.golden, fontFamily:"'Geist', sans-serif" }}>
                    Welcome Back
                  </p>

                  <h1
                    className="font-light leading-[1.15] mb-2"
                    style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"clamp(1.6rem,2.6vw,2rem)", color: tk.text }}
                  >
                    Sign <em style={{ color: tk.golden }}>In</em>
                  </h1>

                  <div className="login-bar h-[2.5px] rounded-full mx-auto" style={{ backgroundColor: tk.golden }} />
                </div>

                {/* ── Form ── */}
                <form onSubmit={handleSubmit} className="relative z-[1] flex flex-col gap-4">

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="login-email"
                      className="block mb-1 text-[10px] font-semibold tracking-[0.18em] uppercase"
                      style={{ color: tk.textSubtle, fontFamily:"'Geist', sans-serif" }}
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ fontSize:"16px", color: tk.textSubtle }}>mail</span>
                      <input
                        id="login-email" name="email" type="email"
                        placeholder="name@example.com" required autoComplete="email"
                        value={formData.email} onChange={handleChange}
                        style={inputBase} onFocus={onFocus} onBlur={onBlur}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label
                        htmlFor="login-password"
                        className="text-[10px] font-semibold tracking-[0.18em] uppercase"
                        style={{ color: tk.textSubtle, fontFamily:"'Geist', sans-serif" }}
                      >
                        Password
                      </label>
                      <a
                        href="/forgot-password"
                        className="text-[11px] no-underline transition-colors duration-200"
                        style={{ color: `${tk.golden}cc`, fontFamily:"'Geist', sans-serif" }}
                        onMouseEnter={e => e.target.style.color = tk.golden}
                        onMouseLeave={e => e.target.style.color = `${tk.golden}cc`}
                      >
                        Forgot password?
                      </a>
                    </div>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ fontSize:"16px", color: tk.textSubtle }}>lock</span>
                      <input
                        id="login-password" name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password" required autoComplete="current-password"
                        value={formData.password} onChange={handleChange}
                        style={{ ...inputBase, paddingRight:"2.5rem" }}
                        onFocus={onFocus} onBlur={onBlur}
                      />
                      <button
                        type="button" aria-label="Toggle password visibility"
                        onClick={() => setShowPassword(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer flex items-center p-0.5 transition-colors duration-200"
                        style={{ color: tk.textSubtle }}
                        onMouseEnter={e => e.currentTarget.style.color = tk.golden}
                        onMouseLeave={e => e.currentTarget.style.color = tk.textSubtle}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize:"17px" }}>
                          {showPassword ? "visibility_off" : "visibility"}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* CTA */}
                  <button
                    id="login-submit"
                    type="submit" disabled={isLoading}
                    className="login-cta w-full py-2.5 rounded text-sm font-semibold tracking-[0.08em] uppercase cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-1"
                    style={{ backgroundColor: tk.submitBg, color: tk.submitText, border:"none", fontFamily:"'Geist', sans-serif" }}
                    onMouseEnter={e => { if(!isLoading){ e.currentTarget.style.backgroundColor = tk.submitHoverBg; } }}
                    onMouseLeave={e => { if(!isLoading){ e.currentTarget.style.backgroundColor = tk.submitBg; } }}
                  >
                    {isLoading ? (
                      <>
                        <div className="login-spinner" style={{ border:`2.5px solid ${dark?"rgba(17,17,17,0.25)":"rgba(251,249,246,0.3)"}`, borderTopColor: dark?"#111":"#fbf9f6" }} />
                        Signing in…
                      </>
                    ) : (
                      <>
                        Sign In
                        <span className="material-symbols-outlined" style={{ fontSize:"17px" }}>arrow_forward</span>
                      </>
                    )}
                  </button>

                  {/* Divider */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px" style={{ backgroundColor: tk.divider }} />
                    <span className="text-[11px] tracking-[0.08em] uppercase" style={{ color: tk.textSubtle, fontFamily:"'Geist', sans-serif" }}>or</span>
                    <div className="flex-1 h-px" style={{ backgroundColor: tk.divider }} />
                  </div>

                  {/* Google */}
                  <ContinueWithGoogle />

                  {/* Register link */}
                  <p className="text-center text-sm" style={{ color: tk.textSubtle, fontFamily:"'Inter', sans-serif" }}>
                    Don&apos;t have an account?{" "}
                    <a
                      href="/register"
                      className="font-medium no-underline transition-opacity duration-200"
                      style={{ color: tk.golden }}
                      onMouseEnter={e => e.target.style.opacity = "0.72"}
                      onMouseLeave={e => e.target.style.opacity = "1"}
                    >
                      Create one
                    </a>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </main>

        {/* ── Footer ── */}
        <footer className="py-3 px-6 border-t relative z-10" style={{ backgroundColor: tk.footerBg, borderColor: tk.divider }}>
          <div className="max-w-[1280px] mx-auto flex flex-row justify-between items-center flex-wrap gap-4">
            <span className="text-[12px] font-medium" style={{ color:`${tk.golden}b0`, fontFamily:"'Geist', sans-serif" }}>
              © 2024 Snitch. All rights reserved.
            </span>
            <nav className="flex gap-5">
              {["Privacy Policy", "Terms of Service", "Help"].map(link => (
                <a
                  key={link} href="#"
                  className="text-[12px] font-medium no-underline opacity-70 transition-[color,opacity] duration-200 hover:opacity-100"
                  style={{ color: tk.textSubtle, fontFamily:"'Geist', sans-serif" }}
                  onMouseEnter={e => e.target.style.color = tk.golden}
                  onMouseLeave={e => e.target.style.color = tk.textSubtle}
                >
                  {link}
                </a>
              ))}
            </nav>
          </div>
        </footer>
      </div>
    </>
  );
}
