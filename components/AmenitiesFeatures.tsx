"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { DotPattern } from "@/components/ui/dot-pattern";
import GlassIcons from "@/components/reactbits/GlassIcons/GlassIcons";
import { useTheme } from "@/lib/theme-context";
import { enhancedIconMap } from "@/components/ui/EnhancedAmenityIcons";
import { BrochureDownloadForm } from "@/components/BrochureDownloadForm";
import { HelpCircle } from 'lucide-react';
import { toast } from 'sonner';

interface AmenityProps {
  icon: React.ReactNode;
  title: string;
}

interface AmenitiesFeaturesProps {
  amenities: {
    icon: React.ReactNode;
    title: string;
  }[];
  projectName?: string;
  brochureUrl?: string;
}

interface ValidGlassIconItem {
  icon: React.ReactElement;
  color: string;
  label: string;
}

export function AmenitiesFeatures({ amenities, projectName = "Project", brochureUrl = "" }: AmenitiesFeaturesProps) {
  const { theme } = useTheme();
  const [showBrochureForm, setShowBrochureForm] = useState(false);
  
  // Standardized color for all icons (e.g., matching what Clubhouse might have been, or a desired standard)
  const UNIFIED_ICON_COLOR = "blue"; // Or derive this from a specific amenity like Clubhouse if needed

  const glassIconItems: ValidGlassIconItem[] = amenities
    .map((amenity) => {
      let iconNode = enhancedIconMap[amenity.title] || amenity.icon;
      if (!React.isValidElement(iconNode)) {
        // If you prefer a fallback icon instead of filtering:
        // iconNode = <HelpCircle className="w-8 h-8" />;
        // if (React.isValidElement(iconNode)) { // Check again if fallback is valid
        //  return { icon: iconNode, color: UNIFIED_ICON_COLOR, label: amenity.title };
        // }
        return null; 
      }
      return {
        icon: iconNode, // No need to cast here if source type is ReactNode and isValidElement passed
        color: UNIFIED_ICON_COLOR, 
        label: amenity.title,
      };
    })
    .filter((item): item is ValidGlassIconItem => item !== null);

  return (
    <section id="amenities" className="relative py-20 text-foreground overflow-hidden bg-gradient-to-b from-background to-muted">
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Amenities */}
          <div className="lg:col-span-2">
            <div className="text-center lg:text-left mb-6 md:mb-12">
              <h2 className="text-3xl md:text-4xl font-serif mb-2">
                Amenities & Features
              </h2>
              <div className="w-24 h-1 bg-highlight mx-auto lg:mx-0 rounded-full"></div>
              <p className="text-foreground/70 mt-3 max-w-2xl mx-auto lg:mx-0">
                Experience luxury living with our premium amenities designed for your comfort and convenience.
              </p>
            </div>
            
            {/* Glass Icons Component - With Mobile Responsiveness */}
            <div className="min-h-[500px] sm:min-h-[400px]">
              <GlassIcons 
                items={glassIconItems} 
                className={`${theme === 'dark' ? 'text-white' : 'text-foreground'}`}
              />
            </div>
          </div>
          
          {/* Right Column - Contact or Brochure Form */}
          <div className="lg:col-span-1 flex flex-col justify-center">
            {showBrochureForm ? (
              <div id="project-brochure">
                <BrochureDownloadForm 
                  projectName={projectName} 
                  brochureUrl={brochureUrl} 
                />
              </div>
            ) : (
              <div className={`rounded-xl p-8 ${theme === 'dark' ? 'bg-primary/10 backdrop-blur-sm' : 'bg-card'} shadow-lg border border-highlight/10`}>
                <h3 className="text-2xl font-display mb-4 text-center lg:text-left">
                  Project Information
                </h3>
                <p className="mb-6 text-foreground/70 text-center lg:text-left">
                  Explore our amenities and download more information about this project.
                </p>
                <div className="space-y-4">
                  <button
                    onClick={() => window.location.href = "/contact"}
                    className="w-full py-3 font-medium bg-highlight hover:bg-highlight/90 text-white rounded-md transition-all duration-300 flex justify-center items-center shadow-md hover:shadow-lg"
                  >
                    Contact Us
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!brochureUrl || !brochureUrl.trim()) {
                        toast.error('No brochure available for this project');
                        return;
                      }
                      setShowBrochureForm(true);
                    }}
                    className="w-full py-3 font-medium border border-highlight hover:bg-highlight/10 text-foreground rounded-md transition-all duration-300 flex justify-center items-center hover:shadow-md"
                  >
                    Download Brochure
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
} 