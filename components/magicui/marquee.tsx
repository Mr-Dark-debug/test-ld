"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  vertical?: boolean;
  children: React.ReactNode;
  repeat?: number;
}

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  vertical = false,
  children,
  repeat = 1,
}: MarqueeProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [contentWidth, setContentWidth] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    const calculateDimensions = () => {
      if (contentRef.current && containerRef.current) {
        setContentWidth(contentRef.current.scrollWidth);
        setContentHeight(contentRef.current.scrollHeight);
        setContainerWidth(containerRef.current.clientWidth);
        setContainerHeight(containerRef.current.clientHeight);
      }
    };

    calculateDimensions();
    window.addEventListener("resize", calculateDimensions);

    return () => {
      window.removeEventListener("resize", calculateDimensions);
    };
  }, []);

  const shouldAnimate = vertical
    ? contentHeight > containerHeight
    : contentWidth > containerWidth;

  return (
    <div
      ref={containerRef}
      className={cn(
        "group relative overflow-hidden [--duration:40s] [--gap:1rem]",
        className
      )}
    >
      <div
        className={cn(
          "flex shrink-0 items-center justify-center gap-[--gap] [--transform:translateX(calc(var(--gap) * -1))]",
          vertical && "flex-col [--transform:translateY(calc(var(--gap) * -1))]",
          shouldAnimate && pauseOnHover && "group-hover:[animation-play-state:paused]"
        )}
      >
        {[...Array(shouldAnimate ? 2 : 1)].map((_, i) => (
          <div
            key={i}
            ref={i === 0 ? contentRef : undefined}
            className={cn(
              "flex shrink-0 items-center justify-center gap-[--gap]",
              vertical && "flex-col",
              shouldAnimate
                ? "animate-marquee [animation-duration:var(--duration)] [animation-timing-function:linear] [animation-iteration-count:infinite]"
                : "[transform:var(--transform)]",
              shouldAnimate && reverse && "[animation-direction:reverse]"
            )}
            aria-hidden={i === 1}
          >
            {Array.from({ length: repeat }).map((_, index) => (
              <div key={index} className="flex items-center gap-[--gap]">
                {children}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
} 