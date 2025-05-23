import { Metadata } from "next/types";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { TrendingUp, DollarSign, Award, Home, Building } from "@/components/ui/LucideIcons";

export const metadata: Metadata = {
  title: "Why Invest in Real Estate | Laxmi Developers",
  description: "Discover the benefits of investing in real estate in Surat and why Laxmi Developers is your ideal investment partner.",
};

export default function WhyInvestPage() {
  const benefits = [
    {
      title: "Stable Returns",
      description: "Real estate offers stable, predictable returns compared to more volatile investments. In Surat, property values have historically appreciated 8-12% annually.",
      icon: <TrendingUp size={28} />,
    },
    {
      title: "Passive Income",
      description: "Rental properties provide a steady stream of passive income, offering financial security and cash flow that can help offset mortgage payments.",
      icon: <DollarSign size={28} />,
    },
    {
      title: "Tax Benefits",
      description: "Real estate investors enjoy multiple tax advantages, including deductions for mortgage interest, property taxes, operating expenses, and depreciation.",
      icon: <Award size={28} />,
    },
    {
      title: "Appreciation",
      description: "Over time, real estate typically appreciates in value, especially in growing cities like Surat which has seen consistent infrastructure development.",
      icon: <TrendingUp size={28} />,
    },
  ];

  const whySurat = [
    {
      title: "Economic Growth",
      description: "Surat is one of India's fastest-growing cities, with thriving diamond, textile, and IT industries driving economic prosperity and real estate demand.",
    },
    {
      title: "Infrastructure Development",
      description: "Ongoing development of metro rail, highways, and smart city initiatives make Surat an attractive investment destination with improving connectivity.",
    },
    {
      title: "Growing Population",
      description: "As a commercial hub, Surat attracts migrants from across India, creating continuous demand for quality housing and commercial spaces.",
    },
    {
      title: "Strategic Location",
      description: "Situated on the Delhi-Mumbai Industrial Corridor, Surat benefits from its proximity to major industrial centers and ports.",
    },
  ];

  const whyChooseLaxmi = [
    {
      title: "25+ Years of Excellence",
      description: "With over 25 years in the industry, we have established a reputation for quality, reliability, and customer satisfaction.",
      icon: <Award size={28} />,
    },
    {
      title: "Prime Locations",
      description: "Our properties are strategically located in high-growth areas of Surat, ensuring excellent appreciation and rental potential.",
      icon: <Home size={28} />,
    },
    {
      title: "Superior Construction",
      description: "We use high-quality materials and modern techniques to ensure longevity, durability, and minimal maintenance costs.",
      icon: <Building size={28} />,
    },
  ];

  return (
    <main>
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-primary to-primary/90 text-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-display mb-6 text-center">Why Invest in Real Estate</h1>
          <p className="text-xl text-center max-w-3xl mx-auto mb-8">
            Discover the benefits of investing in real estate in Surat and why Laxmi Developers is your ideal investment partner.
          </p>
        </div>
      </section>

      {/* Benefits of Real Estate Investment */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display mb-12 text-center">Benefits of Real Estate Investment</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <FeatureCard
                key={index}
                title={benefit.title}
                description={benefit.description}
                icon={benefit.icon}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Why Invest in Surat */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-display mb-6">Why Invest in Surat?</h2>
              <p className="text-lg mb-8">
                Surat, known as the Diamond City and a major textile hub, has emerged as one of India's fastest-growing urban centers with tremendous investment potential.
              </p>
              <div className="space-y-6">
                {whySurat.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#be9e67]/20 flex items-center justify-center text-[#be9e67]">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-2">{item.title}</h3>
                      <p className="text-foreground/70">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative h-[400px] rounded-xl overflow-hidden">
              <Image 
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
                alt="Surat Cityscape" 
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Laxmi Developers */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display mb-12 text-center">Why Choose Laxmi Developers?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whyChooseLaxmi.map((item, index) => (
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

      {/* CTA Section */}
      <section className="py-16 bg-primary text-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-display mb-6">Ready to Invest?</h2>
          <p className="text-lg max-w-2xl mx-auto mb-8">
            Explore our ongoing and upcoming projects to find the perfect investment opportunity for your portfolio.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              href="/projects"
              variant="default"
              size="lg"
            >
              Explore Residential Projects
            </Button>
            <Button 
              href="/projects"
              variant="outline"
              size="lg"
            >
              Explore Commercial Projects
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
} 