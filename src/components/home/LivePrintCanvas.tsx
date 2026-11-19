"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Shirt,
  Coffee,
  Briefcase,
  Package,
  Download,
  Send,
  ShoppingBag,
  Upload,
  RefreshCw,
  Award,
  Check,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { getWhatsAppLink } from "@/lib/constants";
import { useSiteSettings } from "@/lib/useSiteSettings";

type ProductType = "tshirt" | "mug" | "card" | "box";

interface ProductConfig {
  id: ProductType;
  label: string;
  icon: React.ElementType;
  defaultPrice: number;
  minQty: number;
  stockDesc: string;
}

const products: ProductConfig[] = [
  {
    id: "tshirt",
    label: "Apparel",
    icon: Shirt,
    defaultPrice: 18500,
    minQty: 5,
    stockDesc: "420gsm Brushed Fleece Cotton",
  },
  {
    id: "mug",
    label: "Drinkware",
    icon: Coffee,
    defaultPrice: 3000,
    minQty: 12,
    stockDesc: "Grade AAA Glazed Ceramic",
  },
  {
    id: "card",
    label: "Business Card",
    icon: Briefcase,
    defaultPrice: 5000,
    minQty: 100,
    stockDesc: "600gsm Cotton Foil Board",
  },
  {
    id: "box",
    label: "Rigid Box",
    icon: Package,
    defaultPrice: 25000,
    minQty: 25,
    stockDesc: "1200gsm Magnetic Greyboard",
  },
];

const bodyColors = [
  { name: "Jet Black", hex: "#18181b", isDark: true },
  { name: "Crisp White", hex: "#f8fafc", isDark: false },
  { name: "Royal Navy", hex: "#0f172a", isDark: true },
  { name: "Olive Sage", hex: "#3f4d38", isDark: true },
  { name: "Heather Grey", hex: "#94a3b8", isDark: false },
];

const imprintColors = [
  { name: "Metallic Gold", hex: "#d4af37", isFoil: true },
  { name: "Chalk White", hex: "#ffffff", isFoil: false },
  { name: "Jet Black", hex: "#0f172a", isFoil: false },
  { name: "Glacier Blue", hex: "#0284c7", isFoil: false },
  { name: "Flame Orange", hex: "#ea580c", isFoil: false },
];

export function LivePrintCanvas() {
  const [activeProduct, setActiveProduct] = useState<ProductType>("tshirt");
  const [brandName, setBrandName] = useState("APEX STUDIO");
  const [tagline, setTagline] = useState("TURNING IDEAS INTO IMPRESSIONS");
  const [selectedBodyColor, setSelectedBodyColor] = useState(bodyColors[0]);
  const [selectedImprintColor, setSelectedImprintColor] = useState(imprintColors[0]);
  const [uploadedLogo, setUploadedLogo] = useState<string | null>(null);
  const [r2LogoUrl, setR2LogoUrl] = useState<string | null>(null);

  // 3D Spatial Tilt state
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isExporting, setIsExporting] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addItem, setIsCartOpen } = useCart();
  const settings = useSiteSettings();

  const dynamicProducts: ProductConfig[] = products.map((baseProd) => {
    const dbMatch = settings?.studioItems?.find((s: any) => s.id === baseProd.id);
    if (!dbMatch) return baseProd;
    return {
      ...baseProd,
      label: dbMatch.label || baseProd.label,
      defaultPrice:
        typeof dbMatch.price === "number" ? dbMatch.price : baseProd.defaultPrice,
      minQty: typeof dbMatch.minQty === "number" ? dbMatch.minQty : baseProd.minQty,
      stockDesc: dbMatch.stockDesc || baseProd.stockDesc,
    };
  });

  const currentProduct =
    dynamicProducts.find((p) => p.id === activeProduct) || dynamicProducts[0];

  // Handle subtle 3D spatial tilt on mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateY = ((x - centerX) / centerX) * 5; // max ±5deg
    const rotateX = -((y - centerY) / centerY) * 5;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedLogo(event.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Upload logo directly to Cloudflare R2
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "client-logos");
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (data.success && data.url) {
          setR2LogoUrl(data.url);
        }
      } catch (err) {
        console.error("Failed to upload client logo to Cloudflare R2:", err);
      }
    }
  };

  // Export current mockup canvas to high-res PNG
  const handleDownloadSnapshot = () => {
    setIsExporting(true);
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 900;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setIsExporting(false);
      return;
    }

    // Background fill
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, 1200, 900);

    // Subtle studio vignette
    const grad = ctx.createRadialGradient(600, 450, 200, 600, 450, 600);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(1, "rgba(226,232,240,0.8)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1200, 900);

    // Product drop shadow
    ctx.shadowColor = "rgba(15, 23, 42, 0.18)";
    ctx.shadowBlur = 40;
    ctx.shadowOffsetY = 25;

    // Render Product Base Shape
    ctx.fillStyle = selectedBodyColor.hex;
    if (activeProduct === "tshirt") {
      // Draw stylized t-shirt silhouette
      ctx.beginPath();
      ctx.roundRect(320, 220, 560, 520, 32);
      ctx.fill();
    } else if (activeProduct === "mug") {
      // Mug body
      ctx.beginPath();
      ctx.roundRect(400, 240, 400, 480, 24);
      ctx.fill();
      // Mug handle
      ctx.lineWidth = 40;
      ctx.strokeStyle = selectedBodyColor.hex;
      ctx.beginPath();
      ctx.arc(800, 480, 80, -Math.PI / 2, Math.PI / 2);
      ctx.stroke();
    } else if (activeProduct === "card") {
      // Business card with curved corners
      ctx.beginPath();
      ctx.roundRect(300, 280, 600, 360, 28);
      ctx.fill();
    } else {
      // Rigid box lid
      ctx.beginPath();
      ctx.roundRect(320, 260, 560, 420, 24);
      ctx.fill();
    }

    // Reset shadow
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    // Render Imprint / Brand Details
    ctx.fillStyle = selectedImprintColor.hex;
    ctx.textAlign = "center";

    // Draw Brand Name
    ctx.font = "900 44px 'Plus Jakarta Sans', system-ui, sans-serif";
    ctx.fillText(brandName || "ICEBERG STUDIO", 600, 450);

    // Draw Tagline
    if (tagline) {
      ctx.font = "600 18px 'Plus Jakarta Sans', system-ui, sans-serif";
      ctx.fillText(tagline.toUpperCase(), 600, 490);
    }

    // Branding Watermark & Metadata
    ctx.fillStyle = "#64748b";
    ctx.font = "500 16px 'Plus Jakarta Sans', system-ui, sans-serif";
    ctx.fillText(
      `Iceberg Creative Print Studio — ${currentProduct.label} Proof Preview · ${selectedBodyColor.name} / ${selectedImprintColor.name}`,
      600,
      840
    );

    // Trigger download
    const link = document.createElement("a");
    link.download = `iceberg-mockup-${activeProduct}-${(brandName || "proof")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    setIsExporting(false);
  };

  const handleOrderWhatsApp = () => {
    let msg = `*LIVE MOCKUP STUDIO ORDER — ICEBERG STUDIO*\n\n`;
    msg += `🏢 *Brand / Client:* ${brandName || "Custom Order"}\n`;
    if (tagline) msg += `💬 *Tagline:* ${tagline}\n`;
    msg += `📦 *Product:* ${currentProduct.label} (${currentProduct.stockDesc})\n`;
    msg += `🎨 *Product Color:* ${selectedBodyColor.name}\n`;
    msg += `✨ *Print/Foil Finish:* ${selectedImprintColor.name}\n`;
    msg += `🔢 *Starting Run:* ${currentProduct.minQty} pcs\n`;
    msg += `💰 *Base Estimate:* ₦${currentProduct.defaultPrice.toLocaleString()}\n`;
    if (r2LogoUrl) msg += `📎 *Uploaded Logo Proof:* ${r2LogoUrl}\n`;
    msg += `\nHello Iceberg Studio team, I generated this mockup on your website and would like to proceed with production!`;

    window.open(getWhatsAppLink(msg), "_blank");
  };

  const handleAddToCart = () => {
    addItem({
      productId: `mockup-${activeProduct}`,
      title: `${brandName || "Custom"} ${currentProduct.label}`,
      category: currentProduct.label,
      quantity: currentProduct.minQty,
      unitPrice: Math.round(currentProduct.defaultPrice / currentProduct.minQty),
      paperStock: `${currentProduct.stockDesc} (${selectedBodyColor.name})`,
      finish: `${selectedImprintColor.name} Imprint`,
      customNotes: `Brand: "${brandName}", Slogan: "${tagline}"${r2LogoUrl ? ` | Logo Proof: ${r2LogoUrl}` : ""}`,
    });
    setIsCartOpen(true);
  };

  return (
    <div className="bg-card rounded-card border border-border/80 shadow-elevation overflow-hidden antigravity-card">
      {/* Product Category Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-border/60 bg-canvas-soft/70 p-1.5 gap-1.5">
        {dynamicProducts.map((p) => {
          const Icon = p.icon;
          const isActive = activeProduct === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setActiveProduct(p.id)}
              className={`min-h-[44px] px-3 py-2 rounded-button flex items-center justify-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? "bg-card text-ink shadow-soft border border-border/60"
                  : "text-ink-muted hover:text-ink hover:bg-canvas-soft"
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-primary" : "text-ink-muted"}`} />
              <span className="truncate">{p.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main 3D Interactive Canvas Stage */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative h-[290px] sm:h-[340px] w-full bg-gradient-to-b from-canvas-soft to-border/30 flex items-center justify-center p-6 overflow-hidden select-none"
        style={{ perspective: "1000px" }}
      >
        {/* Spatial Floating Product Container */}
        <div
          className="relative transition-transform duration-150 ease-out flex items-center justify-center"
          style={{
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          }}
        >
          {/* Mockup Product 1: T-Shirt / Hoodie */}
          {activeProduct === "tshirt" && (
            <div className="relative w-64 sm:w-76 h-56 sm:h-64 flex items-center justify-center filter drop-shadow-xl">
              {/* T-Shirt Vector Shape with Dynamic Color */}
              <svg viewBox="0 0 400 340" className="w-full h-full">
                <defs>
                  <filter id="fabricTexture" x="0%" y="0%" width="100%" height="100%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
                    <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.04 0" />
                    <feBlend mode="multiply" in="SourceGraphic" />
                  </filter>
                  <linearGradient id="foldShadow" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(0,0,0,0.2)" />
                    <stop offset="25%" stopColor="rgba(255,255,255,0.08)" />
                    <stop offset="50%" stopColor="rgba(0,0,0,0.15)" />
                    <stop offset="75%" stopColor="rgba(255,255,255,0.08)" />
                    <stop offset="100%" stopColor="rgba(0,0,0,0.2)" />
                  </linearGradient>
                </defs>
                {/* Body & Sleeves */}
                <path
                  d="M130,20 Q160,50 200,50 Q240,50 270,20 L370,80 L330,150 L280,120 L280,320 L120,320 L120,120 L70,150 L30,80 Z"
                  fill={selectedBodyColor.hex}
                  stroke="rgba(0,0,0,0.15)"
                  strokeWidth="2"
                  filter="url(#fabricTexture)"
                />
                <path
                  d="M130,20 Q160,50 200,50 Q240,50 270,20 L370,80 L330,150 L280,120 L280,320 L120,320 L120,120 L70,150 L30,80 Z"
                  fill="url(#foldShadow)"
                />
                {/* Collar Rib */}
                <path
                  d="M130,20 Q160,50 200,50 Q240,50 270,20"
                  fill="none"
                  stroke="rgba(0,0,0,0.25)"
                  strokeWidth="4"
                />
              </svg>

              {/* Chest Imprint Placement */}
              <div className="absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 sm:w-36 text-center pointer-events-none space-y-1">
                {uploadedLogo && (
                  <div className="relative w-10 h-10 mx-auto mb-1">
                    <Image src={uploadedLogo} alt="Logo" fill className="object-contain" />
                  </div>
                )}
                <h4
                  className="font-display font-black text-sm sm:text-base tracking-tighter leading-none"
                  style={{ color: selectedImprintColor.hex }}
                >
                  {brandName || "YOUR BRAND"}
                </h4>
                {tagline && (
                  <p
                    className="font-sans font-semibold text-[8px] sm:text-[9px] tracking-wider uppercase opacity-90"
                    style={{ color: selectedImprintColor.hex }}
                  >
                    {tagline}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Mockup Product 2: Ceramic Coffee Mug */}
          {activeProduct === "mug" && (
            <div className="relative w-56 sm:w-64 h-52 sm:h-60 flex items-center justify-center filter drop-shadow-2xl">
              <svg viewBox="0 0 340 300" className="w-full h-full">
                <defs>
                  <linearGradient id="ceramicSheen" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(0,0,0,0.25)" />
                    <stop offset="20%" stopColor="rgba(255,255,255,0.4)" />
                    <stop offset="45%" stopColor="rgba(255,255,255,0.05)" />
                    <stop offset="85%" stopColor="rgba(0,0,0,0.2)" />
                    <stop offset="100%" stopColor="rgba(0,0,0,0.35)" />
                  </linearGradient>
                </defs>
                {/* Mug Handle */}
                <path
                  d="M210,80 C290,80 290,210 210,210"
                  fill="none"
                  stroke={selectedBodyColor.hex}
                  strokeWidth="32"
                  strokeLinecap="round"
                />
                <path
                  d="M210,80 C290,80 290,210 210,210"
                  fill="none"
                  stroke="rgba(0,0,0,0.2)"
                  strokeWidth="32"
                  strokeLinecap="round"
                />
                {/* Mug Cylinder Body */}
                <rect
                  x="70"
                  y="40"
                  width="170"
                  height="220"
                  rx="18"
                  fill={selectedBodyColor.hex}
                  stroke="rgba(0,0,0,0.15)"
                  strokeWidth="2"
                />
                <rect x="70" y="40" width="170" height="220" rx="18" fill="url(#ceramicSheen)" />
              </svg>

              {/* Mug Print Area */}
              <div className="absolute top-[48%] left-[45%] -translate-x-1/2 -translate-y-1/2 w-28 text-center pointer-events-none space-y-1">
                {uploadedLogo && (
                  <div className="relative w-8 h-8 mx-auto mb-1">
                    <Image src={uploadedLogo} alt="Logo" fill className="object-contain" />
                  </div>
                )}
                <h4
                  className="font-display font-black text-xs sm:text-sm tracking-tight leading-none"
                  style={{ color: selectedImprintColor.hex }}
                >
                  {brandName || "YOUR BRAND"}
                </h4>
                {tagline && (
                  <p
                    className="font-sans font-semibold text-[7px] tracking-wider uppercase opacity-90"
                    style={{ color: selectedImprintColor.hex }}
                  >
                    {tagline}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Mockup Product 3: Curved Luxury Business Card */}
          {activeProduct === "card" && (
            <div
              className="relative w-72 sm:w-84 h-44 sm:h-50 rounded-[22px] p-6 shadow-2xl flex flex-col justify-between border transition-colors duration-200"
              style={{
                backgroundColor: selectedBodyColor.hex,
                borderColor: selectedBodyColor.isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)",
              }}
            >
              {/* Foil Stamped Logo and Name */}
              <div className="flex items-start justify-between">
                <div>
                  <h4
                    className="font-display font-black text-lg sm:text-xl tracking-tight leading-tight"
                    style={{
                      color: selectedImprintColor.hex,
                      textShadow: selectedImprintColor.isFoil ? "0 1px 2px rgba(0,0,0,0.3)" : "none",
                    }}
                  >
                    {brandName || "YOUR COMPANY"}
                  </h4>
                  {tagline && (
                    <p
                      className="font-sans font-bold text-[9px] tracking-widest uppercase mt-0.5"
                      style={{ color: selectedImprintColor.hex, opacity: 0.85 }}
                    >
                      {tagline}
                    </p>
                  )}
                </div>

                {uploadedLogo ? (
                  <div className="relative w-10 h-10 rounded overflow-hidden">
                    <Image src={uploadedLogo} alt="Logo" fill className="object-contain" />
                  </div>
                ) : (
                  <Award
                    className="w-5 h-5 shrink-0"
                    style={{ color: selectedImprintColor.hex }}
                  />
                )}
              </div>

              {/* Bottom Card Specs */}
              <div className="flex items-end justify-between border-t border-white/10 pt-3">
                <div className="text-[9px] font-mono" style={{ color: selectedImprintColor.hex, opacity: 0.8 }}>
                  600GSM COTTON · CURVED CORNER
                </div>
                <div className="text-[9px] font-mono font-bold" style={{ color: selectedImprintColor.hex }}>
                  SHOMOLU PRESS
                </div>
              </div>
            </div>
          )}

          {/* Mockup Product 4: Magnetic Rigid Box */}
          {activeProduct === "box" && (
            <div
              className="relative w-72 sm:w-84 h-52 sm:h-58 rounded-card p-7 shadow-2xl flex flex-col items-center justify-center text-center border transition-colors duration-200"
              style={{
                backgroundColor: selectedBodyColor.hex,
                borderColor: selectedBodyColor.isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)",
              }}
            >
              {/* Embossed Magnetic Lid Seam */}
              <div className="absolute top-0 inset-x-0 h-4 bg-black/10 rounded-t-card border-b border-black/15" />

              {uploadedLogo && (
                <div className="relative w-12 h-12 mb-2">
                  <Image src={uploadedLogo} alt="Logo" fill className="object-contain" />
                </div>
              )}

              <h4
                className="font-display font-black text-xl sm:text-2xl tracking-tighter leading-tight"
                style={{
                  color: selectedImprintColor.hex,
                  textShadow: selectedImprintColor.isFoil ? "0 1px 3px rgba(0,0,0,0.4)" : "none",
                }}
              >
                {brandName || "LUXURY PACKAGING"}
              </h4>

              {tagline && (
                <p
                  className="font-sans font-bold text-[9px] tracking-widest uppercase mt-1"
                  style={{ color: selectedImprintColor.hex, opacity: 0.85 }}
                >
                  {tagline}
                </p>
              )}

              <div className="absolute bottom-3 text-[9px] font-mono opacity-60 text-white">
                1200GSM RIGID MAGNETIC CLOSURE
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Control Studio Console */}
      <div className="p-5 md:p-6 space-y-4 bg-card">
        {/* Row 1: Brand Name & Tagline Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-ink mb-1">
              Your Company / Brand Name
            </label>
            <input
              type="text"
              maxLength={24}
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="e.g. Apex Global"
              className="w-full px-3 py-2 rounded-button bg-canvas-soft border border-border text-xs text-ink font-semibold focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-ink mb-1">
              Tagline / Sub-Text
            </label>
            <input
              type="text"
              maxLength={36}
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Lagos, Nigeria"
              className="w-full px-3 py-2 rounded-button bg-canvas-soft border border-border text-xs text-ink focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Row 2: Color Swatches & Logo Upload */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Base Material Color */}
          <div>
            <span className="block text-xs font-bold text-ink mb-2">
              Product Body Color: <strong className="text-primary">{selectedBodyColor.name}</strong>
            </span>
            <div className="flex items-center gap-2">
              {bodyColors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedBodyColor(color)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer flex items-center justify-center ${
                    selectedBodyColor.name === color.name
                      ? "border-primary scale-110 shadow-soft"
                      : "border-border hover:scale-105"
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                  aria-label={color.name}
                >
                  {selectedBodyColor.name === color.name && (
                    <Check
                      className={`w-3.5 h-3.5 ${color.isDark ? "text-white" : "text-ink"}`}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Imprint / Foil Color */}
          <div>
            <span className="block text-xs font-bold text-ink mb-2">
              Print / Foil Finish: <strong className="text-primary">{selectedImprintColor.name}</strong>
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {imprintColors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedImprintColor(color)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer flex items-center justify-center shrink-0 ${
                    selectedImprintColor.name === color.name
                      ? "border-primary scale-110 shadow-soft"
                      : "border-border hover:scale-105"
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                  aria-label={color.name}
                >
                  {selectedImprintColor.name === color.name && (
                    <Check
                      className={`w-3.5 h-3.5 ${color.hex === "#ffffff" ? "text-ink" : "text-white"}`}
                    />
                  )}
                </button>
              ))}

              {/* Upload Logo Trigger */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/svg+xml"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 min-h-[36px] rounded-button bg-canvas-soft border border-border text-[11px] font-semibold text-ink hover:bg-canvas-muted transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Upload transparent PNG logo"
              >
                <Upload className="w-3.5 h-3.5 text-primary" />
                <span>{uploadedLogo ? "Change Logo" : "Upload Logo"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Row 3: Action Buttons (Snapshot Download, WhatsApp, Cart) */}
        <div className="pt-3 border-t border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-left w-full sm:w-auto">
            <span className="text-[11px] text-ink-muted block">Factory Starting Run:</span>
            <span className="font-display font-black text-lg text-ink">
              ₦{currentProduct.defaultPrice.toLocaleString()}{" "}
              <span className="text-xs font-normal text-ink-muted">
                ({currentProduct.minQty} pcs)
              </span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:flex sm:flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleDownloadSnapshot}
              disabled={isExporting}
              className="w-full sm:w-auto min-h-[44px] px-3.5 py-2.5 rounded-button bg-canvas-soft border border-border hover:bg-canvas-muted text-ink font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Download high-res PNG mockup screenshot"
            >
              <Download className="w-3.5 h-3.5 text-primary" />
              <span>{isExporting ? "Rendering..." : "Save Mockup (PNG)"}</span>
            </button>

            <button
              onClick={handleAddToCart}
              className="w-full sm:w-auto min-h-[44px] px-3.5 py-2.5 rounded-button bg-canvas-muted hover:bg-border/60 text-ink font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </button>

            <button
              onClick={handleOrderWhatsApp}
              className="w-full sm:w-auto min-h-[44px] px-4 py-2.5 rounded-button bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs transition-all shadow-soft flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Order on WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
