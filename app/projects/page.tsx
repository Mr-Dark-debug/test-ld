"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { featuredProjects as allProjectsData } from '@/data/projects'; // Using featuredProjects as the source for all projects
import Link from 'next/link';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/Button'; // Assuming this is your Button component
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Shadcn Select
import { Search, MapPin, ListFilter, Building, CheckCircle, Clock, Star } from 'lucide-react';
import AnimatedTitle from '@/components/ui/AnimatedTitle';
import { cn } from '@/lib/utils';

// Define Project type based on data/projects.tsx
export interface Project {
  id: string;
  title: string;
  type: "residential" | "commercial";
  status: "ongoing" | "completed" | "upcoming";
  location: string;
  imageSrc: string;
  href: string;
  description?: string; // Add description if available in your data
}

// Reusable Project Card Component (similar to FeaturedProjects but can be more generic)
const ProjectCard = ({ project }: { project: Project }) => {
  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case "ongoing": return "bg-yellow-500/90 text-white";
      case "completed": return "bg-green-500/90 text-white";
      case "upcoming": return "bg-blue-500/90 text-white";
      default: return "bg-gray-500/90 text-white";
    }
  };

  const getTypeColor = (type: Project['type']) => {
    switch (type) {
      case "residential": return "bg-purple-500/90 text-white";
      case "commercial": return "bg-teal-500/90 text-white";
      default: return "bg-gray-500/90 text-white";
    }
  };

  return (
    <Link href={project.href} className="block group bg-card dark:bg-gray-800/50 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-border/70 hover:border-primary/50">
      <div className="relative w-full h-56 overflow-hidden">
        <Image
          src={project.imageSrc}
          alt={project.title}
          fill
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
        <div className={cn("absolute top-3 left-3 px-2.5 py-1 rounded-md text-xs font-semibold shadow", getTypeColor(project.type))}>
          {project.type.charAt(0).toUpperCase() + project.type.slice(1)}
        </div>
        <div className={cn("absolute top-3 right-3 px-2.5 py-1 rounded-md text-xs font-semibold shadow capitalize", getStatusColor(project.status))}>
          {project.status}
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-xl font-display text-foreground dark:text-white group-hover:text-highlight dark:group-hover:text-highlight-dark transition-colors mb-1.5 truncate">
          {project.title}
        </h3>
        {project.description && (
          <p className="text-sm text-foreground/70 dark:text-foreground-dark/70 mb-3 h-10 overflow-hidden text-ellipsis">
            {project.description} 
          </p>
        )}
        <div className="flex items-center text-xs text-foreground/60 dark:text-foreground-dark/60 mb-4">
          <MapPin size={14} className="mr-1.5 text-highlight dark:text-highlight-dark" />
          {project.location}
        </div>
        <Button variant="outline" className="w-full text-sm py-2 border-primary/50 text-primary hover:bg-primary/10 hover:text-primary dark:border-primary-dark/50 dark:text-primary-dark dark:hover:bg-primary-dark/10 dark:hover:text-primary-dark">
          View Details
        </Button>
      </div>
    </Link>
  );
};


export default function AllProjectsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'residential' | 'commercial'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'ongoing' | 'completed' | 'upcoming'>('all');
  // const [locationFilter, setLocationFilter] = useState('all'); // For future use

  // Get unique locations for filter if needed in future
  // const locations = useMemo(() => {
  //   const allLocs = allProjectsData.map(p => p.location);
  //   return ['all', ...Array.from(new Set(allLocs))];
  // }, []);

  const filteredProjects = useMemo(() => {
    return allProjectsData
      .filter(project => {
        const projectAsAny = project as any; // Temporary type assertion to check for description
        return (
          project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (projectAsAny.description && typeof projectAsAny.description === 'string' && projectAsAny.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
          project.location.toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
      .filter(project => categoryFilter === 'all' || project.type === categoryFilter)
      .filter(project => statusFilter === 'all' || project.status === statusFilter);
      // .filter(project => locationFilter === 'all' || project.location === locationFilter);
  }, [searchTerm, categoryFilter, statusFilter]);

  return (
    <div className="bg-background dark:bg-gray-900 text-foreground dark:text-gray-50 min-h-screen">
      {/* Header Section */}
      <section className="py-16 md:py-20 bg-muted dark:bg-gray-800/60 relative text-center">
         <AnimatedTitle as="h1" className="text-4xl md:text-5xl lg:text-6xl font-display mb-3">
          Explore Our Projects
        </AnimatedTitle>
        <p className="text-lg md:text-xl text-foreground/70 dark:text-gray-300/80 max-w-2xl mx-auto">
          Discover a diverse portfolio of residential and commercial properties tailored to your needs.
        </p>
      </section>

      {/* Search and Filters Section */}
      <section className="sticky top-[60px] md:top-[68px] z-30 bg-background/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm py-4 mb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
            <Input
              type="text"
              placeholder="Search by project name, location, or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border-border dark:border-gray-700 focus:ring-primary dark:focus:ring-primary-dark focus:border-primary dark:focus:border-primary-dark bg-card dark:bg-gray-800"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Category Filter */}
            <Select value={categoryFilter} onValueChange={(value: 'all' | 'residential' | 'commercial') => setCategoryFilter(value)}>
              <SelectTrigger className="w-full py-3 rounded-lg border-border dark:border-gray-700 bg-card dark:bg-gray-800 focus:ring-primary dark:focus:ring-primary-dark focus:border-primary dark:focus:border-primary-dark">
                <Building className="h-4 w-4 mr-2 opacity-70" /> 
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent className="bg-card dark:bg-gray-800 border-border dark:border-gray-700">
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="residential">Residential</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={(value: 'all' | 'ongoing' | 'completed' | 'upcoming') => setStatusFilter(value)}>
              <SelectTrigger className="w-full py-3 rounded-lg border-border dark:border-gray-700 bg-card dark:bg-gray-800 focus:ring-primary dark:focus:ring-primary-dark focus:border-primary dark:focus:border-primary-dark">
                <ListFilter className="h-4 w-4 mr-2 opacity-70" />
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent className="bg-card dark:bg-gray-800 border-border dark:border-gray-700">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="ongoing"><Clock size={14} className="inline mr-1.5 text-yellow-500"/>Ongoing</SelectItem>
                <SelectItem value="completed"><CheckCircle size={14} className="inline mr-1.5 text-green-500"/>Completed</SelectItem>
                <SelectItem value="upcoming"><Star size={14} className="inline mr-1.5 text-blue-500"/>Upcoming</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Location Filter (Placeholder for now) */}
            <Select value={"all"} disabled>
              <SelectTrigger className="w-full py-3 rounded-lg border-border dark:border-gray-700 bg-card dark:bg-gray-800 opacity-60 cursor-not-allowed">
                <MapPin className="h-4 w-4 mr-2 opacity-70" />
                <SelectValue placeholder="Select Location (Soon)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Projects Grid Section */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 md:gap-8">
              {filteredProjects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Search size={48} className="mx-auto text-gray-400 dark:text-gray-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No Projects Found</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
} 