// API utility functions for frontend

import { apiCache } from './performance';
import { FRONTEND_CONFIG, getApiUrl } from './config';

const API_BASE_URL = FRONTEND_CONFIG.API_URL;
const BASE_URL = FRONTEND_CONFIG.BASE_URL;

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

// Get auth token from localStorage or cookies
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;

  // Try localStorage first
  const token = localStorage.getItem('auth-token');
  if (token) return token;

  // Try cookies as fallback
  const cookies = document.cookie.split(';');
  const authCookie = cookies.find(cookie => cookie.trim().startsWith('auth-token='));
  return authCookie ? authCookie.split('=')[1] : null;
}

// Set auth token
function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('auth-token', token);
}

// Remove auth token
function removeAuthToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('auth-token');
}

// Generic API request function with caching
async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {},
  useCache: boolean = true,
  cacheTTL: number = 2 * 60 * 1000 // 2 minutes for faster updates
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();
  const cacheKey = `${url}_${JSON.stringify(options)}`;

  // Check cache for GET requests
  if (useCache && (!options.method || options.method === 'GET')) {
    const cachedData = apiCache.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }
  }

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      // Handle token expiration specifically
      if (response.status === 401 && data.error?.includes('Authentication')) {
        removeAuthToken();
        // Don't throw for auth failures on optional endpoints
        if (endpoint.includes('/auth/me') || endpoint.includes('/testimonials')) {
          return { success: false, error: data.error, data: null };
        }
      }
      throw new ApiError(data.error || 'Request failed', response.status);
    }

    // Cache successful GET responses
    if (useCache && data.success && (!options.method || options.method === 'GET')) {
      apiCache.set(cacheKey, data, cacheTTL);
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Network error', 500);
  }
}

// Authentication API
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await apiRequest<{ user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.data?.token) {
      setAuthToken(response.data.token);
    }

    return response;
  },

  logout: async () => {
    const response = await apiRequest('/auth/logout', {
      method: 'POST',
    });

    removeAuthToken();
    return response;
  },

  me: async () => {
    return apiRequest<{ user: any }>('/auth/me');
  },
  
  updateProfile: async (data: any) => {
    return apiRequest<{ user: any }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

// Projects API
export const projectsApi = {
  getAll: async (params?: {
    type?: string;
    status?: string;
    featured?: boolean;
    city?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const query = searchParams.toString();
    return apiRequest<any[]>(`/projects${query ? `?${query}` : ''}`);
  },

  getById: async (id: string) => {
    // First try to get by ID directly from the main projects endpoint
    try {
      const response = await apiRequest<any[]>(`/projects?id=${id}`);
      if (response.success && response.data && response.data.length > 0) {
        return { success: true, data: response.data[0] };
      }
    } catch (error) {
      console.log('Failed to get by ID, trying by slug...');
    }

    // Fallback to slug-based endpoint
    return apiRequest<any>(`/projects/${id}`);
  },

  create: async (projectData: any) => {
    return apiRequest<any>('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  },

  update: async (id: string, projectData: any) => {
    return apiRequest<any>('/projects', {
      method: 'PUT',
      body: JSON.stringify({ id, ...projectData }),
    });
  },

  updateFeatured: async (id: string, featured: boolean) => {
    return apiRequest<any>('/projects', {
      method: 'PUT',
      body: JSON.stringify({ id, featured }),
    });
  },

  delete: async (id: string) => {
    return apiRequest('/projects', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
    });
  },
};

// Amenities API
export const amenitiesApi = {
  getAll: async () => {
    return apiRequest<any[]>('/amenities');
  },
  
  getById: async (id: string) => {
    return apiRequest<any>(`/amenities/${id}`);
  },
  
  getByCategory: async (category: string) => {
    return apiRequest<any[]>(`/amenities/category/${category}`);
  },
  
  create: async (data: any) => {
    return apiRequest<any>('/amenities', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  update: async (id: string, data: any) => {
    return apiRequest<any>(`/amenities/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  delete: async (id: string) => {
    return apiRequest<any>(`/amenities/${id}`, {
      method: 'DELETE',
    });
  },
  
  getCategories: async () => {
    return apiRequest<string[]>('/amenities/categories');
  },
};

// Testimonials API
export const testimonialsApi = {
  getAll: async (params?: {
    approved?: boolean;
    featured?: boolean;
    projectId?: string;
    minRating?: number;
    page?: number;
    limit?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const query = searchParams.toString();
    return apiRequest<any[]>(`/testimonials${query ? `?${query}` : ''}`);
  },

  create: async (testimonialData: any) => {
    return apiRequest<any>('/testimonials', {
      method: 'POST',
      body: JSON.stringify(testimonialData),
    });
  },

  update: async (id: string, testimonialData: any) => {
    return apiRequest<any>(`/testimonials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(testimonialData),
    });
  },

  approve: async (id: string) => {
    return apiRequest<any>(`/testimonials/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ action: 'approve' }),
    });
  },

  feature: async (id: string) => {
    return apiRequest<any>(`/testimonials/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ action: 'feature' }),
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/testimonials/${id}`, {
      method: 'DELETE',
    });
  },
};

// Leads API
export const leadsApi = {
  getAll: async (params?: {
    type?: string;
    status?: string;
    assignedTo?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const query = searchParams.toString();
    return apiRequest<any[]>(`/leads${query ? `?${query}` : ''}`);
  },

  submitContact: async (contactData: {
    name: string;
    email: string;
    phone: string;
    projectInterest?: string;
    message: string;
  }) => {
    return apiRequest<any>('/leads/contact', {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
  },

  submitBrochure: async (brochureData: {
    name: string;
    email: string;
    phone: string;
    projectId: string;
  }) => {
    return apiRequest<any>('/leads/brochure', {
      method: 'POST',
      body: JSON.stringify(brochureData),
    });
  },
};

// Dashboard API
export const dashboardApi = {
  getStats: async () => {
    return apiRequest<any>('/dashboard/stats');
  },
};

// Upload API
export const uploadApi = {
  uploadFiles: async (files: FileList, type: 'image' | 'brochure' | 'video', generateThumbnails = false) => {
    const formData = new FormData();
    formData.append('type', type);
    formData.append('thumbnails', generateThumbnails.toString());

    Array.from(files).forEach((file, index) => {
      formData.append(`file_${index}`, file);
    });

    const token = getAuthToken();
    return fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    }).then(res => res.json());
  },

  deleteFile: async (imageId: string) => {
    return apiRequest('/upload', {
      method: 'DELETE',
      body: JSON.stringify({ imageId }),
    });
  },
};

// Blog API
export const blogsApi = {
  getAll: async (params?: {
    status?: string;
    category?: string;
    tag?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const query = searchParams.toString();
    return apiRequest<any[]>(`/blogs${query ? `?${query}` : ''}`);
  },

  getById: async (id: string) => {
    return apiRequest<any>(`/blogs/${id}?admin=true`);
  },

  getBySlug: async (slug: string) => {
    return apiRequest<any>(`/blogs/${slug}`);
  },

  create: async (blogData: any) => {
    return apiRequest<any>('/blogs', {
      method: 'POST',
      body: JSON.stringify(blogData),
    });
  },

  update: async (slug: string, blogData: any) => {
    return apiRequest<any>(`/blogs/${slug}`, {
      method: 'PUT',
      body: JSON.stringify(blogData),
    });
  },

  delete: async (slug: string) => {
    return apiRequest(`/blogs/${slug}`, {
      method: 'DELETE',
    });
  },
};

export { ApiError, getAuthToken, setAuthToken, removeAuthToken };
