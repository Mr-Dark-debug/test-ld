"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AuroraButton } from "@/components/ui/aurora-button";
import AnimatedTitle from "@/components/ui/AnimatedTitle";
import { cn } from "@/lib/utils";

const NAVY_BLUE_BACKGROUND = "bg-[#324189]/80"; // 80% opacity navy blue
const NAVY_BLUE_BACKGROUND_HOVER = "bg-[#324189]/90"; // 90% opacity for hover

export interface Project {
  id: string;
  title: string;
  type: "residential" | "commercial";
  status: "ongoing" | "completed" | "upcoming";
  location: string;
  imageSrc: string;
  href: string;
}

interface FeaturedProjectsProps {
  title: string;
  subtitle?: string;
  projects: Project[];
  viewAllHref?: string;
}

export default function FeaturedProjects({
  title,
  subtitle,
  projects,
  viewAllHref,
}: FeaturedProjectsProps) {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  // Standardized to navy blue
  const getStatusColor = (status: "ongoing" | "completed" | "upcoming") => {
    // Can differentiate by slight opacity or borders if needed, but base is navy
    switch (status) {
      case "ongoing": return `${NAVY_BLUE_BACKGROUND} hover:${NAVY_BLUE_BACKGROUND_HOVER} text-white shadow-md`;
      case "completed": return `${NAVY_BLUE_BACKGROUND} hover:${NAVY_BLUE_BACKGROUND_HOVER} text-white shadow-md`; // Could be a slightly darker navy if desired, e.g., bg-[#242e65]/80
      case "upcoming": return `${NAVY_BLUE_BACKGROUND} hover:${NAVY_BLUE_BACKGROUND_HOVER} text-white shadow-md`;// Could be a slightly lighter navy if desired, e.g., bg-[#4052a7]/80
      default: return "bg-gray-500/80 hover:bg-gray-600/90 text-white shadow-md";
    }
  };

  const getTypeColor = (type: "residential" | "commercial") => {
    // Both will use the same navy blue base
    switch (type) {
      case "residential": return `${NAVY_BLUE_BACKGROUND} hover:${NAVY_BLUE_BACKGROUND_HOVER} text-white shadow-md`;
      case "commercial": return `${NAVY_BLUE_BACKGROUND} hover:${NAVY_BLUE_BACKGROUND_HOVER} text-white shadow-md`;
      default: return "bg-gray-500/80 hover:bg-gray-600/90 text-white shadow-md";
    }
  };

  const filteredProjects = projects.filter((project) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "residential") return project.type === "residential";
    if (activeFilter === "commercial") return project.type === "commercial";
    if (activeFilter === "ongoing") return project.status === "ongoing";
    if (activeFilter === "completed") return project.status === "completed";
    return true;
  });

  return (
    <section className="py-16 sm:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12">
          <AnimatedTitle as="h2" className="text-3xl sm:text-4xl mb-3 sm:mb-4">
            {title}
          </AnimatedTitle>
          {subtitle && (
            <p className="text-base sm:text-lg text-foreground/70 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeFilter === "all"
                ? "bg-highlight text-primary"
                : "bg-muted text-foreground hover:bg-muted/80"
            }`}
          >
            All Projects
          </button>
          <button
            onClick={() => setActiveFilter("residential")}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeFilter === "residential"
                ? "bg-highlight text-primary"
                : "bg-muted text-foreground hover:bg-muted/80"
            }`}
          >
            Residential
          </button>
          <button
            onClick={() => setActiveFilter("commercial")}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeFilter === "commercial"
                ? "bg-highlight text-primary"
                : "bg-muted text-foreground hover:bg-muted/80"
            }`}
          >
            Commercial
          </button>
          <button
            onClick={() => setActiveFilter("ongoing")}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeFilter === "ongoing"
                ? "bg-highlight text-primary"
                : "bg-muted text-foreground hover:bg-muted/80"
            }`}
          >
            On-Going
          </button>
          <button
            onClick={() => setActiveFilter("completed")}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeFilter === "completed"
                ? "bg-highlight text-primary"
                : "bg-muted text-foreground hover:bg-muted/80"
            }`}
          >
            Completed
          </button>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
            >
              <Link href={project.href} className="block">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={project.imageSrc}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-70"></div>
                  <div className={cn(
                    "absolute top-4 left-4 px-3 py-1 rounded-md text-xs sm:text-sm font-medium shadow-md transition-colors duration-300",
                    getTypeColor(project.type)
                  )}>
                    {project.type.charAt(0).toUpperCase() + project.type.slice(1)}
                  </div>
                  <div className={cn(
                    "absolute top-4 right-4 px-3 py-1 rounded-md text-xs sm:text-sm font-medium shadow-md transition-colors duration-300 capitalize",
                    getStatusColor(project.status)
                  )}>
                    {project.status}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-display mb-2 group-hover:text-highlight transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-foreground/70 mb-4 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2 text-highlight"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {project.location}
                  </p>
                  <div className="flex justify-end mt-auto pt-4">
                    <AuroraButton
                      as="a"
                      href={project.href}
                      className="px-4 py-1.5 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-2 focus:ring-offset-2 focus:ring-primary/70 dark:focus:ring-offset-gray-800 rounded-md shadow-md"
                    >
                      View Details
                    </AuroraButton>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* View All Button */}
        {viewAllHref && (
          <div className="mt-12 text-center">
            <AuroraButton
              as="a"
              href={viewAllHref}
              className="px-8 py-3 font-semibold text-lg bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-2 focus:ring-offset-2 focus:ring-primary/70 dark:focus:ring-offset-gray-800 rounded-md shadow-lg"
            >
              View All Projects
            </AuroraButton>
          </div>
        )}
      </div>
    </section>
  );
}