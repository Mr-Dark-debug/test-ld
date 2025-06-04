'use client'

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  Activity,
  Search,
  Filter,
  Calendar,
  User,
  FileText,
  Users,
  Settings,
  Trash2,
  Edit,
  Plus,
  Eye,
  RefreshCw,
  Clock,
  AlertCircle,
  CheckCircle,
  Info,
  Loader2
} from 'lucide-react'

interface ActivityLog {
  _id: string
  type: string
  action: string
  title: string
  userId: string
  userName: string
  entityId?: string
  entityType?: string
  metadata?: any
  createdAt: string
}

export default function ActivityLogsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [activities, setActivities] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [actionFilter, setActionFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalActivities, setTotalActivities] = useState(0)
  const itemsPerPage = 20

  // Check access permissions
  useEffect(() => {
    if (user && !['super_admin', 'admin', 'editor'].includes(user.role)) {
      toast.error('Access denied. Insufficient privileges.')
      router.push('/cms-admin/dashboard')
      return
    }
  }, [user, router])

  // Fetch activities
  const fetchActivities = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      })

      if (searchTerm) params.append('search', searchTerm)
      if (typeFilter !== 'all') params.append('type', typeFilter)
      if (actionFilter !== 'all') params.append('action', actionFilter)

      const response = await fetch(`/api/activities?${params}`)
      const data = await response.json()

      if (data.success) {
        setActivities(data.data || [])
        setTotalPages(data.pagination?.totalPages || 1)
        setTotalActivities(data.pagination?.total || 0)
      } else {
        setError(data.error || 'Failed to fetch activities')
        toast.error('Failed to load activity logs')
      }
    } catch (err: any) {
      console.error('Error fetching activities:', err)
      setError('Failed to fetch activities')
      toast.error('Failed to load activity logs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchActivities()
    }
  }, [user, currentPage, searchTerm, typeFilter, actionFilter])

  // Get icon for activity type
  const getActivityIcon = (type: string, action: string) => {
    switch (type) {
      case 'user':
        return action === 'create' ? <Plus className="w-4 h-4" /> : 
               action === 'delete' ? <Trash2 className="w-4 h-4" /> : 
               <Edit className="w-4 h-4" />
      case 'project':
        return <FileText className="w-4 h-4" />
      case 'blog':
        return <FileText className="w-4 h-4" />
      case 'testimonial':
        return <Users className="w-4 h-4" />
      case 'lead':
        return <User className="w-4 h-4" />
      case 'settings':
        return <Settings className="w-4 h-4" />
      case 'auth':
        return action === 'login' ? <CheckCircle className="w-4 h-4" /> : 
               action === 'logout' ? <AlertCircle className="w-4 h-4" /> : 
               <Info className="w-4 h-4" />
      default:
        return <Activity className="w-4 h-4" />
    }
  }

  // Get color for activity type
  const getActivityColor = (type: string, action: string) => {
    switch (action) {
      case 'create':
        return 'text-green-600 bg-green-50'
      case 'delete':
        return 'text-red-600 bg-red-50'
      case 'update':
      case 'edit':
        return 'text-blue-600 bg-blue-50'
      case 'login':
        return 'text-green-600 bg-green-50'
      case 'logout':
        return 'text-orange-600 bg-orange-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60)
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours)
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`
    } else if (diffInHours < 168) { // 7 days
      const days = Math.floor(diffInHours / 24)
      return `${days} day${days !== 1 ? 's' : ''} ago`
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Activity Logs</h1>
          <p className="text-gray-600 mt-1">
            Track all system activities and user actions
          </p>
        </div>
        <Button
          onClick={fetchActivities}
          disabled={loading}
          variant="outline"
          className="inline-flex items-center"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4 mr-2" />
          )}
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="user">User Management</SelectItem>
              <SelectItem value="project">Projects</SelectItem>
              <SelectItem value="blog">Blogs</SelectItem>
              <SelectItem value="testimonial">Testimonials</SelectItem>
              <SelectItem value="lead">Leads</SelectItem>
              <SelectItem value="auth">Authentication</SelectItem>
              <SelectItem value="settings">Settings</SelectItem>
            </SelectContent>
          </Select>

          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="create">Create</SelectItem>
              <SelectItem value="update">Update</SelectItem>
              <SelectItem value="delete">Delete</SelectItem>
              <SelectItem value="login">Login</SelectItem>
              <SelectItem value="logout">Logout</SelectItem>
              <SelectItem value="view">View</SelectItem>
            </SelectContent>
          </Select>

          <div className="text-sm text-gray-600 flex items-center">
            <Activity className="w-4 h-4 mr-2" />
            {totalActivities} total activities
          </div>
        </div>
      </Card>

      {/* Activity List */}
      <Card>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading activity logs...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-4" />
              <p className="text-gray-600">{error}</p>
              <Button onClick={fetchActivities} className="mt-4">
                Try Again
              </Button>
            </div>
          </div>
        ) : activities.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Activity className="w-8 h-8 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No activities found</p>
              <p className="text-sm text-gray-500 mt-2">
                Activities will appear here as users interact with the system
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {activities.map((activity) => (
              <div key={activity._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-lg ${getActivityColor(activity.type, activity.action)}`}>
                    {getActivityIcon(activity.type, activity.action)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {activity.title}
                      </h3>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatDate(activity.createdAt)}
                      </div>
                    </div>
                    
                    <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500">
                      <span className="flex items-center">
                        <User className="w-3 h-3 mr-1" />
                        {activity.userName}
                      </span>
                      <span className="capitalize">
                        {activity.type} • {activity.action}
                      </span>
                      {activity.entityType && (
                        <span>
                          Target: {activity.entityType}
                        </span>
                      )}
                    </div>
                    
                    {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                      <div className="mt-2 text-xs text-gray-600">
                        <details className="cursor-pointer">
                          <summary className="hover:text-gray-800">View details</summary>
                          <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                            {JSON.stringify(activity.metadata, null, 2)}
                          </pre>
                        </details>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
