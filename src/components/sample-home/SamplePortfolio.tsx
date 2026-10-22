"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, Shield } from "lucide-react";

export type FormattedPortfolioItem = {
  _id: string;
  slug: string;
  title: { fa: string; en?: string };
  description: { fa: string; en?: string };
  treatment?: { fa?: string; en?: string };
  categorySlug?: string;
  categoryName?: string;
  images: string[];
  featureTitle?: string;
  featureSubtitle?: string;
};

type SamplePortfolioProps = {
  items: FormattedPortfolioItem[];
  categories: { slug: string; name: { fa: string; en?: string } }[];
};

const DEFAULT_FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=1200&q=84",
  "https://images.unsplash.com/photo-1606265752439-1f18756aa5fc?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80",
];

const toPersian = (n: number) => String(n).padStart(2, "0").replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);

export function SamplePortfolio({ items, categories }: SamplePortfolioProps) {
  const [activeCategorySlug, setActiveCategorySlug] = useState<string>(
    categories[0]?.slug || "smile"
  );

  // Find items for active category or fallback to available
  const activeItems = items.filter((item) => item.categorySlug === activeCategorySlug);
  const currentItem = activeItems[0] || items[0];

  const currentImages = currentItem?.images && currentItem.images.length >= 3
    ? currentItem.images
    : DEFAULT_FALLBACK_IMAGES;

  const currentIndex = categories.findIndex((c) => c.slug === activeCategorySlug);
  const counterStr = `${toPersian(currentIndex >= 0 ? currentIndex + 1 : 1)} / ${toPersian(categories.length || 4)}`;

  return (
    <section className="py-20 relative bg-[#F7F4EE]" id="cases">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 md:gap-16 mb-12">
          <div>
            <div className="sample-kicker">
              <span className="sample-kicker-line" />
              <span>گالری درمان و زیبایی</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-[42px] font-black text-[#302A21] leading-[1.3]">
              هر تصویر،
              <br />
              <em className="not-italic text-[#404c34]">بخشی از یک مسیر.</em>
            </h2>
          </div>

          <div className="max-w-md text-right">
            <p className="text-sm text-[#756F62] leading-relaxed mb-3">
              نمونه‌کارها و نتایج درمان‌های بالینی را بر اساس دسته‌بندی تخصصی مشاهده کنید. کلیه درمان‌ها با ارزیابی دقیق ساختار چهره و خط لبخند اجرا شده‌اند.
            </p>
            <a 
              href="#appointment" 
              className="inline-flex items-center gap-2 text-xs font-bold text-[#625D45] hover:text-[#302A21] transition group"
            >
              <span>دریافت مشاوره و ارزیابی لبخند</span>
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 mb-8" role="tablist">
          {categories.map((cat) => {
            const isActive = cat.slug === activeCategorySlug;
            return (
              <button
                key={cat.slug}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveCategorySlug(cat.slug)}
                className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-300 ${
                  isActive
                    ? "!bg-[#404c34] !text-white shadow-md scale-102"
                    : "bg-white/80 hover:bg-white text-[#625D45] border border-white/90 backdrop-blur-md"
                }`}
              >
                {cat.name.fa}
              </button>
            );
          })}
        </div>

        {/* Stage Container */}
        <div className="sample-glass-card rounded-[32px] p-5 sm:p-7 shadow-xl border border-white/90">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
            
            {/* Feature Image (Main) */}
            <div className="lg:col-span-8 relative aspect-[16/10] sm:aspect-[16/9.5] rounded-2xl sm:rounded-3xl overflow-hidden border border-white/80 shadow-md group">
              <Image
                src={currentImages[0]}
                alt={currentItem?.title?.fa || "نمونه درمان دندانپزشکی"}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-103"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#24221b]/85 via-transparent to-transparent" />

              <div className="absolute bottom-5 right-5 left-5 text-right text-white">
                <span className="inline-block text-[10px] font-bold tracking-widest text-[#d1cfbc] bg-white/20 backdrop-blur-md px-3 py-1 rounded-full mb-2">
                  گالری مراجعین
                </span>
                <strong className="block text-lg sm:text-2xl font-black text-white mb-1">
                  {currentItem?.featureTitle || currentItem?.title?.fa || "جزئیات در طراحی لبخند"}
                </strong>
                <small className="block text-xs sm:text-sm text-[#d1cfbc]/90">
                  {currentItem?.featureSubtitle || currentItem?.description?.fa || "زیبایی طبیعی با ارزیابی تخصصی تناسب چهره"}
                </small>
              </div>
            </div>

            {/* Side 2 Preview Photos */}
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4">
              <div className="relative flex-1 aspect-[16/10] sm:aspect-auto rounded-2xl overflow-hidden border border-white/80 shadow-sm group">
                <Image
                  src={currentImages[1]}
                  alt="زاویه نزدیک‌تر از درمان"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#24221b]/70 via-transparent to-transparent flex items-end p-4">
                  <span className="text-xs font-bold text-white">
                    نگاه نزدیک‌تر به درمان
                  </span>
                </div>
              </div>

              <div className="relative flex-1 aspect-[16/10] sm:aspect-auto rounded-2xl overflow-hidden border border-white/80 shadow-sm group">
                <Image
                  src={currentImages[2]}
                  alt="مراقبت متناسب با نیاز مراجع"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#24221b]/70 via-transparent to-transparent flex items-end p-4">
                  <span className="text-xs font-bold text-white">
                    مراقبت متناسب با ساختار دندان
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Foot Note */}
          <div className="flex items-center justify-between pt-5 mt-5 border-t border-[#E8E2D5] text-xs text-[#756F62]">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#404c34]" />
              <span>کلیه نمونه‌کارها مستندات بالینی واقعی مراجعین کلینیک می‌باشند.</span>
            </div>
            <span className="font-bold text-[#625D45]" dir="ltr">
              {counterStr}
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}
