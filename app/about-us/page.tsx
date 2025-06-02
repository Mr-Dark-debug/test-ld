"use client"

import { useEffect, useState } from "react";
import CtaBanner from "@/components/sections/CtaBanner";
import ScrollReveal from "@/components/reactbits/ScrollReveal/ScrollReveal";
import { TestimonialCarouselDemo } from "@/components/ui/testimonial-carousel-demo";
import { Award, Eye, Zap } from "lucide-react";
import { GridPattern } from "@/components/magicui/grid-pattern";
import Image from "next/image";
import { AboutUsContent, defaultAboutUsContent } from "../cms-admin/models/aboutUs";

// Add a custom class to your tailwind config if needed, or use existing Tailwind color classes
// For now, we'll use text-blue-800 which is close to the navy blue color

export default function AboutUsPage() {
  const [content, setContent] = useState<AboutUsContent>(defaultAboutUsContent);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch from an API
    const fetchContent = async () => {
      try {
        if (typeof window !== 'undefined') {
          const savedContent = localStorage.getItem('liveAboutUsContent');
          if (savedContent) {
            setContent(JSON.parse(savedContent));
          }
        }
      } catch (error) {
        console.error('Error loading content:', error);
        // Fall back to default content
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, []);

  // Use the content from CMS or fall back to default values
  const missionVisionValues = content.missionVisionValues.items;

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <main className="bg-background relative overflow-x-hidden">
      {/* Hero Section - Full height/screen with background image */}
      <section className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden py-16 md:py-20">
        {/* Grid pattern for hero section */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <GridPattern width={48} height={48} strokeDasharray="2 4" className="opacity-10 dark:opacity-20" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 to-primary/60 dark:from-black dark:to-black -z-20"></div>
        <div className="absolute inset-0 -z-30">
          <Image 
            src={content.heroSection.backgroundImage} 
            alt="Laxmi Developers" 
            fill 
            className="object-cover opacity-40 dark:opacity-20"
            priority
          />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 z-10 max-w-5xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 font-display">
              Brick by Brick <span className="text-blue-800 dark:text-blue-600">Building Excellence</span>
            </h1>
            <p className="text-lg text-foreground/80 dark:text-gray-300 mt-4">
              {content.heroSection.description}
            </p>
          </div>
        </div>
      </section>

      {/* Company Description Section with Image - Order reversed for mobile/desktop */}
      <section className="py-16 md:py-24 bg-background dark:bg-black relative">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <GridPattern width={48} height={48} strokeDasharray="2 4" className="opacity-10 dark:opacity-15" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
            {/* Text column first on all devices for better semantic ordering */}
            <div className="order-2 md:order-1 py-4">
              <div className="flex justify-start mb-4">
                <div className="border border-accent/20 py-1 px-4 rounded-lg text-accent dark:text-blue-400 dark:border-blue-400/30">{content.companySection.tagline}</div>
              </div>
              {/* Replace AnimatedTitle with direct h2 element for better mobile control */}
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display mb-6 text-left break-words hyphens-auto leading-tight">
                {content.companySection.title}
              </h2>
              <div className="space-y-6">
                <ScrollReveal enableBlur blurStrength={6} baseOpacity={0.2} baseRotation={1} containerClassName="mb-4">
                  <p className="text-sm md:text-base text-foreground/80 dark:text-gray-300 leading-relaxed">
                    {content.companySection.description1}
                  </p>
                </ScrollReveal>
                <ScrollReveal enableBlur blurStrength={6} baseOpacity={0.2} baseRotation={1} containerClassName="mb-4">
                  <p className="text-sm md:text-base text-foreground/80 dark:text-gray-300 leading-relaxed">
                    {content.companySection.description2}
                  </p>
                </ScrollReveal>
              </div>
            </div>
            
            {/* Image column */}
            <div className="relative rounded-xl overflow-hidden shadow-xl h-[350px] md:h-[450px] order-1 md:order-2">
              <Image 
                src={content.companySection.image} 
                alt="Laxmi Developers Team" 
                fill 
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-white text-xl font-semibold">Excellence in Real Estate Development</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values - Full screen with subtle grid background */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-accent/5 to-background dark:from-black dark:to-black flex flex-col justify-center relative overflow-hidden">
        {/* Enhanced grid pattern for mission/vision/values */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <GridPattern 
            width={48} 
            height={48} 
            strokeDasharray="2 4" 
            className="opacity-15 dark:opacity-20" 
          />
        </div>
        {/* Enhanced dot pattern with better visibility */}
        <div className="absolute inset-0 -z-10 pointer-events-none bg-repeat bg-dot-pattern opacity-[0.03]">
        </div>
        {/* Additional diagonal dot pattern for more texture */}
        <div className="absolute inset-0 -z-10 pointer-events-none bg-repeat bg-dot-pattern-diagonal opacity-[0.02] rotate-15">
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-16">
            <div className="flex justify-center mb-4">
              <div className="border border-accent/20 py-1 px-4 rounded-lg text-accent dark:text-blue-400 dark:border-blue-400/30">{content.missionVisionValues.sectionTagline}</div>
            </div>
            {/* Replace AnimatedTitle with direct h2 element for better mobile control */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display mb-4 text-center break-words hyphens-auto leading-tight">
              {content.missionVisionValues.sectionTitle}
            </h2>
            <p className="text-base md:text-lg text-foreground/70 dark:text-gray-300 max-w-2xl mx-auto">
              {content.missionVisionValues.sectionDescription}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {missionVisionValues.map((item, index) => {
              // Map the icon based on index
              const icons = [
                <Zap key="zap" className="w-8 h-8 text-accent dark:text-blue-400" />, 
                <Eye key="eye" className="w-8 h-8 text-accent dark:text-blue-400" />, 
                <Award key="award" className="w-8 h-8 text-accent dark:text-blue-400" />
              ];
              
              return (
                <div 
                  key={index} 
                  className="bg-card/80 dark:bg-[#121212]/90 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-accent/10 dark:border-blue-400/20 hover:border-accent/30 dark:hover:border-blue-400/40 transition-all duration-300 group hover:transform hover:scale-105 relative overflow-hidden"
                >
                  {/* Subtle dot pattern background for each card */}
                  <div className="absolute inset-0 pointer-events-none opacity-[0.015] dark:opacity-[0.02] bg-dot-pattern-small">
                  </div>
                  
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 dark:bg-blue-900/30 mb-4 group-hover:bg-accent/20 dark:group-hover:bg-blue-900/50 transition-colors">
                    {icons[index % icons.length]}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                  <p className="text-sm md:text-base text-foreground/70 dark:text-gray-300">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Portfolio Section with Image Grid */}
      <section className="py-16 md:py-24 bg-background dark:bg-black relative">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <GridPattern width={48} height={48} strokeDasharray="2 4" className="opacity-10 dark:opacity-15" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="border border-accent/20 py-1 px-4 rounded-lg text-accent dark:text-blue-400 dark:border-blue-400/30">{content.portfolioSection.tagline}</div>
            </div>
            {/* Replace AnimatedTitle with direct h2 element for better mobile control */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display mb-4 text-center break-words hyphens-auto leading-tight">
              {content.portfolioSection.title}
            </h2>
            <p className="text-base md:text-lg text-foreground/70 dark:text-gray-300 max-w-2xl mx-auto">
              {content.portfolioSection.description}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {content.portfolioSection.projects.map((project, index) => (
              <div key={index} className="relative rounded-xl overflow-hidden shadow-lg h-[300px] group">
                <Image 
                  src={project.image} 
                  alt={project.title} 
                  fill 
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-white text-xl font-semibold">{project.title}</p>
                  <p className="text-white/80 text-sm">{project.category}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <a 
              href="/projects"
              className="inline-flex items-center px-6 py-3 rounded-lg bg-accent hover:bg-accent/90 text-white font-medium transition-colors shadow-md hover:shadow-lg dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              {content.portfolioSection.buttonText}
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials - Full width */}
      <TestimonialCarouselDemo />

      {/* CTA Banner */}
      <CtaBanner
        title={content.ctaSection.title}
        description={content.ctaSection.description}
        buttons={[
          {
            text: content.ctaSection.primaryButton.text,
            href: content.ctaSection.primaryButton.href,
            variant: "default",
          },
          {
            text: content.ctaSection.secondaryButton.text,
            href: content.ctaSection.secondaryButton.href,
            variant: "outline",
          },
        ]}
      />
    </main>
  );
}