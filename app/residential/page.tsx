import { Metadata } from "next/types";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import CtaBanner from "@/components/sections/CtaBanner";
import { allProjects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Residential Projects | Laxmi Developers",
  description: "Explore our premium residential projects in Surat. Find your dream home with Laxmi Developers.",
};

export default function ResidentialPage() {
  // Combine ongoing and completed residential projects
  const residentialProjects = [
    ...allProjects.residential.ongoing,
    ...allProjects.residential.completed,
  ];

  return (
    <main>
      {/* Hero Section */}
      <section className="relative py-24 bg-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-display text-foreground mb-6">
            Residential Projects
          </h1>
          <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
            Discover premium residential properties designed for modern living.
          </p>
        </div>
      </section>

      {/* Ongoing Projects */}
      <FeaturedProjects
        title="Ongoing Residential Projects"
        subtitle="Our latest residential projects currently under development"
        projects={allProjects.residential.ongoing}
      />

      {/* Completed Projects */}
      <FeaturedProjects
        title="Completed Residential Projects"
        subtitle="Successfully delivered residential properties that stand as a testament to our quality"
        projects={allProjects.residential.completed}
      />

      {/* CTA Banner */}
      <CtaBanner
        title="Find Your Dream Home Today"
        description="Contact our sales team for personalized assistance or to schedule a site visit."
        buttons={[
          {
            text: "Contact Us",
            href: "/contact",
            variant: "default",
          },
          {
            text: "View Commercial Projects",
            href: "/commercial",
            variant: "default",
          },
        ]}
      />
    </main>
  );
} 