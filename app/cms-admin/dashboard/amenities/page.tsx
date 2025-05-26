'use client'

import React, { useState } from 'react'
import { Toaster } from 'sonner'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Wifi,
  Car,
  Dumbbell,
  Coffee,
  LucideIcon,
} from 'lucide-react'
import { notify } from '../../components/Notification'

type AmenityIcon = 'wifi' | 'parking' | 'pool' | 'gym' | 'cafe'

const amenityIcons: Record<AmenityIcon, LucideIcon> = {
  wifi: Wifi,
  parking: Car,
  pool: Dumbbell, // Using Dumbbell as a placeholder for pool
  gym: Dumbbell,
  cafe: Coffee,
}

export default function AmenitiesList() {
  const [amenities] = useState([
    {
      id: 1,
      name: 'Wi-Fi',
      icon: 'wifi' as AmenityIcon,
      category: 'Technology',
    },
    {
      id: 2,
      name: 'Parking',
      icon: 'parking' as AmenityIcon,
      category: 'Facility',
    },
    {
      id: 3,
      name: 'Swimming Pool',
      icon: 'pool' as AmenityIcon,
      category: 'Recreation',
    },
    {
      id: 4,
      name: 'Gym',
      icon: 'gym' as AmenityIcon,
      category: 'Recreation',
    },
    {
      id: 5,
      name: 'Café',
      icon: 'cafe' as AmenityIcon,
      category: 'Dining',
    },
  ])
  
  const handleDelete = (id: number) => {
    notify.success('Amenity deleted successfully')
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
          <button
            onClick={() => notify.info('Add amenity form will be implemented')}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Amenity
          </button>
        </div>
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search amenities..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        {/* Amenities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {amenities.map((amenity) => {
            const IconComponent = amenityIcons[amenity.icon]
            return (
              <div
                key={amenity.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                    <IconComponent className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        notify.info('Edit functionality will be implemented')
                      }
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(amenity.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {amenity.name}
                </h3>
                <p className="text-sm text-gray-600">{amenity.category}</p>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
