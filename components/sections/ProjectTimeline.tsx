"use client";

import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import CircularGallery from "@/components/reactbits/CircularGallery/CircularGallery";
import AnimatedTitle from "@/components/ui/AnimatedTitle";
import AnimatedContent from "@/components/reactbits/AnimatedContent/AnimatedContent";

// Project data with actual images from public/images/projects and updated completion dates
const projects = [
  {
    year: "2027",
    status: "Upcoming",
    title: "Millennium Park",
    location: "Surat",
    description: "Millennium Antara nahi aavse, park aavse",
    image: "/images/projects/Millennium Park.jpg",
  },
  {
    year: "2026",
    status: "Upcoming",
    title: "Aster",
    location: "Surat",
    description: "Premium residential complex with modern architecture.",
    image: "/images/projects/Alexa.jpg", // Changed from duplicate Millennium Park image
  },
  {
    year: "2028",
    status: "Upcoming",
    title: "M3",
    location: "Surat",
    description: "Luxury residential development with state-of-the-art amenities.",
    image: "/images/projects/Millennium Textile Market 3.jpg",
  },
  {
    year: "2029",
    status: "Upcoming",
    title: "MCC",
    location: "Surat",
    description: "Modern commercial complex with premium office spaces.",
    image: "/images/projects/Millennium City Central.jpg",
  },
  {
    year: "2026",
    status: "Upcoming",
    title: "MBH 2",
    location: "Surat",
    description: "Expansion of the successful Millennium Business Hub with additional commercial spaces.",
    image: "/images/projects/Millennium Business Hub 2.jpg",
  },
  {
    year: "2026",
    status: "Upcoming",
    title: "MBH 3",
    location: "Surat",
    description: "The latest phase of the Millennium Business Hub development.",
    image: "/images/projects/Millennium Business Hub 3.jpg",
  },
  {
    year: "2028",
    status: "Upcoming",
    title: "Flora",
    location: "Surat",
    description: "Modern residential complex with extensive green spaces.",
    image: "/images/projects/Millennium Park.jpg", // Changed from duplicate Millennium Park image
  },
  {
    year: "2025",
    status: "Upcoming",
    title: "Aleta",
    location: "Surat",
    description: "Luxury residential development in prime location.",
    image: "/images/projects/Aleta.jpg",
  },
  {
    year: "2026",
    status: "Upcoming",
    title: "Atrix",
    location: "Surat",
    description: "Contemporary residential project with premium amenities.",
    image: "/images/projects/Alexa.jpg", // Using similar image as placeholder
  },
  {
    year: "2028",
    status: "Upcoming",
    title: "Azzaro",
    location: "Surat",
    description: "Exclusive residential development with modern design.",
    image: "/images/projects/Laxmi Nova.jpg", // Using existing image as placeholder
  },
  {
    year: "2028",
    status: "Upcoming",
    title: "Millennium Textile Market 3",
    location: "Surat",
    description: "The third phase of the successful Millennium Textile Market development.",
    image: "/images/projects/Millennium Textile Market 3.jpg",
  },
  {
    year: "2024",
    status: "Completed",
    title: "Millennium Textile Market 4",
    location: "Surat",
    description: "The fourth phase of the Millennium Textile Market, completed in 2024.",
    image: "/images/projects/Millennium Business Hub 2.jpg", // Changed from duplicate Textile Market image
  },
  {
    year: "2024",
    status: "Completed",
    title: "Millennium Business Hub 1",
    location: "Surat",
    description: "First phase of the Millennium Business Hub, completed in June 2024.",
    image: "/images/projects/Millennium Business Hub.jpg",
  }
];

const ProjectTimeline = () => {
  const [hoveredItemDescription, setHoveredItemDescription] = useState<string | null>(null);
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before accessing theme
  useEffect(() => {
    setMounted(true);
  }, []);

  // Function to break long text into multiple lines
  const formatProjectText = (title: string, year: string) => {
    const fullText = `${title} (${year})`;
    // If text is longer than 25 characters, try to break it
    if (fullText.length > 25) {
      // Try to break at a natural point
      const words = title.split(' ');
      if (words.length > 2) {
        const midPoint = Math.ceil(words.length / 2);
        const firstLine = words.slice(0, midPoint).join(' ');
        const secondLine = words.slice(midPoint).join(' ');
        return `${firstLine}\n${secondLine} (${year})`;
      }
    }
    return fullText;
  };

  const galleryItems = projects.map(project => ({
    image: project.image,
    text: formatProjectText(project.title, project.year),
    fullDescription: project.description,
  }));

  const titleText = "Our Projects";
  const descriptionText = "Explore our portfolio of exceptional developments that have shaped communities and redefined living experiences";

  // Determine text color based on theme
  const getTextColor = () => {
    if (!mounted) return "#1f2937"; // Default dark color during SSR
    const isDark = resolvedTheme === 'dark' || theme === 'dark';
    return isDark ? "#ffffff" : "#1f2937";
  };

  return (
    <section className="py-16 md:py-20 lg:py-24 bg-white dark:bg-gray-900 overflow-hidden">
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
          {/* Left fade overlay */}
          <div
            className="absolute left-0 top-0 bottom-0 z-10 w-12 sm:w-16 md:w-20 pointer-events-none
                       bg-gradient-to-r from-white via-white/50 to-transparent
                       dark:from-gray-900 dark:via-gray-900/50 dark:to-transparent"
            style={{ backdropFilter: 'blur(2px)' }}
          ></div>

          <div className="w-full mx-auto relative h-[400px] sm:h-[500px] md:h-[600px]">
            <CircularGallery
              items={galleryItems}
              bend={2}
              textColor={getTextColor()}
              borderRadius={0.08}
              font={typeof window !== 'undefined' && window.innerWidth < 768 ? "bold 20px DM Sans" : "bold 26px DM Sans"}
            />
          </div>

          {/* Right fade overlay */}
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