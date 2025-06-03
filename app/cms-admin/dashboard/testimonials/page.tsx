'use client'

import React, { useState, useEffect } from 'react'
import { Toaster, toast } from 'sonner'
import { Plus, Search, Star, Edit, Trash2, Youtube, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react'
import { testimonialsApi } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { Testimonial } from '@/hooks/useTestimonials'

interface TestimonialFormData {
  name: string;
  designation: string;
  company: string;
  content: string;
  rating: number;
  image: string;
  youtubeUrl: string;
  projectId: string;
  isApproved: boolean;
  isFeatured: boolean;
}

export default function TestimonialsList() {
  const { user } = useAuth();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState<TestimonialFormData>({
    name: '',
    designation: '',
    company: '',
    content: '',
    rating: 5,
    image: '',
    youtubeUrl: '',
    projectId: '',
    isApproved: true,
    isFeatured: false
  });

  // Fetch testimonials from API
  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await testimonialsApi.getAll({
        limit: 100 // Get all testimonials for admin
      });

      if (response.success && response.data) {
        setTestimonials(response.data);
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
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      const response = await testimonialsApi.delete(id);
      if (response.success) {
        toast.success('Testimonial deleted successfully');
        fetchTestimonials(); // Refresh the list
      } else {
        toast.error(response.error || 'Failed to delete testimonial');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete testimonial');
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingTestimonial) {
        const response = await testimonialsApi.update(editingTestimonial._id, formData);
        if (response.success) {
          toast.success('Testimonial updated successfully');
          setShowForm(false);
          setEditingTestimonial(null);
          fetchTestimonials();
        } else {
          toast.error(response.error || 'Failed to update testimonial');
        }
      } else {
        const response = await testimonialsApi.create(formData);
        if (response.success) {
          toast.success('Testimonial created successfully');
          setShowForm(false);
          fetchTestimonials();
        } else {
          toast.error(response.error || 'Failed to create testimonial');
        }
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to save testimonial');
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      designation: testimonial.designation || '',
      company: testimonial.company || '',
      content: testimonial.content,
      rating: testimonial.rating,
      image: testimonial.image || '',
      youtubeUrl: testimonial.youtubeUrl || '',
      projectId: testimonial.projectId?._id || '',
      isApproved: testimonial.isApproved,
      isFeatured: testimonial.isFeatured
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      designation: '',
      company: '',
      content: '',
      rating: 5,
      image: '',
      youtubeUrl: '',
      projectId: '',
      isApproved: true,
      isFeatured: false
    });
    setEditingTestimonial(null);
    setShowForm(false);
  };

  const handleToggleApproval = async (id: string) => {
    try {
      const response = await testimonialsApi.approve(id);
      if (response.success) {
        toast.success('Testimonial approval status updated');
        fetchTestimonials();
      } else {
        toast.error(response.error || 'Failed to update approval status');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update approval status');
    }
  };

  const handleToggleFeatured = async (id: string) => {
    try {
      const response = await testimonialsApi.feature(id);
      if (response.success) {
        toast.success('Testimonial featured status updated');
        fetchTestimonials();
      } else {
        toast.error(response.error || 'Failed to update featured status');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update featured status');
    }
  };

  // Filter testimonials based on search
  const filteredTestimonials = testimonials.filter(testimonial =>
    testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    testimonial.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (testimonial.designation && testimonial.designation.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  return (
    <>
      <Toaster position="top-right" expand={true} richColors />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Testimonials</h1>
            <p className="text-gray-600">
              Manage client testimonials and reviews with YouTube video support
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Testimonial
          </button>
        </div>
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search testimonials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading testimonials...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
            <button
              type="button"
              onClick={fetchTestimonials}
              className="mt-2 text-red-600 hover:text-red-800 underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Testimonials Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTestimonials.length > 0 ? (
              filteredTestimonials.map((testimonial) => (
                <div
                  key={testimonial._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      {testimonial.image ? (
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full object-cover mr-4"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                          <span className="text-gray-600 font-medium">
                            {testimonial.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">
                          {testimonial.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {testimonial.designation}
                        </p>
                        {testimonial.company && (
                          <p className="text-xs text-gray-500">
                            {testimonial.company}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {testimonial.youtubeUrl && (
                        <Youtube className="w-4 h-4 text-red-600" title="Has YouTube video" />
                      )}
                      <button
                        type="button"
                        onClick={() => handleEdit(testimonial)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Edit testimonial"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(testimonial._id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete testimonial"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center mb-3">
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        className={`w-4 h-4 ${index < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>

                  <p className="text-gray-600 text-sm mb-3">{testimonial.content}</p>

                  {testimonial.youtubeUrl && (
                    <div className="mb-3">
                      <div className="bg-gray-100 rounded-lg p-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <Youtube className="w-4 h-4 mr-2 text-red-600" />
                          <span className="truncate">{testimonial.youtubeUrl}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>
                      Project: {testimonial.projectId?.title || 'None'}
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => handleToggleApproval(testimonial._id)}
                        className={`p-1 rounded ${testimonial.isApproved ? 'text-green-600' : 'text-gray-400'}`}
                        title={testimonial.isApproved ? 'Approved' : 'Not approved'}
                        aria-label={testimonial.isApproved ? 'Mark as not approved' : 'Mark as approved'}
                      >
                        {testimonial.isApproved ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(testimonial._id)}
                        className={`p-1 rounded ${testimonial.isFeatured ? 'text-blue-600' : 'text-gray-400'}`}
                        title={testimonial.isFeatured ? 'Featured' : 'Not featured'}
                        aria-label={testimonial.isFeatured ? 'Remove from featured' : 'Mark as featured'}
                      >
                        {testimonial.isFeatured ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600">No testimonials found.</p>
              </div>
            )}
          </div>
        )}

        {/* Add/Edit Testimonial Modal */}
        {showForm && (
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="testimonial-name" className="block text-sm font-medium text-gray-700 mb-1">
                        Name *
                      </label>
                      <input
                        id="testimonial-name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter client name"
                      />
                    </div>

                    <div>
                      <label htmlFor="testimonial-designation" className="block text-sm font-medium text-gray-700 mb-1">
                        Designation
                      </label>
                      <input
                        id="testimonial-designation"
                        type="text"
                        value={formData.designation}
                        onChange={(e) => setFormData({...formData, designation: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., CEO, Manager"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="testimonial-company" className="block text-sm font-medium text-gray-700 mb-1">
                        Company
                      </label>
                      <input
                        id="testimonial-company"
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({...formData, company: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Company name"
                      />
                    </div>

                    <div>
                      <label htmlFor="testimonial-rating" className="block text-sm font-medium text-gray-700 mb-1">
                        Rating *
                      </label>
                      <select
                        id="testimonial-rating"
                        required
                        value={formData.rating}
                        onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        title="Select rating"
                      >
                        {[1, 2, 3, 4, 5].map(rating => (
                          <option key={rating} value={rating}>{rating} Star{rating > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="testimonial-content" className="block text-sm font-medium text-gray-700 mb-1">
                      Testimonial Content *
                    </label>
                    <textarea
                      id="testimonial-content"
                      required
                      rows={4}
                      value={formData.content}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter the testimonial content..."
                    />
                  </div>

                  <div>
                    <label htmlFor="testimonial-youtube" className="block text-sm font-medium text-gray-700 mb-1">
                      YouTube Video URL
                    </label>
                    <input
                      id="testimonial-youtube"
                      type="url"
                      value={formData.youtubeUrl}
                      onChange={(e) => setFormData({...formData, youtubeUrl: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://youtu.be/VIDEO_ID or https://youtube.com/watch?v=VIDEO_ID"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter a YouTube URL to display a video testimonial
                    </p>
                  </div>

                  <div>
                    <label htmlFor="testimonial-image" className="block text-sm font-medium text-gray-700 mb-1">
                      Profile Image URL
                    </label>
                    <input
                      id="testimonial-image"
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.isApproved}
                        onChange={(e) => setFormData({...formData, isApproved: e.target.checked})}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Approved</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.isFeatured}
                        onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Featured</span>
                    </label>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {editingTestimonial ? 'Update' : 'Create'} Testimonial
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
