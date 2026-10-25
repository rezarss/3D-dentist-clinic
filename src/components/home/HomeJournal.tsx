"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { 
  ArrowLeft,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

export interface BlogPostItem {
  _id: string;
  slug: string;
  title: { fa: string; en: string };
  excerpt?: { fa: string; en: string };
  category?: string;
  readTime?: string;
  date?: string;
  image?: string;
}

interface HomeJournalProps {
  posts?: BlogPostItem[];
}

export function HomeJournal({ posts = [] }: HomeJournalProps) {
  // Canonical 3 articles matching image.png exactly
  const defaultArticles = [
    {
      slug: "all-about-dental-implants",
      title: "همه چیز درباره ایمپلنت دندان",
      date: "۱۴۰۳/۰۶/۱۵",
      image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=600&q=80",
    },
    {
      slug: "children-teeth-care-guide",
      title: "چگونه از دندان‌های کودکان مراقبت کنیم؟",
      date: "۱۴۰۳/۰۶/۲۸",
      image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80",
    },
    {
      slug: "post-implant-essential-tips",
      title: "نکات مهم بعد از ایمپلنت دندان",
      date: "۱۴۰۳/۰۷/۱۰",
      image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=600&q=80",
    },
  ];

  const displayArticles = posts && posts.length > 0
    ? posts.slice(0, 3).map((p, idx) => ({
        slug: p.slug || defaultArticles[idx]?.slug || `post-${idx}`,
        title: typeof p.title === "string" ? p.title : (p.title?.fa || defaultArticles[idx]?.title || ""),
        date: p.date || defaultArticles[idx]?.date || "۱۴۰۳/۰۶/۱۵",
        image: p.image || defaultArticles[idx]?.image || defaultArticles[0].image,
      }))
    : defaultArticles;

  return (
    <section id="journal" className="py-24 sm:py-32 relative bg-white overflow-hidden text-right">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Right Column in RTL: Intro & View All Button (Matching image.png) */}
          <div className="lg:col-span-4 lg:col-start-9 flex flex-col items-start space-y-5 order-1 lg:order-2">
            <span className="text-xs font-semibold text-[#817C70] tracking-wider">
              مقالات و مطالب
            </span>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#302A21] leading-tight tracking-tight">
              مطالب مفید برای سلامت دهان و دندان
            </h2>

            <p className="text-sm sm:text-base text-[#817C70] leading-relaxed text-pretty">
              جدیدترین مقالات و نکات مراقبتی برای داشتن دندان‌هایی سالم و زیبا.
            </p>

            <div className="pt-2">
              <Link
                href="/blog"
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-full text-xs font-semibold text-[#302A21] border border-[#404c34]/60 hover:bg-[#404c34] hover:text-white transition-all duration-200"
              >
                <span>مشاهده همه مقالات</span>
              </Link>
            </div>
          </div>

          {/* Left Column in RTL: 3 Article Cards + Navigation Buttons (Matching image.png) */}
          <div className="lg:col-span-8 lg:col-start-1 order-2 lg:order-1 relative">
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-stretch">
              {displayArticles.map((article) => (
                <div
                  key={article.slug}
                  className="opacity-100 transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col"
                >
                  <Link
                    href={`/blog/${article.slug}`}
                    className="group flex flex-col justify-between rounded-2xl bg-[#FCFAF6] border border-[#E8E2D5]/70 overflow-visible hover:shadow-[0_16px_35px_rgba(64,76,52,0.18)] transition-all duration-300 text-center select-none h-full relative"
                  >
                    <div className="flex-1 flex flex-col">
                      {/* Article Cover Image with permanent dental editorial graphic fallback */}
                      <div className="relative aspect-16/10 w-full bg-[#E8E2D5]/40 overflow-hidden shrink-0 rounded-t-2xl">
                        {/* Botanical Dental Aesthetic Fallback */}
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-tr from-[#404c34]/20 via-[#F7F4EE] to-[#D8AE98]/20">
                          <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" className="w-16 h-16 text-[#404c34] opacity-40">
                            <path d="M40 10C28 10 20 18 20 30c0 10 5 22 7 32 1.5 7 6 10 13 10s11.5-3 13-10c2-10 7-22 7-32 0-12-8-20-20-20z" strokeWidth="2" />
                            <path d="M30 40h20" strokeWidth="1.5" />
                          </svg>
                        </div>

                        <Image
                          src={article.image}
                          alt={article.title}
                          fill
                          sizes="(max-width: 640px) 100vw, 25vw"
                          className="object-cover group-hover:scale-104 transition-transform duration-500 relative z-10"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      {/* Title & Date */}
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        {/* Title with strict 2-line clamp and SEO preservation */}
                        <div className="relative group/title cursor-help">
                          <h3 
                            className="text-xs sm:text-sm font-bold text-[#302A21] group-hover:text-[#625D45] transition-colors line-clamp-2 leading-snug h-10 sm:h-11 text-center"
                            title={article.title}
                            style={{
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden"
                            }}
                          >
                            {article.title}
                          </h3>

                          {/* Full Title Floating Tooltip on Hover for Long Titles */}
                          <div 
                            role="tooltip"
                            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[240px] sm:max-w-[280px] px-3 py-2 rounded-xl bg-[#241E17] text-white text-[11px] sm:text-xs font-medium leading-relaxed text-center shadow-xl opacity-0 pointer-events-none group-hover/title:opacity-100 transition-all duration-200 z-50 border border-white/10"
                          >
                            <span style={{ fontFamily: "var(--font-vazirmatn), Vazirmatn, sans-serif" }}>
                              {article.title}
                            </span>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#241E17]" />
                          </div>
                        </div>

                        {/* Date rendered strictly in site font (Vazirmatn) */}
                        <p 
                          className="text-xs text-[#817C70] font-normal"
                          style={{ fontFamily: "var(--font-vazirmatn), Vazirmatn, sans-serif" }}
                        >
                          <span style={{ fontFamily: "var(--font-vazirmatn), Vazirmatn, sans-serif" }}>
                            {article.date}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Bottom Link Affordance */}
                    <div className="px-4 pb-4 pt-2.5 flex items-center justify-center gap-1.5 text-xs font-semibold text-[#404c34] group-hover:text-[#625D45] transition-colors mt-auto border-t border-[#E8E2D5]/30">
                      <span>مطالعه بیشتر</span>
                      <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {/* Left circular navigation arrow */}
            <div className="hidden lg:flex absolute -left-5 top-1/2 -translate-y-1/2 z-20">
              <button
                type="button"
                className="w-8 h-8 rounded-full bg-white border border-[#E8E2D5] shadow-md flex items-center justify-center text-[#302A21] hover:bg-[#F7F4EE] transition-colors"
                aria-label="مقاله قبلی"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Right circular navigation arrow */}
            <div className="hidden lg:flex absolute -right-5 top-1/2 -translate-y-1/2 z-20">
              <button
                type="button"
                className="w-8 h-8 rounded-full bg-white border border-[#E8E2D5] shadow-md flex items-center justify-center text-[#302A21] hover:bg-[#F7F4EE] transition-colors"
                aria-label="مقاله بعدی"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
