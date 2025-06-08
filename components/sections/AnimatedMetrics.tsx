"use client";

import { useEffect, useRef, useState } from "react";
import { GridPattern } from "@/components/magicui/grid-pattern";
import { cn } from "@/lib/utils";

interface MetricProps {
  value: string;
  unit?: string;
  subLabel?: string;
  label: string;
  icon: React.ReactNode;
}

interface AnimatedMetricsProps {
  metrics: MetricProps[];
}

const Metric = ({ value, unit, subLabel, label, icon }: MetricProps) => {
  const [animatedValue, setAnimatedValue] = useState("0");
  const [isAnimating, setIsAnimating] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;

            setIsAnimating(true);

            // Extract numeric value for animation
            const numericValue = value.replace(/[^\d]/g, '');
            const targetNumber = parseInt(numericValue, 10);

            if (targetNumber > 0) {
              const duration = 2000; // 2 seconds for smoother animation
              const steps = 60; // More steps for smoother animation

              // For the first card (1 Cr+), show a cleaner counting animation
              if (value === "1" && unit === "Cr+") {
                // Show a smooth counting animation from higher numbers down to 1
                let currentStep = 0;
                const totalSteps = 50;

                const interval = setInterval(() => {
                  currentStep++;

                  if (currentStep <= 15) {
                    // Show decreasing numbers from 999 to 100
                    const startNum = 999;
                    const endNum = 100;
                    const progress = currentStep / 15;
                    const currentNum = Math.floor(startNum - (startNum - endNum) * progress);
                    setAnimatedValue(currentNum.toString());
                  } else if (currentStep <= 35) {
                    // Show decreasing numbers from 100 to 10
                    const startNum = 100;
                    const endNum = 10;
                    const progress = (currentStep - 15) / 20;
                    const currentNum = Math.floor(startNum - (startNum - endNum) * progress);
                    setAnimatedValue(currentNum.toString());
                  } else if (currentStep <= 45) {
                    // Show decreasing numbers from 10 to 1
                    const startNum = 10;
                    const endNum = 1;
                    const progress = (currentStep - 35) / 10;
                    const currentNum = Math.floor(startNum - (startNum - endNum) * progress);
                    setAnimatedValue(currentNum.toString());
                  } else {
                    // Final phase - show 1
                    setAnimatedValue("1");
                    if (currentStep >= totalSteps) {
                      clearInterval(interval);
                      setIsAnimating(false);
                    }
                  }
                }, duration / totalSteps);
              } else {
                // Regular animation for other cards
                const stepValue = targetNumber / steps;
                let currentStep = 0;

                const interval = setInterval(() => {
                  currentStep++;

                  if (currentStep >= steps) {
                    setAnimatedValue(value);
                    clearInterval(interval);
                    setIsAnimating(false);
                  } else {
                    const current = Math.floor(stepValue * currentStep);
                    const displayValue = current.toString() + (value.includes('+') ? '+' : '');
                    setAnimatedValue(displayValue);
                  }
                }, duration / steps);
              }
            } else {
              // Fallback for non-numeric values
              setAnimatedValue(value);
              setIsAnimating(false);
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [value, unit]);

  return (
    <div ref={ref} className="relative flex flex-col items-center text-center h-full group">
      {/* Icon floating at top with glowing effect - fixed center alignment */}
      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 flex items-center justify-center w-16 h-16 rounded-full bg-background shadow-md border-2 border-accent/40 dark:border-blue-400 z-20 group-hover:border-accent/60 dark:group-hover:border-blue-500 transition-all duration-300">
        <div className="flex items-center justify-center w-full h-full">
          <div className="text-accent w-9 h-9 group-hover:text-accent/90 dark:text-blue-400 group-hover:dark:text-blue-200">{icon}</div>
        </div>
      </div>
      
      {/* Main metric display with better symmetry and alignment */}
      <div className="w-full h-full pt-10 pb-3 px-4 flex flex-col justify-center items-center bg-gradient-to-br from-background/90 to-background/80 dark:from-slate-800 dark:to-slate-900 backdrop-blur-md rounded-lg relative z-10 overflow-hidden shadow-md group-hover:from-background/95 group-hover:to-background/85 dark:group-hover:from-slate-600 dark:group-hover:to-slate-700 group-hover:shadow-lg transition-all duration-300">
        {/* Decorative angled line */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-40 bg-accent/5 group-hover:bg-accent/10 transform -rotate-45 translate-x-1/3 translate-y-1/4 transition-colors duration-300"></div>
        </div>
        
        {/* Light glow effect on hover */}
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 dark:group-hover:bg-blue-400/15 pointer-events-none transition-colors duration-300 dark:bg-transparent"></div>
        
        {/* Number with proper alignment and underline */}
        <div className="text-5xl sm:text-5xl lg:text-6xl font-display font-bold mt-2 mb-1 text-center">
          <div className="inline-block relative">
            {/* Show animated value and unit */}
            <>
              <span className="bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent group-hover:from-accent/90 group-hover:to-accent transition-all duration-300 dark:from-blue-400 dark:to-blue-500">
                {animatedValue.replace(/\+$/, '')}
              </span>
              {unit && (
                <span className="text-4xl sm:text-4xl lg:text-5xl text-accent ml-1 group-hover:text-accent/90 dark:text-blue-400 font-display font-bold">
                  {unit}
                  {subLabel && unit === "Cr+" && (
                    <span className="hidden sm:inline text-lg sm:text-xl text-accent/80 ml-1 align-middle">
                      {subLabel}
                    </span>
                  )}
                </span>
              )}
              {animatedValue.includes('+') && !unit && (
                <span className="text-2xl sm:text-3xl text-accent align-top ml-0.5 group-hover:text-accent/90 dark:text-blue-400">
                  +
                </span>
              )}
            </>
            {/* Properly centered underline */}
            <div className="absolute -bottom-1 left-0 right-0 mx-auto h-[2px] w-3/4 bg-accent/30 group-hover:bg-accent/50 rounded-full transition-colors duration-300 dark:bg-blue-500/50 dark:group-hover:bg-blue-300/80"></div>
          </div>
        </div>

        {/* Sub-label for construction area - mobile version (separate line for Cr+ Sq. Ft.) */}
        {subLabel && unit === "Cr+" && (
          <div className="sm:hidden text-sm text-accent/80 dark:text-blue-400/80 -mt-1 mb-1 font-semibold tracking-wide text-center">
            {subLabel}
          </div>
        )}

        {/* Sub-label for other cases - only show if not displayed with unit */}
        {subLabel && !(unit === "Cr+" && subLabel) && (
          <div className="text-sm sm:text-base text-accent/80 dark:text-blue-400/80 -mt-1 mb-1 font-semibold tracking-wide">
            {subLabel}
          </div>
        )}
        
        {/* Decorative dots with proper spacing */}
        <div className="flex space-x-2 my-2 justify-center">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-1 h-1 rounded-full bg-accent/40 group-hover:bg-accent/60 transition-colors duration-300 dark:bg-blue-500/60 dark:group-hover:bg-blue-300/90"></div>
          ))}
        </div>
        
        {/* Label with better sizing for mobile */}
        <p className="text-foreground/80 group-hover:text-foreground/90 font-medium tracking-wide text-[11px] sm:text-xs uppercase text-center px-1 transition-colors duration-300 dark:text-slate-300 dark:group-hover:text-slate-50">
          {label}
        </p>
      </div>
      
      {/* Decorative bottom accent - properly centered */}
      <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-accent/40 to-transparent group-hover:via-accent/60 rounded-full transition-colors duration-300 dark:via-blue-500/60 dark:group-hover:via-blue-300/90"></div>
    </div>
  );
};

export default function AnimatedMetrics({ metrics }: AnimatedMetricsProps) {
  return (
    <section className="relative py-10 sm:py-14 overflow-hidden bg-background dark:bg-background">
      {/* Background with subtle pattern */}
      <div className="absolute inset-0 bg-muted/30 dark:bg-muted/20">
        <GridPattern
          width={32}
          height={32}
          x={0}
          y={0}
          strokeDasharray="1 2"
          className="stroke-gray-200 dark:stroke-gray-700 opacity-70 dark:opacity-60"
        />
      </div>
      
      {/* Diagonal accent stripe */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[150%] h-96 bg-accent/5 dark:bg-accent/10 transform rotate-6"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8 mt-14">
          {metrics.map((metric, index) => (
            <div key={index} className="h-44 sm:h-48 lg:h-52">
              <Metric
                value={metric.value}
                unit={metric.unit}
                subLabel={metric.subLabel}
                label={metric.label}
                icon={metric.icon}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}