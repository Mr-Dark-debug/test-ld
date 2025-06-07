import { Metadata } from "next/types";
import { companyFeatures } from "@/data/features";
import AnimatedTitle from "@/components/ui/AnimatedTitle";
import FlowingMenu from "@/components/reactbits/FlowingMenu/FlowingMenu";
import { Button } from "@/components/ui/Button";
import ScrollingFeatureCards from "@/components/ui/ScrollingFeatureCards";
import { TestimonialCarouselDemo } from "@/components/ui/testimonial-carousel-demo";
import AwardsSection from "@/components/sections/AwardsSection";
import CtaBanner from "@/components/sections/CtaBanner";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Why Choose Laxmi Developers | Laxmi Developers",
  description: "Discover what sets Laxmi Developers apart as a premier real estate developer in Surat. Learn about our commitment to quality, innovation, and customer satisfaction.",
};

export default function WhyLaxmiPage() {
  const whyUsItems = [
    { 
      link: '#quality-excellence', 
      text: 'Quality Excellence', 
      image: '/images/flowing-menu/quality.jpg' 
    },
    { 
      link: '#customer-centric', 
      text: 'Customer-Centric', 
      image: '/images/flowing-menu/customer.jpg' 
    },
    { 
      link: '#innovative-design', 
      text: 'Innovative Design', 
      image: '/images/flowing-menu/design.jpg' 
    },
    { 
      link: '#timely-delivery', 
      text: 'Timely Delivery', 
      image: '/images/flowing-menu/delivery.jpg' 
    }
  ];

  return (
    <main>
      {/* Hero Section */}
      <section className="relative py-24 bg-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedTitle as="h1" className="text-foreground mb-6">
            <>Why Choose <br className="sm:hidden" />Laxmi Developers?</>
          </AnimatedTitle>
          <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
            For over two decades, we have been building trust and delivering excellence in every project we undertake.
          </p>
        </div>
      </section>

      {/* Flowing Menu Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <AnimatedTitle as="h2" className="mb-6">
              <>Our Core <br className="sm:hidden" />Values</>
            </AnimatedTitle>
            <p className="text-foreground/80">
              At Laxmi Developers, our success is built on these foundational values that guide everything we do.
            </p>
          </div>
          
          <div className="w-full h-[500px] md:h-[600px] relative rounded-lg overflow-hidden shadow-xl border border-gray-100 dark:border-gray-800">
            <FlowingMenu items={whyUsItems} />
          </div>
        </div>
      </section>

      {/* Company Intro */}
      <section className="py-16 bg-muted" id="quality-excellence">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <AnimatedTitle as="h2" className="mb-6">
              <>Our Legacy of <br className="sm:hidden" />Excellence</>
            </AnimatedTitle>
            <p className="text-foreground/80 mb-6">
              Laxmi Developers was established in 2001 with a vision to transform the real estate landscape of Surat. Over the years, we have successfully delivered premium residential and commercial projects that stand as testaments to our commitment to excellence and innovation.
            </p>
            <p className="text-foreground/80">
              Our team of skilled architects, engineers, and project managers work collaboratively to ensure that each project exceeds expectations in terms of design, quality, and timely delivery. We believe in creating spaces that enhance lives and provide lasting value to our clients.
            </p>
          </div>
        </div>
      </section>

      {/* Our Pillars - Updated to ScrollingFeatureCards */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <AnimatedTitle as="h2" className="mb-4">
              <>The Pillars of Our <br className="sm:hidden" />Success</>
            </AnimatedTitle>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Our commitment to excellence is built on these core principles
            </p>
          </div>
          <ScrollingFeatureCards features={companyFeatures} speed={45} />
        </div>
      </section>

      {/* Our Approach */}
      <section className="py-16 bg-background" id="customer-centric">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <AnimatedTitle as="h2" className="mb-6">
                <>Our Customer-Centric <br className="sm:hidden" />Approach</>
              </AnimatedTitle>
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
              <AnimatedTitle as="h3" className="mb-6 text-gray-800">
                Our Achievements
              </AnimatedTitle>
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

      {/* Innovative Design Section */}
      <section className="py-16 bg-muted" id="innovative-design">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <AnimatedTitle as="h2" className="mb-4">
              <>Innovative Design <br className="sm:hidden" />Philosophy</>
            </AnimatedTitle>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Our designs blend aesthetics with functionality to create spaces that inspire
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-card p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-display mb-4">Contemporary Aesthetics</h3>
              <p className="text-foreground/80">
                We embrace modern architectural trends while incorporating timeless design principles to create properties that remain relevant and appealing for generations.
              </p>
            </div>
            <div className="bg-card p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-display mb-4">Functional Layouts</h3>
              <p className="text-foreground/80">
                Every square foot matters. Our spaces are thoughtfully designed to maximize utility while providing a comfortable living environment.
              </p>
            </div>
            <div className="bg-card p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-display mb-4">Sustainable Practices</h3>
              <p className="text-foreground/80">
                From material selection to energy-efficient designs, sustainability is integrated into our development process to minimize environmental impact.
              </p>
            </div>
            <div className="bg-card p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-display mb-4">Smart Home Integration</h3>
              <p className="text-foreground/80">
                We incorporate the latest smart home technologies to enhance convenience, security, and energy efficiency in our premium properties.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timely Delivery Section */}
      <section className="py-16 bg-background" id="timely-delivery">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <AnimatedTitle as="h2" className="mb-4">
              <>Our Commitment to <br className="sm:hidden" />Timely Delivery</>
            </AnimatedTitle>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              We understand the value of time and deliver our projects when promised
            </p>
          </div>
          <div className="flex flex-col md:flex-row justify-center items-center bg-card p-8 rounded-lg shadow-md">
            <div className="w-full md:w-2/3 pr-0 md:pr-8 mb-6 md:mb-0">
              <h3 className="text-xl font-display mb-4">Rigorous Project Management</h3>
              <p className="text-foreground/80 mb-4">
                Our dedicated project management teams ensure that each phase of construction advances according to schedule. We utilize advanced project tracking tools and methodologies to monitor progress closely.
              </p>
              <p className="text-foreground/80 mb-4">
                Regular quality checks and milestone reviews help us identify potential delays before they occur, allowing for proactive solutions and keeping projects on track.
              </p>
              <p className="text-foreground/80">
                We maintain transparent communication with our clients about project timelines, providing regular updates and ensuring you're always informed about your investment.
              </p>
            </div>
            <div className="w-full md:w-1/3 bg-[#be9e67]/10 p-6 rounded-lg">
              <div className="text-center">
                <div className="text-[#be9e67] text-5xl font-bold mb-2">95%</div>
                <p className="text-foreground/80 font-medium">Projects delivered on time</p>
              </div>
              <hr className="my-4 border-[#be9e67]/20" />
              <div className="text-center">
                <div className="text-[#be9e67] text-5xl font-bold mb-2">98%</div>
                <p className="text-foreground/80 font-medium">Client satisfaction rate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Awards & Recognition */}
      <AwardsSection />

      {/* Testimonials */}
      <TestimonialCarouselDemo />

      {/* CTA Banner */}
      <CtaBanner
        title={<>Ready to Experience <br className="sm:hidden" />Excellence?</>}
        description="Explore our projects or get in touch with our team to discuss your real estate needs."
        buttons={[
          {
            text: "Explore Projects",
            href: "/projects",
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