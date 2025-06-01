'use client'

import React, { useState, useEffect } from 'react'
import { Check, Search, X } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import { amenitiesApi } from '@/lib/api'

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
        <h3 className="text-lg font-medium text-gray-900 mb-3">Select Amenities</h3>
        
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
    </div>
  );
}
