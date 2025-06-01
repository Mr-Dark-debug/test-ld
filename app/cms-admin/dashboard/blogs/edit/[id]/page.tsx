'use client'

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Toaster, toast } from 'sonner'
import { useRouter, useParams } from 'next/navigation'
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
  X,
  Trash2,
  ArrowUpRight
} from 'lucide-react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { blogsApi } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { logActivity } from '@/lib/activity'

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewTab, setPreviewTab] = useState('write');
  const [formTab, setFormTab] = useState('content');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Blog post data
  const [id, setId] = useState('');
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState('');
  const [publishStatus, setPublishStatus] = useState('draft');
  const [publishDate, setPublishDate] = useState('');
  const [publishTime, setPublishTime] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [readingTime, setReadingTime] = useState('');
  const [createdAt, setCreatedAt] = useState('');

  // Sample categories for the dropdown
  const categories = [
    'Architecture',
    'Interior Design',
    'Real Estate',
    'Technology',
    'Lifestyle'
  ];

  // Load blog data
  useEffect(() => {
    const loadBlogData = async () => {
      if (!params.id) {
        toast.error('No blog post ID provided');
        router.push('/cms-admin/dashboard/blogs');
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Fetch blog post by ID from API
        const response = await blogsApi.getById(params.id as string);

        if (!response.success || !response.data) {
          toast.error('Blog post not found');
          router.push('/cms-admin/dashboard/blogs');
          return;
        }

        const blogPost = response.data;

        // Populate form data
        setId(blogPost._id);
        setTitle(blogPost.title);
        setSlug(blogPost.slug);
        setContent(blogPost.content);
        setExcerpt(blogPost.excerpt || '');
        setImageUrl(blogPost.imageUrl || '');
        setCoverImagePreview(blogPost.imageUrl || '');
        setCategory(blogPost.category);
        setTags(blogPost.tags || []);
        setPublishStatus(blogPost.status);
        setAuthor(blogPost.createdBy?.name || '');
        setAuthorId(blogPost.createdBy?._id || '');
        setReadingTime(blogPost.readingTime || '');
        setCreatedAt(blogPost.createdAt);
        setMetaTitle(blogPost.metaTitle || '');
        setMetaDescription(blogPost.metaDescription || '');

        // Parse publish date and time if available
        if (blogPost.publishDate) {
          const date = new Date(blogPost.publishDate);
          setPublishDate(date.toISOString().split('T')[0]);
          setPublishTime(date.toTimeString().split(' ')[0].substring(0, 5));
        }

      } catch (error: any) {
        console.error('Error loading blog post:', error);
        setError(error.message || 'Failed to load blog post');
        toast.error('Failed to load blog post');
      } finally {
        setIsLoading(false);
      }
    };

    loadBlogData();
  }, [params.id, router]);

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview image
    const reader = new FileReader();
    reader.onload = () => {
      setCoverImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    setCoverImage(file);
  };

  // Generate slug from title
  const generateSlug = () => {
    const generatedSlug = title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');

    setSlug(generatedSlug);
  };

  // Add tag
  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  // Remove tag
  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Handle publishing options
  const handlePublishStatusChange = (status) => {
    setPublishStatus(status);

    // If publishing now, set the current date and time
    if (status === 'published') {
      const now = new Date();
      setPublishDate(now.toISOString().split('T')[0]);
      setPublishTime(now.toTimeString().split(' ')[0].substring(0, 5));
    }
  };

  // Calculate reading time based on content
  const calculateReadingTime = () => {
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Form validation
      if (!title) {
        toast.error('Title is required');
        setIsSubmitting(false);
        return;
      }

      if (!content) {
        toast.error('Content is required');
        setIsSubmitting(false);
        return;
      }

      if (!slug) {
        toast.error('Slug is required');
        setIsSubmitting(false);
        return;
      }

      if (!category) {
        toast.error('Category is required');
        setIsSubmitting(false);
        return;
      }

      if (publishStatus === 'scheduled' && (!publishDate || !publishTime)) {
        toast.error('Publish date and time are required for scheduled posts');
        setIsSubmitting(false);
        return;
      }

      // Update reading time
      const updatedReadingTime = calculateReadingTime();

      // Prepare data for submission
      const blogPostData = {
        title,
        slug,
        content,
        excerpt: excerpt || content.substring(0, 150) + '...',
        category,
        tags,
        status: publishStatus,
        publishDate: publishStatus === 'scheduled' ? `${publishDate}T${publishTime}:00` :
                    publishStatus === 'published' ? new Date().toISOString() : null,
        metaTitle: metaTitle || title,
        metaDescription: metaDescription || excerpt,
        readingTime: updatedReadingTime,
        imageUrl: coverImage ? coverImagePreview : imageUrl // If new image uploaded, use preview; otherwise use original URL
      };

      // Update blog post via API
      const response = await blogsApi.update(slug, blogPostData);

      if (response.success) {
        toast.success('Blog post updated successfully!');

        // Log activity
        if (user) {
          await logActivity({
            type: 'blog',
            action: 'update',
            title: `Updated blog post: ${title}`,
            userId: user._id,
            userName: user.name,
            entityId: id,
            entityType: 'blog'
          });
        }

        // Redirect to blog list after successful update
        setTimeout(() => {
          router.push('/cms-admin/dashboard/blogs');
        }, 1000);
      } else {
        toast.error(response.error || 'Failed to update blog post');
      }
    } catch (error) {
      console.error('Error updating blog post:', error);
      toast.error('Failed to update blog post');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete blog post
  const handleDelete = async () => {
    if (confirmDelete) {
      try {
        const response = await blogsApi.delete(slug);

        if (response.success) {
          toast.success('Blog post deleted successfully!');

          // Log activity
          if (user) {
            await logActivity({
              type: 'blog',
              action: 'delete',
              title: `Deleted blog post: ${title}`,
              userId: user._id,
              userName: user.name,
              entityId: id,
              entityType: 'blog'
            });
          }

          setTimeout(() => {
            router.push('/cms-admin/dashboard/blogs');
          }, 1000);
        } else {
          toast.error(response.error || 'Failed to delete blog post');
        }
      } catch (error: any) {
        console.error('Error deleting blog post:', error);
        toast.error('Failed to delete blog post');
      }
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2 text-gray-600">Loading blog post...</span>
      </div>
    );
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
            <h1 className="text-2xl font-bold">Edit Blog Post</h1>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className={`text-red-600 border-red-200 hover:bg-red-50 ${
                confirmDelete ? 'bg-red-50 text-red-700 border-red-300' : ''
              }`}
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4 mr-1.5" />
              {confirmDelete ? 'Confirm Delete' : 'Delete'}
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => window.open(`/blogs/${slug}`, '_blank')}
              disabled={publishStatus !== 'published'}
            >
              <Eye className="h-4 w-4 mr-1.5" />
              Preview
              <ArrowUpRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content (2/3 width on large screens) */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6">
                <Tabs defaultValue="write" className="w-full" onValueChange={setPreviewTab}>
                  <div className="flex justify-between items-center mb-4">
                    <TabsList>
                      <TabsTrigger value="write" className="flex items-center">
                        <FileText className="h-4 w-4 mr-1.5" />
                        Write
                      </TabsTrigger>
                      <TabsTrigger value="preview" className="flex items-center">
                        <Eye className="h-4 w-4 mr-1.5" />
                        Preview
                      </TabsTrigger>
                    </TabsList>

                    <Button type="submit" disabled={isSubmitting} className="ml-auto">
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-1.5" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>

                  <TabsContent value="write" className="space-y-4 mt-0">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        placeholder="Enter blog post title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="text-lg font-medium"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="slug">Slug</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={generateSlug}
                          className="text-xs h-6 px-2"
                        >
                          Generate from Title
                        </Button>
                      </div>
                      <Input
                        id="slug"
                        placeholder="enter-blog-post-slug"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        className="text-sm font-mono"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="excerpt">Excerpt</Label>
                      <Textarea
                        id="excerpt"
                        placeholder="Brief summary of your post (optional)"
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        className="resize-none h-20"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="content">Content (Markdown)</Label>
                      <Textarea
                        id="content"
                        placeholder="Write your blog post content here using Markdown..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="font-mono resize-none h-80 lg:h-96"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="preview" className="mt-0">
                    <div className="border rounded-lg p-6 prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none min-h-[300px]">
                      <h1>{title}</h1>
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {content || '*No content yet. Switch to Write tab to add content.*'}
                      </ReactMarkdown>
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>
            </div>

            {/* Sidebar (1/3 width on large screens) */}
            <div className="space-y-6">
              <Card className="p-6">
                <Tabs defaultValue="content" className="w-full" onValueChange={setFormTab}>
                  <TabsList className="mb-4 w-full">
                    <TabsTrigger value="content" className="flex-1">Content</TabsTrigger>
                    <TabsTrigger value="settings" className="flex-1">SEO & Meta</TabsTrigger>
                  </TabsList>

                  <TabsContent value="content" className="space-y-4 mt-0">
                    {/* Publish Settings */}
                    <div className="space-y-3">
                      <Label>Publishing Options</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <Button
                          type="button"
                          variant={publishStatus === 'draft' ? 'default' : 'outline'}
                          onClick={() => handlePublishStatusChange('draft')}
                          className="flex-1 text-sm"
                        >
                          <FileText className="h-4 w-4 mr-1.5" />
                          Draft
                        </Button>
                        <Button
                          type="button"
                          variant={publishStatus === 'published' ? 'default' : 'outline'}
                          onClick={() => handlePublishStatusChange('published')}
                          className="flex-1 text-sm"
                        >
                          <Globe className="h-4 w-4 mr-1.5" />
                          Publish
                        </Button>
                        <Button
                          type="button"
                          variant={publishStatus === 'scheduled' ? 'default' : 'outline'}
                          onClick={() => handlePublishStatusChange('scheduled')}
                          className="flex-1 text-sm"
                        >
                          <CalendarClock className="h-4 w-4 mr-1.5" />
                          Schedule
                        </Button>
                      </div>

                      {publishStatus === 'scheduled' && (
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div className="space-y-1">
                            <Label htmlFor="publish-date" className="text-xs">Date</Label>
                            <Input
                              id="publish-date"
                              type="date"
                              value={publishDate}
                              onChange={(e) => setPublishDate(e.target.value)}
                              min={new Date().toISOString().split('T')[0]}
                              className="text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="publish-time" className="text-xs">Time</Label>
                            <Input
                              id="publish-time"
                              type="time"
                              value={publishTime}
                              onChange={(e) => setPublishTime(e.target.value)}
                              className="text-sm"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Featured Image */}
                    <div className="space-y-3">
                      <Label>Featured Image</Label>
                      <div className="border-2 border-dashed rounded-lg p-4 text-center">
                        {coverImagePreview ? (
                          <div className="relative">
                            <img
                              src={coverImagePreview}
                              alt="Blog cover"
                              className="mx-auto h-36 rounded-md object-cover w-full"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="mt-2 absolute top-1 right-1 bg-white h-8 w-8 p-0 rounded-full"
                              onClick={() => {
                                setCoverImagePreview('');
                                setCoverImage(null);
                                setImageUrl('');
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-4">
                            <ImageIcon className="h-10 w-10 text-gray-400 mb-2" />
                            <Label
                              htmlFor="image-upload"
                              className="text-sm text-primary cursor-pointer hover:underline"
                            >
                              Upload an image
                            </Label>
                            <p className="text-xs text-gray-500 mt-1">
                              Recommended: 1200 x 630 pixels
                            </p>
                          </div>
                        )}
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          aria-label="Upload cover image for blog post"
                          title="Upload cover image for blog post"
                        />
                      </div>
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-primary"
                        aria-label="Select blog category"
                        title="Select blog category"
                      >
                        <option value="" disabled>
                          Select a category
                        </option>
                        {categories.map((cat, index) => (
                          <option key={index} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Author */}
                    <div className="space-y-2">
                      <Label htmlFor="author">Author</Label>
                      <Input
                        id="author"
                        placeholder="Author name"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                      />
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags</Label>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {tags.map((tag, index) => (
                          <div
                            key={index}
                            className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800"
                          >
                            <TagIcon className="h-3 w-3 mr-1" />
                            {tag}
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 ml-1 p-0 text-gray-500 hover:text-red-500 hover:bg-transparent"
                              onClick={() => removeTag(tag)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          id="tags"
                          placeholder="Add a tag and press enter"
                          value={currentTag}
                          onChange={(e) => setCurrentTag(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addTag();
                            }
                          }}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={addTag}
                          className="h-10 w-10"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="settings" className="space-y-4 mt-0">
                    {/* SEO Title */}
                    <div className="space-y-2">
                      <Label htmlFor="meta-title">SEO Title</Label>
                      <Input
                        id="meta-title"
                        placeholder="Meta title for search engines (optional)"
                        value={metaTitle}
                        onChange={(e) => setMetaTitle(e.target.value)}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {metaTitle.length} / 60 characters
                        {metaTitle.length > 60 && (
                          <span className="text-red-500"> (too long)</span>
                        )}
                      </p>
                    </div>

                    {/* SEO Description */}
                    <div className="space-y-2">
                      <Label htmlFor="meta-description">SEO Description</Label>
                      <Textarea
                        id="meta-description"
                        placeholder="Meta description for search engines (optional)"
                        value={metaDescription}
                        onChange={(e) => setMetaDescription(e.target.value)}
                        className="resize-none h-20"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {metaDescription.length} / 160 characters
                        {metaDescription.length > 160 && (
                          <span className="text-red-500"> (too long)</span>
                        )}
                      </p>
                    </div>

                    {/* Created & Updated Info */}
                    <div className="space-y-2 border-t pt-4 mt-6">
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Created</span>
                        <span>{new Date(createdAt).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Reading Time</span>
                        <span>{readingTime || calculateReadingTime()}</span>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>

              <div className="sticky top-20">
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-1.5" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}