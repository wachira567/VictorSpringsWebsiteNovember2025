"use client";

import Image from "next/image";
import { useState } from "react";

interface HeroGalleryProps {
  images: string[];
  title: string;
}

export default function HeroGallery({ images, title }: HeroGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  if (!images || images.length === 0) {
    return (
      <section className="hero-gallery">
        <div className="hero-gallery__main bg-light flex items-center justify-center">
          <span className="text-secondary-text">No images available</span>
        </div>
        <div className="hero-gallery__grid">
          <div className="hero-gallery__item bg-light"></div>
          <div className="hero-gallery__item bg-light"></div>
          <div className="hero-gallery__item bg-light"></div>
          <div className="hero-gallery__item bg-light"></div>
        </div>
      </section>
    );
  }

  const mainImage = images[selectedImage] || images[0];

  return (
    <section className="hero-gallery">
      <div className="hero-gallery__main">
        <Image
          src={mainImage}
          alt={title}
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="hero-gallery__overlay">View all photos</div>
        <button
          onClick={() => setSelectedImage((prev) => (prev + 1) % images.length)}
          className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md"
        >
          <span className="text-sm">→</span>
        </button>
      </div>
      <div className="hero-gallery__grid">
        {images.slice(0, 4).map((image, index) => (
          <div key={index} className="hero-gallery__item">
            <Image
              src={image}
              alt={`${title} - Thumbnail ${index + 1}`}
              fill
              className="object-cover cursor-pointer"
              onClick={() => setSelectedImage(index)}
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <div className="hero-gallery__overlay">View photo</div>
          </div>
        ))}
        {images.length > 4 && (
          <div className="hero-gallery__item bg-light flex items-center justify-center text-secondary-text cursor-pointer">
            +{images.length - 4} more
          </div>
        )}
      </div>
    </section>
  );
}
