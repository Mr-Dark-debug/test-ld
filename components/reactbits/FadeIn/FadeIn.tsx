"use client";

import React, { useEffect, useRef, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  x?: number;
  className?: string;
  once?: boolean;
  stagger?: number;
  fromOpacity?: number;
  triggerStart?: string;
  triggerEnd?: string;
}

const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = 0,
  duration = 0.6,
  y = 30,
  x = 0,
  className = "",
  once = true,
  stagger = 0.1,
  fromOpacity = 0,
  triggerStart = "top bottom-=100",
  triggerEnd = "bottom center"
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // For elements that need staggered animation (like multiple children)
    const childElements = element.children;
    const hasMultipleChildren = childElements.length > 1;
    
    const target = hasMultipleChildren ? childElements : element;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start: triggerStart,
        end: triggerEnd,
        toggleActions: once ? "play none none none" : "play reverse play reverse",
      }
    });

    tl.fromTo(
      target,
      {
        opacity: fromOpacity,
        y,
        x,
      },
      {
        opacity: 1,
        y: 0,
        x: 0,
        duration,
        delay,
        stagger: hasMultipleChildren ? stagger : 0,
        ease: "power2.out",
      }
    );

    return () => {
      // Cleanup
      tl.kill();
    };
  }, [delay, duration, y, x, once, stagger, fromOpacity, triggerStart, triggerEnd]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

export default FadeIn; 