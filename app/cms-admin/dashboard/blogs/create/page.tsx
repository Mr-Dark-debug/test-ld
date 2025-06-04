'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Toaster, toast } from 'sonner'
import { useRouter } from 'next/navigation'
import {
  ChevronLeft,
  Save,
  Image as ImageIcon,
  Calendar,
  Tag as TagIcon,
  Eye,
  FileText,
  Globe,
  CalendarClock,
  Loader2,
  Check,
  Plus,
  X
} from 'lucide-react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { blogsApi } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'

export default function CreateBlogPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewTab, setPreviewTab] = useState<'write' | 'preview'>('write')
  const [formTab, setFormTab] = useState<'content' | 'settings'>('content')

  // Blog post data
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [coverImagePreview, setCoverImagePreview] = useState<string>('')
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [currentTag, setCurrentTag] = useState('')
  const [publishStatus, setPublishStatus] = useState<'draft' | 'published' | 'scheduled'>('draft')
  const [publishDate, setPublishDate] = useState('')
  const [publishTime, setPublishTime] = useState('')
  const [metaTitle, setMetaTitle] = useState('')
  const [metaDescription, setMetaDescription] = useState('')

  // Sample categories for the dropdown
  const categories = [
    'Architecture',
    'Interior Design',
    'Real Estate',
    'Technology',
    'Lifestyle'
  ]

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Preview image
    const reader = new FileReader()
    reader.onload = () => {
      setCoverImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    setCoverImage(file)

    // Upload image to server
    try {
      const formData = new FormData()
      formData.append('files', file)
      formData.append('type', 'image')
      formData.append('thumbnails', 'true')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data.length > 0) {
          // Store the uploaded image path
          const uploadedImagePath = result.data[0].path
          setCoverImagePreview(uploadedImagePath)
          toast.success('Image uploaded successfully!')
        }
      } else {
        toast.error('Failed to upload image')
      }
    } catch (error) {
      console.error('Image upload error:', error)
      toast.error('Failed to upload image')
    }
  }

  // Generate slug from title
  const generateSlug = () => {
    const generatedSlug = title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-')

    setSlug(generatedSlug)
  }

  // Add tag
  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()])
      setCurrentTag('')
    }
  }

  // Remove tag
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  // Handle publishing options
  const handlePublishStatusChange = (status: 'draft' | 'published' | 'scheduled') => {
    setPublishStatus(status)

    // If publishing now, set the current date and time
    if (status === 'published') {
      const now = new Date()
      setPublishDate(now.toISOString().split('T')[0])
      setPublishTime(now.toTimeString().split(' ')[0].substring(0, 5))
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Form validation with detailed checks
      if (!title.trim()) {
        toast.error('Title is required')
        setIsSubmitting(false)
        return
      }

      if (!content.trim()) {
        toast.error('Content is required')
        setIsSubmitting(false)
        return
      }

      if (content.trim().length < 50) {
        toast.error('Content must be at least 50 characters long')
        setIsSubmitting(false)
        return
      }

      if (!excerpt.trim()) {
        toast.error('Excerpt is required')
        setIsSubmitting(false)
        return
      }

      if (excerpt.trim().length < 10) {
        toast.error('Excerpt must be at least 10 characters long')
        setIsSubmitting(false)
        return
      }

      if (!slug.trim()) {
        toast.error('Slug is required')
        setIsSubmitting(false)
        return
      }

      if (!category) {
        toast.error('Category is required')
        setIsSubmitting(false)
        return
      }

      if (publishStatus === 'scheduled' && (!publishDate || !publishTime)) {
        toast.error('Publish date and time are required for scheduled posts')
        setIsSubmitting(false)
        return
      }

      // Prepare data for submission according to API schema
      const blogPostData = {
        title: title.trim(),
        content: content.trim(),
        excerpt: excerpt.trim(),
        category,
        tags,
        status: publishStatus,
        coverImage: coverImagePreview || '', // Include the uploaded image path
        author: {
          name: user?.name || "Admin User",
          avatar: user?.profileImage || ""
        },
        seoMeta: {
          title: metaTitle.trim() || title.trim(),
          description: metaDescription.trim() || excerpt.trim(),
          keywords: tags
        }
      }

      // Submit to real API
      const response = await blogsApi.create(blogPostData);

      if (response.success) {
        toast.success('Blog post created successfully!');

        // Redirect to blog list after successful creation
        setTimeout(() => {
          router.push('/cms-admin/dashboard/blogs');
        }, 1000);
      } else {
        toast.error(response.error || 'Failed to create blog post');
      }
    } catch (error: any) {
      console.error('Error creating blog post:', error)

      // Handle different types of errors with user-friendly messages
      if (error.message) {
        const errorMessage = error.message;

        // Parse specific validation errors
        if (errorMessage.includes('"content" length must be at least')) {
          toast.error('Content must be at least 50 characters long');
        } else if (errorMessage.includes('"excerpt" length must be at least')) {
          toast.error('Excerpt must be at least 10 characters long');
        } else if (errorMessage.includes('"author" is required')) {
          toast.error('Author information is missing. Please try logging in again.');
        } else if (errorMessage.includes('duplicate key')) {
          toast.error('A blog post with this title or slug already exists. Please use a different title.');
        } else if (errorMessage.includes('validation failed')) {
          // Extract specific validation errors from the message
          const validationErrors = errorMessage.split(',').map((err: string) => err.trim());
          validationErrors.forEach((err: string) => {
            if (err.includes('content')) {
              toast.error('Content validation failed: Please check your content length');
            } else if (err.includes('excerpt')) {
              toast.error('Excerpt validation failed: Please check your excerpt length');
            } else if (err.includes('title')) {
              toast.error('Title validation failed: Please check your title');
            } else {
              toast.error(err);
            }
          });
        } else {
          // Show the full error message for other errors
          toast.error(errorMessage);
        }
      } else {
        toast.error('Failed to create blog post. Please check your internet connection and try again.');
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Toaster position="top-right" expand={true} richColors />

      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Link
              href="/cms-admin/dashboard/blogs"
              className="mr-4 p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold">Create New Blog Post</h1>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => setPreviewTab(previewTab === 'write' ? 'preview' : 'write')}
            >
              {previewTab === 'write' ? (
                <>
                  <Eye className="h-4 w-4" />
                  Preview
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4" />
                  Write
                </>
              )}
            </Button>

            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Post
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main editor */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <Tabs value={formTab} onValueChange={(value) => setFormTab(value as 'content' | 'settings')}>
                <TabsList className="mb-4">
                  <TabsTrigger value="content" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Content
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    SEO & Settings
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-4">
                  {/* Title */}
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter blog post title"
                      className="mt-1"
                    />
                  </div>

                  {/* Slug */}
                  <div>
                    <div className="flex justify-between">
                      <Label htmlFor="slug">Slug</Label>
                      <button
                        type="button"
                        onClick={generateSlug}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Generate from title
                      </button>
                    </div>
                    <Input
                      id="slug"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="enter-post-slug"
                      className="mt-1"
                    />
                  </div>

                  {/* Content */}
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-1">
                      <Label htmlFor="content">Content (Markdown) *</Label>
                      <div className={`text-xs ${content.length < 50 ? 'text-red-500' : 'text-gray-500'}`}>
                        {content.length} / 50+ characters required
                      </div>
                    </div>

                    {previewTab === 'write' ? (
                      <Textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write your blog post content in Markdown format..."
                        className="min-h-[300px] font-mono mt-1"
                      />
                    ) : (
                      <div className="border rounded-md p-4 min-h-[300px] mt-1 prose prose-sm max-w-none">
                        {content ? (
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {content}
                          </ReactMarkdown>
                        ) : (
                          <div className="text-gray-400 italic">
                            Preview will appear here...
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Excerpt */}
                  <div>
                    <div className="flex justify-between">
                      <Label htmlFor="excerpt">Excerpt (Summary) *</Label>
                      <div className={`text-xs ${excerpt.length < 10 ? 'text-red-500' : excerpt.length > 200 ? 'text-orange-500' : 'text-gray-500'}`}>
                        {excerpt.length} / 10-200 characters
                      </div>
                    </div>
                    <Textarea
                      id="excerpt"
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      placeholder="Brief summary of the blog post (used in listings and SEO)"
                      className="mt-1 resize-none h-20"
                      maxLength={200}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="space-y-4">
                  {/* SEO Settings */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">SEO Settings</h3>

                    <div>
                      <Label htmlFor="metaTitle">Meta Title</Label>
                      <Input
                        id="metaTitle"
                        value={metaTitle}
                        onChange={(e) => setMetaTitle(e.target.value)}
                        placeholder="SEO title (defaults to post title if empty)"
                        className="mt-1"
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        {metaTitle.length} / 60 characters
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="metaDescription">Meta Description</Label>
                      <Textarea
                        id="metaDescription"
                        value={metaDescription}
                        onChange={(e) => setMetaDescription(e.target.value)}
                        placeholder="SEO description (defaults to excerpt if empty)"
                        className="mt-1 resize-none h-20"
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        {metaDescription.length} / 160 characters
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Settings */}
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Publish Settings</h3>

              <div className="space-y-4">
                {/* Publishing options */}
                <div>
                  <Label className="mb-2 block">Status</Label>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="draft"
                        name="publishStatus"
                        checked={publishStatus === 'draft'}
                        onChange={() => handlePublishStatusChange('draft')}
                        className="mr-2"
                      />
                      <label htmlFor="draft" className="text-sm">Save as Draft</label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="publish"
                        name="publishStatus"
                        checked={publishStatus === 'published'}
                        onChange={() => handlePublishStatusChange('published')}
                        className="mr-2"
                      />
                      <label htmlFor="publish" className="text-sm">Publish Immediately</label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="schedule"
                        name="publishStatus"
                        checked={publishStatus === 'scheduled'}
                        onChange={() => handlePublishStatusChange('scheduled')}
                        className="mr-2"
                      />
                      <label htmlFor="schedule" className="text-sm">Schedule for Later</label>
                    </div>
                  </div>
                </div>

                {/* Schedule settings */}
                {publishStatus === 'scheduled' && (
                  <div className="pl-6 border-l-2 border-blue-200 space-y-2">
                    <div>
                      <Label htmlFor="publishDate">Publish Date</Label>
                      <div className="flex items-center mt-1">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        <Input
                          type="date"
                          id="publishDate"
                          value={publishDate}
                          onChange={(e) => setPublishDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="publishTime">Publish Time</Label>
                      <div className="flex items-center mt-1">
                        <CalendarClock className="h-4 w-4 mr-2 text-gray-400" />
                        <Input
                          type="time"
                          id="publishTime"
                          value={publishTime}
                          onChange={(e) => setPublishTime(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        {publishStatus === 'draft' ? 'Save Draft' :
                         publishStatus === 'published' ? 'Publish Now' : 'Schedule Post'}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>

            {/* Categories & Tags */}
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Categories & Tags</h3>

              <div className="space-y-4">
                {/* Category */}
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tags */}
                <div>
                  <Label htmlFor="tags">Tags</Label>
                  <div className="flex items-center mt-1">
                    <Input
                      id="tags"
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      placeholder="Add a tag"
                      className="flex-1"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addTag()
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={addTag}
                      className="ml-2 flex-shrink-0"
                      variant="outline"
                      size="sm"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag) => (
                      <div
                        key={tag}
                        className="flex items-center bg-gray-100 text-gray-800 text-xs rounded-full px-2 py-1"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 text-gray-500 hover:text-gray-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    {tags.length === 0 && (
                      <div className="text-xs text-gray-500 italic">No tags added yet</div>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Featured Image */}
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Featured Image</h3>

              <div className="space-y-4">
                {coverImagePreview ? (
                  <div className="relative">
                    <img
                      src={coverImagePreview}
                      alt="Cover"
                      className="w-full h-40 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setCoverImage(null)
                        setCoverImagePreview('')
                      }}
                      className="absolute top-2 right-2 p-1 bg-gray-800 bg-opacity-50 rounded-full text-white hover:bg-opacity-70"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                    <ImageIcon className="h-8 w-8 mx-auto text-gray-400" />
                    <p className="mt-1 text-sm text-gray-500">Upload a cover image</p>
                  </div>
                )}

                <div>
                  <Label htmlFor="image" className="sr-only">
                    Upload Cover Image
                  </Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Recommended size: 1200x630 pixels
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}