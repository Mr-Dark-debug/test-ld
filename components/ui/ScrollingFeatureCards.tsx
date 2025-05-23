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
  speed = 40,
  className,
  cardClassName,
  direction = 'left',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [currentMarqueeWidth, setCurrentMarqueeWidth] = useState(0);

  const duplicatedFeatures = React.useMemo(() => {
    // Ensure at least 3 sets for a smooth visual loop, especially if feature set is small.
    const baseFeatures = features && features.length > 0 ? features : [{id: 'placeholder', title: 'Loading...', icon: '...'}]; // Handle empty features
    const numSets = Math.max(3, Math.ceil(12 / baseFeatures.length)); // Aim for at least ~12 cards visible if possible before repeat
    let temp = [];
    for (let i = 0; i < numSets; i++) {
      temp.push(...baseFeatures);
    }
    return temp;
  }, [features]);

  useEffect(() => {
    const calculateWidth = () => {
      if (marqueeRef.current && features && features.length > 0) {
        const numSets = duplicatedFeatures.length / features.length;
        const totalScrollWidth = marqueeRef.current.scrollWidth;
        if (numSets > 0 && totalScrollWidth > 0) {
            const singleSetWidth = totalScrollWidth / numSets;
            setCurrentMarqueeWidth(singleSetWidth);
        }
      }
    };

    // Initial calculation after mount and layout is stable
    const animationFrameId = requestAnimationFrame(() => {
        calculateWidth();
        setIsMounted(true); // Set mounted after first calculation attempt
    });

    window.addEventListener('resize', calculateWidth);
    return () => {
      window.removeEventListener('resize', calculateWidth);
      cancelAnimationFrame(animationFrameId);
    };
  }, [features, duplicatedFeatures.length]); // Rerun if features change

  // Fallback to static scrollable view if not mounted, no features, or width calculation failed
  if (!isMounted || !features || features.length === 0 || currentMarqueeWidth === 0) {
    return (
      <div className={cn(
        'flex overflow-x-auto p-4 space-x-4',
        'scrollbar-hide md:scrollbar-default',
        '[-ms-overflow-style:none]',
        '[scrollbar-width:none]',
        className
        )}>
        {(features && features.length > 0 ? features : [{id: 'placeholder-fallback', title: 'Loading items...', icon: '...'}]).map((feature) => (
          <div
            key={`${feature.id}-static`}
            className={cn(
              'flex-shrink-0 w-56 h-36 p-4 bg-card dark:bg-gray-800/50 rounded-lg shadow-md',
              'border-2 border-primary/30',
              'flex flex-col items-center justify-center text-center',
              cardClassName
            )}
          >
            <div className="text-primary mb-2 text-2xl">{feature.icon}</div>
            <h3 className="text-sm font-medium text-foreground dark:text-gray-100">
              {feature.title}
            </h3>
          </div>
        ))}
      </div>
    );
  }

  const animationDuration = currentMarqueeWidth > 0 && speed > 0 ? currentMarqueeWidth / speed : 60;

  const marqueeVariants = {
    animate: {
      x: direction === 'left' ? [0, -currentMarqueeWidth] : [-currentMarqueeWidth, 0],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: 'loop' as const,
          duration: animationDuration,
          ease: 'linear',
        },
      },
    },
  };
  
  // Dynamic maskImage for responsive fade
  const maskImageStyle = {
    maskImage: `linear-gradient(to right, transparent, black 5%, black 95%, transparent)`,
    WebkitMaskImage: `linear-gradient(to right, transparent, black 5%, black 95%, transparent)`,
  };
  
  // On very small screens, reduce the fade even more or remove it
  // This requires a bit more complex logic, possibly with a window resize listener
  // For now, a slightly less aggressive mask is applied generally.

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative w-full overflow-hidden group',
        className
      )}
      style={maskImageStyle as React.CSSProperties}
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