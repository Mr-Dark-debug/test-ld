"use client";

import { useEffect, useRef, useState } from 'react'; // Added useState
import CircularGallery from "@/components/reactbits/CircularGallery/CircularGallery";
import SplitText from "@/components/reactbits/SplitText/SplitText"; // Import SplitText
import AnimatedContent from "@/components/reactbits/AnimatedContent/AnimatedContent"; // Import AnimatedContent

// Project data with mockup images and descriptions
const projects = [
  {
    year: "2023",
    status: "Completed",
    title: "Sunset Apartments",
    location: "Downtown, Cityville",
    description: "Modern residential complex with stunning city views and luxury amenities.",
    image: "https://picsum.photos/seed/timeline1/800/600?grayscale", 
  },
  {
    year: "2024",
    status: "Ongoing",
    title: "Oceanview Villas",
    location: "Coastal Route, Seaview",
    description: "Luxury villas offering direct beach access, private pools, and premium interior finishes.",
    image: "https://picsum.photos/seed/timeline2/800/600?grayscale",
  },
  {
    year: "2024",
    status: "Completed",
    title: "Greenwood Plaza",
    location: "Suburbia, Townsville",
    description: "A vibrant commercial hub featuring diverse retail spaces, modern office units, and ample parking.",
    image: "https://picsum.photos/seed/timeline3/800/600?grayscale",
  },
  {
    year: "2025",
    status: "Upcoming",
    title: "Skyline Tower",
    location: "Financial District, Metrocity",
    description: "An iconic skyscraper set to redefine the city's skyline, offering panoramic views and state-of-the-art facilities.",
    image: "https://picsum.photos/seed/timeline4/800/600?grayscale",
  },
  {
    year: "2025",
    status: "Upcoming",
    title: "Eco-Friendly Homes",
    location: "Rural Greens, Countryside",
    description: "A sustainable housing project focused on green living, energy efficiency, and community gardens.",
    image: "https://picsum.photos/seed/timeline5/800/600?grayscale", 
  },
];

const ProjectTimeline = () => {
  const [hoveredItemDescription, setHoveredItemDescription] = useState<string | null>(null);

  const galleryItems = projects.map(project => ({
    image: project.image, 
    text: `${project.title} (${project.year})`,
    fullDescription: project.description, // Pass full description for hover
  }));

  const titleText = "Our Journey";
  const descriptionText = "Explore our timeline of exceptional developments that have shaped communities and redefined living experiences";

  return (
    <section className="py-16 md:py-20 lg:py-24 bg-white dark:bg-gray-900 overflow-hidden"> {/* Added overflow-hidden for fades */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16 lg:mb-20 relative z-10">
          <AnimatedContent direction="vertical" distance={30} delay={0} threshold={0.1}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white mb-4 sm:mb-5">
              <SplitText
                text={titleText}
                delay={50}
                textAlign="center"
                animationFrom={{ opacity: 0, transform: 'translate3d(0,20px,0)' }}
                animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
              />
            </h2>
          </AnimatedContent>
          <AnimatedContent direction="vertical" distance={20} delay={titleText.length * 50 + 100} threshold={0.1}>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-sans"> {/* Using font-sans for description */}
              {descriptionText}
            </p>
          </AnimatedContent>
        </div>
        
        <div className="relative w-full">
          {/* Left fade overlay - shorter width */}
          <div 
            className="absolute left-0 top-0 bottom-0 z-10 w-12 sm:w-16 md:w-20 pointer-events-none 
                       bg-gradient-to-r from-white via-white/50 to-transparent 
                       dark:from-gray-900 dark:via-gray-900/50 dark:to-transparent"
            style={{ backdropFilter: 'blur(2px)' }}
          ></div>
          
          <div style={{ height: '600px' }} className="w-full mx-auto relative"> {/* Ensured relative for potential absolute children like tooltips */}
            <CircularGallery 
              items={galleryItems} 
              bend={2} 
              textColor="#374151" // Dark gray for text on light background
              borderRadius={0.08} 
              // onHoverItem={setHoveredItemDescription} // This will be handled internally by CircularGallery now
            />
            {/* Removed the black box description display */}
            {/* {hoveredItemDescription && (
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-black/70 text-white p-3 rounded-md text-sm z-20 max-w-md">
                {hoveredItemDescription}
              </div>
            )} */}
          </div>

          {/* Right fade overlay - shorter width */}
          <div 
            className="absolute right-0 top-0 bottom-0 z-10 w-12 sm:w-16 md:w-20 pointer-events-none 
                       bg-gradient-to-l from-white via-white/50 to-transparent 
                       dark:from-gray-900 dark:via-gray-900/50 dark:to-transparent"
            style={{ backdropFilter: 'blur(2px)' }}
          ></div>
        </div>
      </div>
    </section>
  );
};

export default ProjectTimeline; 