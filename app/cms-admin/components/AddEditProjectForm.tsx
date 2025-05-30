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
} from 'lucide-react';
import { toast } from 'sonner';
import { enhancedIconMap } from "@/components/ui/EnhancedAmenityIcons";

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
    lat: string; 
    lng: string; 
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
  amenities: number[]; 
  brochureFile: File | null;
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
  const [newAmenityName, setNewAmenityName] = useState("");

  const [availableAmenities, setAvailableAmenities] = useState([
    { id: 1, title: 'Swimming Pool' },
    { id: 2, title: 'Gym' },
    { id: 3, title: "Children's Play Area" },
    { id: 4, title: 'Clubhouse' },
    { id: 5, title: '24/7 Security' },
    { id: 6, title: 'Landscaped Gardens' },
    { id: 7, title: 'Parking' },
    { id: 8, title: 'Power Backup' },
  ]);

  const [formData, setFormData] = useState<FormData>({
    title: '',
    category: 'residential',
    status: 'upcoming',
    description: '',
    coverImage: '',
    modelView: '',
    location: {
      address: '',
      lat: '21.1702',
      lng: '72.8311',
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
    brochureFile: null,
    brochureUrl: '',
    gallery: {
      promotional: [],
      exterior: [],
      interior: [],
      videos: [],
    },
    floorPlans: {
      '3bhk': [],
      '4bhk': [],
      '5bhk': [],
    },
  });

  const [brochureInputMode, setBrochureInputMode] = useState<'upload' | 'url'>('upload');

  useEffect(() => {
    if (isEditing && projectId) {
      // In a real app, fetch project data here based on projectId
      console.log("Editing project with ID:", projectId);
      toast.info(`Loading data for project ${projectId}... (placeholder)`);
      // setFormData(fetchedProjectData);
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

  const handleFileUpload = (field: keyof Pick<FormData, 'gallery' | 'floorPlans'> | 'coverImage' | 'modelView' | 'reraQrImage', files: FileList | null, category: string | null = null) => {
    if (!files || files.length === 0) return;

    const fileObjects: FileObject[] = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
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
      setFormData((prev) => ({
        ...prev,
        [field]: fileObjects[0].url, 
      }));
    } 
    toast.success(`File${files.length > 1 ? 's' : ''} uploaded successfully (preview).`);
  };

 const handleBrochureUpload = (files: FileList | null) => {
    if (files && files[0]) {
        setFormData(prev => ({
            ...prev,
            brochureFile: files[0],
            brochureUrl: '',
        }));
        toast.success('Brochure uploaded successfully (preview).');
    }  
  };

  const handleBrochureUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      brochureUrl: e.target.value,
      brochureFile: null,
    }));
  };

  const handleRemoveFile = (field: keyof Pick<FormData, 'gallery' | 'floorPlans'> | 'coverImage' | 'modelView' | 'reraQrImage' | 'brochureFile', fileIdOrField: string | null, category: string | null = null) => {
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
    } else if (field === 'brochureFile') {
      setFormData(prev => ({
        ...prev,
        brochureFile: null,
        brochureUrl: '',
      }));
    }
    toast.info('File removed.');
  };
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Submitting form data:', formData);
    // Add actual submission logic here (e.g., API call)
    toast.success(`Project ${isEditing ? 'updated' : 'created'} successfully (simulated)!`);
    if (onClose) { // Call onClose after successful submission if provided
      onClose();
    }
    // Optionally, redirect or clear form if not closing
    // if (!onClose) { router.push('/cms-admin/dashboard/projects'); }
  };

  const toggleAmenity = (amenityTitle: string) => {
    const amenityId = availableAmenities.find(a => a.title === amenityTitle)?.id;
    if (!amenityId) return;

    const newSelectedAmenities = formData.amenities.includes(amenityId)
      ? formData.amenities.filter((id) => id !== amenityId)
      : [...formData.amenities, amenityId];
    setFormData({ ...formData, amenities: newSelectedAmenities });
  };

  const handleAddNewAmenity = () => {
    if (newAmenityName.trim() === "") {
      toast.error("Amenity name cannot be empty.");
      return;
    }
    if (availableAmenities.some(a => a.title.toLowerCase() === newAmenityName.trim().toLowerCase())) {
      toast.error("Amenity with this name already exists.");
      return;
    }

    const newAmenity = {
      id: Date.now(),
      title: newAmenityName.trim(),
    };
    setAvailableAmenities(prev => [...prev, newAmenity]);
    toast.success(`Amenity "${newAmenity.title}" added to available list.`);
    setShowAddAmenityModal(false);
    setNewAmenityName("");
  };

  const [activeFloorPlanTab, setActiveFloorPlanTab] = useState<string>('3bhk');
  const floorPlanTypes = ['3bhk', '4bhk', '5bhk'];

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
          {/* The main save/create button is now part of the form element itself for proper submission */}
        </div>
      </div>

      {/* Form Element */}
      <form onSubmit={handleSubmit} className="space-y-8">
        
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
                <label htmlFor="reraNumber" className="block text-sm font-medium text-gray-700">RERA Number</label>
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
                      <button type="button" onClick={() => handleRemoveFile('coverImage', null)} className="absolute top-2 right-2 p-1 bg-red-100 rounded-full text-red-600 hover:bg-red-200">
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
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
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
                      <button type="button" onClick={() => handleRemoveFile('modelView', null)} className="absolute top-2 right-2 p-1 bg-red-100 rounded-full text-red-600 hover:bg-red-200">
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
                      <button type="button" onClick={() => handleRemoveFile('reraQrImage', null)} className="absolute top-2 right-2 p-1 bg-red-100 rounded-full text-red-600 hover:bg-red-200">
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
                      <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Brochure Upload */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Project Brochure</label>
                <div className="flex items-center space-x-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setBrochureInputMode('upload')}
                    className={`px-3 py-1.5 text-xs rounded-md ${brochureInputMode === 'upload' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  >
                    Upload PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => setBrochureInputMode('url')}
                    className={`px-3 py-1.5 text-xs rounded-md ${brochureInputMode === 'url' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  >
                    Enter URL
                  </button>
                </div>

                {brochureInputMode === 'upload' && (
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg min-h-[150px] items-center">
                    {formData.brochureFile ? (
                      <div className="relative w-full text-center">
                        <div className="mx-auto h-40 bg-gray-100 rounded-lg flex flex-col items-center justify-center p-4">
                          <svg className="w-10 h-10 text-blue-500 mb-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"/></svg>
                          <p className="text-sm font-medium text-gray-900 truncate max-w-xs">{formData.brochureFile.name}</p>
                          <p className="text-xs text-gray-500">PDF Document</p>
                        </div>
                        <button type="button" onClick={() => handleRemoveFile('brochureFile', null)} className="absolute top-2 right-2 p-1 bg-red-100 rounded-full text-red-600 hover:bg-red-200">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-10 w-10 text-gray-300" />
                        <div className="flex text-sm text-gray-600 justify-center">
                          <label htmlFor="brochureFile-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                            <span>Upload a PDF</span>
                            <input id="brochureFile-upload" type="file" className="sr-only" accept=".pdf" onChange={(e) => handleBrochureUpload(e.target.files)} />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PDF up to 20MB</p>
                      </div>
                    )}
                  </div>
                )}

                {brochureInputMode === 'url' && (
                  <div className="space-y-1.5 mt-1">
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
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Location Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Location</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                  <input id="address" type="text" name="address" value={formData.location.address} onChange={(e) => setFormData(prev => ({...prev, location: {...prev.location, address: e.target.value }}))} placeholder="e.g. Vesu, Surat, Gujarat" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
                </div>
                <div className="flex space-x-4">
                  <div className="space-y-1.5 flex-1">
                    <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">Latitude</label>
                    <input id="latitude" type="text" name="latitude" value={formData.location.lat} onChange={(e) => setFormData(prev => ({...prev, location: {...prev.location, lat: e.target.value }}))} placeholder="e.g. 21.1702" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">Longitude</label>
                    <input id="longitude" type="text" name="longitude" value={formData.location.lng} onChange={(e) => setFormData(prev => ({...prev, location: {...prev.location, lng: e.target.value }}))} placeholder="e.g. 72.8311" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
                  </div>
                </div>
              </div>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-300">
                <div className="text-center">
                  <MapPin className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Map component (placeholder)</p>
                  <p className="text-xs text-gray-400 mt-1">Future: Interactive map for selecting lat/lng</p>
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
                <label htmlFor="contactSales" className="block text-sm font-medium text-gray-700">Contact Sales Number</label>
              </div>
              <input id="contactSales" type="text" name="contactSales" value={formData.contactSales} onChange={handleInputChange} placeholder="e.g. +91 98765 43210" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"/>
            </div>
          </div>
        </div>

        {/* Amenities Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Amenities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {availableAmenities.map((amenity) => {
                const AmenityIcon = () => enhancedIconMap[amenity.title] || <HelpCircle className="w-6 h-6 text-gray-400" />;
                const isSelected = formData.amenities.includes(amenity.id);

                return (
                  <div 
                    key={amenity.id} 
                    onClick={() => toggleAmenity(amenity.title)} 
                    className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 flex flex-col items-center text-center ${isSelected ? 'border-blue-500 bg-blue-50 shadow-md scale-105' : 'border-gray-200 hover:bg-gray-50 hover:shadow-sm'}`}>
                    <div className={`w-10 h-10 mb-2 rounded-full flex items-center justify-center ${isSelected ? 'bg-blue-100' : 'bg-gray-100'}`}>
                      <AmenityIcon />
                    </div>
                    <p className="text-xs font-medium text-gray-700">{amenity.title}</p>
                  </div>
                );
              })}
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
                {/* Placeholder for Icon Selection UI */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Icon (Placeholder)</label>
                  <div className="mt-1 p-3 border border-gray-300 rounded-lg text-center text-gray-400">
                    Icon selection UI will go here.
                  </div>
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
            <div className="space-y-6 mb-8">
              <h3 className="text-base font-semibold text-gray-800 mb-1">Gallery Images</h3>
              {[ 
                { category: 'promotional', title: 'Promotional Images' },
                { category: 'exterior', title: 'Exterior Images' },
                { category: 'interior', title: 'Interior Images' },
              ].map(galleryType => (
                <div key={galleryType.category}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{galleryType.title}</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {(formData.gallery[galleryType.category as keyof FormData['gallery']] as FileObject[]).map((image) => (
                      <div key={image.id} className="relative group aspect-square">
                        <img src={image.url} alt={galleryType.title} className="h-full w-full object-cover rounded-lg shadow-sm"/>
                        <button type="button" onClick={() => handleRemoveFile('gallery', image.id, galleryType.category)} className="absolute top-1.5 right-1.5 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    <label htmlFor={`gallery-${galleryType.category}-upload`} className="cursor-pointer aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 hover:border-blue-400 transition-colors">
                      <Plus className="w-6 h-6 mb-1" />
                      <span className="text-xs text-center">Add Image(s)</span>
                      <input id={`gallery-${galleryType.category}-upload`} type="file" className="sr-only" accept="image/*" multiple onChange={(e) => handleFileUpload('gallery', e.target.files, galleryType.category)} />
                    </label>
                  </div>
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Videos</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                   {(formData.gallery.videos as FileObject[]).map((video) => (
                    <div key={video.id} className="relative group aspect-video bg-gray-100 rounded-lg flex flex-col items-center justify-center p-2 shadow-sm text-center">
                      <svg className="w-8 h-8 text-gray-500 mb-1.5" fill="currentColor" viewBox="0 0 20 20"><path d="M6.5 5.5L13.5 10l-7 4.5v-9z" /></svg>
                      <p className="text-xs font-medium text-gray-700 truncate w-full px-1">{video.name}</p>
                      <button type="button" onClick={() => handleRemoveFile('gallery', video.id, 'videos')} className="absolute top-1.5 right-1.5 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600">
                         <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  <label htmlFor="gallery-videos-upload" className="cursor-pointer aspect-video border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 hover:border-blue-400 transition-colors">
                    <Plus className="w-6 h-6 mb-1" />
                    <span className="text-xs">Add Video(s)</span>
                    <input id="gallery-videos-upload" type="file" className="sr-only" accept="video/*" multiple onChange={(e) => handleFileUpload('gallery', e.target.files, 'videos')} />
                  </label>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-base font-semibold text-gray-800 mb-3 pt-4 border-t border-gray-200">Floor Plans</h3>
              <div className="border-b border-gray-200 mb-4">
                <nav className="-mb-px flex space-x-6 overflow-x-auto">
                  {floorPlanTypes.map(type => (
                     <button key={type} type="button" onClick={() => setActiveFloorPlanTab(type)} className={`whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeFloorPlanTab === type ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                      {type.toUpperCase()} Plans
                    </button>
                  ))}
                </nav>
              </div>

              {floorPlanTypes.map(type => (
                <div key={type} className={activeFloorPlanTab === type ? 'block' : 'hidden'}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{type.toUpperCase()} Floor Plans</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {(formData.floorPlans[type] || []).map((plan) => (
                      <div key={plan.id} className="relative group aspect-[4/3]">
                        <img src={plan.url} alt={`${type.toUpperCase()} Floor Plan - ${plan.name}`} className="h-full w-full object-contain bg-gray-50 rounded-lg border border-gray-200 shadow-sm"/>
                        <div className="absolute inset-x-0 bottom-0 bg-white/80 backdrop-blur-sm p-1.5 border-t border-gray-200 text-center">
                          <p className="text-xs font-medium text-gray-800 truncate">{plan.name}</p>
                        </div>
                        <button type="button" onClick={() => handleRemoveFile('floorPlans', plan.id, type)} className="absolute top-1.5 right-1.5 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    <label htmlFor={`floorPlans-${type}-upload`} className="cursor-pointer aspect-[4/3] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 hover:border-blue-400 transition-colors">
                      <Plus className="w-6 h-6 mb-1" />
                      <span className="text-xs text-center">Add {type.toUpperCase()} Plan(s)</span>
                      <input id={`floorPlans-${type}-upload`} type="file" className="sr-only" accept="image/*" multiple onChange={(e) => handleFileUpload('floorPlans', e.target.files, type)} />
                    </label>
                  </div>
                </div>
              ))}
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
          <button type="submit" className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center text-sm font-medium">
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