import { useState, useEffect } from 'react';
import { projectsApi } from '@/lib/api';

export interface Project {
  _id: string;
  title: string;
  slug: string;
  type: 'residential' | 'commercial';
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

export interface UseProjectsOptions {
  type?: 'residential' | 'commercial';
  status?: 'ongoing' | 'completed' | 'upcoming';
  featured?: boolean;
  city?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface UseProjectsReturn {
  projects: Project[];
  loading: boolean;
  error: string | null;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  refetch: () => void;
}

export function useProjects(options: UseProjectsOptions = {}): UseProjectsReturn {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<UseProjectsReturn['pagination']>();

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await projectsApi.getAll(options);
      
      if (response.success && response.data) {
        setProjects(response.data);
        setPagination(response.pagination);
      } else {
        setError(response.error || 'Failed to fetch projects');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch projects');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [
    options.type,
    options.status,
    options.featured,
    options.city,
    options.search,
    options.page,
    options.limit
  ]);

  return {
    projects,
    loading,
    error,
    pagination,
    refetch: fetchProjects
  };
}

// Hook specifically for featured projects
export function useFeaturedProjects(): UseProjectsReturn {
  return useProjects({ featured: true, limit: 6 });
}

// Transform API project to component format
export function transformProjectForComponent(project: Project) {
  return {
    id: project._id,
    title: project.title,
    type: project.type,
    status: project.status,
    location: `${project.location.city}, ${project.location.state}`,
    imageSrc: project.images.coverImage || project.images.gallery.promotional[0] || '/images/placeholder-project.jpg',
    href: `/projects/${project.slug}`
  };
}
