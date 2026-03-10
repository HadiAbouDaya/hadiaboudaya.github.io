"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

interface CreativeCarouselProps {
  images: string[];
  alt: string;
  onImageClick?: (index: number) => void;
}

export function CreativeCarousel({ images, alt, onImageClick }: CreativeCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hoveredDotIndex, setHoveredDotIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const isNavigating = useRef(false);

  const x = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 30 });

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);

    // Don't override activeIndex during programmatic navigation (dot/arrow clicks)
    if (isNavigating.current) return;

    const cardWidth = window.innerWidth >= 640 ? 360 : 320;
    const gap = 16;
    const maxScroll = el.scrollWidth - el.clientWidth;

    let index;
    if (maxScroll > 0 && el.scrollLeft >= maxScroll - 2) {
      // At the very end of scroll → last card
      index = images.length - 1;
    } else {
      index = Math.round(el.scrollLeft / (cardWidth + gap));
    }

    index = Math.max(0, Math.min(index, images.length - 1));
    activeIndexRef.current = index;
    setActiveIndex(index);
  }, [images.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateScrollState();

    el.addEventListener("scroll", updateScrollState);

    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(el);

    return () => {
      el.removeEventListener("scroll", updateScrollState);
      resizeObserver.disconnect();
    };
  }, [updateScrollState]);

  const navigateTo = useCallback((index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = window.innerWidth >= 640 ? 360 : 320;
    const gap = 16;
    isNavigating.current = true;
    activeIndexRef.current = index;
    setActiveIndex(index);
    el.scrollTo({ left: index * (cardWidth + gap), behavior: "smooth" });
  }, []);

  const scroll = (direction: "left" | "right") => {
    const newIndex = direction === "left"
      ? Math.max(0, activeIndexRef.current - 1)
      : Math.min(images.length - 1, activeIndexRef.current + 1);
    navigateTo(newIndex);
  };

  return (
    <div className="relative my-8 group">
      {/* Decorative gradient overlay on left */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white dark:from-slate-900 to-transparent z-10 pointer-events-none transition-opacity duration-300 ${canScrollLeft ? "opacity-100" : "opacity-0"
          }`}
      />

      {/* Decorative gradient overlay on right */}
      <div
        className={`absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white dark:from-slate-900 to-transparent z-10 pointer-events-none transition-opacity duration-300 ${canScrollRight ? "opacity-100" : "opacity-0"
          }`}
      />


      {/* Main scrollable container */}
      <div
        ref={scrollRef}
        onMouseDown={() => { setIsDragging(true); isNavigating.current = false; }}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onTouchStart={() => { isNavigating.current = false; }}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-6 px-2 cursor-grab active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none" }}
      >
        {images.map((img, i) => (
          <motion.div
            key={i}
            className="relative shrink-0 snap-start group/card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onHoverStart={() => setHoveredIndex(i)}
            onHoverEnd={() => setHoveredIndex(null)}
          >
            {/* Card container with enhanced styling */}
            <motion.button
              onClick={() => onImageClick?.(i)}
              className="relative block rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 w-80 h-96 sm:w-[360px] sm:h-[400px]"
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Image */}
              <Image
                src={img}
                alt={`${alt} ${i + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 280px, 360px"
                priority={i < 2}
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />

              {/* Zoom indicator */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: hoveredIndex === i ? 1 : 0,
                  scale: hoveredIndex === i ? 1 : 0.8
                }}
                transition={{ duration: 0.2 }}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm flex items-center justify-center shadow-lg"
              >
                <Maximize2 className="w-5 h-5 text-slate-700 dark:text-slate-200" />
              </motion.div>

              {/* Image counter badge */}
              <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-lg">
                {i + 1} / {images.length}
              </div>
            </motion.button>
          </motion.div>
        ))}

        {/* End spacer for better UX */}
        <div className="w-8 shrink-0" />
      </div>

      {/* Navigation buttons */}
      <AnimatePresence>
        {canScrollLeft && (
          <motion.button
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            onClick={() => scroll("left")}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-primary-600 hover:text-white dark:hover:bg-primary-600 transition-all duration-200 opacity-0 group-hover:opacity-100"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {canScrollRight && (
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{
              opacity: 1,
              x: 0,
              scale: [1, 1.08, 1]
            }}
            exit={{ opacity: 0, x: -10 }}
            transition={{
              opacity: { duration: 0.3 },
              x: { duration: 0.3 },
              scale: {
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut",
                repeatDelay: 0.5
              }
            }}
            onClick={() => scroll("right")}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-primary-600 hover:text-white dark:hover:bg-primary-600 transition-all duration-200 opacity-0 group-hover:opacity-100"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Progress indicator with track and dots */}
      <div className="relative flex items-center justify-center mt-6">
        {/* Track line behind dots */}
        <div className="absolute h-[2px] bg-slate-200 dark:bg-slate-700/60 rounded-full" style={{ width: `${(images.length - 1) * 44}px` }} />
        {/* Animated progress fill */}
        <motion.div
          className="absolute left-1/2 h-[2px] rounded-full bg-indigo-500/40 dark:bg-indigo-400/30 origin-left"
          style={{
            width: `${(images.length - 1) * 44}px`,
            x: `-50%`,
          }}
          initial={false}
        >
          <motion.div
            className="h-full rounded-full bg-indigo-600 dark:bg-indigo-400"
            animate={{
              width: images.length > 1 ? `${(activeIndex / (images.length - 1)) * 100}%` : "100%",
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </motion.div>
        {/* Dots */}
        <div className="relative flex items-center gap-[36px]">
          {images.map((_, i) => {
            const isActive = activeIndex === i;
            const isHovered = hoveredDotIndex === i;

            return (
              <motion.button
                key={i}
                onClick={() => navigateTo(i)}
                onMouseEnter={() => setHoveredDotIndex(i)}
                onMouseLeave={() => setHoveredDotIndex(null)}
                className="relative p-2 -m-2 cursor-pointer"
                aria-label={`Go to image ${i + 1}`}
                aria-current={isActive ? "true" : "false"}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <motion.div
                  className="rounded-full"
                  animate={{
                    width: isActive ? 12 : 8,
                    height: isActive ? 12 : 8,
                    backgroundColor: isActive
                      ? "rgb(79, 70, 229)"
                      : isHovered
                        ? "rgb(99, 102, 241)"
                        : "rgb(203, 213, 225)",
                    boxShadow: isActive
                      ? "0 0 0 3px rgba(79, 70, 229, 0.2)"
                      : "none",
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
                {/* Tooltip on hover */}
                <AnimatePresence>
                  {isHovered && !isActive && (
                    <motion.span
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: -8 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 dark:bg-slate-700 text-white text-xs rounded whitespace-nowrap pointer-events-none"
                    >
                      {i + 1} / {images.length}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
