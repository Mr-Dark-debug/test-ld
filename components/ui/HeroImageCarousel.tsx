"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, PanInfo } from "framer-motion";

interface HeroImageCarouselProps {
  images: { src: string; alt: string }[];
  interval?: number;
}

const HeroImageCarousel: React.FC<HeroImageCarouselProps> = ({
  images,
  interval = 3000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const nextSlide = () => {
    if (isDragging) return;
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    if (isDragging) return;
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    setIsDragging(false);
    setDragOffset(0);
    const threshold = 50;

    if (Math.abs(info.offset.x) > threshold) {
      if (info.offset.x > 0) {
        prevSlide();
      } else {
        nextSlide();
      }
      setIsAutoPlaying(false);
    }
  };

  useEffect(() => {
    if (images.length > 1 && isAutoPlaying && !isDragging) {
      const slideInterval = setInterval(nextSlide, interval);
      return () => clearInterval(slideInterval);
    }
  }, [images.length, interval, currentIndex, isAutoPlaying, isDragging]);

  if (!images || images.length === 0) {
    return null;
  }

  // Calculate transform position for infinite loop
  const getTransformX = () => {
    return `translateX(${(-currentIndex * 100) + dragOffset}%)`;
  };

  return (
    <div className="flex flex-col w-full h-full">
      {/* Image Carousel Container */}
      <div
        ref={containerRef}
        className="relative w-full h-full overflow-hidden"
      >
        <motion.div
          className="flex w-full h-full cursor-grab active:cursor-grabbing"
          style={{
            width: `${images.length * 100}%`,
            transform: getTransformX(),
          }}
          animate={{
            x: `${-currentIndex * (100 / images.length)}%`,
          }}
          transition={{
            type: "tween",
            ease: "easeInOut",
            duration: isDragging ? 0 : 0.6,
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.1}
          onDragStart={() => {
            setIsDragging(true);
            setIsAutoPlaying(false);
          }}
          onDrag={(event, info) => {
            setDragOffset(info.offset.x / (containerRef.current?.offsetWidth || 1) * 100);
          }}
          onDragEnd={handleDragEnd}
        >
          {images.map((image, index) => (
            <div
              key={index}
              className="relative flex-shrink-0"
              style={{ width: `${100 / images.length}%` }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="100vw"
                className="object-cover"
                priority={index === 0}
                quality={90}
              />
              {/* Subtle content overlay for better text visibility */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30"></div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Navigation Line Indicators - Below Image */}
      {images.length > 1 && (
        <div className="flex justify-center items-center py-4 bg-white">
          <div className="flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setIsAutoPlaying(false);
                }}
                className={`transition-all duration-300 hover:scale-105 ${
                  index === currentIndex
                    ? "w-8 h-1 bg-blue-900 rounded-full"
                    : "w-4 h-1 bg-blue-300 rounded-full hover:bg-blue-500"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroImageCarousel;