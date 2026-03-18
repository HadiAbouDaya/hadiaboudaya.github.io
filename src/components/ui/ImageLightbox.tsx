"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ImageLightboxProps {
  images: string[];
  alt: string;
  children: (openAt: (index: number) => void) => React.ReactNode;
}

export function ImageLightbox({ images, alt, children }: ImageLightboxProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number; posX: number; posY: number } | null>(null);

  const resetZoom = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const close = useCallback(() => {
    setOpenIndex(null);
    resetZoom();
  }, [resetZoom]);

  const prev = useCallback(() => {
    setOpenIndex((i) => (i !== null && i > 0 ? i - 1 : i));
    resetZoom();
  }, [resetZoom]);

  const next = useCallback(() => {
    setOpenIndex((i) => (i !== null && i < images.length - 1 ? i + 1 : i));
    resetZoom();
  }, [images.length, resetZoom]);

  const toggleZoom = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDragging) return;
    if (scale > 1) {
      resetZoom();
    } else {
      setScale(2);
    }
  }, [scale, isDragging, resetZoom]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.stopPropagation();
    const delta = e.deltaY > 0 ? -0.25 : 0.25;
    setScale((s) => {
      const next = Math.min(Math.max(s + delta, 1), 4);
      if (next === 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  }, []);

  // Drag-to-pan handlers
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (scale <= 1) return;
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragStart.current = { x: e.clientX, y: e.clientY, posX: position.x, posY: position.y };
    setIsDragging(false);
  }, [scale, position]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragStart.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) setIsDragging(true);
    setPosition({
      x: dragStart.current.posX + dx,
      y: dragStart.current.posY + dy,
    });
  }, []);

  const handlePointerUp = useCallback(() => {
    dragStart.current = null;
    // Reset isDragging after a tick so click handler can check it
    setTimeout(() => setIsDragging(false), 0);
  }, []);

  useEffect(() => {
    if (openIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [openIndex, close, prev, next]);

  const isZoomed = scale > 1;

  const lightbox = (
    <AnimatePresence>
      {openIndex !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={close}
        >
          <button
            onClick={close}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Zoom indicator */}
          <button
            onClick={(e) => { e.stopPropagation(); toggleZoom(e); }}
            className="absolute top-4 left-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10 flex items-center gap-1.5"
            aria-label={isZoomed ? "Zoom out" : "Zoom in"}
          >
            {isZoomed ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
            {isZoomed && <span className="text-xs font-mono">{Math.round(scale * 100)}%</span>}
          </button>

          {images.length > 1 && openIndex > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {images.length > 1 && openIndex < images.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          <motion.div
            key={openIndex}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="relative max-w-[90vw] max-h-[85vh] w-auto h-auto overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            onWheel={handleWheel}
          >
            <div
              style={{
                transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                transition: isDragging ? "none" : "transform 0.2s ease-out",
                cursor: isZoomed ? "grab" : "zoom-in",
              }}
              onClick={toggleZoom}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            >
              <Image
                src={images[openIndex]}
                alt={`${alt} ${openIndex + 1}`}
                width={1200}
                height={800}
                className="object-contain max-h-[85vh] w-auto h-auto rounded-lg select-none"
                sizes="90vw"
                priority
                draggable={false}
              />
            </div>
          </motion.div>

          {images.length > 1 && (
            <div className="absolute bottom-4 text-sm text-white/60">
              {openIndex + 1} / {images.length}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {children((index: number) => setOpenIndex(index))}
      {typeof document !== "undefined" ? createPortal(lightbox, document.body) : lightbox}
    </>
  );
}
