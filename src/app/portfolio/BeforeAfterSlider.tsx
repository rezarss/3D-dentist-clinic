"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { MoveHorizontal, Sparkles } from "lucide-react";

export function BeforeAfterSlider({
  beforeUrl,
  afterUrl,
  title,
  number,
}: {
  beforeUrl?: string;
  afterUrl?: string;
  title: string;
  number: string;
}) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  function updatePosition(clientX: number) {
    const bounds = containerRef.current?.getBoundingClientRect();
    if (!bounds) return;
    setPosition(Math.max(0, Math.min(100, ((clientX - bounds.left) / bounds.width) * 100)));
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    event.preventDefault();
    draggingRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    updatePosition(event.clientX);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (draggingRef.current) updatePosition(event.clientX);
  }

  function stopDragging() {
    draggingRef.current = false;
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault();
      setPosition((current) => Math.max(0, current - 5));
    } else if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault();
      setPosition((current) => Math.min(100, current + 5));
    } else if (event.key === "Home") {
      event.preventDefault();
      setPosition(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setPosition(100);
    }
  }

  return (
    <div
      ref={containerRef}
      className="portfolio-before-after"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
      onLostPointerCapture={stopDragging}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="slider"
      aria-valuenow={Math.round(position)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`مقایسه تصاویر قبل و بعد برای ${title}`}
    >
      <div className="portfolio-before-after-base">
        {beforeUrl
          ? <Image src={beforeUrl} alt={`قبل از درمان - ${title}`} fill sizes="(max-width: 620px) 100vw, (max-width: 900px) 50vw, 33vw" draggable={false} unoptimized />
          : <span className="portfolio-before-after-placeholder"><Sparkles size={36} strokeWidth={1.3} aria-hidden="true" /></span>}
      </div>
      <div className="portfolio-before-after-overlay" style={{ clipPath: `inset(0 0 0 ${position}%)` }}>
        {afterUrl
          ? <Image src={afterUrl} alt={`بعد از درمان - ${title}`} fill sizes="(max-width: 620px) 100vw, (max-width: 900px) 50vw, 33vw" draggable={false} unoptimized />
          : <span className="portfolio-before-after-placeholder"><Sparkles size={36} strokeWidth={1.3} aria-hidden="true" /></span>}
      </div>
      <span className="portfolio-before-after-label portfolio-before-after-label-before">قبل</span>
      <span className="portfolio-before-after-label portfolio-before-after-label-after">بعد</span>
      <span className="portfolio-before-after-number">{number}</span>
      <span className="portfolio-before-after-divider" style={{ left: `${position}%` }}>
        <span><MoveHorizontal size={17} aria-hidden="true" /></span>
      </span>
    </div>
  );
}
