'use client'

import React, { useState, useEffect } from 'react'
import { Check, Search, X, Plus } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import { amenitiesApi } from '@/lib/api'

// Extract all icons from Lucide
const iconNames = Object.keys(LucideIcons).filter(
  key => typeof LucideIcons[key as keyof typeof LucideIcons] === 'function' && key !== 'createLucideIcon'
)

interface Amenity {
  _id: string;
  name: string;
  icon: string;
  category: string;
  description?: string;
  isActive: boolean;
}

interface AmenitySelectorProps {
  selectedAmenities: string[];
  onSelectionChange: (amenityIds: string[]) => void;
  className?: string;
}

export function AmenitySelector({ selectedAmenities, onSelectionChange, className = '' }: AmenitySelectorProps) {
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState<string[]>([]);
  
  // New amenity modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAmenity, setNewAmenity] = useState({
    name: '',
    icon: 'Home',
    category: '',
    description: '',
  });
  const [iconSearchQuery, setIconSearchQuery] = useState('');
  const [showIconSelector, setShowIconSelector] = useState(false);

  // Filtered icons based on search query
  const filteredIcons = iconNames.filter(name =>
    name.toLowerCase().includes(iconSearchQuery.toLowerCase())
  );

  // Fetch amenities
  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        setLoading(true);
        const response = await amenitiesApi.getAll();
        
        if (response.success && response.data) {
          const activeAmenities = response.data.filter((amenity: Amenity) => amenity.isActive);
          setAmenities(activeAmenities);
          
          // Extract unique categories
          const uniqueCategories = Array.from(
            new Set(activeAmenities.map((amenity: Amenity) => amenity.category))
          ).sort();
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error('Error fetching amenities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAmenities();
  }, []);

  // Filter amenities
  const filteredAmenities = amenities.filter((amenity) => {
    const matchesSearch = amenity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      amenity.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || amenity.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Group amenities by category
  const groupedAmenities = filteredAmenities.reduce((acc, amenity) => {
    if (!acc[amenity.category]) {
      acc[amenity.category] = [];
    }
    acc[amenity.category].push(amenity);
    return acc;
  }, {} as Record<string, Amenity[]>);

  // Handle amenity selection
  const handleAmenityToggle = (amenityId: string) => {
    const isSelected = selectedAmenities.includes(amenityId);
    
    if (isSelected) {
      onSelectionChange(selectedAmenities.filter(id => id !== amenityId));
    } else {
      onSelectionChange([...selectedAmenities, amenityId]);
    }
  };

  // Render icon
  const renderIcon = (iconName: string) => {
    const IconComponent = (LucideIcons[iconName as keyof typeof LucideIcons] || LucideIcons.Settings) as React.FC<{ className?: string }>;
    return <IconComponent className="w-5 h-5" />;
  };

  // Handle new amenity submission
  const handleSubmitNewAmenity = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newAmenity.name || !newAmenity.icon || !newAmenity.category) {
      alert('Please fill all required fields');
      return;
    }
    
    try {
      const response = await amenitiesApi.create({
        name: newAmenity.name,
        icon: newAmenity.icon,
        category: newAmenity.category.toLowerCase(),
        description: newAmenity.description,
        isActive: true
      });
      
      if (response.success && response.data) {
        // Add new amenity to the list
        setAmenities([...amenities, response.data]);
        
        // Add category if it's new
        if (!categories.includes(response.data.category)) {
          setCategories([...categories, response.data.category].sort());
        }
        
        // Reset form and close modal
        setNewAmenity({
          name: '',
          icon: 'Home',
          category: '',
          description: '',
        });
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Error creating amenity:', error);
      alert('Failed to create amenity');
    }
  };

  // Handle icon selection
  const handleSelectIcon = (iconName: string) => {
    setNewAmenity({ ...newAmenity, icon: iconName });
    setShowIconSelector(false);
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium text-gray-900">Select Amenities</h3>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add New
          </button>
        </div>
        
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search amenities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Selected Count */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-600">
            {selectedAmenities.length} amenities selected
          </span>
          {selectedAmenities.length > 0 && (
            <button
              onClick={() => onSelectionChange([])}
              className="text-sm text-red-600 hover:text-red-700 flex items-center"
            >
              <X className="w-3 h-3 mr-1" />
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Amenities Grid */}
      <div className="max-h-96 overflow-y-auto">
        {Object.keys(groupedAmenities).length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No amenities found matching your criteria
          </div>
        ) : (
          Object.entries(groupedAmenities).map(([category, categoryAmenities]) => (
            <div key={category} className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3 uppercase tracking-wide">
                {category}
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {categoryAmenities.map((amenity) => {
                  const isSelected = selectedAmenities.includes(amenity._id);
                  
                  return (
                    <button
                      key={amenity._id}
                      onClick={() => handleAmenityToggle(amenity._id)}
                      className={`relative p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <div className={`flex-shrink-0 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`}>
                          {renderIcon(amenity.icon)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">
                            {amenity.name}
                          </div>
                        </div>
                      </div>
                      
                      {/* Selection indicator */}
                      {isSelected && (
                        <div className="absolute top-1 right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add New Amenity Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      Add New Amenity
                    </h3>
                    <form onSubmit={handleSubmitNewAmenity}>
                      <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          value={newAmenity.name}
                          onChange={(e) => setNewAmenity({ ...newAmenity, name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                          Category *
                        </label>
                        <input
                          type="text"
                          id="category"
                          value={newAmenity.category}
                          onChange={(e) => setNewAmenity({ ...newAmenity, category: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          required
                          list="categories"
                        />
                        <datalist id="categories">
                          {categories.map(category => (
                            <option key={category} value={category} />
                          ))}
                        </datalist>
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="icon" className="block text-sm font-medium text-gray-700 mb-1">
                          Icon *
                        </label>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setShowIconSelector(!showIconSelector)}
                            className="w-full flex items-center justify-between border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          >
                            <div className="flex items-center">
                              {renderIcon(newAmenity.icon)}
                              <span className="ml-2">{newAmenity.icon}</span>
                            </div>
                            <span className="text-gray-400">{showIconSelector ? '▲' : '▼'}</span>
                          </button>
                          
                          {showIconSelector && (
                            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                              <div className="p-2 border-b border-gray-200">
                                <div className="relative">
                                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                  <input
                                    type="text"
                                    placeholder="Search icons..."
                                    value={iconSearchQuery}
                                    onChange={(e) => setIconSearchQuery(e.target.value)}
                                    className="w-full pl-8 pr-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                  />
                                </div>
                              </div>
                              
                              <div className="max-h-60 overflow-y-auto p-2">
                                {filteredIcons.length === 0 ? (
                                  <div className="py-4 text-center text-gray-500 text-sm">No icons found</div>
                                ) : (
                                  <div className="grid grid-cols-4 gap-2">
                                    {filteredIcons.map((iconName) => {
                                      const isSelected = iconName === newAmenity.icon;
                                      
                                      return (
                                        <button
                                          key={iconName}
                                          type="button"
                                          onClick={() => handleSelectIcon(iconName)}
                                          className={`flex flex-col items-center justify-center p-2 rounded-md hover:bg-gray-100 ${
                                            isSelected ? 'bg-blue-50 text-blue-600 border border-blue-200' : ''
                                          }`}
                                        >
                                          {renderIcon(iconName)}
                                          <span className="text-xs truncate w-full text-center mt-1">{iconName}</span>
                                        </button>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          id="description"
                          value={newAmenity.description}
                          onChange={(e) => setNewAmenity({ ...newAmenity, description: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          rows={3}
                        ></textarea>
                      </div>
                      
                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                          type="submit"
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                          Add Amenity
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsModalOpen(false)}
                          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
