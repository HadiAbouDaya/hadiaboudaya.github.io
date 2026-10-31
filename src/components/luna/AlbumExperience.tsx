"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type TouchEvent } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, Gift, LockKeyhole, Shuffle, X, ZoomIn, ZoomOut } from "lucide-react";
import type { VaultPhoto } from "@/lib/luna-vault";
import { useVault } from "./VaultProvider";
import { VaultImage } from "./VaultImage";
import styles from "./album.module.css";

const PAGE_SIZE = 24;

function PhotoViewer({ photos, initialIndex, onClose }: { photos: VaultPhoto[]; initialIndex: number; onClose: () => void }) {
  const { decryptAsset } = useVault();
  const [index, setIndex] = useState(initialIndex);
  const [zoomed, setZoomed] = useState(false);
  const dialog = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const touch = useRef<{ x: number; y: number; time: number } | null>(null);
  const photo = photos[index];
  const move = useCallback((direction: number) => {
    setIndex((current) => (current + direction + photos.length) % photos.length);
    setZoomed(false);
  }, [photos.length]);

  useEffect(() => {
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();
    const keys = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); onClose(); }
      if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
      if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
      if (event.key === "Tab") {
        const controls = dialog.current?.querySelectorAll<HTMLElement>("button:not([disabled]), a[href], [tabindex='0']");
        if (!controls?.length) return;
        const first = controls[0], last = controls[controls.length - 1];
        if (event.shiftKey && (document.activeElement === first || !dialog.current?.contains(document.activeElement))) { event.preventDefault(); last.focus(); }
        if (!event.shiftKey && (document.activeElement === last || !dialog.current?.contains(document.activeElement))) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", keys);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", keys);
      if (previouslyFocused?.isConnected) previouslyFocused.focus({ preventScroll: true });
    };
  }, [move, onClose]);

  useEffect(() => {
    // Warm one encrypted neighbor only. Do not create another decoded full-size image.
    if (photos.length < 2) return;
    const controller = new AbortController();
    const next = photos[(index + 1) % photos.length];
    const timer = window.setTimeout(() => { void decryptAsset(next.full, controller.signal).catch(() => undefined); }, 350);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [index, photos, decryptAsset]);

  const startTouch = (event: TouchEvent) => {
    if (event.touches.length !== 1 || zoomed) { touch.current = null; return; }
    touch.current = { x: event.touches[0].clientX, y: event.touches[0].clientY, time: Date.now() };
  };
  const endTouch = (event: TouchEvent) => {
    const start = touch.current;
    touch.current = null;
    if (!start || event.changedTouches.length !== 1 || zoomed) return;
    const dx = event.changedTouches[0].clientX - start.x;
    const dy = event.changedTouches[0].clientY - start.y;
    if (Math.abs(dx) > 65 && Math.abs(dx) > Math.abs(dy) * 1.6 && Date.now() - start.time < 800) move(dx < 0 ? 1 : -1);
  };

  return (
    <div ref={dialog} className={styles.viewer} role="dialog" aria-modal="true" aria-label="Photo viewer">
      <div className={styles.viewerToolbar}>
        <span aria-live="polite" aria-atomic="true">{index + 1} <span className={styles.viewerCountSeparator}>/</span> {photos.length}</span>
        <div>
          <button type="button" onClick={() => setZoomed((value) => !value)} aria-label={zoomed ? "Fit photo to screen" : "Zoom into photo"} aria-pressed={zoomed}>{zoomed ? <ZoomOut /> : <ZoomIn />}</button>
          <button ref={closeButton} type="button" onClick={onClose} aria-label="Close photo viewer"><X /></button>
        </div>
      </div>
      <div className={`${styles.viewerStage} ${zoomed ? styles.viewerStageZoomed : ""}`} onTouchStart={startTouch} onTouchMove={(event) => { if (event.touches.length > 1) touch.current = null; }} onTouchEnd={endTouch}>
        <div className={styles.viewerPhoto} key={photo.id}>
          <VaultImage asset={photo.full} alt={photo.alt} width={photo.full.width ?? photo.width} height={photo.full.height ?? photo.height} priority />
        </div>
      </div>
      <div className={styles.viewerBottom}>
        <button type="button" onClick={() => move(-1)} aria-label="Previous photo"><ArrowLeft /></button>
        <p>{photo.alt}</p>
        <button type="button" onClick={() => move(1)} aria-label="Next photo"><ArrowRight /></button>
      </div>
    </div>
  );
}

export function AlbumExperience() {
  const { manifest, lock } = useVault();
  const [group, setGroup] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [viewer, setViewer] = useState<{ photos: VaultPhoto[]; index: number } | null>(null);
  const background = useRef<HTMLDivElement>(null);
  const gallery = useRef<HTMLElement>(null);
  const closeViewer = useCallback(() => setViewer(null), []);

  useEffect(() => {
    const element = background.current;
    if (element) element.inert = viewer !== null;
    return () => { if (element) element.inert = false; };
  }, [viewer]);

  if (!manifest) return null;
  const photos = manifest.photos;
  const filtered = group ? photos.filter((photo) => photo.group === group) : photos;
  const chapters = [...manifest.chapters].sort((a, b) => a.order - b.order);
  const selectedChapter = chapters.find((chapter) => chapter.id === group);
  const covers = manifest.album.coverIds.map((id) => photos.find((photo) => photo.id === id)).filter((photo): photo is VaultPhoto => Boolean(photo)).slice(0, 3);
  const heroPhotos = covers.length ? covers : photos.slice(0, 3);
  const open = (photo: VaultPhoto, collection = photos) => setViewer({ photos: collection, index: collection.findIndex((entry) => entry.id === photo.id) });
  const selectChapter = (chapterId: string) => {
    setGroup(chapterId);
    setVisibleCount(PAGE_SIZE);
    gallery.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
    gallery.current?.focus({ preventScroll: true });
  };
  const randomPhoto = () => {
    if (!filtered.length) return;
    const number = crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296;
    setViewer({ photos: filtered, index: Math.floor(number * filtered.length) });
  };

  return (
    <div className={styles.album}>
      <div ref={background}>
        <header className={styles.header}>
          <span className={styles.wordmark}>{manifest.album.title}</span>
          <div className={styles.headerActions}>
            <Link href="/luna/birthday/" aria-label="The birthday keepsake" className={styles.keepsake}><Gift size={17} /><span>The birthday keepsake</span></Link>
            <button type="button" onClick={lock} className={styles.lockButton}><LockKeyhole size={17} /><span>Lock</span></button>
          </div>
        </header>
        <section className={styles.hero} aria-labelledby="album-title">
          <div className={styles.heroCopy}>
            <span className={styles.smallNote}>A place to come back to.</span>
            <h1 id="album-title">{manifest.album.title}</h1>
            <p>{manifest.album.subtitle}</p>
            <button type="button" className={styles.primaryButton} onClick={() => { gallery.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" }); gallery.current?.focus({ preventScroll: true }); }}>
              Open the album <ArrowDown size={17} />
            </button>
          </div>
          <div className={styles.photoStack} aria-label="A few photographs from the album">
            {heroPhotos.map((photo, index) => (
              <button type="button" key={photo.id} className={`${styles.stackPhoto} ${styles[`stackPhoto${index}`]}`} onClick={() => open(photo)} aria-label={`Open photo: ${photo.alt}`}>
                <VaultImage asset={photo.medium} alt={photo.alt} fill priority style={{ objectFit: "cover" }} />
                <span className={styles.stackPaper} aria-hidden="true" />
              </button>
            ))}
          </div>
          <span className={styles.heroFootnote}>Little moments, kept close.</span>
        </section>
        {chapters.length > 0 && <section className={styles.journeys} aria-labelledby="journeys-title">
          <div className={styles.journeysHeading}><h2 id="journeys-title">Our little journeys</h2><p>A few days can hold so much.</p></div>
          <div className={styles.journeyRail}>
            {chapters.map((chapter) => {
              const cover = photos.find((photo) => photo.id === chapter.coverId);
              const count = photos.filter((photo) => photo.group === chapter.id).length;
              return <button type="button" className={`${styles.journeyCard} ${group === chapter.id ? styles.journeySelected : ""}`} key={chapter.id} onClick={() => selectChapter(chapter.id)} aria-label={`Open ${chapter.title}, ${chapter.dateLabel}, ${count} photographs`}>
                <span className={styles.journeyCover}>{cover && <VaultImage asset={cover.thumb} alt={cover.alt} fill />}</span>
                <span className={styles.journeyDate}>{chapter.dateLabel}</span>
                <span className={styles.journeyTitle}>{chapter.title}<ArrowRight size={17} /></span>
                <span className={styles.journeyCount}>{count} photographs</span>
              </button>;
            })}
          </div>
          <p className={styles.groupingNote}>Grouped from photo dates.</p>
        </section>}
        <section ref={gallery} id="photographs" tabIndex={-1} className={styles.gallery} aria-labelledby="gallery-title">
          <div className={styles.galleryHeading}>
            <div><h2 id="gallery-title">{selectedChapter?.title ?? "The moments"}</h2><p>{selectedChapter ? selectedChapter.dateLabel : `${photos.length} photographs, and room for more.`}</p></div>
            <button type="button" className={styles.shuffleButton} onClick={randomPhoto}><Shuffle size={17} />Surprise me</button>
          </div>
          <div className={styles.galleryTools}>
            {chapters.length > 0 ? (
              <label className={styles.groupSelect}><span>Browse</span><select value={group} onChange={(event) => { setGroup(event.target.value); setVisibleCount(PAGE_SIZE); }}><option value="">Every moment</option>{chapters.map((chapter) => <option key={chapter.id} value={chapter.id}>{chapter.title}</option>)}</select></label>
            ) : <span />}
            <span className={styles.photoCount} aria-live="polite">{filtered.length} {filtered.length === 1 ? "photograph" : "photographs"}</span>
          </div>
          <div className={styles.photoGrid}>
            {filtered.slice(0, visibleCount).map((photo) => (
              <button type="button" className={styles.photoTile} key={photo.id} onClick={() => open(photo, filtered)} aria-label={`Open photo: ${photo.alt}`}>
                <VaultImage asset={photo.thumb} alt={photo.alt} width={photo.width} height={photo.height} />
              </button>
            ))}
          </div>
          {visibleCount < filtered.length && <div className={styles.moreRow}><button type="button" className={styles.moreButton} onClick={() => setVisibleCount((value) => value + PAGE_SIZE)}>A few more moments <span>{Math.min(PAGE_SIZE, filtered.length - visibleCount)} more</span></button></div>}
          {filtered.length > 0 && visibleCount >= filtered.length && <p className={styles.endNote}>All here. Until the next memory.</p>}
        </section>
        <footer className={styles.albumFooter}><Link href="/luna/birthday/"><Gift size={19} /><span>Keep a little birthday magic.</span><ArrowRight size={18} /></Link><button type="button" onClick={lock}><LockKeyhole size={16} />Close our album</button></footer>
      </div>
      {viewer !== null && viewer.photos[viewer.index] && <PhotoViewer photos={viewer.photos} initialIndex={viewer.index} onClose={closeViewer} />}
    </div>
  );
}
