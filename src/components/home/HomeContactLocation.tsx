"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { 
  MapPin, 
  Phone, 
  Clock, 
  Send, 
  CheckCircle, 
  Car, 
  Train
} from "lucide-react";

export function HomeContactLocation() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("مشاوره ایمپلنت");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setFormSubmitted(true);
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      
      {/* Seamless Ambient Light */}
      <div 
        className="absolute bottom-10 right-1/4 w-96 h-96 rounded-full blur-[150px] opacity-20 pointer-events-none"
        style={{ background: "#404c34" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-4">
          <div className="text-xs font-semibold tracking-wider text-[#817C70] flex items-center justify-center gap-2">
            <span>اطلاعات تماس و نشانی</span>
            <span className="text-[#C2BFA9]">·</span>
            <span className="text-[#404c34]">موقعیت مکانی کلینیک</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-[#302A21] tracking-tight text-balance">
            دسترسی آسان، پارکینگ اختصاصی و پاسخگویی سریع
          </h2>

          <p className="text-base text-[#817C70] leading-relaxed text-pretty">
            کلینیک در یکی از آرام‌ترین و در دسترس‌ترین نقاط شهر با امکانات کامل رفاهی برای همراهان و بیماران گرامی واقع شده است.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Right Info Cards (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Hours & Address Card */}
            <div className="p-7 sm:p-9 rounded-3xl bg-[#FCFAF6] shadow-[0_20px_50px_rgba(48,42,33,0.04)] space-y-6 text-right">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Working Hours */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#625D45]">
                    <Clock className="w-4 h-4 text-[#404c34]" />
                    <span>ساعات کاری پذیرش کلینیک</span>
                  </div>
                  <div className="space-y-1 text-xs text-[#817C70] pr-6">
                    <p>شنبه تا چهارشنبه: <strong className="text-[#302A21] font-semibold">۸:۳۰ الی ۲۱:۰۰</strong></p>
                    <p>پنج‌شنبه‌ها: <strong className="text-[#302A21] font-semibold">۸:۳۰ الی ۱۸:۰۰</strong></p>
                    <p>جمعه‌ها و تعطیلات: <strong className="text-[#404c34] font-semibold">پذیرش اورژانس ۱۰ الی ۱۶</strong></p>
                  </div>
                </div>

                {/* Direct Contacts */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#625D45]">
                    <Phone className="w-4 h-4 text-[#404c34]" />
                    <span>خطوط تلفن مستقیم</span>
                  </div>
                  <div className="space-y-1 text-xs text-[#817C70] pr-6">
                    <p>پذیرش اصلی: <a href="tel:02188880120" dir="ltr" className="font-sans font-bold text-[#302A21] hover:text-[#625D45] transition-colors" style={{ fontFamily: 'var(--font-vazirmatn), "Vazirmatn", sans-serif' }}>۰۲۱-۸۸۸۸۰۱۲۰</a></p>
                    <p>مشاوره فوری: <a href="tel:02188880121" dir="ltr" className="font-sans font-bold text-[#302A21] hover:text-[#625D45] transition-colors" style={{ fontFamily: 'var(--font-vazirmatn), "Vazirmatn", sans-serif' }}>۰۲۱-۸۸۸۸۰۱۲۱</a></p>
                    <p>پشتیبانی مراجعین: <span dir="ltr" className="font-sans font-bold text-[#625D45]" style={{ fontFamily: 'var(--font-vazirmatn), "Vazirmatn", sans-serif' }}>۰۹۱۲-۰۰۰۰۰۰۰</span></p>
                  </div>
                </div>

              </div>

              {/* Exact Address & Transit */}
              <div className="pt-6 border-t border-[#E8E2D5]/40 space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#404c34] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-sm text-[#302A21]">نشانی دقیق کلینیک:</h3>
                    <p className="text-xs text-[#817C70] leading-relaxed mt-1">
                      تهران، خیابان ولیعصر، بالاتر از میدان ونک، نرسیده به میرداماد، برج نگین، طبقه ۴، واحد ۴۰۲
                    </p>
                  </div>
                </div>

                {/* Transit details (clean unboxed) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-4 rounded-2xl bg-[#F7F4EE] flex items-center gap-2.5 text-xs">
                    <Car className="w-4 h-4 text-[#404c34] shrink-0" />
                    <span className="text-[#817C70]">پارکینگ اختصاصی رایگان برای مراجعین</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#F7F4EE] flex items-center gap-2.5 text-xs">
                    <Train className="w-4 h-4 text-[#404c34] shrink-0" />
                    <span className="text-[#817C70]">دسترسی ۵ دقیقه‌ای به ایستگاه BRT ونک</span>
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-full bg-[#F7F4EE] hover:bg-[#404c34] hover:text-white text-xs font-semibold text-[#302A21] inline-flex items-center gap-1.5 transition-all"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#404c34]" />
                  <span>مسیریابی در گوگل مپ</span>
                </a>
                <a
                  href="https://nshn.ir"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-full bg-[#F7F4EE] hover:bg-[#404c34] hover:text-white text-xs font-semibold text-[#302A21] inline-flex items-center gap-1.5 transition-all"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#404c34]" />
                  <span>مسیریابی با نشان</span>
                </a>
                <a
                  href="https://balad.ir"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-full bg-[#F7F4EE] hover:bg-[#404c34] hover:text-white text-xs font-semibold text-[#302A21] inline-flex items-center gap-1.5 transition-all"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#404c34]" />
                  <span>مسیریابی با بلد</span>
                </a>
              </div>

            </div>

          </div>

          {/* Left Form: Fast Callback Request (5 cols) */}
          <div className="lg:col-span-5">
            <div className="p-7 sm:p-9 rounded-3xl bg-[#FCFAF6] shadow-[0_20px_50px_rgba(48,42,33,0.04)] text-right space-y-5">
              
              <div className="space-y-1">
                <span className="text-xs font-semibold text-[#404c34]">مشاوره اختصاصی تلفنی</span>
                <h3 className="text-xl font-bold text-[#302A21]">
                  درخواست تماس کارشناس پذیرش
                </h3>
                <p className="text-xs text-[#817C70] leading-relaxed">
                  شماره خود را ثبت کنید تا در کمتر از ۱۵ دقیقه کاری با شما تماس بگیریم.
                </p>
              </div>

              {formSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-6 rounded-2xl bg-[#404c34]/15 text-right space-y-3"
                >
                  <div className="flex items-center gap-2 text-[#625D45] font-bold text-sm">
                    <CheckCircle className="w-5 h-5 text-[#404c34]" />
                    <span>درخواست شما با موفقیت ثبت شد</span>
                  </div>
                  <p className="text-xs text-[#817C70] leading-relaxed">
                    کارشناس پذیرش در اسرع وقت با شماره <strong className="dir-ltr inline-block text-[#302A21] font-mono">{phone}</strong> تماس خواهد گرفت.
                  </p>
                  <button
                    onClick={() => {
                      setFormSubmitted(false);
                      setPhone("");
                      setFullName("");
                    }}
                    className="text-xs font-bold text-[#404c34] hover:underline pt-2 block"
                  >
                    ثبت درخواست شماره دیگر
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#302A21] block">نام و نام خانوادگی:</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="مثال: مریم کریمی"
                      className="w-full px-4 py-3 rounded-2xl bg-[#F7F4EE] border-0 text-sm text-[#302A21] placeholder-[#817C70]/50 focus:outline-none focus:ring-2 focus:ring-[#404c34]/40"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#302A21] block">شماره تلفن همراه (ضروری):</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                      className="w-full px-4 py-3 rounded-2xl bg-[#F7F4EE] border-0 text-sm text-[#302A21] placeholder-[#817C70]/50 focus:outline-none focus:ring-2 focus:ring-[#404c34]/40 dir-ltr text-right"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#302A21] block">نوع درمان مدنظر:</label>
                    <select
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-[#F7F4EE] border-0 text-sm text-[#302A21] focus:outline-none focus:ring-2 focus:ring-[#404c34]/40 cursor-pointer"
                    >
                      <option value="مشاوره ایمپلنت دیجیتال">مشاوره ایمپلنت دیجیتال</option>
                      <option value="اصلاح طرح لبخند و لمینت">اصلاح طرح لبخند و لمینت</option>
                      <option value="کامپوزیت ونیر">کامپوزیت ونیر</option>
                      <option value="درمان ریشه (عصب‌کشی)">درمان ریشه (عصب‌کشی)</option>
                      <option value="معاینه جامع و چکاپ">معاینه جامع و چکاپ</option>
                      <option value="سایر موارد">سایر موارد</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-full bg-[#404c34] hover:bg-[#343F2B] active:bg-[#625D45] text-white text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_6px_20px_rgba(64,76,52,0.3)] mt-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>ارسال درخواست تماس کارشناس</span>
                  </button>

                  <p className="text-[11px] text-[#817C70] text-center pt-1">
                    اطلاعات شما نزد کلینیک کاملاً محفوظ است و صرفاً جهت مشاوره استفاده می‌شود.
                  </p>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
