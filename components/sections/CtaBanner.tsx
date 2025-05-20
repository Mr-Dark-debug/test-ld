"use client";

import React from "react";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import Image from "next/image";
import { useTheme } from "@/lib/theme-context";
import AnimatedTitle from "@/components/ui/AnimatedTitle";

interface CtaBannerProps {
  title: string;
  description?: string;
  backgroundImageSrc?: string;
  buttons: {
    text: string;
    href: string;
    variant?: "default" | "outline" | "ghost" | "light" | "dark";
  }[];
  align?: "left" | "center" | "right";
}

export default function CtaBanner({
  title,
  description,
  backgroundImageSrc,
  buttons,
  align = "center",
}: CtaBannerProps) {
  const { theme } = useTheme();
  const alignmentClasses = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  };

  // Adjust overlay opacity based on theme - reduced further
  const overlayOpacity = theme === "light" ? "bg-primary/20" : "bg-primary/40";
  const gradientBg = theme === "light" 
    ? "bg-gradient-to-r from-primary/20 via-primary/15 to-primary/20" 
    : "bg-gradient-to-r from-primary/70 via-primary/60 to-primary/70";

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background */}
      {backgroundImageSrc ? (
        <>
          <div className="absolute inset-0 z-0">
            <Image
              src={backgroundImageSrc}
              alt="Background"
              fill
              className="object-cover"
            />
            <div className={`absolute inset-0 ${overlayOpacity}`}></div>
          </div>
        </>
      ) : (
        <div className={`absolute inset-0 ${gradientBg}`}></div>
      )}

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex flex-col ${alignmentClasses[align]} max-w-3xl mx-auto`}>
          <AnimatedTitle as="h2" className="text-foreground mb-6 text-3xl md:text-4xl lg:text-5xl">
            {title}
          </AnimatedTitle>
          {description && (
            <p className="text-lg md:text-xl text-foreground/80 mb-8 max-w-2xl">
              {description}
            </p>
          )}
          <div className="flex flex-wrap gap-4 justify-center">
            {buttons.map((button, index) => (
              index === 0 ? (
                <ShimmerButton
                  key={index}
                  onClick={() => window.location.href = button.href}
                  shimmerColor="#3b82f6"
                  background="rgba(59, 130, 246, 0.9)"
                  className="font-medium"
                >
                  {button.text}
                </ShimmerButton>
              ) : (
                <ShimmerButton
                  key={index}
                  onClick={() => window.location.href = button.href}
                  shimmerColor="#ffffff"
                  background="rgba(255, 255, 255, 0.1)"
                  className="font-medium"
                >
                  {button.text}
                </ShimmerButton>
              )
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 