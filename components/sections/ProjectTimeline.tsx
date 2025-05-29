"use client";

import { useEffect, useRef, useState } from 'react'; // Added useState
import CircularGallery from "@/components/reactbits/CircularGallery/CircularGallery";
import AnimatedTitle from "@/components/ui/AnimatedTitle"; // Import AnimatedTitle instead of SplitText
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
          <AnimatedTitle as="h2" className="mb-6">
            {titleText}
          </AnimatedTitle>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            {descriptionText}
          </p>
        </div>

        <div className="relative w-full">
          {/* Left fade overlay - shorter width */}
          <div
            className="absolute left-0 top-0 bottom-0 z-10 w-12 sm:w-16 md:w-20 pointer-events-none
                       bg-gradient-to-r from-white via-white/50 to-transparent
                       dark:from-gray-900 dark:via-gray-900/50 dark:to-transparent"
            style={{ backdropFilter: 'blur(2px)' }}
          ></div>

          <div className="w-full mx-auto relative h-[400px] sm:h-[500px] md:h-[600px]"> {/* Responsive height for better mobile experience */}
            <CircularGallery
              items={galleryItems}
              bend={2}
              textColor="#1f2937" // Darker gray for better visibility
              borderRadius={0.08}
              font={typeof window !== 'undefined' && window.innerWidth < 768 ? "bold 24px DM Sans" : "bold 30px DM Sans"}
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