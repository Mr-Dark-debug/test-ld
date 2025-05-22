import Hero from "@/components/sections/Hero";
import FeatureGrid from "@/components/sections/FeatureGrid";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import CtaBanner from "@/components/sections/CtaBanner";
import AnimatedMetrics from "@/components/sections/AnimatedMetrics";
import HomeFlowingMenu from "@/components/sections/HomeFlowingMenu";
import { TestimonialCarouselDemo } from "@/components/ui/testimonial-carousel-demo";
import { heroData } from "@/data/hero";
import { companyFeatures } from "@/data/features";
import { featuredProjects } from "@/data/projects";
import { metricsData } from "@/data/metrics";

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <Hero
        title={heroData.title}
        subtitle={heroData.subtitle}
        ctaButtons={
          heroData.ctaButtons.map(({ text, href, variant }) => ({
            text,
            href,
            variant: (["default", "outline", "ghost"].includes(variant) ? variant : undefined) as "default" | "outline" | "ghost" | undefined
          }))
        }
        backgroundType={heroData.backgroundType}
        images={heroData.images}
      />

      {/* Flowing Menu Section */}
      <HomeFlowingMenu />

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

      {/* Testimonials - Using the new video testimonial carousel */}
      <TestimonialCarouselDemo />

      {/* CTA Banner */}
      <CtaBanner
        title="Find Your Perfect Property"
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
            variant: "default",
          },
        ]}
      />
    </main>
  );
}
