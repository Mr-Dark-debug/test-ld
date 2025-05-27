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
import { featuredProjects } from "@/data/projects";
import { metricsData } from "@/data/metrics";
import Stack from "@/components/reactbits/Stack/Stack";
import { useState, useEffect } from "react";

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
      <section className="py-20 bg-background relative overflow-hidden">
        <Ripple mainCircleSize={800} mainCircleOpacity={0.08} numCircles={8} className="absolute inset-0" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <AnimatedTitle as="h2" className="mb-4">
              Why Choose Laxmi Developers?
            </AnimatedTitle>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Discover the Laxmi Developers difference through our core principles.
            </p>
          </div>
          
          {/* Adjusted main content div for centering and spacing */}
          {/* Using a slightly wider max-width for the content area to give elements more room */}
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 lg:gap-16">
            {/* Left Column: Dynamic Text - more balanced width */}
            <div className="w-full md:w-1/2 lg:w-5/12 text-center md:text-left flex flex-col justify-center min-h-[300px] md:min-h-[400px]">
              {activeStackCard ? (
                <>
                  <AnimatedTitle 
                    as="h3" 
                    key={activeStackCard.id} 
                    // Updated title color: text-primary (for blue in light mode) and dark:text-white
                    className="text-3xl lg:text-4xl font-semibold mb-6 text-primary dark:text-white break-words"
                  >
                    {activeStackCard.title || "Our Commitment"}
                  </AnimatedTitle>
                  <p className="text-foreground/80 text-base lg:text-lg leading-relaxed mb-4 md:mb-0">
                    {activeStackCard.description || "Detailed information about this aspect will appear here."}
                  </p>
                </>
              ) : (
                <div className="min-h-[200px] flex items-center justify-center text-foreground/50">
                  <p>Select a card to see details.</p>
                </div>
              )}
            </div>

            {/* Right Column: Stack Component - ensure it can scale down on mobile if needed */}
            <div className="w-full md:w-1/2 lg:w-7/12 flex justify-center md:justify-start items-center">
              {/* Container for stack to manage its size better on smaller screens within its column */}
              <div className="w-full max-w-[400px] sm:max-w-md md:max-w-[400px] lg:max-w-lg mx-auto md:mx-0">
                <Stack
                  cardsData={stackCardsData}
                  onActiveCardChange={setActiveStackCard}
                  randomRotation={true}
                  sensitivity={180}
                  sendToBackOnClick={false}
                  cardDimensions={{ width: 400, height: 400 }} 
                  animationConfig={{ stiffness: 260, damping: 20 }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <FeaturedProjects
        title="Our Featured Projects"
        subtitle="Discover our exceptional portfolio of residential and commercial properties"
        projects={featuredProjects}
        viewAllHref="/projects"
      />

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
