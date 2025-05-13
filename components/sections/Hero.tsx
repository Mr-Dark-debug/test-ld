"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/lib/theme-context";

interface HeroProps {
  title: string;
  subtitle?: string;
  ctaButtons?: {
    text: string;
    href: string;
    variant?: "default" | "outline" | "ghost" | "light" | "dark";
  }[];
  backgroundType: "video" | "carousel";
  videoSrc?: string;
  images?: {
    src: string;
    alt: string;
  }[];
}

export default function Hero({
  title,
  subtitle,
  ctaButtons = [],
  backgroundType = "carousel",
  videoSrc,
  images = [],
}: HeroProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { theme } = useTheme();

  useEffect(() => {
    if (backgroundType === "carousel" && images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => 
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [backgroundType, images.length]);

  // Adjust overlay opacity based on theme
  const overlayOpacity = theme === "light" ? "bg-primary/15" : "bg-primary/30";

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        {backgroundType === "video" && videoSrc ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          images.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
                index === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                priority={index === 0}
                className="object-cover"
              />
            </div>
          ))
        )}
        <div className={`absolute inset-0 ${overlayOpacity}`}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display text-foreground leading-tight mb-6">{title}</h1>
        {subtitle && (
          <p className="text-xl md:text-2xl text-foreground/90 max-w-3xl mx-auto mb-8">
            {subtitle}
          </p>
        )}
        {ctaButtons.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {ctaButtons.map((button, index) => (
              <Button
                key={index}
                href={button.href}
                variant={button.variant || (index === 0 ? "default" : "outline")}
                size="lg"
              >
                {button.text}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Carousel Indicators */}
      {backgroundType === "carousel" && images.length > 1 && (
        <div className="absolute bottom-10 left-0 right-0 z-10 flex justify-center space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentImageIndex
                  ? "bg-highlight w-6"
                  : "bg-foreground/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
} 