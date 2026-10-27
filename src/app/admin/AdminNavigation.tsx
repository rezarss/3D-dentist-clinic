"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const navigation = [
  { label: "داشبورد", href: "/admin", icon: "⌂" },
  { label: "نوبت‌ها", href: "/admin/appointments", icon: "▣" },
  { label: "دیدگاه‌ها", href: "/admin/comments", icon: "◉" },
  { label: "رضایت مراجعین", href: "/admin/testimonials", icon: "★" },
  { label: "برنامه نوبت‌دهی", href: "/admin/schedules", icon: "◫" },
  { label: "خدمات", href: "/admin/content/services", icon: "✦" },
  { label: "پزشکان", href: "/admin/content/doctors", icon: "♙" },
  { label: "صفحات", href: "/admin/content/pages", icon: "▤" },
  { label: "مقالات", href: "/admin/content/blog", icon: "▧" },
  { label: "دسته‌بندی مقالات", href: "/admin/content/blog/categories", icon: "◈" },
  { label: "نمونه‌کارها", href: "/admin/content/portfolio", icon: "✧" },
  { label: "دسته‌بندی نمونه‌کارها", href: "/admin/content/portfolio/categories", icon: "◇" },
  { label: "مجوزها و تقدیرنامه‌ها", href: "/admin/credentials", icon: "▣" },
  { label: "گالری تصاویر", href: "/admin/gallery", icon: "▧" },
  { label: "رسانه", href: "/admin/media", icon: "▧" },
  { label: "منوها", href: "/admin/menus", icon: "☰" },
  { label: "Redirectها", href: "/admin/redirects", icon: "↗" },
  { label: "تنظیمات", href: "/admin/settings", icon: "⚙" },
  { label: "ماژول‌ها", href: "/admin/integrations", icon: "◈" },
];

export function AdminNavigation() {
  const pathname = usePathname() ?? "";
  const navRef = useRef<HTMLElement>(null);
  const activeHref = navigation
    .filter((item) => item.href === "/admin" ? pathname === item.href : pathname === item.href || pathname.startsWith(item.href + "/"))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  useEffect(() => {
    function containWheelScroll(event: WheelEvent) {
      const nav = navRef.current;
      const target = event.target;
      if (!nav || !(target instanceof Node) || !nav.contains(target)) return;
      if (window.matchMedia("(max-width: 720px)").matches) return;

      event.preventDefault();
      if (nav.scrollHeight > nav.clientHeight) {
        nav.scrollTop += event.deltaY;
      }
    }

    window.addEventListener("wheel", containWheelScroll, { capture: true, passive: false });
    return () => window.removeEventListener("wheel", containWheelScroll, { capture: true });
  }, []);

  return (
    <nav ref={navRef} className="admin-nav" data-lenis-prevent-wheel>
      {navigation.map((item) => {
        const isActive = item.href === activeHref;
        return (
          <Link key={item.href} href={item.href} className={isActive ? "admin-nav-item active" : "admin-nav-item"} title={item.label} aria-current={isActive ? "page" : undefined}>
            <span className="admin-nav-icon">{item.icon}</span>
            <span>{item.label}</span>
            {isActive ? <span className="admin-nav-dot" /> : null}
          </Link>
        );
      })}
    </nav>
  );
}
