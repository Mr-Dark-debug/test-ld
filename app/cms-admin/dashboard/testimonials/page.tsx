'use client'

import React, { useState } from 'react'
import { Toaster } from 'sonner'
import { Plus, Search, Star, Edit, Trash2 } from 'lucide-react'
import { notify } from '../../components/Notification'

export default function TestimonialsList() {
  const [testimonials] = useState([
    {
      id: 1,
      clientName: 'John Smith',
      designation: 'Property Buyer',
      rating: 5,
      content:
        'Excellent service and amazing properties. The team was very professional.',
      type: 'text',
      project: 'Skyline Towers',
      image:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop',
    },
    {
      id: 2,
      clientName: 'Sarah Johnson',
      designation: 'Investor',
      rating: 4,
      content:
        'Great experience working with the team. Very responsive and professional.',
      type: 'text',
      project: 'Green Valley',
      image:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop',
    },
  ])
  
  const handleDelete = (id: number) => {
    notify.success('Testimonial deleted successfully')
  }
  
  return (
    <>
      <Toaster position="top-right" expand={true} richColors />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Testimonials</h1>
            <p className="text-gray-600">
              Manage client testimonials and reviews
            </p>
          </div>
          <button
            onClick={() =>
              notify.info('Add testimonial form will be implemented')
            }
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
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.clientName}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      {testimonial.clientName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {testimonial.designation}
                    </p>
                  </div>
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
                    onClick={() => handleDelete(testimonial.id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
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
              <div className="text-xs text-gray-500">
                Project: {testimonial.project}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
