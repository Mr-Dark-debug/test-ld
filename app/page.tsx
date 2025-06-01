"use client";

import Hero from "@/components/sections/Hero";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import CtaBanner from "@/components/sections/CtaBanner";
import AnimatedMetrics from "@/components/sections/AnimatedMetrics";
import ProjectTimeline from "@/components/sections/ProjectTimeline";
import AnimatedTitle from "@/components/ui/AnimatedTitle";
import HomeFlowingMenu from "@/components/sections/HomeFlowingMenu";
import { TestimonialCarouselDemo } from "@/components/ui/testimonial-carousel-demo";
import { Ripple } from "@/components/magicui/ripple";
import { metricsData } from "@/data/metrics";
import Stack from "@/components/reactbits/Stack/Stack";
import { useState, useEffect } from "react";
import { useFeaturedProjects, transformProjectForComponent } from "@/hooks/useProjects";

interface StackCardData {
  id: number;
  img: string;
  title?: string;
  description?: string;
  [key: string]: any;
}

const stackCardsData: StackCardData[] = [
  { id: 1, img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=400&auto=format&fit=crop", title: "Innovative Designs", description: "We craft spaces that are not only aesthetically pleasing but also highly functional, incorporating the latest architectural trends and innovations." },
  { id: 2, img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=400&auto=format&fit=crop", title: "Quality Construction", description: "Our commitment to quality is unwavering. We use premium materials and employ stringent quality control measures throughout the construction process." },
  { id: 3, img: "https://images.unsplash.com/photo-1448630360428-65456885c650?q=80&w=400&auto=format&fit=crop", title: "Customer Satisfaction", description: "Client satisfaction is at the heart of everything we do. We strive to exceed expectations and build lasting relationships with our customers." },
  { id: 4, img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400&auto=format&fit=crop", title: "Prime Locations", description: "Our projects are strategically located in prime areas, offering excellent connectivity, convenience, and potential for appreciation." }
];

export default function Home() {
  const [activeStackCard, setActiveStackCard] = useState<StackCardData | null>(null);
  // Default dimensions, matching the largest size (server-render estimate)
  const [stackCardDimensions, setStackCardDimensions] = useState({ width: 350, height: 350 });

  // Fetch featured projects from API
  const { projects: featuredProjectsData, loading: projectsLoading, error: projectsError } = useFeaturedProjects();

  useEffect(() => {
    const calculateDimensions = () => {
      let width, height;
      if (typeof window !== 'undefined') {
        if (window.innerWidth < 480) {
          width = 220; height = 220;
        } else if (window.innerWidth < 640) {
          width = 260; height = 260;
        } else if (window.innerWidth < 768) {
          width = 300; height = 300;
        } else {
          width = 350; height = 350;
        }
      } else {
        // Fallback for environments where window is not defined (should not happen in useEffect)
        width = 350; height = 350;
      }
      return { width, height };
    };

    setStackCardDimensions(calculateDimensions());

    const handleResize = () => {
      setStackCardDimensions(calculateDimensions());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Define theme color for consistent use if desired
  const THEME_COLOR_HEX = "#324189";

  return (
    <main>
      {/* Hero Section */}
      <Hero />

      {/* Flowing Menu Section */}
      <HomeFlowingMenu />

      {/* Animated Metrics */}
      <AnimatedMetrics metrics={metricsData} />

      {/* Project Timeline Section */}
      <ProjectTimeline />

      {/* New Section with Stack Component */}
      <section className="py-16 sm:py-20 bg-background dark:bg-black relative overflow-hidden">
        <Ripple mainCircleSize={800} mainCircleOpacity={0.08} numCircles={8} className="absolute inset-0" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-10 md:mb-16">
            <AnimatedTitle as="h2" className="text-3xl sm:text-4xl mb-3 sm:mb-4">
              Why Choose Us?
            </AnimatedTitle>
            <p className="text-base sm:text-lg text-foreground/70 dark:text-gray-300 max-w-2xl mx-auto">
              Discover the Laxmi Developers difference through our core principles.
            </p>
          </div>

          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 lg:gap-16">
            {/* Left Column: Dynamic Text */}
            <div className="w-full md:w-1/2 lg:w-5/12 text-center md:text-left flex flex-col justify-center min-h-[240px] sm:min-h-[300px] md:min-h-[400px]">
              {activeStackCard ? (
                <>
                  <AnimatedTitle
                    as="h3"
                    key={activeStackCard.id}
                    className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-4 sm:mb-6 text-gray-900 dark:text-white whitespace-normal break-words w-full inline-block min-h-[40px] sm:min-h-[48px] lg:min-h-[56px]"
                  >
                    {activeStackCard.title || "Our Commitment"}
                  </AnimatedTitle>
                  <p className="text-foreground/80 dark:text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed mb-4 md:mb-0">
                    {activeStackCard.description || "Detailed information about this aspect will appear here."}
                  </p>
                </>
              ) : (
                <div className="min-h-[150px] sm:min-h-[200px] flex items-center justify-center text-foreground/50 dark:text-gray-400">
                  <p className="text-sm sm:text-base">Select a card to see details.</p>
                </div>
              )}
            </div>

            {/* Right Column: Stack Component */}
            <div className="w-full md:w-1/2 lg:w-7/12 flex justify-center md:justify-start items-center">
              <div className="w-full max-w-[250px] sm:max-w-[300px] md:max-w-[350px] lg:max-w-[400px] mx-auto md:mx-0">
                <Stack
                  cardsData={stackCardsData}
                  onActiveCardChange={setActiveStackCard}
                  randomRotation={true}
                  sensitivity={180}
                  sendToBackOnClick={false}
                  cardDimensions={stackCardDimensions}
                  animationConfig={{ stiffness: 260, damping: 20 }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      {projectsLoading ? (
        <section className="py-16 sm:py-20 bg-background dark:bg-black">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-foreground/70">Loading featured projects...</p>
            </div>
          </div>
        </section>
      ) : projectsError ? (
        <section className="py-16 sm:py-20 bg-background dark:bg-black">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-red-600 dark:text-red-400">Error loading projects: {projectsError}</p>
            </div>
          </div>
        </section>
      ) : (
        <FeaturedProjects
          title="Our Featured Projects"
          subtitle="Discover our exceptional portfolio of residential and commercial properties"
          projects={featuredProjectsData.map(transformProjectForComponent)}
          viewAllHref="/projects"
        />
      )}

      {/* Testimonials - Using the new video testimonial carousel */}
      <TestimonialCarouselDemo />

      {/* CTA Banner */}
      <CtaBanner
        title="Find Your Perfect Property"
        description="Explore our ongoing and upcoming projects or get in touch with our sales team for personalized assistance."
        buttons={[
          {
            text: "Explore Projects",
            href: "/projects",
            variant: "default",
          },
          {
            text: "Contact Us",
            href: "/contact",
            variant: "default",
          },
        ]}
      />
    </main>
  );
}
