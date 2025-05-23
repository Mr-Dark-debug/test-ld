"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AuroraButton } from "@/components/ui/aurora-button";
import AnimatedTitle from "@/components/ui/AnimatedTitle";
import { cn } from "@/lib/utils";

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

  const getStatusColor = (status: "ongoing" | "completed" | "upcoming") => {
    switch (status) {
      case "ongoing": return "bg-yellow-500/90 hover:bg-yellow-600/90 text-white";
      case "completed": return "bg-green-500/90 hover:bg-green-600/90 text-white";
      case "upcoming": return "bg-blue-500/90 hover:bg-blue-600/90 text-white";
      default: return "bg-gray-500/90 hover:bg-gray-600/90 text-white";
    }
  };

  const getTypeColor = (type: "residential" | "commercial") => {
    switch (type) {
      case "residential": return "bg-purple-500/90 hover:bg-purple-600/90 text-white";
      case "commercial": return "bg-teal-500/90 hover:bg-teal-600/90 text-white";
      default: return "bg-gray-500/90 hover:bg-gray-600/90 text-white";
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
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <AnimatedTitle as="h2" className="mb-4">
            {title}
          </AnimatedTitle>
          {subtitle && (
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
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
                  <div className="flex justify-end">
                    <span className="inline-flex items-center justify-center rounded-md text-sm font-medium text-highlight hover:bg-highlight/10 h-9 px-4 py-1.5">
                      View Details
                    </span>
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
              onClick={() => window.location.href = viewAllHref}
              variant="outline"
              className="px-6 py-3 font-medium"
            >
              View All Projects
            </AuroraButton>
          </div>
        )}
      </div>
    </section>
  );
} 