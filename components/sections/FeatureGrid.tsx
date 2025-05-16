import React from "react";
import { FeatureCard } from "@/components/ui/FeatureCard";
import AnimatedTitle from "@/components/ui/AnimatedTitle";

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
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <AnimatedTitle as="h2" className="mb-4">
            {title}
          </AnimatedTitle>
          {subtitle && (
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <FeatureCard
              key={feature.id}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
} 