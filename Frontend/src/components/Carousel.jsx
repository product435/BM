import { useEffect, useRef, useState } from "react";

/**
 * Carousel — shared horizontal scroll-snap carousel shell.
 *
 * Renders its children as individual slides inside a scroll-snap
 * track, with left/right arrow controls. The track itself is a
 * plain scrollable flex row on mobile/tablet (CSS in components.css
 * switches the wrapped list from grid to flex at the relevant
 * breakpoints) — arrows are visually hidden on desktop via CSS,
 * where the underlying layout stays a normal grid/row.
 *
 * trackClassName / itemClassName: the section's own existing class
 * names (e.g. "exp-grid", "exp-cell") so all current styling,
 * borders and spacing are reused as-is — this component only adds
 * scroll behavior and arrow controls on top.
 * variant: "light" | "dark" — picks the arrow button's color pairing
 * from the existing site palette.
 */
export default function Carousel({
  items,
  renderItem,
  trackClassName = "",
  itemClassName = "",
  variant = "light",
  ariaLabel,
  bleed = true,
  showProgress = false,
  showDots = false,
}) {
  const trackRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const autoplayTimerRef = useRef(null);
  const autoplayPausedRef = useRef(false);
  const restartAutoplayRef = useRef(() => {});

  const updateEdges = () => {
    const node = trackRef.current;
    if (!node) return;
    const max = node.scrollWidth - node.clientWidth;
    setProgress(max <= 4 ? 1 : node.scrollLeft / max);

    if (showDots) {
      const card = node.querySelector("[data-carousel-item]");
      const step = card ? card.getBoundingClientRect().width + 14 : node.clientWidth;
      const nearest = Math.round(node.scrollLeft / step);
      setActiveIndex(Math.min(Math.max(nearest, 0), items.length - 1));
    }
  };

  useEffect(() => {
    updateEdges();
    const node = trackRef.current;
    if (!node) return;
    node.addEventListener("scroll", updateEdges, { passive: true });
    window.addEventListener("resize", updateEdges);
    return () => {
      node.removeEventListener("scroll", updateEdges);
      window.removeEventListener("resize", updateEdges);
    };
  }, [items]);

  const scrollByCard = (direction) => {
    const node = trackRef.current;
    if (!node) return;
    const card = node.querySelector("[data-carousel-item]");
    const step = card ? card.getBoundingClientRect().width + 14 : node.clientWidth * 0.84;

    // Loop past the last card back to the first (and vice versa),
    // rather than stopping — same scroll used by the arrows/swipe.
    const max = node.scrollWidth - node.clientWidth;
    if (direction > 0 && node.scrollLeft >= max - 4) {
      node.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }
    if (direction < 0 && node.scrollLeft <= 4) {
      node.scrollTo({ left: max, behavior: "smooth" });
      return;
    }
    node.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  const goToIndex = (index) => {
    const node = trackRef.current;
    if (!node) return;
    const card = node.querySelector("[data-carousel-item]");
    const step = card ? card.getBoundingClientRect().width + 14 : node.clientWidth;
    node.scrollTo({ left: index * step, behavior: "smooth" });
    restartAutoplayRef.current();
  };

  // Mobile-only autoplay: advance one card every 3s, looping at the
  // end. Restarts on manual arrow/swipe interaction, pauses while the
  // user is actively touching the track, and stays off entirely for
  // prefers-reduced-motion or on desktop (arrows/track are inert there).
  useEffect(() => {
    const node = trackRef.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const isMobile = () => window.matchMedia("(max-width: 1024px)").matches;

    const clearTimer = () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
        autoplayTimerRef.current = null;
      }
    };

    const startTimer = () => {
      clearTimer();
      if (!isMobile()) return;
      autoplayTimerRef.current = setInterval(() => {
        if (autoplayPausedRef.current) return;
        scrollByCard(1);
      }, 3000);
    };

    restartAutoplayRef.current = startTimer;

    const onPointerDown = () => {
      autoplayPausedRef.current = true;
    };
    const onPointerUp = () => {
      autoplayPausedRef.current = false;
      startTimer();
    };

    startTimer();
    node.addEventListener("pointerdown", onPointerDown, { passive: true });
    node.addEventListener("pointerup", onPointerUp, { passive: true });
    node.addEventListener("pointercancel", onPointerUp, { passive: true });
    window.addEventListener("resize", startTimer);

    return () => {
      clearTimer();
      node.removeEventListener("pointerdown", onPointerDown);
      node.removeEventListener("pointerup", onPointerUp);
      node.removeEventListener("pointercancel", onPointerUp);
      window.removeEventListener("resize", startTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const handleArrowClick = (direction) => {
    scrollByCard(direction);
    // Manual navigation resets the autoplay countdown.
    restartAutoplayRef.current();
  };

  return (
    <div className="carousel">
      <div
        className={`carousel-track ${bleed ? "" : "carousel-track--contained"} ${trackClassName}`.trim()}
        ref={trackRef}
        role="group"
        aria-label={ariaLabel}
      >
        {items.map((item, i) => (
          <div
            className={`carousel-item ${itemClassName}`.trim()}
            data-carousel-item
            key={item.__key ?? i}
          >
            {renderItem(item, i)}
          </div>
        ))}
      </div>

      <button
        type="button"
        className={`carousel-arrow carousel-arrow--prev carousel-arrow--${variant}`}
        onClick={() => handleArrowClick(-1)}
        aria-label="Previous"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M15 5 8 12l7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        type="button"
        className={`carousel-arrow carousel-arrow--next carousel-arrow--${variant}`}
        onClick={() => handleArrowClick(1)}
        aria-label="Next"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {showProgress ? (
        <div className="carousel-progress" aria-hidden="true">
          <span
            className="carousel-progress-fill"
            style={{ transform: `scaleX(${Math.max(progress, 0.06)})` }}
          />
        </div>
      ) : null}

      {showDots ? (
        <div className="carousel-dots" role="tablist" aria-label={ariaLabel}>
          {items.map((item, i) => (
            <button
              key={item.__key ?? i}
              type="button"
              className={`carousel-dot ${i === activeIndex ? "is-active" : ""}`}
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => goToIndex(i)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
