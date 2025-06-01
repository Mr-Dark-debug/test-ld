// API service for blog management
export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  author: {
    name: string;
    avatar?: string;
  };
  category: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  readingTime?: number;
  seoMeta?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  formattedReadingTime?: string;
}

export interface BlogsResponse {
  success: boolean;
  data: BlogPost[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  error?: string;
}

export interface BlogResponse {
  success: boolean;
  data?: BlogPost;
  message?: string;
  error?: string;
}

class BlogsAPI {
  private baseUrl = '/api/blogs';

  async getAll(params?: {
    status?: string;
    category?: string;
    tag?: string;
    search?: string;
    limit?: number;
    page?: number;
    admin?: string;
  }): Promise<BlogsResponse> {
    try {
      const searchParams = new URLSearchParams();

      if (params?.status) searchParams.append('status', params.status);
      if (params?.category) searchParams.append('category', params.category);
      if (params?.tag) searchParams.append('tag', params.tag);
      if (params?.search) searchParams.append('search', params.search);
      if (params?.limit) searchParams.append('limit', params.limit.toString());
      if (params?.page) searchParams.append('page', params.page.toString());
      if (params?.admin) searchParams.append('admin', params.admin);

      const url = `${this.baseUrl}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching blogs:', error);
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : 'Failed to fetch blogs'
      };
    }
  }

  async getById(id: string): Promise<BlogResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching blog:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch blog'
      };
    }
  }

  async getBySlug(slug: string): Promise<BlogResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/${slug}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching blog by slug:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch blog'
      };
    }
  }

  async create(blogData: Partial<BlogPost>): Promise<BlogResponse> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blogData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating blog:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create blog'
      };
    }
  }

  async update(id: string, blogData: Partial<BlogPost>): Promise<BlogResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blogData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating blog:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update blog'
      };
    }
  }

  async delete(id: string): Promise<BlogResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting blog:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete blog'
      };
    }
  }

  async updateStatus(id: string, status: 'draft' | 'published' | 'archived'): Promise<BlogResponse> {
    return this.update(id, { status });
  }

  async publish(id: string): Promise<BlogResponse> {
    return this.update(id, {
      status: 'published',
      publishedAt: new Date().toISOString()
    });
  }

  async unpublish(id: string): Promise<BlogResponse> {
    return this.update(id, { status: 'draft' });
  }

  async archive(id: string): Promise<BlogResponse> {
    return this.update(id, { status: 'archived' });
  }
}

export const blogsApi = new BlogsAPI();
export default blogsApi;
