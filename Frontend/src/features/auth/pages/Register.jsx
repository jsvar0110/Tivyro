import { useState, useEffect } from "react";
import { useAuth } from "../hook/useAuth";
import { useNavigate } from "react-router";
import ContinueWithGoogle from "../components/ContinueWithGoogle";

/* ─────────────────────────────────────────────────────────────────────────────
   Tivyro — Register Page (v2)
   Editorial split-panel · Dark / Light mode toggle
   Fonts: Cormorant Garamond (editorial headings) + Inter + Geist
   Tailwind CSS + Aurelian Dark design-system tokens
───────────────────────────────────────────────────────────────────────────── */

export default function Register() {
  const { handleRegister } = useAuth();
  const navigate = useNavigate();

  /* ── Theme state ── */
  const [dark, setDark] = useState(true);

  /* ── Form state ── */
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
    password: "",
    isSeller: false,
  });
  const [showPassword, setShowPw] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await handleRegister({
        email: formData.email,
        contact: formData.contactNumber,
        password: formData.password,
        isSeller: formData.isSeller,
        fullname: formData.fullName,
      });
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  };

  /* ── Theme tokens ── */
  const d = dark;
  const tk = {
    pageBg:          d ? "#121317" : "#fbf9f6",
    cardBg:          d ? "#1c1c1c" : "#ffffff",
    cardBorder:      d ? "#252525" : "#e5e1db",
    newText:        d ? "#f5c342" : "#ffffff",
    bgGold :       d ? "rgb(179 154 91 / 6%)" : "rgb(225 180 65 / 40%)",
    goldWhite :      d ? "#ffffff" : "#000000" , 
    inputBg:         d ? "#1a1a1a" : "#f5f3f0",
    inputBorder:     d ? "#2c2c2c" : "#ddd8d0",
    focusColor:      d ? "#f5c342" : "rgb(201, 169, 110)",
    text:            d ? "#e3e2e7" : "#1b1c1a",
    textMuted:       d ? "#d2c5ae" : "#5a5650",
    textSubtle:      d ? "#9b8f7b" : "#9b9490",
    golden:          d ? "#f5c342" : "rgb(255, 187, 0)",
    divider:         d ? "#252525" : "#e5e1db",
    headerBg:        d ? "rgba(18,19,23,0.92)" : "rgba(251,249,246,0.92)",
    footerBg:        d ? "#0d0e12" : "#f5f3f0",
    orb1:            d ? "rgba(245,195,66,0.07)" : "rgba(212,167,44,0.11)",
    orb2:            d ? "rgba(245,195,66,0.045)" : "rgba(212,167,44,0.075)",
    sellerRowBg:     d ? "rgba(245,195,66,0.04)"  : "rgba(212,167,44,0.06)",
    sellerRowBorder: d ? "rgba(245,195,66,0.12)"  : "rgba(212,167,44,0.20)",
    glowFocus:       d ? "rgba(245,195,66,0.18)"  : "rgba(212,167,44,0.18)",
    imgOpacity:      d ? 0.42 : 0.92,
    imgBlend:        d ? "luminosity" : "normal",
    imgFilter:       d ? "none" : "sepia(10%) brightness(0.9)",
    panelGrad:       d
      ? "linear-gradient(to right, transparent 55%, #121317 100%), linear-gradient(to top, rgba(18,19,23,0.72) 0%, rgba(18,19,23,0.1) 55%, transparent 100%)"
      : "linear-gradient(to right, transparent 55%, #fbf9f6 100%), linear-gradient(to top, rgba(27,24,20,0.55) 0%, rgba(27,24,20,0.08) 55%, transparent 100%)",
    heroText:        d ? "#e3e2e7" : "#ffffff",
    heroSub:         d ? "rgba(210,197,174,0.72)" : "rgba(255,255,255,0.72)",
    heroStatSub:     d ? "rgba(210,197,174,0.60)" : "rgba(255,255,255,0.60)",
    cardGlow:        d ? "rgba(245,195,66,0.09)" : "rgb(229 211 165 / 31%)",
    submitBg:        d ? "#f5c342" : "#1b1c1a",
    submitText:      d ? "#111111" : "#fbf9f6",
    submitHoverBg:   d ? "#e8b63a" : "#2d2e2c",
    sheen: d
      ? "linear-gradient(90deg, transparent 0%, rgba(245,195,66,0.35) 40%, rgba(245,195,66,0.60) 50%, rgba(245,195,66,0.35) 60%, transparent 100%)"
      : "linear-gradient(90deg, transparent 0%, rgba(201,169,110,0.35) 40%, rgba(201,169,110,0.55) 50%, rgba(201,169,110,0.35) 60%, transparent 100%)",
  };

  /* ── Input style helpers ── */
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
    padding: "0.42rem 1rem 0.42rem 2.2rem",
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
        @keyframes regPulse { 0%,100%{opacity:1} 50%{opacity:.35} }

        .reg-root  { transition: background-color .35s, color .35s; }
        .reg-panel { animation: revealUp .5s cubic-bezier(.22,1,.36,1) both; }
        .reg-hero  { animation: revealUp .55s .08s cubic-bezier(.22,1,.36,1) both; }
        .reg-bar   { animation: barGrow  .65s .28s cubic-bezier(.22,1,.36,1) both; }
        .reg-orb1  { animation: orbFloat 9s  ease-in-out infinite; }
        .reg-orb2  { animation: orbFloat 13s ease-in-out infinite reverse; }
        .reg-dot   { animation: regPulse 2.4s ease-in-out infinite; }

        .reg-spinner {
          width:16px; height:16px;
          border-radius:50%;
          animation:spin .7s linear infinite;
          flex-shrink:0;
        }

        .reg-sheen {
          background-size: 200% auto;
          animation: sheenSlide 4s linear infinite;
        }

        .reg-checkbox {
          appearance:none; -webkit-appearance:none;
          width:17px; height:17px;
          border-radius:3px;
          cursor:pointer;
          position:relative;
          flex-shrink:0;
          transition: background .18s, border-color .18s;
        }
        .reg-checkbox:checked::after {
          content:'';
          position:absolute;
          left:4px; top:1px;
          width:7px; height:11px;
          border:2px solid #111;
          border-top:none; border-left:none;
          transform:rotate(42deg);
        }
        .reg-checkbox:focus { outline: 2px solid rgba(245,195,66,.3); outline-offset:2px; }

        .reg-cta { transition: box-shadow .22s, transform .18s, background-color .2s, color .2s; }
        .reg-cta:not(:disabled):hover  { transform:translateY(-1px); }
        .reg-cta:not(:disabled):active { transform:translateY(0); }

        .reg-toggle-btn { transition: background-color .3s, color .3s; }
      `}</style>

      <div
        className="reg-root h-screen flex flex-col overflow-hidden"
        style={{ backgroundColor: tk.pageBg, color: tk.text, fontFamily: "'Inter', sans-serif" }}
      >
        {/* ── Ambient orbs ── */}
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          <div className="reg-orb1 absolute" style={{ top:"-15%", right:"-8%", width:"50vw", height:"50vw", borderRadius:"50%", background:`radial-gradient(circle,${tk.orb1} 0%,transparent 70%)`, filter:"blur(40px)" }} />
          <div className="reg-orb2 absolute" style={{ bottom:"-18%", left:"-8%", width:"42vw", height:"42vw", borderRadius:"50%", background:`radial-gradient(circle,${tk.orb2} 0%,transparent 70%)`, filter:"blur(48px)" }} />
        </div>

        {/* ── Header ── */}
        <header
          className="sticky top-0 z-50 border-b backdrop-blur-md px-6"
          style={{ backgroundColor: tk.headerBg, borderColor: tk.divider }}
        >
          <div className="max-w-[1280px] mx-auto h-14 flex items-center justify-between">
            <span style={{ fontFamily:"'Cormorant Garamond', serif", color: tk.goldWhite, fontSize:"20px", fontWeight:"500", letterSpacing:"0.12em", cursor:"pointer" }}>
              Tivyro.
            </span>
            <div className="flex items-center gap-4">
              {/* Theme toggle */}
              <button
                id="reg-theme-toggle"
                aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
                onClick={() => setDark(v => !v)}
                className="reg-toggle-btn flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium tracking-wide cursor-pointer border"
                style={{ backgroundColor: tk.cardBg, borderColor: tk.cardBorder, color: tk.textMuted, fontFamily:"'Geist', sans-serif" }}
              >
                <span>{dark ? "☀️" : "🌙"}</span>
                <span>{dark ? "Light" : "Dark"}</span>
              </button>

              <a
                href="/login"
                className="text-sm font-medium tracking-[0.04em] no-underline transition-colors duration-200"
                style={{ color: tk.textMuted, fontFamily:"'Geist', sans-serif" }}
                onMouseEnter={e => e.target.style.color = tk.golden}
                onMouseLeave={e => e.target.style.color = tk.textMuted}
              >
                Sign In
              </a>
            </div>
          </div>
        </header>

        {/* ── Main ── */}
        <main className="flex-1 flex overflow-hidden relative z-10 min-h-0">

          {/* LEFT: Editorial image panel */}
          <div className="hidden lg:block lg:w-[46%] relative reg-hero overflow-hidden">
            <div className="absolute inset-0 z-0">
              <img
                src={dark ? "/Tivyro-dark.png" : "/Tivyro.png"}
                alt="Tivyro Fashion Editorial"
                style={{ width:"100%", height:"100%", objectFit:"cover", opacity: tk.imgOpacity, mixBlendMode: tk.imgBlend, filter: tk.imgFilter, transition:"opacity .4s, filter .4s" }}
              />
              <div className="absolute inset-0" style={{ background: tk.panelGrad }} />
            </div>

            {/* Panel content */}
            <div className="relative z-10 flex flex-col justify-between h-full px-12 py-10">
              {/* Badge */}
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full w-fit"
                style={{ border:`2px solid ${tk.golden}4d`, backgroundColor:`${tk.bgGold}` }}
              >
                <span className="reg-dot w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: tk.bgGold }} />
                <span className="text-xs font-semibold tracking-[0.18em] uppercase" style={{ color: tk.newText, fontFamily:"'Geist', sans-serif" }}>
                  New Collection
                </span>
              </div>

              {/* Bottom copy */}
              <div className="flex flex-col gap-5">
                <h2
                  className="font-light leading-[1.08] mb-4"
                  style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"clamp(2.4rem,3.6vw,3.2rem)", color: tk.heroText }}
                >
                  Redefine Your<br />
                  <em style={{ color: tk.golden }}>Aesthetic.</em>
                </h2>
                
                <div className="flex gap-7">
                  {[{ value:"50K+", label:"Members" }, { value:"2K+", label:"Brands" }, { value:"100%", label:"Curated" }].map(s => (
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
            <div className="reg-panel w-full max-w-[430px]">

              {/* Mobile brand mark */}
              <div className="lg:hidden mb-6">
                <span className="text-sm tracking-[0.3em] uppercase" style={{ fontFamily:"'Cormorant Garamond', serif", color: tk.golden }}>
                  Tivyro.
                </span>
              </div>

              {/* Card */}
              <div
                className="relative rounded-lg px-6 py-5"
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
                  className="reg-sheen absolute top-0 left-0 right-0 h-[1px] rounded-t-lg"
                  style={{ background: tk.sheen }}
                />

                {/* Golden glow */}
                <div
                  aria-hidden="true"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-28 pointer-events-none"
                  style={{ background:`radial-gradient(ellipse at center, ${tk.cardGlow} 0%, transparent 70%)` }}
                />

                {/* ── Card Header ── */}
                <div className="mb-1.5 text-center relative z-[1]">
                  {/* <div
                    className="inline-flex items-center justify-center w-9 h-9 rounded-full mb-2"
                    style={{ border:`1px solid ${tk.golden}40`, backgroundColor:`${tk.golden}18` }}
                  >
                    <span className="material-symbols-outlined" style={{ color: tk.golden, fontSize:"17px" }}>person_add</span>
                  </div> */}

                  <p className="text-[10px] font-semibold tracking-[0.2em] uppercase mb-1" style={{ color: tk.golden, fontFamily:"'Geist', sans-serif" }}>
                    Join Tivyro
                  </p>

                  <h1
                    className="font-light leading-[1.15] mb-2"
                    style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"clamp(1.2rem,2.1vw,1.6rem)", color: tk.text }}
                  >
                    Create <em style={{ color: tk.golden , fontWeight:"500" , fontSize:"clamp(1.2rem,2.1vw,1.5rem)" }}>Account</em>
                  </h1>

                  <div className="reg-bar h-[2.5px] rounded-full mx-auto" style={{ backgroundColor: tk.golden }} />
                </div>

                {/* ── Form ── */}
                <form onSubmit={handleSubmit} className="relative z-[1] flex flex-col gap-2.5">

                  {/* Full Name */}
                  <FieldWrap label="Full Name" htmlFor="reg-fullName" tk={tk}>
                    <FieldIcon icon="person" tk={tk} />
                    <input
                      id="reg-fullName" name="fullName" type="text"
                      placeholder="Your full name" required autoComplete="name"
                      value={formData.fullName} onChange={handleChange}
                      style={inputBase} onFocus={onFocus} onBlur={onBlur}
                    />
                  </FieldWrap>

                  {/* Email */}
                  <FieldWrap label="Email Address" htmlFor="reg-email" tk={tk}>
                    <FieldIcon icon="mail" tk={tk} />
                    <input
                      id="reg-email" name="email" type="email"
                      placeholder="name@example.com" required autoComplete="email"
                      value={formData.email} onChange={handleChange}
                      style={inputBase} onFocus={onFocus} onBlur={onBlur}
                    />
                  </FieldWrap>

                  {/* Contact */}
                  <FieldWrap label="Contact Number" htmlFor="reg-contact" tk={tk}>
                    <FieldIcon icon="phone" tk={tk} />
                    <input
                      id="reg-contact" name="contactNumber" type="tel"
                      placeholder="+91 98765 43210" required autoComplete="tel"
                      value={formData.contactNumber} onChange={handleChange}
                      style={inputBase} onFocus={onFocus} onBlur={onBlur}
                    />
                  </FieldWrap>

                  {/* Password */}
                  <FieldWrap label="Password" htmlFor="reg-password" tk={tk}>
                    <FieldIcon icon="lock" tk={tk} />
                    <input
                      id="reg-password" name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password" required autoComplete="new-password"
                      value={formData.password} onChange={handleChange}
                      style={{ ...inputBase, paddingRight: "2.5rem" }}
                      onFocus={onFocus} onBlur={onBlur}
                    />
                    <button
                      type="button" aria-label="Toggle password visibility"
                      onClick={() => setShowPw(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer flex items-center p-0.5 transition-colors duration-200"
                      style={{ color: tk.textSubtle }}
                      onMouseEnter={e => e.currentTarget.style.color = tk.golden}
                      onMouseLeave={e => e.currentTarget.style.color = tk.textSubtle}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize:"17px" }}>
                        {showPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </FieldWrap>

                  {/* Seller toggle */}
                  <div
                    className="flex items-center gap-3 px-13 py-1 rounded-lg"
                    style={{ backgroundColor: tk.sellerRowBg, border:`1px solid ${tk.sellerRowBorder}` }}
                  >
                    <input
                      className="reg-checkbox"
                      id="reg-isSeller" name="isSeller" type="checkbox"
                      checked={formData.isSeller} onChange={handleChange}
                      style={{ border:`1.5px solid ${formData.isSeller ? tk.golden : tk.inputBorder}`, backgroundColor: formData.isSeller ? tk.golden : "transparent" }}
                    />
                    <div>
                      <label htmlFor="reg-isSeller" className="text-sm font-medium cursor-pointer block leading-snug" style={{ color: tk.text, fontFamily:"'Inter', sans-serif" }}>
                        Register as Seller
                      </label>
                      <p className="text-[11px] mt-0.5" style={{ color: tk.textSubtle, fontFamily:"'Geist', sans-serif" }}>
                        List products &amp; manage your store
                      </p>
                    </div>
                  </div>

                  {/* CTA */}
                  <button
                    id="reg-submit"
                    type="submit" disabled={isLoading}
                    className="reg-cta w-full py-2 rounded text-sm font-semibold tracking-[0.08em] uppercase cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-0.5"
                    style={{ backgroundColor: tk.submitBg, color: tk.submitText, border:"none", fontFamily:"'Geist', sans-serif" }}
                    onMouseEnter={e => { if(!isLoading){ e.currentTarget.style.backgroundColor = tk.submitHoverBg; } }}
                    onMouseLeave={e => { if(!isLoading){ e.currentTarget.style.backgroundColor = tk.submitBg; } }}
                  >
                    {isLoading ? (
                      <>
                        <div className="reg-spinner" style={{ border:`2.5px solid ${dark?"rgba(17,17,17,0.25)":"rgba(251,249,246,0.3)"}`, borderTopColor: dark?"#111":"#fbf9f6" }} />
                        Creating account…
                      </>
                    ) : (
                      <>
                        Create Account
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

                  {/* Login link */}
                  <p className="text-center text-sm" style={{ color: tk.textSubtle, fontFamily:"'Inter', sans-serif" }}>
                    Already have an account?{" "}
                    <a
                      href="/login"
                      className="font-medium no-underline transition-opacity duration-200"
                      style={{ color: tk.golden }}
                      onMouseEnter={(e) => { e.target.style.color = tk.golden;}}
                      onMouseLeave={(e) => {e.target.style.opacity = "1"; e.target.style.color = tk.text}}
                    >
                      Sign in
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
              © 2024 Tivyro. All rights reserved.
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

/* ── Micro components ── */
function FieldWrap({ label, htmlFor, tk, children }) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="block mb-1 text-[10px] font-semibold tracking-[0.18em] uppercase"
        style={{ color: tk.textSubtle, fontFamily:"'Geist', sans-serif" }}
      >
        {label}
      </label>
      <div className="relative">{children}</div>
    </div>
  );
}

function FieldIcon({ icon, tk }) {
  return (
    <span
      className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
      style={{ fontSize:"16px", color: tk.textSubtle }}
    >
      {icon}
    </span>
  );
}
