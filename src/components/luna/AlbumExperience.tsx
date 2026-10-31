"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type TouchEvent, type CSSProperties } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, Gift, Heart, LockKeyhole, Shuffle, X, ZoomIn, ZoomOut } from "lucide-react";
import { DEFAULT_JOURNEY_THEME, type VaultChapter, type VaultPhoto } from "@/lib/luna-vault";
import { useVault } from "./VaultProvider";
import { VaultImage } from "./VaultImage";
import styles from "./album.module.css";
import { JourneyCards } from "./JourneyCards";
import { JourneyEffects } from "./JourneyEffects";

const PAGE_SIZE = 24;

function SealedCollection({ chapter, photos, onOpen }: { chapter: VaultChapter; photos: VaultPhoto[]; onOpen: (photo: VaultPhoto, collection: VaultPhoto[]) => void }) {
  const [revealed, setRevealed] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const presentation = chapter.presentation;
  if (presentation?.kind !== "sealed" || !photos.length) return null;
  const panelId = `sealed-${chapter.id}`;
  const changeReveal = () => {
    const next = !revealed;
    setRevealed(next);
    window.requestAnimationFrame(() => {
      if (next) panel.current?.focus({ preventScroll: true });
      else toggle.current?.focus({ preventScroll: true });
    });
  };

  return (
    <section className={styles.sealedCollection} aria-labelledby={`sealed-title-${chapter.id}`} data-sealed-collection={chapter.id} data-sealed-open={revealed ? "true" : "false"}>
      <div className={styles.sealedIntro}>
        <div className={styles.sealedCopy}>
          <h2 id={`sealed-title-${chapter.id}`}>{chapter.title}</h2>
          <p className={styles.sealedDescription}>{presentation.description}</p>
          <span className={styles.sealedDate}>{chapter.dateLabel}</span>
        </div>
        <div className={`${styles.envelope} ${revealed ? styles.envelopeOpen : ""}`}>
          <div className={styles.envelopeFlap} aria-hidden="true" />
          <svg className={styles.envelopeBite} viewBox="0 0 80 80" aria-hidden="true" focusable="false">
            <path d="M30 0H80V54C72 54 67 49 67 42C56 46 47 39 48 29C37 31 29 23 32 13C26 10 25 5 30 0Z" />
          </svg>
          <button ref={toggle} type="button" className={styles.sealControl} onClick={changeReveal} aria-expanded={revealed} aria-controls={panelId} aria-label={revealed ? presentation.closeLabel : presentation.openLabel} data-sealed-toggle>
            <span className={styles.sealMedallion} aria-hidden="true"><Heart size={27} strokeWidth={1.2} /></span>
            <span className={styles.sealStamp}>{presentation.sealLabel}</span>
            <span className={styles.sealAction}>{revealed ? presentation.closeLabel : presentation.openLabel}<ArrowRight size={16} aria-hidden="true" /></span>
          </button>
        </div>
      </div>
      <div ref={panel} id={panelId} className={styles.sealedPanel} tabIndex={-1} hidden={!revealed} aria-label={chapter.title}>
        {revealed && <>
          <p className={styles.sealedRevealedNote}>{presentation.revealedNote}</p>
          <div className={styles.sealedExhibits} data-sealed-exhibits>
            {photos.map((photo, index) => (
              <button key={photo.id} type="button" className={styles.sealedExhibit} onClick={() => onOpen(photo, photos)} aria-label={`${presentation.exhibitLabel} ${String.fromCharCode(65 + index)}: ${photo.alt}`} data-sealed-photo={photo.id}>
                <span className={styles.sealedExhibitPhoto}><VaultImage asset={photo.medium} alt={photo.alt} width={photo.width} height={photo.height} /></span>
                <span className={styles.sealedExhibitCaption}><span>{presentation.exhibitLabel} {String.fromCharCode(65 + index)}</span><ArrowRight size={17} aria-hidden="true" /></span>
              </button>
            ))}
          </div>
        </>}
      </div>
    </section>
  );
}

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
      // The parent releases inert in its passive effect after this cleanup.
      requestAnimationFrame(() => {
        if (previouslyFocused?.isConnected) previouslyFocused.focus({ preventScroll: true });
      });
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
  const [view, setView] = useState<"overview" | "chapter" | "trip" | "all">("overview");
  const [chapterId, setChapterId] = useState<string | null>(null);
  const [tripId, setTripId] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [viewer, setViewer] = useState<{ photos: VaultPhoto[]; index: number } | null>(null);
  const background = useRef<HTMLDivElement>(null);
  const room = useRef<HTMLElement>(null);
  const journeys = useRef<HTMLElement>(null);
  const overviewScroll = useRef(0);
  const entrySelector = useRef<string | null>(null);
  const tripScroll = useRef(0);
  const roomReturn = useRef<{scroll: number; selector: string} | null>(null);
  const allPhotosButton = useRef<HTMLButtonElement>(null);
  const closeViewer = useCallback(() => setViewer(null), []);

  useEffect(() => {
    const element = background.current;
    if (element) element.inert = viewer !== null;
    return () => { if (element) element.inert = false; };
  }, [viewer]);

  useEffect(() => {
    if (view === "overview") return;
    const restore = roomReturn.current;
    roomReturn.current = null;
    const frame = requestAnimationFrame(() => {
      window.scrollTo({ top: restore?.scroll ?? 0, behavior: "instant" });
      const target = restore ? document.querySelector<HTMLElement>(restore.selector) : room.current;
      target?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [view, chapterId]);

  if (!manifest) return null;
  const sealedChapters = manifest.chapters.filter(chapter => chapter.presentation?.kind === "sealed").sort((a, b) => a.order - b.order);
  const sealedIds = new Set(sealedChapters.map(chapter => chapter.id));
  const photos = manifest.photos.filter(photo => !sealedIds.has(photo.group)).sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0));
  const chapters = manifest.chapters.filter(chapter => !sealedIds.has(chapter.id)).sort((a, b) => a.order - b.order);
  const trips = manifest.album.trips ?? [];
  const trip = trips.find(entry => entry.id === tripId);
  const tripChapters = trip ? trip.chapterIds.map(id => chapters.find(entry => entry.id === id)).filter((entry): entry is VaultChapter => !!entry) : [];
  const groupedChapters = new Set(trips.flatMap(entry => entry.chapterIds));
  const tripEntries: VaultChapter[] = trips.map(entry => ({ ...entry, source: "Confirmed multi-stop visit", journey: { ...(chapters.find(chapter => chapter.id === entry.chapterIds[0])?.journey ?? DEFAULT_JOURNEY_THEME), description: entry.description } }));
  const entries = [...chapters.filter(entry => !groupedChapters.has(entry.id)), ...tripEntries].sort((a, b) => a.order - b.order);
  const chapter = view === "trip" ? tripEntries.find(entry => entry.id === tripId) : chapters.find(entry => entry.id === chapterId);
  const theme = chapter?.journey ?? DEFAULT_JOURNEY_THEME;
  const chapterPhotos = view === "trip" && trip ? trip.chapterIds.flatMap(id => photos.filter(photo => photo.group === id)) : view === "chapter" && chapter ? photos.filter(photo => photo.group === chapter.id) : photos;
  const cardPhotos = photos.map(photo => {
    const parent = trips.find(entry => entry.chapterIds.includes(photo.group));
    return parent ? { ...photo, group: parent.id } : photo;
  });
  const cover = chapterPhotos.find(photo => photo.id === chapter?.coverId) ?? chapterPhotos[0];
  const covers = manifest.album.coverIds.map(id => photos.find(photo => photo.id === id)).filter((photo): photo is VaultPhoto => Boolean(photo)).slice(0, 3);
  const heroPhotos = covers.length ? covers : photos.slice(0, 3);
  const open = (photo: VaultPhoto, collection = photos) => setViewer({ photos: collection, index: collection.findIndex(entry => entry.id === photo.id) });
  const selectChapter = (id: string, heroPhotoId?: string) => {
    const parent = trips.find(entry => entry.id === id || entry.chapterIds.includes(id));
    overviewScroll.current = window.scrollY;
    entrySelector.current = heroPhotoId ? `[data-journey-hero="${CSS.escape(heroPhotoId)}"]` : `[data-journey-card="${CSS.escape(parent?.id ?? id)}"]`;
    setTripId(parent?.id ?? null);
    setChapterId(parent?.id ?? id);
    setVisibleCount(PAGE_SIZE);
    setView(parent ? "trip" : "chapter");
  };
  const selectStop = (id: string) => {
    tripScroll.current = window.scrollY;
    setChapterId(id);
    setVisibleCount(PAGE_SIZE);
    setView("chapter");
  };
  const showAll = () => {
    overviewScroll.current = window.scrollY;
    setVisibleCount(PAGE_SIZE);
    setView("all");
  };
  const backToJourneys = () => {
    if (view === "chapter" && trip) {
      roomReturn.current = { scroll: tripScroll.current, selector: `[data-journey-card="${CSS.escape(chapterId ?? "")}"]` };
      setChapterId(trip.id);
      setVisibleCount(PAGE_SIZE);
      setView("trip");
      return;
    }
    const fromAll = view === "all";
    setView("overview");
    requestAnimationFrame(() => {
      window.scrollTo({ top: overviewScroll.current, behavior: "instant" });
      const entry = entrySelector.current ? document.querySelector<HTMLElement>(entrySelector.current) : null;
      (fromAll ? allPhotosButton.current : entry ?? journeys.current)?.focus({ preventScroll: true });
    });
  };
  const randomPhoto = () => {
    if (!chapterPhotos.length) return;
    const number = crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296;
    setViewer({ photos: chapterPhotos, index: Math.floor(number * chapterPhotos.length) });
  };
  const roomStyle = { "--journey-accent": theme.accent, "--journey-backdrop": theme.backdrop, "--journey-ink": theme.ink } as CSSProperties;

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
        {view === "overview" ? <>
          <section className={`${styles.hero} ${styles.atlasHero}`} aria-labelledby="album-title">
            <div className={styles.heroCopy}>
              <h1 id="album-title">{manifest.album.title}</h1>
              <p>{manifest.album.subtitle}</p>
              <div className={styles.overviewActions}>
                <button type="button" className={styles.primaryButton} onClick={() => { journeys.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" }); journeys.current?.focus({ preventScroll: true }); }}>Choose a journey <ArrowDown size={17} /></button>
                <button ref={allPhotosButton} type="button" className={styles.allPhotosButton} onClick={showAll}>All photos <span>{photos.length}</span></button>
              </div>
            </div>
            <div className={styles.photoStack} aria-label="A few photographs from the album">
              {heroPhotos.map((photo, index) => <button type="button" key={photo.id} data-journey-hero={photo.id} className={`${styles.stackPhoto} ${styles[`stackPhoto${index}`]}`} onClick={() => selectChapter(photo.group, photo.id)} aria-label={`Open ${trips.find(entry => entry.chapterIds.includes(photo.group))?.title ?? chapters.find(entry => entry.id === photo.group)?.title ?? "this journey"}`}><VaultImage asset={photo.medium} alt={photo.alt} fill priority retryOnParentClick={false} style={{ objectFit: "cover" }} /><span className={styles.stackPaper} aria-hidden="true" /></button>)}
            </div>
          </section>
          <section ref={journeys} className={styles.atlasJourneys} tabIndex={-1} aria-labelledby="journeys-title">
            <div className={styles.atlasHeading}><div><h2 id="journeys-title">Step back into a memory.</h2><p>Choose a place, then make its little world come alive.</p></div><span>{entries.length} journeys & keepsakes</span></div>
            <JourneyCards chapters={entries} photos={cardPhotos} onSelect={selectChapter} selectedId={tripId ?? chapterId ?? undefined} />
          </section>
          {sealedChapters.map(entry => <SealedCollection key={entry.id} chapter={entry} photos={manifest.photos.filter(photo => photo.group === entry.id)} onOpen={open} />)}
          <footer className={styles.albumFooter}><Link href="/luna/birthday/"><Gift size={19} /><span>Keep a little birthday magic.</span><ArrowRight size={18} /></Link><button type="button" onClick={lock}><LockKeyhole size={16} />Close our album</button></footer>
        </> : <section ref={room} tabIndex={-1} className={styles.journeyRoom} data-journey-room={view === "all" ? "all" : chapter?.id} data-trip-room={view === "trip" ? trip?.id : undefined} data-journey-motif={view !== "all" ? theme.motif : "paper"} style={roomStyle} aria-labelledby="room-title">
          <div className={styles.roomNavigation}><button type="button" onClick={backToJourneys}><ArrowLeft size={18} />{view === "chapter" && trip ? "Back to the whole trip" : "Back to journeys"}</button></div>
          {view !== "all" && chapter ? <div className={styles.roomHero}>
            <div className={styles.roomStory}><h1 id="room-title">{chapter.title}</h1><p className={styles.roomDescription}>{theme.description}</p><span className={styles.roomCount}>{chapterPhotos.length} {chapterPhotos.length === 1 ? "photograph" : "photographs"}{view === "trip" ? ` · ${tripChapters.length} stops, one trip` : " to come back to."}</span>{view === "chapter" && <JourneyEffects key={chapter.id} theme={theme} />}{view === "trip" && <a className={styles.tripStopsLink} href="#trip-stops">Explore the stops <ArrowDown size={17} /></a>}</div>
            {cover && <div className={styles.roomCover}><VaultImage asset={cover.medium} alt={cover.alt} fill priority style={{objectFit:"contain"}} /><span className={styles.coverDate}>{chapter.dateLabel}</span></div>}
          </div> : <div className={styles.allHeading}><h1 id="room-title">Every little moment.</h1><p>All {photos.length} photographs, gathered in one place.</p></div>}
          {view === "trip" && <section id="trip-stops" className={styles.tripStops} aria-labelledby="trip-stops-title"><h2 id="trip-stops-title">Different stops. One trip.</h2><JourneyCards chapters={tripChapters} photos={photos} onSelect={selectStop} headingLabel="Explore this stop" /></section>}
          <section id="photographs" className={`${styles.gallery} ${styles.roomGallery}`} aria-labelledby="gallery-title">
            <div className={styles.galleryHeading}><div><h2 id="gallery-title">The photographs</h2><p className={styles.photoCount} aria-live="polite">{chapterPhotos.length} {chapterPhotos.length === 1 ? "photograph" : "photographs"}</p></div><button type="button" className={styles.shuffleButton} onClick={randomPhoto}><Shuffle size={17} />Surprise me</button></div>
            <div className={styles.photoGrid}>{chapterPhotos.slice(0, visibleCount).map(photo => <button type="button" className={styles.photoTile} data-photo-id={photo.id} key={photo.id} onClick={() => open(photo, chapterPhotos)} aria-label={`Open photo: ${photo.alt}`}><VaultImage asset={photo.thumb} alt={photo.alt} width={photo.width} height={photo.height} /></button>)}</div>
            {visibleCount < chapterPhotos.length && <div className={styles.moreRow}><button type="button" className={styles.moreButton} onClick={() => setVisibleCount(value => value + PAGE_SIZE)}>A few more moments <span>{Math.min(PAGE_SIZE, chapterPhotos.length - visibleCount)} more</span></button></div>}
            {visibleCount >= chapterPhotos.length && <p className={styles.endNote}>All here. Until the next memory.</p>}
          </section>
        </section>}
      </div>
      {viewer !== null && viewer.photos[viewer.index] && <PhotoViewer photos={viewer.photos} initialIndex={viewer.index} onClose={closeViewer} />}
    </div>
  );
}
