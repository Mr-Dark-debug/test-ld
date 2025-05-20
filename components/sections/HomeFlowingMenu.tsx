"use client";

import React from "react";
import FlowingMenu from "@/components/reactbits/FlowingMenu/FlowingMenu";
import AnimatedTitle from "@/components/ui/AnimatedTitle";

export default function HomeFlowingMenu() {
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

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <AnimatedTitle as="h2" className="mb-4">
            Explore Our Portfolio
          </AnimatedTitle>
          <p className="text-foreground/80 max-w-2xl mx-auto">
            Discover Laxmi Developers' premium residential and commercial properties throughout Surat.
          </p>
        </div>
        
        <div className="w-full h-[500px] md:h-[600px] relative rounded-lg overflow-hidden shadow-xl border border-gray-100 dark:border-gray-800 mb-8">
          <FlowingMenu items={homeMenuItems} />
        </div>
      </div>
    </section>
  );
} 