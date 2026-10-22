"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { 
  ChevronRight,
  ChevronLeft
} from "lucide-react";

export interface DoctorItem {
  _id: string;
  slug: string;
  name: { fa: string; en: string };
  shortBio?: { fa: string; en: string };
  specialty?: string;
  medicalCode?: string;
  university?: string;
  clinicDays?: string;
  image?: string;
}

interface HomeDoctorsProps {
  doctors?: DoctorItem[];
}

export function HomeDoctors({ doctors = [] }: HomeDoctorsProps) {
  // Canonical 4 doctors matching the exact names and titles from image.png
  const defaultDoctors = [
    {
      slug: "dr-narges-kazemi",
      name: "دکتر نرگس کاظمی",
      specialty: "متخصص کودکان",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
    },
    {
      slug: "dr-mehdi-rezaei",
      name: "دکتر مهدی رضایی",
      specialty: "متخصص زیبایی",
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80",
    },
    {
      slug: "dr-ali-hosseini",
      name: "دکتر علی حسینی",
      specialty: "متخصص ایمپلنت",
      image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80",
    },
    {
      slug: "dr-sara-mohammadi",
      name: "دکتر سارا محمدی",
      specialty: "متخصص ارتودنسی",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : defaultDoctors.length - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev < defaultDoctors.length - 1 ? prev + 1 : 0));
  };

  return (
    <section id="doctors" className="py-24 sm:py-32 relative bg-[#F7F4EE] overflow-hidden text-right">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column in RTL: Intro & Button (Matching image.png) */}
          <div className="lg:col-span-4 lg:col-start-1 flex flex-col items-start space-y-5">
            <span className="text-xs font-semibold text-[#817C70] tracking-wider">
              تیم متخصص ما
            </span>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#302A21] leading-tight tracking-tight">
              دندانپزشکان مجرب و دلسوز
            </h2>

            <p className="text-sm sm:text-base text-[#817C70] leading-relaxed text-pretty">
              با تجربه و دانش روز، در کنار شما هستیم تا بهترین خدمات درمانی و زیبایی را دریافت کنید.
            </p>

            <div className="pt-2">
              <Link
                href="/doctors"
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-full text-xs font-semibold !text-white bg-[#625D45] hover:bg-[#343F2B] transition-all duration-200 shadow-sm"
                style={{ color: "#ffffff" }}
              >
                <span className="!text-white font-semibold text-white" style={{ color: "#ffffff" }}>معرفی دکترها</span>
              </Link>
            </div>
          </div>

          {/* Right Column in RTL: 4 Doctor Cards + Navigation Buttons (Matching image.png) */}
          <div className="lg:col-span-8 lg:col-start-5 relative">
            
            {/* Desktop 4-in-a-row Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {defaultDoctors.map((doc) => (
                <div
                  key={doc.slug}
                  className="opacity-100 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <Link
                    href={`/doctors/${doc.slug}`}
                    className="group flex flex-col rounded-2xl bg-[#FCFAF6] border border-[#E8E2D5]/70 overflow-hidden hover:shadow-[0_16px_32px_rgba(64,76,52,0.18)] transition-all duration-300 text-center select-none"
                  >
                    {/* Doctor Portrait with clinical background & permanent SVG fallback */}
                    <div className="relative aspect-4/5 w-full bg-[#E8E2D5]/40 overflow-hidden">
                      {/* Stylized Doctor Silhouette Fallback */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-[#C2BFA9]/30 to-[#404c34]/20 text-[#625D45]">
                        <svg viewBox="0 0 100 120" fill="currentColor" className="w-24 h-28 opacity-40">
                          <circle cx="50" cy="35" r="20" />
                          <path d="M15 105c0-20 15-35 35-35s35 15 35 35v15H15v-15z" />
                          <path d="M45 75v20h10V75h-10z" fill="#D8AE98" opacity="0.6" />
                        </svg>
                      </div>

                      <Image
                        src={doc.image}
                        alt={doc.name}
                        fill
                        sizes="(max-width: 640px) 50vw, 20vw"
                        className="object-cover object-top group-hover:scale-104 transition-transform duration-500 relative z-10"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none z-20" />
                    </div>

                    {/* Bottom Info Box */}
                    <div className="p-4 flex flex-col items-center justify-between min-h-[90px]">
                      <h3 className="text-xs sm:text-sm font-bold text-[#302A21] group-hover:text-[#625D45] transition-colors line-clamp-1">
                        {doc.name}
                      </h3>
                      <p className="text-[11px] text-[#817C70] mt-1 font-medium">
                        {doc.specialty}
                      </p>
                      
                      {/* Subdued Chevron Arrow */}
                      <div className="text-[#817C70] group-hover:text-[#625D45] group-hover:-translate-x-1 transition-all mt-2">
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {/* Carousel navigation arrow button on right border (Matching image.png) */}
            <div className="hidden sm:flex absolute -left-5 top-1/2 -translate-y-1/2 z-20">
              <button
                type="button"
                onClick={nextSlide}
                className="w-9 h-9 rounded-full bg-white border border-[#E8E2D5] shadow-md flex items-center justify-center text-[#302A21] hover:bg-[#F7F4EE] transition-colors"
                aria-label="پزشک بعدی"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
