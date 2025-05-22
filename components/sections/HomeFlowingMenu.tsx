"use client";

import React from "react";
import FlowingMenu from "@/components/reactbits/FlowingMenu/FlowingMenu";
import AnimatedTitle from "@/components/ui/AnimatedTitle";
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { AuroraButton } from "@/components/ui/aurora-button";

export default function HomeFlowingMenu() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const homeMenuItems = [
    { 
      link: '/residential', 
      text: 'Residential Projects', 
      image: '/images/homepage/residential.jpg' 
    },
    { 
      link: '/commercial', 
      text: 'Commercial Projects', 
      image: '/images/homepage/commercial.jpg' 
    },
    { 
      link: '/residential?filter=upcoming', 
      text: 'Upcoming Developments', 
      image: '/images/homepage/upcoming.jpg' 
    },
    { 
      link: '/about-us', 
      text: 'About Laxmi Developers', 
      image: '/images/homepage/about.jpg' 
    }
  ];

  // Adjust height based on number of items for mobile view
  const mobileHeight = `${homeMenuItems.length * 250}px`;

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <AnimatedTitle as="h2" className="mb-4">
            Explore Our Portfolio
          </AnimatedTitle>
          <p className="text-foreground/80 max-w-2xl mx-auto mb-6">
            Discover Laxmi Developers' premium residential and commercial properties throughout Surat.
          </p>
          <div className="flex justify-center mb-8">
            <AuroraButton
              onClick={() => window.location.href = '/projects'}
              variant="default"
              className="px-6 py-3 font-medium"
              glowClassName="from-highlight via-highlight/80 to-highlight/60"
            >
              View All Projects
            </AuroraButton>
          </div>
        </div>
        
        <div 
          className="w-full relative rounded-lg overflow-hidden shadow-xl border border-gray-100 dark:border-gray-800 mb-8"
          style={{ height: isMobile ? mobileHeight : '600px' }}
        >
          <FlowingMenu items={homeMenuItems} />
        </div>
      </div>
    </section>
  );
} 