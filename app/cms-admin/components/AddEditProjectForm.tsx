"use client";

import React, { useState, useEffect } from 'react';
// Link is not strictly needed if all navigation is handled by onClose or router.push
// import Link from 'next/link'; 

import {
  ChevronLeft,
  Upload,
  MapPin,
  Plus,
  Trash2,
  Save,
  X,
  Building,
  Home,
  Calendar,
  Ruler,
  Grid,
  CheckSquare,
  Phone,
  HelpCircle,
  Star,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { enhancedIconMap } from "@/components/ui/EnhancedAmenityIcons";
import { IconSelector } from './IconSelector'
import { projectsApi } from '@/lib/api';

interface FileObject {
  id: string;
  name: string;
  url: string;
  file: File;
}

interface FormData {
  title: string;
  category: 'residential' | 'commercial';
  status: 'upcoming' | 'ongoing' | 'completed';
  description: string;
  coverImage: string;
  modelView: string;
  location: {
    address: string;
    mapEmbedUrl: string;
  };
  reraNumber: string;
  reraQrImage: string;
  specifications: {
    totalUnits: string;
    unitTypes: string;
    unitArea: string;
    possession: string;
    structure: string;
    flooring: string;
  };
  contactSales: string;
  amenities: string[]; // Changed to string[] for MongoDB ObjectIds
  featured: boolean; // Added featured field
  brochureUrl: string;
  gallery: {
    promotional: FileObject[];
    exterior: FileObject[];
    interior: FileObject[];
    videos: FileObject[];
  };
  floorPlans: {
    [key: string]: FileObject[];
  };
}

interface AddEditProjectFormProps {
  projectId?: string; 
  onClose?: () => void; // Prop to handle closing the form
}

export function AddEditProjectForm({ projectId, onClose }: AddEditProjectFormProps) {
  const isEditing = Boolean(projectId);
  const [showAddAmenityModal, setShowAddAmenityModal] = useState(false);
  const [newAmenityName, setNewAmenityName] = useState('');
  const [newAmenityIcon, setNewAmenityIcon] = useState('Home');
  const [loading, setLoading] = useState(false);
  const [amenitiesLoading, setAmenitiesLoading] = useState(true);

  // Real amenities from database
  const [availableAmenities, setAvailableAmenities] = useState<Array<{
    _id: string;
    name: string;
    icon: string;
    category: string;
    description?: string;
  }>>([]);

  const [formData, setFormData] = useState<FormData>({
    title: '',
    category: 'residential',
    status: 'upcoming',
    description: '',
    coverImage: '',
    modelView: '',
    location: {
      address: '',
      mapEmbedUrl: '',
    },
    reraNumber: '',
    reraQrImage: '',
    specifications: {
      totalUnits: '',
      unitTypes: '',
      unitArea: '',
      possession: '',
      structure: '',
      flooring: '',
    },
    contactSales: '',
    amenities: [],
    featured: false, // Added featured field
    brochureUrl: '',
    gallery: {
      promotional: [],
      exterior: [],
      interior: [],
      videos: [],
    },
    floorPlans: {
      '2bhk': [],
      '3bhk': [],
      '4bhk': [],
    },
  });

  const [mapPreviewLoading, setMapPreviewLoading] = useState(false);

  // Fetch amenities from database
  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        setAmenitiesLoading(true);
        const response = await fetch('/api/amenities?active=true');
        const data = await response.json();

        if (data.success) {
          setAvailableAmenities(data.data);
        } else {
          toast.error('Failed to load amenities');
        }
      } catch (error) {
        console.error('Error fetching amenities:', error);
        toast.error('Failed to load amenities');
      } finally {
        setAmenitiesLoading(false);
      }
    };

    fetchAmenities();
  }, []);

  useEffect(() => {
    if (isEditing && projectId) {
      const fetchProjectData = async () => {
        try {
          setLoading(true);
          const response = await projectsApi.getById(projectId);

          if (response.success && response.data) {
            const project = response.data;
            setFormData({
              title: project.title,
              category: project.category || project.type, // Handle both field names
              status: project.status,
              description: project.description,
              location: {
                address: project.location?.address || '',
                mapEmbedUrl: project.location?.mapEmbedUrl || '',
              },
              specifications: {
                totalUnits: project.specifications.totalUnits || '0',
                unitTypes: project.specifications.unitTypes || 'N/A',
                unitArea: project.specifications.unitArea || 'N/A',
                possession: project.specifications.possession || 'TBD',
                structure: project.specifications.structure || 'N/A',
                flooring: project.specifications.flooring || 'N/A'
              },
              reraNumber: project.reraNumber || '',
              contactSales: project.contactSales || '',
              amenities: project.amenities.map((a: string | { _id: string }) =>
                typeof a === 'string' ? a : a._id
              ),
              featured: project.featured || false,
              coverImage: project.images?.coverImage || '',
              gallery: {
                promotional: project.images?.gallery?.promotional?.map((url: string) => ({ id: Math.random().toString(), name: 'existing', url, file: null })) || [],
                exterior: project.images?.gallery?.exterior?.map((url: string) => ({ id: Math.random().toString(), name: 'existing', url, file: null })) || [],
                interior: project.images?.gallery?.interior?.map((url: string) => ({ id: Math.random().toString(), name: 'existing', url, file: null })) || [],
                videos: project.images?.gallery?.videos?.map((url: string) => ({ id: Math.random().toString(), name: 'existing', url, file: null })) || []
              },
              floorPlans: {
                '2bhk': project.floorPlans?.['2bhk']?.map((url: string) => ({ id: Math.random().toString(), name: 'existing', url, file: null })) || [],
                '3bhk': project.floorPlans?.['3bhk']?.map((url: string) => ({ id: Math.random().toString(), name: 'existing', url, file: null })) || [],
                '4bhk': project.floorPlans?.['4bhk']?.map((url: string) => ({ id: Math.random().toString(), name: 'existing', url, file: null })) || []
              },
              modelView: '',
              reraQrImage: project.reraQrImage || '',
              brochureUrl: project.brochureUrl || ''
            });
            toast.success('Project data loaded successfully');
          } else {
            toast.error('Failed to load project data');
          }
        } catch (error) {
          console.error('Error fetching project data:', error);
          toast.error('Failed to load project data');
        } finally {
          setLoading(false);
        }
      };

      fetchProjectData();
    }
  }, [isEditing, projectId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSpecChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      specifications: {
        ...formData.specifications,
        [name]: value,
      },
    });
  };

  const handleFileUpload = async (field: keyof Pick<FormData, 'gallery' | 'floorPlans'> | 'coverImage' | 'modelView' | 'reraQrImage', files: FileList | null, category: string | null = null) => {
    if (!files || files.length === 0) return;

    // Validate file sizes (2MB limit for images)
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    const oversizedFiles = Array.from(files).filter(file => file.size > maxSize);

    if (oversizedFiles.length > 0) {
      toast.error(`The following files exceed the 2MB limit: ${oversizedFiles.map(f => f.name).join(', ')}. Please compress them and try again.`);
      return;
    }

    // Validate file types for images
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const invalidFiles = Array.from(files).filter(file =>
      (field === 'coverImage' || field === 'reraQrImage' || field === 'gallery') &&
      !allowedImageTypes.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      toast.error(`Invalid file types: ${invalidFiles.map(f => f.name).join(', ')}. Please upload JPEG, PNG, or WebP images only.`);
      return;
    }

    const fileObjects: FileObject[] = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substring(2, 11),
      name: file.name,
      url: URL.createObjectURL(file),
      file,
    }));

    if (category && (field === 'gallery' || field === 'floorPlans')) {
      setFormData((prev) => ({
        ...prev,
        [field]: {
          ...(prev[field] as any),
          [category]: [...(prev[field] as any)[category], ...fileObjects],
        },
      }));
    } else if (field === 'coverImage' || field === 'modelView' || field === 'reraQrImage'){
      // For single file uploads, upload to server immediately
      if (field === 'coverImage' || field === 'reraQrImage') {
        try {
          const formDataUpload = new FormData();
          formDataUpload.append('files', files[0]);
          formDataUpload.append('type', 'image');
          formDataUpload.append('thumbnails', 'true');

          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formDataUpload,
          });

          if (response.ok) {
            const result = await response.json();
            if (result.success && result.data.length > 0) {
              const uploadedImagePath = result.data[0].path;
              setFormData((prev) => ({
                ...prev,
                [field]: uploadedImagePath,
              }));
              toast.success(`${field === 'coverImage' ? 'Cover image' : 'RERA QR image'} uploaded successfully!`);
              return;
            }
          }
          toast.error(`Failed to upload ${field === 'coverImage' ? 'cover image' : 'RERA QR image'}`);
        } catch (error) {
          console.error(`${field} upload error:`, error);
          toast.error(`Failed to upload ${field === 'coverImage' ? 'cover image' : 'RERA QR image'}`);
        }
      } else {
        // For other files (like modelView), just set the preview URL
        setFormData((prev) => ({
          ...prev,
          [field]: fileObjects[0].url,
        }));
      }
    }

    if (field !== 'coverImage' && field !== 'reraQrImage') {
      toast.success(`File${files.length > 1 ? 's' : ''} uploaded successfully (preview).`);
    }
  };

  const handleBrochureUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      brochureUrl: e.target.value,
    }));
  };

  // Function to extract Google Maps embed URL from iframe
  const extractGoogleMapsUrl = (iframeHtml: string): string | null => {
    try {
      // Extract src attribute from iframe
      const srcMatch = iframeHtml.match(/src="([^"]+)"/);
      if (srcMatch && srcMatch[1]) {
        const url = srcMatch[1];
        // Validate that it's a Google Maps embed URL
        if (url.includes('google.com/maps/embed')) {
          return url;
        }
      }
      return null;
    } catch (error) {
      console.error('Error extracting Google Maps URL:', error);
      return null;
    }
  };

  const handleMapEmbedChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;

    // If it looks like an iframe, extract the URL
    if (value.includes('<iframe') && value.includes('google.com/maps/embed')) {
      setMapPreviewLoading(true);
      try {
        const extractedUrl = extractGoogleMapsUrl(value);
        if (extractedUrl) {
          setFormData(prev => ({
            ...prev,
            location: {
              ...prev.location,
              mapEmbedUrl: extractedUrl
            }
          }));
          toast.success('Google Maps URL extracted successfully!');
        } else {
          toast.error('Could not extract Google Maps URL from iframe');
        }
      } catch (error) {
        toast.error('Error processing iframe');
      } finally {
        setMapPreviewLoading(false);
      }
    } else {
      // Direct URL input
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          mapEmbedUrl: value
        }
      }));
    }
  };

  const handleRemoveFile = (field: keyof Pick<FormData, 'gallery' | 'floorPlans'> | 'coverImage' | 'modelView' | 'reraQrImage', fileIdOrField: string | null, category: string | null = null) => {
    if (category && (field === 'gallery' || field === 'floorPlans')) {
      setFormData((prev) => ({
        ...prev,
        [field]: {
          ...(prev[field] as any),
          [category]: (prev[field] as any)[category].filter(
            (item: FileObject) => item.id !== fileIdOrField,
          ),
        },
      }));
    } else if (field === 'coverImage' || field === 'modelView' || field === 'reraQrImage') {
      setFormData((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
    toast.info('File removed.');
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Validate required fields
      if (!formData.title.trim()) {
        throw new Error('Project title is required');
      }
      if (!formData.description.trim()) {
        throw new Error('Project description is required');
      }
      if (!formData.coverImage) {
        throw new Error('Project cover image is required');
      }

      // Upload all gallery and floor plan images that are still blob URLs
      const uploadedGallery = {
        promotional: [],
        exterior: [],
        interior: [],
        videos: []
      };

      const uploadedFloorPlans = {
        '2bhk': [],
        '3bhk': [],
        '4bhk': []
      };

      // Upload gallery images
      for (const [category, items] of Object.entries(formData.gallery)) {
        for (const item of items) {
          if (item.file && item.url.startsWith('blob:')) {
            // Upload the file
            const formDataUpload = new FormData();
            formDataUpload.append('files', item.file);
            formDataUpload.append('type', 'image');

            const response = await fetch('/api/upload', {
              method: 'POST',
              body: formDataUpload,
            });

            if (response.ok) {
              const result = await response.json();
              if (result.success && result.data.length > 0) {
                uploadedGallery[category].push(result.data[0].path);
              }
            } else {
              throw new Error(`Failed to upload ${category} image: ${item.name}`);
            }
          } else {
            // Use existing URL
            uploadedGallery[category].push(item.url);
          }
        }
      }

      // Upload floor plan images
      for (const [type, items] of Object.entries(formData.floorPlans)) {
        for (const item of items) {
          if (item.file && item.url.startsWith('blob:')) {
            // Upload the file
            const formDataUpload = new FormData();
            formDataUpload.append('files', item.file);
            formDataUpload.append('type', 'image');

            const response = await fetch('/api/upload', {
              method: 'POST',
              body: formDataUpload,
            });

            if (response.ok) {
              const result = await response.json();
              if (result.success && result.data.length > 0) {
                uploadedFloorPlans[type].push(result.data[0].path);
              }
            } else {
              throw new Error(`Failed to upload ${type} floor plan: ${item.name}`);
            }
          } else {
            // Use existing URL
            uploadedFloorPlans[type].push(item.url);
          }
        }
      }

      // Prepare the project data for API submission
      const projectData = {
        title: formData.title.trim(),
        category: formData.category, // API now expects 'category'
        status: formData.status,
        description: formData.description.trim(),
        location: {
          address: formData.location.address.trim() || '',
          mapEmbedUrl: formData.location.mapEmbedUrl.trim() || ''
        },
        coverImage: formData.coverImage || '',
        images: {
          coverImage: formData.coverImage || '',
          gallery: uploadedGallery
        },
        specifications: {
          totalUnits: formData.specifications.totalUnits || '',
          unitTypes: formData.specifications.unitTypes || '',
          unitArea: formData.specifications.unitArea || '',
          possession: formData.specifications.possession || '',
          structure: formData.specifications.structure || '',
          flooring: formData.specifications.flooring || ''
        },
        floorPlans: uploadedFloorPlans,
        reraNumber: formData.reraNumber.trim() || '',
        reraQrImage: formData.reraQrImage || '',
        brochureUrl: formData.brochureUrl || '',
        modelView: formData.modelView || '',
        contactSales: formData.contactSales.trim() || '',
        amenities: formData.amenities,
        featured: formData.featured
      };

      let response;
      if (isEditing) {
        response = await projectsApi.update(projectId!, projectData);
      } else {
        response = await projectsApi.create(projectData);
      }

      if (response.success) {
        toast.success(`Project ${isEditing ? 'updated' : 'created'} successfully!`);
        if (onClose) {
          onClose(); // This will trigger data refresh in the parent component
        }
      } else {
        toast.error(response.error || `Failed to ${isEditing ? 'update' : 'create'} project`);
      }
    } catch (error) {
      console.error('Error submitting project:', error);
      toast.error(error instanceof Error ? error.message : `Failed to ${isEditing ? 'update' : 'create'} project`);
    } finally {
      setLoading(false);
    }
  };

  const toggleAmenity = (amenityId: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter(id => id !== amenityId)
        : [...prev.amenities, amenityId]
    }));
  };

  const handleAddNewAmenity = async () => {
    if (newAmenityName.trim() === "") {
      toast.error("Amenity name cannot be empty.");
      return;
    }
    if (availableAmenities.some(a => a.name.toLowerCase() === newAmenityName.trim().toLowerCase())) {
      toast.error("Amenity with this name already exists.");
      return;
    }

    try {
      const response = await fetch('/api/amenities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newAmenityName.trim(),
          icon: newAmenityIcon,
          category: 'custom',
          description: '',
          isActive: true
        }),
      });

      const data = await response.json();

      if (data.success) {
        setAvailableAmenities(prev => [...prev, data.data]);
        toast.success(`Amenity "${data.data.name}" added successfully.`);
        setShowAddAmenityModal(false);
        setNewAmenityName("");
        setNewAmenityIcon("Home");
      } else {
        toast.error(data.error || 'Failed to add amenity');
      }
    } catch (error) {
      console.error('Error adding amenity:', error);
      toast.error('Failed to add amenity');
    }
  };

  // Floor plan types for the gallery section
  const floorPlanTypes = ['2bhk', '3bhk', '4bhk'] as const;

  // Show loading screen when editing and data is being fetched
  if (isEditing && loading) {
    return (
      <div className="space-y-6 p-4 md:p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100"
                aria-label="Close form"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Project</h1>
              <p className="text-gray-600">Loading project data...</p>
            </div>
          </div>
        </div>

        {/* Loading Screen */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-12 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-6" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Project Data</h3>
            <p className="text-gray-600 mb-4">
              Please wait while we fetch the project information...
            </p>
            <div className="max-w-md mx-auto">
              <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                This may take a few seconds depending on the project size
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {onClose && ( // Back/Close button if onClose is provided
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100"
              aria-label="Close form"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Edit Project' : 'Add New Project'}
            </h1>
            <p className="text-gray-600">
              {isEditing
                ? `Update information for project ID: ${projectId}`
                : 'Create a new real estate project'}
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
         {onClose && ( // Cancel button in header if onClose is provided
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium"
            >
              Cancel
            </button>
          )}
          {/* Top Update/Create Button */}
          <button
            type="submit"
            form="project-form"
            disabled={loading}
            loading={loading} // Added loading prop
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4 mr-2" />
            {isEditing ? 'Update Project' : 'Create Project'}
          </button>
        </div>
      </div>

      {/* Form Element */}
      <form id="project-form" onSubmit={handleSubmit} className="space-y-8">
        
        {/* Basic Information Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Project Title *</label>
                <input id="title" type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g. Laxmi Heights" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Project Category *</label>
                <select id="category" name="category" value={formData.category} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required>
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">Project Status *</label>
                <select id="status" name="status" value={formData.status} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required>
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="reraNumber" className="block text-sm font-medium text-gray-700">RERA Number (Optional)</label>
                <input id="reraNumber" type="text" name="reraNumber" value={formData.reraNumber} onChange={handleInputChange} placeholder="e.g. RERA123456" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Media Uploads Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Media Uploads</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cover Image */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Project Cover Image *</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg min-h-[200px] items-center">
                  {formData.coverImage ? (
                    <div className="relative w-full text-center">
                      <img src={formData.coverImage} alt="Cover preview" className="mx-auto max-h-64 object-contain rounded-lg"/>
                      <button type="button" onClick={() => handleRemoveFile('coverImage', null)} className="absolute top-2 right-2 p-1 bg-red-100 rounded-full text-red-600 hover:bg-red-200" title="Remove cover image">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-10 w-10 text-gray-300" />
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label htmlFor="coverImage-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                          <span>Upload a file</span>
                          <input id="coverImage-upload" type="file" className="sr-only" accept="image/*" onChange={(e) => handleFileUpload('coverImage', e.target.files)} />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, WebP up to 2MB</p>
                    </div>
                  )}
                </div>
              </div>

              {/* 3D Model View */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">3D Model View (GLB/GLTF)</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg min-h-[200px] items-center">
                  {formData.modelView ? (
                     <div className="relative w-full text-center">
                      <div className="mx-auto h-64 bg-gray-100 rounded-lg flex flex-col items-center justify-center p-4 text-center">
                        <Grid className="w-12 h-12 text-gray-400 mb-2" />
                        <p className="text-sm font-medium text-gray-700">3D Model Uploaded</p>
                        <p className="text-xs text-gray-500 truncate max-w-xs">{formData.modelView.startsWith('blob:') ? 'Preview name not available' : formData.modelView}</p>
                      </div>
                      <button type="button" onClick={() => handleRemoveFile('modelView', null)} className="absolute top-2 right-2 p-1 bg-red-100 rounded-full text-red-600 hover:bg-red-200" title="Remove 3D model">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-10 w-10 text-gray-300" />
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label htmlFor="modelView-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                          <span>Upload a file</span>
                          <input id="modelView-upload" type="file" className="sr-only" accept=".glb,.gltf" onChange={(e) => handleFileUpload('modelView', e.target.files)} />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">GLB, GLTF formats</p>
                    </div>
                  )}
                </div>
              </div>

              {/* RERA QR Code */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">RERA QR Code Image</label>
                 <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg min-h-[150px] items-center">
                  {formData.reraQrImage ? (
                    <div className="relative w-full text-center">
                      <img src={formData.reraQrImage} alt="RERA QR Code" className="mx-auto max-h-40 object-contain rounded-lg"/>
                      <button type="button" onClick={() => handleRemoveFile('reraQrImage', null)} className="absolute top-2 right-2 p-1 bg-red-100 rounded-full text-red-600 hover:bg-red-200" title="Remove QR code image">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-10 w-10 text-gray-300" />
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label htmlFor="reraQrImage-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                          <span>Upload a file</span>
                          <input id="reraQrImage-upload" type="file" className="sr-only" accept="image/*" onChange={(e) => handleFileUpload('reraQrImage', e.target.files)} />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, WebP up to 2MB</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Brochure URL */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Project Brochure URL</label>
                <input
                  type="url"
                  placeholder="https://example.com/brochure.pdf"
                  value={formData.brochureUrl}
                  onChange={handleBrochureUrlChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {formData.brochureUrl && (
                   <p className="text-xs text-gray-500">Linking to: <a href={formData.brochureUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{formData.brochureUrl}</a></p>
                )}
                <p className="text-xs text-gray-500">Enter a direct link to the project brochure PDF</p>
              </div>
            </div>
          </div>
        </div>

        {/* Location Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Location</h2>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address (Optional)</label>
                <input id="address" type="text" name="address" value={formData.location.address} onChange={(e) => setFormData(prev => ({...prev, location: {...prev.location, address: e.target.value }}))} placeholder="e.g. Vesu, Surat, Gujarat" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="mapEmbedUrl" className="block text-sm font-medium text-gray-700">Google Maps Embed URL or Iframe</label>
                  <textarea
                    id="mapEmbedUrl"
                    value={formData.location.mapEmbedUrl}
                    onChange={handleMapEmbedChange}
                    placeholder="Paste either the Google Maps embed URL or the complete iframe code here..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {mapPreviewLoading && (
                    <div className="flex items-center text-blue-600 text-sm">
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Processing iframe...
                    </div>
                  )}
                  <p className="text-xs text-gray-500">
                    You can paste either:
                    <br />• Direct embed URL: https://www.google.com/maps/embed?pb=...
                    <br />• Complete iframe code from Google Maps (we'll extract the URL automatically)
                  </p>
                </div>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-300">
                  {formData.location.mapEmbedUrl ? (
                    <iframe
                      src={formData.location.mapEmbedUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="rounded-lg"
                      title="Project location map"
                      aria-label="Google Maps showing project location"
                    />
                  ) : (
                    <div className="text-center">
                      <MapPin className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Map preview will appear here</p>
                      <p className="text-xs text-gray-400 mt-1">Add a Google Maps embed URL above</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Description</h2>
            <div className="space-y-1.5">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description *</label>
              <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} rows={5} placeholder="Enter a detailed description of the project..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
            </div>
          </div>
        </div>

        {/* Specifications Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[ 
                { name: 'totalUnits', label: 'Total Units', icon: Building, placeholder: 'e.g. 120' },
                { name: 'unitTypes', label: 'Unit Types', icon: Home, placeholder: 'e.g. 1BHK, 2BHK' },
                { name: 'unitArea', label: 'Unit Area', icon: Ruler, placeholder: 'e.g. 625 - 1350 sq.ft.' },
                { name: 'possession', label: 'Possession', icon: Calendar, placeholder: 'e.g. December 2025' },
                { name: 'structure', label: 'Structure', icon: Grid, placeholder: 'e.g. RCC Framed' },
                { name: 'flooring', label: 'Flooring', icon: CheckSquare, placeholder: 'e.g. Vitrified Tiles' },
              ].map(spec => (
                <div key={spec.name} className="space-y-1.5">
                  <div className="flex items-center">
                    <spec.icon className="w-4 h-4 mr-2 text-gray-500" />
                    <label htmlFor={spec.name} className="block text-sm font-medium text-gray-700">{spec.label}</label>
                  </div>
                  <input id={spec.name} type="text" name={spec.name} value={formData.specifications[spec.name as keyof FormData['specifications']]} onChange={handleSpecChange} placeholder={spec.placeholder} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-1.5">
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-gray-500" />
                <label htmlFor="contactSales" className="block text-sm font-medium text-gray-700">Contact Sales Number (Optional)</label>
              </div>
              <input id="contactSales" type="text" name="contactSales" value={formData.contactSales} onChange={handleInputChange} placeholder="e.g. +91 98765 43210" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
            </div>

            {/* Featured Project Toggle */}
            <div className="mt-6 flex items-center space-x-3">
              <Star className="w-4 h-4 text-gray-500" />
              <label htmlFor="featured" className="text-sm font-medium text-gray-700">Featured Project</label>
              <div className="relative">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                  className="sr-only"
                />
                <div
                  onClick={() => setFormData(prev => ({ ...prev, featured: !prev.featured }))}
                  className={`w-11 h-6 rounded-full cursor-pointer transition-colors duration-200 ${
                    formData.featured ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                      formData.featured ? 'translate-x-5' : 'translate-x-0.5'
                    } mt-0.5`}
                  />
                </div>
              </div>
              <span className="text-sm text-gray-500">
                {formData.featured ? 'This project will be featured on the homepage' : 'Mark as featured project'}
              </span>
            </div>
          </div>
        </div>

        {/* Amenities Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Amenities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {amenitiesLoading ? (
                <div className="col-span-full text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
                  <p className="text-gray-500 mt-2">Loading amenities...</p>
                </div>
              ) : (
                availableAmenities.map((amenity) => {
                  const AmenityIcon = () => enhancedIconMap[amenity.name] || <HelpCircle className="w-6 h-6 text-gray-400" />;
                  const isSelected = formData.amenities.includes(amenity._id);

                  return (
                    <div
                      key={amenity._id}
                      onClick={() => toggleAmenity(amenity._id)}
                      className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 flex flex-col items-center text-center ${isSelected ? 'border-blue-500 bg-blue-50 shadow-md scale-105' : 'border-gray-200 hover:bg-gray-50 hover:shadow-sm'}`}>
                      <div className={`w-10 h-10 mb-2 rounded-full flex items-center justify-center ${isSelected ? 'bg-blue-100' : 'bg-gray-100'}`}>
                        <AmenityIcon />
                      </div>
                      <p className="text-xs font-medium text-gray-700">{amenity.name}</p>
                    </div>
                  );
                })
              )}
              <div 
                onClick={() => setShowAddAmenityModal(true)}
                className="p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 flex flex-col items-center justify-center text-center min-h-[90px]">
                <Plus className="w-6 h-6 text-gray-400 mb-1" />
                <p className="text-xs font-medium text-gray-500">Add New Amenity</p>
              </div>
            </div>
          </div>
        </div>

        {/* Add Amenity Modal (Basic Structure) */}
        {showAddAmenityModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Add New Amenity</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="newAmenityName" className="block text-sm font-medium text-gray-700">Amenity Name</label>
                  <input 
                    type="text" 
                    id="newAmenityName" 
                    value={newAmenityName}
                    onChange={(e) => setNewAmenityName(e.target.value)}
                    placeholder="e.g., Rooftop Terrace"
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {/* Icon Selection UI */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Icon</label>
                  <IconSelector
                    value={newAmenityIcon}
                    onChange={setNewAmenityIcon}
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button 
                  type="button" 
                  onClick={() => setShowAddAmenityModal(false)} 
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  onClick={handleAddNewAmenity}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                >
                  Add Amenity
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Project Gallery & Floor Plans Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
             <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Gallery & Floor Plans</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-semibold text-gray-800 mb-1">Gallery Images</h3>
                <p className="text-sm text-gray-600 mb-4">💡 <strong>Tip:</strong> You can select multiple images at once by holding Ctrl (Windows) or Cmd (Mac) while clicking files, or by dragging to select multiple files in the file picker.</p>
              </div>
              {/* Horizontal layout for gallery types */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {[
                  { category: 'promotional', title: 'Promotional Images' },
                  { category: 'exterior', title: 'Exterior Images' },
                  { category: 'interior', title: 'Interior Images' },
                ].map(galleryType => (
                  <div key={galleryType.category} className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">{galleryType.title}</label>
                    <div className="space-y-3">
                      {(formData.gallery[galleryType.category as keyof FormData['gallery']] as FileObject[]).map((image) => (
                        <div key={image.id} className="relative group aspect-video">
                          <img src={image.url} alt={galleryType.title} className="h-full w-full object-cover rounded-lg shadow-sm"/>
                          <button type="button" onClick={() => handleRemoveFile('gallery', image.id, galleryType.category)} className="absolute top-1.5 right-1.5 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600" title="Remove image">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                      <div
                        onClick={() => {
                          document.getElementById(`gallery-${galleryType.category}-upload`)?.click();
                        }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            document.getElementById(`gallery-${galleryType.category}-upload`)?.click();
                          }
                        }}
                        className="cursor-pointer aspect-video border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 hover:border-blue-400 transition-colors"
                      >
                        <Plus className="w-6 h-6 mb-1" />
                        <span className="text-xs text-center">Add Image(s)</span>
                        <span className="text-xs text-center text-gray-500 mt-1">Select multiple files</span>
                        <input id={`gallery-${galleryType.category}-upload`} type="file" className="sr-only" accept="image/*" multiple onChange={(e) => handleFileUpload('gallery', e.target.files, galleryType.category)} />
                      </div>
                    </div>
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Videos</label>
                  <div className="space-y-3">
                    {(formData.gallery.videos as FileObject[]).map((video) => (
                      <div key={video.id} className="relative group aspect-video bg-gray-100 rounded-lg flex flex-col items-center justify-center p-4 shadow-sm text-center">
                        <svg className="w-10 h-10 text-gray-500 mb-2" fill="currentColor" viewBox="0 0 20 20"><path d="M6.5 5.5L13.5 10l-7 4.5v-9z" /></svg>
                        <p className="text-sm font-medium text-gray-700 truncate w-full px-1">{video.name}</p>
                        <button type="button" onClick={() => handleRemoveFile('gallery', video.id, 'videos')} className="absolute top-1.5 right-1.5 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600" title="Remove video">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    <div
                      onClick={() => {
                        document.getElementById('gallery-videos-upload')?.click();
                      }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          document.getElementById('gallery-videos-upload')?.click();
                        }
                      }}
                      className="cursor-pointer aspect-video border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 hover:border-blue-400 transition-colors"
                    >
                      <Plus className="w-6 h-6 mb-1" />
                      <span className="text-xs text-center">Add Video(s)</span>
                      <span className="text-xs text-center text-gray-500 mt-1">Select multiple files</span>
                      <input id="gallery-videos-upload" type="file" className="sr-only" accept="video/*" multiple onChange={(e) => handleFileUpload('gallery', e.target.files, 'videos')} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-1">Floor Plans</h3>
                  <p className="text-sm text-gray-600 mb-4">💡 <strong>Tip:</strong> Upload floor plan images for different unit types. You can select multiple floor plan images at once.</p>
                </div>
                {/* Horizontal layout for floor plans */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {floorPlanTypes.map(type => (
                    <div key={type} className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">{type.toUpperCase()} Floor Plans</label>
                      <div className="space-y-3">
                        {(formData.floorPlans[type] || []).map((plan) => (
                          <div key={plan.id} className="relative group aspect-[4/3]">
                            <img src={plan.url} alt={`${type.toUpperCase()} Floor Plan - ${plan.name}`} className="h-full w-full object-contain bg-gray-50 rounded-lg border border-gray-200 shadow-sm"/>
                            <div className="absolute inset-x-0 bottom-0 bg-white/80 backdrop-blur-sm p-1.5 border-t border-gray-200 text-center">
                              <p className="text-xs font-medium text-gray-800 truncate">{plan.name}</p>
                            </div>
                            <button type="button" onClick={() => handleRemoveFile('floorPlans', plan.id, type)} className="absolute top-1.5 right-1.5 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600" title="Remove floor plan">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                        <div
                          onClick={() => {
                            document.getElementById(`floorPlans-${type}-upload`)?.click();
                          }}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              document.getElementById(`floorPlans-${type}-upload`)?.click();
                            }
                          }}
                          className="cursor-pointer aspect-[4/3] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 hover:border-blue-400 transition-colors"
                        >
                          <Plus className="w-6 h-6 mb-1" />
                          <span className="text-xs text-center">Add {type.toUpperCase()} Plan(s)</span>
                          <span className="text-xs text-center text-gray-500 mt-1">Select multiple files</span>
                          <input id={`floorPlans-${type}-upload`} type="file" className="sr-only" accept="image/*" multiple onChange={(e) => handleFileUpload('floorPlans', e.target.files, type)} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions - Save/Create and Cancel */}
        <div className="flex justify-end space-x-3 pt-4">
          {onClose && (
            <button 
              type="button" 
              onClick={onClose} 
              className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            loading={loading} // Added loading prop
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4 mr-2" />
            {isEditing ? 'Update Project' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  );
}

// Example usage (this would be in a page file like app/cms-admin/projects/add/page.tsx or app/cms-admin/projects/edit/[id]/page.tsx)
/*
// For Add Page (e.g., app/cms-admin/projects/add/page.tsx):
import { AddEditProjectForm } from '@/app/cms-admin/components/AddEditProjectForm';
export default function AddProjectPage() {
  return <AddEditProjectForm />;
}

// For Edit Page (e.g., app/cms-admin/projects/edit/[projectId]/page.tsx):
import { AddEditProjectForm } from '@/app/cms-admin/components/AddEditProjectForm';
export default function EditProjectPage({ params }: { params: { projectId: string } }) {
  return <AddEditProjectForm projectId={params.projectId} />;
}
*/ 