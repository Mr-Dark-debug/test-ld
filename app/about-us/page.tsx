import { Metadata } from "next/types";
import CtaBanner from "@/components/sections/CtaBanner";
import AnimatedTitle from "@/components/ui/AnimatedTitle";
import ScrollReveal from "@/components/reactbits/ScrollReveal/ScrollReveal";
import { TestimonialsColumns } from "@/components/ui/testimonials-columns";
import ScrollingFeatureCards, { FeatureCardData } from "@/components/ui/ScrollingFeatureCards";
import { Award, Eye, Zap } from "lucide-react";
import { GridPattern } from "@/components/magicui/grid-pattern";

export const metadata: Metadata = {
  title: "About Us | Laxmi Developers",
  description: "Learn about Laxmi Developers, our history, vision, and commitment to excellence in real estate development in Surat, Gujarat.",
};

export default function AboutUsPage() {
  const missionVisionValues = [
    {
      title: "Our Mission",
      description: "To create exceptional living and working spaces that enrich lives and foster communities, while maintaining the highest standards of quality, sustainability, and customer satisfaction.",
      icon: <Zap className="w-8 h-8 text-accent" />,
    },
    {
      title: "Our Vision",
      description: "To be recognized as the premier real estate developer in Surat, known for innovative design, exceptional quality, and creating properties that stand the test of time, while contributing positively to the urban landscape.",
      icon: <Eye className="w-8 h-8 text-accent" />,
    },
    {
      title: "Our Values",
      description: "Integrity, quality excellence, customer focus, innovation, sustainability, and community engagement form the foundation of everything we do at Laxmi Developers.",
      icon: <Award className="w-8 h-8 text-accent" />,
    },
  ];

  return (
    <main className="bg-background relative overflow-x-hidden">
      {/* Hero Section - Full height/screen */}
      <section className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden py-16 md:py-20">
        {/* Grid pattern for hero section */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <GridPattern width={48} height={48} strokeDasharray="2 4" className="opacity-10" />
        </div>
        <div className="absolute inset-0 bg-primary -z-20 opacity-90"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 z-10 max-w-5xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 font-display">
              About Us
            </h1>
            <h2 className="text-3xl lg:text-4xl text-accent mb-6 font-display">Brick-by-Brick</h2>
            <p className="text-xl text-foreground/90 font-medium">
              Building with excellence
            </p>
            <p className="text-lg text-foreground/80 mt-4">
              Laxmi Developers, Surat
            </p>
          </div>
        </div>
      </section>
      {/* Company Description Sections - Full width */}
      <section className="py-10 md:py-16 bg-background relative">
        {/* Grid pattern for company description */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <GridPattern width={48} height={48} strokeDasharray="2 4" className="opacity-10" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <ScrollReveal enableBlur blurStrength={6} baseOpacity={0.2} baseRotation={1} containerClassName="mb-2">
              At Laxmi Developers, our focus extends beyond mere construction; we craft exceptional residential and commercial spaces that elevate everyday living. Embracing the ethos of "Brick-by-Brick," we emphasize precision and creativity in every project. Our commitment is to deliver unique and outstanding infrastructures that truly enhance value and stand out for their excellence.
            </ScrollReveal>
            <ScrollReveal enableBlur blurStrength={6} baseOpacity={0.2} baseRotation={1} containerClassName="mb-2">
              We strive for excellence in line with the high standards set by our flagship business, Laxmi Diamond, a leader in the world of diamond manufacture. The Laxmi Group has promoted community impact and economic self-sufficiency since its founding in 1997. We are driven forward by our dedication to innovation and sustainability and have a solid foundation in education through prestigious institutions. Laxmi Developers was founded with the goal of providing top-notch, innovative real estate that meets the changing demands and goals of Surat locals and beyond.
            </ScrollReveal>
            <ScrollReveal enableBlur blurStrength={6} baseOpacity={0.2} baseRotation={1} containerClassName="mb-2">
              Within decade-plus years of functioning, Laxmi Developers has carved a niche for itself in the real estate sector and made its name synonymous with innovation, transparency, and customer satisfaction.
            </ScrollReveal>
          </div>
        </div>
      </section>
      {/* Mission, Vision, Values - Full screen */}
      <section className="min-h-screen py-16 md:py-24 bg-gradient-to-br from-accent/5 to-background flex flex-col justify-center relative">
        {/* Grid pattern for mission/vision/values */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <GridPattern width={48} height={48} strokeDasharray="2 4" className="opacity-10" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-16">
            <AnimatedTitle as="h2" className="mb-4">
              Our Principles
            </AnimatedTitle>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Guided by strong principles and a clear direction
            </p>
          </div>
          <ScrollingFeatureCards 
            features={missionVisionValues.map(item => ({ ...item, id: item.title }))} 
            speed={35}
            cardClassName="h-48 w-72"
          />
        </div>
      </section>
      {/* Portfolio Section - Full width */}
      <section className="py-10 md:py-16 bg-background relative">
        {/* Grid pattern for portfolio section */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <GridPattern width={48} height={48} strokeDasharray="2 4" className="opacity-10" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <ScrollReveal enableBlur blurStrength={6} baseOpacity={0.2} baseRotation={1} containerClassName="mb-2">
              The portfolio of Laxmi Developers encompasses a diverse range of projects, including residential high-rises and low-rises, mixed-use townships, commercial textile markets, shopping complexes, industrial parks, educational institutions, and medical campuses across Gujarat. Our developments cover over 6.5 million square feet of construction space at strategic locations, featuring more than 1,500 residential units and 7,100 commercial units.
            </ScrollReveal>
            <ScrollReveal enableBlur blurStrength={6} baseOpacity={0.2} baseRotation={1} containerClassName="mb-2">
              Over the years, Laxmi Developers has stood out as a pioneer in the Indian real estate market, particularly in Surat, Gujarat. Our affordable and luxurious residential projects, such as Laxmi Villa Township and Laxmi Residency, have become the preferred choice for families seeking safe, comfortable, and happy living environments. The Millennium Textile Market Series —constructed in 2005 (M1), 2017 (M2), and 2019 (M4)—demonstrate Laxmi Developers' exceptional ability to create large-scale structures, with utter excellence. Additionally, Laxmi Developers has delivered two remarkable commercial projects in the city center: Laxmi Enclave 1 and Laxmi Enclave 2. These locations have become ideal destinations for renowned food chains, brands, and companies, offering the "perfect size with height" for shops, showrooms, and offices, and serving numerous small to medium-scale businesses in Surat's key industrial area.
            </ScrollReveal>
            <ScrollReveal enableBlur blurStrength={6} baseOpacity={0.2} baseRotation={1} containerClassName="mb-2">
              A wide range of clients have come to trust and remain loyal to us because of our unwavering dedication to a client-centered approach, as well as our honesty and integrity. At Laxmi Developers, the sincere joy conveyed by our clients feeds our enthusiasm to consistently build monuments that are noteworthy and driven by value. In the future, we hope to expand throughout India and establish ourselves as the most reputable and trustworthy real estate brand in the country. Our commitment to improving lives and providing excellence will always be the foundation of our business expansion, pushing us to establish new benchmarks for reliability and quality in the sector.
            </ScrollReveal>
          </div>
        </div>
      </section>
      {/* Testimonials - Full width */}
      <TestimonialsColumns />
      {/* CTA Banner */}
      <CtaBanner
        title="Ready to Work With Us?"
        description="Explore our projects or get in touch to discuss your real estate needs."
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