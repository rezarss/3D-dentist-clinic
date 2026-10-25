"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, Heart, Sparkles } from "lucide-react";

const HOME_STATS = [
  { value: 5, label: "مرحله در راهنمای درمان" },
  { value: 6, label: "پاسخ به پرسش‌های متداول" },
  { value: 2, label: "زبان وب‌سایت" },
  { value: 1, label: "مسیر ثبت درخواست نوبت" },
];

function AnimatedStat({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        observer.disconnect();
        startCounting();
      }
    }, { threshold: 0.5 });

    const startCounting = () => {
      const startTime = performance.now();
      const duration = 1200;
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const updateCount = (now: number) => {
        const progress = prefersReducedMotion ? 1 : Math.min((now - startTime) / duration, 1);
        const easedProgress = 1 - (1 - progress) ** 3;
        setCount(Math.round(value * easedProgress));
        if (progress < 1) frame = requestAnimationFrame(updateCount);
      };

      frame = requestAnimationFrame(updateCount);
    };

    observer.observe(element);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return <span ref={ref}>{count.toLocaleString("fa-IR")}</span>;
}

export function SampleHero() {
  const statsGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = statsGridRef.current;
    const cards = grid?.querySelectorAll<HTMLElement>(".scroll-reveal-card");
    if (!grid || !cards?.length) return;

    grid.classList.add("is-reveal-ready");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.2 },
    );

    cards.forEach((card) => observer.observe(card));
    return () => {
      observer.disconnect();
      grid.classList.remove("is-reveal-ready");
    };
  }, []);

  return (
    <section aria-label="معرفی کلینیک" className="relative pt-32 pb-16 overflow-hidden" id="top">
      {/* Ambient background glows */}
      <div className="sample-ambient sample-ambient-one" aria-hidden="true" />
      <div className="sample-ambient sample-ambient-two" aria-hidden="true" />
      <div
        className="absolute right-[-20%] top-[15%] z-0 h-[40%] w-[80%] opacity-90 blur-3xl pointer-events-none lg:right-[-20%] lg:top-[18%] lg:h-[50%] lg:w-[44%]"
        style={{ background: "radial-gradient(ellipse, rgba(0,109,95,.3), rgba(0,109,95,.12) 44%, transparent 74%)" }}
        aria-hidden="true"
      />
      <svg
        aria-hidden="true"
        className="absolute right-0 top-0 z-0 h-full w-[48%] pointer-events-none"
        viewBox="0 0 600 900"
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <linearGradient id="hero-curve-fade" x1="0" y1="0" x2="600" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor="#404c34" stopOpacity="0" />
            <stop offset=".48" stopColor="#404c34" stopOpacity=".12" />
            <stop offset="1" stopColor="#404c34" stopOpacity=".42" />
          </linearGradient>
          <linearGradient id="hero-curve-bottom-fade" x1="0" y1="0" x2="0" y2="900" gradientUnits="userSpaceOnUse">
            <stop offset=".68" stopColor="white" />
            <stop offset=".84" stopColor="white" stopOpacity=".55" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <mask id="hero-curve-bottom-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="600" height="900">
            <rect width="600" height="900" fill="url(#hero-curve-bottom-fade)" />
          </mask>
        </defs>
        <g stroke="url(#hero-curve-fade)" strokeWidth="1.5" opacity=".7" mask="url(#hero-curve-bottom-mask)">
          <path d="M620 -40C430 90 420 190 550 285S700 455 500 555 410 740 610 940" />
          <path d="M560 -40C370 90 360 190 490 285S640 455 440 555 350 740 550 940" />
          <path d="M500 -40C310 90 300 190 430 285S580 455 380 555 290 740 490 940" />
        </g>
      </svg>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Right Column: Hero Text */}
          <div className="lg:col-span-6 flex flex-col items-start text-right z-10">
            <div className="sample-eyebrow hero-enter mb-5" style={{ animationDelay: "150ms" }}>
              <span className="w-2 h-2 rounded-full bg-[#404c34] animate-pulse" />
              <span>به کلینیک تخصصی دندانپزشکی خوش آمدید</span>
            </div>

            <h1 className="hero-enter text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-black leading-[1.35] tracking-tight text-[#302A21] mb-6" style={{ animationDelay: "420ms" }}>
              آرامش در درمان،
              <br />
              <span className="font-light text-[#343F2B]">زیبایی در </span>
              <span className="relative inline-block text-[#302A21]">
                لبخند شما.
                <span 
                  className="absolute bottom-1 right-0 left-0 h-3.5 -z-10 rounded-full opacity-60 -rotate-1"
                  style={{ background: "linear-gradient(90deg, #d1cfbc, #404c34)" }}
                />
              </span>
            </h1>

            <p className="hero-enter text-base sm:text-lg text-[#756F62] leading-relaxed mb-8 max-w-xl" style={{ animationDelay: "690ms" }}>
              مراقبت خوب با شنیدن شروع می‌شود. از بررسی سلامت دهان و دندان تا انتخاب درمان‌های زیبایی و ترمیمی، تلاش می‌کنیم مسیر تصمیم‌گیری برای شما روشن، قابل‌فهم و آرام باشد.
            </p>

            <div className="hero-enter flex flex-wrap items-center gap-4 w-full sm:w-auto" style={{ animationDelay: "960ms" }}>
              <a
                href="#appointment"
                className="inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-2xl text-sm font-bold !text-white bg-[#404c34] hover:bg-[#343F2B] shadow-lg transition-all hover:-translate-y-1"
                style={{ 
                  boxShadow: "0 12px 30px rgba(64,76,52, 0.25)"
                }}
              >
                <span className="!text-white" style={{ color: "#ffffff" }}>درخواست مشاوره</span>
                <ArrowLeft className="w-4 h-4 !text-white" />
              </a>

              <a
                href="#services"
                className="inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-2xl text-sm font-bold text-[#302A21] bg-[#d1cfbc] hover:bg-[#c3c0aa] shadow-lg transition-all hover:-translate-y-1"
              >
                <span>آشنایی با خدمات</span>
                <ArrowLeft className="w-4 h-4" />
              </a>
            </div>

            <div className="hero-enter flex items-center gap-2 mt-8 text-xs text-[#8A8476]" style={{ animationDelay: "1230ms" }}>
              <span className="w-2 h-2 rounded-full bg-[#404c34]" />
              <span>نوبت‌دهی آنلاین ۲۴ ساعته · مشاوره اولیه اختصاصی</span>
            </div>
          </div>

          {/* Left Column: Visual Frame */}
          <div className="lg:col-span-6 relative z-10 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[500px] aspect-[4/4.4]">
              
              {/* Backing decorative glow */}
              <div 
                className="absolute inset-4 -inset-y-4 rounded-3xl opacity-75 filter blur-xl -z-10"
                style={{ background: "radial-gradient(circle at 60% 40%, #d1cfbc, #404c34)" }}
              />

              {/* Main Photo Frame */}
              <div className="absolute inset-0 hero-enter-left" style={{ animationDelay: "300ms" }}>
                <div className="relative w-full h-full rounded-[36px] overflow-hidden border-4 border-white/90 shadow-2xl bg-[#eae7dc] transform -rotate-1 hover:rotate-0 transition-transform duration-700">
                  <Image
                    src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=85"
                    alt="محیط مدرن و آرام کلینیک دندانپزشکی"
                    fill
                    className="object-cover object-center scale-100 hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#24221b]/40 via-transparent to-transparent" />

                  {/* Bottom Image Label */}
                  <div className="hero-enter absolute bottom-5 right-5 flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/85 backdrop-blur-md border border-white shadow-lg text-right" style={{ animationDelay: "1050ms" }}>
                    <div className="w-9 h-9 rounded-full bg-[#d1cfbc]/60 text-[#625D45] flex items-center justify-center shrink-0">
                      <Heart className="w-4 h-4" />
                    </div>
                    <div>
                      <b className="block text-xs font-bold text-[#302A21]">مراقبت با دقت</b>
                      <small className="block text-[10px] text-[#756F62]">آرامش در هر مرحله درمان</small>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Glass Pill on top-left */}
              <div className="sample-float-glass hero-float-enter" style={{ animationDelay: "1200ms" }}>
                <div className="sample-float-glass-motion flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d1cfbc] to-white text-[#625D45] flex items-center justify-center shadow-xs shrink-0">
                    <Sparkles className="w-5 h-5 text-[#404c34]" />
                  </div>
                  <div className="text-right">
                    <strong className="block text-xs font-bold text-[#302A21] whitespace-nowrap">
                      یک لبخند، یک مسیر شخصی
                    </strong>
                    <small className="block text-[10px] text-[#756F62] whitespace-nowrap">
                      از معاینه تا انتخاب درمان
                    </small>
                  </div>
                </div>
              </div>

              {/* Side watermark word */}
              <div 
                className="absolute -bottom-7 left-6 text-[10px] font-black tracking-[0.2em] text-[#404c34]/40 uppercase select-none pointer-events-none"
                dir="ltr"
              >
                SMILE IN DETAILS
              </div>
            </div>
          </div>

        </div>

        <div ref={statsGridRef} className="scroll-reveal-grid mt-14 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {HOME_STATS.map((stat, index) => (
            <div
              key={stat.label}
              className={`home-stat-card scroll-reveal-card scroll-reveal-card-${index + 1} relative rounded-2xl p-5 text-center shadow-[0_10px_28px_rgba(48,42,33,.08)]`}
            >
              <div className="text-3xl sm:text-4xl font-black tabular-nums text-[#404c34]">
                <AnimatedStat value={stat.value} />
              </div>
              <p className="mt-2 text-xs sm:text-sm font-semibold text-[#625D45]">{stat.label}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
