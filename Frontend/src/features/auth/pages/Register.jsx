import { useState } from "react";
import { useAuth } from "../hook/useAuth"
import { Link, useNavigate } from "react-router"
import ContinueWithGoogle from "../components/ContinueWithGoogle";

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

// ─── Register Page ─────────────────────────────────────────────────────────────
export default function Register() {

  const { handleRegister } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
    password: "",
    isSeller: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleRegister({
      email: formData.email,
      contact: formData.contactNumber,
      password: formData.password,
      isSeller: formData.isSeller,
      fullname: formData.fullName
    })

    navigate("/")
  }

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* ── Top Nav ── */}
      <header className="sticky top-0 z-50 bg-background border-b border-card-border px-gutter">
        <div className="max-w-[1280px] mx-auto h-16 flex items-center justify-between">
          {/* Brand */}
          <span className="font-inter text-[22px] font-bold tracking-[-0.03em] text-golden cursor-pointer">
            Tivyro
          </span>

          {/* Login link */}
          <a
            href="/login"
            className="font-geist  font-medium tracking-[0.04em] text-on-surface-variant no-underline transition-colors duration-200 hover:text-golden"
          >
            Login
          </a>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="flex-1 flex overflow-hidden">
        {/* ── Left Side: Image & Text ── */}
        <div className="hidden lg:flex flex-1 relative items-center">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop"
              alt="Premium Fashion"
              className="w-full h-full object-cover opacity-50 mix-blend-luminosity"
            />
            {/* Gradient Overlays for dark theme blending */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/10 to-background" />
          </div>

          {/* Text Content */}
          <div className="relative z-10 max-w-xl px-16 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-golden/30 bg-golden/10 backdrop-blur-md">
              {/* <span className="w-1.5 h-1.5 rounded-full bg-golden animate-pulse" /> */}
              {/* <span className="font-geist text-xs font-semibold tracking-[0.2em] text-golden uppercase">
                New Collection
              </span> */}
            </div>
            <h2 className="font-inter text-5xl md:text-6xl font-bold tracking-tight text-on-background mb-6 leading-[1.1]">
              Redefine Your <br />
              <span className="text-golden italic font-serif pr-2">Aesthetic.</span>
            </h2>
            {/* <p className="font-geist text-lg text-on-surface-variant leading-relaxed max-w-md">
              Step into the world of premium fashion. Create an account to access curated collections, exclusive drops, and personalized style recommendations.
            </p> */}
          </div>
        </div>

        {/* ── Right Side: Form ── */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center py-sm px-gutter overflow-y-auto z-10">
          {/* Card */}
          <div className="w-full max-w-[450px] left-3 bg-card border border-card-border rounded-lg px-5 py-4 relative shadow-[0_32px_64px_rgba(0,0,0,0.6),0_0_0_1px_var(--color-card-border)] shrink-0 my-auto">
            {/* Atmospheric golden glow at top of card */}
            <div
              aria-hidden="true"
              className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-[radial-gradient(ellipse_at_center,rgba(245,195,66,0.06)_0%,transparent_70%)] pointer-events-none"
            />

            {/* ── Card Header ── */}
            <div className="mb-3 text-center relative z-[1]">
              <h1 className="font-inter text-[22px] font-semibold leading-[1.2] tracking-[-0.02em] text-on-background mb-1">
                Create Account
              </h1>
              <div className="h-[2px] w-8 bg-golden rounded-full mx-auto mb-1" />
              <p className="font-inter text-[13px] text-on-surface-variant">
                Join our premium marketplace.
              </p>
            </div>

            {/* ── Form ── */}
            <form onSubmit={handleSubmit} className="relative z-[1]">
              {/* Full Name */}
              <div className="mb-[10px]">
                <Label htmlFor="fullName">Full Name</Label>
                <input
                  className="w-full bg-input-bg border border-input-border text-on-surface font-inter text-sm leading-[1.5] px-3 py-[7px] rounded outline-none transition-[border-color,box-shadow] duration-250 ease-in-out placeholder:text-on-surface-variant/50 focus:border-golden focus:shadow-[0_0_0_3px_var(--color-golden-glow)]"
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  required
                  autoComplete="name"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>

              {/* Email */}
              <div className="mb-[10px]">
                <Label htmlFor="email">Email Address</Label>
                <input
                  className="w-full bg-input-bg border border-input-border text-on-surface font-inter text-sm leading-[1.5] px-3 py-[7px] rounded outline-none transition-[border-color,box-shadow] duration-250 ease-in-out placeholder:text-on-surface-variant/50 focus:border-golden focus:shadow-[0_0_0_3px_var(--color-golden-glow)]"
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

              {/* Contact Number */}
              <div className="mb-[10px]">
                <Label htmlFor="contactNumber">Contact Number</Label>
                <input
                  className="w-full bg-input-bg border border-input-border text-on-surface font-inter text-sm leading-[1.5] px-3 py-[7px] rounded outline-none transition-[border-color,box-shadow] duration-250 ease-in-out placeholder:text-on-surface-variant/50 focus:border-golden focus:shadow-[0_0_0_3px_var(--color-golden-glow)]"
                  id="contactNumber"
                  name="contactNumber"
                  type="tel"
                  placeholder="+91 98765 43210"
                  required
                  autoComplete="tel"
                  value={formData.contactNumber}
                  onChange={handleChange}
                />
              </div>

              {/* Password */}
              <div className="mb-[10px]">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <input
                    className="w-full bg-input-bg border border-input-border text-on-surface font-inter text-sm leading-[1.5] px-3 py-[7px] pr-10 rounded outline-none transition-[border-color,box-shadow] duration-250 ease-in-out placeholder:text-on-surface-variant/50 focus:border-golden focus:shadow-[0_0_0_3px_var(--color-golden-glow)]"
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    required
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    aria-label="Toggle password visibility"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-on-surface-variant flex items-center p-1 transition-colors duration-200 hover:text-golden"
                  >
                    <span className="material-symbols-outlined">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              {/* isSeller Checkbox */}
              <div className="flex items-center gap-2 py-[4px] pb-[4px]">
                <input
                  className="appearance-none bg-input-bg m-0 w-[18px] h-[18px] border border-input-border rounded-[3px] grid place-content-center cursor-pointer shrink-0 transition-[border-color,box-shadow] duration-200 ease-in-out checked:border-golden focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[color-mix(in_srgb,var(--color-golden)_50%,transparent)] before:content-[''] before:block before:w-[10px] before:h-[10px] before:scale-0 before:transition-transform before:duration-[120ms] before:ease-in-out before:bg-golden before:[clip-path:polygon(14%_44%,0_65%,50%_100%,100%_16%,80%_0%,43%_62%)] checked:before:scale-100"
                  id="isSeller"
                  name="isSeller"
                  type="checkbox"
                  checked={formData.isSeller}
                  onChange={handleChange}
                />
                <label
                  htmlFor="isSeller"
                  className="font-inter text-[15px] text-on-surface-variant cursor-pointer transition-colors duration-200 select-none hover:text-on-background"
                >
                  Register as Seller
                </label>
              </div>


              {/* Submit */}
              <button
                className="w-full bg-golden text-[#111111] border-none px-md py-[8px] rounded font-geist text-sm font-medium tracking-[0.08em] uppercase cursor-pointer flex items-center justify-center gap-xs transition-[box-shadow,transform] duration-250 ease-in-out hover:shadow-[0_0_20px_var(--color-golden-hover-glow)] hover:-translate-y-px active:translate-y-0"
                type="submit"
              >
                Register
                <span className="material-symbols-outlined text-[18px]">
                  arrow_forward
                </span>
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-2">
                <div className="flex-1 h-px bg-card-border" />
                <span className="font-geist text-[12px] text-on-surface-variant/50 tracking-[0.08em] uppercase">or</span>
                <div className="flex-1 h-px bg-card-border" />
              </div>

              {/* Google Sign-In */}
              <ContinueWithGoogle />

              {/* Login redirect */}
              <div className="text-center mt-2 pt-2 border-t border-card-border">
                <p className="font-inter text-sm text-on-surface-variant">
                  Already have an account?{" "}
                  <a
                    href="/login"
                    className="text-golden no-underline font-medium transition-colors duration-200 hover:text-primary-fixed"
                  >
                    Login here
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="py-sm px-gutter border-t border-card-border bg-background">
        <div className="max-w-[1280px] mx-auto flex flex-row justify-between items-center flex-wrap gap-md">
          <span className="font-geist text-[13px] font-medium text-golden/70">
            © 2024 Snitch. All rights reserved.
          </span>

          <nav className="flex gap-md">
            {["Privacy Policy", "Terms of Service", "Help Center"].map(
              (link) => (
                <a
                  key={link}
                  href="#"
                  className="font-geist text-[13px] font-medium tracking-[0.03em] text-on-surface-variant no-underline opacity-75 transition-[color,opacity] duration-200 hover:text-golden hover:opacity-100"
                >
                  {link}
                </a>
              )
            )}
          </nav>
        </div>
      </footer>
    </div>
  );
}