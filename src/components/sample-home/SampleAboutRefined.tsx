"use client";

import Image from "next/image";
import { type PointerEvent, useEffect, useRef, useState } from "react";
import { ArrowLeft, ChevronDown, Heart, ShieldCheck, Sparkles } from "lucide-react";

export function SampleAboutRefined() {
  const sectionRef = useRef<HTMLElement>(null);
  const curveRef = useRef<SVGSVGElement>(null);
  const [border, setBorder] = useState({ path: "", width: 1, height: 1 });

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const pointerX = (event.clientX - bounds.left) / bounds.width - 0.5;
    const pointerY = (event.clientY - bounds.top) / bounds.height - 0.5;

    event.currentTarget.querySelectorAll<HTMLElement>("[data-about-shape]").forEach((shape) => {
      const depth = Number(shape.dataset.depth || 1);
      const rotation = Number(shape.dataset.rotation || 0);
      const translateX = (pointerX * 24 * depth).toFixed(1);
      const translateY = (pointerY * 20 * depth).toFixed(1);

      shape.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) rotate(${rotation + pointerX * 3}deg)`;
    });
  };

  const handlePointerLeave = (event: PointerEvent<HTMLElement>) => {
    event.currentTarget.querySelectorAll<HTMLElement>("[data-about-shape]").forEach((shape) => {
      shape.style.transform = `rotate(${Number(shape.dataset.rotation || 0)}deg)`;
    });
  };

  useEffect(() => {
    const section = sectionRef.current;
    const curve = curveRef.current;
    if (!section || !curve) return;

    const updateBorderPath = () => {
      const sectionRect = section.getBoundingClientRect();
      const curveRect = curve.getBoundingClientRect();
      const width = sectionRect.width;
      const height = sectionRect.height;
      const curveWidth = curveRect.width;
      const curveHeight = curveRect.height;
      if (!width || !height || !curveWidth || !curveHeight) return;

      const scaleX = curveWidth / 280;
      const scaleY = curveHeight / 92;
      const curveX = curveRect.left - sectionRect.left;
      const curveY = curveRect.top - sectionRect.top;
      const curvePoint = (x: number, y: number) =>
        `${(curveX + x * scaleX).toFixed(2)} ${(curveY + y * scaleY).toFixed(2)}`;
      const radius = Math.min(24, width / 2, height / 2);
      const path = [
        `M ${radius} 0`,
        `H ${width - radius}`,
        `Q ${width} 0 ${width} ${radius}`,
        `V ${height - radius}`,
        `Q ${width} ${height} ${width - radius} ${height}`,
        `L ${curvePoint(280, 92)}`,
        `C ${curvePoint(235, 92)} ${curvePoint(218, 84)} ${curvePoint(199, 61)}`,
        `C ${curvePoint(183, 40)} ${curvePoint(162, 0)} ${curvePoint(140, 0)}`,
        `C ${curvePoint(118, 0)} ${curvePoint(97, 40)} ${curvePoint(81, 61)}`,
        `C ${curvePoint(62, 84)} ${curvePoint(45, 92)} ${curvePoint(0, 92)}`,
        `L ${radius} ${height}`,
        `Q 0 ${height} 0 ${height - radius}`,
        `V ${radius}`,
        `Q 0 0 ${radius} 0`,
        "Z",
      ].join(" ");

      setBorder({ path, width, height });
    };

    updateBorderPath();
    const observer = new ResizeObserver(updateBorderPath);
    observer.observe(section);
    observer.observe(curve);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="about-refined-title"
      className="home-about-card relative isolate mx-4 mb-8 overflow-hidden rounded-3xl bg-[#f5f3ec] px-0 pb-24 pt-20 sm:mx-6 lg:mx-8"
      id="about-refined"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        backgroundImage:
          "radial-gradient(ellipse 34rem 28rem at 8% 8%, rgba(64,76,52,.08), transparent 72%)",
      }}
    >
      <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden" aria-hidden="true">
        <span
          data-about-shape
          data-depth="1"
          data-rotation="0"
          className="absolute left-[8%] top-[24%] h-24 w-24 rounded-full border border-[#596646]/40 bg-white/[0.05] transition-transform duration-300 ease-out will-change-transform motion-reduce:transition-none"
        />
        <span
          data-about-shape
          data-depth="0.7"
          data-rotation="12"
          className="absolute right-[16%] top-[18%] h-28 w-28 bg-[#596646]/[0.11] transition-transform duration-500 ease-out will-change-transform motion-reduce:transition-none"
          style={{ clipPath: "polygon(25% 4%, 75% 4%, 100% 50%, 75% 96%, 25% 96%, 0 50%)", transform: "rotate(12deg)" }}
        />
        <span
          data-about-shape
          data-depth="1.3"
          data-rotation="-14"
          className="absolute left-[42%] top-[58%] h-16 w-16 rounded-lg border border-[#596646]/[0.18] bg-white/[0.05] transition-transform duration-200 ease-out will-change-transform motion-reduce:transition-none"
          style={{ transform: "rotate(-14deg)" }}
        />
        <span
          data-about-shape
          data-depth="0.8"
          data-rotation="0"
          className="absolute bottom-[17%] right-[9%] h-32 w-32 rounded-full border border-[#596646]/[0.4] transition-transform duration-500 ease-out will-change-transform motion-reduce:transition-none"
        />
        <span
          data-about-shape
          data-depth="0.9"
          data-rotation="45"
          className="absolute right-[6%] top-[6%] h-12 w-12 border border-[#a58b52]/30 bg-[#a58b52]/[0.1] transition-transform duration-500 ease-out will-change-transform motion-reduce:transition-none"
          style={{ transform: "rotate(45deg)" }}
        />
        <span
          data-about-shape
          data-depth="1.1"
          data-rotation="28"
          className="absolute bottom-[20%] left-[18%] h-12 w-12 bg-[#596646]/[0.1] transition-transform duration-300 ease-out will-change-transform motion-reduce:transition-none"
          style={{ clipPath: "polygon(50% 0, 100% 100%, 0 100%)", transform: "rotate(28deg)" }}
        />
        <span
          data-about-shape
          data-depth="1.2"
          data-rotation="18"
          className="absolute left-[2%] top-[43%] h-14 w-14 bg-[#a58b52]/[0.13] transition-transform duration-300 ease-out will-change-transform motion-reduce:transition-none"
          style={{ clipPath: "polygon(25% 4%, 75% 4%, 100% 50%, 75% 96%, 25% 96%, 0 50%)", transform: "rotate(18deg)" }}
        />
      </div>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute bottom-5 left-1/2 z-40 h-8 w-8 -translate-x-1/2 rotate-180 text-[#404c34]"
        strokeWidth={2}
      />
      <svg
        ref={curveRef}
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/2 z-30 h-[92px] w-[280px] max-w-[55vw] -translate-x-1/2"
        viewBox="0 0 280 92"
        preserveAspectRatio="none"
      >
        <path d="M0 92H280C235 92 218 84 199 61C183 40 162 0 140 0C118 0 97 40 81 61C62 84 45 92 0 92Z" fill="white" />
      </svg>
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-40 h-full w-full"
        viewBox={`0 0 ${border.width} ${border.height}`}
        preserveAspectRatio="none"
      >
        <defs>
          <mask id="home-about-border-mask" maskUnits="userSpaceOnUse">
            <path
              d={border.path}
              fill="none"
              stroke="white"
              strokeWidth="7"
            />
          </mask>
        </defs>
        <foreignObject
          x="0"
          y="0"
          width={border.width}
          height={border.height}
          mask="url(#home-about-border-mask)"
        >
          <div className="home-about-border-gradient" />
        </foreignObject>
      </svg>

      <div className="relative z-20 mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-8">
        <div className="relative lg:col-span-5">
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute -right-[7%] top-1/2 z-0 h-[108%] w-[112%] -translate-y-1/2"
            viewBox="0 0 480 560"
            preserveAspectRatio="none"
          >
            <path
              d="M278 18C365 12 451 80 462 177C473 267 432 332 448 411C465 488 403 543 322 530C246 518 207 551 128 526C47 501 20 435 43 361C62 300 17 252 36 176C56 95 105 45 178 54C224 60 231 22 278 18Z"
              fill="#596646"
            />
          </svg>
          <div className="relative z-10 mx-auto aspect-[4/4.8] w-full max-w-md overflow-hidden rounded-[32px] border-[6px] border-white shadow-[0_24px_60px_rgba(48,42,33,.12)]">
            <Image
              src="https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=1100&q=82"
              alt="گفت‌وگو و بررسی روند درمان در کلینیک دندانپزشکی"
              fill
              className="object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#24221b]/30 via-transparent to-transparent" />
            <div className="absolute left-4 top-4 z-20 inline-flex items-center gap-2.5 rounded-2xl border border-white/30 bg-[#404c34] px-5 py-3 text-xs font-bold text-white shadow-[0_12px_32px_rgba(48,42,33,.3)] sm:left-5 sm:top-5">
              <Sparkles aria-hidden="true" className="h-4 w-4 shrink-0 text-[#d1cfbc]" />
              <span className="whitespace-nowrap text-[11px] font-black tracking-widest" dir="ltr">
                THE ART OF CARE
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start text-right lg:col-span-7">
          <div className="sample-kicker" style={{ color: "#68734f" }}>
            <span className="sample-kicker-line" style={{ background: "#a58b52" }} />
            <span>درباره کلینیک</span>
          </div>

          <h2
            className="mb-6 text-3xl font-black leading-[1.3] text-[#302a21] sm:text-4xl md:text-[42px]"
            id="about-refined-title"
          >
            پیش از درمان،
            <br />
            <em className="not-italic text-[#596646]">زمانی برای شنیدن.</em>
          </h2>

          <p className="mb-8 text-base leading-relaxed text-[#6d685d]">
            در کلینیک تخصصی ما، هدف اصلی معرفی شفاف و روشن گزینه‌های درمان و خلق تجربه‌ای توأم با آرامش برای مراجعه‌کنندگان است. از اولین گفت‌وگوی تشخیصی تا مراقبت‌های پس از درمان، توضیح دقیق مراحل و پاسخ‌دهی صبورانه به دغدغه‌های شما بخش بنیادین این مسیر است.
          </p>

          <div className="my-2 grid w-full grid-cols-1 gap-3 border-y border-[#ded9cb] py-6 sm:grid-cols-2">
            <div className="flex items-start gap-3.5 rounded-2xl bg-white/70 p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#eef0e8]">
                <Heart className="h-5 w-5 text-[#596646]" />
              </div>
              <div>
                <b className="mb-1 block text-sm font-bold text-[#39372f]">
                  پیش از هر تصمیم، شناخت نیاز
                </b>
                <small className="block text-xs leading-relaxed text-[#777266]">
                  شنیدن سؤال‌ها و اولویت‌های بالینی و فردی هر مراجعه‌کننده
                </small>
              </div>
            </div>

            <div className="flex items-start gap-3.5 rounded-2xl bg-white/70 p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#eef0e8]">
                <ShieldCheck className="h-5 w-5 text-[#596646]" />
              </div>
              <div>
                <b className="mb-1 block text-sm font-bold text-[#39372f]">
                  انتخاب آگاهانه درمان
                </b>
                <small className="block text-xs leading-relaxed text-[#777266]">
                  آشنایی با مزایا، محدودیت‌ها، مراقبت‌ها و طرح درمان مکتوب
                </small>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <a
              href="#appointment"
              className="inline-flex items-center gap-3 rounded-2xl bg-[#596646] px-8 py-4 text-sm font-bold text-white shadow-[0_10px_25px_rgba(64,76,52,.18)] transition-all hover:-translate-y-1 hover:bg-[#465238]"
            >
              <span className="text-white">شروع مشاوره</span>
              <ArrowLeft className="h-4 w-4 text-white" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
