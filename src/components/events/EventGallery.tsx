"use client";

import Image from "next/image";
import { ImageLightbox } from "@/components/ui/ImageLightbox";
import { CreativeCarousel } from "@/components/ui/CreativeCarousel";
import { cn } from "@/lib/utils";

export function EventGallery({ images, title, imagePosition }: { images: string[]; title: string; imagePosition?: "top" | "center" | "bottom" }) {
  return (
    <ImageLightbox images={images} alt={title}>
      {(openAt) => images.length > 3 ? (
        <CreativeCarousel images={images} alt={title} onImageClick={openAt} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
          {images.map((src, index) => (
            <button type="button" key={src} onClick={() => openAt(index)} aria-label={`Enlarge ${title}, image ${index + 1} of ${images.length}`} className="group/photo relative aspect-[4/3] rounded-card-lg overflow-hidden cursor-zoom-in">
              <Image src={src} alt={`${title}, image ${index + 1} of ${images.length}`} fill priority={index === 0} className={cn("object-cover transition-transform duration-300 group-hover/photo:scale-[1.03]", imagePosition === "top" && "object-top", imagePosition === "bottom" && "object-bottom")} sizes="(max-width: 640px) 50vw, 256px" />
            </button>
          ))}
        </div>
      )}
    </ImageLightbox>
  );
}
