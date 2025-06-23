'use client'

import React, { useState, useEffect } from 'react'
import { Toaster, toast } from 'sonner'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Settings,
  Loader2,
  RefreshCw,
} from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { amenitiesApi } from '@/lib/api'
import { logActivity } from '@/lib/activity'
import { AddEditAmenityForm } from '../../components/AddEditAmenityForm'
import { Button } from '@/components/ui/Button' // Import Button component

// Amenity interface
interface Amenity {
  _id: string;
  name: string;
  icon: string;
  category: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AmenitiesList() {
  const { user } = useAuth()
  const [amenities, setAmenities] = useState<Amenity[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingAmenityId, setEditingAmenityId] = useState<string | null>(null)
  const [categories, setCategories] = useState<string[]>([])
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  
  // Fetch amenities and categories
  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch all amenities
      const response = await amenitiesApi.getAll()
      
      if (response.success && response.data) {
        setAmenities(response.data)
        
        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(response.data.map((item: Amenity) => item.category))
        ).sort()
        
        setCategories(uniqueCategories)
      } else {
        toast.error('Failed to load amenities')
      }
    } catch (error) {
      console.error('Error fetching amenities:', error)
      toast.error('Failed to load amenities data')
    } finally {
      setLoading(false)
    }
  }
  
  // Initial data load
  useEffect(() => {
    fetchData()
  }, [])
  
  // Filter amenities based on search and category
  const filteredAmenities = amenities.filter((amenity) => {
    const matchesSearch = amenity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      amenity.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (amenity.description && amenity.description.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = selectedCategoryFilter === 'all' || amenity.category === selectedCategoryFilter
    
    return matchesSearch && matchesCategory
  })
  
  // Handle delete amenity
  const handleDelete = async (id: string) => {
    try {
      const amenity = amenities.find(a => a._id === id)
      if (!amenity) return
      
      // Confirm delete
      if (confirmDelete !== id) {
        setConfirmDelete(id)
        return
      }
      
      setLoading(true)
      const response = await amenitiesApi.delete(id)
      
      if (response.success) {
        // Log activity
        if (user) {
          await logActivity({
            type: 'amenity',
            action: 'delete',
            title: `Amenity "${amenity.name}" deleted`,
            userId: user._id,
            userName: user.name,
            entityId: id,
            entityType: 'Amenity'
          })
        }
        
        toast.success('Amenity deleted successfully')
        setAmenities(amenities.filter(a => a._id !== id))
      } else {
        toast.error(response.error || 'Failed to delete amenity')
      }
    } catch (error) {
      console.error('Error deleting amenity:', error)
      toast.error('An error occurred while deleting the amenity')
    } finally {
      setLoading(false)
      setConfirmDelete(null)
    }
  }
  
  // Handle form close
  const handleFormClose = (refreshData: boolean = false) => {
    setShowAddForm(false)
    setEditingAmenityId(null)
    
    if (refreshData) {
      fetchData()
    }
  }
  
  // Function to render icon
  const renderIcon = (iconName: string) => {
    // Default to Settings icon if the icon doesn't exist
    const IconComponent = (LucideIcons[iconName as keyof typeof LucideIcons] || LucideIcons.Settings) as React.FC<{ className?: string }>
    return <IconComponent className="w-6 h-6 text-blue-600" />
  }
  
  return (
    <>
      <Toaster position="top-right" expand={true} richColors />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Amenities</h1>
            <p className="text-gray-600">Manage property amenities</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={fetchData}
              variant="outline"
              loading={loading}
              disabled={loading} // Keep disabled prop for clarity, Button handles loading internally
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading && !showAddForm && !editingAmenityId ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              onClick={() => setShowAddForm(true)}
              disabled={loading} // Keep disabled prop
              loading={loading && (showAddForm || !!editingAmenityId)} // Show loading if form is opening due to this button
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Amenity
            </Button>
          </div>
        </div>
        
        {/* Add/Edit Form */}
        {(showAddForm || editingAmenityId) && (
          <AddEditAmenityForm 
            amenityId={editingAmenityId || undefined} 
            onClose={handleFormClose} 
          />
        )}
        
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search amenities..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="sm:w-48">
              <select
                value={selectedCategoryFilter}
                onChange={e => setSelectedCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mr-3" />
            <span className="text-gray-600">Loading amenities...</span>
          </div>
        )}
        
        {/* Empty State */}
        {!loading && filteredAmenities.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No amenities found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || selectedCategoryFilter !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Get started by adding your first amenity'}
            </p>
            {!searchQuery && selectedCategoryFilter === 'all' && (
              <Button
                onClick={() => setShowAddForm(true)}
                // Loading state for this button can be tricky,
                // as `loading` might be true for initial page load.
                // We might not need a spinner here if the action is quick (just opening a form).
                // Or, tie it to a specific state if opening the form involves async work.
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Amenity
              </Button>
            )}
          </div>
        )}
        
        {/* Amenities Grid */}
        {!loading && filteredAmenities.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredAmenities.map((amenity) => (
              <div
                key={amenity._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                    {renderIcon(amenity.icon)}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingAmenityId(amenity._id)}
                      className="p-1 text-gray-400 hover:text-blue-600"
                      aria-label={`Edit ${amenity.name}`}
                      // Loading state for edit can be added if opening edit form has async operations
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(amenity._id)}
                      loading={loading && confirmDelete === amenity._id} // Show loader when this specific delete is in progress
                      className={`p-1 ${
                        confirmDelete === amenity._id 
                          ? 'text-red-600 animate-pulse' 
                          : 'text-gray-400 hover:text-red-600'
                      }`}
                      aria-label={confirmDelete === amenity._id 
                        ? `Confirm delete ${amenity.name}` 
                        : `Delete ${amenity.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {amenity.name}
                </h3>
                <p className="text-sm text-gray-600">{amenity.category}</p>
                {amenity.description && (
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                    {amenity.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
