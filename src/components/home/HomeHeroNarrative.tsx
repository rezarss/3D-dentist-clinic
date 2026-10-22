"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { 
  Scan, 
  Sparkles, 
  Cpu, 
  ShieldCheck, 
  Star,
  type LucideIcon
} from "lucide-react";

interface Step {
  id: number;
  title: string;
  badge: string;
  desc: string;
  icon: LucideIcon;
  metric: string;
}

const JOURNEY_STEPS: Step[] = [
  {
    id: 1,
    title: "اسکن نوری سه‌بعدی",
    badge: "دقت ۲۰ میکرون",
    desc: "حذف کامل قالب‌گیری سنتی و ثبت میکرونی انحنای دندان‌ها در ۳ دقیقه",
    icon: Scan,
    metric: "خطای صفر"
  },
  {
    id: 2,
    title: "طراحی هارمونی چهره (DSD)",
    badge: "نسبت طلایی ۱.۶۱۸",
    desc: "شبیه‌سازی لبخند نهایی متناسب با خط لب و چانه قبل از شروع درمان",
    icon: Sparkles,
    metric: "آنالیز هوشمند"
  },
  {
    id: 3,
    title: "تراش میکرونی CAD/CAM",
    badge: "سرامیک E-max",
    desc: "تراش رباتیک روکش‌های فوق‌نازک ۰.۳ میلی‌متری با استحکام الماس",
    icon: Cpu,
    metric: "۵ محوره CNC"
  },
  {
    id: 4,
    title: "تحویل لبخند رویایی",
    badge: "گارانتی ۱۰ ساله",
    desc: "لبخندی کاملاً طبیعی، هماهنگ و درخشان با گارانتی کتبی اصالت",
    icon: ShieldCheck,
    metric: "۹۹.۸٪ رضایت"
  }
];

export function HomeHeroNarrative() {
  const [activeStep, setActiveStep] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Auto-progress treatment journey steps every 4.5s
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % JOURNEY_STEPS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Subtle 2D mouse parallax offset
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 16;
    setMousePos({ x, y });
  };

  const current = JOURNEY_STEPS[activeStep];

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="relative w-full max-w-2xl mx-auto flex flex-col items-center select-none"
    >
      {/* 1. Ambient Luxury Radial Atmosphere Glow */}
      <div 
        className="absolute -inset-8 pointer-events-none rounded-full blur-[100px] opacity-35"
        style={{
          background: "radial-gradient(circle, #D8AE98 0%, #404c34 35%, transparent 70%)"
        }}
      />

      {/* 2. Main Visual Canvas: High-Fashion Smile Showcase with DSD Precision HUD */}
      <motion.div 
        animate={{
          x: mousePos.x,
          y: mousePos.y
        }}
        transition={{ type: "spring", damping: 30, stiffness: 120 }}
        className="relative w-full aspect-[4/3] sm:aspect-[16/11] rounded-3xl overflow-hidden shadow-2xl shadow-black/60 border border-white/10 bg-[#1D1712]"
      >
        {/* Real Luxury Dental Aesthetic Image */}
        <Image
          src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1400&q=85"
          alt="لبخند بی‌نقص و طبیعی کلینیک دندانپزشکی"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover object-center filter brightness-95 contrast-105 scale-105"
          referrerPolicy="no-referrer"
        />

        {/* Cinematic Soft Vignette Scrim */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(to top, rgba(20, 16, 12, 0.95) 0%, rgba(20, 16, 12, 0.3) 50%, rgba(20, 16, 12, 0.6) 100%)"
          }}
        />
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, transparent 35%, rgba(15, 12, 9, 0.75) 100%)"
          }}
        />

        {/* Animated Digital Smile Design (DSD) Architectural Precision HUD Overlay */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 600 420" fill="none">
          {/* Subtle Golden Ratio Proportions Grid */}
          <path 
            d="M 60 210 Q 300 245 540 210" 
            stroke="#D8AE98" 
            strokeWidth="1.2" 
            strokeDasharray="4 6" 
            opacity="0.45"
          />
          <path 
            d="M 120 180 Q 300 210 480 180" 
            stroke="white" 
            strokeWidth="1" 
            strokeDasharray="2 4" 
            opacity="0.3" 
          />
          <line x1="300" y1="60" x2="300" y2="360" stroke="#D8AE98" strokeWidth="1" strokeDasharray="3 5" opacity="0.4" />
          
          {/* Facial Midline Axis & Smile Arc Calibrators */}
          <circle cx="300" cy="210" r="4" fill="#D8AE98" />
          <circle cx="300" cy="210" r="14" stroke="#D8AE98" strokeWidth="1" opacity="0.5" />
          <circle cx="210" cy="205" r="3" fill="white" opacity="0.8" />
          <circle cx="390" cy="205" r="3" fill="white" opacity="0.8" />
          
          {/* Real-time sweeping laser beam */}
          <motion.line 
            animate={{ x1: [140, 460, 140], x2: [140, 460, 140] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
            y1="120"
            y2="300"
            stroke="#D8AE98"
            strokeWidth="1.5"
            strokeOpacity="0.75"
          />
        </svg>

        {/* Top-Right Telemetry HUD Tag */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white text-[11px] font-mono shadow-md">
          <span className="w-2 h-2 rounded-full bg-[#D8AE98] animate-pulse" />
          <span>DSD SCAN: ACTIVE</span>
          <span className="text-white/40">·</span>
          <span className="text-[#D8AE98]">φ 1.618</span>
        </div>

        {/* Top-Left Guarantee Floating Pill */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-[11px] font-medium shadow-md">
          <ShieldCheck className="w-3.5 h-3.5 text-[#D8AE98]" />
          <span>گارانتی کتبی اصالت</span>
        </div>

        {/* Bottom Floating Dynamic Journey Card inside the visual */}
        <div className="absolute bottom-4 inset-x-4 z-10">
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#140F0B]/90 backdrop-blur-xl border border-white/15 text-white shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between gap-3 text-right"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#625D45]/80 border border-[#D8AE98]/40 flex items-center justify-center shrink-0 text-[#D8AE98] shadow-sm">
                    <current.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white sm:text-sm">
                        {current.title}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#D8AE98]/20 text-[#D8AE98] border border-[#D8AE98]/40">
                        {current.badge}
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-white/80 mt-0.5 line-clamp-1">
                      {current.desc}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 text-left pl-1">
                  <div className="text-[10px] text-white/60 tracking-wide font-medium">
                    مرحله {current.id} از ۴
                  </div>
                  <div className="text-xs font-semibold text-[#D8AE98] mt-0.5">
                    {current.metric}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* 3. Interactive Journey Stepper Row (Below Visual) */}
      <div className="w-full mt-4 grid grid-cols-4 gap-2">
        {JOURNEY_STEPS.map((step, idx) => {
          const isActive = idx === activeStep;
          return (
            <div
              key={step.id}
              role="button"
              tabIndex={0}
              onClick={() => setActiveStep(idx)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActiveStep(idx);
                }
              }}
              className={`group flex flex-col items-center p-2.5 rounded-xl transition-all duration-300 text-center cursor-pointer border select-none ${
                isActive 
                  ? "bg-[#251E17] border-[#D8AE98] shadow-lg shadow-black/40 ring-1 ring-[#D8AE98]/40" 
                  : "bg-[#18130E]/80 border-white/10 hover:border-white/25 hover:bg-[#201A14]"
              }`}
            >
              {/* Top Progress Line Indicator */}
              <div className="w-full h-1 rounded-full bg-white/10 mb-2 overflow-hidden">
                <motion.div 
                  className={`h-full ${isActive ? "bg-[#D8AE98]" : "bg-transparent"}`}
                  initial={{ width: "0%" }}
                  animate={{ width: isActive ? "100%" : "0%" }}
                  transition={isActive ? { duration: 4.5, ease: "linear" } : { duration: 0.2 }}
                />
              </div>

              <span className={`text-[11px] sm:text-xs font-semibold leading-tight line-clamp-1 transition-colors ${
                isActive ? "text-white" : "text-white/70 group-hover:text-white"
              }`}>
                {step.title}
              </span>
              <span className="text-[10px] text-[#D8AE98] mt-0.5 hidden sm:block font-medium">
                {step.badge}
              </span>
            </div>
          );
        })}
      </div>

      {/* 4. Floating Luxury Satisfaction Counter Pill */}
      <motion.div 
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        className="mt-4 inline-flex items-center gap-3 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-white/90 text-xs shadow-lg"
      >
        <div className="flex items-center gap-1 text-[#D8AE98]">
          <Star className="w-3.5 h-3.5 fill-[#D8AE98]" />
          <Star className="w-3.5 h-3.5 fill-[#D8AE98]" />
          <Star className="w-3.5 h-3.5 fill-[#D8AE98]" />
          <Star className="w-3.5 h-3.5 fill-[#D8AE98]" />
          <Star className="w-3.5 h-3.5 fill-[#D8AE98]" />
        </div>
        <span className="font-semibold text-white">۴.۹ از ۵</span>
        <span className="text-white/40">·</span>
        <span className="text-white/80">بیش از ۱۵,۰۰۰ لبخند خلق‌شده در کلینیک</span>
      </motion.div>
    </div>
  );
}
