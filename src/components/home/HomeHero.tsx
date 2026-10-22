"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { 
  CalendarCheck, 
  ArrowLeft 
} from "lucide-react";
import { HomeHeroNarrative } from "./HomeHeroNarrative";

export function HomeHero() {
  return (
    <section id="hero" className="relative w-full h-[100svh] min-h-[640px] flex items-center justify-center overflow-hidden bg-[#241E17]">
      
      {/* 1. Photorealistic Luxury Dental Clinic Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=2000&q=85"
          alt="کلینیک دندانپزشکی مدرن"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-102"
          referrerPolicy="no-referrer"
        />

        {/* Cinematic Scrim & Warm Luxury Vignette Overlay */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(to left, rgba(20, 16, 12, 0.88) 0%, rgba(35, 29, 23, 0.65) 45%, rgba(20, 16, 12, 0.4) 100%)"
          }}
        />
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(to top, rgba(20, 16, 12, 0.95) 0%, transparent 40%, rgba(20, 16, 12, 0.6) 100%)"
          }}
        />
      </div>

      {/* 2. Hero Content (Right-aligned in RTL) */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-12 sm:pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Right Column (First in RTL): Hero Typography & CTA Buttons */}
          <div className="col-span-12 lg:col-span-5 flex flex-col items-start text-right space-y-5 order-1">
            
            {/* Kicker */}
            <div className="text-xs sm:text-sm font-semibold tracking-wide text-[#D8AE98] opacity-100 transition-opacity">
              <span>لبخند سالم، زندگی زیباتر</span>
            </div>

            {/* Display Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-[2.75rem] font-bold tracking-tight text-white leading-[1.3] text-balance opacity-100">
              کلینیک دندانپزشکی
              <br />
              <span className="text-[#F7F4EE]">با رویکردی متفاوت</span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-white/85 leading-relaxed max-w-lg text-pretty opacity-100">
              ما با بهره‌گیری از جدیدترین تکنولوژی‌ها و تیم متخصص، به شما کمک می‌کنیم لبخندی سالم‌تر و زیباتر داشته باشید.
            </p>

            {/* CTA Buttons Row */}
            <div className="flex flex-wrap items-center gap-3 pt-3 w-full sm:w-auto opacity-100">
              {/* Primary Booking Button */}
              <a 
                href="#booking"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-semibold !text-white bg-[#625D45] hover:bg-[#343F2B] active:bg-[#4E4A37] transition-all duration-200 shadow-[0_8px_25px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_30px_rgba(98,93,69,0.5)] cursor-pointer"
                style={{ color: "#ffffff" }}
              >
                <CalendarCheck className="w-4 h-4 text-white" style={{ color: "#ffffff" }} />
                <span className="!text-white font-semibold text-white" style={{ color: "#ffffff" }}>رزرو نوبت آنلاین</span>
              </a>

              {/* Secondary Services Button */}
              <a 
                href="#services"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-xs sm:text-sm font-medium !text-white hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-all duration-200 cursor-pointer"
                style={{ color: "#ffffff" }}
              >
                <span className="!text-white font-medium text-white" style={{ color: "#ffffff" }}>مشاهده خدمات</span>
                <ArrowLeft className="w-4 h-4 text-[#D8AE98]" />
              </a>
            </div>

          </div>

          {/* Left Column (Second in RTL): 2D Animated Smile Architecture & Journey Showcase */}
          <div className="col-span-12 lg:col-span-7 flex items-center justify-center order-2 pointer-events-auto">
            <HomeHeroNarrative />
          </div>

        </div>
      </div>

      {/* 4. Bottom Delicate Mouse Scroll Indicator (Matching image.png) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none opacity-85">
        <div className="w-5 h-8 rounded-full border-2 border-white/40 flex items-start justify-center p-1">
          <motion.div 
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 h-1.5 rounded-full bg-[#D8AE98]"
          />
        </div>
      </div>

      {/* 5. Bottom Right Dots Indicator (Matching image.png) */}
      <div className="absolute bottom-7 right-8 sm:right-12 z-20 hidden sm:flex items-center gap-1.5 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-[#D8AE98]" />
        <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
        <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
        <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
      </div>

    </section>
  );
}
