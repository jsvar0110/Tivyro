import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import { useProduct } from "../hooks/useProduct.js"

// ─── Currency Options ───────────────────────────────────────────────────────
const CURRENCIES = [
  { code: "USD", symbol: "$", label: "USD — US Dollar" },
  { code: "EUR", symbol: "€", label: "EUR — Euro" },
  { code: "GBP", symbol: "£", label: "GBP — British Pound" },
  { code: "INR", symbol: "₹", label: "INR — Indian Rupee" },
];

// ─── Field Label ────────────────────────────────────────────────────────────
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

// ─── Image Preview Chip ─────────────────────────────────────────────────────
function ImageChip({ file, onRemove }) {
  const url = URL.createObjectURL(file);
  return (
    <div className="relative group w-16 h-16 rounded flex-shrink-0 overflow-hidden border border-card-border">
      <img src={url} alt={file.name} className="w-full h-full object-cover" />
      <button
        type="button"
        onClick={onRemove}
        className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
        aria-label={`Remove ${file.name}`}
      >
        <span className="material-symbols-outlined text-white" style={{ fontSize: "18px" }}>
          close
        </span>
      </button>
    </div>
  );
}

// ─── Create Product Page ────────────────────────────────────────────────────
export default function CreateProduct() {
  const { handleCreateProduct } = useProduct()
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priceAmount: "",
    priceCurrency: "USD",
  });
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  const fileInputRef = useRef(null);

  // ── Handlers ──
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  const addFiles = useCallback((files) => {
    const valid = Array.from(files).filter((f) =>
      ["image/jpeg", "image/png", "image/webp"].includes(f.type)
    );
    setImages((prev) => [...prev, ...valid].slice(0, 7)); // max 7 images
  }, []);

  function handleFileInput(e) {
    addFiles(e.target.files);
    e.target.value = "";
  }

  function handleDragOver(e) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  }

  function removeImage(index) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {

      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('priceAmount', formData.priceAmount);
      data.append('priceCurrency', formData.priceCurrency);
      images.forEach(img => data.append('images', img));
      await handleCreateProduct(data);

      await new Promise((r) => setTimeout(r, 1200));
      navigate("/");

    } catch (err){

      console.error('Failed to create product', err);

    } finally {
      
      setIsLoading(false);

    }
  };

  const handleSaveDraft = async () => {
    setIsSavingDraft(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
    } finally {
      setIsSavingDraft(false);
    }
  };

  const selectedCurrency = CURRENCIES.find((c) => c.code === formData.priceCurrency);

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">

      {/* ── Animations ── */}
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
        .create-card  { animation: cardReveal 0.55s cubic-bezier(0.22,1,0.36,1) both; }
        .golden-bar   { animation: barExpand 0.7s 0.3s cubic-bezier(0.22,1,0.36,1) both; }
        .hero-panel   { animation: cardReveal 0.6s 0.1s cubic-bezier(0.22,1,0.36,1) both; }
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
        .drop-zone-active {
          border-color: #f5c342 !important;
          background-color: rgba(245,195,66,0.04) !important;
        }
        /* Custom scrollbar */
        .form-scroll::-webkit-scrollbar { width: 4px; }
        .form-scroll::-webkit-scrollbar-track { background: transparent; }
        .form-scroll::-webkit-scrollbar-thumb { background: rgba(245,195,66,0.2); border-radius: 99px; }
        .form-scroll::-webkit-scrollbar-thumb:hover { background: rgba(245,195,66,0.4); }
        /* Select arrow */
        select { appearance: none; -webkit-appearance: none; }
      `}</style>

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

      {/* ── Top Nav ── */}
      <header className="sticky top-0 z-50 bg-background border-b border-card-border px-gutter">
        <div className="max-w-[1280px] mx-auto h-16 flex items-center justify-between">
          <span
            className="font-inter text-[22px] font-bold tracking-[-0.03em] text-golden cursor-pointer"
            onClick={() => navigate("/")}
          >
            Tivyro
          </span>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 font-geist text-sm font-medium tracking-[0.04em] text-on-surface-variant transition-colors duration-200 hover:text-golden bg-transparent border-none cursor-pointer"
          >
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
              arrow_back
            </span>
            Back
          </button>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="flex-1 flex overflow-hidden relative z-10 min-h-0">

        {/* ── Left: Hero Panel ── */}
        <div className="hidden lg:flex flex-1 relative items-center hero-panel">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1974&auto=format&fit=crop"
              alt="Premium Fashion"
              className="w-full h-full object-cover opacity-40 mix-blend-luminosity"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/10 to-background" />
          </div>

          <div className="relative z-10 max-w-xl px-16 text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-golden/30 bg-golden/10 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-golden animate-pulse" />
              <span className="font-geist text-xs font-semibold tracking-[0.2em] text-golden uppercase">
                Seller Studio
              </span>
            </div>

            <h2 className="font-inter text-5xl md:text-6xl font-bold tracking-tight text-on-background mb-6 leading-[1.1]">
              List Your{" "}
              <span className="text-golden italic font-serif pr-2">Item.</span>
            </h2>



            {/* Steps */}
            <div className="mt-10 space-y-4">
              {[
                { icon: "edit_note", step: "01", label: "Describe your product" },
                { icon: "sell", step: "02", label: "Set your price" },
                { icon: "photo_camera", step: "03", label: "Upload stunning photos" },
              ].map((s) => (
                <div key={s.step} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full border border-golden/25 bg-golden/10 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-golden" style={{ fontSize: "16px" }}>
                      {s.icon}
                    </span>
                  </div>
                  <div>
                    <p className="font-geist text-[12px] text-golden/60 tracking-[0.2em] uppercase">{s.step}</p>
                    <p className="font-inter text-[16px] text-on-surface-variant whitespace-nowrap">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right: Form Panel ── */}
        <div className="w-full lg:w-1/2 flex flex-col items-start justify-center py-2 px-gutter overflow-y-auto form-scroll z-10">
          <div className="create-card w-full max-w-[480px] mx-auto bg-card border border-card-border rounded-lg px-5 py-3 relative shadow-[0_32px_64px_rgba(0,0,0,0.65),0_0_0_1px_var(--color-card-border)]">

            {/* Sheen top line */}
            <div aria-hidden="true" className="absolute top-0 left-0 right-0 h-[1px] card-sheen rounded-t-lg" />

            {/* Ambient glow */}
            <div
              aria-hidden="true"
              className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-32 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at center, rgba(245,195,66,0.09) 0%, transparent 70%)",
              }}
            />

            {/* ── Card Header ── */}
            <div className="mb-3 text-center relative z-[1]">
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-golden/25 bg-golden/10 mb-2">
                <span className="material-symbols-outlined text-golden" style={{ fontSize: "17px" }}>
                  add_box
                </span>
              </div>
              <h1 className="font-inter text-[19px] font-semibold leading-[1.2] tracking-[-0.02em] text-on-background mb-1">
                New Listing
              </h1>
              <div className="golden-bar h-[2px] bg-golden rounded-full mx-auto" />
            </div>

            {/* ── Form ── */}
            <form onSubmit={handleSubmit} className="relative z-[1] space-y-2">

              {/* Title */}
              <div>
                <Label htmlFor="title">Product Title</Label>
                <div className="relative">
                  <span
                    className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 pointer-events-none"
                    style={{ fontSize: "18px" }}
                  >
                    title
                  </span>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    placeholder="e.g. Vintage Leather Jacket"
                    required
                    autoComplete="off"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full bg-input-bg border border-input-border text-on-surface font-inter text-base leading-[1.6] pl-10 pr-md py-sm rounded outline-none transition-[border-color,box-shadow] duration-250 ease-in-out placeholder:text-on-surface-variant/50 focus:border-golden focus:shadow-[0_0_0_3px_var(--color-golden-glow)]"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description</Label>
                <div className="relative">
                  <span
                    className="material-symbols-outlined absolute left-3 top-3.5 text-on-surface-variant/50 pointer-events-none"
                    style={{ fontSize: "18px" }}
                  >
                    notes
                  </span>
                  <textarea
                    id="description"
                    name="description"
                    rows={2}
                    placeholder="Describe your product — material, condition, sizing…"
                    required
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full bg-input-bg border border-input-border text-on-surface font-inter text-sm leading-[1.6] pl-10 pr-md py-sm rounded outline-none transition-[border-color,box-shadow] duration-250 ease-in-out placeholder:text-on-surface-variant/50 focus:border-golden focus:shadow-[0_0_0_3px_var(--color-golden-glow)] resize-none"
                  />
                </div>
              </div>

              {/* Price Row */}
              <div className="grid grid-cols-2 gap-md">

                {/* Amount */}
                <div>
                  <Label htmlFor="priceAmount">Amount</Label>
                  <div className="relative">
                    <span
                      className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 pointer-events-none"
                      style={{ fontSize: "18px" }}
                    >
                      payments
                    </span>
                    {/* Currency Symbol Badge */}
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 font-geist text-xs text-golden/60 pointer-events-none">
                      {selectedCurrency?.symbol}
                    </span>
                    <input
                      id="priceAmount"
                      name="priceAmount"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      required
                      value={formData.priceAmount}
                      onChange={handleChange}
                      className="w-full bg-input-bg border border-input-border text-on-surface font-inter text-base leading-[1.6] pl-10 pr-8 py-sm rounded outline-none transition-[border-color,box-shadow] duration-250 ease-in-out placeholder:text-on-surface-variant/50 focus:border-golden focus:shadow-[0_0_0_3px_var(--color-golden-glow)] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                </div>

                {/* Currency */}
                <div>
                  <Label htmlFor="priceCurrency">Currency</Label>
                  <div className="relative">
                    <span
                      className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 pointer-events-none"
                      style={{ fontSize: "18px" }}
                    >
                      currency_exchange
                    </span>
                    <select
                      id="priceCurrency"
                      name="priceCurrency"
                      value={formData.priceCurrency}
                      onChange={handleChange}
                      className="w-full bg-input-bg border border-input-border text-on-surface font-inter text-base leading-[1.6] pl-10 pr-8 py-sm rounded outline-none transition-[border-color,box-shadow] duration-250 ease-in-out focus:border-golden focus:shadow-[0_0_0_3px_var(--color-golden-glow)] cursor-pointer"
                    >
                      {CURRENCIES.map((c) => (
                        <option key={c.code} value={c.code} className="bg-card text-on-surface">
                          {c.label}
                        </option>
                      ))}
                    </select>
                    {/* Custom chevron */}
                    <span
                      className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 pointer-events-none"
                      style={{ fontSize: "16px" }}
                    >
                      expand_more
                    </span>
                  </div>
                </div>
              </div>

              {/* Images Upload */}
              <div>
                <Label htmlFor="images">Product Images</Label>

                {/* Drop Zone */}
                <div
                  role="button"
                  tabIndex={0}
                  aria-label="Upload product images"
                  onClick={() => fileInputRef.current?.click()}
                  onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative mt-1 rounded border-2 border-dashed transition-all duration-200 cursor-pointer group ${isDragging
                    ? "border-golden bg-golden/[0.04] drop-zone-active"
                    : "border-input-border hover:border-golden/50 hover:bg-golden/[0.02]"
                    }`}
                  style={{ padding: "10px 14px" }}
                >
                  <div className="flex items-center gap-3 pointer-events-none">
                    <div
                      className={`w-8 h-8 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors duration-200 ${isDragging ? "border-golden bg-golden/20" : "border-input-border bg-input-bg group-hover:border-golden/40"
                        }`}
                    >
                      <span
                        className={`material-symbols-outlined transition-colors duration-200 ${isDragging ? "text-golden" : "text-on-surface-variant/50 group-hover:text-golden/70"}`}
                        style={{ fontSize: "18px" }}
                      >
                        cloud_upload
                      </span>
                    </div>
                    <div>
                      <p className="font-inter text-sm text-on-surface">
                        <span className="text-golden font-medium">Click to upload</span>{" "}
                        or drag &amp; drop
                      </p>
                      <p className="font-geist text-[10px] tracking-[0.05em] text-on-surface-variant/50 mt-0.5 uppercase">
                        JPG · PNG · WEBP · Max 7 images
                      </p>
                    </div>
                  </div>

                  <input
                    ref={fileInputRef}
                    id="images"
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileInput}
                    className="sr-only"
                  />
                </div>

                {/* Previews */}
                {images.length > 0 && (
                  <div className="mt-sm flex flex-wrap gap-2">
                    {images.map((file, i) => (
                      <ImageChip key={`${file.name}-${i}`} file={file} onRemove={() => removeImage(i)} />
                    ))}
                    {/* Slot counter */}
                    {images.length < 7 && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-16 h-16 rounded border-2 border-dashed border-input-border hover:border-golden/50 flex items-center justify-center text-on-surface-variant/40 hover:text-golden/70 transition-colors duration-200 cursor-pointer bg-transparent"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>add</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="h-px bg-card-border" />

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading || isSavingDraft}
                className="w-full bg-golden text-[#111111] border-none px-md py-sm rounded font-geist text-sm font-medium tracking-[0.08em] uppercase cursor-pointer flex items-center justify-center gap-xs transition-[box-shadow,transform,opacity] duration-250 ease-in-out hover:shadow-[0_0_24px_var(--color-golden-hover-glow)] hover:-translate-y-px active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="spinner" />
                    Publishing&hellip;
                  </>
                ) : (
                  <>
                    Publish Listing
                    <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                      arrow_forward
                    </span>
                  </>
                )}
              </button>

              {/* Save Draft */}
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={isLoading || isSavingDraft}
                className="w-full bg-transparent border border-card-border text-on-surface-variant px-md py-sm rounded font-geist text-sm font-medium tracking-[0.08em] uppercase cursor-pointer flex items-center justify-center gap-xs transition-[border-color,color,opacity] duration-250 ease-in-out hover:border-golden/40 hover:text-on-surface disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSavingDraft ? (
                  <>
                    <div
                      className="spinner"
                      style={{ borderColor: "rgba(210,197,174,0.3)", borderTopColor: "#d2c5ae" }}
                    />
                    Saving&hellip;
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                      save
                    </span>
                    Save as Draft
                  </>
                )}
              </button>

            </form>
          </div>
        </div>
      </main>


    </div>
  );
}
