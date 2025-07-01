'use client'

import React, { useState, useEffect } from 'react'
import { Toaster, toast } from 'sonner'
import { Plus, Search, Filter, Edit, Eye, Trash2, Calendar, User, Tag, Loader2 } from 'lucide-react' // Added Loader2
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button' // Import Button
import { blogsApi } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { logActivity } from '@/lib/activity'

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: 'draft' | 'published' | 'scheduled';
  category: string;
  tags: string[];
  publishDate?: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  readingTime?: string;
  imageUrl?: string;
}

export default function BlogsList() {
  const router = useRouter();
  const { user } = useAuth();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // Fetch blogs from API with retry logic
  const fetchBlogs = async (retryCount = 0) => {
    try {
      setLoading(true);
      setError(null);

      const params: any = {
        admin: 'true', // Get all blogs for admin
        limit: 100
      };

      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }

      if (categoryFilter !== 'all') {
        params.category = categoryFilter;
      }

      if (searchTerm) {
        params.search = searchTerm;
      }

      const response = await blogsApi.getAll(params);

      if (response.success && response.data) {
        setBlogs(response.data);
      } else {
        throw new Error(response.error || 'Failed to fetch blogs');
      }
    } catch (err: any) {
      console.error('Error fetching blogs:', err);

      // Retry logic for database connection issues
      if (retryCount < 2 && (
        err.message?.includes('Database connection') ||
        err.message?.includes('ECONNREFUSED') ||
        err.message?.includes('timeout')
      )) {
        console.log(`Retrying fetch blogs... Attempt ${retryCount + 1}`);
        setTimeout(() => fetchBlogs(retryCount + 1), 1000 * (retryCount + 1));
        return;
      }

      setError(err.message || 'Failed to fetch blogs. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [statusFilter, categoryFilter, searchTerm]);

  // Delete blog
  const handleDelete = async (blogId: string, title: string) => {
    try {
      const blog = blogs.find(b => b._id === blogId);
      if (!blog) return;

      const response = await blogsApi.delete(blog.slug);

      if (response.success) {
        toast.success('Blog post deleted successfully');

        // Log activity
        if (user) {
          await logActivity({
            type: 'blog',
            action: 'delete',
            title: `Deleted blog post: ${title}`,
            userId: user._id,
            userName: user.name,
            entityId: blogId,
            entityType: 'blog'
          });
        }

        // Refresh the list
        fetchBlogs();
      } else {
        toast.error(response.error || 'Failed to delete blog post');
      }
    } catch (error: any) {
      console.error('Error deleting blog:', error);
      toast.error('Failed to delete blog post');
    } finally {
      setConfirmDelete(null);
    }
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter blogs based on search term
  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Toaster position="top-right" expand={true} richColors />
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
            <p className="text-gray-600 mt-1">
              Manage your blog posts, create new content, and track performance.
            </p>
          </div>
          <Button asChild>
            <Link
              href="/cms-admin/dashboard/blogs/create"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Blog Post
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-label="Filter blogs by status"
              title="Filter blogs by status"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-label="Filter blogs by category"
              title="Filter blogs by category"
            >
              <option value="all">All Categories</option>
              <option value="Architecture">Architecture</option>
              <option value="Interior Design">Interior Design</option>
              <option value="Real Estate">Real Estate</option>
              <option value="Technology">Technology</option>
              <option value="Lifestyle">Lifestyle</option>
            </select>

            {/* Refresh Button */}
            <Button
              onClick={() => fetchBlogs()}
              variant="outline"
              loading={loading && !confirmDelete} // Only show loading if not confirming delete
            >
              <Filter className="w-4 h-4 mr-2 inline" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Blog List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {loading && !confirmDelete ? ( // Adjusted loading condition
            <div className="p-8 text-center">
              <Loader2 className="animate-spin h-8 w-8 text-blue-600 mx-auto" />
              <p className="text-gray-500 mt-2">Loading blogs...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-red-500">{error}</p>
              <Button
                onClick={() => fetchBlogs()}
                loading={loading}
              >
                Try Again
              </Button>
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No blog posts found.</p>
              <Button asChild>
                <Link
                  href="/cms-admin/dashboard/blogs/create"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Blog Post
                </Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Blog Post
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBlogs.map((blog) => (
                    <tr key={blog._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-start space-x-3">
                          {blog.imageUrl && (
                            <img
                              src={blog.imageUrl}
                              alt={blog.title}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          )}
                          <div>
                            <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
                              {blog.title}
                            </h3>
                            <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                              {blog.excerpt}
                            </p>
                            {blog.readingTime && (
                              <p className="text-xs text-gray-400 mt-1">
                                {blog.readingTime}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(blog.status)}`}>
                          {blog.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">{blog.category}</span>
                        {blog.tags && blog.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {blog.tags.slice(0, 2).map((tag, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded"
                              >
                                <Tag className="w-3 h-3 mr-1" />
                                {tag}
                              </span>
                            ))}
                            {blog.tags.length > 2 && (
                              <span className="text-xs text-gray-400">
                                +{blog.tags.length - 2} more
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <User className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">{blog.createdBy?.name || 'Unknown'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          <Calendar className="w-4 h-4 inline mr-1" />
                          {new Date(blog.createdAt).toLocaleDateString()}
                        </div>
                        {blog.publishDate && blog.status === 'scheduled' && (
                          <div className="text-xs text-blue-600 mt-1">
                            Scheduled: {new Date(blog.publishDate).toLocaleDateString()}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1">
                          <Button asChild variant="ghost" size="icon" title="View Blog">
                            <Link href={`/blogs/${blog.slug}`} target="_blank">
                              <Eye className="w-4 h-4" />
                            </Link>
                          </Button>
                          <Button asChild variant="ghost" size="icon" title="Edit Blog">
                            <Link href={`/cms-admin/dashboard/blogs/edit/${blog._id}`}>
                              <Edit className="w-4 h-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setConfirmDelete(blog._id)}
                            title="Delete Blog"
                            className="text-gray-400 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {confirmDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Confirm Delete
              </h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete this blog post? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setConfirmDelete(null)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    const blog = blogs.find(b => b._id === confirmDelete);
                    if (blog) {
                      handleDelete(confirmDelete, blog.title);
                    }
                  }}
                  loading={loading && !!confirmDelete} // Show loading on this button when delete is in progress
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
