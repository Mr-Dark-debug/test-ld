'use client'

import React, { useState, useEffect } from 'react'
import { X, Loader2, Save } from 'lucide-react'
import { toast } from 'sonner'
import { IconSelector } from './IconSelector'
import { useAuth } from '@/contexts/AuthContext'
import { amenitiesApi } from '@/lib/api'
import { logActivity } from '@/lib/activity'

interface AddEditAmenityFormProps {
  amenityId?: string
  onClose: (refreshData?: boolean) => void
}

export function AddEditAmenityForm({ amenityId, onClose }: AddEditAmenityFormProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(!!amenityId)
  
  // Form state
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('Home')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [customCategory, setCustomCategory] = useState('')
  const [useCustomCategory, setUseCustomCategory] = useState(false)
  
  // Common categories
  const commonCategories = [
    'Recreation',
    'Security',
    'Technology',
    'Facility',
    'Dining',
    'Convenience',
    'Wellness',
    'Community'
  ]
  
  // Load amenity data if editing
  useEffect(() => {
    if (!amenityId) {
      setInitialLoading(false)
      return
    }
    
    const fetchAmenity = async () => {
      try {
        setInitialLoading(true)
        const response = await amenitiesApi.getById(amenityId)
        
        if (response.success && response.data) {
          const amenity = response.data
          setName(amenity.name)
          setIcon(amenity.icon)
          
          // Check if category is in common categories
          if (commonCategories.includes(amenity.category)) {
            setCategory(amenity.category)
            setUseCustomCategory(false)
          } else {
            setCustomCategory(amenity.category)
            setUseCustomCategory(true)
          }
          
          setDescription(amenity.description || '')
        } else {
          toast.error('Failed to load amenity data')
          onClose()
        }
      } catch (error) {
        console.error('Error loading amenity:', error)
        toast.error('Failed to load amenity data')
        onClose()
      } finally {
        setInitialLoading(false)
      }
    }
    
    fetchAmenity()
  }, [amenityId, onClose])
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    if (!name.trim()) {
      toast.error('Name is required')
      return
    }
    
    if (!icon) {
      toast.error('Icon is required')
      return
    }
    
    const finalCategory = useCustomCategory ? customCategory.trim() : category
    if (!finalCategory) {
      toast.error('Category is required')
      return
    }
    
    try {
      setLoading(true)
      
      const amenityData = {
        name: name.trim(),
        icon,
        category: finalCategory,
        description: description.trim() || undefined
      }
      
      let response
      if (amenityId) {
        // Update existing amenity
        response = await amenitiesApi.update(amenityId, amenityData)
      } else {
        // Create new amenity
        response = await amenitiesApi.create(amenityData)
      }
      
      if (response.success) {
        // Log activity
        if (user) {
          await logActivity({
            type: 'amenity',
            action: amenityId ? 'update' : 'create',
            title: `Amenity "${name}" ${amenityId ? 'updated' : 'created'}`,
            userId: user._id,
            userName: user.name,
            entityId: response.data._id,
            entityType: 'Amenity'
          })
        }
        
        toast.success(`Amenity ${amenityId ? 'updated' : 'created'} successfully`)
        onClose(true)
      } else {
        toast.error(response.error || `Failed to ${amenityId ? 'update' : 'create'} amenity`)
      }
    } catch (error) {
      console.error(`Error ${amenityId ? 'updating' : 'creating'} amenity:`, error)
      toast.error(`An error occurred while ${amenityId ? 'updating' : 'creating'} the amenity`)
    } finally {
      setLoading(false)
    }
  }
  
  if (initialLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-700">Loading amenity data...</span>
        </div>
      </div>
    )
  }
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {amenityId ? 'Edit Amenity' : 'Add New Amenity'}
        </h2>
        <button
          type="button"
          onClick={() => onClose()}
          className="text-gray-400 hover:text-gray-500"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Swimming Pool"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
            required
          />
        </div>
        
        {/* Icon */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Icon <span className="text-red-500">*</span>
          </label>
          <IconSelector
            value={icon}
            onChange={setIcon}
            className="w-full"
          />
        </div>
        
        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          
          <div className="space-y-2">
            {/* Predefined categories */}
            <div className={`${useCustomCategory ? 'opacity-50' : ''}`}>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={useCustomCategory || loading}
              >
                <option value="">Select a category</option>
                {commonCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Custom category toggle */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="useCustomCategory"
                checked={useCustomCategory}
                onChange={() => setUseCustomCategory(!useCustomCategory)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                disabled={loading}
              />
              <label htmlFor="useCustomCategory" className="ml-2 block text-sm text-gray-700">
                Use custom category
              </label>
            </div>
            
            {/* Custom category input */}
            {useCustomCategory && (
              <input
                type="text"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="Enter custom category"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              />
            )}
          </div>
        </div>
        
        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-gray-400">(optional)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of the amenity"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
            disabled={loading}
          />
        </div>
        
        {/* Form actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={() => onClose()}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {amenityId ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {amenityId ? 'Update Amenity' : 'Create Amenity'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
} 