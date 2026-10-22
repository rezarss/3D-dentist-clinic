"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Phone, 
  Smartphone,
  Mail,
  MapPin, 
  Map
} from "lucide-react";

export function SiteFooter() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="relative bg-[#FCFAF6] border-t border-[#E8E2D5] text-[#302A21] pt-16 pb-10 overflow-hidden text-right">
      
      {/* Organic Curved Wave Transition at Top */}
      <div className="absolute top-0 left-0 right-0 h-6 -translate-y-full overflow-hidden pointer-events-none">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full text-[#FCFAF6] fill-current">
          <path d="M0,0 C150,90 350,-40 500,50 C650,140 900,10 1200,40 L1200,120 L0,120 Z" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Footer Row: 3 Columns matching image.png */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-[#E8E2D5]/70 items-center">
          
          {/* Column 1 (Right in RTL): Brand Identity & Social Icons */}
          <div className="md:col-span-4 flex flex-col items-start space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-[#404c34]/15 text-[#625D45] flex items-center justify-center">
                <svg 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.8" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="w-5 h-5"
                >
                  <path d="M12 2C8 2 5 4.5 5 8c0 3.5 1.5 7.5 2 11 .5 3.5 2.5 3 3.5 0 .8-2.4 1.5-2.5 1.5-2.5s.7.1 1.5 2.5c1 3 3 3.5 3.5 0 .5-3.5 2-7.5 2-11 0-3.5-3-6-7-6z" />
                </svg>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-base font-bold tracking-tight text-[#302A21]">
                  کلینیک دندانپزشکی
                </span>
                <span className="text-[10px] tracking-wider uppercase font-sans text-[#817C70]">
                  Smile & Health
                </span>
              </div>
            </Link>

            <p className="text-xs text-[#817C70] font-medium pt-1">
              لبخند شما، افتخار ماست
            </p>

            {/* Social Icons Row (Matching image.png: Instagram, Telegram, WhatsApp, LinkedIn) */}
            <div className="flex items-center gap-2.5 pt-2">
              {/* Instagram */}
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-[#E8E2D5] bg-white flex items-center justify-center text-[#817C70] hover:text-[#625D45] hover:border-[#404c34] transition-colors"
                aria-label="اینستاگرام کلینیک"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>

              {/* Telegram */}
              <a 
                href="https://t.me" 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-[#E8E2D5] bg-white flex items-center justify-center text-[#817C70] hover:text-[#625D45] hover:border-[#404c34] transition-colors"
                aria-label="تلگرام کلینیک"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </a>

              {/* WhatsApp */}
              <a 
                href="https://wa.me" 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-[#E8E2D5] bg-white flex items-center justify-center text-[#817C70] hover:text-[#625D45] hover:border-[#404c34] transition-colors"
                aria-label="واتساپ کلینیک"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
              </a>

              {/* LinkedIn */}
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-[#E8E2D5] bg-white flex items-center justify-center text-[#817C70] hover:text-[#625D45] hover:border-[#404c34] transition-colors"
                aria-label="لینکدین کلینیک"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2 (Center in RTL): Official Contact Information */}
          <div className="md:col-span-4 flex flex-col space-y-3 text-xs text-[#817C70]">
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-[#404c34] shrink-0" />
              <a 
                href="tel:07632254568"
                dir="ltr"
                className="hover:text-[#302A21] font-sans font-medium text-sm tracking-wide transition-colors"
                style={{ fontFamily: 'var(--font-vazirmatn), "Vazirmatn", sans-serif' }}
              >
                ۰۷۶-۳۲۲۵۴۵۶۸
              </a>
            </div>

            <div className="flex items-center gap-3">
              <Smartphone className="w-4 h-4 text-[#404c34] shrink-0" />
              <a 
                href="tel:09172345678"
                dir="ltr"
                className="hover:text-[#302A21] font-sans font-medium text-sm tracking-wide transition-colors"
                style={{ fontFamily: 'var(--font-vazirmatn), "Vazirmatn", sans-serif' }}
              >
                ۰۹۱۷۲۳۴۵۶۷۸
              </a>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-[#404c34] shrink-0" />
              <a 
                href="mailto:info@dentalclinic.ir" 
                dir="ltr"
                className="hover:text-[#302A21] font-sans text-xs tracking-wide transition-colors"
                style={{ fontFamily: 'var(--font-vazirmatn), "Vazirmatn", sans-serif' }}
              >
                info@dentalclinic.ir
              </a>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#404c34] shrink-0 mt-0.5" />
              <span className="leading-relaxed">
                بندرعباس، ابتدای خیابان سید جمال‌الدین اسدآبادی
              </span>
            </div>
          </div>

          {/* Column 3 (Left in RTL): Google Map Box with Button */}
          <div className="md:col-span-4 flex justify-start md:justify-end">
            <div className="relative w-full max-w-sm h-36 rounded-2xl overflow-hidden border border-[#E8E2D5] bg-[#EAE5D9]/40 flex items-center justify-center shadow-xs">
              
              {/* Map Illustration / Texture */}
              <div 
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage: "radial-gradient(#404c34 1px, transparent 1px)",
                  backgroundSize: "14px 14px"
                }}
              />

              {/* Pin Indicator */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm shadow-xs border border-[#E8E2D5] text-[11px] font-semibold text-[#302A21] mb-2">
                  <MapPin className="w-3.5 h-3.5 text-[#404c34]" />
                  <span>کلینیک دندانپزشکی</span>
                </div>

                <a 
                  href="https://maps.google.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold !text-white bg-[#625D45] hover:bg-[#343F2B] transition-colors shadow-sm"
                  style={{ color: "#ffffff" }}
                >
                  <Map className="w-3.5 h-3.5 text-white" style={{ color: "#ffffff" }} />
                  <span className="!text-white font-semibold text-white" style={{ color: "#ffffff" }}>مسیریابی با گوگل مپ</span>
                </a>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Legal Policies (Matching image.png) */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#817C70]">
          <p>© ۱۴۰۴، تمامی حقوق مادی و معنوی این وبسایت محفوظ است.</p>
          <div className="flex items-center gap-4 text-xs">
            <Link href="/privacy" className="hover:text-[#302A21] transition-colors">
              حریم خصوصی
            </Link>
            <span className="text-[#C2BFA9]">|</span>
            <Link href="/terms" className="hover:text-[#302A21] transition-colors">
              قوانین و مقررات
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
