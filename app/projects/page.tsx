"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/Button'; // Assuming this is your Button component
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Shadcn Select
import { Search, MapPin, ListFilter, Building, CheckCircle, Clock, Star, X } from 'lucide-react';
import AnimatedTitle from '@/components/ui/AnimatedTitle';
import { cn } from '@/lib/utils';
import { useProjects, transformProjectForComponent } from '@/hooks/useProjects';

const NAVY_BLUE_BACKGROUND = "bg-[#324189]/80";
const NAVY_BLUE_BACKGROUND_HOVER = "bg-[#324189]/90";

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
      case "ongoing": return `${NAVY_BLUE_BACKGROUND} hover:${NAVY_BLUE_BACKGROUND_HOVER} text-white shadow-md`;
      case "completed": return `${NAVY_BLUE_BACKGROUND} hover:${NAVY_BLUE_BACKGROUND_HOVER} text-white shadow-md`;
      case "upcoming": return `${NAVY_BLUE_BACKGROUND} hover:${NAVY_BLUE_BACKGROUND_HOVER} text-white shadow-md`;
      default: return "bg-gray-500/80 hover:bg-gray-600/90 text-white shadow-md";
    }
  };

  const getTypeColor = (type: Project['type']) => {
    switch (type) {
      case "residential": return `${NAVY_BLUE_BACKGROUND} hover:${NAVY_BLUE_BACKGROUND_HOVER} text-white shadow-md`;
      case "commercial": return `${NAVY_BLUE_BACKGROUND} hover:${NAVY_BLUE_BACKGROUND_HOVER} text-white shadow-md`;
      default: return "bg-gray-500/80 hover:bg-gray-600/90 text-white shadow-md";
    }
  };

  return (
    <Link href={project.href} className="block group bg-card dark:bg-gray-800/50 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-border/70 hover:border-primary/50">
      <div className="relative w-full h-56 overflow-hidden">
        <Image
          src={project.imageSrc}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Fetch projects from API
  const {
    projects: allProjectsData,
    loading: projectsLoading,
    error: projectsError
  } = useProjects({
    type: categoryFilter !== 'all' ? categoryFilter : undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    location: locationFilter !== 'all' ? locationFilter : undefined,
    search: searchTerm || undefined,
    limit: 50 // Get more projects for the listing page
  });

  // Transform API projects to component format
  const transformedProjects = allProjectsData.map(transformProjectForComponent);

  // Common locations for the filter
  const locations = useMemo(() => {
    // Extract unique locations from projects
    const uniqueLocations = Array.from(
      new Set(transformedProjects.map(project => {
        // Extract city from location (assuming format is "Area, City, State")
        const parts = project.location.split(',');
        return parts.length > 1 ? parts[1].trim() : project.location.trim();
      }))
    ).sort();

    // If no projects or no locations, provide defaults
    if (uniqueLocations.length === 0) {
      return ["Surat", "Ahmedabad", "Mumbai", "Delhi"];
    }
    
    return uniqueLocations;
  }, [transformedProjects]);

  const filteredProjects = useMemo(() => {
    return transformedProjects.filter(project => {
      // Text search filter
      const matchesSearch = !searchTerm || 
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Category filter
      const matchesCategory = categoryFilter === 'all' || 
        project.type === categoryFilter;
      
      // Status filter
      const matchesStatus = statusFilter === 'all' || 
        project.status === statusFilter;
        
      // Location filter
      const matchesLocation = locationFilter === 'all' || 
        project.location.toLowerCase().includes(locationFilter.toLowerCase());
      
      return matchesSearch && matchesCategory && matchesStatus && matchesLocation;
    });
  }, [transformedProjects, searchTerm, categoryFilter, statusFilter, locationFilter]);

  // Handle window resize for responsive filter visibility
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsFilterVisible(true);
      } else {
        setIsFilterVisible(false);
      }
    };

    // Handle scroll for sticky behavior
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    // Initial check
    handleResize();
    handleScroll();

    // Add event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);

    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setStatusFilter('all');
    setLocationFilter('all');
  };

  // Check if any filter is active
  const isFilterActive = searchTerm || categoryFilter !== 'all' || statusFilter !== 'all' || locationFilter !== 'all';

  return (
    <div className="bg-background dark:bg-gray-900 text-foreground dark:text-gray-50 min-h-screen">
      {/* Header Section */}
      <section className="pt-16 pb-28 md:pt-20 md:pb-32 bg-muted dark:bg-gray-800/60 relative text-center">
        <AnimatedTitle as="h1" className="text-4xl md:text-5xl lg:text-6xl font-display mb-3">
          Explore Our Projects
        </AnimatedTitle>
        <p className="text-lg md:text-xl text-foreground/70 dark:text-gray-300/80 max-w-2xl mx-auto">
          Discover a diverse portfolio of residential and commercial properties tailored to your needs.
        </p>
      </section>

      {/* Search and Filters Section - Fixed at top with better sticky behavior */}
      <div className={`sticky -mt-16 top-0 z-30 w-full transition-all duration-300 ${
        scrolled ? 'bg-background/95 dark:bg-gray-900/95 backdrop-blur-md shadow-md' : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4">
          <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 transition-all duration-300 ${
            scrolled ? 'py-3 mt-2' : 'py-4 mt-0'
          }`}>
            {/* Search Bar - Always visible */}
            <div className="relative px-4 mb-4">
              <Search className="absolute left-7 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
              <Input
                type="text"
                placeholder="Search by project name, location, or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-16 py-2 rounded-lg border-border dark:border-gray-700 focus:ring-primary dark:focus:ring-primary-dark focus:border-primary dark:focus:border-primary-dark bg-card/80 dark:bg-gray-800/80"
              />
              
              {/* Mobile Filter Toggle */}
              <div className="md:hidden absolute right-7 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                {isFilterActive && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-full bg-primary/10 text-primary dark:bg-primary-dark/10 dark:text-primary-dark"
                    onClick={resetFilters}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 rounded-lg text-xs border-border dark:border-gray-700"
                  onClick={() => setIsFilterVisible(!isFilterVisible)}
                >
                  <ListFilter className="h-3.5 w-3.5 mr-1.5" />
                  Filters
                </Button>
              </div>
            </div>
            
            {/* Filters - Responsive */}
            <div className={`${isFilterVisible ? 'grid' : 'hidden md:grid'} grid-cols-1 md:grid-cols-3 gap-3 px-4 pb-1`}>
              {/* Category Filter */}
              <Select value={categoryFilter} onValueChange={(value: 'all' | 'residential' | 'commercial') => setCategoryFilter(value)}>
                <SelectTrigger className="w-full py-2 rounded-lg border-border dark:border-gray-700 bg-card/80 dark:bg-gray-800/80 focus:ring-primary dark:focus:ring-primary-dark focus:border-primary dark:focus:border-primary-dark h-10">
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
                <SelectTrigger className="w-full py-2 rounded-lg border-border dark:border-gray-700 bg-card/80 dark:bg-gray-800/80 focus:ring-primary dark:focus:ring-primary-dark focus:border-primary dark:focus:border-primary-dark h-10">
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

              {/* Location Filter */}
              <Select value={locationFilter} onValueChange={(value: string) => setLocationFilter(value)}>
                <SelectTrigger className="w-full py-2 rounded-lg border-border dark:border-gray-700 bg-card/80 dark:bg-gray-800/80 focus:ring-primary dark:focus:ring-primary-dark focus:border-primary dark:focus:border-primary-dark h-10">
                  <MapPin className="h-4 w-4 mr-2 opacity-70" />
                  <SelectValue placeholder="Select Location" />
                </SelectTrigger>
                <SelectContent className="bg-card dark:bg-gray-800 border-border dark:border-gray-700">
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Mobile Only: Filter Actions */}
              <div className="md:hidden flex justify-between mt-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-500 dark:text-gray-400"
                  onClick={resetFilters}
                >
                  Reset All
                </Button>
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={() => setIsFilterVisible(false)}
                >
                  Apply Filters
                </Button>
              </div>
            </div>
            
            {/* Active Filters Display */}
            {isFilterActive && (
              <div className="flex flex-wrap gap-2 mt-3 px-4 items-center hidden md:flex">
                <span className="text-xs text-gray-500 dark:text-gray-400">Active filters:</span>
                {categoryFilter !== 'all' && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-primary/10 dark:bg-primary-dark/10 text-primary dark:text-primary-dark text-xs">
                    {categoryFilter}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-4 w-4 ml-1 p-0 text-primary dark:text-primary-dark hover:bg-transparent"
                      onClick={() => setCategoryFilter('all')}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </span>
                )}
                {statusFilter !== 'all' && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-primary/10 dark:bg-primary-dark/10 text-primary dark:text-primary-dark text-xs">
                    {statusFilter}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-4 w-4 ml-1 p-0 text-primary dark:text-primary-dark hover:bg-transparent"
                      onClick={() => setStatusFilter('all')}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </span>
                )}
                {locationFilter !== 'all' && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-primary/10 dark:bg-primary-dark/10 text-primary dark:text-primary-dark text-xs">
                    {locationFilter}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-4 w-4 ml-1 p-0 text-primary dark:text-primary-dark hover:bg-transparent"
                      onClick={() => setLocationFilter('all')}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </span>
                )}
                {searchTerm && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-primary/10 dark:bg-primary-dark/10 text-primary dark:text-primary-dark text-xs">
                    "{searchTerm}"
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-4 w-4 ml-1 p-0 text-primary dark:text-primary-dark hover:bg-transparent"
                      onClick={() => setSearchTerm('')}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </span>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 ml-auto"
                  onClick={resetFilters}
                >
                  Clear All
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Projects Grid Section */}
      <section className="py-8 mt-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {projectsLoading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-foreground/70">Loading projects...</p>
            </div>
          ) : projectsError ? (
            <div className="text-center py-16">
              <p className="text-red-600 dark:text-red-400 mb-4">Error loading projects: {projectsError}</p>
              <Button onClick={() => window.location.reload()} variant="outline">
                Try Again
              </Button>
            </div>
          ) : filteredProjects.length > 0 ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Showing <span className="font-medium text-gray-900 dark:text-gray-200">{filteredProjects.length}</span> projects
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16 bg-card/50 dark:bg-gray-800/30 rounded-xl border border-border/50 dark:border-gray-700/50 px-4">
              <ListFilter className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">No projects found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                No projects match your current search criteria. Try adjusting your filters or search term.
              </p>
              <Button onClick={resetFilters} variant="outline">
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}