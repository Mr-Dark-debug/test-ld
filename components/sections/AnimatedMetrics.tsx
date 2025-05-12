"use client";

import { useEffect, useRef, useState } from "react";

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
    <div ref={ref} className="flex flex-col items-center text-center py-8 px-4 border-r last:border-r-0 border-amber-100 md:w-1/4">
      <div className="mb-3 text-[#be9e67] w-14 h-14">
        {icon}
      </div>
      <h3 className="text-4xl md:text-5xl font-display font-bold mb-2 text-gray-800">{animatedValue}</h3>
      <p className="text-gray-700 font-medium">{label}</p>
    </div>
  );
};

export default function AnimatedMetrics({ metrics }: AnimatedMetricsProps) {
  return (
    <section className="bg-gradient-to-r from-gray-100 to-blue-50 border-t border-b border-amber-100 py-6 shadow-inner">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-wrap md:flex-nowrap justify-center">
          {metrics.map((metric, index) => (
            <Metric
              key={index}
              value={metric.value}
              label={metric.label}
              icon={metric.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
} 