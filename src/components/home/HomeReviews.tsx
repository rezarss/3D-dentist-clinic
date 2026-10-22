"use client";

import { motion } from "motion/react";
import { 
  Star, 
  Quote, 
  CheckCircle2
} from "lucide-react";

export function HomeReviews() {
  const reviews = [
    {
      id: "1",
      name: "سارا محمدی",
      treatment: "۸ واحد لمینت سرامیکی E-max",
      date: "۱۴۰۳/۰۸/۱۲",
      rating: 5,
      comment: "از بچگی به خاطر فاصله دندان‌هایم اعتماد به نفس خندیدن نداشتم. خانم دکتر احمدی با ظرافت تمام و بدون کوچک‌ترین آسیبی به دندان‌هایم لبخندم را متحول کردند. محیط کلینیک فوق‌العاده آرامش‌بخش و شیک است.",
      doctor: "دکتر مریم احمدی",
    },
    {
      id: "2",
      name: "مهندس رضا کریمی",
      treatment: "کاشت ۲ واحد ایمپلنت دیجیتال",
      date: "۱۴۰۳/۰۷/۲۵",
      rating: 5,
      comment: "بزرگ‌ترین ترسم از جراحی ایمپلنت، درد و تورم بعد از عمل بود. با روش دیجیتال دکتر رضایی، حتی یک مسکن هم بعد از جراحی مصرف نکردم! از برخورد صمیمانه پرسنل و نظم وقت‌دهی سپاسگزارم.",
      doctor: "دکتر علی رضایی",
    },
    {
      id: "3",
      name: "دکتر پریسا رضوانی",
      treatment: "عصب‌کشی میکروسکوپی و ترمیم",
      date: "۱۴۰۳/۰۹/۰۴",
      rating: 5,
      comment: "دندان آسیابم را دو جا گفتند باید کشیده شود. با تخصص فوق‌العاده دکتر پیروز زیر میکروسکوپ جراحی، دندان حفظ شد و بدون درد درمان شد. تجهیزات واقعاً در سطح کلینیک‌های تاپ اروپاست.",
      doctor: "دکتر کاوه پیروز",
    },
  ];

  return (
    <section id="reviews" className="py-24 relative overflow-hidden">
      
      {/* Ambient Seamless Lighting */}
      <div 
        className="absolute top-1/2 left-1/3 w-96 h-96 rounded-full blur-[150px] opacity-20 pointer-events-none"
        style={{ background: "#404c34" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-4">
          <div className="text-xs font-semibold tracking-wider text-[#817C70] flex items-center justify-center gap-2">
            <span>تجربه و رضایت مراجعین</span>
            <span className="text-[#C2BFA9]">·</span>
            <span className="text-[#404c34]">نظرات موثق</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-[#302A21] tracking-tight text-balance">
            روایت لبخندهایی که ماندگار شدند
          </h2>

          <p className="text-base text-[#817C70] leading-relaxed text-pretty">
            بزرگ‌ترین افتخار ما، آرامش خاطر، آسودگی در حین درمان و رضایت همراه با اعتماد شما عزیزان است.
          </p>

          {/* Rating Summary (Clean Unboxed) */}
          <div className="pt-2 flex items-center justify-center gap-3">
            <div className="flex items-center gap-1 text-[#404c34]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#404c34]" />
              ))}
            </div>
            <span className="text-xs font-semibold text-[#302A21]">
              میانگین امتیاز ۴.۹ از ۵ (بیش از ۴۵۰ نظر ثبت‌شده مراجعین)
            </span>
          </div>
        </div>

        {/* Seamless Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, idx) => (
            <motion.div
              key={rev.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-8 rounded-3xl bg-[#FCFAF6] flex flex-col justify-between shadow-[0_12px_40px_rgba(48,42,33,0.03)] hover:shadow-[0_24px_55px_rgba(64,76,52,0.12)] hover:-translate-y-1 transition-all duration-300 text-right space-y-5"
            >
              <div className="space-y-4">
                {/* Header with Quote & Stars */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#404c34]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#404c34]" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-[#404c34]/40 rotate-180" />
                </div>

                {/* Treatment details */}
                <div className="text-xs font-semibold text-[#625D45]">
                  {rev.treatment}
                </div>

                {/* Comment Text */}
                <p className="text-sm text-[#817C70] leading-relaxed italic">
                  «{rev.comment}»
                </p>
              </div>

              {/* Author & Doctor Footer */}
              <div className="pt-4 border-t border-[#E8E2D5]/40 flex items-center justify-between text-xs">
                <div>
                  <strong className="text-[#302A21] block font-bold">{rev.name}</strong>
                  <span className="text-[11px] text-[#817C70]">پزشک: {rev.doctor}</span>
                </div>
                <div className="text-[11px] text-[#817C70] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#404c34]" />
                  <span>مراجع تأیید شده</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
