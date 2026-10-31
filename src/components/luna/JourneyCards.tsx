"use client";

import type { CSSProperties } from "react";
import { ArrowUpRight, Building2, Camera, CarFront, Coffee, Feather, Flame, Flower2, Leaf, MapPin, Moon, Orbit, Sparkles, Sun, Ticket, TrainFront, TramFront, Umbrella, Utensils, Waves, type LucideIcon } from "lucide-react";
import type { VaultChapter, VaultPhoto } from "@/lib/luna-vault";
import { VaultImage } from "./VaultImage";
import styles from "./journey-cards.module.css";

const motifIcons: Record<string, LucideIcon> = {
  city: Building2, skyline: Building2, paris: Building2, architecture: Building2,
  tide: Waves, coast: Waves, water: Waves, lake: Waves,
  garden: Leaf, leaves: Leaf, foliage: Leaf, picnic: Flower2, flowers: Flower2,
  cars: CarFront, automotive: CarFront, museum: CarFront, road: CarFront,
  cafe: Coffee, coffee: Coffee, restaurant: Utensils, dining: Utensils,
  night: Moon, rain: Moon, stars: Moon, rail: TrainFront, train: TrainFront,
  ticket: Ticket, postcard: Ticket, keepsake: Camera, archive: Camera, sunshine: Sun,
  prism: Sparkles, bokeh: Flower2, headlights: CarFront, tram: TramFront,
  meadow: Leaf, ink: Feather, orbit: Orbit, umbrellas: Umbrella,
  candle: Flame, paper: Camera, steam: Coffee, reflection: Sparkles,
};

interface JourneyCardsProps {
  chapters: VaultChapter[];
  photos: VaultPhoto[];
  onSelect: (id: string) => void;
  selectedId?: string;
  headingLabel?: string;
}

/** Photo-led entrances to individual memories. Sealed collections never enter this grid. */
export function JourneyCards({ chapters, photos, onSelect, selectedId, headingLabel = "Open journey" }: JourneyCardsProps) {
  const byId = new Map(photos.map(photo => [photo.id, photo]));
  const byChapter = new Map<string, VaultPhoto[]>();
  for (const photo of photos) {
    const members = byChapter.get(photo.group) ?? [];
    members.push(photo);
    byChapter.set(photo.group, members);
  }

  return (
    <div className={styles.cards}>
      {chapters.filter(chapter => chapter.presentation?.kind !== "sealed").map((chapter, index) => {
        const members = byChapter.get(chapter.id) ?? [];
        const requestedCover = byId.get(chapter.coverId);
        const cover = requestedCover?.group === chapter.id ? requestedCover : members[0];
        const theme = chapter.journey;
        const Mark = motifIcons[theme?.motif ?? ""] ?? MapPin;
        const selected = selectedId === chapter.id;
        const detailsId = `journey-card-details-${chapter.id}`;
        const themeStyle = {
          "--journey-accent": theme?.accent ?? "#155c65",
          "--journey-backdrop": theme?.backdrop ?? "#e8f0f1",
          "--journey-ink": theme?.ink ?? "#1f3444",
          "--card-angle": index % 2 === 0 ? "-1.2deg" : "1.1deg",
        } as CSSProperties;

        return (
          <button
            key={chapter.id}
            type="button"
            className={styles.card}
            style={themeStyle}
            onClick={() => onSelect(chapter.id)}
            aria-label={`Open ${chapter.title}`}
            aria-describedby={detailsId}
            data-journey-card={chapter.id}
            data-selected={selected ? "true" : "false"}
            data-motif={theme?.motif ?? "memory"}
          >
            <span className={styles.cover}>
              {cover && <VaultImage asset={cover.medium} alt="" fill retryOnParentClick={false} style={{ objectFit: "cover", objectPosition: "center" }} />}
              <span className={styles.coverShade} aria-hidden="true" />
              <span className={styles.cornerFold} aria-hidden="true" />
              <span className={styles.mark} aria-hidden="true"><Mark size={22} strokeWidth={1.3} /></span>
              <span className={styles.coverAction} aria-hidden="true"><ArrowUpRight size={23} strokeWidth={1.35} /></span>
            </span>
            <span className={styles.paper}>
              <span className={styles.title}>{chapter.title}</span>
              <span id={detailsId} className={styles.details}>
                <span>{chapter.dateLabel}</span>
                <span>{members.length} {members.length === 1 ? "photograph" : "photographs"}</span>
              </span>
              <span className={styles.openLabel}>{headingLabel} <ArrowUpRight size={16} aria-hidden="true" /></span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
