import { Metadata } from "next/types";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import CtaBanner from "@/components/sections/CtaBanner";
import { allProjects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Commercial Projects | Laxmi Developers",
  description: "Explore our premium commercial projects in Surat. Find the perfect space for your business with Laxmi Developers.",
};

export default function CommercialPage() {
  // Combine all commercial projects
  const commercialProjects = [
    ...allProjects.commercial.ongoing,
    ...allProjects.commercial.completed,
    ...allProjects.commercial.upcoming,
  ];

  return (
    <main>
      {/* Hero Section */}
      <section className="relative py-24 bg-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-display text-foreground mb-6">
            Commercial Projects
          </h1>
          <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
            Premium commercial spaces designed for business success.
          </p>
        </div>
      </section>

      {/* Ongoing Projects */}
      <FeaturedProjects
        title="Ongoing Commercial Projects"
        subtitle="Our latest commercial projects currently under development"
        projects={allProjects.commercial.ongoing}
      />

      {/* Completed Projects */}
      <FeaturedProjects
        title="Completed Commercial Projects"
        subtitle="Successfully delivered commercial properties that stand as a testament to our quality"
        projects={allProjects.commercial.completed}
      />

      {/* Upcoming Projects */}
      <FeaturedProjects
        title="Upcoming Commercial Projects"
        subtitle="Future commercial opportunities coming soon - register your interest now"
        projects={allProjects.commercial.upcoming}
      />

      {/* CTA Banner */}
      <CtaBanner
        title="Find Your Ideal Commercial Space"
        description="Contact our sales team for personalized assistance or to schedule a site visit."
        buttons={[
          {
            text: "Contact Us",
            href: "/contact",
            variant: "default",
          },
          {
            text: "View Residential Projects",
            href: "/residential",
            variant: "default",
          },
        ]}
      />
    </main>
  );
} 