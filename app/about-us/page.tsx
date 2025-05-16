import { Metadata } from "next/types";
import Image from "next/image";
import TestimonialMarquee from "@/components/sections/TestimonialMarquee";
import CtaBanner from "@/components/sections/CtaBanner";
import { testimonials } from "@/data/testimonials";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { Award, Eye, Zap } from "@/components/ui/LucideIcons";
import AnimatedTitle from "@/components/ui/AnimatedTitle";

export const metadata: Metadata = {
  title: "About Us | Laxmi Developers",
  description: "Learn about Laxmi Developers, our history, vision, and commitment to excellence in real estate development in Surat, Gujarat.",
};

export default function AboutUsPage() {
  const missionVisionValues = [
    {
      title: "Our Mission",
      description: "To create exceptional living and working spaces that enrich lives and foster communities, while maintaining the highest standards of quality, sustainability, and customer satisfaction.",
      icon: <Zap size={28} />,
    },
    {
      title: "Our Vision",
      description: "To be recognized as the premier real estate developer in Surat, known for innovative design, exceptional quality, and creating properties that stand the test of time, while contributing positively to the urban landscape.",
      icon: <Eye size={28} />,
    },
    {
      title: "Our Values",
      description: "Integrity, quality excellence, customer focus, innovation, sustainability, and community engagement form the foundation of everything we do at Laxmi Developers.",
      icon: <Award size={28} />,
    },
  ];

  return (
    <main>
      {/* Hero Section */}
      <section className="relative py-24 bg-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedTitle as="h1" className="text-foreground">
            About Laxmi Developers
          </AnimatedTitle>
          <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
            Crafting exceptional living and working spaces since 2001.
          </p>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <AnimatedTitle as="h2" className="mb-6">
                Our Story
              </AnimatedTitle>
              <p className="text-foreground/80 mb-6">
                Established in 2001, Laxmi Developers has grown to become one of Surat's most trusted names in real estate development. What began as a modest vision has evolved into a distinguished company known for creating premium residential and commercial spaces across the city.
              </p>
              <p className="text-foreground/80 mb-6">
                Our journey has been marked by a steadfast commitment to quality, innovation, and customer satisfaction. Over the years, we have successfully delivered numerous projects that stand as testaments to our dedication to excellence.
              </p>
              <p className="text-foreground/80">
                Today, under the leadership of our founder and managing director, Mr. Rajeev Laxmi, we continue to push boundaries and set new standards in the real estate industry.
              </p>
            </div>
            <div className="relative h-80 lg:h-full min-h-[400px] rounded-lg overflow-hidden shadow-lg">
              {/* Placeholder for company image */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#be9e67] to-[#be9e67]/70 flex items-center justify-center text-white">
                <span className="text-2xl font-display">Company Image</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <AnimatedTitle as="h2" className="mb-4">
              Our Mission, Vision & Values
            </AnimatedTitle>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Guided by strong principles and a clear direction
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {missionVisionValues.map((item, index) => (
              <FeatureCard
                key={index}
                title={item.title}
                description={item.description}
                icon={item.icon}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Team Section (Placeholder) */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <AnimatedTitle as="h2" className="mb-4">
              Our Leadership Team
            </AnimatedTitle>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Meet the experienced professionals guiding Laxmi Developers
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Team Member 1 */}
            <div className="bg-gradient-to-br from-amber-50 to-white border border-amber-100 rounded-lg overflow-hidden shadow-md">
              <div className="h-64 relative">
                <div className="absolute inset-0 bg-[#be9e67]/10 flex items-center justify-center">
                  <span className="text-[#be9e67] font-semibold">Team Member Photo</span>
                </div>
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-display mb-1 text-gray-800">Rajeev Laxmi</h3>
                <p className="text-gray-600 mb-4">Founder & Managing Director</p>
                <p className="text-sm text-gray-700">
                  With over 25 years of experience in real estate, Rajeev leads our company with vision and integrity.
                </p>
              </div>
            </div>
            
            {/* Team Member 2 */}
            <div className="bg-gradient-to-br from-amber-50 to-white border border-amber-100 rounded-lg overflow-hidden shadow-md">
              <div className="h-64 relative">
                <div className="absolute inset-0 bg-[#be9e67]/10 flex items-center justify-center">
                  <span className="text-[#be9e67] font-semibold">Team Member Photo</span>
                </div>
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-display mb-1 text-gray-800">Anjali Patel</h3>
                <p className="text-gray-600 mb-4">Chief Architect</p>
                <p className="text-sm text-gray-700">
                  Anjali brings creativity and practical design expertise to all our projects.
                </p>
              </div>
            </div>
            
            {/* Team Member 3 */}
            <div className="bg-gradient-to-br from-amber-50 to-white border border-amber-100 rounded-lg overflow-hidden shadow-md">
              <div className="h-64 relative">
                <div className="absolute inset-0 bg-[#be9e67]/10 flex items-center justify-center">
                  <span className="text-[#be9e67] font-semibold">Team Member Photo</span>
                </div>
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-display mb-1 text-gray-800">Vikram Singh</h3>
                <p className="text-gray-600 mb-4">Construction Head</p>
                <p className="text-sm text-gray-700">
                  Vikram ensures that every project meets our high standards of quality and safety.
                </p>
              </div>
            </div>
            
            {/* Team Member 4 */}
            <div className="bg-gradient-to-br from-amber-50 to-white border border-amber-100 rounded-lg overflow-hidden shadow-md">
              <div className="h-64 relative">
                <div className="absolute inset-0 bg-[#be9e67]/10 flex items-center justify-center">
                  <span className="text-[#be9e67] font-semibold">Team Member Photo</span>
                </div>
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-display mb-1 text-gray-800">Meera Shah</h3>
                <p className="text-gray-600 mb-4">Marketing Director</p>
                <p className="text-sm text-gray-700">
                  Meera drives our brand strategy and customer engagement initiatives.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialMarquee
        title="What Our Clients Say"
        subtitle="Hear from those who have experienced the Laxmi Developers difference"
        testimonials={testimonials}
      />

      {/* CTA Banner */}
      <CtaBanner
        title="Ready to Work With Us?"
        description="Explore our projects or get in touch to discuss your real estate needs."
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