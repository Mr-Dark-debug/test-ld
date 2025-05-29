'use client'

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import AnimatedBackground from '@/components/ui/animated-tabs'
import {
  Loader2, 
  Save, 
  PlusCircle, 
  Briefcase, 
  Calendar, 
  MapPin,
  Mail, 
  Phone, 
  FileText, 
  Trash2, 
  Edit, 
  CheckCircle, 
  Clock, 
  XCircle,
  Eye,
  Users
} from 'lucide-react'
import { 
  mockJobOpenings, 
  mockJobApplications, 
  JobOpening, 
  JobApplication 
} from '@/app/cms-admin/models/careers'

export default function CareersPage() {
  const [jobOpenings, setJobOpenings] = useState<JobOpening[]>([])
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('jobs')
  const [editingJob, setEditingJob] = useState<JobOpening | null>(null)
  const [isAddingJob, setIsAddingJob] = useState(false)
  const [filteredApplications, setFilteredApplications] = useState<JobApplication[]>([])
  const [filter, setFilter] = useState<'all' | 'new' | 'reviewed' | 'shortlisted' | 'rejected'>('all')
  const [selectedJobFilter, setSelectedJobFilter] = useState<string>('all')
  
  useEffect(() => {
    setIsLoading(true)
    // Simulate loading data
    setTimeout(() => {
      setJobOpenings(mockJobOpenings)
      setApplications(mockJobApplications)
      setIsLoading(false)
    }, 1000)
  }, [])
  
  useEffect(() => {
    let filtered = applications;
    
    // Filter by job if needed
    if (selectedJobFilter !== 'all') {
      filtered = filtered.filter(app => app.jobId === selectedJobFilter)
    }
    
    // Filter by status if needed
    if (filter !== 'all') {
      filtered = filtered.filter(app => app.status === filter)
    }
    
    setFilteredApplications(filtered)
  }, [applications, filter, selectedJobFilter])
  
  // Handle creating/updating job
  const handleJobSubmit = () => {
    setIsSaving(true)
    
    setTimeout(() => {
      if (isAddingJob && editingJob) {
        // Create new job
        const newJob: JobOpening = {
          ...editingJob,
          id: `job-${Date.now()}`,
          postedDate: new Date().toISOString(),
        }
        setJobOpenings(prev => [...prev, newJob])
        setIsAddingJob(false)
      } else if (editingJob) {
        // Update existing job
        setJobOpenings(prev => 
          prev.map(job => job.id === editingJob.id ? editingJob : job)
        )
      }
      
      setEditingJob(null)
      setIsSaving(false)
    }, 1000)
  }
  
  // Toggle job active status
  const toggleJobStatus = (jobId: string) => {
    setJobOpenings(prev => 
      prev.map(job => 
        job.id === jobId ? { ...job, isActive: !job.isActive } : job
      )
    )
  }
  
  // Delete job
  const deleteJob = (jobId: string) => {
    if (confirm('Are you sure you want to delete this job posting? This action cannot be undone.')) {
      setJobOpenings(prev => prev.filter(job => job.id !== jobId))
    }
  }
  
  // Update application status
  const updateApplicationStatus = (appId: string, status: 'new' | 'reviewed' | 'shortlisted' | 'rejected') => {
    setApplications(prev => 
      prev.map(app => app.id === appId ? { ...app, status } : app)
    )
  }
  
  // Initialize new empty job
  const initializeNewJob = () => {
    setEditingJob({
      id: '',
      title: '',
      department: '',
      location: 'Surat, Gujarat',
      type: 'Full-time',
      description: '',
      responsibilities: [''],
      requirements: [''],
      isActive: true,
      postedDate: ''
    })
    setIsAddingJob(true)
  }
  
  // Create empty string array of given length
  const createEmptyArray = (length: number) => Array(length).fill('');
  
  // Handle array items (responsibilities/requirements)
  const handleArrayItemChange = (
    array: string[],
    index: number,
    value: string,
    arrayName: 'responsibilities' | 'requirements'
  ) => {
    if (!editingJob) return;
    
    const newArray = [...array];
    newArray[index] = value;
    
    setEditingJob({
      ...editingJob,
      [arrayName]: newArray
    });
  }
  
  // Add new array item
  const addArrayItem = (arrayName: 'responsibilities' | 'requirements') => {
    if (!editingJob) return;
    
    setEditingJob({
      ...editingJob,
      [arrayName]: [...editingJob[arrayName], '']
    });
  }
  
  // Remove array item
  const removeArrayItem = (arrayName: 'responsibilities' | 'requirements', index: number) => {
    if (!editingJob) return;
    
    const newArray = [...editingJob[arrayName]];
    newArray.splice(index, 1);
    
    setEditingJob({
      ...editingJob,
      [arrayName]: newArray
    });
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2 text-lg">Loading content...</span>
      </div>
    )
  }
  
  // Status badge colors
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-blue-500">New</Badge>
      case 'reviewed':
        return <Badge className="bg-yellow-500">Reviewed</Badge>
      case 'shortlisted':
        return <Badge className="bg-green-500">Shortlisted</Badge>
      case 'rejected':
        return <Badge className="bg-red-500">Rejected</Badge>
      default:
        return null
    }
  }
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Careers Management</h1>
        {!editingJob && (
          <Button 
            onClick={initializeNewJob}
            className="w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            Add New Job
          </Button>
        )}
        {editingJob && (
          <div className="flex gap-2 w-full sm:w-auto">
            <Button 
              onClick={handleJobSubmit} 
              disabled={isSaving}
              className="flex-1 flex items-center justify-center gap-2"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSaving ? 'Saving...' : 'Save Job'}
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                setEditingJob(null)
                setIsAddingJob(false)
              }}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
      
      {editingJob ? (
        // Job Edit Form
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            {isAddingJob ? 'Add New Job' : 'Edit Job'}
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Job Title</label>
              <Input 
                value={editingJob.title} 
                onChange={(e) => setEditingJob({...editingJob, title: e.target.value})}
                placeholder="e.g., Senior Architect"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Department</label>
                <Input 
                  value={editingJob.department} 
                  onChange={(e) => setEditingJob({...editingJob, department: e.target.value})}
                  placeholder="e.g., Design"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <Input 
                  value={editingJob.location} 
                  onChange={(e) => setEditingJob({...editingJob, location: e.target.value})}
                  placeholder="e.g., Surat, Gujarat"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Job Type</label>
                <Input 
                  value={editingJob.type} 
                  onChange={(e) => setEditingJob({...editingJob, type: e.target.value})}
                  placeholder="e.g., Full-time"
                />
              </div>
              
              <div className="flex items-center">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={editingJob.isActive}
                    onChange={() => setEditingJob({...editingJob, isActive: !editingJob.isActive})}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  <span className="ml-3 text-sm font-medium">
                    {editingJob.isActive ? 'Active Job' : 'Inactive Job'}
                  </span>
                </label>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Job Description</label>
              <Textarea 
                value={editingJob.description} 
                onChange={(e) => setEditingJob({...editingJob, description: e.target.value})}
                placeholder="Describe the job position..."
                rows={4}
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium">Responsibilities</label>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => addArrayItem('responsibilities')}
                >
                  Add Item
                </Button>
              </div>
              
              <div className="space-y-2">
                {editingJob.responsibilities.map((item, index) => (
                  <div key={`resp-${index}`} className="flex gap-2">
                    <Input 
                      value={item} 
                      onChange={(e) => handleArrayItemChange(
                        editingJob.responsibilities, 
                        index, 
                        e.target.value,
                        'responsibilities'
                      )}
                      placeholder={`Responsibility ${index + 1}`}
                    />
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => removeArrayItem('responsibilities', index)}
                      disabled={editingJob.responsibilities.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium">Requirements</label>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => addArrayItem('requirements')}
                >
                  Add Item
                </Button>
              </div>
              
              <div className="space-y-2">
                {editingJob.requirements.map((item, index) => (
                  <div key={`req-${index}`} className="flex gap-2">
                    <Input 
                      value={item} 
                      onChange={(e) => handleArrayItemChange(
                        editingJob.requirements, 
                        index, 
                        e.target.value,
                        'requirements'
                      )}
                      placeholder={`Requirement ${index + 1}`}
                    />
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => removeArrayItem('requirements', index)}
                      disabled={editingJob.requirements.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      ) : (
        // Main tabs for jobs and applications
        <div className="w-full">
          <div className="rounded-xl bg-white overflow-hidden mb-8">
            <AnimatedBackground
              defaultValue={activeTab}
              className="bg-blue-50 dark:bg-blue-900/20"
              transition={{
                type: "spring",
                bounce: 0.2,
                duration: 0.3,
              }}
              onValueChange={(value) => value && setActiveTab(value)}
            >
              <button
                data-id="jobs"
                className="py-2 px-6 font-medium text-gray-700 data-[checked=true]:text-blue-600 dark:text-gray-300 dark:data-[checked=true]:text-blue-400"
              >
                Job Postings
              </button>
              <button
                data-id="applications"
                className="py-2 px-6 font-medium text-gray-700 data-[checked=true]:text-blue-600 dark:text-gray-300 dark:data-[checked=true]:text-blue-400"
              >
                Applications
              </button>
            </AnimatedBackground>
          </div>
          
          {activeTab === "jobs" && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Current Job Postings</h2>
              
              <div className="space-y-4">
                {jobOpenings.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No job postings found. Create your first job posting.
                  </div>
                ) : (
                  jobOpenings.map((job) => (
                    <Card key={job.id} className="p-4 border-l-4 hover:shadow-md transition-shadow"
                      style={{ borderLeftColor: job.isActive ? '#3b82f6' : '#9ca3af' }}
                    >
                      <div className="flex justify-between items-start gap-4 flex-wrap mb-2">
                        <div>
                          <h3 className="font-medium text-lg flex items-center gap-2">
                            {job.title}
                            {job.isActive ? (
                              <Badge className="bg-blue-500">Active</Badge>
                            ) : (
                              <Badge className="bg-gray-500">Inactive</Badge>
                            )}
                          </h3>
                          <div className="flex gap-4 mt-1 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Briefcase className="h-4 w-4" />
                              {job.department}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {job.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(job.postedDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setEditingJob(job)}
                            className="text-blue-600"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => toggleJobStatus(job.id)}
                            className={job.isActive ? "text-gray-600" : "text-green-600"}
                          >
                            {job.isActive ? (
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
                            onClick={() => deleteJob(job.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                      
                      <p className="mb-4 text-gray-700">{job.description}</p>
                      
                      {/* Number of applications */}
                      <div className="flex items-center text-gray-600">
                        <Users className="h-4 w-4 mr-1" />
                        <span>
                          {applications.filter(app => app.jobId === job.id).length} applications
                        </span>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </Card>
          )}
          
          {activeTab === "applications" && (
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                <h2 className="text-xl font-semibold">Job Applications</h2>
                
                <div className="flex flex-wrap gap-2">
                  {/* Job filter */}
                  <select 
                    className="px-3 py-1 border rounded-md text-sm"
                    value={selectedJobFilter}
                    onChange={(e) => setSelectedJobFilter(e.target.value)}
                  >
                    <option value="all">All Jobs</option>
                    {jobOpenings.map(job => (
                      <option key={job.id} value={job.id}>{job.title}</option>
                    ))}
                  </select>
                  
                  {/* Status filters using animated tabs */}
                  <div className="flex border rounded-md overflow-hidden">
                    <AnimatedBackground
                      defaultValue={filter}
                      className="bg-blue-50"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.3,
                      }}
                      onValueChange={(value) => value && setFilter(value as any)}
                    >
                      <button
                        data-id="all"
                        className="py-1 px-3 text-sm font-medium text-gray-700 data-[checked=true]:text-blue-600"
                      >
                        All
                      </button>
                      <button
                        data-id="new"
                        className="py-1 px-3 text-sm font-medium text-gray-700 data-[checked=true]:text-blue-600"
                      >
                        New
                      </button>
                      <button
                        data-id="reviewed"
                        className="py-1 px-3 text-sm font-medium text-gray-700 data-[checked=true]:text-blue-600"
                      >
                        Reviewed
                      </button>
                      <button
                        data-id="shortlisted"
                        className="py-1 px-3 text-sm font-medium text-gray-700 data-[checked=true]:text-blue-600"
                      >
                        Shortlisted
                      </button>
                      <button
                        data-id="rejected"
                        className="py-1 px-3 text-sm font-medium text-gray-700 data-[checked=true]:text-blue-600"
                      >
                        Rejected
                      </button>
                    </AnimatedBackground>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                {filteredApplications.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No applications found
                  </div>
                ) : (
                  filteredApplications.map((app) => (
                    <Card key={app.id} className="p-4 border-l-4 hover:shadow-md transition-shadow"
                      style={{ 
                        borderLeftColor: 
                          app.status === 'new' ? '#3b82f6' : 
                          app.status === 'reviewed' ? '#eab308' :
                          app.status === 'shortlisted' ? '#22c55e' : 
                          '#ef4444'
                      }}
                    >
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <div>
                          <h3 className="font-medium text-lg flex items-center gap-2">
                            {app.name}
                            {getStatusBadge(app.status)}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Applied for: <span className="font-medium">{app.jobTitle}</span>
                          </p>
                        </div>
                        
                        <div className="text-sm text-gray-500">
                          {new Date(app.appliedDate).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mb-4">
                        <div className="flex gap-2 items-center text-gray-600">
                          <Mail className="h-4 w-4" />
                          <a href={`mailto:${app.email}`} className="text-blue-600 hover:underline">{app.email}</a>
                        </div>
                        
                        <div className="flex gap-2 items-center text-gray-600">
                          <Phone className="h-4 w-4" />
                          <a href={`tel:${app.phone}`} className="text-blue-600 hover:underline">{app.phone}</a>
                        </div>
                        
                        <div className="flex gap-2 items-center text-gray-600">
                          <Briefcase className="h-4 w-4" />
                          <span>Experience: {app.experience}</span>
                        </div>
                        
                        <div className="flex gap-2 items-center text-gray-600">
                          <FileText className="h-4 w-4" />
                          <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            View Resume
                          </a>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="text-sm font-medium mb-1">Cover Letter / Message</h4>
                        <p className="text-gray-700 text-sm border-l-2 border-gray-200 pl-3 italic">
                          {app.message}
                        </p>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {/* Replace the AnimatedBackground with simple buttons for the actions */}
                        {app.status !== 'reviewed' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => updateApplicationStatus(app.id, 'reviewed')}
                            className="text-yellow-600 hover:bg-yellow-50"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Mark as Reviewed
                          </Button>
                        )}
                        
                        {app.status !== 'shortlisted' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => updateApplicationStatus(app.id, 'shortlisted')}
                            className="text-green-600 hover:bg-green-50"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Shortlist
                          </Button>
                        )}
                        
                        {app.status !== 'rejected' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => updateApplicationStatus(app.id, 'rejected')}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        )}
                        
                        {app.status !== 'new' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => updateApplicationStatus(app.id, 'new')}
                            className="text-blue-600 hover:bg-blue-50"
                          >
                            <Clock className="h-4 w-4 mr-1" />
                            Mark as New
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  )
} 