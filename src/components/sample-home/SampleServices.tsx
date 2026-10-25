"use client";

import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useEffect, useRef } from "react";

export type FormattedService = {
  _id: string;
  slug: string;
  title: { fa: string; en?: string };
  excerpt: { fa: string; en?: string };
  category?: string;
  duration?: string;
  warranty?: string;
  image?: string;
};

type SampleServicesProps = {
  services: FormattedService[];
  onSelectService?: (serviceTitle: string, serviceId: string) => void;
};

const SERVICE_IMAGES = [
  "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1612531386530-97286d97c2d2?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=800&q=80",
];

const CATEGORY_TAGS = [
  "RESTORATIVE",
  "AESTHETIC",
  "PREVENTIVE",
  "ALIGNMENT",
  "PROSTHETIC",
  "ENDODONTIC",
];

const toPersian = (n: number) => String(n).padStart(2, "0").replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);

export function SampleServices({ services, onSelectService }: SampleServicesProps) {
  // Use DB services if available (limit to 6 for the 3x2 layout matching sample)
  const displayServices = services && services.length > 0 ? services.slice(0, 6) : [];
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    const cards = grid?.querySelectorAll<HTMLElement>(".scroll-reveal-card");
    if (!grid || !cards?.length) return;

    grid.classList.add("is-reveal-ready");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -30px 0px" },
    );

    cards.forEach((card) => observer.observe(card));
    return () => {
      observer.disconnect();
      grid.classList.remove("is-reveal-ready");
    };
  }, [displayServices.length]);

  return (
    <section className="sample-services-section py-20 relative bg-white" id="services">
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 md:gap-16 mb-12">
          <div>
            <div className="sample-kicker">
              <span className="sample-kicker-line" />
              <span>درمان و زیبایی</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-[42px] font-black text-[#302A21] leading-[1.3]">
              هر لبخند،
              <br />
              <em className="not-italic text-[#404c34]">مراقبتی متناسب.</em>
            </h2>
          </div>

          <div className="max-w-md text-right">
            <p className="text-sm text-[#756F62] leading-relaxed mb-3">
              از درمان‌های پیشگیرانه تا بازسازی عملکرد و زیبایی لبخند؛ با خدمات آشنا شوید و برای انتخاب مسیر مناسب با پزشک مشورت کنید.
            </p>
            <a 
              href="#appointment" 
              className="inline-flex items-center gap-2 text-xs font-bold text-[#625D45] hover:text-[#302A21] transition group"
            >
              <span>کمک برای انتخاب خدمت</span>
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

        {/* Services Grid (Matching sample 3-column with first card tall) */}
        <div className="sample-services-grid scroll-reveal-grid" ref={gridRef}>
          {displayServices.map((service, index) => {
            const isLarge = index === 0;
            const imgSrc = service.image || SERVICE_IMAGES[index % SERVICE_IMAGES.length];
            const tag = CATEGORY_TAGS[index % CATEGORY_TAGS.length];
            const indexStr = `${toPersian(index + 1)} / ${tag}`;
            const badgeTheme = index % 2 === 0
              ? "bg-[#404c34] text-white border-[#d1cfbc]/60"
              : "bg-[#d1cfbc] text-[#293321] border-[#ece9dd]";

            return (
              <a
                key={service._id}
                href="#appointment"
                onClick={() => {
                  if (onSelectService) {
                    onSelectService(service.title.fa, service._id);
                  }
                }}
                className={`sample-service-card scroll-reveal-card scroll-reveal-card-${index + 1} group ${isLarge ? "sample-service-card-large" : ""}`}
                aria-label={`درخواست مشاوره درباره ${service.title.fa}`}
              >
                <Image
                  src={imgSrc}
                  alt={service.title.fa}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105 group-hover:filter group-hover:saturate-110"
                  referrerPolicy="no-referrer"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#293321]/90 via-[#404c34]/25 to-transparent flex flex-col justify-between p-6 z-10 text-white">
                  
                  {/* Category index badge */}
                  <span 
                    className={`self-start text-[10px] font-bold tracking-widest backdrop-blur-md border px-3 py-1 rounded-full uppercase ${badgeTheme}`}
                    dir="ltr"
                  >
                    {indexStr}
                  </span>

                  {/* Caption glass card */}
                  <div className="service-caption-glass relative p-4 pr-5 rounded-2xl flex items-center justify-between gap-4 mt-auto">
                    <div className="text-right">
                      <h3 className="text-lg sm:text-xl font-black text-white mb-1">
                        {service.title.fa}
                      </h3>
                      <p className="text-xs text-[#ece9dd] line-clamp-2 leading-relaxed">
                        {service.excerpt.fa || "بررسی وضعیت دهان و درمان‌های تخصصی با جدیدترین متدهای دندانپزشکی دیجیتال"}
                      </p>
                    </div>

                    <div className="w-10 h-10 rounded-xl bg-[#d1cfbc] border border-[#ece9dd] backdrop-blur-md flex items-center justify-center text-[#293321] shrink-0 group-hover:bg-white group-hover:text-[#404c34] transition-colors">
                      <ArrowLeft className="w-4 h-4" />
                    </div>
                  </div>

                </div>
              </a>
            );
          })}
        </div>

      </div>
    </section>
  );
}
