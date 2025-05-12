import { Metadata } from "next";
import FeatureGrid from "@/components/sections/FeatureGrid";
import { companyFeatures } from "@/data/features";
import { testimonials } from "@/data/testimonials";
import TestimonialMarquee from "@/components/sections/TestimonialMarquee";
import CtaBanner from "@/components/sections/CtaBanner";

export const metadata: Metadata = {
  title: "Why Choose Laxmi Developers | Laxmi Developers",
  description: "Discover what sets Laxmi Developers apart as a premier real estate developer in Surat. Learn about our commitment to quality, innovation, and customer satisfaction.",
};

export default function WhyLaxmiPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative py-24 bg-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-display text-foreground mb-6">
            Why Choose Laxmi Developers?
          </h1>
          <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
            For over two decades, we have been building trust and delivering excellence in every project we undertake.
          </p>
        </div>
      </section>

      {/* Company Intro */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-display mb-6">Our Legacy of Excellence</h2>
            <p className="text-foreground/80 mb-6">
              Laxmi Developers was established in 2001 with a vision to transform the real estate landscape of Surat. Over the years, we have successfully delivered premium residential and commercial projects that stand as testaments to our commitment to excellence and innovation.
            </p>
            <p className="text-foreground/80">
              Our team of skilled architects, engineers, and project managers work collaboratively to ensure that each project exceeds expectations in terms of design, quality, and timely delivery. We believe in creating spaces that enhance lives and provide lasting value to our clients.
            </p>
          </div>
        </div>
      </section>

      {/* Our Pillars */}
      <FeatureGrid
        title="The Pillars of Our Success"
        subtitle="Our commitment to excellence is built on these core principles"
        features={companyFeatures}
      />

      {/* Our Approach */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-display mb-6">Our Approach</h2>
              <p className="text-foreground/80 mb-6">
                At Laxmi Developers, we follow a meticulous approach in every project we undertake, from initial concept to final delivery. Our process is designed to ensure that each property not only meets but exceeds industry standards and client expectations.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-[#be9e67] mr-3 mt-1">•</span>
                  <span>Thorough research of location advantages and potential</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#be9e67] mr-3 mt-1">•</span>
                  <span>Innovative design that balances aesthetic appeal with functional practicality</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#be9e67] mr-3 mt-1">•</span>
                  <span>Rigorous quality control measures throughout the construction process</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#be9e67] mr-3 mt-1">•</span>
                  <span>Transparent communication with clients at every stage</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#be9e67] mr-3 mt-1">•</span>
                  <span>Comprehensive after-sales service to ensure client satisfaction</span>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-white border border-amber-100 p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-display mb-6 text-gray-800">Our Achievements</h3>
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-[#be9e67]/20 rounded-full flex items-center justify-center mr-4">
                    <span className="text-[#be9e67] text-2xl font-bold">20+</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">Years of Experience</h4>
                    <p className="text-gray-600">In real estate development</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-[#be9e67]/20 rounded-full flex items-center justify-center mr-4">
                    <span className="text-[#be9e67] text-2xl font-bold">50+</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">Projects Completed</h4>
                    <p className="text-gray-600">Across residential and commercial</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-[#be9e67]/20 rounded-full flex items-center justify-center mr-4">
                    <span className="text-[#be9e67] text-2xl font-bold">2K+</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">Happy Families</h4>
                    <p className="text-gray-600">Living in our properties</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-[#be9e67]/20 rounded-full flex items-center justify-center mr-4">
                    <span className="text-[#be9e67] text-2xl font-bold">10+</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">Industry Awards</h4>
                    <p className="text-gray-600">For excellence in real estate</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialMarquee
        title="Our Client Testimonials"
        subtitle="Hear what our satisfied clients have to say about their experience with Laxmi Developers"
        testimonials={testimonials}
      />

      {/* CTA */}
      <CtaBanner
        title="Ready to Experience the Laxmi Difference?"
        description="Explore our projects or get in touch with our team to learn more about how we can help you find your dream property."
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