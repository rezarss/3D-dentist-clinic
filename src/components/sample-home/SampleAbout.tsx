"use client";

import Image from "next/image";
import { type PointerEvent } from "react";
import { ArrowLeft, ChevronDown, Heart, ShieldCheck, Sparkles } from "lucide-react";

export function SampleAbout() {
  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const pointerX = (event.clientX - bounds.left) / bounds.width - 0.5;
    const pointerY = (event.clientY - bounds.top) / bounds.height - 0.5;

    event.currentTarget.querySelectorAll<HTMLElement>("[data-about-shape]").forEach((shape) => {
      const depth = Number(shape.dataset.depth || 1);
      const rotation = Number(shape.dataset.rotation || 0);
      const translateX = (pointerX * 30 * depth).toFixed(1);
      const translateY = (pointerY * 24 * depth).toFixed(1);

      shape.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) rotate(${rotation + pointerX * 3}deg)`;
    });
  };

  const handlePointerLeave = (event: PointerEvent<HTMLElement>) => {
    event.currentTarget.querySelectorAll<HTMLElement>("[data-about-shape]").forEach((shape) => {
      shape.style.transform = `rotate(${Number(shape.dataset.rotation || 0)}deg)`;
    });
  };

  return (
    <section
      className="m-4 sm:m-6 lg:m-8 isolate relative overflow-hidden rounded-3xl bg-[#404c34] px-0 pb-20 pt-28"
      id="about"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        backgroundImage: "linear-gradient(180deg, #fff 0%, #fff 42%, rgba(255,255,255,.96) 50%, rgba(255,255,255,.72) 60%, rgba(255,255,255,.3) 70%, transparent 80%)",
      }}
    >
      <div className="sample-about-inner-glow" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden" aria-hidden="true">
        <span
          data-about-shape
          data-depth="1.1"
          data-rotation="0"
          className="absolute left-[8%] top-[24%] h-20 w-20 rounded-full border border-white/15 bg-white/[0.03] transition-transform duration-300 ease-out will-change-transform motion-reduce:transition-none"
        />
        <span
          data-about-shape
          data-depth="0.7"
          data-rotation="12"
          className="absolute right-[16%] top-[18%] h-24 w-24 bg-[#d1cfbc]/[0.09] transition-transform duration-500 ease-out will-change-transform motion-reduce:transition-none"
          style={{ clipPath: "polygon(25% 4%, 75% 4%, 100% 50%, 75% 96%, 25% 96%, 0 50%)", transform: "rotate(12deg)" }}
        />
        <span
          data-about-shape
          data-depth="1.4"
          data-rotation="-14"
          className="absolute left-[42%] top-[58%] h-14 w-14 rounded-lg border border-white/10 bg-white/[0.025] transition-transform duration-200 ease-out will-change-transform motion-reduce:transition-none"
          style={{ transform: "rotate(-14deg)" }}
        />
        <span
          data-about-shape
          data-depth="0.8"
          data-rotation="0"
          className="absolute bottom-[17%] right-[9%] h-28 w-28 rounded-full border border-[#d1cfbc]/15 transition-transform duration-500 ease-out will-change-transform motion-reduce:transition-none"
        />
        <span
          data-about-shape
          data-depth="1.2"
          data-rotation="28"
          className="absolute bottom-[20%] left-[18%] h-10 w-10 bg-white/[0.06] transition-transform duration-300 ease-out will-change-transform motion-reduce:transition-none"
          style={{ clipPath: "polygon(50% 0, 100% 100%, 0 100%)", transform: "rotate(28deg)" }}
        />
        <span
          data-about-shape
          data-depth="1.3"
          data-rotation="18"
          className="absolute left-[2%] top-[43%] h-12 w-12 bg-[#d1cfbc]/[0.1] transition-transform duration-300 ease-out will-change-transform motion-reduce:transition-none"
          style={{ clipPath: "polygon(25% 4%, 75% 4%, 100% 50%, 75% 96%, 25% 96%, 0 50%)", transform: "rotate(18deg)" }}
        />
        <span
          data-about-shape
          data-depth="0.9"
          data-rotation="-10"
          className="absolute left-[3%] bottom-[17%] h-14 w-14 rounded-full border border-white/20 transition-transform duration-500 ease-out will-change-transform motion-reduce:transition-none"
          style={{ transform: "rotate(-10deg)" }}
        />
        <span
          data-about-shape
          data-depth="1.1"
          data-rotation="34"
          className="absolute left-[44%] top-[29%] h-9 w-9 border border-[#d1cfbc]/20 transition-transform duration-200 ease-out will-change-transform motion-reduce:transition-none"
          style={{ transform: "rotate(34deg)" }}
        />
      </div>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute bottom-5 left-1/2 z-40 h-8 w-8 -translate-x-1/2 rotate-180 text-[#1b3446]"
        strokeWidth={2}
      />
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/2 z-30 h-[92px] w-[280px] max-w-[55vw] -translate-x-1/2"
        viewBox="0 0 280 92"
        preserveAspectRatio="none"
      >
        <path d="M0 92H280C235 92 218 84 199 61C183 40 162 0 140 0C118 0 97 40 81 61C62 84 45 92 0 92Z" fill="white" />
      </svg>
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Right Column: Visual Photo with Badge */}
          <div className="lg:col-span-5 relative">
            <div className="relative w-full aspect-[4/4.8] max-w-md mx-auto rounded-[32px] overflow-hidden border-4 border-white/90 shadow-2xl bg-[#d1cfbc]/40">
              <Image
                src="https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=1100&q=82"
                alt="گفت‌وگو و بررسی روند درمان در کلینیک دندانپزشکی"
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#24221b]/40 via-transparent to-transparent" />
            </div>

            {/* Stamp Badge */}
            <div className="absolute -bottom-6 -left-4 sm:left-4 px-5 py-3 rounded-2xl bg-white/90 backdrop-blur-md border border-white shadow-xl flex items-center gap-2.5 text-xs font-bold text-[#625D45]">
              <Sparkles className="w-4 h-4 text-[#404c34]" />
              <span className="tracking-widest font-black uppercase text-[11px]" dir="ltr">
                THE ART OF CARE
              </span>
            </div>
          </div>

          {/* Left Column: Copy Content */}
          <div className="lg:col-span-7 flex flex-col items-start text-right">
            <div className="sample-kicker" style={{ color: "#404c34" }}>
              <span className="sample-kicker-line" style={{ background: "#404c34" }} />
              <span>درباره کلینیک</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-[42px] font-black text-[#302A21] leading-[1.3] mb-6">
              پیش از درمان،
              <br />
              <em className="not-italic text-[#404c34]">زمانی برای شنیدن.</em>
            </h2>

            <p className="text-base text-[#625D45] leading-relaxed mb-8">
              در کلینیک تخصصی ما، هدف اصلی معرفی شفاف و روشن گزینه‌های درمان و خلق تجربه‌ای توأم با آرامش برای مراجعه‌کنندگان است. از اولین گفت‌وگوی تشخیصی تا مراقبت‌های پس از درمان، توضیح دقیق مراحل و پاسخ‌دهی صبورانه به دغدغه‌های شما بخش بنیادین این مسیر است.
            </p>

            {/* Benefits Boxes */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 py-6 border-y border-white/20 my-2">
              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-[#d1cfbc]/40 text-[#625D45] flex items-center justify-center shrink-0">
                  <Heart className="w-5 h-5 text-[#404c34]" />
                </div>
                <div>
                  <b className="block text-sm font-bold text-white mb-1">
                    پیش از هر تصمیم، شناخت نیاز
                  </b>
                  <small className="block text-xs text-[#d1cfbc] leading-normal">
                    شنیدن سؤال‌ها و اولویت‌های بالینی و فردی هر مراجعه‌کننده
                  </small>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-[#d1cfbc]/40 text-[#625D45] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-[#404c34]" />
                </div>
                <div>
                  <b className="block text-sm font-bold text-white mb-1">
                    انتخاب آگاهانه درمان
                  </b>
                  <small className="block text-xs text-[#d1cfbc] leading-normal">
                    آشنایی با مزایا، محدودیت‌ها، مراقبت‌ها و طرح درمان مکتوب
                  </small>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <a
                href="#appointment"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-sm font-bold text-[#302A21] bg-[#d1cfbc] hover:bg-[#ece9dd] shadow-lg transition-all hover:-translate-y-1"
                style={{ 
                  boxShadow: "0 10px 25px rgba(64,76,52, 0.2)"
                }}
              >
                <span>شروع یک مشاوره</span>
                <ArrowLeft className="w-4 h-4" />
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
