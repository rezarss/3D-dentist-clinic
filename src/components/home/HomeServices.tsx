"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { 
  ChevronLeft,
  ArrowLeft
} from "lucide-react";

export interface ServiceItem {
  _id: string;
  slug: string;
  title: { fa: string; en: string };
  excerpt?: { fa: string; en: string };
  category?: string;
  duration?: string;
  warranty?: string;
  suitableFor?: string;
}

interface HomeServicesProps {
  services?: ServiceItem[];
}

export function HomeServices({ services = [] }: HomeServicesProps) {
  // 8 canonical services shown in the reference image
  const defaultServices = [
    {
      slug: "implant",
      title: "ایمپلنت دندان",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
          <path d="M12 2C8.5 2 6 4.5 6 8c0 3 1.5 6.5 2 9.5.3 1.8 1.8 3.5 4 3.5s3.7-1.7 4-3.5c.5-3 2-6.5 2-9.5 0-3.5-2.5-6-6-6z" />
          <path d="M9 13h6" />
          <path d="M9.5 16h5" />
          <path d="M10 19h4" />
        </svg>
      ),
    },
    {
      slug: "laminate",
      title: "لمینت و ونیر",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
          <path d="M12 3c-4 0-7 2.5-7 6 0 3.5 1.5 7 2 10.5.4 2.5 2.2 3.5 3.5 1 .8-1.5 1.5-1.5 1.5-1.5s.7 0 1.5 1.5c1.3 2.5 3.1 1.5 3.5-1 .5-3.5 2-7 2-10.5 0-3.5-3-6-7-6z" />
          <path d="M8 8c1-1 3-1.5 4-1.5" />
        </svg>
      ),
    },
    {
      slug: "composite",
      title: "کامپوزیت",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
          <path d="M12 3C8 3 5.5 5.5 5.5 9c0 3 1.5 6.5 2 10 .4 2.5 2 3 3.5.5.8-1.5 1-1.5 1-1.5s.2 0 1 1.5c1.5 2.5 3.1 2 3.5-.5.5-3.5 2-7 2-10 0-3.5-2.5-6-6.5-6z" />
          <circle cx="12" cy="10" r="1.5" fill="currentColor" />
        </svg>
      ),
    },
    {
      slug: "root-canal",
      title: "عصب‌کشی",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
          <path d="M12 2C8 2 5.5 4.5 5.5 8c0 3 1.5 6.5 2 10 .4 2.5 2 3 3.5.5.8-1.5 1-1.5 1-1.5s.2 0 1 1.5c1.5 2.5 3.1 2 3.5-.5.5-3.5 2-7 2-10 0-3.5-2.5-6-6.5-6z" />
          <path d="M12 7v8" />
          <path d="M10 17l2 3 2-3" />
        </svg>
      ),
    },
    {
      slug: "crown",
      title: "روکش دندان",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
          <path d="M4 18h16l1-11-4.5 3.5L12 4 7.5 10.5 3 7l1 11z" />
          <circle cx="12" cy="14" r="1.5" fill="currentColor" />
        </svg>
      ),
    },
    {
      slug: "smile-design",
      title: "طراحی لبخند",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
          <path d="M4 9c3 6 13 6 16 0" />
          <path d="M6 10c2.5 4 9.5 4 12 0" />
          <path d="M8 11.5c1.5 2 6.5 2 8 0" />
        </svg>
      ),
    },
    {
      slug: "bleaching",
      title: "بلیچینگ و سفید کردن",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
          <path d="M12 3C8 3 5.5 5.5 5.5 9c0 3 1.5 6.5 2 10 .4 2.5 2 3 3.5.5.8-1.5 1-1.5 1-1.5s.2 0 1 1.5c1.5 2.5 3.1 2 3.5-.5.5-3.5 2-7 2-10 0-3.5-2.5-6-6.5-6z" />
          <path d="M16 6l1.5-2.5L19 6l2.5 1.5L19 9l-1.5 2.5L16 9l-2.5-1.5L16 6z" fill="currentColor" opacity="0.3" />
        </svg>
      ),
    },
    {
      slug: "surgery",
      title: "جراحی دندان",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
          <path d="M12 3C8 3 5.5 5.5 5.5 9c0 3 1.5 6.5 2 10 .4 2.5 2 3 3.5.5.8-1.5 1-1.5 1-1.5s.2 0 1 1.5c1.5 2.5 3.1 2 3.5-.5.5-3.5 2-7 2-10 0-3.5-2.5-6-6.5-6z" />
          <path d="M12 7v5" />
          <path d="M9.5 9.5h5" />
        </svg>
      ),
    },
  ];

  return (
    <section id="services" className="py-24 sm:py-32 relative bg-white overflow-hidden text-right">
      
      {/* Decorative Botanical & Sculpture Motif on far left edge */}
      <div className="absolute top-1/2 -left-12 -translate-y-1/2 w-72 h-96 pointer-events-none opacity-20 hidden xl:block">
        <svg viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#404c34]">
          <path d="M30 250C30 180 80 120 150 70C120 140 100 200 30 250Z" fill="currentColor" opacity="0.4" />
          <path d="M10 210C40 160 90 120 160 90C120 160 80 200 10 210Z" fill="currentColor" opacity="0.25" />
          <circle cx="140" cy="80" r="45" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Right Column: Title, Intro & View All Button (Matching image.png) */}
          <div className="lg:col-span-4 lg:col-start-9 flex flex-col items-start space-y-5 order-1 lg:order-2">
            <span className="text-xs font-semibold text-[#817C70] tracking-wider">
              خدمات ما
            </span>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#302A21] leading-tight tracking-tight">
              خدمات تخصصی دندانپزشکی
            </h2>

            <p className="text-sm sm:text-base text-[#817C70] leading-relaxed text-pretty">
              از درمان‌های پایه تا پیشرفته‌ترین خدمات زیبایی، همه در یک مکان و با بالاترین کیفیت.
            </p>

            <div className="pt-2">
              <Link
                href="/services"
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-full text-xs font-semibold text-[#302A21] border border-[#404c34]/60 hover:bg-[#404c34] hover:text-white transition-all duration-200"
              >
                <span>مشاهده همه خدمات</span>
              </Link>
            </div>
          </div>

          {/* Left Column: 8 Minimalist Icon Cards Grid (Matching image.png) */}
          <div className="lg:col-span-8 lg:col-start-1 order-2 lg:order-1">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {defaultServices.map((service, idx) => (
                <motion.div
                  key={service.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.45, delay: idx * 0.05, ease: "easeOut" }}
                  className="transition-all duration-300 transform hover:-translate-y-1"
                >
                  <Link
                    href={`/services/${service.slug}`}
                    className="group relative flex flex-col items-center justify-between p-6 h-40 sm:h-44 rounded-2xl bg-[#FCFAF6] border border-[#E8E2D5]/70 hover:border-[#404c34]/60 hover:shadow-[0_12px_30px_rgba(64,76,52,0.15)] transition-all duration-300 text-center select-none"
                  >
                    {/* Outline Tooth Icon */}
                    <div className="text-[#302A21] group-hover:text-[#625D45] transition-colors mt-2">
                      {service.icon}
                    </div>

                    {/* Service Persian Title */}
                    <span className="text-xs sm:text-sm font-bold text-[#302A21] group-hover:text-[#625D45] transition-colors line-clamp-1">
                      {service.title}
                    </span>

                    {/* Bottom Chevron Affordance (Matching image.png) */}
                    <div className="text-[#817C70] group-hover:text-[#625D45] group-hover:-translate-x-1 transition-all">
                      <ChevronLeft className="w-4 h-4" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>

    </section>
  );
}
