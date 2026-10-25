"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { 
  Scan, 
  Cpu, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  ArrowUpRight 
} from "lucide-react";
import Link from "next/link";

export function HomeTechnology() {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      id: "scanner",
      icon: Scan,
      title: "اسکن دیجیتال ۳D دهان",
      enTitle: "Intraoral 3D Scanning",
      badge: "دقت ۲۰ میکرون",
      description: "حذف کامل خمیرهای قالب‌گیری سنتی. ثبت میلی‌متری تمامی شیارها و بافت دندان توسط دوربین نوری پرسرعت در کمتر از ۳ دقیقه.",
      specs: ["بدون احساس تهوع یا ناراحتی", "انتقال آنی به لابراتوار دیجیتال", "شبیه‌سازی دقیق بایت فکی"],
    },
    {
      id: "dsd",
      icon: Sparkles,
      title: "طراحی دیجیتال لبخند (DSD)",
      enTitle: "Digital Smile Design",
      badge: "هوش مصنوعی و آنالیز چهره",
      description: "طراحی هندسی لبخند متناسب با تناسبات لب، بینی و خط چانه بیمار، به شما امکان می‌دهد قبل از لمس اولین دندان، فرم نهایی را ببینید.",
      specs: ["تطابق با بیومکانیک صورت", "امکان تغییر فرم دندان در مانیتور", "تأیید طرح درمان توسط مراجع"],
    },
    {
      id: "cadcam",
      icon: Cpu,
      title: "تراش میکرونی CAD/CAM",
      enTitle: "Robotic Milling",
      badge: "سرامیک زیرکونیا و E-max",
      description: "ساخت اختصاصی روکش‌ها و لمینت‌های سرامیکی با دستگاه‌های فرز ۵ محوره با صیقل دست‌ساز اساتید دندانسازی کلینیک.",
      specs: ["فیت حاشیه‌ای بی‌نقص", "ماندگاری رنگ تا سال‌ها", "سازگاری کامل با لثه"],
    },
    {
      id: "cbct",
      icon: Layers,
      title: "تصویربرداری ۳D CBCT",
      enTitle: "Guided Implantology",
      badge: "پرتونگاری کم‌دوز Ultra Low",
      description: "بررسی عمق و تراکم استخوان فک در زوایای ۳۶۰ درجه برای کاشت ایمپلنت با شابلون جراحی کامپیوتری بدون برش وسیع.",
      specs: ["حداقل خونریزی و تورم", "بهبود بسیار سریع دوره نقاهت", "موفقیت ۹۹.۸٪ کاشت"],
    },
  ];

  return (
    <section id="technology" className="py-24 sm:py-32 relative bg-white overflow-hidden text-right border-t border-[#E8E2D5]/60">
      
      {/* Subtle organic light accent */}
      <div 
        className="absolute top-1/4 right-0 w-96 h-96 rounded-full blur-[140px] opacity-25 pointer-events-none"
        style={{ background: "#D8AE98" }}
      />
      <div 
        className="absolute bottom-10 left-10 w-80 h-80 rounded-full blur-[120px] opacity-20 pointer-events-none"
        style={{ background: "#404c34" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-start space-y-4 max-w-2xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#404c34]/15 text-[#625D45] text-xs font-semibold">
            <Scan className="w-3.5 h-3.5 text-[#404c34]" />
            <span>اسکرول تریگر · معماری دیجیتال کلینیک</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#302A21] leading-tight tracking-tight">
            دقت میکرونی با تکنولوژی
            <br />
            <span className="text-[#404c34]">سه‌بعدی و هوش مصنوعی</span>
          </h2>

          <p className="text-sm sm:text-base text-[#817C70] leading-relaxed">
            ما هنر زیبایی‌شناسی دندانپزشکی را با مدرن‌ترین تجهیزات تصویربرداری و اسکن سه‌بعدی ترکیب کرده‌ایم تا هر درمان با پیش‌بینی‌پذیری کامل و بدون درد انجام شود.
          </p>
        </div>

        {/* Layout Grid: 3D Inspection Canvas Area + Interactive Detail Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Right Column: 4 Interactive Feature Tabs (RTL) */}
          <div className="lg:col-span-6 space-y-4 order-2 lg:order-1">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              const isActive = activeFeature === idx;

              return (
                <div
                  key={feature.id}
                  onClick={() => setActiveFeature(idx)}
                  className={`p-6 sm:p-7 rounded-3xl cursor-pointer transition-all duration-300 border opacity-100 ${
                    isActive 
                      ? "bg-[#FCFAF6] border-[#404c34] shadow-[0_16px_40px_rgba(64,76,52,0.14)]"
                      : "bg-[#FCFAF6]/60 border-[#E8E2D5]/70 hover:border-[#404c34]/50 hover:bg-[#FCFAF6]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-colors ${
                        isActive ? "bg-[#625D45] text-white" : "bg-[#404c34]/15 text-[#625D45]"
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-[#302A21]">
                          {feature.title}
                        </h3>
                        <span className="text-xs text-[#817C70] font-mono">
                          {feature.enTitle}
                        </span>
                      </div>
                    </div>

                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#404c34]/10 text-[#625D45] whitespace-nowrap">
                      {feature.badge}
                    </span>
                  </div>

                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 pt-4 border-t border-[#E8E2D5]/70 space-y-3"
                    >
                      <p className="text-xs sm:text-sm text-[#817C70] leading-relaxed">
                        {feature.description}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {feature.specs.map((spec) => (
                          <div key={spec} className="flex items-center gap-2 text-xs text-[#302A21] font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#404c34] shrink-0" />
                            <span>{spec}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Left Column: Spatial Visual Anchor & 3D Stage Callout */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center order-1 lg:order-2">
            <div className="relative w-full max-w-lg aspect-square flex flex-col items-center justify-center p-4 sm:p-8 text-center">
              
              {/* Concentric Circular Dashed Rings in Background */}
              <div className="absolute inset-0 rounded-full border border-dashed border-[#404c34]/45 pointer-events-none" />
              <div className="absolute inset-8 rounded-full border border-dashed border-[#404c34]/35 pointer-events-none" />
              <div className="absolute inset-16 rounded-full border border-dashed border-[#D8AE98]/40 pointer-events-none" />
              <div className="absolute inset-28 rounded-full border border-dashed border-[#404c34]/25 pointer-events-none" />

              {/* High-Tech Precision Telemetry Display */}
              <div className="relative z-10 space-y-5 max-w-sm w-full">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#404c34]/15 text-xs font-semibold text-[#625D45]">
                  <Sparkles className="w-3.5 h-3.5 text-[#D8AE98]" />
                  <span>دقت دیجیتال · {features[activeFeature].badge}</span>
                </div>

                {/* Laser & Telemetry Radar Graphic */}
                <div className="w-full h-44 sm:h-48 rounded-2xl bg-[#241E17] text-white p-5 flex flex-col justify-between relative overflow-hidden shadow-inner">
                  <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-[#D8AE98]/10 blur-xl pointer-events-none" />
                  
                  {/* Top Bar */}
                  <div className="flex items-center justify-between text-[11px] text-white/60 font-mono">
                    <span className="flex items-center gap-1.5 text-[#D8AE98]">
                      <span className="w-2 h-2 rounded-full bg-[#D8AE98] animate-pulse" />
                      MICRON_SCAN: ACTIVE
                    </span>
                    <span>TOLERANCE: ±0.01mm</span>
                  </div>

                  {/* Center Telemetry Waveform */}
                  <div className="py-2 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl sm:text-3xl font-bold font-mono text-[#F7F4EE] tracking-wider">
                        99.8%
                      </div>
                      <div className="text-[11px] text-[#404c34] mt-0.5">
                        {features[activeFeature].title}
                      </div>
                    </div>
                  </div>

                  {/* Specs micro-grid */}
                  <div className="grid grid-cols-2 gap-2 text-[10px] text-white/70 border-t border-white/10 pt-2 font-mono">
                    <div>SPEED: 4,500 fps</div>
                    <div className="text-left">AXIS: 5-AXIS CNC</div>
                  </div>
                </div>

                <p className="text-xs text-[#817C70] leading-relaxed">
                  {features[activeFeature].description}
                </p>

                <div className="pt-1">
                  <Link
                    href="#booking"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[#625D45] hover:text-[#302A21] transition-colors"
                  >
                    <span>رزرو اسکن دیجیتال در ویزیت اول</span>
                    <ArrowUpRight className="w-4 h-4 text-[#404c34]" />
                  </Link>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

    </section>
  );
}
