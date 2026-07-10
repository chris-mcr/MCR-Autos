'use client';

import { useEffect, useState, type ReactNode } from "react";

interface CarouselProps {
  children: ReactNode;          // one or more slides
  autoPlayMs?: number;          // 0 = off
  ariaLabel?: string;
}

// Responsive slides-per-view: 1 mobile, 2 tablet, 3 desktop.
function useSlidesPerView() {
  const [n, setN] = useState(1);
  useEffect(() => {
    const calc = () =>
      setN(window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1);
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);
  return n;
}

/**
 * Generic, reusable slide carousel. Steps one slide at a time.
 */
export default function Carousel({
  children,
  autoPlayMs = 0,
  ariaLabel = "Carousel",
}: CarouselProps) {
  const slides = Array.isArray(children) ? children : [children];
  const perView = useSlidesPerView();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const maxIndex = Math.max(0, slides.length - perView);
  const hasControls = maxIndex > 0;

  // Keep index in range when the viewport (and so perView) changes.
  useEffect(() => {
    setIndex((i) => Math.min(i, maxIndex));
  }, [maxIndex]);

  const go = (i: number) => setIndex(Math.max(0, Math.min(i, maxIndex)));

  // Autoplay: paused on hover/focus and disabled when the user prefers
  // reduced motion.
  useEffect(() => {
    if (!autoPlayMs || !hasControls || paused) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(
      () => setIndex((i) => (i >= maxIndex ? 0 : i + 1)),
      autoPlayMs,
    );
    return () => clearInterval(t);
  }, [autoPlayMs, hasControls, maxIndex, paused]);

  return (
    <div
      className="relative"
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* Viewport */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${index * (100 / perView)}%)` }}
        >
          {slides.map((slide, i) => {
            const offscreen = i < index || i >= index + perView;
            return (
              <div
                key={i}
                className="flex-shrink-0 px-2"
                style={{ flexBasis: `${100 / perView}%` }}
                role="group"
                aria-roledescription="slide"
                aria-label={`Slide ${i + 1} of ${slides.length}`}
                // inert hides off-screen slides from AT *and* removes their
                // links from the tab order, so keyboard focus can't land on a
                // hidden card.
                inert={offscreen || undefined}
              >
                {slide}
              </div>
            );
          })}
        </div>
      </div>

      {hasControls && (
        <>
          <button
            onClick={() => go(index - 1)}
            disabled={index === 0}
            aria-label="Previous slide"
            className="absolute top-1/2 -left-3 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ background: "var(--bg-overlay)", border: "1px solid var(--edge-mid)", color: "var(--text-1)" }}
          >
            <span aria-hidden="true">‹</span>
          </button>
          <button
            onClick={() => go(index + 1)}
            disabled={index === maxIndex}
            aria-label="Next slide"
            className="absolute top-1/2 -right-3 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ background: "var(--bg-overlay)", border: "1px solid var(--edge-mid)", color: "var(--text-1)" }}
          >
            <span aria-hidden="true">›</span>
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6" role="tablist" aria-label="Slide navigation">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                role="tab"
                aria-label={`Go to slide ${i + 1}`}
                aria-selected={i === index}
                className="h-2 rounded-full transition-all"
                style={{
                  width: i === index ? "24px" : "8px",
                  background: i === index ? "var(--accent)" : "var(--edge-mid)",
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
