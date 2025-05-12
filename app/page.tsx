import Hero from "@/components/sections/Hero";
import FeatureGrid from "@/components/sections/FeatureGrid";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import TestimonialMarquee from "@/components/sections/TestimonialMarquee";
import CtaBanner from "@/components/sections/CtaBanner";
import AnimatedMetrics from "@/components/sections/AnimatedMetrics";

import { heroData } from "@/data/hero";
import { companyFeatures } from "@/data/features";
import { featuredProjects } from "@/data/projects";
import { testimonials } from "@/data/testimonials";
import { metricsData } from "@/data/metrics";

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <Hero
        title={heroData.title}
        subtitle={heroData.subtitle}
        ctaButtons={heroData.ctaButtons as { text: string; href: string; variant?: "default" | "outline" | "ghost" | "light" | "dark" }[]}
        backgroundType={heroData.backgroundType}
        images={heroData.images}
      />

      {/* Animated Metrics */}
      <AnimatedMetrics metrics={metricsData} />

      {/* Features/Why Choose Us */}
      <FeatureGrid
        title="Why Choose Laxmi Developers?"
        subtitle="At Laxmi Developers, we are committed to excellence in every aspect of our work. Here's what sets us apart:"
        features={companyFeatures}
      />

      {/* Featured Projects */}
      <FeaturedProjects
        title="Our Featured Projects"
        subtitle="Discover our exceptional portfolio of residential and commercial properties"
        projects={featuredProjects}
        viewAllHref="/residential"
      />

      {/* Testimonials */}
      <TestimonialMarquee
        title="What Our Clients Say"
        subtitle="Hear from the people who have made Laxmi Developers their choice for premium real estate"
        testimonials={testimonials}
      />

      {/* CTA Banner */}
      <CtaBanner
        title="Ready to Find Your Perfect Property?"
        description="Explore our ongoing and upcoming projects or get in touch with our sales team for personalized assistance."
        buttons={[
          {
            text: "Explore Projects",
            href: "/residential",
            variant: "default",
          },
          {
            text: "Contact Us",
            href: "/contact",
            variant: "outline",
          },
        ]}
      />
    </main>
  );
}
