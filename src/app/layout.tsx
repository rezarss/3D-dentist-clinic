import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

const vazirmatn = localFont({
  src: "./fonts/vazirmatn/Vazirmatn[wght].woff2",
  variable: "--font-vazirmatn",
  weight: "100 900",
  display: "block",
  preload: true,
});

export const metadata: Metadata = {
  title: "کلینیک تخصصی دندانپزشکی | زیبایی، ایمپلنت و درمان‌های پیشرفته",
  description: "خدمات فوق‌تخصصی دندانپزشکی، ایمپلنت دیجیتال، لمینت سرامیکی و طراحی لبخند با کادر مجرب و نوبت‌دهی آنلاین.",
};

import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable} suppressHydrationWarning>
      <body className={`${vazirmatn.className} antialiased bg-white text-[#302A21]`}>
        <ThemeProvider>
          <SmoothScrollProvider>
            <SiteHeader />
            {children}
            <SiteFooter />
          </SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
