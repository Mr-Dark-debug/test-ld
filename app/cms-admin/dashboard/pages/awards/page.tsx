'use client'

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'react-hot-toast'
import {
  Plus,
  Edit,
  Trash2,
  Save,
  CheckCircle,
  XCircle,
  Loader2,
  Award,
  Upload,
  Image as ImageIcon
} from 'lucide-react'

interface Award {
  _id: string;
  title: string;
  description: string;
  image: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface NewAward {
  title: string;
  description: string;
  image: string;
  imageUrl: string;
  imageType: 'upload' | 'url';
  isActive: boolean;
}

export default function AwardsPage() {
  const [awards, setAwards] = useState<Award[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingAward, setEditingAward] = useState<Award | null>(null);
  const [isAddingAward, setIsAddingAward] = useState(false);
  const [newAward, setNewAward] = useState<NewAward>({
    title: '',
    description: '',
    image: '',
    imageUrl: '',
    imageType: 'upload',
    isActive: true
  });

  // Fetch awards from API
  const fetchAwards = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/awards');
      const data = await response.json();

      if (data.success && data.data) {
        setAwards(data.data);
      } else {
        console.error('Invalid API response:', data);
        // Fallback to default award
        setAwards([
          {
            _id: '1',
            title: 'Best Real Estate Developer 2023',
            description: 'Awarded for excellence in residential and commercial development in Surat region.',
            image: '/images/awards/best-developer-2023.jpg',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ]);
        toast.error('Failed to fetch awards - showing default data');
      }
    } catch (error) {
      console.error('Error fetching awards:', error);
      setAwards([
        {
          _id: '1',
          title: 'Best Real Estate Developer 2023',
          description: 'Awarded for excellence in residential and commercial development in Surat region.',
          image: '/images/awards/best-developer-2023.jpg',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]);
      toast.error('Failed to fetch awards');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAwards();
  }, []);

  // Handle file upload with size validation
  const handleFileUpload = async (file: File) => {
    // Validate file size (2MB limit)
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    if (file.size > maxSize) {
      toast.error('File size must be less than 2MB. Please compress the image and try again.');
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPEG, PNG, or WebP).');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('files', file);
      formData.append('type', 'image');
      formData.append('thumbnails', 'true');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data.length > 0) {
          const uploadedImagePath = result.data[0].path;
          setNewAward(prev => ({
            ...prev,
            image: uploadedImagePath,
            imageType: 'upload'
          }));
          toast.success('Image uploaded successfully!');
        } else {
          toast.error('Failed to upload image');
        }
      } else {
        toast.error('Failed to upload image');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    }
  };

  // Handle URL validation and setting
  const handleImageUrlChange = (url: string) => {
    setNewAward(prev => ({
      ...prev,
      imageUrl: url,
      image: url, // Set image to URL for API compatibility
      imageType: 'url'
    }));
  };

  // Handle creating new award
  const handleCreateAward = async () => {
    console.log('Creating award with data:', newAward);

    if (!newAward.title || !newAward.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!newAward.image && !newAward.imageUrl) {
      toast.error('Please provide an image (upload or URL)');
      return;
    }

    setIsSaving(true);

    try {
      console.log('Sending POST request to /api/awards');
      const response = await fetch('/api/awards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAward),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      const data = await response.json();
      console.log('Response data:', data);

      if (data.success) {
        toast.success('Award created successfully');
        await fetchAwards();
        setIsAddingAward(false);
        setNewAward({
          title: '',
          description: '',
          image: '',
          imageUrl: '',
          imageType: 'upload',
          isActive: true
        });
      } else {
        console.error('API returned error:', data.error);
        toast.error(data.error || 'Failed to create award');
      }
    } catch (error) {
      console.error('Error creating award:', error);
      toast.error('Failed to create award: ' + (error as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle updating award
  const handleUpdateAward = async () => {
    if (!editingAward) return;

    setIsSaving(true);

    try {
      const response = await fetch('/api/awards', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: editingAward._id, ...editingAward }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Award updated successfully');
        await fetchAwards();
        setEditingAward(null);
      } else {
        toast.error(data.error || 'Failed to update award');
      }
    } catch (error) {
      console.error('Error updating award:', error);
      toast.error('Failed to update award');
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle award active status
  const toggleAwardStatus = async (awardId: string) => {
    try {
      const award = awards.find(a => a._id === awardId);
      if (!award) return;

      const response = await fetch('/api/awards', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: awardId,
          isActive: !award.isActive
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Award ${!award.isActive ? 'activated' : 'deactivated'} successfully`);
        await fetchAwards();
      } else {
        toast.error(data.error || 'Failed to update award status');
      }
    } catch (error) {
      console.error('Error toggling award status:', error);
      toast.error('Failed to update award status');
    }
  };

  // Delete award
  const deleteAward = async (awardId: string) => {
    if (!confirm('Are you sure you want to delete this award? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/awards?id=${awardId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Award deleted successfully');
        await fetchAwards();
      } else {
        toast.error(data.error || 'Failed to delete award');
      }
    } catch (error) {
      console.error('Error deleting award:', error);
      toast.error('Failed to delete award');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2 text-lg">Loading awards...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Awards Management</h1>
          <p className="text-gray-600 mt-1">
            Manage awards and recognitions displayed on the Why Laxmi page.
          </p>
        </div>
        {!editingAward && !isAddingAward && (
          <Button
            onClick={() => setIsAddingAward(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            Add New Award
          </Button>
        )}
        {(editingAward || isAddingAward) && (
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              onClick={editingAward ? handleUpdateAward : handleCreateAward}
              disabled={isSaving}
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSaving ? 'Saving...' : (editingAward ? 'Update Award' : 'Create Award')}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setEditingAward(null);
                setIsAddingAward(false);
                setNewAward({
                  title: '',
                  description: '',
                  image: '',
                  imageUrl: '',
                  imageType: 'upload',
                  isActive: true
                });
              }}
              className="flex-1 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            >
              Cancel
            </Button>
          </div>
        )}
      </div>

      {(isAddingAward || editingAward) ? (
        // Award Form
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            {isAddingAward ? 'Add New Award' : 'Edit Award'}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Award Title</label>
              <Input
                value={isAddingAward ? newAward.title : editingAward?.title || ''}
                onChange={(e) => {
                  if (isAddingAward) {
                    setNewAward({...newAward, title: e.target.value});
                  } else if (editingAward) {
                    setEditingAward({...editingAward, title: e.target.value});
                  }
                }}
                placeholder="e.g., Best Real Estate Developer 2023"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                value={isAddingAward ? newAward.description : editingAward?.description || ''}
                onChange={(e) => {
                  if (isAddingAward) {
                    setNewAward({...newAward, description: e.target.value});
                  } else if (editingAward) {
                    setEditingAward({...editingAward, description: e.target.value});
                  }
                }}
                placeholder="Describe the award and its significance..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Award Image</label>

              {/* Image Type Selection */}
              <div className="flex gap-4 mb-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="imageType"
                    value="upload"
                    checked={(isAddingAward ? newAward.imageType : 'upload') === 'upload'}
                    onChange={() => {
                      if (isAddingAward) {
                        setNewAward({...newAward, imageType: 'upload', imageUrl: '', image: ''});
                      }
                    }}
                    className="mr-2"
                  />
                  Upload Image
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="imageType"
                    value="url"
                    checked={(isAddingAward ? newAward.imageType : 'upload') === 'url'}
                    onChange={() => {
                      if (isAddingAward) {
                        setNewAward({...newAward, imageType: 'url', image: ''});
                      }
                    }}
                    className="mr-2"
                  />
                  Image URL
                </label>
              </div>

              {/* File Upload */}
              {(isAddingAward ? newAward.imageType : 'upload') === 'upload' && (
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileUpload(file);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Maximum file size: 2MB. Supported formats: JPEG, PNG, WebP
                  </p>
                </div>
              )}

              {/* URL Input */}
              {(isAddingAward ? newAward.imageType : 'upload') === 'url' && (
                <div>
                  <Input
                    value={isAddingAward ? newAward.imageUrl : editingAward?.image || ''}
                    onChange={(e) => {
                      if (isAddingAward) {
                        handleImageUrlChange(e.target.value);
                      } else if (editingAward) {
                        setEditingAward({...editingAward, image: e.target.value});
                      }
                    }}
                    placeholder="https://example.com/award-image.jpg"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter a direct URL to an image (must be publicly accessible)
                  </p>
                </div>
              )}

              {/* Image Preview */}
              {(isAddingAward ? newAward.image : editingAward?.image) && (
                <div className="mt-3">
                  <p className="text-sm font-medium mb-2">Preview:</p>
                  <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={isAddingAward ? newAward.image : editingAward?.image || ''}
                      alt="Award preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/placeholder-award.jpg';
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAddingAward ? newAward.isActive : editingAward?.isActive || false}
                  onChange={() => {
                    if (isAddingAward) {
                      setNewAward({...newAward, isActive: !newAward.isActive});
                    } else if (editingAward) {
                      setEditingAward({...editingAward, isActive: !editingAward.isActive});
                    }
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ml-3 text-sm font-medium">
                  {(isAddingAward ? newAward.isActive : editingAward?.isActive) ? 'Active Award' : 'Inactive Award'}
                </span>
              </label>
            </div>
          </div>
        </Card>
      ) : (
        // Awards List
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Awards & Recognitions</h2>

          <div className="space-y-4">
            {awards.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No awards found. Create your first award.
              </div>
            ) : (
              awards.map((award) => (
                <Card key={award._id} className="p-4 border-l-4 hover:shadow-md transition-shadow"
                  style={{ borderLeftColor: award.isActive ? '#3b82f6' : '#9ca3af' }}
                >
                  <div className="flex justify-between items-start gap-4 flex-wrap">
                    <div className="flex-1 flex gap-4">
                      {award.image && (
                        <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                          <img 
                            src={award.image} 
                            alt={award.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/placeholder-award.jpg';
                            }}
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-medium text-lg flex items-center gap-2 mb-2">
                          <Award className="w-5 h-5 text-yellow-500" />
                          {award.title}
                          {award.isActive ? (
                            <Badge className="bg-green-500">Active</Badge>
                          ) : (
                            <Badge className="bg-gray-500">Inactive</Badge>
                          )}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">{award.description}</p>
                        <div className="text-xs text-gray-500">
                          Created: {new Date(award.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingAward(award)}
                        className="text-blue-600"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleAwardStatus(award._id)}
                        className={award.isActive ? "text-gray-600" : "text-green-600"}
                      >
                        {award.isActive ? (
                          <>
                            <XCircle className="h-4 w-4 mr-1" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Activate
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteAward(award._id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
