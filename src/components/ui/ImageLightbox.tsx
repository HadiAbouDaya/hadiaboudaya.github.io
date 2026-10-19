"use client";

import { useCallback, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { m, useMotionValue } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { Modal } from "./Modal";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

interface ImageLightboxProps { images: string[]; alt: string; children: (openAt: (index: number) => void) => ReactNode }
export function ImageLightbox({ images, alt, children }: ImageLightboxProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [scale, setScale] = useState(1);
  const zoom = useMotionValue(1);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const drag = useRef<{ pointer: number; clientX: number; clientY: number; x: number; y: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);
  const backdropDown = useRef(false);
  const closeButton = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();
  const validIndex = openIndex !== null && openIndex >= 0 && openIndex < images.length ? openIndex : null;
  const reset = useCallback(() => {
    zoom.set(1); x.set(0); y.set(0); setScale(1); drag.current = null; suppressClick.current = false;
  }, [zoom, x, y]);
  const close = useCallback(() => { setOpenIndex(null); reset(); }, [reset]);
  const openAt = useCallback((index: number) => {
    if (index < 0 || index >= images.length) return;
    setOpenIndex(index);
  }, [images.length]);
  const move = (offset: number) => {
    if (validIndex === null) return;
    const next = Math.max(0, Math.min(images.length - 1, validIndex + offset));
    if (next !== validIndex) { reset(); setOpenIndex(next); }
  };
  const changeZoom = (next: number) => {
    const clamped = Math.min(4, Math.max(1, next));
    zoom.set(clamped); setScale(clamped);
    if (clamped === 1) { x.set(0); y.set(0); }
  };
  const toggleZoom = () => {
    if (suppressClick.current) { suppressClick.current = false; return; }
    changeZoom(zoom.get() > 1 ? 1 : 2);
  };

  return <>
    {children(openAt)}
    <Modal open={validIndex !== null} onClose={close} label={`${alt} image viewer`} initialFocusRef={closeButton}
      className="m-0 h-dvh w-full max-w-none max-h-none bg-transparent p-0 border-0"
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
        if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
      }}>
      {validIndex !== null && <div className="relative min-h-dvh w-full flex items-center justify-center p-4 sm:p-12"
        onPointerDown={(event) => { backdropDown.current = event.target === event.currentTarget; }}
        onClick={(event) => { if (backdropDown.current && event.target === event.currentTarget) close(); backdropDown.current = false; }}>
        <button ref={closeButton} type="button" onClick={close}
          className="absolute top-4 right-4 w-11 h-11 rounded-pill bg-white/10 text-white hover:bg-white/20 z-10" aria-label="Close image viewer"><X className="w-5 h-5 mx-auto" /></button>
        <button type="button" onClick={toggleZoom}
          className="absolute top-4 left-4 min-w-11 h-11 px-3 rounded-pill bg-white/10 text-white hover:bg-white/20 z-10 flex items-center gap-2"
          aria-label={scale > 1 ? "Zoom out" : "Zoom in"}>
          {scale > 1 ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
          <span className="text-xs">{Math.round(scale * 100)}%</span>
        </button>
        {validIndex > 0 && <button type="button" onClick={() => move(-1)} aria-label="Previous image"
          className="absolute left-2 sm:left-4 top-1/2 w-11 h-11 rounded-pill bg-black/60 text-white z-10"><ChevronLeft className="w-6 h-6 mx-auto" /></button>}
        {validIndex < images.length - 1 && <button type="button" onClick={() => move(1)} aria-label="Next image"
          className="absolute right-2 sm:right-4 top-1/2 w-11 h-11 rounded-pill bg-black/60 text-white z-10"><ChevronRight className="w-6 h-6 mx-auto" /></button>}
        <div className="max-w-[90vw] max-h-[80dvh] overflow-hidden rounded-card"
          onWheel={(event) => { event.stopPropagation(); changeZoom(zoom.get() + (event.deltaY > 0 ? -0.25 : 0.25)); }}>
          <m.div style={{ x, y, scale: zoom, touchAction: scale > 1 ? "none" : "auto", cursor: scale > 1 ? "grab" : "zoom-in" }}
            onClick={toggleZoom}
            onPointerDown={(event) => {
              suppressClick.current = false;
              if (zoom.get() <= 1) return;
              event.preventDefault();
              event.currentTarget.setPointerCapture(event.pointerId);
              drag.current = { pointer: event.pointerId, clientX: event.clientX, clientY: event.clientY, x: x.get(), y: y.get(), moved: false };
            }}
            onPointerMove={(event) => {
              const start = drag.current;
              if (!start || start.pointer !== event.pointerId) return;
              const dx = event.clientX - start.clientX;
              const dy = event.clientY - start.clientY;
              if (Math.abs(dx) > 3 || Math.abs(dy) > 3) start.moved = true;
              x.set(start.x + dx); y.set(start.y + dy);
            }}
            onPointerUp={(event) => {
              if (drag.current?.pointer !== event.pointerId) return;
              suppressClick.current = drag.current.moved;
              drag.current = null;
              if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
            }}
            onPointerCancel={() => { drag.current = null; suppressClick.current = false; }}
            onLostPointerCapture={() => { drag.current = null; }}
            initial={false} animate={{ opacity: 1 }} transition={{ duration: reduced ? 0 : 0.18 }}>
            <Image key={images[validIndex]} src={images[validIndex]} alt={`${alt} - image ${validIndex + 1} of ${images.length}`}
              width={1440} height={960} className="object-contain max-h-[80dvh] w-auto h-auto select-none" sizes="90vw" draggable={false} />
          </m.div>
        </div>
        <p className="absolute bottom-4 text-sm text-white" aria-live="polite">Image {validIndex + 1} of {images.length}</p>
      </div>}
    </Modal>
  </>;
}
