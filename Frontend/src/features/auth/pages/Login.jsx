import { useState } from "react";
import { useAuth } from "../hook/useAuth";
import { useNavigate } from "react-router";

// ─── Field Label ───────────────────────────────────────────────────────────────
function Label({ htmlFor, children }) {
  return (
    <label
      htmlFor={htmlFor}
      className="block mb-xs font-geist text-[13px] font-medium tracking-[0.07em] uppercase text-on-background/75"
    >
      {children}
    </label>
  );
}

// ─── Login Page ────────────────────────────────────────────────────────────────
export default function Login() {
  const { handleLogin } = useAuth();
  const navigate = useNavigate();

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

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* ── Ambient orbs ── */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          style={{
            position: "absolute",
            top: "-15%",
            right: "-10%",
            width: "55vw",
            height: "55vw",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(245,195,66,0.07) 0%, transparent 70%)",
            filter: "blur(40px)",
            animation: "orbFloat 8s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-20%",
            left: "-10%",
            width: "45vw",
            height: "45vw",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(245,195,66,0.045) 0%, transparent 70%)",
            filter: "blur(50px)",
            animation: "orbFloat 11s ease-in-out infinite reverse",
          }}
        />
      </div>

      <style>{`
        @keyframes orbFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          50%       { transform: translateY(-30px) scale(1.04); }
        }
        @keyframes cardReveal {
          from { opacity: 0; transform: translateY(28px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }
        @keyframes barExpand {
          from { width: 0; }
          to   { width: 2.5rem; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes sheen {
          0%   { background-position: -200% center; }
          100% { background-position: 300% center; }
        }
        .login-card  { animation: cardReveal 0.55s cubic-bezier(0.22,1,0.36,1) both; }
        .golden-bar  { animation: barExpand 0.7s 0.3s cubic-bezier(0.22,1,0.36,1) both; }
        .hero-panel  { animation: cardReveal 0.6s 0.1s cubic-bezier(0.22,1,0.36,1) both; }
        .spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(17,17,17,0.3);
          border-top-color: #111111;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          flex-shrink: 0;
        }
        .card-sheen {
          background: linear-gradient(90deg,
            transparent 0%,
            rgba(245,195,66,0.35) 40%,
            rgba(245,195,66,0.6)  50%,
            rgba(245,195,66,0.35) 60%,
            transparent 100%);
          background-size: 200% auto;
          animation: sheen 4s linear infinite;
        }
      `}</style>

      {/* ── Top Nav ── */}
      <header className="sticky top-0 z-50 bg-background border-b border-card-border px-gutter">
        <div className="max-w-[1280px] mx-auto h-16 flex items-center justify-between">
          <span className="font-inter text-[22px] font-bold tracking-[-0.03em] text-golden cursor-pointer">
            Tivyro
          </span>
          <a
            href="/register"
            className="font-geist font-medium tracking-[0.04em] text-on-surface-variant no-underline transition-colors duration-200 hover:text-golden"
          >
            Register
          </a>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="flex-1 flex overflow-hidden relative z-10">

        {/* ── Left Side: Hero Panel ── */}
        <div className="hidden lg:flex flex-1 relative items-center hero-panel">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1974&auto=format&fit=crop"
              alt="Premium Fashion"
              className="w-full h-full object-cover opacity-45 mix-blend-luminosity"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/10 to-background" />
          </div>

          <div className="relative z-10 max-w-xl px-16 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-golden/30 bg-golden/10 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-golden animate-pulse" />
              <span className="font-geist text-xs font-semibold tracking-[0.2em] text-golden uppercase">
                Members Only
              </span>
            </div>

            <h2 className="font-inter text-5xl md:text-6xl font-bold tracking-tight text-on-background mb-6 leading-[1.1]">
              Welcome{" "}
              <span className="text-golden italic font-serif pr-2">Back.</span>
            </h2>

            <p className="font-geist text-[15px] text-on-surface-variant leading-relaxed max-w-sm">
              
            </p>

            {/* Stats */}
            <div className="mt-10 flex gap-8">
              {[
                { value: "50K+", label: "Members" },
                { value: "2K+",  label: "Brands" },
                { value: "100%", label: "Premium" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="font-inter text-2xl font-bold text-golden">{s.value}</p>
                  <p className="font-geist text-xs text-on-surface-variant tracking-[0.1em] uppercase mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right Side: Form ── */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center py-sm px-gutter overflow-y-auto z-10">
          <div className="login-card left-5 w-full max-w-[460px] bg-card border border-card-border rounded-lg px-6 py-7 relative shadow-[0_32px_64px_rgba(0,0,0,0.65),0_0_0_1px_var(--color-card-border)] shrink-0 my-auto">

            {/* Sheen line at top of card */}
            <div aria-hidden="true" className="absolute top-0 left-0 right-0 h-[1px] card-sheen rounded-t-lg" />

            {/* Golden atmospheric glow */}
            <div
              aria-hidden="true"
              className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-32 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at center, rgba(245,195,66,0.09) 0%, transparent 70%)",
              }}
            />

            {/* ── Card Header ── */}
            <div className="mb-6 text-center relative z-[1]">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-golden/25 bg-golden/10 mb-4">
                <span className="material-symbols-outlined text-golden" style={{ fontSize: "22px" }}>
                  lock_open
                </span>
              </div>

              <h1 className="font-inter text-[28px] font-semibold leading-[1.2] tracking-[-0.02em] text-on-background mb-2">
                Sign In
              </h1>

              <div className="golden-bar h-[3px] bg-golden rounded-full mx-auto mb-3" />

              <p className="font-inter text-[14px] text-on-surface-variant">
                Access your premium account.
              </p>
            </div>

            {/* ── Form ── */}
            <form onSubmit={handleSubmit} className="relative z-[1]">

              {/* Email */}
              <div className="mb-sm">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <span
                    className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 pointer-events-none"
                    style={{ fontSize: "18px" }}
                  >
                    mail
                  </span>
                  <input
                    className="w-full bg-input-bg border border-input-border text-on-surface font-inter text-base leading-[1.6] pl-10 pr-md py-sm rounded outline-none transition-[border-color,box-shadow] duration-250 ease-in-out placeholder:text-on-surface-variant/50 focus:border-golden focus:shadow-[0_0_0_3px_var(--color-golden-glow)]"
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    required
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-xs">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="/forgot-password"
                    className="font-geist text-[12px] text-golden/80 no-underline hover:text-golden transition-colors duration-200"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <span
                    className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 pointer-events-none"
                    style={{ fontSize: "18px" }}
                  >
                    lock
                  </span>
                  <input
                    className="w-full bg-input-bg border border-input-border text-on-surface font-inter text-base leading-[1.6] pl-10 pr-12 py-sm rounded outline-none transition-[border-color,box-shadow] duration-250 ease-in-out placeholder:text-on-surface-variant/50 focus:border-golden focus:shadow-[0_0_0_3px_var(--color-golden-glow)]"
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    aria-label="Toggle password visibility"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-on-surface-variant flex items-center p-1 transition-colors duration-200 hover:text-golden"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                className="w-full bg-golden text-[#111111] border-none px-md py-sm rounded font-geist text-sm font-medium tracking-[0.08em] uppercase cursor-pointer flex items-center justify-center gap-xs transition-[box-shadow,transform,opacity] duration-250 ease-in-out hover:shadow-[0_0_24px_var(--color-golden-hover-glow)] hover:-translate-y-px active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="spinner" />
                    Signing in&hellip;
                  </>
                ) : (
                  <>
                    Sign In
                    <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                      arrow_forward
                    </span>
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-card-border" />
                <span className="font-geist text-[12px] text-on-surface-variant/50 tracking-[0.08em] uppercase">or</span>
                <div className="flex-1 h-px bg-card-border" />
              </div>

              {/* Register redirect */}
              <div className="text-center">
                <p className="font-inter text-sm text-on-surface-variant">
                  Don&apos;t have an account?{" "}
                  <a
                    href="/register"
                    className="text-golden no-underline font-medium transition-colors duration-200 hover:text-primary-fixed"
                  >
                    Create one
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="py-sm px-gutter border-t border-card-border bg-background relative z-10">
        <div className="max-w-[1280px] mx-auto flex flex-row justify-between items-center flex-wrap gap-md">
          <span className="font-geist text-[13px] font-medium text-golden/70">
            &copy; 2024 Snitch. All rights reserved.
          </span>
          <nav className="flex gap-md">
            {["Privacy Policy", "Terms of Service", "Help Center"].map((link) => (
              <a
                key={link}
                href="#"
                className="font-geist text-[13px] font-medium tracking-[0.03em] text-on-surface-variant no-underline opacity-75 transition-[color,opacity] duration-200 hover:text-golden hover:opacity-100"
              >
                {link}
              </a>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}
