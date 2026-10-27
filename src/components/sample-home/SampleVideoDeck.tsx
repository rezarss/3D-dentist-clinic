"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronRight, ChevronLeft, Play, User } from "lucide-react";
import { VideoModal } from "./VideoModal";
import Link from "next/link";

export type FormattedTestimonial = {
  _id: string;
  patientName: { fa: string; en?: string };
  treatment?: { fa?: string; en?: string };
  comment?: { fa?: string; en?: string };
  rating: number;
  videoUrl?: string;
  coverImageUrl?: string;
  featured?: boolean;
};

type SampleVideoDeckProps = {
  testimonials: FormattedTestimonial[];
};

const toPersian = (n: number) => String(n).padStart(2, "0").replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);

export function SampleVideoDeck({ testimonials }: SampleVideoDeckProps) {
  // Filter video & featured testimonials for the 3D deck
  const items = testimonials.length > 0 ? testimonials : [];
  const [active, setActive] = useState(0);
  const [modalVideo, setModalVideo] = useState<{ url: string; title: string } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const pointerStartRef = useRef<{ pointerId: number; x: number; y: number } | null>(null);
  const draggedRef = useRef(false);

  // Auto-slide every 6.5s if modal is closed
  useEffect(() => {
    if (items.length <= 1 || modalVideo || isDragging) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % items.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [items.length, modalVideo, isDragging]);

  const handleNext = () => {
    setActive((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + items.length) % items.length);
  };

  const getRelativePosition = (index: number) => {
    let diff = index - active;
    if (diff > items.length / 2) diff -= items.length;
    if (diff < -items.length / 2) diff += items.length;
    return diff;
  };

  const handleCardClick = (index: number, item: FormattedTestimonial) => {
    if (draggedRef.current) return;

    if (index !== active) {
      setActive(index);
      return;
    }

    // Active card clicked: If it has video, open modal!
    if (item.videoUrl) {
      setModalVideo({
        url: item.videoUrl,
        title: `تجربه ${item.patientName.fa} — ${item.treatment?.fa || "درمان دندانپزشکی"}`,
      });
    }
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || event.button !== 0) return;

    draggedRef.current = false;
    pointerStartRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDragging(true);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const pointerStart = pointerStartRef.current;
    if (!pointerStart || pointerStart.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - pointerStart.x;
    const deltaY = event.clientY - pointerStart.y;
    pointerStartRef.current = null;
    setIsDragging(false);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (Math.abs(deltaX) < 45 || Math.abs(deltaX) < Math.abs(deltaY)) return;

    draggedRef.current = true;
    setActive((current) =>
      deltaX < 0
        ? (current + 1) % items.length
        : (current - 1 + items.length) % items.length,
    );
  };

  const handlePointerCancel = (event: React.PointerEvent<HTMLDivElement>) => {
    if (pointerStartRef.current?.pointerId !== event.pointerId) return;
    pointerStartRef.current = null;
    setIsDragging(false);
  };

  if (items.length === 0) return null;

  return (
    <section className="py-20 relative bg-white overflow-hidden" id="stories">
      
      {/* Background orbs */}
      <div 
        className="absolute top-10 right-10 w-96 h-96 rounded-full opacity-35 filter blur-3xl pointer-events-none -z-10"
        style={{ background: "#d1cfbc" }}
      />
      <div 
        className="absolute bottom-10 left-10 w-80 h-80 rounded-full opacity-30 filter blur-3xl pointer-events-none -z-10"
        style={{ background: "#404c34" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 md:gap-16 mb-8">
          <div>
            <div className="sample-kicker">
              <span className="sample-kicker-line" />
              <span>روایت مراجعین</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-[42px] font-black text-[#302A21] leading-[1.3] whitespace-nowrap">
              بشنوید،{" "}
              <em className="not-italic text-[#404c34]">از زبان خودشان.</em>
            </h2>
          </div>

          <div className="max-w-md text-right">
            <p className="text-sm text-[#756F62] leading-relaxed">
              تجربه مستقیم مراجعین درباره محیط کلینیک، اخلاق حرفه‌ای پزشکان و کیفیت درمان‌های انجام‌شده. روی کارت‌ها کلیک کنید تا ویدئوی هر تجربه را مشاهده فرمایید.
            </p>
            <Link href="/testimonials" className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-[#404c34] hover:text-[#596747]">
              مشاهده همه رضایت‌ها
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Deck Toolbar */}
        <div className="flex items-center justify-between py-2 mb-4 border-b border-[#E8E2D5]">
          <div className="flex items-baseline gap-2 text-sm text-[#756F62]">
            <span className="text-2xl font-black text-[#302A21]">
              {toPersian(active + 1)}
            </span>
            <span>/</span>
            <span>{toPersian(items.length)}</span>
            <small className="mr-3 text-xs text-[#8A8476]">
              ورق بزنید و ویدئوی رضایت را تماشا کنید
            </small>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              aria-label="ویدئوی قبلی"
              className="w-10 h-10 rounded-xl bg-white/80 border border-white hover:bg-white text-[#302A21] shadow-xs flex items-center justify-center transition hover:-translate-y-0.5"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              aria-label="ویدئوی بعدی"
              className="w-10 h-10 rounded-xl bg-white/80 border border-white hover:bg-white text-[#302A21] shadow-xs flex items-center justify-center transition hover:-translate-y-0.5"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 3D Video Deck Container */}
        <div className={`sample-video-deck ${isDragging ? "is-dragging" : ""}`}>
          {items.map((item, index) => {
            const rel = getRelativePosition(index);
            let stateClass = "";
            if (rel === 0) stateClass = "is-active";
            else if (rel === -1) stateClass = "is-prev";
            else if (rel === 1) stateClass = "is-next";
            else if (rel < 0) stateClass = "is-far-prev";
            else stateClass = "is-far-next";

            const hasVideo = Boolean(item.videoUrl);
            const posterImg = item.coverImageUrl || "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80";

            return (
              <div
                key={item._id}
                onClick={() => handleCardClick(index, item)}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerCancel}
                className={`sample-deck-card ${stateClass}`}
                role="button"
                tabIndex={rel === 0 ? 0 : -1}
                aria-label={`رضایت ${item.patientName.fa}`}
              >
                {/* Poster / Media Frame */}
                <div className="relative w-full h-[330px] rounded-2xl overflow-hidden bg-[#24221b] group">
                  <Image
                    src={posterImg}
                    alt={item.patientName.fa}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#24221b]/80 via-transparent to-[#24221b]/20" />

                  {/* Priority display: Play button if video exists */}
                  {hasVideo ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-white/40 backdrop-blur-md border border-white text-white flex items-center justify-center shadow-2xl transform transition-transform group-hover:scale-110">
                        <Play className="w-7 h-7 fill-white translate-x-[-2px]" />
                      </div>
                    </div>
                  ) : (
                    <div className="absolute top-3 left-3 bg-white/30 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-white font-bold flex items-center gap-1.5">
                      <User className="w-3 h-3" />
                      <span>تصویر مراجع</span>
                    </div>
                  )}

                  {/* Top media badge */}
                  <span className="absolute top-3 right-3 text-[10px] font-bold text-white bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                    {hasVideo ? "ویدئوی رضایت" : "دیدگاه تایید شده"}
                  </span>
                </div>

                {/* Bottom details */}
                <div className="p-3 text-right">
                  <div className="flex items-center justify-between mb-1">
                    <strong className="text-sm font-bold text-[#302A21] truncate">
                      {item.patientName.fa}
                    </strong>
                    <span className="text-amber-500 font-bold text-xs">
                      {"★".repeat(item.rating || 5)}
                    </span>
                  </div>
                  <small className="block text-xs text-[#756F62] truncate">
                    {item.treatment?.fa || "مراقبت و درمان دندانپزشکی"}
                  </small>
                </div>

              </div>
            );
          })}
        </div>

        {/* Deck Dots Pagination */}
        <div className="flex items-center justify-center gap-2 mt-4" aria-label="انتخاب ویدئو">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-pressed={i === active}
              aria-label={`نمایش ویدئوی ${toPersian(i + 1)}`}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                i === active
                  ? "w-8 bg-[#404c34] shadow-[0_0_0_3px_rgba(64,76,52,0.16)]"
                  : "w-2.5 bg-[#d1cfbc]/60 hover:bg-[#404c34]/50"
              }`}
            />
          ))}
        </div>

      </div>

      {/* Video Dialog */}
      <VideoModal
        isOpen={Boolean(modalVideo)}
        onClose={() => setModalVideo(null)}
        videoUrl={modalVideo?.url || ""}
        title={modalVideo?.title}
      />
    </section>
  );
}
