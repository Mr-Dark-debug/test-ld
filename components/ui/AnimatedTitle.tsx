"use client";

import React, { ReactNode } from "react";
import ScrollFloat from "@/components/reactbits/ScrollFloat/ScrollFloat";

interface AnimatedTitleProps {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  children: ReactNode;
  className?: string;
  animationDuration?: number;
  ease?: string;
  scrollStart?: string;
  scrollEnd?: string;
  stagger?: number;
}

const AnimatedTitle: React.FC<AnimatedTitleProps> = ({
  as = "h2",
  children,
  className = "",
  animationDuration = 1,
  ease = "back.inOut(2)",
  scrollStart = "center bottom+=50%",
  scrollEnd = "bottom bottom-=40%",
  stagger = 0.03
}) => {
  // Define base styling for each heading level
  const headingStyles = {
    h1: "text-4xl md:text-5xl font-display mb-6 whitespace-normal break-words",
    h2: "text-3xl md:text-4xl font-display mb-4 whitespace-normal break-words",
    h3: "text-2xl md:text-3xl font-display mb-3 whitespace-normal break-words",
    h4: "text-xl md:text-2xl font-display mb-2 whitespace-normal break-words",
    h5: "text-lg md:text-xl font-display mb-2 whitespace-normal break-words",
    h6: "text-base md:text-lg font-display mb-2 whitespace-normal break-words"
  };

  const baseStyles = headingStyles[as];
  
  return (
    <ScrollFloat
      containerClassName={`${baseStyles} ${className}`}
      animationDuration={animationDuration}
      ease={ease}
      scrollStart={scrollStart}
      scrollEnd={scrollEnd}
      stagger={stagger}
    >
      {children}
    </ScrollFloat>
  );
};

export default AnimatedTitle; 