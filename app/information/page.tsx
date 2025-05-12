import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { Calculate, BarChart } from "@/components/ui/LucideIcons";

export const metadata: Metadata = {
  title: "Information | Laxmi Developers",
  description: "Helpful information and resources for real estate investors and buyers.",
};

export default function InformationPage() {
  const infoCards = [
    {
      title: "EMI Calculator",
      description: "Calculate your monthly EMI payments for your dream home or investment property.",
      href: "/information/emi-calculator",
      icon: <Calculate size={28} />,
    },
    {
      title: "Why Invest?",
      description: "Learn about the benefits of investing in real estate in Surat and why Laxmi Developers is your ideal partner.",
      href: "/information/why-invest",
      icon: <BarChart size={28} />,
    },
  ];

  return (
    <main>
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-primary to-primary/90 text-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-display mb-6 text-center">Information & Resources</h1>
          <p className="text-xl text-center max-w-3xl mx-auto mb-8">
            Explore our helpful tools and resources to make informed decisions about your real estate investments.
          </p>
        </div>
      </section>

      {/* Information Cards */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {infoCards.map((card, index) => (
              <FeatureCard
                key={index}
                title={card.title}
                description={card.description}
                icon={card.icon}
                href={card.href}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display mb-12 text-center">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-gradient-to-br from-amber-50 to-white border border-amber-100 rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-gray-800">What is RERA?</h3>
              <p className="text-gray-600">RERA (Real Estate Regulatory Authority) is a regulatory body that ensures transparency in the real estate sector. All Laxmi Developers projects are RERA registered to provide you with security and transparency.</p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-white border border-amber-100 rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-gray-800">How do I calculate my home loan EMI?</h3>
              <p className="text-gray-600">You can use our easy EMI calculator to estimate your monthly EMI based on the loan amount, interest rate, and tenure. Visit our <Link href="/information/emi-calculator" className="text-[#be9e67] hover:underline">EMI Calculator</Link> page for more details.</p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-white border border-amber-100 rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Why should I invest in Surat real estate?</h3>
              <p className="text-gray-600">Surat is one of India's fastest-growing cities with strong economic indicators and infrastructure development. Learn more about the investment potential on our <Link href="/information/why-invest" className="text-[#be9e67] hover:underline">Why Invest</Link> page.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 