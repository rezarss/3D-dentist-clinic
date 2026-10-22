"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, Menu, X } from "lucide-react";

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);
  const [activeSection, setActiveSection] = useState("top");
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 15);

      // Compute top progress bar width
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? (scrollY / totalHeight) * 100 : 0;
      setScrollPercent(Math.min(100, Math.max(0, progress)));

      // Determine active section waypoint
      const sectionIds = [
        "care-guide",
        "appointment",
        "journal",
        "doctors",
        "stories",
        "cases",
        "about",
        "services",
        "top",
      ];

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          // If section top has arrived near viewport top
          if (rect.top <= 200 && rect.bottom >= 150) {
            setActiveSection(id);
            return;
          }
        }
      }

      if (scrollY < 120) {
        setActiveSection("top");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // run once on mount

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Escape key closes mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Do not show public site header on /admin routes
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      {/* 1. Page Scroll Progress Indicator (exact match with sample/index.html) */}
      <div aria-hidden="true" className="page-progress">
        <span style={{ width: `${scrollPercent}%` }} />
      </div>

      {/* 2. Floating Liquid-Glass Navigation Island (exact match with sample/index.html) */}
      <header
        ref={headerRef}
        id="page-header"
        className={`header-shell ${scrolled ? "scrolled" : ""}`}
      >
        <div className="header-glass">
          {/* Brand & Tooth Symbol */}
          <Link
            aria-label="کلینیک دندانپزشکی، صفحه اصلی"
            className="brand"
            href="/#top"
          >
            <span className="brand-sign" aria-hidden="true">
              <svg viewBox="0 0 40 40" fill="none" stroke="currentColor">
                <path
                  d="M20 8c-4-3-10-3-13 1-4 5-2 12 1 17 2 4 3 9 6 9 3 0 3-8 6-8s3 8 6 8c3 0 4-5 6-9 3-5 5-12 1-17-3-4-9-4-13-1Z"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="brand-word">
              کلینیک <small>DENTAL STUDIO</small>
            </span>
          </Link>

          {/* Desktop Nav in Central Floating Pill */}
          <nav aria-label="منوی اصلی" className="desktop-nav">
            <Link
              className={activeSection === "top" ? "is-active" : ""}
              href="/#top"
            >
              خانه
            </Link>
            <Link
              className={activeSection === "services" ? "is-active" : ""}
              href="/#services"
            >
              خدمات
            </Link>
            <Link
              className={activeSection === "about" ? "is-active" : ""}
              href="/#about"
            >
              درباره ما
            </Link>
            <Link
              className={activeSection === "cases" ? "is-active" : ""}
              href="/#cases"
            >
              نمونه‌کارها
            </Link>
            <Link
              className={activeSection === "stories" ? "is-active" : ""}
              href="/#stories"
            >
              تجربه بیماران
            </Link>
            <Link
              className={activeSection === "doctors" ? "is-active" : ""}
              href="/#doctors"
            >
              پزشکان
            </Link>
            <Link
              className={activeSection === "journal" ? "is-active" : ""}
              href="/#journal"
            >
              مقالات
            </Link>
            <Link
              className={activeSection === "care-guide" ? "is-active" : ""}
              href="/#care-guide"
            >
              روند درمان
            </Link>
            <Link
              className={pathname === "/home2" ? "is-active" : ""}
              href="/home2"
              title="مشاهده نسخه قبلی صفحه اصلی"
              style={{ opacity: 0.8, fontSize: "11.5px" }}
            >
              طرح قبلی
            </Link>
          </nav>

          {/* Header Actions: Booking Button & Mobile Menu Toggle */}
          <div className="header-actions">
            <Link className="header-book" href="/#appointment">
              <span>رزرو نوبت</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <button
              aria-controls="mobile-nav"
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? "بستن منو" : "باز کردن منو"}
              className="mobile-menu-toggle"
              id="menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <nav
          aria-label="فهرست موبایل"
          className="mobile-nav"
          hidden={!mobileMenuOpen}
          id="mobile-nav"
        >
          <Link
            className={activeSection === "top" ? "is-active" : ""}
            href="/#top"
            onClick={() => setMobileMenuOpen(false)}
          >
            خانه
          </Link>
          <Link
            className={activeSection === "services" ? "is-active" : ""}
            href="/#services"
            onClick={() => setMobileMenuOpen(false)}
          >
            خدمات
          </Link>
          <Link
            className={activeSection === "about" ? "is-active" : ""}
            href="/#about"
            onClick={() => setMobileMenuOpen(false)}
          >
            درباره ما
          </Link>
          <Link
            className={activeSection === "cases" ? "is-active" : ""}
            href="/#cases"
            onClick={() => setMobileMenuOpen(false)}
          >
            نمونه‌کارها
          </Link>
          <Link
            className={activeSection === "stories" ? "is-active" : ""}
            href="/#stories"
            onClick={() => setMobileMenuOpen(false)}
          >
            رضایت بیماران
          </Link>
          <Link
            className={activeSection === "doctors" ? "is-active" : ""}
            href="/#doctors"
            onClick={() => setMobileMenuOpen(false)}
          >
            پزشکان
          </Link>
          <Link
            className={activeSection === "journal" ? "is-active" : ""}
            href="/#journal"
            onClick={() => setMobileMenuOpen(false)}
          >
            مقالات و مجله
          </Link>
          <Link
            className={activeSection === "care-guide" ? "is-active" : ""}
            href="/#care-guide"
            onClick={() => setMobileMenuOpen(false)}
          >
            روند درمان و سوالات متداول
          </Link>
          <Link
            href="/home2"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: "#756F62", fontSize: "12.5px" }}
          >
            طرح قبلی صفحه اصلی (Home 2)
          </Link>
          <Link
            className="mobile-cta"
            href="/#appointment"
            onClick={() => setMobileMenuOpen(false)}
          >
            درخواست نوبت و مشاوره
          </Link>
        </nav>
      </header>
    </>
  );
}
