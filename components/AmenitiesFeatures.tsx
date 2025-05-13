"use client";

import { cn } from "@/lib/utils";
import { DotPattern } from "@/components/ui/dot-pattern";

interface AmenityProps {
  icon: React.ReactNode;
  title: string;
}

const Amenity = ({ icon, title }: AmenityProps) => (
  <div className="flex flex-col items-center text-center group hover:scale-105 transition-transform duration-200">
    <div className="w-16 h-16 mb-4 rounded-full bg-[#1a2636] flex items-center justify-center shadow-lg border border-[#C9A76B]/20 group-hover:border-[#C9A76B]/50">
      <div className="text-[#C9A76B] text-3xl">{icon}</div>
    </div>
    <h3 className="text-base md:text-lg font-medium text-white mb-2">{title}</h3>
    <div className="w-12 h-1 bg-[#C9A76B]/30 rounded-full group-hover:bg-[#C9A76B]/60 transition-colors"></div>
  </div>
);

interface AmenitiesFeaturesProps {
  amenities: {
    icon: React.ReactNode;
    title: string;
  }[];
}

export function AmenitiesFeatures({ amenities }: AmenitiesFeaturesProps) {
  return (
    <section className="relative py-20 text-white bg-[#1f2d3d] overflow-hidden">
      {/* Dot Pattern Background */}
      <DotPattern 
        width={20}
        height={20}
        cx={1}
        cy={1}
        cr={1}
        glow={true}
        className={cn(
          "[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]",
        )}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif mb-3">
            Amenities & Features
          </h2>
          <div className="w-24 h-1 bg-[#C9A76B] mx-auto rounded-full"></div>
          <p className="text-gray-300 mt-4 max-w-2xl mx-auto">
            Experience luxury living with our premium amenities designed for your comfort and convenience.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
          {amenities.map((amenity, index) => (
            <Amenity 
              key={index} 
              icon={amenity.icon} 
              title={amenity.title} 
            />
          ))}
        </div>
      </div>
    </section>
  );
} 