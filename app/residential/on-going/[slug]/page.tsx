import { Metadata } from "next/types";
import { notFound } from "next/navigation";
import ProjectDetails from "@/components/sections/ProjectDetails";
import TabGallery from "@/components/sections/TabGallery";
import { projectDetails } from "@/data/projects";
import { SlugPageParams } from "./types";

// Generate metadata for the page
export async function generateMetadata(
  { params: { slug } }: SlugPageParams
): Promise<Metadata> {
  const project = projectDetails[slug as keyof typeof projectDetails];

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
  { params: { slug } }: SlugPageParams
) {
  const project = projectDetails[slug as keyof typeof projectDetails];

  if (!project || project.type !== "residential" || project.status !== "ongoing") {
    notFound();
  }

  // Gallery images with categories and floor types
  const galleryImages = [
    {
      id: "image-1",
      src: project.imageSrc,
      alt: `${project.title} - Exterior View`,
      width: 1200,
      height: 800,
      category: 'exterior' as const,
    },
    {
      id: "image-2",
      src: project.imageSrc,
      alt: `${project.title} - Interior View`,
      width: 1200,
      height: 800,
      category: 'interior' as const,
    },
    {
      id: "image-3",
      src: project.imageSrc,
      alt: `${project.title} - Site Overview`,
      width: 1200,
      height: 800,
      category: 'promotional' as const,
    },
    {
      id: "image-4",
      src: project.imageSrc,
      alt: `${project.title} - Amenities`,
      width: 1200,
      height: 800,
      category: 'interior' as const,
    },
    {
      id: "image-5",
      src: project.imageSrc,
      alt: `${project.title} - Surrounding Area`,
      width: 1200,
      height: 800,
      category: 'exterior' as const,
    },
    {
      id: "image-6",
      src: project.imageSrc,
      alt: `${project.title} - Construction Progress`,
      width: 1200,
      height: 800,
      category: 'promotional' as const,
    },
    {
      id: "video-1",
      src: project.imageSrc,
      alt: `${project.title} - Project Walkthrough`,
      width: 1200,
      height: 800,
      category: 'video' as const,
    },
    // 3BHK Floor Plans
    {
      id: "3bhk-1",
      src: project.imageSrc,
      alt: `${project.title} - 3BHK Type A`,
      width: 1200,
      height: 800,
      floorType: '3bhk' as const,
    },
    {
      id: "3bhk-2",
      src: project.imageSrc,
      alt: `${project.title} - 3BHK Type B`,
      width: 1200,
      height: 800,
      floorType: '3bhk' as const,
    },
    {
      id: "3bhk-3",
      src: project.imageSrc,
      alt: `${project.title} - 3BHK Premium`,
      width: 1200,
      height: 800,
      floorType: '3bhk' as const,
    },
    // 4BHK Floor Plans
    {
      id: "4bhk-1",
      src: project.imageSrc,
      alt: `${project.title} - 4BHK Type A`,
      width: 1200,
      height: 800,
      floorType: '4bhk' as const,
    },
    {
      id: "4bhk-2",
      src: project.imageSrc,
      alt: `${project.title} - 4BHK Type B`,
      width: 1200,
      height: 800,
      floorType: '4bhk' as const,
    },
    {
      id: "4bhk-3",
      src: project.imageSrc,
      alt: `${project.title} - 4BHK Penthouse`,
      width: 1200,
      height: 800,
      floorType: '4bhk' as const,
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

      {/* Project Gallery with Tabs */}
      <TabGallery
        title="Project Gallery & Floor Plans"
        subtitle="Explore our property through images and detailed floor plans"
        images={galleryImages}
      />
    </main>
  );
} 