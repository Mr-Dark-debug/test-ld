import { useState, useEffect } from 'react';
import { blogsApi } from '@/lib/api';

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published' | 'scheduled';
  publishedAt?: string;
  scheduledFor?: string;
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

export interface UseBlogsOptions {
  status?: 'draft' | 'published' | 'scheduled';
  category?: string;
  tag?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface UseBlogsReturn {
  blogs: BlogPost[];
  loading: boolean;
  error: string | null;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  refetch: () => void;
  createBlog: (blogData: Partial<BlogPost>) => Promise<{ success: boolean; error?: string; data?: BlogPost }>;
  updateBlog: (slug: string, blogData: Partial<BlogPost>) => Promise<{ success: boolean; error?: string; data?: BlogPost }>;
  deleteBlog: (slug: string) => Promise<{ success: boolean; error?: string }>;
}

export function useBlogs(options: UseBlogsOptions = {}): UseBlogsReturn {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<UseBlogsReturn['pagination']>();

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await blogsApi.getAll(options);
      
      if (response.success && response.data) {
        setBlogs(response.data);
        setPagination(response.pagination);
      } else {
        setError(response.error || 'Failed to fetch blogs');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch blogs');
      console.error('Error fetching blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  const createBlog = async (blogData: Partial<BlogPost>) => {
    try {
      const response = await blogsApi.create(blogData);
      
      if (response.success) {
        // Refresh the blogs list
        await fetchBlogs();
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.error || 'Failed to create blog' };
      }
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to create blog' };
    }
  };

  const updateBlog = async (slug: string, blogData: Partial<BlogPost>) => {
    try {
      const response = await blogsApi.update(slug, blogData);
      
      if (response.success) {
        // Refresh the blogs list
        await fetchBlogs();
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.error || 'Failed to update blog' };
      }
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to update blog' };
    }
  };

  const deleteBlog = async (slug: string) => {
    try {
      const response = await blogsApi.delete(slug);
      
      if (response.success) {
        // Refresh the blogs list
        await fetchBlogs();
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Failed to delete blog' };
      }
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to delete blog' };
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [
    options.status,
    options.category,
    options.tag,
    options.search,
    options.page,
    options.limit
  ]);

  return {
    blogs,
    loading,
    error,
    pagination,
    refetch: fetchBlogs,
    createBlog,
    updateBlog,
    deleteBlog
  };
}

// Hook specifically for published blogs (public)
export function usePublishedBlogs(limit: number = 10): UseBlogsReturn {
  return useBlogs({ status: 'published', limit });
}

// Transform API blog to component format
export function transformBlogForComponent(blog: BlogPost) {
  return {
    id: blog._id,
    title: blog.title,
    slug: blog.slug,
    excerpt: blog.excerpt,
    category: blog.category,
    tags: blog.tags,
    status: blog.status,
    publishedAt: blog.publishedAt,
    featuredImage: blog.featuredImage || '/images/placeholder-blog.jpg',
    href: `/blogs/${blog.slug}`
  };
}
