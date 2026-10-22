"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { 
  SlidersHorizontal,
  ChevronLeft
} from "lucide-react";

export function HomePortfolio() {
  const [sliderPosition, setSliderPosition] = useState(50); // percentage 0 to 100
  const [activeCase, setActiveCase] = useState(0);

  const cases = [
    {
      id: "case-1",
      title: "اصلاح طرح لبخند با لمینت سرامیکی E-max",
      treatment: "لمینت سرامیکی",
      beforeImg: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=800&q=80",
      afterImg: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "case-2",
      title: "کامپوزیت ونیر زیبایی و بستن فواصل",
      treatment: "کامپوزیت ونیر",
      beforeImg: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80",
      afterImg: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "case-3",
      title: "ایمپلنت فوری و روکش زیرکونیا قدامی",
      treatment: "ایمپلنت دیجیتال",
      beforeImg: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=800&q=80",
      afterImg: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "case-4",
      title: "بلیچینگ هوم و آفیس و پالیش تخصصی",
      treatment: "سفید کردن دندان",
      beforeImg: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80",
      afterImg: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=800&q=80",
    },
  ];

  const current = cases[activeCase];

  const handleSliderMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const offsetX = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (offsetX / rect.width) * 100));
    setSliderPosition(percentage);
  };

  return (
    <section id="portfolio" className="py-24 sm:py-32 relative bg-[#F7F4EE] overflow-hidden text-right">
      
      {/* Botanical Motif in background */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-80 h-80 pointer-events-none opacity-20 hidden lg:block">
        <svg viewBox="0 0 200 200" fill="none" className="w-full h-full text-[#404c34]">
          <path d="M50 150C60 90 120 50 170 30C140 90 100 130 50 150Z" fill="currentColor" opacity="0.4" />
          <path d="M30 120C50 70 100 40 150 20C120 80 80 110 30 120Z" fill="currentColor" opacity="0.3" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Right Column in RTL: Intro & Button (Matching image.png) */}
          <div className="lg:col-span-4 lg:col-start-9 flex flex-col items-start space-y-5 order-1 lg:order-2">
            <span className="text-xs font-semibold text-[#817C70] tracking-wider">
              نمونه کارها
            </span>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#302A21] leading-tight tracking-tight">
              تجربه لبخندهای زیباتر
            </h2>

            <p className="text-sm sm:text-base text-[#817C70] leading-relaxed text-pretty">
              با مشاهده نمونه کارهای واقعی، از کیفیت درمان‌ها و رضایت مراجعین ما مطمئن شوید.
            </p>

            <div className="pt-2">
              <Link
                href="/portfolio"
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-full text-xs font-semibold !text-white bg-[#625D45] hover:bg-[#343F2B] transition-all duration-200 shadow-sm"
                style={{ color: "#ffffff" }}
              >
                <span className="!text-white font-semibold text-white" style={{ color: "#ffffff" }}>مشاهده همه نمونه کارها</span>
              </Link>
            </div>
          </div>

          {/* Left/Center Column in RTL: Interactive Slider + 4 Preview Cases (Matching image.png) */}
          <div className="lg:col-span-8 lg:col-start-1 order-2 lg:order-1 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* 4 Small Case Previews Column (Middle) */}
            <div className="md:col-span-4 grid grid-cols-2 gap-2.5 order-2 md:order-2">
              {cases.map((c, idx) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setActiveCase(idx)}
                  className={`relative aspect-4/3 rounded-xl overflow-hidden border transition-all text-right group cursor-pointer ${
                    activeCase === idx 
                      ? "ring-2 ring-[#625D45] border-transparent shadow-md" 
                      : "border-[#E8E2D5] opacity-85 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={c.afterImg}
                    alt={c.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 15vw"
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-1.5 right-2 left-2 text-white text-[10px] font-medium line-clamp-1">
                    {c.treatment}
                  </div>
                </button>
              ))}
            </div>

            {/* Big Interactive Before/After Comparison Box (Matching image.png) */}
            <div className="md:col-span-8 order-1 md:order-1">
              <div 
                className="relative aspect-16/10 w-full rounded-2xl overflow-hidden shadow-[0_16px_40px_rgba(48,42,33,0.08)] border border-[#E8E2D5] select-none cursor-ew-resize"
                onMouseMove={handleSliderMove}
                onTouchMove={handleSliderMove}
              >
                {/* After Image (Background layer) with dental illustration fallback */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#404c34]/30 via-[#FCFAF6] to-[#D8AE98]/30 flex items-center justify-center">
                  <div className="text-center p-4">
                    <span className="text-xs font-semibold text-[#625D45]">لبخند درخشان و یکدست (نتیجه نهایی)</span>
                  </div>
                </div>
                <Image
                  src={current.afterImg}
                  alt="بعد از درمان دندانپزشکی"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center pointer-events-none relative z-10"
                  referrerPolicy="no-referrer"
                />

                {/* Before Image (Clipped overlay layer) */}
                <div 
                  className="absolute inset-0 overflow-hidden pointer-events-none z-20"
                  style={{ width: `${sliderPosition}%` }}
                >
                  <div 
                    className="absolute inset-0 h-full"
                    style={{ width: `calc(100% * 100 / ${Math.max(sliderPosition, 1)})` }}
                  >
                    <div className="absolute inset-0 bg-[#E8E2D5]/70 flex items-center justify-center">
                      <span className="text-xs font-semibold text-[#817C70]">وضعیت اولیه دندان‌ها (قبل از درمان)</span>
                    </div>
                    <Image
                      src={current.beforeImg}
                      alt="قبل از درمان دندانپزشکی"
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover object-center pointer-events-none relative z-10"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

                {/* Vertical Dividing Line & Draggable Handle */}
                <div 
                  className="absolute top-0 bottom-0 w-0.5 bg-white pointer-events-none z-20 shadow-md"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-white text-[#625D45] flex items-center justify-center shadow-lg border border-[#E8E2D5]">
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Before Label (Bottom Left, matching image.png) */}
                <div className="absolute bottom-3 left-3 z-10 pointer-events-none">
                  <span className="px-3 py-1 rounded-md bg-black/60 backdrop-blur-sm text-white text-xs font-semibold">
                    قبل
                  </span>
                </div>

                {/* After Label (Bottom Right, matching image.png) */}
                <div className="absolute bottom-3 right-3 z-10 pointer-events-none">
                  <span className="px-3 py-1 rounded-md bg-[#625D45]/90 backdrop-blur-sm text-white text-xs font-semibold">
                    بعد
                  </span>
                </div>

              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
