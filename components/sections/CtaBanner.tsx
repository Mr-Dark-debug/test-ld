"use client";

import React, { ReactNode } from "react";
import Image from "next/image";
import { useTheme } from "@/lib/theme-context";
import AnimatedTitle from "@/components/ui/AnimatedTitle";
import { AuroraButton } from "@/components/ui/aurora-button";

interface CtaBannerProps {
  title: string | ReactNode;
  description?: string;
  backgroundImageSrc?: string;
  buttons: {
    text: string;
    href: string;
    variant?: "default" | "outline" | "ghost";
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
  const overlayOpacity = theme === "light" ? "bg-primary/20" : "bg-black/70";
  const gradientBg = theme === "light" 
    ? "bg-gradient-to-r from-primary/20 via-primary/15 to-primary/20" 
    : "bg-gradient-to-r from-black/90 via-black/80 to-black/90";

  return (
    <section className="relative py-16 md:py-24 overflow-hidden dark:border-t dark:border-gray-800">
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
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
        <div className={`flex flex-col w-full max-w-3xl items-center text-center mx-auto`}>
          <div className="w-full">
            <AnimatedTitle
              as="h2"
              className="text-foreground mb-6 text-3xl md:text-4xl lg:text-5xl leading-tight break-words hyphens-auto"
            >
              {title}
            </AnimatedTitle>
          </div>
          {description && (
            <p className="text-lg md:text-xl text-foreground/80 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              {description}
            </p>
          )}
          <div className="flex flex-row flex-wrap gap-4 justify-center items-center w-full mt-2">
            {buttons.map((button, index) => (
              <AuroraButton
                key={index}
                onClick={() => window.location.href = button.href}
                variant={button.variant || (index === 0 ? "default" : "outline")}
                className="min-w-[170px] px-6 py-3 font-medium dark:border-blue-500 dark:hover:border-blue-400"
              >
                {button.text}
              </AuroraButton>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 