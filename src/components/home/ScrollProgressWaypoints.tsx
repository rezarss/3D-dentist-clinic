"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

const SECTIONS = [
  { id: "hero", label: "سفر لبخند", num: "۰۱" },
  { id: "technology", label: "تکنولوژی دیجیتال", num: "۰۲" },
  { id: "booking", label: "نوبت‌دهی آنلاین", num: "۰۳" },
  { id: "services", label: "خدمات تخصصی", num: "۰۴" },
  { id: "doctors", label: "پزشکان متخصص", num: "۰۵" },
  { id: "portfolio", label: "نمونه‌کارها", num: "۰۶" },
  { id: "journal", label: "مجله سلامت", num: "۰۷" },
];

export function ScrollProgressWaypoints() {
  const [activeSection, setActiveSection] = useState("hero");
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const totalH = document.documentElement.scrollHeight - window.innerHeight;
      if (totalH > 0) {
        setScrollPercent(Math.round((scrollY / totalH) * 100));
      }

      // Detect which section is currently in view
      const sectionElements = SECTIONS.map((s) => ({
        id: s.id,
        el: document.getElementById(s.id),
      }));

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const item = sectionElements[i];
        if (item.el) {
          const rect = item.el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.45) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-center gap-4 select-none pointer-events-none">
      
      {/* Delicate Vertical Rail */}
      <div className="w-[1px] h-20 bg-[#E8E2D5] relative overflow-hidden">
        <motion.div 
          className="w-full bg-[#404c34] absolute top-0"
          style={{ height: `${scrollPercent}%` }}
        />
      </div>

      {/* Section Dots with Persian Numerals */}
      <div className="flex flex-col items-center gap-3 pointer-events-auto">
        {SECTIONS.map((s) => {
          const isActive = activeSection === s.id;
          return (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className="group relative flex items-center justify-center p-1 cursor-pointer transition-all focus:outline-none"
              title={s.label}
              aria-label={s.label}
            >
              {/* Dot */}
              <div className={`rounded-full transition-all duration-300 ${
                isActive 
                  ? "w-2.5 h-2.5 bg-[#625D45] scale-125 ring-4 ring-[#404c34]/20"
                  : "w-1.5 h-1.5 bg-[#817C70]/40 group-hover:bg-[#404c34] group-hover:scale-110"
              }`} />

              {/* Hover Tooltip Label - Positioned to the right of the dot */}
              <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-[#FCFAF6] border border-[#E8E2D5] text-xs font-medium text-[#302A21] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none shadow-sm flex items-center gap-2">
                <span className="text-[#404c34] font-semibold">{s.num}</span>
                <span>{s.label}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Percentage Indicator */}
      <div className="text-[11px] font-medium text-[#817C70] pt-1">
        {scrollPercent.toLocaleString("fa-IR")}٪
      </div>

    </div>
  );
}
