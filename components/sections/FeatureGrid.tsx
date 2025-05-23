"use client";

import React from "react";
import SpotlightCard from "@/components/reactbits/SpotlightCard/SpotlightCard";
import AnimatedTitle from "@/components/ui/AnimatedTitle";
import FadeIn from "@/components/reactbits/FadeIn/FadeIn";
import { Ripple } from "@/components/magicui/ripple";

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode; // We'll use SVG icons directly
}

interface FeatureGridProps {
  title: string;
  subtitle?: string;
  features: Feature[];
}

export default function FeatureGrid({ title, subtitle, features }: FeatureGridProps) {
  return (
    <section className="py-20 bg-muted relative overflow-hidden">
      {/* Main ripple effect covering the entire section */}
      <Ripple 
        className="absolute inset-0 opacity-50" 
        mainCircleSize={600}
        mainCircleOpacity={0.35}
        numCircles={12}
      />
      
      {/* Secondary ripples for more dynamic effect */}
      <div className="absolute -left-20 top-1/4">
        <Ripple 
          className="opacity-40"
          mainCircleSize={500} 
          mainCircleOpacity={0.3}
          numCircles={8}
        />
      </div>
      
      <div className="absolute -right-20 bottom-1/4">
        <Ripple 
          className="opacity-40"
          mainCircleSize={550} 
          mainCircleOpacity={0.25}
          numCircles={10}
        />
      </div>
      
      <div className="absolute left-1/3 -bottom-40">
        <Ripple 
          className="opacity-35"
          mainCircleSize={500} 
          mainCircleOpacity={0.3}
          numCircles={8}
        />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <AnimatedTitle as="h2" className="mb-4">
            {title}
          </AnimatedTitle>
          {subtitle && (
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <SpotlightCard 
              key={feature.id}
              className="min-h-[300px] flex flex-col transition-all duration-300 hover:translate-y-[-8px] group bg-card dark:bg-gray-800/50 border border-transparent hover:border-accent/30 hover:shadow-2xl dark:hover:shadow-accent/10 rounded-xl p-6"
              spotlightColor="rgba(201, 167, 107, 0.4)" // Slightly reduced opacity for a softer spotlight
            >
              <div className="flex flex-col items-center text-center">
                {/* Icon with fade-in animation and enhanced hover effect */}
                <FadeIn 
                  delay={0.1 * index}
                  y={20}
                  className="flex-shrink-0 mb-6 w-16 h-16 rounded-2xl bg-accent/10 dark:bg-accent/20 p-3.5 flex items-center justify-center relative overflow-hidden group-hover:bg-accent/15 dark:group-hover:bg-accent/25 transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-3 shadow-md group-hover:shadow-lg"
                >
                  {/* Inner glow effect on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-30 bg-accent/20 dark:bg-accent/30 rounded-xl blur-md transition-opacity duration-300"></div>
                  
                  {/* Icon */}
                  <div className="relative z-10 text-accent text-3xl">
                    {feature.icon}
                  </div>
                </FadeIn>
                
                <div className="space-y-4 flex-grow">
                  {/* Title with fade-in animation and hover effect */}
                  <FadeIn 
                    delay={0.2 + (0.1 * index)}
                    y={15}
                  >
                    <h3 className="text-xl font-semibold text-foreground dark:text-white group-hover:text-accent dark:group-hover:text-accent transition-colors duration-300">
                      {feature.title}
                    </h3>
                  </FadeIn>
                  
                  {/* Description with fade-in animation and subtle hover effect */}
                  <FadeIn 
                    delay={0.3 + (0.1 * index)}
                    y={10}
                  >
                    <p className="text-foreground/80 dark:text-gray-300 leading-relaxed group-hover:text-foreground/90 dark:group-hover:text-gray-200 transition-colors duration-300">
                      {feature.description}
                    </p>
                  </FadeIn>
                </div>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
} 