"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTheme } from "@/lib/theme-context";
import BlurText from "@/components/reactbits/BlurText/BlurText";
import { AuroraButton } from "@/components/ui/aurora-button";

interface HeroProps {
  title: string;
  subtitle?: string;
  ctaButtons?: {
    text: string;
    href: string;
    variant?: "default" | "outline" | "ghost";
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
  const [animationComplete, setAnimationComplete] = useState(false);
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

  // Handle animation completion
  const handleTitleAnimationComplete = () => {
    setAnimationComplete(true);
  };

  // Adjust overlay opacity and blur based on theme
  const overlayStyle = theme === "light" 
    ? "bg-black/25 backdrop-blur-[8px]" 
    : "bg-black/40 backdrop-blur-[8px]";

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
        {/* Darker overlay with blur for better text readability */}
        <div className={`absolute inset-0 ${overlayStyle}`}></div>
      </div>

      {/* Content with improved visibility */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-left sm:text-center">
        {/* Semi-transparent backdrop for text */}
        <div className="inline-block max-w-full">
          {/* Title */}
          <div className="text-4xl md:text-5xl lg:text-6xl font-display leading-tight mb-6 text-white">
            <BlurText
              text={title}
              delay={100}
              animateBy="words"
              direction="top"
              onAnimationComplete={handleTitleAnimationComplete}
              className="font-display inline-block font-bold"
              stepDuration={0.4}
            />
          </div>
          
          {/* Subtitle */}
          {subtitle && (
            <div className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 text-white/90">
              <BlurText
                text={subtitle}
                delay={150}
                animateBy="words"
                direction="bottom"
                className="font-medium leading-relaxed"
                stepDuration={0.35}
              />
            </div>
          )}
          
          {/* Call-to-action buttons */}
          {ctaButtons.length > 0 && (
            <div className={`flex flex-col sm:flex-row items-start sm:items-center sm:justify-center gap-4 transition-opacity duration-500 mt-6 ${animationComplete ? 'opacity-100' : 'opacity-0'}`}>
              {/* Map over all buttons */}
              {ctaButtons.map((button, index) => (
                <AuroraButton
                  key={index}
                  onClick={() => window.location.href = button.href}
                  variant={button.variant || (index === 0 ? "default" : "outline")}
                  className="px-6 py-3 font-medium"
                  glowClassName={index === 0 ? 
                    "from-highlight via-highlight/80 to-highlight/60" : 
                    "from-highlight/70 via-highlight/50 to-highlight/30"
                  }
                >
                  {button.text}
                </AuroraButton>
              ))}
            </div>
          )}
        </div>
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
                  ? "bg-white w-6"
                  : "bg-white/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
} 