import { useState, useEffect } from 'react';
import { testimonialsApi } from '@/lib/api';

export interface Testimonial {
  _id: string;
  name: string;
  designation?: string;
  company?: string;
  content: string;
  rating: number;
  image?: string;
  youtubeUrl?: string;
  projectId?: {
    _id: string;
    title: string;
    type: string;
    status: string;
  };
  isApproved: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  displayName?: string;
}

export interface UseTestimonialsOptions {
  approved?: boolean;
  featured?: boolean;
  projectId?: string;
  minRating?: number;
  page?: number;
  limit?: number;
}

export interface UseTestimonialsReturn {
  testimonials: Testimonial[];
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

export function useTestimonials(options: UseTestimonialsOptions = {}): UseTestimonialsReturn {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<UseTestimonialsReturn['pagination']>();

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await testimonialsApi.getAll(options);
      
      if (response.success && response.data) {
        setTestimonials(response.data);
        setPagination(response.pagination);
      } else {
        setError(response.error || 'Failed to fetch testimonials');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch testimonials');
      console.error('Error fetching testimonials:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, [
    options.approved,
    options.featured,
    options.projectId,
    options.minRating,
    options.page,
    options.limit
  ]);

  return {
    testimonials,
    loading,
    error,
    pagination,
    refetch: fetchTestimonials
  };
}

// Hook specifically for featured testimonials with caching
export function useFeaturedTestimonials(): UseTestimonialsReturn {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch if we don't have testimonials yet
    if (testimonials.length === 0) {
      setLoading(true);
      testimonialsApi.getAll({ featured: true, approved: true, limit: 4 })
        .then(response => {
          if (response.success && response.data) {
            setTestimonials(response.data);
          } else {
            setError(response.error || 'Failed to fetch testimonials');
          }
        })
        .catch(err => {
          setError(err.message || 'Failed to fetch testimonials');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [testimonials.length]);

  return { testimonials, loading, error, refetch: () => setTestimonials([]) };
}

// Hook for approved testimonials (public display)
export function useApprovedTestimonials(limit: number = 20): UseTestimonialsReturn {
  return useTestimonials({ approved: true, limit });
}

// Transform API testimonial to component format
export function transformTestimonialForComponent(testimonial: Testimonial) {
  return {
    id: testimonial._id,
    name: testimonial.name,
    designation: testimonial.designation,
    company: testimonial.company,
    content: testimonial.content,
    rating: testimonial.rating,
    image: testimonial.image || '/images/default-avatar.jpg',
    projectTitle: testimonial.projectId?.title,
    displayName: getDisplayName(testimonial)
  };
}

// Helper function to get display name
function getDisplayName(testimonial: Testimonial): string {
  if (testimonial.designation && testimonial.company) {
    return `${testimonial.name}, ${testimonial.designation} at ${testimonial.company}`;
  } else if (testimonial.designation) {
    return `${testimonial.name}, ${testimonial.designation}`;
  } else if (testimonial.company) {
    return `${testimonial.name} from ${testimonial.company}`;
  }
  return testimonial.name;
}
