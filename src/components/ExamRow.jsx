import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import ExamLogo from "./ExamLogo";

function ExamCard({ exam, active, onSelect }) {
  return (
    <button
      onClick={onSelect}
      className={`relative group flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all duration-200 shrink-0 w-[230px] snap-start ${
        active
          ? "border-[var(--exam-color)] shadow-lg"
          : "border-border bg-card hover:border-[var(--exam-color)] hover:shadow-md"
      }`}
      style={{
        "--exam-color": exam.color,
        backgroundColor: active ? exam.bg : undefined,
      }}
    >
      {/* Logo */}
      <ExamLogo src={exam.logoUrl} name={exam.name} color={exam.color} size={44} />

      {/* Name only — full form lives in the expanded detail view */}
      <p
        className="font-bold text-foreground text-sm leading-tight truncate"
        style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
      >
        {exam.name}
      </p>

      {/* Chevron */}
      <div
        className={`ml-auto transition-transform duration-200 shrink-0 ${
          active ? "rotate-180" : ""
        }`}
      >
        <ChevronDown
          size={14}
          style={{ color: active ? exam.color : undefined }}
          className="text-muted-foreground"
        />
      </div>
    </button>
  );
}

/**
 * Horizontally scrollable strip of exam/service cards.
 *
 * Designed to comfortably hold large catalogs (tested up to ~30 entries)
 * without the page growing tall — the row scrolls instead of wrapping.
 * Works with mouse wheel, trackpad, touch swipe, and the arrow buttons
 * that appear on desktop when there's more content than fits.
 */
export default function ExamRow({ items, selectedId, onSelect }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState, items.length]);

  const scrollByAmount = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: "smooth" });
  };

  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-6 text-center border border-dashed border-border rounded-2xl">
        Nothing here yet — add an entry in exams.xml to see it appear.
      </p>
    );
  }

  return (
    <div className="relative">
      {/* Left fade + arrow (desktop only, shown when scrolled) */}
      {canScrollLeft && (
        <>
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-background to-transparent z-10 hidden sm:block" />
          <button
            onClick={() => scrollByAmount(-1)}
            aria-label="Scroll left"
            className="hidden sm:flex absolute left-1 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-card border border-border shadow-md items-center justify-center hover:bg-muted transition"
          >
            <ChevronLeft size={16} />
          </button>
        </>
      )}

      {/* Right fade + arrow */}
      {canScrollRight && (
        <>
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-background to-transparent z-10 hidden sm:block" />
          <button
            onClick={() => scrollByAmount(1)}
            aria-label="Scroll right"
            className="hidden sm:flex absolute right-1 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-card border border-border shadow-md items-center justify-center hover:bg-muted transition"
          >
            <ChevronRight size={16} />
          </button>
        </>
      )}

      {/* Scrollable strip */}
      <div
        ref={scrollRef}
        className="scroll-row flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-1 px-0.5"
      >
        {items.map((exam) => (
          <ExamCard
            key={exam.id}
            exam={exam}
            active={selectedId === exam.id}
            onSelect={() => onSelect(selectedId === exam.id ? null : exam.id)}
          />
        ))}
      </div>
    </div>
  );
}
