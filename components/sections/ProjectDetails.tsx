"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { AmenitiesFeatures } from "@/components/AmenitiesFeatures";
import { ProjectBrochureSection } from "@/components/ProjectBrochureSection";

export interface Amenity {
  id: string;
  name: string;
  icon: React.ReactNode;
}

export interface Specification {
  name: string;
  value: string;
}

interface ProjectDetailsProps {
  title: string;
  description: string;
  location: string;
  status: "ongoing" | "completed" | "upcoming";
  type: "residential" | "commercial";
  imageSrc: string;
  specifications: Specification[];
  amenities: Amenity[];
  brochureUrl?: string;
  contactPhone?: string;
  reraNumber?: string;
}

export default function ProjectDetails({
  title,
  description,
  location,
  status,
  type,
  imageSrc,
  specifications,
  amenities,
  brochureUrl,
  contactPhone,
  reraNumber,
}: ProjectDetailsProps) {
  return (
    <>
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Project Image */}
            <div className="relative h-80 lg:h-full min-h-[400px] rounded-lg overflow-hidden shadow-lg">
              <Image
                src={imageSrc}
                alt={title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute top-4 left-4 flex space-x-2">
                <span className="bg-highlight text-primary px-3 py-1 rounded-md text-sm font-medium capitalize">
                  {type}
                </span>
                <span className="bg-accent text-accent-foreground px-3 py-1 rounded-md text-sm font-medium capitalize">
                  {status}
                </span>
              </div>
            </div>

            {/* Project Info */}
            <div>
              <h1 className="text-3xl md:text-4xl font-display mb-4">{title}</h1>
              
              <div className="flex items-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-highlight mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-foreground/70">{location}</span>
              </div>

              {reraNumber && (
                <div className="bg-muted px-4 py-2 rounded-md inline-flex items-center mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-highlight mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  <span className="text-sm">RERA: {reraNumber}</span>
                </div>
              )}

              <p className="text-foreground/80 mb-8">{description}</p>

              {/* Specifications */}
              <div className="mb-8">
                <h3 className="text-xl font-display mb-4">Specifications</h3>
                <div className="bg-card p-6 rounded-lg shadow-md space-y-4">
                  {specifications.map((spec, index) => (
                    <div
                      key={index}
                      className={`flex justify-between items-start ${
                        index < specifications.length - 1
                          ? "pb-4 border-b border-border"
                          : ""
                      }`}
                    >
                      <span className="font-medium">{spec.name}</span>
                      <span className="text-foreground/70 text-right ml-4">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 mb-8">
                {contactPhone && (
                  <ShimmerButton
                    onClick={() => window.location.href = `tel:${contactPhone.replace(/\s+/g, "")}`}
                    shimmerColor="#ffffff"
                    background="rgba(255, 255, 255, 0.1)"
                    className="font-medium"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    Contact Us
                  </ShimmerButton>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Amenities Section with DotPattern */}
      {amenities.length > 0 && (
        <AmenitiesFeatures 
          amenities={amenities.map(amenity => ({
            icon: amenity.icon,
            title: amenity.name
          }))}
        />
      )}

      {/* Brochure Download Section */}
      {brochureUrl && (
        <ProjectBrochureSection
          projectName={title}
          brochureUrl={brochureUrl}
        />
      )}
    </>
  );
} 