'use client'

import React, { useState, useEffect } from 'react'
import { Toaster, toast } from 'sonner'
import { Plus, Search, Filter, Edit, Eye, Trash2, DownloadCloud, Star, Loader2 } from 'lucide-react'
import { AddEditProjectForm } from '@/app/cms-admin/components/AddEditProjectForm'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useProjects } from '@/hooks/useProjects'
import { projectsApi } from '@/lib/api'

export default function ProjectsList() {
  const router = useRouter();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editProjectId, setEditProjectId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [loadingStates, setLoadingStates] = useState({
    featured: {},
    delete: {}
  });

  // Use the real projects API
  const {
    projects,
    loading,
    error,
    refetch
  } = useProjects({
    type: categoryFilter !== 'all' ? categoryFilter as any : undefined,
    status: statusFilter !== 'all' ? statusFilter as any : undefined,
    search: searchTerm || undefined,
    limit: 100 // Get all projects for admin
  });

  // Filtering is now handled by the API, so we use projects directly
  const filteredProjects = projects;

  // Handle delete confirmation
  const handleDelete = async (id) => {
    if (confirmDelete === id) {
      // Set loading state
      setLoadingStates(prev => ({
        ...prev,
        delete: { ...prev.delete, [id]: true }
      }));

      try {
        const response = await projectsApi.delete(id);
        if (response.success) {
          toast.success('Project deleted successfully');
          refetch(); // Refresh the data
        } else {
          toast.error(response.error || 'Failed to delete project');
        }
      } catch (error) {
        console.error('Error deleting project:', error);
        toast.error('Failed to delete project');
      } finally {
        // Clear loading state
        setLoadingStates(prev => ({
          ...prev,
          delete: { ...prev.delete, [id]: false }
        }));
        setConfirmDelete(null);
      }
    } else {
      setConfirmDelete(id);
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  // Handle featured toggle
  const handleToggleFeatured = async (id, currentFeatured) => {
    // Set loading state
    setLoadingStates(prev => ({
      ...prev,
      featured: { ...prev.featured, [id]: true }
    }));

    try {
      console.log('Toggling featured status for project:', id, 'from', currentFeatured, 'to', !currentFeatured);

      const response = await projectsApi.updateFeatured(id, !currentFeatured);
      console.log('Featured toggle response:', response);

      if (response.success) {
        toast.success(`Project ${!currentFeatured ? 'added to' : 'removed from'} featured`);
        refetch(); // Refresh the data to show updated status
      } else {
        toast.error(response.error || 'Failed to update project');
      }
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error('Failed to update project');
    } finally {
      // Clear loading state
      setLoadingStates(prev => ({
        ...prev,
        featured: { ...prev.featured, [id]: false }
      }));
    }
  };

  // Handle form close/submit
  const handleFormClose = (refreshData = false) => {
    setShowAddForm(false);
    setEditProjectId(null);

    if (refreshData) {
      refetch(); // Refresh the data from API
    }
  };

  // Handle edit project
  const handleEdit = (id) => {
    setEditProjectId(id);
    setShowAddForm(true);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'ongoing':
        return 'bg-blue-100 text-blue-800';
      case 'upcoming':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get category color
  const getCategoryColor = (category) => {
    if (!category) return 'bg-gray-100 text-gray-800';
    switch (category.toLowerCase()) {
      case 'residential':
        return 'bg-purple-100 text-purple-800';
      case 'commercial':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setStatusFilter('all');
  };

  return (
    <>
      <Toaster position="top-right" expand={true} richColors />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
            <p className="text-gray-600">Manage your real estate projects</p>
          </div>
          <button
            onClick={() => {
              setEditProjectId(null);
              setShowAddForm(true);
            }}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Project
          </button>
        </div>

        {/* Conditionally render the AddEditProjectForm or the projects list/filters */}
        {showAddForm ? (
          <AddEditProjectForm
            projectId={editProjectId}
            onClose={() => handleFormClose(true)}
          />
        ) : (
          <>
            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search projects by name or RERA number..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <select
                    title="Filter by category"
                    aria-label="Filter projects by category"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Categories</option>
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                  </select>
                  <select
                    title="Filter by status"
                    aria-label="Filter projects by status"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="upcoming">Upcoming</option>
                  </select>
                  <button
                    type="button"
                    title="Reset filters"
                    aria-label="Reset all filters"
                    onClick={resetFilters}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Filter className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Projects Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {loading ? (
                <div className="p-8 text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600">Loading projects...</p>
                  <p className="text-sm text-gray-500 mt-2">This may take a few seconds...</p>
                </div>
              ) : error ? (
                <div className="p-8 text-center">
                  <p className="text-red-600 mb-4">Error loading projects: {error}</p>
                  <button
                    type="button"
                    onClick={() => refetch()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : filteredProjects.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-600 mb-4">No projects found matching your criteria.</p>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Project
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Featured
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          RERA
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredProjects.map((project) => (
                        <tr key={project._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <img
                                src={project.coverImage || project.images?.coverImage || project.images?.gallery?.promotional?.[0] || '/images/placeholder-project.jpg'}
                                alt={project.title}
                                className="w-10 h-10 rounded-lg object-cover mr-3"
                                onError={(e) => {
                                  e.currentTarget.src = '/images/placeholder-project.jpg';
                                }}
                              />
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {project.title}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {project.location?.address || 'No location specified'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(project.type || project.category)}`}
                            >
                              {(project.type || project.category || 'Unknown').charAt(0).toUpperCase() + (project.type || project.category || 'Unknown').slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}
                            >
                              {(project.status || 'Unknown').charAt(0).toUpperCase() + (project.status || 'Unknown').slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => handleToggleFeatured(project._id, project.featured)}
                              disabled={loadingStates.featured[project._id]}
                              className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full transition-colors ${
                                project.featured
                                  ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              } ${loadingStates.featured[project._id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              {loadingStates.featured[project._id] ? (
                                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                              ) : (
                                <Star className={`w-3 h-3 mr-1 ${project.featured ? 'fill-current' : ''}`} />
                              )}
                              {loadingStates.featured[project._id]
                                ? 'Updating...'
                                : project.featured ? 'Featured' : 'Not Featured'
                              }
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">
                              {project.reraNumber || 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">
                              {formatDate(project.createdAt)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <Link href={`/projects/${project.slug}`} target="_blank">
                                <button type="button" className="p-1 text-gray-400 hover:text-blue-600 transition-colors" title="View Project">
                                  <Eye className="w-4 h-4" />
                                </button>
                              </Link>
                              <button
                                type="button"
                                onClick={() => handleEdit(project._id)}
                                className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                                title="Edit Project"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(project._id)}
                                disabled={loadingStates.delete[project._id]}
                                className={`p-1 ${
                                  loadingStates.delete[project._id]
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : confirmDelete === project._id
                                      ? 'text-red-600'
                                      : 'text-gray-400 hover:text-red-600'
                                } transition-colors`}
                                title={loadingStates.delete[project._id] ? 'Deleting...' : 'Delete Project'}
                              >
                                {loadingStates.delete[project._id] ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </button>
                              {project.brochureUrl && (
                                <a
                                  href={project.brochureUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                                  title="Download Brochure"
                                >
                                  <DownloadCloud className="w-4 h-4" />
                                </a>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  )
}
