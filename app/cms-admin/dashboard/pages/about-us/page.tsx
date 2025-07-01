'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/Button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, Save, Upload, Image as ImageIcon, Menu, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { uploadApi } from '@/lib/api'

interface AboutUsContent {
  heroSection: {
    tagline: string
    title: string
    titleHighlight: string
    description: string
    buttonText: string
    backgroundImage: string
  }
  companySection: {
    tagline: string
    title: string
    description1: string
    description2: string
    image: string
  }
  missionVisionValues: {
    sectionTagline: string
    sectionTitle: string
    sectionDescription: string
    items: {
      title: string
      description: string
    }[]
  }
  portfolioSection: {
    tagline: string
    title: string
    description: string
    buttonText: string
    projects: {
      title: string
      category: string
      image: string
    }[]
  }
  ctaSection: {
    title: string
    description: string
    primaryButton: {
      text: string
      href: string
    }
    secondaryButton: {
      text: string
      href: string
    }
  }
}

const defaultContent: AboutUsContent = {
  heroSection: {
    tagline: 'Laxmi Developers',
    title: 'Brick by Brick ',
    titleHighlight: 'Building Excellence',
    description: 'With over a decade of excellence in real estate development, we transform visions into reality through innovative design and uncompromising quality.',
    buttonText: 'Our Projects',
    backgroundImage: '/images/hero/hero-1.jpg'
  },
  companySection: {
    tagline: 'Our Story',
    title: 'Pioneering Excellence in Real Estate',
    description1: 'Excellence in Real Estate Development',
    description2: 'Our Foundation',
    image: '/images/homepage/about.jpg'
  },
  missionVisionValues: {
    sectionTagline: 'Mission, Vision & Values',
    sectionTitle: 'The principles that guide everything we do',
    sectionDescription: '',
    items: [
      {
        title: 'Mission',
        description: 'To create exceptional living and working spaces that enhance the quality of life for our customers while contributing to sustainable urban development.'
      },
      {
        title: 'Vision',
        description: 'To be the most trusted and innovative real estate developer, setting new standards for quality, design, and customer experience.'
      },
      {
        title: 'Values',
        description: 'Integrity, Innovation, Quality, Customer Focus, and Sustainability drive every decision we make and every project we undertake.'
      }
    ]
  },
  portfolioSection: {
    tagline: 'Our Work',
    title: 'Featured Projects',
    description: 'Discover some of our most prestigious developments',
    buttonText: 'View All Projects',
    projects: [
      {
        title: 'Millennium Park',
        category: 'Residential',
        image: '/images/projects/Millennium Park.jpg'
      },
      {
        title: 'Business Hub',
        category: 'Commercial',
        image: '/images/projects/Millennium Business Hub.jpg'
      },
      {
        title: 'Laxmi Nova',
        category: 'Residential',
        image: '/images/projects/Laxmi Nova.jpg'
      }
    ]
  },
  ctaSection: {
    title: 'Ready to Start Your Journey?',
    description: 'Let us help you find your perfect space or investment opportunity.',
    primaryButton: {
      text: 'Contact Us',
      href: '/contact'
    },
    secondaryButton: {
      text: 'View Projects',
      href: '/projects'
    }
  }
}

export default function AboutUsPage() {
  const [content, setContent] = useState<AboutUsContent>(defaultContent)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('hero')
  const [menuOpen, setMenuOpen] = useState(false)
  const [uploadingImages, setUploadingImages] = useState<Record<string, boolean>>({})
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})
  
  const tabs = [
    { id: 'hero', label: 'Hero Section' },
    { id: 'company', label: 'Company Section' },
    { id: 'mission', label: 'Mission & Values' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'cta', label: 'CTA Section' }
  ]
  
  const currentTabIndex = tabs.findIndex(tab => tab.id === activeTab)
  
  const goToNextTab = () => {
    if (currentTabIndex < tabs.length - 1) {
      setActiveTab(tabs[currentTabIndex + 1].id)
    }
  }
  
  const goToPrevTab = () => {
    if (currentTabIndex > 0) {
      setActiveTab(tabs[currentTabIndex - 1].id)
    }
  }
  
  // Fetch content from API
  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/about-us')
        const data = await response.json()

        if (data.success && data.data) {
          setContent(data.data)
        } else {
          console.error('Failed to fetch about us content:', data.error)
          // Use default content as fallback
          setContent(defaultContent)
        }
      } catch (error) {
        console.error('Error fetching about us content:', error)
        // Use default content as fallback
        setContent(defaultContent)
      } finally {
        setIsLoading(false)
      }
    }

    fetchContent()
  }, [])
  
  const handleSave = async () => {
    setIsSaving(true)

    try {
      const response = await fetch('/api/about-us', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(content),
      })

      const data = await response.json()

      if (data.success) {
        alert('Content saved successfully!')
      } else {
        throw new Error(data.error || 'Failed to save content')
      }
    } catch (error) {
      console.error('Error saving content:', error)
      alert('Failed to save content. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }
  
  const handleInputChange = (section: keyof AboutUsContent, field: string, value: string) => {
    setContent(prev => {
      const currentSection = prev[section] as any; // Add type assertion
      return {
        ...prev,
        [section]: {
          ...currentSection,
          [field]: value
        }
      };
    });
  }
  
  const handleNestedInputChange = (
    section: keyof AboutUsContent,
    nestedSectionKey: string, // Changed from nestedSection to nestedSectionKey for clarity
    field: string,
    value: string
  ) => {
    setContent(prev => {
      const currentSection = prev[section] as any;
      const nestedSection = currentSection[nestedSectionKey] as any;
      return {
        ...prev,
        [section]: {
          ...currentSection,
          [nestedSectionKey]: {
            ...nestedSection,
            [field]: value
          }
        }
      };
    });
  }
  
  const handleArrayItemChange = (
    section: keyof AboutUsContent,
    arrayName: string,
    index: number,
    field: string,
    value: string
  ) => {
    setContent(prev => {
      const currentSection = prev[section] as any;
      const currentArray = currentSection[arrayName] as any[];
      const newArray = [...currentArray];
      newArray[index] = { ...newArray[index], [field]: value };

      return {
        ...prev,
        [section]: {
          ...currentSection,
          [arrayName]: newArray
        }
      }
    })
  }

  const handleImageUpload = async (
    section: keyof AboutUsContent,
    field: string,
    file: File,
    arrayIndex?: number,
    arrayName?: string
  ) => {
    const uploadKey = arrayIndex !== undefined ? `${section}_${arrayName}_${arrayIndex}_${field}` : `${section}_${field}`;

    try {
      setUploadingImages(prev => ({ ...prev, [uploadKey]: true }));

      const fileList = new DataTransfer();
      fileList.items.add(file);

      const response = await uploadApi.uploadFiles(fileList.files, 'image', false);

      if (response.success && response.data && response.data.length > 0) {
        const uploadedFile = response.data[0];

        if (arrayIndex !== undefined && arrayName) {
          // Handle array item image update
          handleArrayItemChange(section, arrayName, arrayIndex, field, uploadedFile.path);
        } else {
          // Handle direct field image update
          handleInputChange(section, field, uploadedFile.path);
        }
      } else {
        throw new Error(response.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingImages(prev => ({ ...prev, [uploadKey]: false }));
    }
  }

  const handleImageUrlInput = (
    section: keyof AboutUsContent,
    field: string,
    url: string,
    arrayIndex?: number,
    arrayName?: string
  ) => {
    if (arrayIndex !== undefined && arrayName) {
      handleArrayItemChange(section, arrayName, arrayIndex, field, url);
    } else {
      handleInputChange(section, field, url);
    }
  }

  // Image Upload Component
  const ImageUploadSection = ({
    label,
    currentImage,
    section,
    field,
    arrayIndex,
    arrayName
  }: {
    label: string;
    currentImage: string;
    section: keyof AboutUsContent;
    field: string;
    arrayIndex?: number;
    arrayName?: string;
  }) => {
    const uploadKey = arrayIndex !== undefined ? `${section}_${arrayName}_${arrayIndex}_${field}` : `${section}_${field}`;
    const isUploading = uploadingImages[uploadKey];
    const [imageUrl, setImageUrl] = useState('');

    return (
      <div>
        <label className="block text-sm font-medium mb-1">{label}</label>

        {/* URL Input */}
        <div className="mb-2">
          <Input
            placeholder="Enter image URL or upload file below"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            onBlur={() => {
              if (imageUrl.trim()) {
                handleImageUrlInput(section, field, imageUrl.trim(), arrayIndex, arrayName);
                setImageUrl('');
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && imageUrl.trim()) {
                handleImageUrlInput(section, field, imageUrl.trim(), arrayIndex, arrayName);
                setImageUrl('');
              }
            }}
          />
        </div>

        {/* Image Preview and Upload */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 h-64 flex flex-col items-center justify-center">
          {currentImage ? (
            <div className="relative w-full h-full">
              <img
                src={currentImage}
                alt={label}
                className="w-full h-full object-cover rounded-lg"
              />
              <Button
                variant="outline"
                size="sm"
                className="absolute bottom-2 right-2 bg-white text-xs p-1 sm:p-2"
                onClick={() => handleImageUrlInput(section, field, '', arrayIndex, arrayName)}
              >
                Change
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <ImageIcon className="w-12 h-12 mx-auto text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">Upload image or enter URL above</p>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={(el) => {
                  if (el) fileInputRefs.current[uploadKey] = el;
                }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleImageUpload(section, field, file, arrayIndex, arrayName);
                  }
                }}
              />
              <Button
                variant="outline"
                size="sm"
                className="mt-2 text-xs p-1 sm:p-2 w-full sm:w-auto"
                onClick={() => fileInputRefs.current[uploadKey]?.click()}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-3 h-3 mr-1" />
                    Upload Image
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2 text-lg">Loading content...</span>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto py-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex items-center w-full justify-between sm:justify-start">
          <h1 className="text-2xl font-bold">Edit About Us Page</h1>
          <Button 
            variant="ghost" 
            size="icon" 
            className="sm:hidden"
            onClick={() => setMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="w-full sm:w-auto flex items-center justify-center gap-2"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
      
      {/* Section Navigation Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start sm:hidden">
          <div className="bg-white rounded-lg shadow-lg mt-16 w-[90%] max-w-md p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Navigate Sections</h2>
              <Button variant="ghost" size="icon" onClick={() => setMenuOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex flex-col gap-2">
              {tabs.map(tab => (
                <Button 
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => {
                    setActiveTab(tab.id)
                    setMenuOpen(false)
                  }}
                >
                  {tab.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Desktop Tabs - Hidden on Mobile */}
        <TabsList className="hidden sm:flex overflow-x-auto pb-2 mb-8 border-b">
          <TabsTrigger 
            value="hero" 
            className="px-4 py-2 min-w-[120px] text-center rounded-t-md"
          >
            Hero Section
          </TabsTrigger>
          <TabsTrigger 
            value="company" 
            className="px-4 py-2 min-w-[120px] text-center rounded-t-md"
          >
            Company Section
          </TabsTrigger>
          <TabsTrigger
            value="mission"
            className="px-4 py-2 min-w-[120px] text-center rounded-t-md"
          >
            Mission & Values
          </TabsTrigger>
          <TabsTrigger
            value="portfolio"
            className="px-4 py-2 min-w-[120px] text-center rounded-t-md"
          >
            Portfolio
          </TabsTrigger>
          <TabsTrigger 
            value="cta" 
            className="px-4 py-2 min-w-[120px] text-center rounded-t-md"
          >
            CTA Section
          </TabsTrigger>
        </TabsList>
        
        {/* Mobile Pagination UI */}
        <div className="flex sm:hidden items-center justify-between mb-4">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={goToPrevTab}
            disabled={currentTabIndex === 0}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <div className="text-center font-medium">
            {tabs[currentTabIndex].label}
          </div>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={goToNextTab}
            disabled={currentTabIndex === tabs.length - 1}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Tab Content */}
        {/* Hero Section Tab */}
        <TabsContent value="hero" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Hero Section</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tagline</label>
                  <Input 
                    value={content.heroSection.tagline} 
                    onChange={(e) => handleInputChange('heroSection', 'tagline', e.target.value)}
                    placeholder="Enter tagline"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <Input 
                    value={content.heroSection.title} 
                    onChange={(e) => handleInputChange('heroSection', 'title', e.target.value)}
                    placeholder="Enter title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Title Highlight (colored text)</label>
                  <Input 
                    value={content.heroSection.titleHighlight} 
                    onChange={(e) => handleInputChange('heroSection', 'titleHighlight', e.target.value)}
                    placeholder="Enter highlighted text"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <Input 
                    value={content.heroSection.description} 
                    onChange={(e) => handleInputChange('heroSection', 'description', e.target.value)}
                    placeholder="Enter description"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Button Text</label>
                  <Input 
                    value={content.heroSection.buttonText} 
                    onChange={(e) => handleInputChange('heroSection', 'buttonText', e.target.value)}
                    placeholder="Enter button text"
                  />
                </div>
              </div>
              
              <ImageUploadSection
                label="Background Image"
                currentImage={content.heroSection.backgroundImage}
                section="heroSection"
                field="backgroundImage"
              />
            </div>
          </Card>
        </TabsContent>
        
        {/* Company Section Tab */}
        <TabsContent value="company" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Company Section</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tagline</label>
                  <Input 
                    value={content.companySection.tagline} 
                    onChange={(e) => handleInputChange('companySection', 'tagline', e.target.value)}
                    placeholder="Enter tagline"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <Input 
                    value={content.companySection.title} 
                    onChange={(e) => handleInputChange('companySection', 'title', e.target.value)}
                    placeholder="Enter title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Description (First Paragraph)</label>
                  <textarea 
                    value={content.companySection.description1} 
                    onChange={(e) => handleInputChange('companySection', 'description1', e.target.value)}
                    placeholder="Enter first paragraph"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Description (Second Paragraph)</label>
                  <textarea 
                    value={content.companySection.description2} 
                    onChange={(e) => handleInputChange('companySection', 'description2', e.target.value)}
                    placeholder="Enter second paragraph"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    rows={3}
                  />
                </div>
              </div>
              
              <ImageUploadSection
                label="Company Image"
                currentImage={content.companySection.image}
                section="companySection"
                field="image"
              />
            </div>
          </Card>
        </TabsContent>
        
        {/* Mission & Values Tab */}
        <TabsContent value="mission" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Mission, Vision & Values</h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Section Tagline</label>
                  <Input 
                    value={content.missionVisionValues.sectionTagline} 
                    onChange={(e) => handleInputChange('missionVisionValues', 'sectionTagline', e.target.value)}
                    placeholder="Enter section tagline"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Section Title</label>
                  <Input 
                    value={content.missionVisionValues.sectionTitle} 
                    onChange={(e) => handleInputChange('missionVisionValues', 'sectionTitle', e.target.value)}
                    placeholder="Enter section title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Section Description</label>
                  <Input 
                    value={content.missionVisionValues.sectionDescription} 
                    onChange={(e) => handleInputChange('missionVisionValues', 'sectionDescription', e.target.value)}
                    placeholder="Enter section description"
                  />
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-4">Values Items</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {content.missionVisionValues.items.map((item, index) => (
                    <Card key={index} className="p-4">
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium mb-1">Title</label>
                          <Input 
                            value={item.title} 
                            onChange={(e) => handleArrayItemChange('missionVisionValues', 'items', index, 'title', e.target.value)}
                            placeholder="Enter title"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Description</label>
                          <textarea 
                            value={item.description} 
                            onChange={(e) => handleArrayItemChange('missionVisionValues', 'items', index, 'description', e.target.value)}
                            placeholder="Enter description"
                            className="w-full p-2 border border-gray-300 rounded-md"
                            rows={4}
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>



        {/* Portfolio Tab */}
        <TabsContent value="portfolio" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Portfolio Section</h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Section Tagline</label>
                  <Input 
                    value={content.portfolioSection.tagline} 
                    onChange={(e) => handleInputChange('portfolioSection', 'tagline', e.target.value)}
                    placeholder="Enter section tagline"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Section Title</label>
                  <Input 
                    value={content.portfolioSection.title} 
                    onChange={(e) => handleInputChange('portfolioSection', 'title', e.target.value)}
                    placeholder="Enter section title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Section Description</label>
                  <Input 
                    value={content.portfolioSection.description} 
                    onChange={(e) => handleInputChange('portfolioSection', 'description', e.target.value)}
                    placeholder="Enter section description"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Button Text</label>
                  <Input 
                    value={content.portfolioSection.buttonText} 
                    onChange={(e) => handleInputChange('portfolioSection', 'buttonText', e.target.value)}
                    placeholder="Enter button text"
                  />
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-4">Featured Projects</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {content.portfolioSection.projects.map((project, index) => (
                    <Card key={index} className="p-4">
                      <div className="space-y-3">
                        <div className="h-40">
                          <ImageUploadSection
                            label="Project Image"
                            currentImage={project.image}
                            section="portfolioSection"
                            field="image"
                            arrayIndex={index}
                            arrayName="projects"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Project Title</label>
                          <Input 
                            value={project.title} 
                            onChange={(e) => handleArrayItemChange('portfolioSection', 'projects', index, 'title', e.target.value)}
                            placeholder="Enter project title"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Project Category</label>
                          <Input 
                            value={project.category} 
                            onChange={(e) => handleArrayItemChange('portfolioSection', 'projects', index, 'category', e.target.value)}
                            placeholder="Enter project category"
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        {/* CTA Section Tab */}
        <TabsContent value="cta" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Call to Action Section</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <Input 
                    value={content.ctaSection.title} 
                    onChange={(e) => handleInputChange('ctaSection', 'title', e.target.value)}
                    placeholder="Enter title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea 
                    value={content.ctaSection.description} 
                    onChange={(e) => handleInputChange('ctaSection', 'description', e.target.value)}
                    placeholder="Enter description"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-md font-medium mb-3">Primary Button</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Text</label>
                      <Input 
                        value={content.ctaSection.primaryButton.text} 
                        onChange={(e) => handleNestedInputChange('ctaSection', 'primaryButton', 'text', e.target.value)}
                        placeholder="Enter button text"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Link</label>
                      <Input 
                        value={content.ctaSection.primaryButton.href} 
                        onChange={(e) => handleNestedInputChange('ctaSection', 'primaryButton', 'href', e.target.value)}
                        placeholder="Enter button link"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium mb-3">Secondary Button</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Text</label>
                      <Input 
                        value={content.ctaSection.secondaryButton.text} 
                        onChange={(e) => handleNestedInputChange('ctaSection', 'secondaryButton', 'text', e.target.value)}
                        placeholder="Enter button text"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Link</label>
                      <Input 
                        value={content.ctaSection.secondaryButton.href} 
                        onChange={(e) => handleNestedInputChange('ctaSection', 'secondaryButton', 'href', e.target.value)}
                        placeholder="Enter button link"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}