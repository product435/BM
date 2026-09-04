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
}) {
  const trackRef = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateEdges = () => {
    const node = trackRef.current;
    if (!node) return;
    const max = node.scrollWidth - node.clientWidth;
    setAtStart(node.scrollLeft <= 4);
    setAtEnd(max <= 4 || node.scrollLeft >= max - 4);
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
    node.scrollBy({ left: direction * step, behavior: "smooth" });
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
        className={`carousel-arrow carousel-arrow--prev carousel-arrow--${variant} ${atStart ? "is-disabled" : ""}`}
        onClick={() => scrollByCard(-1)}
        disabled={atStart}
        aria-label="Previous"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M15 5 8 12l7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        type="button"
        className={`carousel-arrow carousel-arrow--next carousel-arrow--${variant} ${atEnd ? "is-disabled" : ""}`}
        onClick={() => scrollByCard(1)}
        disabled={atEnd}
        aria-label="Next"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
