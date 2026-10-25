"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowLeft, 
  MoveHorizontal, 
  Sparkles,
  CalendarCheck2,
  CheckCircle2
} from "lucide-react";

export type FormattedPortfolioItem = {
  _id: string;
  slug: string;
  title: { fa: string; en?: string };
  description: { fa: string; en?: string };
  treatment?: { fa?: string; en?: string };
  categorySlug?: string;
  categoryName?: string;
  images: string[];
  beforeImage?: string;
  afterImage?: string;
  featureTitle?: string;
  featureSubtitle?: string;
};

type SamplePortfolioProps = {
  items: FormattedPortfolioItem[];
  categories?: { slug: string; name: { fa: string; en?: string } }[];
};

const FALLBACK_CASES: FormattedPortfolioItem[] = [
  {
    _id: "case-1",
    slug: "smile-design-case-1",
    title: { fa: "اصلاح طرح لبخند و ونیر سرامیکی", en: "Smile Design & Ceramic Veneers" },
    description: { fa: "اصلاح فرم، رنگ دندان‌ها و بستن فواصل با سرامیک فوق‌نازک ای‌مکس", en: "Tooth form & color correction with ultra-thin ceramic" },
    treatment: { fa: "۸ واحد لمینیت سرامیکی ای‌مکس (IPS e.max)", en: "8 units IPS e.max ceramic veneers" },
    categorySlug: "smile",
    categoryName: "اصلاح طرح لبخند",
    images: ["/assets/portfolio/smile-design-case-1-after.jpg", "/assets/portfolio/smile-design-case-1-before.jpg"],
    beforeImage: "/assets/portfolio/smile-design-case-1-before.jpg",
    afterImage: "/assets/portfolio/smile-design-case-1-after.jpg",
  },
  {
    _id: "case-2",
    slug: "implant-full-mouth-case-2",
    title: { fa: "ایمپلنت تخصصی و بازسازی کامل فک", en: "Dental Implant & Full Arch" },
    description: { fa: "کاشت ایمپلنت‌های تیتانیومی سوئیسی با بارگذاری فوری پروتز زیرکونیا", en: "Swiss implant placement with immediate zirconia prosthesis" },
    treatment: { fa: "ایمپلنت دیجیتال اشترومن + روکش تمام سرامیک", en: "Straumann digital implant + ceramic crowns" },
    categorySlug: "implant",
    categoryName: "ایمپلنت دندان",
    images: ["/assets/portfolio/implant-full-mouth-case-2-after.jpg", "/assets/portfolio/implant-full-mouth-case-2-before.jpg"],
    beforeImage: "/assets/portfolio/implant-full-mouth-case-2-before.jpg",
    afterImage: "/assets/portfolio/implant-full-mouth-case-2-after.jpg",
  },
  {
    _id: "case-3",
    slug: "align-invisible-case-3",
    title: { fa: "ارتودنسی نامرئی و اصلاح نامرتبی", en: "Clear Aligners Orthodontics" },
    description: { fa: "ردیف‌سازی تخصصی دندان‌های فک بالا و پایین با الاینرهای شفاف دیجیتال", en: "Clear aligner therapy for crowding and alignment" },
    treatment: { fa: "الاینر شفاف دیجیتال دوره ۱۲ ماهه", en: "Clear aligners 12 months therapy" },
    categorySlug: "ortho",
    categoryName: "ارتودنسی",
    images: ["/assets/portfolio/align-invisible-case-3-after.jpg", "/assets/portfolio/align-invisible-case-3-before.jpg"],
    beforeImage: "/assets/portfolio/align-invisible-case-3-before.jpg",
    afterImage: "/assets/portfolio/align-invisible-case-3-after.jpg",
  },
  {
    _id: "case-4",
    slug: "restorative-micro-case-4",
    title: { fa: "ترمیم زیبایی و کامپوزیت لیرینگ", en: "Aesthetic Composite Layering" },
    description: { fa: "بازسازی میکروسکوپی و برطرف‌کردن بدفرمی با کامپوزیت میکروهیبرید", en: "Microscopic composite bonding and aesthetic restoration" },
    treatment: { fa: "کامپوزیت ونیر نانوهیبرید رنگ طبیعی", en: "Natural nano-hybrid composite veneers" },
    categorySlug: "cosmetic",
    categoryName: "ترمیم و زیبایی",
    images: ["/assets/portfolio/restorative-micro-case-4-after.jpg", "/assets/portfolio/restorative-micro-case-4-before.jpg"],
    beforeImage: "/assets/portfolio/restorative-micro-case-4-before.jpg",
    afterImage: "/assets/portfolio/restorative-micro-case-4-after.jpg",
  },
];

const toPersianNum = (n: number) => String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);

export function SamplePortfolio({ items, categories }: SamplePortfolioProps) {
  // Use DB items if available, otherwise fall back to clinical photo cases
  const availableItems = items && items.length > 0 ? items : FALLBACK_CASES;
  // Maximum of 7 latest cases for the overlapping avatar bubbles as requested
  const latestSevenCases = availableItems.slice(0, 7);

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const currentCase = latestSevenCases[activeIndex] || latestSevenCases[0] || FALLBACK_CASES[0];

  const beforeImg = 
    currentCase?.beforeImage || 
    (currentCase?.images && currentCase.images[1]) || 
    "/assets/portfolio/smile-design-case-1-before.jpg";

  const afterImg = 
    currentCase?.afterImage || 
    (currentCase?.images && currentCase.images[0]) || 
    "/assets/portfolio/smile-design-case-1-after.jpg";

  // Mouse & Touch drag calculations
  const updateSliderFromClientX = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const offsetX = clientX - rect.left;
    const percentage = Math.min(Math.max((offsetX / rect.width) * 100, 0), 100);
    setSliderPosition(percentage);
    setHasInteracted(true);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    updateSliderFromClientX(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    updateSliderFromClientX(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore if capture was already released
    }
  };

  // Keyboard navigation for accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      setSliderPosition((prev) => Math.max(prev - 5, 0));
    } else if (e.key === "ArrowRight") {
      setSliderPosition((prev) => Math.min(prev + 5, 100));
    }
  };

  const handleTextPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const bounds = e.currentTarget.getBoundingClientRect();
    const pointerX = (e.clientX - bounds.left) / bounds.width - 0.5;
    const pointerY = (e.clientY - bounds.top) / bounds.height - 0.5;

    e.currentTarget.querySelectorAll<HTMLElement>("[data-portfolio-shape]").forEach((shape) => {
      const depth = Number(shape.dataset.depth || 1);
      const rotation = Number(shape.dataset.rotation || 0);
      const translateX = (pointerX * 20 * depth).toFixed(1);
      const translateY = (pointerY * 16 * depth).toFixed(1);

      shape.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) rotate(${rotation + pointerX * 3}deg)`;
    });
  };

  const handleTextPointerLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.querySelectorAll<HTMLElement>("[data-portfolio-shape]").forEach((shape) => {
      shape.style.transform = `rotate(${Number(shape.dataset.rotation || 0)}deg)`;
    });
  };

  return (
    <section className="py-16 sm:py-24 relative bg-white overflow-hidden" id="cases">
      {/* Subtle organic background decoration */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#404c34]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#D8AE98]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Header & Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* ========================================================
              LEFT/MAIN COLUMN (in Persian RTL: Right is Text, Left is Card
              matching the reference mockup side-by-side design)
             ======================================================== */}
          
          {/* Text & Headlines Side (col-span-5) */}
          <div
            className="lg:col-span-5 order-2 lg:order-1 relative isolate"
            onPointerMove={handleTextPointerMove}
            onPointerLeave={handleTextPointerLeave}
          >
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
              <span
                data-portfolio-shape
                data-depth="0.8"
                data-rotation="0"
                className="absolute right-[8%] top-[8%] h-28 w-28 rounded-full border border-[#596646]/25 bg-[#596646]/[0.04] transition-transform duration-500 ease-out will-change-transform motion-reduce:transition-none"
              />
              <span
                data-portfolio-shape
                data-depth="1.1"
                data-rotation="18"
                className="absolute bottom-[10%] left-[8%] h-20 w-20 rounded-xl border border-[#a58b52]/25 bg-[#a58b52]/[0.06] transition-transform duration-300 ease-out will-change-transform motion-reduce:transition-none"
                style={{ transform: "rotate(18deg)" }}
              />
            </div>
            <div className="relative z-10 flex flex-col justify-center text-right">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#E8E2D5] text-xs font-bold text-[#404c34] mb-5 w-fit shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#D8AE98]" />
                <span>نمونه کارها کلینیک</span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#302A21] leading-[1.25] tracking-tight mb-4">
                ۱۰۰٪ واقعی.
                <br />
                <span className="text-[#404c34]">۱۰۰٪ لبخند شما.</span>
              </h2>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/portfolio"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#404c34] hover:bg-[#343F2B] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-98 group"
                >
                  <span className="text-white">مشاهده همه نمونه کارها</span>
                  <ArrowLeft className="w-4 h-4 text-white group-hover:-translate-x-1 transition-transform" />
                </Link>

                <a
                  href="#booking"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-white hover:bg-[#FCFAF6] text-[#302A21] text-sm font-bold border border-[#E8E2D5] shadow-xs hover:shadow-md transition-all active:scale-98"
                >
                  <CalendarCheck2 className="w-4 h-4 text-[#404c34]" />
                  <span>رزرو وقت مشاوره</span>
                </a>
              </div>
            </div>
          </div>

          {/* ========================================================
              RIGHT/COMPARISON CONTAINER (col-span-7)
              Contains the interactive slider + overlapping 7 avatars
             ======================================================== */}
          <div className="lg:col-span-7 order-1 lg:order-2">

            {/* Categories filter pills above the comparison container */}
            {categories && categories.length > 0 && (
              <div
                className="flex flex-nowrap items-center gap-2 mb-4 overflow-x-auto overscroll-x-contain pb-2"
                role="tablist"
                aria-label="دسته‌بندی نمونه‌کارها"
              >
                {categories.map((cat) => (
                  <button
                    key={cat.slug}
                    type="button"
                    onClick={() => {
                      const matchIdx = latestSevenCases.findIndex((c) => c.categorySlug === cat.slug);
                      if (matchIdx >= 0) {
                        setActiveIndex(matchIdx);
                        setSliderPosition(50);
                      }
                    }}
                    className={`shrink-0 whitespace-nowrap text-[11px] px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
                      currentCase.categorySlug === cat.slug
                        ? "bg-[#404c34] text-white"
                        : "bg-white/70 text-[#756F62] hover:bg-white"
                    }`}
                  >
                    {cat.name.fa}
                  </button>
                ))}
              </div>
            )}
            
            {/* Top Bar above/on the Card: Overlapping 7 Avatars */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 px-1">
              {/* Overlapping Circular Avatars (Up to 7 cases) */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                {/* Stack of Overlapping Circles */}
                <div className="flex items-center -space-x-2.5 sm:-space-x-3.5 space-x-reverse" role="tablist" aria-label="پرونده‌های نمونه‌کار">
                  {latestSevenCases.map((caseItem, idx) => {
                    const isSelected = idx === activeIndex;
                    const avatarImg = caseItem?.afterImage || caseItem?.images?.[0] || "/assets/portfolio/smile-design-case-1-after.jpg";

                    return (
                      <button
                        key={caseItem._id || `case-${idx}`}
                        type="button"
                        onClick={() => {
                          setActiveIndex(idx);
                          setSliderPosition(50);
                        }}
                        title={caseItem.title.fa}
                        style={{ borderRadius: "50%", padding: 0 }}
                        className={`relative shrink-0 overflow-hidden rounded-[50%] transition-all duration-300 focus:outline-none cursor-pointer ${
                          isSelected
                            ? "w-11 h-11 sm:w-13 sm:h-13 ring-3 ring-[#404c34] ring-offset-2 z-30 scale-110 shadow-lg"
                            : "w-9 h-9 sm:w-11 sm:h-11 border-2 border-white opacity-85 hover:opacity-100 hover:scale-115 hover:z-20 shadow-sm"
                        }`}
                        role="tab"
                        aria-selected={isSelected}
                      >
                        <Image
                          src={avatarImg}
                          alt={caseItem.title.fa}
                          fill
                          sizes="52px"
                          className="rounded-[50%] object-cover"
                          referrerPolicy="no-referrer"
                        />
                        {isSelected && (
                          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#404c34] text-white rounded-full flex items-center justify-center text-[9px] font-bold shadow-xs border border-white">
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Main Interactive Comparison Card */}
            <div 
              ref={containerRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onKeyDown={handleKeyDown}
              tabIndex={0}
              role="slider"
              aria-valuenow={Math.round(sliderPosition)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="نشانگر مقایسه تصویر قبل و بعد درمان"
              className={`relative aspect-[4/3] sm:aspect-[16/11] md:aspect-[16/10] w-full rounded-[28px] sm:rounded-[36px] overflow-hidden select-none touch-none shadow-2xl border-4 border-white/90 bg-[#1E1C18] cursor-ew-resize group focus:outline-none focus:ring-4 focus:ring-[#404c34]/20 ${
                isDragging ? "cursor-grabbing" : ""
              }`}
            >
              
              {/* Layer 1 (Base): Before Treatment Image (Left side) */}
              <div className="absolute inset-0 w-full h-full">
                <Image
                  src={beforeImg}
                  alt={`قبل از درمان: ${currentCase.title.fa}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                  priority
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Layer 2 (Overlay): After Treatment Image (Right side, clipped by sliderPosition) */}
              <div 
                className="absolute inset-0 w-full h-full will-change-[clip-path]"
                style={{
                  clipPath: `inset(0 0 0 ${sliderPosition}%)`,
                }}
              >
                <Image
                  src={afterImg}
                  alt={`بعد از درمان: ${currentCase.title.fa}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                  priority
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Subtle top & bottom vignette to enhance readability of badges */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

              {/* BEFORE Badge (Left side) */}
              <div className="absolute top-4 left-4 sm:top-5 sm:left-5 pointer-events-none z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black tracking-wide bg-black/60 backdrop-blur-md text-amber-200 border border-white/20 shadow-md">
                  <span>قبل از درمان</span>
                  <span className="text-[10px] opacity-75 font-mono">BEFORE</span>
                </span>
              </div>

              {/* AFTER Badge (Right side) */}
              <div className="absolute top-4 right-4 sm:top-5 sm:right-5 pointer-events-none z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black tracking-wide bg-[#047857]/80 backdrop-blur-md text-emerald-100 border border-emerald-400/30 shadow-md">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                  <span>بعد از درمان</span>
                  <span className="text-[10px] opacity-75 font-mono">AFTER</span>
                </span>
              </div>

              {/* Drag Handle & Vertical Split Line */}
              <div
                className="absolute top-0 bottom-0 z-20 pointer-events-none will-change-[left]"
                style={{ left: `${sliderPosition}%` }}
              >
                {/* Thin Vertical White Divider Line with Soft Shadow */}
                <div className="absolute top-0 bottom-0 -left-[1.5px] w-[3px] bg-white shadow-[0_0_12px_rgba(0,0,0,0.65)]" />

                {/* Central Draggable Knob */}
                <div 
                  className={`absolute top-1/2 -left-5 sm:-left-6 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white text-[#302A21] shadow-2xl border-2 border-white flex items-center justify-center pointer-events-auto cursor-ew-resize transition-transform duration-150 ${
                    isDragging ? "scale-115 shadow-[0_0_25px_rgba(255,255,255,0.8)]" : "group-hover:scale-105"
                  }`}
                  aria-hidden="true"
                >
                  <MoveHorizontal className="w-5 h-5 text-[#404c34]" />
                </div>
              </div>

              {/* Bottom Overlay Info Banner on Card */}
              <div className="absolute bottom-4 inset-x-4 sm:bottom-5 sm:inset-x-5 z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 sm:p-4 rounded-2xl bg-black/45 backdrop-blur-md border border-white/15 text-white pointer-events-none">
                <div className="text-right">
                  <span className="text-[11px] font-bold text-emerald-300 block mb-0.5">
                    {currentCase.treatment?.fa || currentCase.categoryName || "اصلاح تخصصی لبخند"}
                  </span>
                  <strong className="text-sm sm:text-base font-black text-white">
                    {currentCase.title.fa}
                  </strong>
                </div>

                {/* Helpful drag hint / position feedback */}
                <div className="flex items-center gap-2 text-[11px] font-medium text-white/85 self-end sm:self-auto bg-white/10 px-3 py-1 rounded-full">
                  <MoveHorizontal className="w-3.5 h-3.5 text-amber-300" />
                  <span>
                    {!hasInteracted ? "برای مقایسه، دایره را بکشید" : `تغییر: ${toPersianNum(Math.round(sliderPosition))}٪`}
                  </span>
                </div>
              </div>

            </div>

            {/* Quick Position Preset Controls underneath card */}
            <div className="flex items-center justify-between mt-3 px-2 text-xs text-[#756F62]">
              <div className="flex items-center gap-2">
                <span className="font-medium text-[11px]">نمایش سریع:</span>
                <button
                  type="button"
                  onClick={() => setSliderPosition(100)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    sliderPosition >= 98
                      ? "bg-[#404c34] text-white shadow-xs"
                      : "bg-white/80 hover:bg-white text-[#302A21] border border-[#E8E2D5]"
                  }`}
                >
                  فقط قبل (۱۰۰٪)
                </button>
                <button
                  type="button"
                  onClick={() => setSliderPosition(50)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    sliderPosition > 45 && sliderPosition < 55
                      ? "bg-[#404c34] text-white shadow-xs"
                      : "bg-white/80 hover:bg-white text-[#302A21] border border-[#E8E2D5]"
                  }`}
                >
                  ۵۰٪ / ۵۰٪
                </button>
                <button
                  type="button"
                  onClick={() => setSliderPosition(0)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    sliderPosition <= 2
                      ? "bg-[#404c34] text-white shadow-xs"
                      : "bg-white/80 hover:bg-white text-[#302A21] border border-[#E8E2D5]"
                  }`}
                >
                  فقط بعد (۱۰۰٪)
                </button>
              </div>

              {/* Link to single case page */}
              <Link
                href={`/portfolio/${currentCase.slug}`}
                className="text-xs font-bold text-[#404c34] hover:text-[#302A21] transition inline-flex items-center gap-1"
              >
                <span>جزئیات این پرونده</span>
                <ArrowLeft className="w-3 h-3" />
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
