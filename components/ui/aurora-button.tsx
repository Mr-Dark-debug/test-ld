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
    <div className="relative group">
      {/* Clean border highlight on hover without blur */}
      <div
        className={cn(
          "pointer-events-none absolute -inset-[1px] rounded-lg bg-gradient-to-r from-highlight to-highlight/80 opacity-0 transition-opacity duration-200",
          "group-hover:opacity-100 group-focus-within:opacity-100",
          glowClassName
        )}
      />

      {/* Button */}
      <button
        className={cn(
          "relative rounded-lg px-6 py-2.5 text-base font-semibold",
          "transition-all duration-200",
          "border",
          {
            // Solid button
            "bg-accent text-white border-accent hover:bg-accent/90 active:bg-accent/80 focus:ring-2 focus:ring-accent/50 focus:outline-none": variant === "default",
            // Modern outline button with improved visibility
            "bg-transparent border-accent text-accent dark:text-white dark:border-white/80 hover:bg-accent/10 hover:border-accent dark:hover:bg-accent/20 dark:hover:border-white focus:ring-2 focus:ring-accent/50 focus:outline-none": variant === "outline",
            // Ghost button
            "bg-transparent text-accent dark:text-white hover:bg-accent/10 dark:hover:bg-accent/20 focus:ring-2 focus:ring-accent/50 focus:outline-none": variant === "ghost",
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