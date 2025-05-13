"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface DotPatternProps extends React.HTMLAttributes<SVGElement> {
  width?: any;
  height?: any;
  x?: any;
  y?: any;
  cx?: any;
  cy?: any;
  cr?: any;
  glow?: boolean;
}

export function DotPattern({
  className,
  width = 16,
  height = 16,
  x = 0,
  y = 0,
  cx = 1,
  cy = 1,
  cr = 1,
  glow = false,
  ...props
}: DotPatternProps) {
  return (
    <svg
      aria-hidden="true"
      width="100%"
      height="100%"
      className={cn("absolute inset-0 h-full w-full", className)}
      {...props}
    >
      <defs>
        <pattern
          id="dotPattern"
          x={x}
          y={y}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
        >
          <circle cx={cx} cy={cy} r={cr} className="fill-muted-foreground/20" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dotPattern)" />
      {glow && (
        <rect
          width="100%"
          height="100%"
          fill="url(#dotPattern)"
          className="blur-xl"
        />
      )}
    </svg>
  );
} 