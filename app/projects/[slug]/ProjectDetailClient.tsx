'use client';

import React from 'react';
import ProjectDetails from '@/components/sections/ProjectDetails';
import TabGallery from '@/components/sections/TabGallery';

interface Project {
  _id: string;
  title: string;
  slug: string;
  category: 'residential' | 'commercial';
  status: 'ongoing' | 'completed' | 'upcoming';
  description: string;
  location: {
    address: string;
    city: string;
    state: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    mapEmbedUrl?: string;
  };
  images: {
    coverImage?: string;
    gallery: {
      promotional: string[];
      exterior: string[];
      interior: string[];
      videos: string[];
    };
  };
  specifications: {
    totalUnits: string;
    unitTypes: string;
    unitArea: string;
    possession: string;
    structure: string;
    flooring: string;
  };
  amenities: Array<{
    _id: string;
    name: string;
    icon: string;
    category: string;
    description?: string;
  }>;
  reraNumber: string;
  reraQrImage?: string;
  brochureUrl?: string;
  contactSales: string;
  floorPlans: {
    '1bhk': string[];
    '2bhk': string[];
    '3bhk': string[];
    '4bhk': string[];
    '5bhk': string[];
  };
  featured: boolean;
  seoMeta?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  createdAt: string;
  updatedAt: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
}

interface ProjectDetailClientProps {
  project: Project;
}

export default function ProjectDetailClient({ project }: ProjectDetailClientProps) {
  // Transform project data to match the original ProjectDetails component interface
  const transformedProject = {
    title: project.title,
    description: project.description,
    location: `${project.location.address}, ${project.location.city}, ${project.location.state}`,
    status: project.status,
    type: project.category, // Fix: use category field from the model
    imageSrc: project.images.coverImage || project.images.gallery.promotional[0] || project.images.gallery.exterior[0] || project.images.gallery.interior[0] || '/images/placeholder-project.jpg',
    specifications: [
      { name: 'Total Units', value: project.specifications.totalUnits },
      { name: 'Unit Types', value: project.specifications.unitTypes },
      { name: 'Unit Area', value: project.specifications.unitArea },
      { name: 'Possession', value: project.specifications.possession },
      { name: 'Structure', value: project.specifications.structure },
      { name: 'Flooring', value: project.specifications.flooring },
    ],
    amenities: project.amenities.map(amenity => ({
      id: amenity._id,
      name: amenity.name,
      icon: amenity.icon,
    })),
    brochureUrl: project.brochureUrl,
    contactPhone: project.contactSales,
    reraNumber: project.reraNumber,
    mapEmbedUrl: project.location.mapEmbedUrl,
    reraQrImage: project.reraQrImage,
  };

  // Transform images to match TabGallery format
  const galleryImages = [
    // Cover image
    ...(project.images.coverImage ? [{
      id: 'cover',
      src: project.images.coverImage,
      alt: `${project.title} - Cover Image`,
      width: 800,
      height: 600,
      category: 'promotional' as const
    }] : []),
    // Promotional images
    ...project.images.gallery.promotional.map((src, index) => ({
      id: `promotional-${index}`,
      src,
      alt: `${project.title} - Promotional Image ${index + 1}`,
      width: 800,
      height: 600,
      category: 'promotional' as const
    })),
    // Exterior images
    ...project.images.gallery.exterior.map((src, index) => ({
      id: `exterior-${index}`,
      src,
      alt: `${project.title} - Exterior View ${index + 1}`,
      width: 800,
      height: 600,
      category: 'exterior' as const
    })),
    // Interior images
    ...project.images.gallery.interior.map((src, index) => ({
      id: `interior-${index}`,
      src,
      alt: `${project.title} - Interior View ${index + 1}`,
      width: 800,
      height: 600,
      category: 'interior' as const
    })),
    // Floor plans as images
    ...Object.entries(project.floorPlans).flatMap(([type, plans]) =>
      plans.map((src, index) => ({
        id: `floorplan-${type}-${index}`,
        src,
        alt: `${project.title} - ${type.toUpperCase()} Floor Plan ${index + 1}`,
        width: 800,
        height: 600,
        floorType: type === '2bhk' ? '2bhk' as const :
                  type === '3bhk' ? '3bhk' as const :
                  type === '4bhk' ? '4bhk' as const : undefined
      }))
    )
  ].filter(Boolean);

  return (
    <main>
      {/* Project Details */}
      <ProjectDetails
        title={transformedProject.title}
        description={transformedProject.description}
        location={transformedProject.location}
        status={transformedProject.status}
        type={transformedProject.type}
        imageSrc={transformedProject.imageSrc}
        specifications={transformedProject.specifications}
        amenities={transformedProject.amenities}
        brochureUrl={transformedProject.brochureUrl}
        contactPhone={transformedProject.contactPhone}
        reraNumber={transformedProject.reraNumber}
        mapEmbedUrl={transformedProject.mapEmbedUrl}
        reraQrImage={transformedProject.reraQrImage}
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
