"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { VaultImage } from "./VaultImage";
import { useVault } from "./VaultProvider";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import {
  ArrowDown,
  BookOpen,
  Heart,
  HeartPulse,
  MapPin,
  Music2,
  Sparkles,
  Stethoscope,
  Volume2,
  VolumeX,
} from "lucide-react";

const SONG_START_SECONDS = 131;
const AUDIO_ENGINE_VERSION = "web-audio-offset-v3";
const SONG_VOLUME = 0.72;

type SafariWindow = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext;
  };

const reveal = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.24 },
  transition: { duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] },
} as const;

function PeonyBouquet({ className = "", interactive = false }: { className?: string; interactive?: boolean }) {
  const { manifest } = useVault();
  const birthday = manifest?.birthday;
  const text = birthday?.text ?? {};
  const [bloom, setBloom] = useState(0);
  const bouquetRef = useRef<HTMLButtonElement>(null);

  const moveBouquet = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!interactive || !bouquetRef.current) return;
    const rect = bouquetRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * -8;
    bouquetRef.current.style.setProperty("--bouquet-rx", `${y}deg`);
    bouquetRef.current.style.setProperty("--bouquet-ry", `${x}deg`);
  };

  return (
    <button
      ref={bouquetRef}
      type="button"
      className={`luna-bouquet ${interactive ? "is-interactive" : ""} ${className}`}
      onPointerMove={moveBouquet}
      onPointerLeave={() => {
        bouquetRef.current?.style.setProperty("--bouquet-rx", "0deg");
        bouquetRef.current?.style.setProperty("--bouquet-ry", "0deg");
      }}
      onClick={() => interactive && setBloom((value) => value + 1)}
      aria-label={interactive ? text.bloomLabel : text.bouquetLabel}
      disabled={!interactive}
    >
      <m.span
        className="luna-bouquet-image"
        animate={interactive ? { scale: bloom % 2 ? 1.08 : 1, rotate: bloom % 2 ? 1.5 : 0 } : undefined}
        transition={{ type: "spring", stiffness: 180, damping: 14 }}
      >
        <VaultImage
          asset={birthday?.assets[text.bouquetAsset]}
          alt=""
          width={1500}
          height={1050}
          priority={!interactive}
        />
      </m.span>
      <AnimatePresence>
        {bloom > 0 && (
          <m.span key={bloom} className="luna-bloom-burst" aria-hidden="true">
            {Array.from({ length: 12 }, (_, index) => (
              <i key={index} style={{ "--petal-index": index } as React.CSSProperties} />
            ))}
          </m.span>
        )}
      </AnimatePresence>
    </button>
  );
}

function MusicControl({
  muted,
  needsTap,
  onPlay,
  onToggle,
}: {
  muted: boolean;
  needsTap: boolean;
  onPlay: () => void;
  onToggle: () => void;
}) {
  const { manifest } = useVault();
  const text = manifest?.birthday.text ?? {};
  return (
    <div className={`luna-music-control ${needsTap ? "needs-tap" : ""}`}>
      {needsTap && (
        <button className="luna-play-song" type="button" onClick={onPlay}>
          <Music2 />
          <span>{text.playSong}</span>
        </button>
      )}
      <button type="button" onClick={onToggle} aria-label={muted ? text.playLabel : text.muteLabel}>
        {muted ? <VolumeX /> : <Volume2 />}
      </button>
    </div>
  );
}

export function LunaExperience() {
  const pathname = usePathname();
  const { manifest, decryptAsset, lock } = useVault();
  const birthday = manifest?.birthday;
  const text = birthday?.text ?? {};
  const photos = birthday?.photos ?? [];
  const asset = (slot: string) => birthday?.assets[text[slot]];
  const [entered, setEntered] = useState(false);
  const [muted, setMuted] = useState(false);
  const [needsPlaybackTap, setNeedsPlaybackTap] = useState(false);
  const [candlesOut, setCandlesOut] = useState(false);
  const audioContextRef = useRef<AudioContext>(null);
  const audioDataPromiseRef = useRef<Promise<ArrayBuffer> | null>(null);
  const audioBufferPromiseRef = useRef<Promise<AudioBuffer> | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode>(null);
  const gainNodeRef = useRef<GainNode>(null);
  const playbackGenerationRef = useRef(0);
  const audioAbortRef = useRef<AbortController | null>(null);
  const birthdayMountedRef = useRef(false);
  const audioAllowedRef = useRef(false);

  const disposeMusic = useCallback(() => {
    audioAllowedRef.current = false;
    playbackGenerationRef.current += 1;
    audioAbortRef.current?.abort();
    audioAbortRef.current = null;
    audioDataPromiseRef.current = null;
    audioBufferPromiseRef.current = null;
    try { audioSourceRef.current?.stop(); } catch { /* The source may already have stopped. */ }
    audioSourceRef.current?.disconnect();
    gainNodeRef.current?.disconnect();
    void audioContextRef.current?.close().catch(() => undefined);
    audioSourceRef.current = null;
    gainNodeRef.current = null;
    audioContextRef.current = null;
  }, []);

  const pauseMusic = useCallback(() => {
    disposeMusic();
    setMuted(true);
    setNeedsPlaybackTap(false);
  }, [disposeMusic]);

  const isBirthdayActive = () => birthdayMountedRef.current &&
    window.location.pathname.replace(/\/+$/, "") === "/luna/birthday" &&
    document.visibilityState === "visible";

  const loadAudioData = () => {
    if (!audioDataPromiseRef.current) {
      const song = asset("songAsset");
      if (!song) return Promise.reject(new Error("Audio is unavailable."));
      const controller = new AbortController();
      audioAbortRef.current = controller;
      const pending: Promise<ArrayBuffer> = decryptAsset(song, controller.signal)
        .then((blob) => blob.arrayBuffer())
        .catch((error) => {
          if (audioDataPromiseRef.current === pending) audioDataPromiseRef.current = null;
          throw error;
        });
      audioDataPromiseRef.current = pending;
    }

    return audioDataPromiseRef.current;
  };

  useEffect(() => {
    birthdayMountedRef.current = true;
    document.body.classList.add("luna-experience-active");
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      birthdayMountedRef.current = false;
      disposeMusic();
      document.body.classList.remove("luna-experience-active");
      document.body.style.overflow = previousOverflow;
    };
  }, [disposeMusic]);

  useEffect(() => {
    const onVisibility = () => { if (document.visibilityState !== "visible") pauseMusic(); };
    const onHistory = () => { if (window.location.pathname.replace(/\/+$/, "") !== "/luna/birthday") pauseMusic(); };
    if (pathname?.replace(/\/+$/, "") !== "/luna/birthday") disposeMusic();
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", pauseMusic);
    window.addEventListener("popstate", onHistory);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", pauseMusic);
      window.removeEventListener("popstate", onHistory);
      disposeMusic();
    };
  }, [pathname, disposeMusic, pauseMusic]);

  const startMusic = () => {
    if (!isBirthdayActive()) return;
    // A new deliberate tap replaces any older pending play request.
    disposeMusic();
    const AudioContextConstructor =
      window.AudioContext || (window as SafariWindow).webkitAudioContext;

    if (!AudioContextConstructor) {
      setMuted(true);
      setNeedsPlaybackTap(true);
      return;
    }

    const context = audioContextRef.current ?? new AudioContextConstructor();
    audioContextRef.current = context;
    audioAllowedRef.current = true;
    const generation = ++playbackGenerationRef.current;
    const canContinue = () => generation === playbackGenerationRef.current &&
      audioAllowedRef.current && isBirthdayActive() && audioContextRef.current === context && context.state !== "closed";

    // iOS requires both the context resume and a source start inside the user's tap.
    const unlockSource = context.createBufferSource();
    unlockSource.buffer = context.createBuffer(1, 1, context.sampleRate);
    unlockSource.connect(context.destination);
    unlockSource.start();
    unlockSource.addEventListener("ended", () => unlockSource.disconnect(), { once: true });
    const resumePromise = context.resume();
    setNeedsPlaybackTap(false);
    setMuted(false);

    void (async () => {
      await resumePromise;
      if (!canContinue()) return;

      if (!audioBufferPromiseRef.current) {
        const pending: Promise<AudioBuffer> = loadAudioData()
          .then((data) => {
            if (!canContinue()) {
              throw new DOMException("Playback cancelled", "AbortError");
            }
            return context.decodeAudioData(data.slice(0));
          })
          .catch((error) => {
            if (audioBufferPromiseRef.current === pending) audioBufferPromiseRef.current = null;
            throw error;
          });
        audioBufferPromiseRef.current = pending;
      }

      const buffer = await audioBufferPromiseRef.current;
      if (!canContinue()) return;

      try {
        audioSourceRef.current?.stop();
      } catch {
        // AudioBufferSourceNode is one-shot and may already be stopped.
      }
      audioSourceRef.current?.disconnect();

      const gain = gainNodeRef.current ?? context.createGain();
      if (!gainNodeRef.current) {
        gain.connect(context.destination);
        gainNodeRef.current = gain;
      }
      gain.gain.setValueAtTime(SONG_VOLUME, context.currentTime);

      const source = context.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      source.loopStart = 0;
      source.loopEnd = buffer.duration;
      source.connect(gain);
      source.start(0, Math.min(SONG_START_SECONDS, buffer.duration - 0.01));
      audioSourceRef.current = source;
    })().catch(() => {
      if (canContinue()) {
        setMuted(true);
        setNeedsPlaybackTap(true);
      }
    });
  };

  const enter = () => {
    // Keep playback inside this direct tap handler for Safari on iOS.
    startMusic();
    setEntered(true);
    document.body.style.overflow = "";
  };

  const toggleMusic = () => {
    if (muted) startMusic();
    else pauseMusic();
  };

  return (
    <div className="luna-page" data-audio-engine={AUDIO_ENGINE_VERSION}>
      <AnimatePresence>
        {!entered && (
          <m.div
            className="luna-entry"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
          >
            <VaultImage
              asset={asset("entryPhotoAsset")}
              alt={text.entryPhotoAlt}
              fill
              priority
              sizes="100vw"
              className="luna-entry-photo"
            />
            <div className="luna-entry-wash" />
            <m.div
              className="luna-entry-content"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.8 }}
            >
              <span className="luna-kicker">{text.entryDate}</span>
              <h1>{text.entryTitle}</h1>
              <p>{text.entrySubtitle}</p>
              <button type="button" onClick={enter}>
                <Heart aria-hidden="true" />
                {text.open}
              </button>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>

      {entered && (
        <nav aria-label="Private space" style={{ position: "fixed", top: "max(1rem, env(safe-area-inset-top))", left: "1rem", zIndex: 90, display: "flex", gap: ".5rem" }}>
          <Link href="/luna/" onClick={pauseMusic} style={{ display: "grid", placeItems: "center", minHeight: 44, padding: "0 .8rem", borderRadius: 2, background: "#285143", color: "white", textDecoration: "none", fontSize: ".8rem" }}>Album</Link>
          <button type="button" onClick={() => { pauseMusic(); lock(); }} style={{ minHeight: 44, padding: "0 .8rem", border: 0, borderRadius: 2, background: "#285143", color: "white", cursor: "pointer", fontSize: ".8rem" }}>Lock</button>
        </nav>
      )}
      {entered && (
        <MusicControl
          muted={muted}
          needsTap={needsPlaybackTap}
          onPlay={startMusic}
          onToggle={toggleMusic}
        />
      )}

      <section className="luna-hero">
        <div className="luna-hero-photo" aria-hidden="true">
          <VaultImage
            asset={asset("heroPhotoAsset")}
            alt=""
            fill
            priority
            sizes="100vw"
          />
        </div>
        <div className="luna-hero-copy">
          <m.span initial={{ opacity: 0 }} animate={entered ? { opacity: 1 } : {}} transition={{ delay: 0.55 }}>
            {text.heroKicker}
          </m.span>
          <m.h2 initial={{ opacity: 0, y: 26 }} animate={entered ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.7, duration: 0.8 }}>
            {text.heroTitle}
            <strong>{text.heroName}</strong>
          </m.h2>
        </div>
        <m.div
          className="luna-hero-bouquet"
          initial={{ opacity: 0, y: 70, scale: 0.8 }}
          animate={entered ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ delay: 0.85, type: "spring", stiffness: 85, damping: 17 }}
        >
          <PeonyBouquet />
        </m.div>
        <a className="luna-scroll-cue" href="#our-story" aria-label={text.scrollLabel}>
          <ArrowDown />
        </a>
      </section>

      <section id="our-story" className="luna-story luna-section">
        <m.div className="luna-story-copy" {...reveal}>
          <span className="luna-section-number">{text.storyNumber}</span>
          <h2>{text.storyLine1}<br />{text.storyLine2}<br />{text.storyLine3}</h2>
          <p>
            {text.storyBody}
          </p>
        </m.div>
        <m.div className="luna-story-photos" {...reveal} transition={{ ...reveal.transition, delay: 0.12 }}>
          <figure className="luna-photo luna-photo-main">
            <VaultImage asset={asset("storyMainPhotoAsset")} alt={text.storyMainPhotoAlt} fill sizes="(max-width: 760px) 82vw, 40vw" />
          </figure>
          <figure className="luna-photo luna-photo-small">
            <VaultImage asset={asset("storySmallPhotoAsset")} alt={text.storySmallPhotoAlt} fill sizes="(max-width: 760px) 48vw, 20vw" />
          </figure>
        </m.div>
      </section>

      <section className="luna-pride luna-section">
        <m.div className="luna-pride-heading" {...reveal}>
          <span className="luna-section-number">{text.prideNumber}</span>
          <div className="luna-medical-mark" aria-hidden="true">
            <HeartPulse />
            <span />
            <Stethoscope />
          </div>
          <h2>{text.prideTitle}</h2>
        </m.div>
        <m.div className="luna-pride-grid" {...reveal}>
          <figure className="luna-photo luna-pride-photo">
            <VaultImage asset={asset("pridePhotoAsset")} alt={text.pridePhotoAlt} fill sizes="(max-width: 760px) 92vw, 42vw" />
          </figure>
          <div className="luna-pride-copy">
            <BookOpen aria-hidden="true" />
            <p>
              {text.prideBody}
            </p>
            <strong>{text.prideClosing}</strong>
          </div>
        </m.div>
      </section>

      <section className="luna-brussels">
        <div className="luna-brussels-photo">
          <VaultImage asset={asset("cityPhotoAsset")} alt={text.cityPhotoAlt} fill sizes="100vw" />
        </div>
        <m.div className="luna-brussels-copy" {...reveal}>
          <span><MapPin /> {text.city}</span>
          <h2>{text.cityTitle}</h2>
          <p>{text.cityBody}</p>
        </m.div>
      </section>

      <section className="luna-gallery luna-section">
        <m.div className="luna-gallery-heading" {...reveal}>
          <span className="luna-section-number">{text.galleryNumber}</span>
          <h2>{text.galleryTitle}</h2>
        </m.div>
        <div className="luna-gallery-grid">
          {photos.map((photo, index) => (
            <m.figure
              className={`luna-gallery-item luna-gallery-item-${index + 1} ${photo.shape}`}
              key={photo.asset}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, delay: (index % 3) * 0.07 }}
            >
              <VaultImage asset={birthday?.assets[photo.asset]} alt={photo.alt} fill sizes="(max-width: 700px) 46vw, 30vw" />
            </m.figure>
          ))}
        </div>
      </section>

      <section className="luna-bloom luna-section">
        <m.div className="luna-bloom-copy" {...reveal}>
          <span className="luna-section-number">{text.bloomNumber}</span>
          <Sparkles aria-hidden="true" />
          <h2>{text.bloomTitle}</h2>
          <p>{text.bloomBody}</p>
        </m.div>
        <m.div
          className="luna-bloom-stage"
          initial={{ opacity: 0, scale: 0.86 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ type: "spring", stiffness: 90, damping: 16 }}
        >
          <PeonyBouquet interactive />
        </m.div>
      </section>

      <section className="luna-letter luna-section">
        <m.div className="luna-letter-photo" {...reveal}>
          <VaultImage asset={asset("letterPhotoAsset")} alt={text.letterPhotoAlt} fill sizes="(max-width: 760px) 92vw, 42vw" />
        </m.div>
        <m.div className="luna-letter-copy" {...reveal} transition={{ ...reveal.transition, delay: 0.12 }}>
          <span className="luna-section-number">{text.letterNumber}</span>
          <h2>{text.letterTitle}</h2>
          <p>
            {text.letterBody}
          </p>
          <strong>{text.letterClosing}<br />{text.letterName}</strong>
        </m.div>
      </section>

      <section className={`luna-finale ${candlesOut ? "is-celebrating" : ""}`}>
        <div className="luna-finale-stars" aria-hidden="true">
          {Array.from({ length: 18 }, (_, index) => <i key={index} style={{ "--star-index": index } as React.CSSProperties} />)}
        </div>
        <m.div className="luna-finale-copy" {...reveal}>
          <span>{text.finaleKicker}</span>
          <h2>{text.finaleTitle}</h2>
          <p>{text.finaleBody}</p>
        </m.div>
        <button
          className="luna-cake-button"
          type="button"
          onClick={() => setCandlesOut(true)}
          aria-label={candlesOut ? text.candlesOutLabel : text.candlesLabel}
        >
          <span className="luna-candles" aria-hidden="true">
            <i><b /></i><i><b /></i>
          </span>
          <span className="luna-cake" aria-hidden="true">
            <i className="luna-cake-top" />
            <i className="luna-cake-middle">{text.age}</i>
            <i className="luna-cake-bottom" />
          </span>
          <span className="luna-cake-instruction">{candlesOut ? text.wish : text.candlesInstruction}</span>
        </button>
        <m.p className="luna-signature" animate={candlesOut ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}>
          {text.signature}
        </m.p>
      </section>
    </div>
  );
}
