"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

interface HeroImageCarouselProps {
  images: { src: string; alt: string }[];
  interval?: number;
}

const slideVariants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
    };
  },
};

const HeroImageCarousel: React.FC<HeroImageCarouselProps> = ({
  images,
  interval = 3000, // Slightly increased interval for slide
}) => {
  const [[page, direction], setPage] = useState([0, 0]);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  const currentIndex = ((page % images.length) + images.length) % images.length; // Handles positive and negative modulo

  useEffect(() => {
    if (images.length > 1) {
      const slideInterval = setInterval(() => {
        paginate(1); // Move to the next slide (right to left visually)
      }, interval);
      return () => clearInterval(slideInterval);
    }
  }, [images.length, interval, page]); // Added page to dependencies to reset interval if manually paginated

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={page} // Use page for key to ensure re-render on direction change for exit/enter
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.3 },
          }}
          className="absolute inset-0 w-full h-full"
        >
          <Image
            src={images[currentIndex].src}
            alt={images[currentIndex].alt}
            fill
            className="object-cover"
            priority={currentIndex === 0}
          />
        </motion.div>
      </AnimatePresence>
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                // Determine direction for pagination based on current and target index
                const diff = index - currentIndex;
                // Check for wrap-around cases for smoother pagination
                if (Math.abs(diff) > images.length / 2) {
                  setPage([index, diff > 0 ? -1 : 1]);
                } else {
                  setPage([index, diff]);
                }
              }}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 hover:bg-white/90 ${
                index === currentIndex ? "bg-white scale-125" : "bg-white/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroImageCarousel; 