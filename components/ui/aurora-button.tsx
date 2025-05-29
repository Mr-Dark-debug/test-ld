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
          glowClassName
        )}
      />

      {/* Button */}
      <button
        className={cn(
          "relative rounded-lg px-6 py-2.5 text-base font-semibold",
          "transition-all duration-200",
          "border",
          "group-hover:scale-105", /* Scale up slightly on hover */
          {
            // Solid button
            "bg-accent text-white border-accent hover:bg-gradient-to-r from-[#4F46E5] to-[#8B5CF6] active:bg-accent/80 focus:ring-2 focus:ring-accent/50 focus:outline-none": variant === "default",
            // Modern outline button with improved visibility
            "bg-transparent border-accent text-accent dark:text-white dark:border-white/80 hover:bg-accent hover:text-white dark:hover:bg-accent dark:hover:text-white focus:ring-2 focus:ring-accent/50 focus:outline-none": variant === "outline",
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