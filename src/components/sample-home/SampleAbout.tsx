"use client";

import Image from "next/image";
import { ArrowLeft, Heart, ShieldCheck, Sparkles } from "lucide-react";

export function SampleAbout() {
  return (
    <section className="m-4 sm:m-6 lg:m-8 py-20 relative bg-[#404c34] rounded-3xl overflow-hidden" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
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
            <div className="sample-kicker" style={{ color: "#ece9dd" }}>
              <span className="sample-kicker-line" style={{ background: "#d1cfbc" }} />
              <span>درباره کلینیک</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-[42px] font-black text-white leading-[1.3] mb-6">
              پیش از درمان،
              <br />
              <em className="not-italic text-[#d1cfbc]">زمانی برای شنیدن.</em>
            </h2>

            <p className="text-base text-[#ece9dd] leading-relaxed mb-8">
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
