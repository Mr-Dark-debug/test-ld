import { Metadata } from "next/types";
import { notFound } from "next/navigation";
import ProjectDetails from "@/components/sections/ProjectDetails";
import Gallery from "@/components/sections/Gallery";
import CtaBanner from "@/components/sections/CtaBanner";
import { projectDetails } from "@/data/projects";
import { SlugPageParams } from "./types";

// Generate metadata for the page
export async function generateMetadata(
  { params }: SlugPageParams
): Promise<Metadata> {
  const project = projectDetails[params.slug];

  if (!project) {
    return {
      title: "Project Not Found | Laxmi Developers",
    };
  }

  return {
    title: `${project.title} | Residential Projects | Laxmi Developers`,
    description: project.description.substring(0, 160), // First 160 characters for SEO
  };
}

// Define the page component
export default async function ProjectPage(
  { params }: SlugPageParams
) {
  const project = projectDetails[params.slug];

  if (!project || project.type !== "residential" || project.status !== "ongoing") {
    notFound();
  }

  // Mock gallery images
  const galleryImages = [
    {
      id: "image-1",
      src: project.imageSrc,
      alt: `${project.title} - Exterior View`,
      width: 1200,
      height: 800,
    },
    {
      id: "image-2",
      src: project.imageSrc,
      alt: `${project.title} - Interior View`,
      width: 1200,
      height: 800,
    },
    {
      id: "image-3",
      src: project.imageSrc,
      alt: `${project.title} - Floor Plan`,
      width: 1200,
      height: 800,
    },
    {
      id: "image-4",
      src: project.imageSrc,
      alt: `${project.title} - Amenities`,
      width: 1200,
      height: 800,
    },
    {
      id: "image-5",
      src: project.imageSrc,
      alt: `${project.title} - Surrounding Area`,
      width: 1200,
      height: 800,
    },
    {
      id: "image-6",
      src: project.imageSrc,
      alt: `${project.title} - Construction Progress`,
      width: 1200,
      height: 800,
    },
  ];

  return (
    <main>
      {/* Project Details */}
      <ProjectDetails
        title={project.title}
        description={project.description}
        location={project.location}
        status={project.status}
        type={project.type}
        imageSrc={project.imageSrc}
        specifications={project.specifications}
        amenities={project.amenities}
        brochureUrl={project.brochureUrl}
        contactPhone={project.contactPhone}
        reraNumber={project.reraNumber}
      />

      {/* Project Gallery */}
      <Gallery
        title="Project Gallery"
        subtitle="Take a visual tour of this exceptional property"
        images={galleryImages}
      />

      {/* CTA Banner */}
      <CtaBanner
        title="Interested in this Project?"
        description="Contact our sales team for more information or to schedule a site visit."
        buttons={[
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