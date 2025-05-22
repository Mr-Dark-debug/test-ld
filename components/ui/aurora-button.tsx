"use client"

import * as React from "react";
import { cn } from "@/lib/utils";

interface AuroraButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: React.ReactNode;
  glowClassName?: string;
  variant?: "default" | "outline" | "ghost";
}

export function AuroraButton({
  className,
  children,
  glowClassName,
  variant = "default",
  ...props
}: AuroraButtonProps) {
  return (
    <div className="relative">
      {/* Gradient border container */}
      <div
        className={cn(
          "absolute -inset-[2px] rounded-lg bg-gradient-to-r from-highlight via-highlight/80 to-highlight/60 opacity-75 blur-lg transition-all",
          "group-hover:opacity-100 group-hover:blur-xl",
          glowClassName
        )}
      />

      {/* Button */}
      <button
        className={cn(
          "relative rounded-lg px-4 py-2",
          "text-white shadow-xl",
          "transition-all",
          "group border border-transparent",
          {
            "bg-accent hover:bg-accent/90": variant === "default",
            "bg-transparent border-accent hover:bg-accent/10": variant === "outline",
            "bg-transparent hover:bg-accent/10": variant === "ghost",
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    </div>
  );
} 