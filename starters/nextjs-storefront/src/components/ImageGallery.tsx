"use client";

import { useState } from "react";
import Image from "next/image";

interface ImageGalleryProps {
  images: string[];
  title: string;
  isOnSale?: boolean;
}

export function ImageGallery({ images, title, isOnSale }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const hasImages = images.length > 0;

  return (
    <div className="w-full md:w-1/2 flex flex-col gap-4">
      {/* Main image */}
      <div
        className="aspect-[4/5] bg-gray-100 rounded-2xl relative overflow-hidden flex items-center justify-center group cursor-zoom-in"
        onClick={() => hasImages && setZoomed(true)}
        role={hasImages ? "button" : undefined}
        aria-label={hasImages ? `Zoom image: ${title}` : undefined}
        tabIndex={hasImages ? 0 : undefined}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (hasImages) setZoomed(true);
          }
        }}
      >
        {hasImages ? (
          <Image
            src={images[activeIndex]}
            alt={`${title} — image ${activeIndex + 1}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <span className="text-gray-400 text-sm">No Image Available</span>
        )}

        {isOnSale && (
          <span className="absolute top-4 left-4 bg-red-500 text-white font-bold px-3 py-1.5 rounded-full text-sm shadow z-10">
            Sale
          </span>
        )}

        {hasImages && (
          <span className="absolute bottom-3 right-3 bg-black/40 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm z-10">
            Click to zoom
          </span>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1" role="list" aria-label="Product images">
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              role="listitem"
              onClick={() => setActiveIndex(i)}
              aria-label={`View image ${i + 1}`}
              aria-pressed={i === activeIndex}
              className={`relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-black ${
                i === activeIndex
                  ? "border-black shadow-sm"
                  : "border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={src}
                alt={`${title} ${i + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox / zoom overlay */}
      {zoomed && hasImages && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setZoomed(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`Zoomed image: ${title}`}
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 text-white bg-white/20 hover:bg-white/30 rounded-full w-10 h-10 flex items-center justify-center transition-colors backdrop-blur-sm"
            onClick={() => setZoomed(false)}
            aria-label="Close zoom"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Image navigation */}
          {images.length > 1 && (
            <>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-white/20 hover:bg-white/30 rounded-full w-10 h-10 flex items-center justify-center transition-colors backdrop-blur-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
                }}
                aria-label="Previous image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                className="absolute right-16 top-1/2 -translate-y-1/2 text-white bg-white/20 hover:bg-white/30 rounded-full w-10 h-10 flex items-center justify-center transition-colors backdrop-blur-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
                }}
                aria-label="Next image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </>
          )}

          {/* Zoomed image container */}
          <div
            className="relative max-w-4xl max-h-[90vh] w-full h-full cursor-zoom-out"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[activeIndex]}
              alt={`${title} — zoomed`}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>
        </div>
      )}
    </div>
  );
}
