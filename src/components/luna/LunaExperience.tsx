"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
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
const SONG_SRC = `/Media/luna/our-song.mp3#t=${SONG_START_SECONDS}`;

const photos = [
  { src: "/Media/luna/01-kiss.webp", alt: "Hadi kissing Luna beside the lake", shape: "wide" },
  { src: "/Media/luna/02-lakeside.webp", alt: "Luna and Hadi smiling beside the lake", shape: "wide" },
  { src: "/Media/luna/03-under-the-trees.webp", alt: "Luna and Hadi together under the trees", shape: "wide" },
  { src: "/Media/luna/04-brussels-rooftop.webp", alt: "Luna and Hadi above Brussels", shape: "wide" },
  { src: "/Media/luna/05-brussels-sun.webp", alt: "Luna and Hadi in the Brussels sunshine", shape: "wide" },
  { src: "/Media/luna/06-mirror.webp", alt: "Luna taking a mirror photograph", shape: "portrait" },
  { src: "/Media/luna/07-summer-portrait.webp", alt: "Luna in warm summer light", shape: "portrait" },
  { src: "/Media/luna/08-brussels-street.webp", alt: "Luna on a quiet Brussels street", shape: "portrait" },
  { src: "/Media/luna/09-seaside-white.webp", alt: "Luna walking beside the sea", shape: "portrait" },
  { src: "/Media/luna/10-seaside-sunset.webp", alt: "Luna smiling by the sea at sunset", shape: "portrait" },
  { src: "/Media/luna/11-golden-hour.webp", alt: "Luna in golden evening light", shape: "portrait" },
] as const;

const reveal = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.24 },
  transition: { duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] },
} as const;

function PeonyBouquet({ className = "", interactive = false }: { className?: string; interactive?: boolean }) {
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
      aria-label={interactive ? "Make the peonies bloom" : "Peony bouquet"}
      disabled={!interactive}
    >
      <m.span
        className="luna-bouquet-image"
        animate={interactive ? { scale: bloom % 2 ? 1.08 : 1, rotate: bloom % 2 ? 1.5 : 0 } : undefined}
        transition={{ type: "spring", stiffness: 180, damping: 14 }}
      >
        <Image
          src="/Media/luna/peony-bouquet.webp"
          alt=""
          width={1500}
          height={1050}
          unoptimized
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
  return (
    <div className={`luna-music-control ${needsTap ? "needs-tap" : ""}`}>
      {needsTap && (
        <button className="luna-play-song" type="button" onClick={onPlay}>
          <Music2 />
          <span>Play our song</span>
        </button>
      )}
      <button type="button" onClick={onToggle} aria-label={muted ? "Play the song" : "Mute the song"}>
        {muted ? <VolumeX /> : <Volume2 />}
      </button>
    </div>
  );
}

export function LunaExperience() {
  const [entered, setEntered] = useState(false);
  const [muted, setMuted] = useState(false);
  const [needsPlaybackTap, setNeedsPlaybackTap] = useState(false);
  const [candlesOut, setCandlesOut] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    document.body.classList.add("luna-experience-active");
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.classList.remove("luna-experience-active");
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const startMusic = () => {
    const audio = audioRef.current;
    if (!audio) {
      setNeedsPlaybackTap(true);
      return;
    }

    // Safari may begin a pending play before honoring currentTime. Unlock it
    // muted inside the tap, wait for the seek to finish, then expose sound.
    audio.volume = 0.72;
    audio.muted = true;
    setMuted(true);
    setNeedsPlaybackTap(false);

    const resumeAfterSeek = () => {
      const seekAndResume = () => {
        const resume = () => {
          audio.muted = false;
          setMuted(false);
          void audio.play().catch(() => setNeedsPlaybackTap(true));
        };

        if (Math.abs(audio.currentTime - SONG_START_SECONDS) <= 0.25 && !audio.seeking) {
          resume();
          return;
        }

        audio.addEventListener("seeked", resume, { once: true });
        audio.currentTime = SONG_START_SECONDS;
      };

      audio.pause();
      if (audio.readyState >= HTMLMediaElement.HAVE_METADATA) {
        seekAndResume();
      } else {
        audio.addEventListener("loadedmetadata", seekAndResume, { once: true });
      }
    };

    void audio.play().then(resumeAfterSeek).catch(() => setNeedsPlaybackTap(true));
  };

  const enter = () => {
    // Keep playback inside this direct tap handler for Safari on iOS.
    startMusic();
    setEntered(true);
    document.body.style.overflow = "";
  };

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;

    const nextMuted = !muted;
    setMuted(nextMuted);
    audio.muted = nextMuted;
    if (!nextMuted) void audio.play().catch(() => setNeedsPlaybackTap(true));
  };

  const loopSelectedSection = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = SONG_START_SECONDS;
    void audio.play().catch(() => setNeedsPlaybackTap(true));
  };

  return (
    <div className="luna-page">
      <AnimatePresence>
        {!entered && (
          <m.div
            className="luna-entry"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
          >
            <Image
              src="/Media/luna/09-seaside-white.webp"
              alt="Luna beside the sea"
              fill
              priority
              sizes="100vw"
              unoptimized
              className="luna-entry-photo"
            />
            <div className="luna-entry-wash" />
            <m.div
              className="luna-entry-content"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.8 }}
            >
              <span className="luna-kicker">13.08.2026</span>
              <h1>Luna, this is for you.</h1>
              <p>Twenty looks beautiful on you.</p>
              <button type="button" onClick={enter}>
                <Heart aria-hidden="true" />
                Open
              </button>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>

      <audio
        ref={audioRef}
        className="luna-audio"
        src={SONG_SRC}
        preload="auto"
        playsInline
        onLoadedMetadata={(event) => {
          event.currentTarget.currentTime = SONG_START_SECONDS;
        }}
        onPlaying={(event) => {
          if (!event.currentTarget.muted && event.currentTarget.currentTime >= SONG_START_SECONDS - 0.5) {
            setNeedsPlaybackTap(false);
          }
        }}
        onEnded={loopSelectedSection}
        onError={() => setNeedsPlaybackTap(true)}
      />

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
          <Image
            src="/Media/luna/10-seaside-sunset.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            unoptimized
          />
        </div>
        <div className="luna-hero-copy">
          <m.span initial={{ opacity: 0 }} animate={entered ? { opacity: 1 } : {}} transition={{ delay: 0.55 }}>
            Joyeux anniversaire · Je t&apos;aime
          </m.span>
          <m.h2 initial={{ opacity: 0, y: 26 }} animate={entered ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.7, duration: 0.8 }}>
            Happy 20th,
            <strong>Luna.</strong>
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
        <a className="luna-scroll-cue" href="#our-story" aria-label="Continue to your birthday message">
          <ArrowDown />
        </a>
      </section>

      <section id="our-story" className="luna-story luna-section">
        <m.div className="luna-story-copy" {...reveal}>
          <span className="luna-section-number">01 · The beginning</span>
          <h2>One question.<br />One message.<br />Then, us.</h2>
          <p>
            Before there was an us, I reached out to Jad and asked him about you. Then I sent you a message on Instagram. I am very glad I did.
          </p>
        </m.div>
        <m.div className="luna-story-photos" {...reveal} transition={{ ...reveal.transition, delay: 0.12 }}>
          <figure className="luna-photo luna-photo-main">
            <Image src="/Media/luna/01-kiss.webp" alt="Hadi kissing Luna beside the lake" fill sizes="(max-width: 760px) 82vw, 40vw" unoptimized />
          </figure>
          <figure className="luna-photo luna-photo-small">
            <Image src="/Media/luna/03-under-the-trees.webp" alt="Luna and Hadi under the trees" fill sizes="(max-width: 760px) 48vw, 20vw" unoptimized />
          </figure>
        </m.div>
      </section>

      <section className="luna-pride luna-section">
        <m.div className="luna-pride-heading" {...reveal}>
          <span className="luna-section-number">02 · What I see in you</span>
          <div className="luna-medical-mark" aria-hidden="true">
            <HeartPulse />
            <span />
            <Stethoscope />
          </div>
          <h2>I know how strong you are, even when life feels heavy.</h2>
        </m.div>
        <m.div className="luna-pride-grid" {...reveal}>
          <figure className="luna-photo luna-pride-photo">
            <Image src="/Media/luna/08-brussels-street.webp" alt="Luna on a Brussels street" fill sizes="(max-width: 760px) 92vw, 42vw" unoptimized />
          </figure>
          <div className="luna-pride-copy">
            <BookOpen aria-hidden="true" />
            <p>
              I see the work you put in, the sacrifices medicine asks of you, and how you keep moving through the difficult days. I hope you always remember what you are capable of.
            </p>
            <strong>I am always proud of you.</strong>
          </div>
        </m.div>
      </section>

      <section className="luna-brussels">
        <div className="luna-brussels-photo">
          <Image src="/Media/luna/04-brussels-rooftop.webp" alt="Luna and Hadi overlooking Brussels" fill sizes="100vw" unoptimized />
        </div>
        <m.div className="luna-brussels-copy" {...reveal}>
          <span><MapPin /> Bruxelles</span>
          <h2>The city where you are building your future.</h2>
          <p>May it bring you closer to every good thing you are working toward.</p>
        </m.div>
      </section>

      <section className="luna-gallery luna-section">
        <m.div className="luna-gallery-heading" {...reveal}>
          <span className="luna-section-number">03 · A few moments I keep close</span>
          <h2>You, exactly as you are.</h2>
        </m.div>
        <div className="luna-gallery-grid">
          {photos.map((photo, index) => (
            <m.figure
              className={`luna-gallery-item luna-gallery-item-${index + 1} ${photo.shape}`}
              key={photo.src}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, delay: (index % 3) * 0.07 }}
            >
              <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 700px) 46vw, 30vw" unoptimized />
            </m.figure>
          ))}
        </div>
      </section>

      <section className="luna-bloom luna-section">
        <m.div className="luna-bloom-copy" {...reveal}>
          <span className="luna-section-number">04 · For what comes next</span>
          <Sparkles aria-hidden="true" />
          <h2>For twenty, I wish you calm in the hard moments and joy in the ordinary ones.</h2>
          <p>Tap the flowers. They are all yours.</p>
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
          <Image src="/Media/luna/05-brussels-sun.webp" alt="Luna and Hadi together in Brussels" fill sizes="(max-width: 760px) 92vw, 42vw" unoptimized />
        </m.div>
        <m.div className="luna-letter-copy" {...reveal} transition={{ ...reveal.transition, delay: 0.12 }}>
          <span className="luna-section-number">05 · From me to you</span>
          <h2>My wish for you.</h2>
          <p>
            Sometimes my love comes out firmly because I believe in you and want the best for you. Underneath it is care, confidence in you, and the wish to see you choose what is best for yourself. I hope this year gives you strength, peace, and every reason to be proud of the person you are becoming.
          </p>
          <strong>With all my love,<br />Hadi</strong>
        </m.div>
      </section>

      <section className={`luna-finale ${candlesOut ? "is-celebrating" : ""}`}>
        <div className="luna-finale-stars" aria-hidden="true">
          {Array.from({ length: 18 }, (_, index) => <i key={index} style={{ "--star-index": index } as React.CSSProperties} />)}
        </div>
        <m.div className="luna-finale-copy" {...reveal}>
          <span>One last thing</span>
          <h2>I am always proud of you.</h2>
          <p>Happy 20th, Luna.</p>
        </m.div>
        <button
          className="luna-cake-button"
          type="button"
          onClick={() => setCandlesOut(true)}
          aria-label={candlesOut ? "The candles are out" : "Tap to blow out the candles"}
        >
          <span className="luna-candles" aria-hidden="true">
            <i><b /></i><i><b /></i>
          </span>
          <span className="luna-cake" aria-hidden="true">
            <i className="luna-cake-top" />
            <i className="luna-cake-middle">20</i>
            <i className="luna-cake-bottom" />
          </span>
          <span className="luna-cake-instruction">{candlesOut ? "Make a beautiful wish." : "Tap the candles"}</span>
        </button>
        <m.p className="luna-signature" animate={candlesOut ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}>
          With all my love, Hadi
        </m.p>
      </section>
    </div>
  );
}
