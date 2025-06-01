'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  Download,
  Star,
  Building,
  Calendar,
  Home,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Project {
  _id: string;
  title: string;
  slug: string;
  type: 'residential' | 'commercial';
  status: 'ongoing' | 'completed' | 'upcoming';
  description: string;
  location: {
    address: string;
    city: string;
    state: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  images: {
    coverImage?: string;
    gallery: {
      promotional: string[];
      exterior: string[];
      interior: string[];
      videos: string[];
    };
  };
  specifications: {
    totalUnits: string;
    unitTypes: string;
    unitArea: string;
    possession: string;
    structure: string;
    flooring: string;
  };
  amenities: Array<{
    _id: string;
    name: string;
    icon: string;
    category: string;
    description?: string;
  }>;
  reraNumber: string;
  reraQrImage?: string;
  brochureUrl?: string;
  contactSales: string;
  floorPlans: {
    '1bhk': string[];
    '2bhk': string[];
    '3bhk': string[];
    '4bhk': string[];
    '5bhk': string[];
  };
  featured: boolean;
  seoMeta?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  createdAt: string;
  updatedAt: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
}

interface ProjectDetailClientProps {
  project: Project;
}

export default function ProjectDetailClient({ project }: ProjectDetailClientProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Combine all images for gallery
  const allImages = [
    ...(project.images.coverImage ? [project.images.coverImage] : []),
    ...project.images.gallery.promotional,
    ...project.images.gallery.exterior,
    ...project.images.gallery.interior
  ].filter(Boolean);

  const getStatusColor = (status: string) => {
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

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'residential':
        return 'bg-purple-100 text-purple-800';
      case 'commercial':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-gray-900">
        <Image
          src={project.images.coverImage || allImages[0] || '/images/placeholder-project.jpg'}
          alt={project.title}
          fill
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <div className="flex items-center gap-4 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(project.type)}`}>
                {project.type.charAt(0).toUpperCase() + project.type.slice(1)}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
              </span>
              {project.featured && (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" />
                  Featured
                </span>
              )}
            </div>

            <h1 className="text-4xl font-bold text-white mb-2">{project.title}</h1>
            <div className="flex items-center text-white/90 mb-4">
              <MapPin className="w-5 h-5 mr-2" />
              <span>{project.location.address}, {project.location.city}, {project.location.state}</span>
            </div>

            <div className="flex gap-4">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Phone className="w-4 h-4 mr-2" />
                Contact Sales
              </Button>
              {project.brochureUrl && (
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
                  <Download className="w-4 h-4 mr-2" />
                  Download Brochure
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Navigation Tabs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
              <div className="flex border-b border-gray-200">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'specifications', label: 'Specifications' },
                  { id: 'amenities', label: 'Amenities' },
                  { id: 'gallery', label: 'Gallery' },
                  { id: 'floor-plans', label: 'Floor Plans' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">About {project.title}</h2>
                    <p className="text-gray-600 leading-relaxed">{project.description}</p>
                  </div>
                )}

                {activeTab === 'specifications' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Specifications</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(project.specifications).map(([key, value]) => (
                        <div key={key} className="bg-gray-50 p-4 rounded-lg">
                          <div className="text-sm text-gray-500 mb-1">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </div>
                          <div className="font-medium">{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'amenities' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Amenities</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {project.amenities.map((amenity) => (
                        <div key={amenity._id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-blue-600 text-sm">{amenity.icon}</span>
                          </div>
                          <span className="font-medium">{amenity.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'gallery' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Gallery</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {allImages.map((image, index) => (
                        <div
                          key={index}
                          className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => {
                            setSelectedImageIndex(index);
                            setShowImageModal(true);
                          }}
                        >
                          <Image
                            src={image}
                            alt={`${project.title} - Image ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'floor-plans' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Floor Plans</h2>
                    <div className="space-y-6">
                      {Object.entries(project.floorPlans).map(([type, plans]) => (
                        plans.length > 0 && (
                          <div key={type}>
                            <h3 className="text-lg font-semibold mb-3 capitalize">{type} Floor Plans</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {plans.map((plan, index) => (
                                <div key={index} className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden">
                                  <Image
                                    src={plan}
                                    alt={`${type} Floor Plan ${index + 1}`}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-gray-400 mr-3" />
                  <span>{project.contactSales}</span>
                </div>
                <div className="flex items-center">
                  <Building className="w-5 h-5 text-gray-400 mr-3" />
                  <span>RERA: {project.reraNumber}</span>
                </div>
              </div>
            </div>

            {/* Quick Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Units</span>
                  <span className="font-medium">{project.specifications.totalUnits}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Unit Types</span>
                  <span className="font-medium">{project.specifications.unitTypes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Unit Area</span>
                  <span className="font-medium">{project.specifications.unitArea}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Possession</span>
                  <span className="font-medium">{project.specifications.possession}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="relative max-w-4xl max-h-full p-4">
            <button
              type="button"
              title="Close image modal"
              aria-label="Close image modal"
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="relative">
              <Image
                src={allImages[selectedImageIndex]}
                alt={`${project.title} - Image ${selectedImageIndex + 1}`}
                width={800}
                height={600}
                className="max-w-full max-h-[80vh] object-contain"
              />

              {allImages.length > 1 && (
                <>
                  <button
                    type="button"
                    title="Previous image"
                    aria-label="View previous image"
                    onClick={() => setSelectedImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length)}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                  >
                    <ChevronLeft className="w-8 h-8" />
                  </button>
                  <button
                    type="button"
                    title="Next image"
                    aria-label="View next image"
                    onClick={() => setSelectedImageIndex((prev) => (prev + 1) % allImages.length)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                  >
                    <ChevronRight className="w-8 h-8" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
