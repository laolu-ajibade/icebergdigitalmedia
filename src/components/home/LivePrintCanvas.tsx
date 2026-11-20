"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  Shirt,
  Coffee,
  Briefcase,
  BookOpen,
  Download,
  Send,
  ShoppingBag,
  Upload,
  Award,
  Check,
  Trash2,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Eye,
  EyeOff,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { getWhatsAppLink } from "@/lib/constants";
import { useSiteSettings } from "@/lib/useSiteSettings";

type ProductType = "tshirt" | "mug" | "card" | "jotter";

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
    id: "jotter",
    label: "Jotters",
    icon: BookOpen,
    defaultPrice: 15000,
    minQty: 50,
    stockDesc: "A5 Hardcover Spiral Note Jotter",
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
  const [showText, setShowText] = useState(true);
  const [selectedBodyColor, setSelectedBodyColor] = useState(bodyColors[0]);
  const [selectedImprintColor, setSelectedImprintColor] = useState(imprintColors[0]);
  const [uploadedLogo, setUploadedLogo] = useState<string | null>(null);
  const [r2LogoUrl, setR2LogoUrl] = useState<string | null>(null);
  const [logoOffset, setLogoOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [logoScale, setLogoScale] = useState<number>(1);

  // 3D Spatial Tilt state
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isExporting, setIsExporting] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addItem, setIsCartOpen } = useCart();
  const settings = useSiteSettings();

  const dynamicProducts: ProductConfig[] = products.map((baseProd) => {
    const dbMatch = settings?.studioItems?.find(
      (s: any) =>
        s.id === baseProd.id ||
        (baseProd.id === "jotter" && s.id === "box")
    );
    if (!dbMatch) return baseProd;
    const resolvedLabel =
      baseProd.id === "jotter" &&
      (!dbMatch.label || dbMatch.label === "Rigid Box")
        ? "Jotters"
        : dbMatch.label || baseProd.label;
    const resolvedStock =
      baseProd.id === "jotter" &&
      (!dbMatch.stockDesc || dbMatch.stockDesc.includes("Greyboard"))
        ? baseProd.stockDesc
        : dbMatch.stockDesc || baseProd.stockDesc;
    return {
      ...baseProd,
      label: resolvedLabel,
      defaultPrice:
        typeof dbMatch.price === "number" ? dbMatch.price : baseProd.defaultPrice,
      minQty: typeof dbMatch.minQty === "number" ? dbMatch.minQty : baseProd.minQty,
      stockDesc: resolvedStock,
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
        setLogoOffset({ x: 0, y: 0 });
        setLogoScale(1);
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

  const handleRemoveLogo = () => {
    setUploadedLogo(null);
    setR2LogoUrl(null);
    setLogoOffset({ x: 0, y: 0 });
    setLogoScale(1);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const nudgeLogo = (dx: number, dy: number) => {
    setLogoOffset((prev) => ({
      x: Math.max(-95, Math.min(95, prev.x + dx)),
      y: Math.max(-95, Math.min(95, prev.y + dy)),
    }));
  };

  const adjustLogoScale = (delta: number) => {
    setLogoScale((prev) =>
      Number(Math.max(0.6, Math.min(2.2, prev + delta)).toFixed(2))
    );
  };

  const resetLogoTransform = () => {
    setLogoOffset({ x: 0, y: 0 });
    setLogoScale(1);
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

    const finalizeExport = () => {
      // Render Imprint / Brand Details on top (matches z-20 text over z-10 logo)
      if (showText) {
        ctx.fillStyle = selectedImprintColor.hex;
        ctx.textAlign = "center";

        ctx.font = "900 42px 'Plus Jakarta Sans', system-ui, sans-serif";
        ctx.fillText(brandName || "ICEBERG STUDIO", 600, 440, 360);

        if (tagline) {
          ctx.font = "600 17px 'Plus Jakarta Sans', system-ui, sans-serif";
          ctx.fillText(tagline.toUpperCase(), 600, 480, 360);
        }
      }

      // Branding Watermark & Metadata
      ctx.fillStyle = "#64748b";
      ctx.font = "500 16px 'Plus Jakarta Sans', system-ui, sans-serif";
      ctx.fillText(
        `Iceberg Creative Print Studio — ${currentProduct.label} Proof Preview · ${selectedBodyColor.name} / ${selectedImprintColor.name}`,
        600,
        840
      );

      const link = document.createElement("a");
      link.download = `iceberg-mockup-${activeProduct}-${(brandName || "proof")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      setIsExporting(false);
    };

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
      // Tailored T-shirt silhouette with sleeves and crewneck
      ctx.beginPath();
      ctx.moveTo(490, 175);
      ctx.lineTo(350, 225);
      ctx.lineTo(255, 325);
      ctx.lineTo(335, 395);
      ctx.lineTo(405, 330);
      ctx.lineTo(405, 735);
      ctx.lineTo(795, 735);
      ctx.lineTo(795, 330);
      ctx.lineTo(865, 395);
      ctx.lineTo(945, 325);
      ctx.lineTo(850, 225);
      ctx.lineTo(710, 175);
      ctx.quadraticCurveTo(600, 245, 490, 175);
      ctx.closePath();
      ctx.fill();
    } else if (activeProduct === "mug") {
      // Ergonomic C-handle
      ctx.lineWidth = 44;
      ctx.strokeStyle = selectedBodyColor.hex;
      ctx.beginPath();
      ctx.arc(780, 480, 90, -Math.PI / 2, Math.PI / 2);
      ctx.stroke();
      // Mug cylinder body
      ctx.beginPath();
      ctx.roundRect(390, 230, 390, 490, 28);
      ctx.fill();
    } else if (activeProduct === "card") {
      // Layered backing card + foreground card
      ctx.save();
      ctx.globalAlpha = 0.6;
      ctx.translate(600, 460);
      ctx.rotate(-0.05);
      ctx.beginPath();
      ctx.roundRect(-300, -180, 600, 360, 28);
      ctx.fill();
      ctx.restore();
      ctx.beginPath();
      ctx.roundRect(300, 270, 600, 360, 28);
      ctx.fill();
    } else {
      // Spiral Note Jotter cover + metallic wire-o rings
      ctx.beginPath();
      ctx.roundRect(390, 190, 430, 540, 24);
      ctx.fill();
      ctx.shadowColor = "transparent";
      ctx.fillStyle = "#cbd5e1";
      for (let i = 0; i < 10; i++) {
        ctx.beginPath();
        ctx.roundRect(365, 220 + i * 48, 42, 16, 8);
        ctx.fill();
      }
    }

    // Reset shadow
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    if (uploadedLogo) {
      const logoImg = new window.Image();
      logoImg.onload = () => {
        const size = 96 * logoScale;
        const x = 600 + logoOffset.x * 2 - size / 2;
        const y = 520 + logoOffset.y * 2 - size / 2;
        ctx.drawImage(logoImg, x, y, size, size);
        finalizeExport();
      };
      logoImg.onerror = finalizeExport;
      logoImg.src = uploadedLogo;
    } else {
      finalizeExport();
    }
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
    <div className="bg-card rounded-card border border-card-border shadow-elevation overflow-hidden antigravity-card">
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
        className="relative h-[360px] sm:h-[430px] w-full bg-gradient-to-b from-canvas-soft to-border/30 flex items-center justify-center p-3 sm:p-6 overflow-hidden select-none"
        style={{ perspective: "1000px" }}
      >
        {/* Spatial Floating Product Container */}
        <div
          className="relative transition-transform duration-150 ease-out flex items-center justify-center w-full"
          style={{
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          }}
        >
          {/* Mockup Product 1: Realistic Tailored Heavyweight Crewneck T-Shirt */}
          {activeProduct === "tshirt" && (
            <div className="relative w-[300px] sm:w-[380px] md:w-[420px] h-[270px] sm:h-[330px] md:h-[355px] max-w-full flex items-center justify-center filter drop-shadow-2xl">
              <svg viewBox="0 0 440 390" className="w-full h-full">
                <defs>
                  <filter
                    id="fabricTexture"
                    x="0%"
                    y="0%"
                    width="100%"
                    height="100%"
                  >
                    <feTurbulence
                      type="fractalNoise"
                      baseFrequency="0.045"
                      numOctaves="3"
                      result="noise"
                    />
                    <feColorMatrix
                      type="matrix"
                      values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.035 0"
                    />
                    <feBlend mode="multiply" in="SourceGraphic" />
                  </filter>
                  <linearGradient
                    id="torsoCylinder"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="rgba(0,0,0,0.28)" />
                    <stop offset="18%" stopColor="rgba(255,255,255,0.09)" />
                    <stop offset="38%" stopColor="rgba(0,0,0,0.06)" />
                    <stop offset="50%" stopColor="rgba(255,255,255,0.11)" />
                    <stop offset="65%" stopColor="rgba(0,0,0,0.08)" />
                    <stop offset="82%" stopColor="rgba(255,255,255,0.07)" />
                    <stop offset="100%" stopColor="rgba(0,0,0,0.3)" />
                  </linearGradient>
                  <radialGradient
                    id="chestLight"
                    cx="50%"
                    cy="34%"
                    r="48%"
                  >
                    <stop offset="0%" stopColor="rgba(255,255,255,0.14)" />
                    <stop offset="65%" stopColor="rgba(255,255,255,0.02)" />
                    <stop offset="100%" stopColor="rgba(0,0,0,0.16)" />
                  </radialGradient>
                  <linearGradient
                    id="innerCollarShade"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="rgba(0,0,0,0.45)" />
                    <stop offset="100%" stopColor="rgba(0,0,0,0.7)" />
                  </linearGradient>
                </defs>

                {/* Back Inner Collar Pocket */}
                <path
                  d="M158,28 Q220,44 282,28 Q266,68 220,68 Q174,68 158,28 Z"
                  fill={selectedBodyColor.hex}
                />
                <path
                  d="M158,28 Q220,44 282,28 Q266,68 220,68 Q174,68 158,28 Z"
                  fill="url(#innerCollarShade)"
                />

                {/* Woven Neck Label Tag Inside Collar */}
                <rect
                  x="207"
                  y="36"
                  width="26"
                  height="15"
                  rx="2"
                  fill="#f8fafc"
                  opacity="0.88"
                />
                <line
                  x1="212"
                  y1="42"
                  x2="228"
                  y2="42"
                  stroke="#0f172a"
                  strokeWidth="2"
                  opacity="0.65"
                />
                <line
                  x1="215"
                  y1="46"
                  x2="225"
                  y2="46"
                  stroke="#64748b"
                  strokeWidth="1.2"
                  opacity="0.6"
                />

                {/* Main Tailored T-Shirt Silhouette */}
                <path
                  d="M158,28
                     C140,33 108,46 84,60
                     C62,73 34,98 18,118
                     C15,122 16,127 20,131
                     L66,166
                     C71,169 76,168 80,163
                     L110,126
                     C114,158 113,255 110,360
                     C110,366 115,370 122,370
                     Q220,375 318,370
                     C325,370 330,366 330,360
                     C327,255 326,158 330,126
                     L360,163
                     C364,168 369,169 374,166
                     L420,131
                     C424,127 425,122 422,118
                     C406,98 378,73 356,60
                     C332,46 300,33 282,28
                     Q258,72 220,72
                     Q182,72 158,28 Z"
                  fill={selectedBodyColor.hex}
                  stroke={
                    selectedBodyColor.isDark
                      ? "rgba(255,255,255,0.12)"
                      : "rgba(15,23,42,0.16)"
                  }
                  strokeWidth="1.8"
                  filter="url(#fabricTexture)"
                />

                {/* 3D Cylindrical & Chest Lighting Overlay */}
                <path
                  d="M158,28
                     C140,33 108,46 84,60
                     C62,73 34,98 18,118
                     C15,122 16,127 20,131
                     L66,166
                     C71,169 76,168 80,163
                     L110,126
                     C114,158 113,255 110,360
                     C110,366 115,370 122,370
                     Q220,375 318,370
                     C325,370 330,366 330,360
                     C327,255 326,158 330,126
                     L360,163
                     C364,168 369,169 374,166
                     L420,131
                     C424,127 425,122 422,118
                     C406,98 378,73 356,60
                     C332,46 300,33 282,28
                     Q258,72 220,72
                     Q182,72 158,28 Z"
                  fill="url(#torsoCylinder)"
                />
                <path
                  d="M158,28
                     C140,33 108,46 84,60
                     C62,73 34,98 18,118
                     C15,122 16,127 20,131
                     L66,166
                     C71,169 76,168 80,163
                     L110,126
                     C114,158 113,255 110,360
                     C110,366 115,370 122,370
                     Q220,375 318,370
                     C325,370 330,366 330,360
                     C327,255 326,158 330,126
                     L360,163
                     C364,168 369,169 374,166
                     L420,131
                     C424,127 425,122 422,118
                     C406,98 378,73 356,60
                     C332,46 300,33 282,28
                     Q258,72 220,72
                     Q182,72 158,28 Z"
                  fill="url(#chestLight)"
                />

                {/* Armhole / Raglan Tailored Seam Contours */}
                <path
                  d="M144,34 Q118,78 110,126"
                  fill="none"
                  stroke={
                    selectedBodyColor.isDark
                      ? "rgba(255,255,255,0.09)"
                      : "rgba(0,0,0,0.1)"
                  }
                  strokeWidth="1.5"
                />
                <path
                  d="M296,34 Q322,78 330,126"
                  fill="none"
                  stroke={
                    selectedBodyColor.isDark
                      ? "rgba(255,255,255,0.09)"
                      : "rgba(0,0,0,0.1)"
                  }
                  strokeWidth="1.5"
                />

                {/* Ribbed Crewneck Collar Band */}
                <path
                  d="M158,28 Q182,72 220,72 Q258,72 282,28 L293,32 Q265,84 220,84 Q175,84 147,32 Z"
                  fill={selectedBodyColor.hex}
                  stroke={
                    selectedBodyColor.isDark
                      ? "rgba(255,255,255,0.16)"
                      : "rgba(0,0,0,0.18)"
                  }
                  strokeWidth="1.5"
                />
                <path
                  d="M158,28 Q182,72 220,72 Q258,72 282,28 L293,32 Q265,84 220,84 Q175,84 147,32 Z"
                  fill="rgba(0,0,0,0.14)"
                />
                {/* Collar Twin-Needle Stitching */}
                <path
                  d="M144,35 Q173,88 220,88 Q267,88 296,35"
                  fill="none"
                  stroke={
                    selectedBodyColor.isDark
                      ? "rgba(255,255,255,0.18)"
                      : "rgba(0,0,0,0.2)"
                  }
                  strokeWidth="1.2"
                  strokeDasharray="3 2"
                />

                {/* Twin-Needle Sleeve Cuff & Bottom Hem Stitching */}
                <line
                  x1="25"
                  y1="122"
                  x2="74"
                  y2="159"
                  stroke={
                    selectedBodyColor.isDark
                      ? "rgba(255,255,255,0.16)"
                      : "rgba(0,0,0,0.18)"
                  }
                  strokeWidth="1.2"
                  strokeDasharray="3 2"
                />
                <line
                  x1="415"
                  y1="122"
                  x2="366"
                  y2="159"
                  stroke={
                    selectedBodyColor.isDark
                      ? "rgba(255,255,255,0.16)"
                      : "rgba(0,0,0,0.18)"
                  }
                  strokeWidth="1.2"
                  strokeDasharray="3 2"
                />
                <path
                  d="M113,358 Q220,363 327,358"
                  fill="none"
                  stroke={
                    selectedBodyColor.isDark
                      ? "rgba(255,255,255,0.16)"
                      : "rgba(0,0,0,0.18)"
                  }
                  strokeWidth="1.2"
                  strokeDasharray="3 2"
                />
              </svg>

              {/* Chest Imprint Zone: Strictly contained inside torso (w-[43%]), Text always layered on top (z-20) over Logo (z-10) */}
              <div className="absolute top-[29%] left-1/2 -translate-x-1/2 w-[43%] max-w-[168px] px-1 text-center pointer-events-none flex flex-col items-center">
                {showText && (
                  <div className="relative z-20 flex flex-col items-center w-full overflow-hidden">
                    <h4
                      className="font-display font-black text-xs sm:text-sm md:text-base tracking-tight leading-tight break-words w-full"
                      style={{
                        color: selectedImprintColor.hex,
                        textShadow: selectedImprintColor.isFoil
                          ? "0 1px 3px rgba(0,0,0,0.35)"
                          : "none",
                      }}
                    >
                      {brandName || "YOUR BRAND"}
                    </h4>
                    {tagline && (
                      <p
                        className="font-sans font-semibold text-[7px] sm:text-[8px] tracking-wider uppercase opacity-90 mt-1 break-words w-full leading-snug"
                        style={{ color: selectedImprintColor.hex }}
                      >
                        {tagline}
                      </p>
                    )}
                  </div>
                )}

                {uploadedLogo && (
                  <div
                    className="relative z-10 w-12 h-12 sm:w-14 sm:h-14 mt-2.5 transition-transform duration-150 ease-out"
                    style={{
                      transform: `translate(${logoOffset.x}px, ${logoOffset.y}px) scale(${logoScale})`,
                      transformOrigin: "center center",
                    }}
                  >
                    <Image
                      src={uploadedLogo}
                      alt="Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mockup Product 2: Realistic 3D Glazed Ceramic Coffee Mug */}
          {activeProduct === "mug" && (
            <div className="relative w-[272px] sm:w-[336px] h-[252px] sm:h-[310px] max-w-full flex items-center justify-center filter drop-shadow-2xl">
              <svg viewBox="0 0 360 320" className="w-full h-full">
                <defs>
                  <linearGradient
                    id="ceramicSheen"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="rgba(0,0,0,0.32)" />
                    <stop offset="16%" stopColor="rgba(255,255,255,0.45)" />
                    <stop offset="28%" stopColor="rgba(255,255,255,0.12)" />
                    <stop offset="55%" stopColor="rgba(0,0,0,0.04)" />
                    <stop offset="82%" stopColor="rgba(0,0,0,0.22)" />
                    <stop offset="100%" stopColor="rgba(0,0,0,0.4)" />
                  </linearGradient>
                  <linearGradient
                    id="mugInterior"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="rgba(0,0,0,0.55)" />
                    <stop offset="100%" stopColor="rgba(0,0,0,0.25)" />
                  </linearGradient>
                </defs>

                {/* Ergonomic 3D C-Handle */}
                <path
                  d="M235,88 C322,88 322,226 235,226"
                  fill="none"
                  stroke={selectedBodyColor.hex}
                  strokeWidth="34"
                  strokeLinecap="round"
                />
                <path
                  d="M235,88 C322,88 322,226 235,226"
                  fill="none"
                  stroke="rgba(0,0,0,0.24)"
                  strokeWidth="34"
                  strokeLinecap="round"
                />
                <path
                  d="M240,94 C310,94 310,220 240,220"
                  fill="none"
                  stroke="rgba(255,255,255,0.22)"
                  strokeWidth="8"
                  strokeLinecap="round"
                />

                {/* Tapered Ceramic Base Foot */}
                <path
                  d="M78,266 Q155,282 232,266 L224,280 Q155,292 86,280 Z"
                  fill={selectedBodyColor.hex}
                />
                <path
                  d="M78,266 Q155,282 232,266 L224,280 Q155,292 86,280 Z"
                  fill="rgba(0,0,0,0.35)"
                />

                {/* Mug Cylinder Body */}
                <path
                  d="M65,52 L65,252 C65,268 105,278 155,278 C205,278 245,268 245,252 L245,52 Z"
                  fill={selectedBodyColor.hex}
                  stroke="rgba(0,0,0,0.15)"
                  strokeWidth="1.5"
                />
                <path
                  d="M65,52 L65,252 C65,268 105,278 155,278 C205,278 245,268 245,252 L245,52 Z"
                  fill="url(#ceramicSheen)"
                />

                {/* Specular Vertical Ceramic Highlight Bar */}
                <rect
                  x="88"
                  y="64"
                  width="14"
                  height="194"
                  rx="7"
                  fill="rgba(255,255,255,0.18)"
                />

                {/* Top Elliptical Rim & Inner Mug Opening */}
                <ellipse
                  cx="155"
                  cy="52"
                  rx="90"
                  ry="18"
                  fill={selectedBodyColor.hex}
                  stroke="rgba(255,255,255,0.35)"
                  strokeWidth="2"
                />
                <ellipse
                  cx="155"
                  cy="52"
                  rx="82"
                  ry="13"
                  fill={selectedBodyColor.hex}
                />
                <ellipse
                  cx="155"
                  cy="52"
                  rx="82"
                  ry="13"
                  fill="url(#mugInterior)"
                />
              </svg>

              {/* Mug Print Area: Strictly contained inside mug cylinder (w-[43%]), Text on top (z-20), Logo beneath (z-10) */}
              <div className="absolute top-[33%] left-[43%] -translate-x-1/2 w-[43%] px-1 text-center pointer-events-none flex flex-col items-center">
                {showText && (
                  <div className="relative z-20 flex flex-col items-center w-full overflow-hidden">
                    <h4
                      className="font-display font-black text-xs sm:text-sm tracking-tight leading-tight break-words w-full"
                      style={{
                        color: selectedImprintColor.hex,
                        textShadow: selectedImprintColor.isFoil
                          ? "0 1px 2px rgba(0,0,0,0.3)"
                          : "none",
                      }}
                    >
                      {brandName || "YOUR BRAND"}
                    </h4>
                    {tagline && (
                      <p
                        className="font-sans font-semibold text-[6.5px] sm:text-[7.5px] tracking-wider uppercase opacity-90 mt-1 break-words w-full leading-snug"
                        style={{ color: selectedImprintColor.hex }}
                      >
                        {tagline}
                      </p>
                    )}
                  </div>
                )}

                {uploadedLogo && (
                  <div
                    className="relative z-10 w-10 h-10 sm:w-12 sm:h-12 mt-2 transition-transform duration-150 ease-out"
                    style={{
                      transform: `translate(${logoOffset.x * 0.75}px, ${logoOffset.y * 0.75}px) scale(${logoScale})`,
                      transformOrigin: "center center",
                    }}
                  >
                    <Image
                      src={uploadedLogo}
                      alt="Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mockup Product 3: 600gsm Curved Luxury Business Card Stack */}
          {activeProduct === "card" && (
            <div className="relative flex items-center justify-center">
              {/* Angled Backing Card Stack for 3D Depth */}
              <div
                className="absolute inset-0 rounded-[22px] border shadow-xl -rotate-3 translate-y-2.5 translate-x-2 opacity-65 pointer-events-none"
                style={{
                  backgroundColor: selectedBodyColor.hex,
                  borderColor: selectedBodyColor.isDark
                    ? "rgba(255,255,255,0.18)"
                    : "rgba(0,0,0,0.14)",
                }}
              />

              {/* Primary Foreground Luxury Business Card */}
              <div
                className="relative z-10 w-[308px] sm:w-[400px] h-[196px] sm:h-[240px] max-w-full rounded-[22px] p-6 sm:p-7 shadow-2xl flex flex-col justify-between border transition-colors duration-200 overflow-hidden"
                style={{
                  backgroundColor: selectedBodyColor.hex,
                  borderColor: selectedBodyColor.isDark
                    ? "rgba(255,255,255,0.22)"
                    : "rgba(0,0,0,0.14)",
                }}
              >
                {/* Diagonal Cotton Paper & Foil Sheen Overlay */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0) 48%, rgba(0,0,0,0.18) 100%)",
                  }}
                />

                {/* Foil Stamped Name & Tagline (z-20) on top, Logo (z-10) */}
                <div className="relative flex flex-col">
                  <div className="relative z-20 flex items-start justify-between gap-2">
                    {showText ? (
                      <div className="min-w-0 flex-1">
                        <h4
                          className="font-display font-black text-lg sm:text-2xl tracking-tight leading-tight break-words"
                          style={{
                            color: selectedImprintColor.hex,
                            textShadow: selectedImprintColor.isFoil
                              ? "0 1px 3px rgba(0,0,0,0.35)"
                              : "none",
                          }}
                        >
                          {brandName || "YOUR COMPANY"}
                        </h4>
                        {tagline && (
                          <p
                            className="font-sans font-bold text-[9px] sm:text-[10px] tracking-widest uppercase mt-1 break-words leading-snug"
                            style={{
                              color: selectedImprintColor.hex,
                              opacity: 0.88,
                            }}
                          >
                            {tagline}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="flex-1" />
                    )}

                    {!uploadedLogo && (
                      <Award
                        className="w-5 h-5 sm:w-6 sm:h-6 shrink-0"
                        style={{ color: selectedImprintColor.hex }}
                      />
                    )}
                  </div>

                  {uploadedLogo && (
                    <div
                      className="relative z-10 w-10 h-10 sm:w-12 sm:h-12 mt-2.5 self-center transition-transform duration-150 ease-out"
                      style={{
                        transform: `translate(${logoOffset.x}px, ${logoOffset.y * 0.65}px) scale(${logoScale})`,
                        transformOrigin: "center center",
                      }}
                    >
                      <Image
                        src={uploadedLogo}
                        alt="Logo"
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}
                </div>

                {/* Bottom Card Specs */}
                <div
                  className="relative z-20 flex items-end justify-between border-t pt-3"
                  style={{
                    borderColor: selectedBodyColor.isDark
                      ? "rgba(255,255,255,0.12)"
                      : "rgba(0,0,0,0.1)",
                  }}
                >
                  <div
                    className="text-[9px] font-mono"
                    style={{ color: selectedImprintColor.hex, opacity: 0.8 }}
                  >
                    600GSM COTTON · CURVED CORNER
                  </div>
                  <div
                    className="text-[9px] font-mono font-bold"
                    style={{ color: selectedImprintColor.hex }}
                  >
                    SHOMOLU PRESS
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mockup Product 4: Realistic Hardcover Spiral Note Jotter */}
          {activeProduct === "jotter" && (
            <div className="relative flex items-center justify-center filter drop-shadow-2xl">
              {/* Layered Cream/White Paper Page Stack Edges */}
              <div className="absolute -right-2.5 top-2.5 bottom-2.5 w-4 rounded-r-lg bg-slate-200 border border-slate-300 shadow-lg" />
              <div className="absolute -right-1.5 top-2 bottom-2 w-3 rounded-r-md bg-white border border-slate-300" />
              <div className="absolute -right-0.5 top-1.5 bottom-1.5 w-2 rounded-r-md bg-slate-50 border-r border-slate-300" />

              {/* Twin-Loop Metallic Wire-O Spiral Rings Along Left Spine */}
              <div className="relative z-30 -mr-2.5 flex flex-col justify-between h-[248px] sm:h-[296px] py-2">
                {[...Array(10)].map((_, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <div className="w-5 h-2 rounded-full bg-gradient-to-r from-slate-500 via-white to-slate-600 border border-slate-700/50 shadow-sm" />
                    <div className="w-5 h-1.5 rounded-full bg-gradient-to-r from-slate-600 via-slate-100 to-slate-500 border border-slate-700/50 shadow-sm" />
                  </div>
                ))}
              </div>

              {/* Jotter Hardcover Front */}
              <div
                className="relative z-10 w-[236px] sm:w-[288px] h-[276px] sm:h-[332px] max-w-full rounded-r-card rounded-l-[6px] pl-7 pr-6 py-7 shadow-2xl flex flex-col items-center justify-center text-center border transition-colors duration-200 overflow-hidden"
                style={{
                  backgroundColor: selectedBodyColor.hex,
                  borderColor: selectedBodyColor.isDark
                    ? "rgba(255,255,255,0.2)"
                    : "rgba(0,0,0,0.14)",
                }}
              >
                {/* Hardcover 3D Lighting Sheen */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(125deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.02) 45%, rgba(0,0,0,0.22) 100%)",
                  }}
                />

                {/* Punched Spiral Binding Holes Along Left Spine */}
                <div className="absolute left-2 top-3.5 bottom-3.5 flex flex-col justify-between py-0.5 pointer-events-none">
                  {[...Array(10)].map((_, idx) => (
                    <div
                      key={idx}
                      className="w-2 h-2.5 rounded-sm bg-black/45 border border-white/10"
                    />
                  ))}
                </div>

                {/* Center Brand Imprint: Text on top (z-20), movable/scalable Logo beneath (z-10) */}
                <div className="relative flex flex-col items-center my-auto w-full overflow-hidden px-1">
                  {showText && (
                    <div className="relative z-20 flex flex-col items-center w-full">
                      <h4
                        className="font-display font-black text-base sm:text-xl tracking-tight leading-tight break-words w-full"
                        style={{
                          color: selectedImprintColor.hex,
                          textShadow: selectedImprintColor.isFoil
                            ? "0 1px 3px rgba(0,0,0,0.38)"
                            : "none",
                        }}
                      >
                        {brandName || "EVENT JOTTER"}
                      </h4>

                      {tagline && (
                        <p
                          className="font-sans font-bold text-[8px] sm:text-[9px] tracking-widest uppercase mt-1 break-words w-full leading-snug"
                          style={{
                            color: selectedImprintColor.hex,
                            opacity: 0.88,
                          }}
                        >
                          {tagline}
                        </p>
                      )}
                    </div>
                  )}

                  {uploadedLogo && (
                    <div
                      className="relative z-10 w-12 h-12 sm:w-14 sm:h-14 mt-3 transition-transform duration-150 ease-out"
                      style={{
                        transform: `translate(${logoOffset.x * 0.8}px, ${logoOffset.y * 0.8}px) scale(${logoScale})`,
                        transformOrigin: "center center",
                      }}
                    >
                      <Image
                        src={uploadedLogo}
                        alt="Logo"
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Control Studio Console */}
      <div className="p-5 md:p-6 space-y-4 bg-card">
        {/* Text Visibility Toggle Bar */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-bold text-ink-muted uppercase tracking-wider">
            Brand Text &amp; Tagline
          </span>
          <button
            type="button"
            onClick={() => setShowText((prev) => !prev)}
            aria-pressed={showText}
            title={showText ? "Hide text on mockup (Logo only)" : "Show text on mockup"}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[34px] rounded-button border text-[11px] font-bold transition-colors cursor-pointer ${
              showText
                ? "bg-primary-pale/60 border-primary/40 text-ink"
                : "bg-canvas-soft border-border text-ink-muted hover:text-ink"
            }`}
          >
            {showText ? (
              <>
                <Eye className="w-3.5 h-3.5 text-primary" />
                <span>Text On</span>
              </>
            ) : (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                <span>Text Off (Logo Only)</span>
              </>
            )}
          </button>
        </div>

        {/* Row 1: Brand Name & Tagline Inputs */}
        {showText && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-ink mb-1">
                Your Company / Brand Name
              </label>
              <input
                type="text"
                maxLength={20}
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
                maxLength={32}
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Lagos, Nigeria"
                className="w-full px-3 py-2 rounded-button bg-canvas-soft border border-border text-xs text-ink focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        )}

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

              {/* Upload & Delete Logo Triggers */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/svg+xml"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 min-h-[36px] rounded-button bg-canvas-soft border border-border text-[11px] font-semibold text-ink hover:bg-canvas-muted transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Upload transparent PNG logo"
                >
                  <Upload className="w-3.5 h-3.5 text-primary" />
                  <span>{uploadedLogo ? "Change Logo" : "Upload Logo"}</span>
                </button>

                {uploadedLogo && (
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="p-2 min-h-[36px] min-w-[36px] rounded-button bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 transition-colors flex items-center justify-center cursor-pointer"
                    title="Delete uploaded logo"
                    aria-label="Delete uploaded logo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Logo Placement (Up/Down/Left/Right) & Scale Studio Bar */}
        {uploadedLogo && (
          <div className="p-3.5 rounded-card bg-canvas-soft border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* 4-Direction Nudge Controls */}
            <div className="flex items-center justify-between sm:justify-start gap-2">
              <span className="text-[11px] font-bold text-ink mr-1">
                Move Logo:
              </span>
              <div className="inline-flex items-center gap-1 bg-card p-1 rounded-button border border-border shadow-soft">
                <button
                  type="button"
                  onClick={() => nudgeLogo(-8, 0)}
                  title="Move Left"
                  aria-label="Move Logo Left"
                  className="p-1.5 min-h-[32px] min-w-[32px] rounded-theme hover:bg-canvas-soft text-ink flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => nudgeLogo(0, -8)}
                  title="Move Up"
                  aria-label="Move Logo Up"
                  className="p-1.5 min-h-[32px] min-w-[32px] rounded-theme hover:bg-canvas-soft text-ink flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => nudgeLogo(0, 8)}
                  title="Move Down"
                  aria-label="Move Logo Down"
                  className="p-1.5 min-h-[32px] min-w-[32px] rounded-theme hover:bg-canvas-soft text-ink flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => nudgeLogo(8, 0)}
                  title="Move Right"
                  aria-label="Move Logo Right"
                  className="p-1.5 min-h-[32px] min-w-[32px] rounded-theme hover:bg-canvas-soft text-ink flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={resetLogoTransform}
                  title="Reset Logo Position & Size"
                  aria-label="Reset Logo Position & Size"
                  className="px-2 py-1 min-h-[32px] rounded-theme hover:bg-canvas-soft text-ink-muted hover:text-ink text-[10px] font-bold flex items-center gap-1 border-l border-border/60 ml-0.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Logo Scale / Size Controls */}
            <div className="flex items-center justify-between sm:justify-end gap-2">
              <span className="text-[11px] font-bold text-ink">
                Logo Size:{" "}
                <strong className="text-primary">
                  {Math.round(logoScale * 100)}%
                </strong>
              </span>
              <div className="inline-flex items-center gap-1.5 bg-card px-2 py-1 rounded-button border border-border shadow-soft">
                <button
                  type="button"
                  onClick={() => adjustLogoScale(-0.15)}
                  disabled={logoScale <= 0.6}
                  title="Decrease Logo Size"
                  aria-label="Decrease Logo Size"
                  className="p-1 min-h-[28px] min-w-[28px] rounded-theme hover:bg-canvas-soft text-ink disabled:opacity-35 flex items-center justify-center cursor-pointer"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <input
                  type="range"
                  min="0.6"
                  max="2.2"
                  step="0.05"
                  value={logoScale}
                  onChange={(e) => setLogoScale(parseFloat(e.target.value))}
                  aria-label="Logo size scale"
                  className="w-20 sm:w-24 accent-primary cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => adjustLogoScale(0.15)}
                  disabled={logoScale >= 2.2}
                  title="Increase Logo Size"
                  aria-label="Increase Logo Size"
                  className="p-1 min-h-[28px] min-w-[28px] rounded-theme hover:bg-canvas-soft text-ink disabled:opacity-35 flex items-center justify-center cursor-pointer"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

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
