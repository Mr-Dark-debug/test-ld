"use client"

import { useEffect, useState } from "react";
import CtaBanner from "@/components/sections/CtaBanner";
import AnimatedTitle from "@/components/ui/AnimatedTitle";
import ScrollReveal from "@/components/reactbits/ScrollReveal/ScrollReveal";
import { TestimonialCarouselDemo } from "@/components/ui/testimonial-carousel-demo";
import { Award, Eye, Zap } from "lucide-react";
import { GridPattern } from "@/components/magicui/grid-pattern";
import Image from "next/image";
import { AuroraButton } from "@/components/ui/aurora-button";
import { AboutUsContent, defaultAboutUsContent } from "../cms-admin/models/aboutUs";

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
          <GridPattern width={48} height={48} strokeDasharray="2 4" className="opacity-10" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 to-primary/60 -z-20"></div>
        <div className="absolute inset-0 -z-30">
          <Image 
            src={content.heroSection.backgroundImage} 
            alt="Laxmi Developers" 
            fill 
            className="object-cover opacity-40"
            priority
          />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 z-10 max-w-5xl">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="border border-accent/20 py-1 px-4 rounded-lg text-accent">{content.heroSection.tagline}</div>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 font-display">
              {content.heroSection.title}<br/>Building <span className="text-[#000080]">{content.heroSection.titleHighlight}</span>
            </h1>
            <p className="text-lg text-foreground/80 mt-4">
              {content.heroSection.description}
            </p>
            <div className="mt-8">
              <AuroraButton 
                onClick={() => window.location.href = "#"}
                className="min-w-[170px] px-6 py-3 font-medium"
              >
                {content.heroSection.buttonText}
              </AuroraButton>
            </div>
          </div>
        </div>
      </section>

      {/* Company Description Section with Image */}
      <section className="py-16 md:py-24 bg-background relative">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <GridPattern width={48} height={48} strokeDasharray="2 4" className="opacity-10" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="relative rounded-xl overflow-hidden shadow-xl h-[400px] md:h-[500px]">
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
            <div>
              <div className="flex justify-start mb-4">
                <div className="border border-accent/20 py-1 px-4 rounded-lg text-accent">{content.companySection.tagline}</div>
              </div>
              <AnimatedTitle as="h2" className="mb-6 text-left">
                {content.companySection.title}
              </AnimatedTitle>
              <div className="space-y-4">
                <ScrollReveal enableBlur blurStrength={6} baseOpacity={0.2} baseRotation={1} containerClassName="mb-4">
                  {content.companySection.description1}
                </ScrollReveal>
                <ScrollReveal enableBlur blurStrength={6} baseOpacity={0.2} baseRotation={1} containerClassName="mb-4">
                  {content.companySection.description2}
                </ScrollReveal>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values - Full screen */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-accent/5 to-background flex flex-col justify-center relative">
        {/* Grid pattern for mission/vision/values */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <GridPattern width={48} height={48} strokeDasharray="2 4" className="opacity-10" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-16">
            <div className="flex justify-center mb-4">
              <div className="border border-accent/20 py-1 px-4 rounded-lg text-accent">{content.missionVisionValues.sectionTagline}</div>
            </div>
            <AnimatedTitle as="h2" className="mb-4">
              {content.missionVisionValues.sectionTitle}
            </AnimatedTitle>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              {content.missionVisionValues.sectionDescription}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {missionVisionValues.map((item, index) => {
              // Map the icon based on index
              const icons = [<Zap key="zap" className="w-8 h-8 text-accent" />, <Eye key="eye" className="w-8 h-8 text-accent" />, <Award key="award" className="w-8 h-8 text-accent" />];
              
              return (
                <div key={index} className="bg-card p-8 rounded-xl shadow-lg border border-accent/10 hover:border-accent/30 transition-all duration-300 group hover:transform hover:scale-105">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 mb-4 group-hover:bg-accent/20 transition-colors">
                    {icons[index % icons.length]}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                  <p className="text-foreground/70">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Portfolio Section with Image Grid */}
      <section className="py-16 md:py-24 bg-background relative">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <GridPattern width={48} height={48} strokeDasharray="2 4" className="opacity-10" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="border border-accent/20 py-1 px-4 rounded-lg text-accent">{content.portfolioSection.tagline}</div>
            </div>
            <AnimatedTitle as="h2" className="mb-4">
              {content.portfolioSection.title}
            </AnimatedTitle>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
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
            <AuroraButton 
              onClick={() => window.location.href = "#"}
              variant="outline"
              className="min-w-[170px] px-6 py-3 font-medium"
            >
              {content.portfolioSection.buttonText}
            </AuroraButton>
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