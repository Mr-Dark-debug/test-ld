"use client";

import React, { useEffect, useRef, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface HorizontalScrollRevealProps {
  children: ReactNode;
  blurStrength?: number;
  baseOpacity?: number;
  className?: string;
  direction?: "left" | "right";
}

const HorizontalScrollReveal: React.FC<HorizontalScrollRevealProps> = ({
  children,
  blurStrength = 6,
  baseOpacity = 0.2,
  className = "",
  direction = "left",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !textRef.current) return;

    // Create a context to isolate the animations
    const ctx = gsap.context(() => {
      // Set initial state
      gsap.set(textRef.current, {
        x: direction === "left" ? -150 : 150,
        opacity: baseOpacity,
        filter: `blur(${blurStrength}px)`,
      });

      // Create animation
      gsap.to(textRef.current, {
        x: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
          end: "top 25%",
          scrub: 1,
          // markers: true, // Uncomment for debugging
          toggleActions: "play none none reverse",
        },
      });
    }, containerRef);

    // Cleanup
    return () => {
      ctx.revert(); // This handles cleanup of all GSAP animations in the context
    };
  }, [blurStrength, baseOpacity, direction]);

  return (
    <div 
      ref={containerRef} 
      className={`relative overflow-hidden ${className}`}
      style={{ willChange: "transform, opacity" }}
    >
      <div 
        ref={textRef} 
        className="text-lg md:text-xl leading-relaxed text-foreground/90"
        style={{ 
          opacity: baseOpacity,
          filter: `blur(${blurStrength}px)`,
          transform: `translateX(${direction === "left" ? "-150px" : "150px"})`,
          willChange: "transform, opacity, filter" 
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default HorizontalScrollReveal; 