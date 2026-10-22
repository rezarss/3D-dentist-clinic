"use client";

import { useState } from "react";
import { 
  ChevronDown, 
  PhoneCall,
  HelpCircle,
  Sparkles
} from "lucide-react";

export function HomeFaq() {
  const faqs = [
    {
      id: "1",
      question: "آیا کاشت ایمپلنت دندان همراه با درد و خونریزی است؟",
      answer: "خیر؛ در کلینیک ما با استفاده از اسکن سه‌بعدی و شابلون جراحی دیجیتال (Guided Surgery)، ایمپلنت بدون نیاز به برش وسیع لثه و بخیه کاشته می‌شود. همراه با سیستم بی‌حسی دیجیتال کامپیوتری، در حین جراحی و پس از آن دردی احساس نخواهید کرد.",
      badge: "جراحی دیجیتال",
    },
    {
      id: "2",
      question: "تفاوت اصلی لمینت سرامیکی و کامپوزیت ونیر چیست؟",
      answer: "لمینت سرامیکی E-max در لابراتوار اختصاصی ساخته می‌شود، ضخامت بسیار کم (۰.۳ میلیمتر) دارد، رنگ‌پذیری آن صفر است و ماندگاری بالای ۱۵ سال دارد. کامپوزیت در یک جلسه مستقیماً روی دندان کار می‌شود، هزینه کمتری دارد اما نیازمند مراقبت بیشتر و پالیش سالانه است.",
      badge: "زیبایی دندان",
    },
    {
      id: "3",
      question: "آیا امکان پرداخت اقساطی برای درمان‌های ایمپلنت و زیبایی وجود دارد؟",
      answer: "بله، کلینیک برای رفاه مراجعین شرایط پرداخت اقساطی بدون کارمزد و بهره را فراهم کرده است. شرایط اقساط متناسب با برنامه زمانی درمان و با چک صیادی تنظیم می‌گردد.",
      badge: "تسهیلات مالی",
    },
    {
      id: "4",
      question: "آیا بیمه‌های تکمیلی درمان‌های کلینیک را پوشش می‌دهند؟",
      answer: "برای تمامی درمان‌های تخصصی (جراحی، کشیدن، عصب‌کشی، پروتز و ایمپلنت)، گواهی و فاکتور رسمی معتبر جهت ارائه به تمامی شرکت‌های بیمه تکمیلی (دانا، آسیا، البرز، ایران، معلم و...) صادر می‌گردد.",
      badge: "بیمه تکمیلی",
    },
    {
      id: "5",
      question: "معاینه و مشاوره اولیه چه مراحلی دارد؟",
      answer: "در جلسه اول، وضعیت فک و دندان‌ها به صورت بالینی و دیجیتال بررسی شده، عکس‌ها ارزیابی می‌شوند و طرح درمان شخصی‌سازی شده به همراه زمان‌بندی و برآورد دقیق هزینه در اختیارتان قرار می‌گیرد.",
      badge: "پذیرش اول",
    },
  ];

  // Default first item open
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({ "1": true });

  const toggle = (id: string) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section id="faq" className="py-24 relative overflow-hidden">
      
      {/* Seamless Ambient Light */}
      <div 
        className="absolute top-1/2 right-1/4 w-96 h-96 rounded-full blur-[150px] opacity-20 pointer-events-none"
        style={{ background: "#404c34" }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-14 space-y-4">
          <div className="text-xs font-semibold tracking-wider text-[#817C70] flex items-center justify-center gap-2">
            <HelpCircle className="w-4 h-4 text-[#404c34]" />
            <span>پاسخ به سوالات مراجعین</span>
            <span className="text-[#C2BFA9]">·</span>
            <span className="text-[#404c34]">راهنمای جامع بالینی</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-[#302A21] tracking-tight text-balance">
            پرسش‌های متداول مراجعین گرامی
          </h2>

          <p className="text-base text-[#817C70] leading-relaxed text-pretty">
            پاسخ موثق پزشکان کلینیک به پرتکرارترین سوالات پیرامون روش‌های درمان، هزینه‌ها و مراقبت‌های بالینی.
          </p>
        </div>

        {/* Resilient Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq) => {
            const isOpen = Boolean(openIds[faq.id]);
            return (
              <div
                key={faq.id}
                className={`rounded-3xl bg-[#FCFAF6] border transition-all duration-200 overflow-hidden text-right ${
                  isOpen 
                    ? "border-[#404c34]/50 shadow-[0_16px_40px_rgba(64,76,52,0.12)] ring-1 ring-[#404c34]/20"
                    : "border-[#E8E2D5]/40 shadow-[0_4px_16px_rgba(48,42,33,0.02)] hover:border-[#404c34]/30"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(faq.id)}
                  className="w-full p-6 sm:p-7 flex items-center justify-between gap-4 text-right cursor-pointer select-none transition-colors"
                  aria-expanded={isOpen}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 flex-1 text-right">
                    <span className="inline-block text-[11px] font-semibold text-[#817C70] bg-[#F7F4EE] px-2.5 py-1 rounded-full border border-[#E8E2D5]/50 w-fit">
                      {faq.badge}
                    </span>
                    <span className={`font-bold text-base sm:text-lg leading-snug transition-colors ${
                      isOpen ? "text-[#625D45]" : "text-[#302A21]"
                    }`}>
                      {faq.question}
                    </span>
                  </div>

                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180 bg-[#404c34] text-white shadow-xs" : "bg-[#F7F4EE] text-[#817C70]"
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {/* Direct Unconditional React Render When Open */}
                {isOpen && (
                  <div className="px-6 sm:px-7 pb-6 pt-1 text-sm sm:text-base text-[#817C70] leading-relaxed border-t border-[#E8E2D5]/40 transition-opacity">
                    <p className="mt-3 leading-loose text-justify text-pretty">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Additional Help Prompt */}
        <div className="mt-12 text-center p-8 rounded-3xl bg-[#FCFAF6] border border-[#E8E2D5]/50 shadow-[0_12px_40px_rgba(48,42,33,0.03)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-right">
            <h4 className="font-bold text-base text-[#302A21] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#404c34]" />
              <span>سوال دیگری درباره درمان خود دارید؟</span>
            </h4>
            <p className="text-xs text-[#817C70] mt-1">مشاوران پزشکی ما آماده پاسخگویی صبورانه به تمامی سوالات شما هستند.</p>
          </div>
          <a
            href="tel:02188880120"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold text-white bg-[#404c34] hover:bg-[#343F2B] transition-colors whitespace-nowrap shadow-xs"
          >
            <PhoneCall className="w-4 h-4" />
            <span>تماس فوری با پذیرش</span>
          </a>
        </div>

      </div>
    </section>
  );
}
