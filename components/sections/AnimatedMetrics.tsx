"use client";

import { useEffect, useRef, useState } from "react";
import { GridPattern } from "@/components/magicui/grid-pattern";
import { cn } from "@/lib/utils";

interface MetricProps {
  value: string;
  label: string;
  icon: React.ReactNode;
}

interface AnimatedMetricsProps {
  metrics: MetricProps[];
}

const Metric = ({ value, label, icon }: MetricProps) => {
  const [animatedValue, setAnimatedValue] = useState("0");
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            
            // Strip non-numeric characters for animation
            const numericValue = value.replace(/\D/g, "");
            const duration = 2000; // 2 seconds
            const steps = 50;
            const stepValue = parseInt(numericValue) / steps;
            
            let currentStep = 0;
            
            const interval = setInterval(() => {
              currentStep++;
              
              if (currentStep >= steps) {
                setAnimatedValue(value);
                clearInterval(interval);
              } else {
                const current = Math.floor(stepValue * currentStep);
                setAnimatedValue(current.toString());
              }
            }, duration / steps);
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
  }, [value]);

  return (
    <div ref={ref} className="relative flex flex-col items-center text-center h-full group">
      {/* Icon floating at top with glowing effect - fixed center alignment */}
      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 flex items-center justify-center w-16 h-16 rounded-full bg-background shadow-md border-2 border-accent/40 z-20 group-hover:border-accent/60 transition-all duration-300">
        <div className="flex items-center justify-center w-full h-full">
          <div className="text-accent w-9 h-9 group-hover:text-accent/90">{icon}</div>
        </div>
      </div>
      
      {/* Main metric display with better symmetry and alignment */}
      <div className="w-full h-full pt-10 pb-3 px-4 flex flex-col justify-center items-center bg-gradient-to-br from-background/90 to-background/80 backdrop-blur-md rounded-lg relative z-10 overflow-hidden shadow-md group-hover:from-background/95 group-hover:to-background/85 group-hover:shadow-lg transition-all duration-300">
        {/* Decorative angled line */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-40 bg-accent/5 group-hover:bg-accent/10 transform -rotate-45 translate-x-1/3 translate-y-1/4 transition-colors duration-300"></div>
        </div>
        
        {/* Light glow effect on hover */}
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 dark:group-hover:bg-accent/5 pointer-events-none transition-colors duration-300"></div>
        
        {/* Number with proper alignment and underline */}
        <div className="text-5xl sm:text-5xl lg:text-6xl font-display font-bold mt-2 mb-1 text-center">
          <div className="inline-block relative">
            <span className="bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent group-hover:from-accent/90 group-hover:to-accent transition-all duration-300">
              {animatedValue.replace(/\+$/, '')}
            </span>
            <span className="text-xl sm:text-2xl text-accent align-top ml-0.5 group-hover:text-accent/90">
              {animatedValue.includes('+') ? '+' : ''}
            </span>
            {/* Properly centered underline */}
            <div className="absolute -bottom-1 left-0 right-0 mx-auto h-[2px] w-3/4 bg-accent/30 group-hover:bg-accent/50 rounded-full transition-colors duration-300"></div>
          </div>
        </div>
        
        {/* Decorative dots with proper spacing */}
        <div className="flex space-x-2 my-2 justify-center">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-1 h-1 rounded-full bg-accent/40 group-hover:bg-accent/60 transition-colors duration-300"></div>
          ))}
        </div>
        
        {/* Label with better sizing for mobile */}
        <p className="text-foreground/80 group-hover:text-foreground/90 font-medium tracking-wide text-[11px] sm:text-xs uppercase text-center px-1 transition-colors duration-300">
          {label}
        </p>
      </div>
      
      {/* Decorative bottom accent - properly centered */}
      <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-accent/40 to-transparent group-hover:via-accent/60 rounded-full transition-colors duration-300"></div>
    </div>
  );
};

export default function AnimatedMetrics({ metrics }: AnimatedMetricsProps) {
  return (
    <section className="relative py-10 sm:py-14 overflow-hidden">
      {/* Background with subtle pattern */}
      <div className="absolute inset-0 bg-muted/30">
        <GridPattern
          width={32}
          height={32}
          x={0}
          y={0}
          strokeDasharray="1 2"
          className="stroke-gray-200 dark:stroke-gray-700 opacity-70"
        />
      </div>
      
      {/* Diagonal accent stripe */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[150%] h-96 bg-accent/5 transform rotate-6"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8 mt-14">
          {metrics.map((metric, index) => (
            <div key={index} className="h-44 sm:h-48 lg:h-52">
              <Metric
                value={metric.value}
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