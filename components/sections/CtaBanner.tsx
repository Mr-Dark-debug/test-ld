"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { useTheme } from "@/lib/theme-context";

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

  // Adjust overlay opacity based on theme
  const overlayOpacity = theme === "light" ? "bg-primary/40" : "bg-primary/70";
  const gradientBg = theme === "light" 
    ? "bg-gradient-to-r from-primary/40 via-primary/30 to-primary/40" 
    : "bg-gradient-to-r from-primary via-primary/90 to-primary";

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
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display text-foreground mb-6">
            {title}
          </h2>
          {description && (
            <p className="text-lg md:text-xl text-foreground/80 mb-8 max-w-2xl">
              {description}
            </p>
          )}
          <div className="flex flex-wrap gap-4 justify-center">
            {buttons.map((button, index) => (
              <Button
                key={index}
                href={button.href}
                variant={button.variant || (index === 0 ? "default" : "outline")}
                size="lg"
              >
                {button.text}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 