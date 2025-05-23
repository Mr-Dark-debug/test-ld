"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface FeatureCardData {
  id: string;
  title: string;
  icon: React.ReactNode;
  description?: string; // Optional description for more detailed cards if needed elsewhere
}

interface ScrollingFeatureCardsProps {
  features: FeatureCardData[];
  speed?: number; // Pixels per second
  className?: string;
  cardClassName?: string;
  direction?: 'left' | 'right'; // Add direction prop
}

const ScrollingFeatureCards: React.FC<ScrollingFeatureCardsProps> = ({
  features,
  speed = 40, // Adjusted default speed
  className,
  cardClassName,
  direction = 'left', // Default direction
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Duplicate features for seamless looping effect
  const duplicatedFeatures = React.useMemo(() => [...features, ...features, ...features], [features]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const marqueeWidth = marqueeRef.current ? marqueeRef.current.offsetWidth / 3 : 0; // Adjusted for three sets of features

  const marqueeVariants = {
    animate: {
      x: direction === 'left' ? [0, -marqueeWidth] : [-marqueeWidth, 0],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: 'loop' as const,
          duration: marqueeWidth / speed,
          ease: 'linear',
        },
      },
    },
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative w-full overflow-hidden group',
        className
      )}
      style={{
         maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
      } as React.CSSProperties}
    >
      <motion.div
        ref={marqueeRef}
        className="flex w-max"
        variants={marqueeVariants}
        animate="animate"
        // Add hover pause/resume with smoother transition
        onHoverStart={() => { if(marqueeRef.current) marqueeRef.current.style.animationPlayState = 'paused';}}
        onHoverEnd={() => { if(marqueeRef.current) marqueeRef.current.style.animationPlayState = 'running';}}
      >
        {duplicatedFeatures.map((feature, index) => (
          <div
            key={`${feature.id}-${index}-${direction}`} // Ensure unique key with direction
            className={cn(
              'flex-shrink-0 w-56 h-36 p-4 bg-card dark:bg-gray-800/50 rounded-lg shadow-md mx-2.5', // Slightly smaller cards, adjusted margin
              // Theme-colored border
              'border-2 border-primary/30 hover:border-primary/70 transition-all duration-300 ease-in-out',
              'flex flex-col items-center justify-center text-center',
              // Removed group-hover pause as it's handled by motion component's onHover
              'transform hover:scale-105', // Add slight scale on hover
              cardClassName
            )}
          >
            <div className="text-primary mb-2 text-2xl transition-transform duration-300 group-hover:scale-110">
              {feature.icon}
            </div>
            <h3 className="text-sm font-medium text-foreground dark:text-gray-100">
              {feature.title}
            </h3>
          </div>
        ))}
      </motion.div>

      {/* Enhanced Fade overlays with blur - consider if maskImage on parent is enough */}
      {/* <div className="absolute inset-y-0 left-0 w-20 md:w-32 bg-gradient-to-r from-background via-background/80 to-transparent pointer-events-none backdrop-blur-xs"></div> */}
      {/* <div className="absolute inset-y-0 right-0 w-20 md:w-32 bg-gradient-to-l from-background via-background/80 to-transparent pointer-events-none backdrop-blur-xs"></div> */}
    </div>
  );
};

export default ScrollingFeatureCards; 