"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { Home, Info, Building2, HandCoins, ShieldCheck, BadgeCheck } from "lucide-react";
import AnimatedTitle from "@/components/ui/AnimatedTitle";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DotPattern } from "@/components/magicui/dot-pattern";

const faqItems = [
  {
    id: "1",
    icon: Home,
    title: "What types of properties does Laxmi Developers offer?",
    content: "Laxmi Developers specializes in a variety of residential and commercial properties, including luxury apartments, villas, office spaces, and retail outlets. Each project is designed with modern architecture and premium amenities to meet diverse lifestyle needs."
  },
  {
    id: "2",
    icon: Info,
    title: "How can I check property availability?",
    content: "You can check property availability by visiting our website, contacting our sales team directly, or visiting our sales office. Our online portal is regularly updated with the latest availability and pricing information."
  },
  {
    id: "3",
    icon: Building2,
    title: "What are the payment plan options?",
    content: "We offer flexible payment plans including down payment options, construction-linked plans, and easy EMI facilities. Our team will work with you to create a payment schedule that suits your financial situation."
  },
  {
    id: "4",
    icon: HandCoins,
    title: "Are there any additional charges besides the property cost?",
    content: "Yes, there may be additional charges such as maintenance deposits, registration fees, stamp duty, and GST. Our sales representatives will provide you with a detailed cost breakdown during the booking process."
  },
  {
    id: "5",
    icon: ShieldCheck,
    title: "What legal documents should I verify before buying?",
    content: "Always verify the title deed, approved building plan, commencement certificate, occupancy certificate, and property tax receipts. Our legal team ensures all necessary clearances and approvals are in place for every project."
  },
  {
    id: "6",
    icon: BadgeCheck,
    title: "What amenities are included in your projects?",
    content: "Our projects feature premium amenities such as 24/7 security, power backup, water supply, landscaped gardens, children's play area, gymnasium, clubhouse, and dedicated parking. Amenities vary by project."
  }
];

interface InfoCard {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}

interface InformationPageContentProps {
  infoCards: InfoCard[];
}

export function InformationPageContent({ infoCards }: InformationPageContentProps) {
  return (
    <main>
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-primary to-primary/90 text-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedTitle as="h1" className="mb-6 text-center">
            Information & Resources
          </AnimatedTitle>
          <p className="text-xl text-center max-w-3xl mx-auto mb-8">
            Explore our helpful tools and resources to make informed decisions about your real estate investments.
          </p>
        </div>
      </section>

      {/* Information Cards */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Helpful Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
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
      <section className="py-16 bg-muted/30 relative overflow-hidden">
        <div className="absolute inset-0">
          <DotPattern
            width={20}
            height={20}
            cx={1}
            cy={1}
            cr={1}
            className="text-foreground/5 dark:text-foreground/10"
          />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
              Find answers to common questions about our properties, payment plans, and investment opportunities.
            </p>
            
            <div className="flex flex-col lg:flex-row gap-8">
              {/* FAQ Items - Left Side */}
              <div className="lg:w-2/3 space-y-4">
                <Accordion type="single" collapsible className="w-full space-y-4">
                  {faqItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <AccordionItem 
                        key={item.id} 
                        value={item.id}
                        className="group bg-background/80 backdrop-blur-sm rounded-lg px-6 shadow-sm"
                      >
                        <AccordionTrigger className="text-lg font-medium py-6 [&[data-state=open]>div>svg]:text-blue-600 [&[data-state=open]]:text-blue-600 dark:[&[data-state=open]>div>svg]:text-blue-400 dark:[&[data-state=open]]:text-blue-400">
                          <div className="flex items-center gap-4">
                            <Icon className="h-6 w-6 text-foreground group-data-[state=open]:text-blue-600 dark:group-data-[state=open]:text-blue-400 flex-shrink-0 transition-colors" />
                            <span className="text-foreground group-data-[state=open]:text-blue-600 dark:group-data-[state=open]:text-blue-400">
                              {item.title}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-6 px-2">
                          <p className="text-foreground/90 leading-relaxed">
                            {item.content}
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </div>

              {/* Still Have Questions - Right Side */}
              <div className="lg:w-1/3 flex items-center justify-center">
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold mb-3">Still have questions?</h3>
                    <p className="text-muted-foreground mb-6">
                      Our team is here to help you with any questions you may have about our properties or the buying process.
                    </p>
                  </div>
                  <div className="w-full flex justify-center">
                    <Button 
                      className="w-48 mx-auto"
                      href="/contact"
                    >
                      Contact Us
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
