import Hero from "@/components/sections/Hero";
import ScrollingFeatureCards from "@/components/ui/ScrollingFeatureCards";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import CtaBanner from "@/components/sections/CtaBanner";
import AnimatedMetrics from "@/components/sections/AnimatedMetrics";
import ProjectTimeline from "@/components/sections/ProjectTimeline";
import AnimatedTitle from "@/components/ui/AnimatedTitle";
import HomeFlowingMenu from "@/components/sections/HomeFlowingMenu";
import { TestimonialCarouselDemo } from "@/components/ui/testimonial-carousel-demo";
import { Ripple } from "@/components/magicui/ripple";
import { companyFeatures } from "@/data/features";
import { featuredProjects } from "@/data/projects";
import { metricsData } from "@/data/metrics";

export default function Home() {
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

      {/* Features/Why Choose Us - Updated to ScrollingFeatureCards */}
      <section className="py-20 bg-background relative overflow-hidden">
        <Ripple mainCircleSize={800} mainCircleOpacity={0.08} numCircles={8} className="absolute inset-0" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <AnimatedTitle as="h2" className="mb-4">
              Why Choose Laxmi Developers?
            </AnimatedTitle>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              At Laxmi Developers, we are committed to excellence in every aspect of our work. Here's what sets us apart:
            </p>
          </div>
          <ScrollingFeatureCards features={companyFeatures} speed={40} />
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
