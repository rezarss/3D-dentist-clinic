"use client";

import { CalendarDays, PhoneCall } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import creamBackground from "../../../bg2.webp";
import greenBackground from "../../../bg1.webp";
import doctorImage from "../../../doctor.webp";

type PromoBannerProps = {
  option: string;
  variant: "green" | "cream";
};

function PromoBanner({ option, variant }: PromoBannerProps) {
  const bannerRef = useRef<HTMLElement>(null);
  const isGreen = variant === "green";
  const textClass = isGreen ? "text-[#F7F4EE]" : "text-[#404c34]";
  const descriptionClass = isGreen ? "text-[#F7F4EE]/80" : "text-[#625D45]";
  const backgroundImage = isGreen ? greenBackground : creamBackground;
  const primaryButtonClass = isGreen
    ? "bg-[#F7F4EE] text-[#404c34] hover:bg-white"
    : "bg-[#404c34] text-[#F7F4EE] hover:bg-[#343F2B]";
  const secondaryButtonClass = isGreen
    ? "border border-[#F7F4EE]/45 text-[#F7F4EE] hover:bg-white/10"
    : "border border-[#404c34]/35 text-[#404c34] hover:bg-[#404c34]/5";

  useEffect(() => {
    const banner = bannerRef.current;
    if (!banner) return;

    const elements = banner.querySelectorAll<HTMLElement>("[data-promo-reveal]");
    banner.classList.add("is-reveal-ready");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => {
      observer.disconnect();
      banner.classList.remove("is-reveal-ready");
    };
  }, []);

  return (
    <section
      ref={bannerRef}
      aria-label={option}
      className="relative isolate min-h-[350px] sm:min-h-[250px]"
      dir="rtl"
    >
      <div
        data-promo-reveal
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-xl promo-reveal-background"
      >
        <Image
          src={backgroundImage}
          alt=""
          fill
          sizes="(max-width: 1280px) 100vw, 1280px"
          className="object-cover"
        />
      </div>
      <div
        data-promo-reveal
        className="pointer-events-none absolute -left-2 -top-16 bottom-0 z-20 w-[42%] sm:-top-20 sm:w-[36%] promo-reveal-doctor"
      >
        <Image
          src={doctorImage}
          alt="دندان‌پزشک کلینیک"
          fill
          sizes="(max-width: 640px) 42vw, 36vw"
          className="object-contain object-bottom"
        />
      </div>

      <div className={`relative z-10 flex min-h-[350px] items-center px-5 py-8 sm:min-h-[250px] sm:px-10 ${textClass}`}>
        <div className="w-[62%] text-right">
          <span
            data-promo-reveal
            className={`promo-reveal-item mb-2 block text-xs font-bold ${isGreen ? "text-[#F7F4EE]/65" : "text-[#625D45]"}`}
            style={{ transitionDelay: "100ms" }}
          >
            {option}
          </span>
          <h2 data-promo-reveal className="promo-reveal-item mb-2 text-xl font-black leading-snug sm:text-2xl" style={{ transitionDelay: "220ms" }}>
            کاشت تخصصی ایمپلنت
          </h2>
          <p
            data-promo-reveal
            className={`promo-reveal-item mb-5 max-w-xl text-xs leading-6 sm:text-sm ${descriptionClass}`}
            style={{ transitionDelay: "340ms" }}
          >
            همین حالا برای مشاوره رایگان و بررسی وضعیت دندان‌های خود اقدام کنید.
          </p>
          <div data-promo-reveal className="promo-reveal-item flex flex-col gap-2 sm:flex-row sm:gap-3" style={{ transitionDelay: "460ms" }}>
            <a
              href="#appointment"
              className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-4 py-2 text-xs font-bold transition-colors ${primaryButtonClass}`}
            >
              <CalendarDays className={`h-4 w-4 ${isGreen ? "text-[#404c34]" : "text-[#F7F4EE]"}`} aria-hidden="true" />
              <span className={isGreen ? "text-[#404c34]" : "text-[#F7F4EE]"}>رزرو نوبت آنلاین</span>
            </a>
            <a
              href="#appointment"
              className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-4 py-2 text-xs font-bold transition-colors ${secondaryButtonClass}`}
            >
              <PhoneCall className="h-4 w-4" aria-hidden="true" />
              <span>مشاوره رایگان</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SamplePromoBannerOptions() {
  return (
    <div className="py-8 sm:py-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 sm:px-6 lg:px-8">
        <PromoBanner option="گزینه ۱ | پس‌زمینه سبز" variant="green" />
      </div>
    </div>
  );
}