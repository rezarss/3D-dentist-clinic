"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, ChevronDown, ChevronUp, ArrowLeft, HelpCircle } from "lucide-react";

const CARE_STEPS = [
  {
    num: "۰۱",
    title: "ثبت درخواست و هماهنگی اولیه",
    subtitle: "انتخاب نوع خدمت و زمان مناسب برای برقراری ارتباط",
    description:
      "نوع خدمت مورد نیازتان را مشخص نموده و اطلاعات تماس را در فرم آنلاین ثبت می‌کنید. تیم پذیرش کلینیک در اولین فرصت جهت هماهنگی نهایی ساعت و پزشک مربوطه با شما تماس حاصل خواهد کرد.",
  },
  {
    num: "۰۲",
    title: "معاینه بالینی، شرح حال و ارزیابی دیجیتال",
    subtitle: "بررسی دقیق وضعیت دندان‌ها، لثه و اسکن دیجیتال ۳ بعدی",
    description:
      "پزشک متخصص وضعیت دهان، دندان و بافت‌های پیرامونی را بررسی کرده و در صورت لزوم رادیوگرافی دیجیتال CBCT یا اسکن نوری تهیه می‌شود تا تصویر جامعی از ساختار فک حاصل گردد.",
  },
  {
    num: "۰۳",
    title: "توضیح گزینه‌ها و طرح درمان اختصاصی",
    subtitle: "شفاف‌سازی کامل مزایا، زمان‌بندی، مراحل و برآورد هزینه‌ها",
    description:
      "پس از ارزیابی تشخیصی، تمامی گزینه‌های درمانی ممکن، طول دوره درمان، مراقبت‌های بعدی و برآورد هزینه با شما در میان گذاشته می‌شود تا با آگاهی و اطمینان کامل تصمیم‌گیری نمایید.",
  },
  {
    num: "۰۴",
    title: "اجرای دقیق درمان با تجهیزات مدرن",
    subtitle: "رعایت بالاترین استانداردهای استریلیزاسیون و آرامش کامل",
    description:
      "مراحل درمان طبق پروتکل اختصاصی طراحی‌شده با بهره‌گیری از بی‌حسی‌های بدون درد و ابزارهای میکروسکوپی آغاز می‌شود تا هیچ‌گونه اضطراب یا دردی احساس نکنید.",
  },
  {
    num: "۰۵",
    title: "پیگیری، مراقبت‌های پس از درمان و چکاپ دوره‌ای",
    subtitle: "تضمین ماندگاری درمان و حفظ سلامت پایدار لبخند",
    description:
      "پس از اتمام درمان، دستورالعمل‌های بهداشتی مراقبت در منزل ارائه شده و زمان‌بندی پیگیری‌های بعدی جهت اطمینان از سلامت بافت دندان و لثه تنظیم می‌گردد.",
  },
];

const FAQS = [
  {
    q: "اولین مراجعه به کلینیک معمولاً شامل چه مراحلی است؟",
    a: "در جلسه اول، دندانپزشک شرایط دهان و دندان را با تجهیزات نوری بررسی می‌کند، درباره سوابق پزشکی و دغدغه‌های شما گفت‌وگو شده و در صورت نیاز اسکن دیجیتال تهیه می‌شود. سپس گزینه‌های درمانی همراه با مدت زمان لازم توضیح داده می‌شوند.",
  },
  {
    q: "آیا قبل از شروع درمان، هزینه دقیق مشخص می‌شود؟",
    a: "بله، پس از انجام معاینه و تعیین طرح درمان اختصاصی، برآورد هزینه دقیق و تفکیک‌شده به همراه گزینه‌های مختلف پرداخت در اختیار شما قرار می‌گیرد.",
  },
  {
    q: "برای انجام ایمپلنت دیجیتال چه شرایطی لازم است؟",
    a: "کیفیت و تراکم استخوان فک، سلامت بافت لثه و وضعیت عمومی سلامت بررسی می‌شود. با روش ایمپلنت دیجیتال، حتی در صورت تحلیل استخوان نیز در اغلب موارد با پیوند پودر استخوان و بدون برش وسیع جراحی انجام‌پذیر است.",
  },
  {
    q: "تفاوت لمینت سرامیکی با ونیر کامپوزیت چیست و کدام بهتر است؟",
    a: "کامپوزیت با مواد رزینی مستقیماً روی دندان فرم داده می‌شود و در یک جلسه قابل انجام است؛ ونیرهای سرامیکی در لابراتوار ساخته شده، ثبات رنگ فوق‌العاده و درخشندگی ماندگارتری دارند. انتخاب به شرایط مینا و خط لبخند شما بستگی دارد.",
  },
  {
    q: "بعد از درمان‌های زیبایی یا جراحی به چه مراقبت‌هایی نیاز است؟",
    a: "رعایت بهداشت دهان با مسواک مخصوص، پرهیز از فشارهای سنگین در روزهای ابتدایی و شرکت در جلسات معاینه دوره‌ای تعیین‌شده اهمیت دارد. تمامی دستورالعمل‌ها به صورت مکتوب پس از درمان تحویل داده می‌شود.",
  },
  {
    q: "در صورت وجود دندان‌درد ناگهانی یا شرایط اورژانسی چه باید کرد؟",
    a: "خطوط مستقیم پذیرش کلینیک همواره آماده پذیرش موارد اورژانسی و تسکین فوری درد می‌باشند. کافی است بلافاصله با شماره‌های پذیرش کلینیک تماس حاصل فرمایید.",
  },
];

export function SampleCollapsibleGuideFaq() {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [openStep, setOpenStep] = useState<number>(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <section className="py-16 relative bg-white border-t border-[#E8E2D5]" id="care-guide">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* The Collapsible Preview Container */}
        <div 
          className={`sample-collapsible-wrapper ${isExpanded ? "is-expanded" : "is-collapsed"}`}
        >
          
          {/* ================= PART 1: CARE PROCESS STEPS ================= */}
          <div className="mb-20">
            
            {/* Heading */}
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 md:gap-16 mb-12">
              <div>
                <div className="sample-kicker">
                  <span className="sample-kicker-line" />
                  <span>روند مراجعه و انجام درمان</span>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-[42px] font-black text-[#302A21] leading-[1.3]">
                  از اولین تماس تا
                  <br />
                  <em className="not-italic text-[#404c34]">آخرین مرحله مراقبت.</em>
                </h2>
              </div>

              <div className="max-w-md text-right">
                <p className="text-sm text-[#756F62] leading-relaxed mb-3">
                  توضیح مرحله‌به‌مرحله فرآیند پذیرش، معاینه و درمان در کلینیک؛ روی هر مرحله بزنید تا جزئیات و اقدامات آن بخش نمایش داده شود.
                </p>
                <a 
                  href="#appointment" 
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#625D45] hover:text-[#302A21] transition group"
                >
                  <span>شروع درخواست نوبت</span>
                  <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

            {/* Layout: Visual sticky box + Accordion Steps */}
            <div className="care-guide-layout">
              
              {/* Visual Box */}
              <div className="care-guide-visual sample-glass-card shadow-lg border border-white">
                <div className="relative w-full h-[320px] rounded-2xl overflow-hidden bg-[#24221b]">
                  <Image
                    src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80"
                    alt="مراحل مراقبت دندانپزشکی"
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#24221b]/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 right-4 text-white">
                    <span className="text-[11px] font-bold text-[#d1cfbc] tracking-widest block mb-1">
                      ۰۱ — ۰۵
                    </span>
                    <h4 className="text-lg font-black text-white">
                      مراحل شفاف، تصمیم آگاهانه
                    </h4>
                  </div>
                </div>

                <div className="p-4 text-right">
                  <p className="text-xs text-[#756F62] leading-relaxed">
                    در هر گام، موضوعات درمانی، زمان‌بندی و مراقبت‌های لازم به زبان ساده و قابل‌فهم با شما در میان گذاشته می‌شود.
                  </p>
                </div>
              </div>

              {/* Steps Accordions */}
              <div className="care-guide-steps">
                {CARE_STEPS.map((step, idx) => {
                  const isOpen = openStep === idx;
                  return (
                    <div 
                      key={step.num}
                      className={`care-step transition-all duration-300 ${isOpen ? "open" : ""}`}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenStep(isOpen ? -1 : idx)}
                        className="w-full text-right flex items-center justify-between gap-4 p-5 sm:p-6"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <span className="step-index shrink-0">
                            {step.num}
                          </span>
                          <div className="text-right">
                            <strong className="block text-sm sm:text-base font-bold text-[#302A21] mb-1">
                              {step.title}
                            </strong>
                            <small className="block text-xs text-[#756F62]">
                              {step.subtitle}
                            </small>
                          </div>
                        </div>

                        <div className={`w-8 h-8 rounded-full bg-[#EAE5D9]/60 flex items-center justify-center text-[#625D45] transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}>
                          <Plus className="w-4 h-4" />
                        </div>
                      </button>

                      {isOpen && (
                        <div className="px-6 pb-6 pt-1 text-right text-xs sm:text-sm text-[#463F32] leading-relaxed border-t border-[#E8E2D5]/50 animate-in fade-in duration-200">
                          <p className="mb-3">{step.description}</p>
                          <a 
                            href="#appointment" 
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#625D45] hover:text-[#302A21]"
                          >
                            <span>ثبت نوبت برای این مرحله</span>
                            <ArrowLeft className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>

          </div>

          {/* ================= PART 2: CLINICAL FAQ ================= */}
          <div className="pt-10 border-t border-[#E8E2D5]" id="faq">
            
            {/* Heading */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-12">
              
              <div className="lg:col-span-5 text-right">
                <div className="sample-kicker">
                  <span className="sample-kicker-line" />
                  <span>پیش از مراجعه</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-[#302A21] leading-[1.3] mb-4">
                  پرسش‌های شما،
                  <br />
                  <em className="not-italic text-[#404c34]">پاسخ‌های روشن.</em>
                </h2>
                <p className="text-sm text-[#756F62] leading-relaxed mb-6">
                  دانستن چند نکته ساده درباره روند معاینه، نحوه انتخاب درمان و مراقبت‌های بعد از آن به برنامه‌ریزی بهتر شما کمک شایانی خواهد کرد.
                </p>

                <div className="p-6 rounded-3xl bg-gradient-to-br from-[#d1cfbc]/40 to-white/90 border border-white shadow-md relative overflow-hidden">
                  <span className="text-[11px] font-black tracking-widest text-[#625D45] uppercase block mb-1" dir="ltr">
                    CARE BEGINS WITH CLARITY.
                  </span>
                  <p className="text-xs text-[#756F62] leading-relaxed">
                    هر سوال یا ابهامی دارید، مشاوران کلینیک آماده ارائه توضیحات کامل پیش از ثبت هرگونه درمان هستند.
                  </p>
                </div>
              </div>

              {/* FAQs Accordion Column */}
              <div className="lg:col-span-7 space-y-3.5">
                {FAQS.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div
                      key={idx}
                      className="rounded-2xl border border-white/90 bg-white/80 backdrop-blur-md shadow-xs overflow-hidden transition-all duration-300"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        className="w-full text-right p-5 flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-[#302A21]"
                      >
                        <div className="flex items-center gap-3">
                          <HelpCircle className="w-4 h-4 text-[#404c34] shrink-0" />
                          <span>{faq.q}</span>
                        </div>
                        <span className={`w-7 h-7 rounded-lg bg-[#F7F4EE] flex items-center justify-center text-[#625D45] shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}>
                          <ChevronDown className="w-4 h-4" />
                        </span>
                      </button>

                      {isOpen && (
                        <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#463F32] leading-relaxed border-t border-[#E8E2D5]/50 animate-in fade-in duration-200">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>

          </div>

          {/* Fade Gradient Overlay when Collapsed */}
          {!isExpanded && (
            <div className="sample-collapsible-fade">
              <button
                type="button"
                onClick={() => setIsExpanded(true)}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-xs sm:text-sm font-bold text-white bg-[#404c34] hover:bg-[#343F2B] shadow-xl transition hover:scale-105"
                style={{ 
                  boxShadow: "0 10px 25px rgba(64,76,52, 0.35)"
                }}
              >
                <span>مشاهده توضیحات کامل و سوالات متداول (نمایش بیشتر)</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>

        {/* Toggle Collapse button when expanded */}
        {isExpanded && (
          <div className="flex justify-center pt-8 border-t border-[#E8E2D5]">
            <button
              type="button"
              onClick={() => {
                setIsExpanded(false);
                const el = document.getElementById("care-guide");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-xs font-bold text-[#625D45] bg-white border border-[#E8E2D5] shadow-xs hover:bg-gray-50 transition"
            >
              <span>بستن توضیحات و سوالات متداول</span>
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
