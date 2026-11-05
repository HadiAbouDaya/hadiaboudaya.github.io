import { Fragment } from "react";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { JOURNEY_CHAPTERS } from "@/data/about";
import styles from "./journey.module.css";

export function JourneySection() {
  return (
    <section aria-labelledby="journey-heading" className={styles.journey}>
      <h2 id="journey-heading" className="text-headline text-fg">My journey</h2>
      <div className={styles.layout}>
        {JOURNEY_CHAPTERS.map((chapter, index) => (
          <Fragment key={chapter.id}>
            <section aria-labelledby={`journey-${chapter.id}`} className={styles.chapter}>
              <h3 id={`journey-${chapter.id}`}>{chapter.heading}</h3>
              <p>{chapter.paragraph}</p>
            </section>
            {index === 0 && (
              <figure className={styles.portrait}>
                <ImageWithFallback
                  src="/Media/profile/journey.webp"
                  alt="Hadi Abou Daya seated outdoors"
                  width={400}
                  height={500}
                  sizes="(min-width: 1024px) 340px, (min-width: 400px) 250px, 74vw"
                  fallbackText="HA"
                  className="w-full h-full object-cover"
                  fallbackClassName="text-5xl bg-surface-sunken text-fg-lo"
                />
              </figure>
            )}
          </Fragment>
        ))}
      </div>
    </section>
  );
}
