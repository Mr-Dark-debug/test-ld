'use client'

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/badge'
import AnimatedBackground from '@/components/ui/animated-tabs'
import { Input } from '@/components/ui/input'
import { 
  Loader2, 
  Search, 
  Plus, 
  FileText, 
  Edit, 
  Trash2, 
  Calendar, 
  User, 
  Eye, 
  Share2, 
  Tag,
  Filter,
  Clock,
  CalendarClock,
  ArrowUpRight
} from 'lucide-react'
import Link from 'next/link'
import { Toaster } from 'sonner'

interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  category: string
  status: 'draft' | 'published' | 'scheduled'
  publishDate: string
  createdAt: string
  updatedAt: string
  imageUrl: string
  readingTime: string
  tags: string[]
  metaTitle?: string
  metaDescription?: string
}

export default function BlogsAdminPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null)

  // Sample categories for the filter
  const categories = [
    'Architecture',
    'Interior Design',
    'Real Estate',
    'Technology',
    'Lifestyle'
  ]

  useEffect(() => {
    // Simulate loading data from API
    setTimeout(() => {
      setBlogPosts([
        {
          id: 1,
          title: "The Future of Sustainable Architecture in Urban Development",
          slug: "the-future-of-sustainable-architecture-in-urban-development",
          excerpt: "Exploring innovative designs and materials that are shaping eco-friendly cityscapes...",
          content: "## The Future of Sustainable Architecture\n\nAs cities continue to expand...",
          author: "AI Architect",
          category: "Architecture",
          status: "published",
          publishDate: "2023-10-26T10:00:00",
          createdAt: "2023-10-20T14:30:00",
          updatedAt: "2023-10-25T09:15:00",
          imageUrl: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
          readingTime: "7 min read",
          tags: ["sustainable", "architecture", "urban", "eco-friendly"],
          metaTitle: "Sustainable Architecture in Urban Development | Laxmi Developers",
          metaDescription: "Explore the future of sustainable architecture in urban development with eco-friendly designs and materials for greener cities."
        },
        {
          id: 2,
          title: "Smart Homes: Integrating Technology for a Modern Lifestyle",
          slug: "smart-homes-integrating-technology-for-a-modern-lifestyle",
          excerpt: "A look into how IoT devices, AI, and automation are transforming residential spaces...",
          content: "## Smart Homes: The Future is Here\n\nThe integration of IoT devices...",
          author: "Tech Explorer",
          category: "Technology",
          status: "published",
          publishDate: "2023-10-22T08:30:00",
          createdAt: "2023-10-15T11:45:00",
          updatedAt: "2023-10-21T16:20:00",
          imageUrl: "https://images.unsplash.com/photo-1529400971027-cadd71752d99",
          readingTime: "5 min read",
          tags: ["smart home", "technology", "IoT", "automation"],
          metaTitle: "Smart Home Technology Integration | Laxmi Developers",
          metaDescription: "Discover how IoT devices and automation are transforming modern homes into smart living spaces."
        },
        {
          id: 3,
          title: "The Art of Interior Design: Creating Spaces That Inspire",
          slug: "the-art-of-interior-design-creating-spaces-that-inspire",
          excerpt: "Principles of interior design that can turn any home into a sanctuary...",
          content: "## The Art of Interior Design\n\nInterior design is more than decoration...",
          author: "Design Maven",
          category: "Interior Design",
          status: "published",
          publishDate: "2023-10-18T09:15:00",
          createdAt: "2023-10-10T13:20:00",
          updatedAt: "2023-10-17T10:45:00",
          imageUrl: "https://images.unsplash.com/photo-1600210492493-419465538468",
          readingTime: "6 min read",
          tags: ["interior design", "home decor", "inspiration", "spaces"],
          metaTitle: "Interior Design Principles for Inspiring Spaces | Laxmi Developers",
          metaDescription: "Learn the principles of interior design that transform houses into inspiring and comfortable homes."
        },
        {
          id: 4,
          title: "Upcoming Trends in Luxury Real Estate for 2024",
          slug: "upcoming-trends-in-luxury-real-estate-for-2024",
          excerpt: "Predicting the luxury real estate market trends for the coming year...",
          content: "## Luxury Real Estate Trends for 2024\n\nThe luxury real estate market is constantly evolving...",
          author: "Market Analyst",
          category: "Real Estate",
          status: "draft",
          publishDate: "",
          createdAt: "2023-11-05T16:40:00",
          updatedAt: "2023-11-05T16:40:00",
          imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
          readingTime: "8 min read",
          tags: ["luxury", "real estate", "trends", "2024", "market"],
          metaTitle: "2024 Luxury Real Estate Trends | Laxmi Developers",
          metaDescription: "Explore our predictions for luxury real estate market trends in 2024 and beyond."
        },
        {
          id: 5,
          title: "Sustainable Landscaping for Modern Properties",
          slug: "sustainable-landscaping-for-modern-properties",
          excerpt: "How eco-friendly landscaping enhances property value and environmental impact...",
          content: "## Sustainable Landscaping\n\nModern landscaping goes beyond aesthetics...",
          author: "Eco Landscaper",
          category: "Architecture",
          status: "scheduled",
          publishDate: "2023-12-10T08:00:00",
          createdAt: "2023-11-01T10:30:00",
          updatedAt: "2023-11-02T14:15:00",
          imageUrl: "https://images.unsplash.com/photo-1558036117-15d82a90b9b1",
          readingTime: "5 min read",
          tags: ["landscaping", "sustainable", "eco-friendly", "property value"],
          metaTitle: "Sustainable Landscaping for Modern Properties | Laxmi Developers",
          metaDescription: "Learn how sustainable landscaping can enhance property value while minimizing environmental impact."
        }
      ])
      setIsLoading(false)
    }, 1000)
  }, [])

  // Filter blog posts based on active tab, search query, and category
  const filteredPosts = blogPosts.filter(post => {
    const matchesTab = 
      activeTab === 'all' || 
      (activeTab === 'published' && post.status === 'published') ||
      (activeTab === 'drafts' && post.status === 'draft') ||
      (activeTab === 'scheduled' && post.status === 'scheduled')
    
    const matchesSearch = 
      searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = 
      categoryFilter === 'all' || 
      post.category === categoryFilter
    
    return matchesTab && matchesSearch && matchesCategory
  })

  // Handle delete confirmation
  const handleDelete = (id: number) => {
    if (confirmDelete === id) {
      // In real app, call API to delete post
      setBlogPosts(blogPosts.filter(post => post.id !== id))
      setConfirmDelete(null)
    } else {
      setConfirmDelete(id)
      // Reset confirmation after 3 seconds
      setTimeout(() => setConfirmDelete(null), 3000)
    }
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Get status badge style
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-500">Published</Badge>
      case 'draft':
        return <Badge className="bg-amber-500">Draft</Badge>
      case 'scheduled':
        return <Badge className="bg-blue-500">Scheduled</Badge>
      default:
        return <Badge className="bg-gray-500">{status}</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2 text-lg">Loading blog posts...</span>
      </div>
    )
  }

  return (
    <>
      <Toaster position="top-right" expand={true} richColors />
      
      <div className="container mx-auto py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold">Blog Management</h1>
          
          <Link href="/cms-admin/dashboard/blogs/create">
            <Button className="w-full sm:w-auto flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create New Post
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card className="p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search posts..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {/* Status Filter */}
              <div className="border rounded-lg overflow-hidden">
                <AnimatedBackground
                  defaultValue={activeTab}
                  className="bg-blue-50"
                  transition={{
                    type: "spring",
                    bounce: 0.2,
                    duration: 0.3,
                  }}
                  onValueChange={(value) => value && setActiveTab(value)}
                >
                  <button
                    data-id="all"
                    className="py-2 px-3 text-sm font-medium text-gray-700 data-[checked=true]:text-blue-600"
                  >
                    All Posts
                  </button>
                  <button
                    data-id="published"
                    className="py-2 px-3 text-sm font-medium text-gray-700 data-[checked=true]:text-blue-600"
                  >
                    Published
                  </button>
                  <button
                    data-id="drafts"
                    className="py-2 px-3 text-sm font-medium text-gray-700 data-[checked=true]:text-blue-600"
                  >
                    Drafts
                  </button>
                  <button
                    data-id="scheduled"
                    className="py-2 px-3 text-sm font-medium text-gray-700 data-[checked=true]:text-blue-600"
                  >
                    Scheduled
                  </button>
                </AnimatedBackground>
              </div>
              
              {/* Category Filter */}
              <select
                className="px-3 py-2 border rounded-lg text-sm"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Blog Posts List */}
        <div className="space-y-4">
          {filteredPosts.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-gray-500 mb-4">No blog posts found matching your filters.</p>
              <Link href="/cms-admin/dashboard/blogs/create">
                <Button variant="outline" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create Your First Post
                </Button>
              </Link>
            </Card>
          ) : (
            filteredPosts.map((post) => (
              <Card key={post.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Post thumbnail */}
                  <div className="md:w-48 h-32 flex-shrink-0 overflow-hidden rounded-lg">
                    {post.imageUrl ? (
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <FileText className="h-10 w-10 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  {/* Post details */}
                  <div className="flex-1">
                    <div className="flex flex-wrap justify-between items-start gap-2">
                      <div>
                        <h3 className="font-medium text-lg">{post.title}</h3>
                        <p className="text-gray-500 text-sm mt-1">{post.excerpt.substring(0, 120)}...</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {getStatusBadge(post.status)}
                        <Badge variant="outline" className="mt-1">{post.category}</Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 mt-3 text-sm text-gray-600">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        <span>{post.author}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{post.readingTime}</span>
                      </div>
                      
                      <div className="flex items-center">
                        {post.status === 'scheduled' ? (
                          <>
                            <CalendarClock className="h-4 w-4 mr-2" />
                            <span>Scheduled for: {formatDate(post.publishDate)}</span>
                          </>
                        ) : (
                          <>
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>
                              {post.status === 'published' 
                                ? `Published: ${formatDate(post.publishDate)}`
                                : `Last updated: ${formatDate(post.updatedAt)}`
                              }
                            </span>
                          </>
                        )}
                      </div>
                      
                      <div className="flex items-center flex-wrap gap-1">
                        <Tag className="h-4 w-4 mr-1" />
                        {post.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">
                            {tag}
                          </span>
                        ))}
                        {post.tags.length > 3 && (
                          <span className="text-xs text-gray-500">+{post.tags.length - 3} more</span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 mt-4 justify-end">
                      {post.status === 'published' && (
                        <a 
                          href={`/blogs/${post.slug}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          <Eye className="h-4 w-4 mr-1.5" />
                          View Post
                          <ArrowUpRight className="h-3 w-3 ml-1" />
                        </a>
                      )}
                      
                      <Link href={`/cms-admin/dashboard/blogs/edit/${post.id}`}>
                        <Button variant="outline" size="sm" className="flex items-center">
                          <Edit className="h-4 w-4 mr-1.5" />
                          Edit
                        </Button>
                      </Link>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className={`flex items-center ${confirmDelete === post.id ? 'bg-red-500 text-white hover:bg-red-600' : 'text-red-500 hover:bg-red-50'}`}
                        onClick={() => handleDelete(post.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1.5" />
                        {confirmDelete === post.id ? 'Confirm' : 'Delete'}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </>
  )
}
