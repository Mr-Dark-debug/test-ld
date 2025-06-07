"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Briefcase, 
  Users, 
  MapPin, 
  Calendar,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  FileText,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface JobOpening {
  _id: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  experience: string;
  salary?: {
    min?: number;
    max?: number;
    currency: string;
  };
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits?: string[];
  skills?: string[];
  isActive: boolean;
  isUrgent: boolean;
  applicationDeadline?: string;
  postedDate: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

interface JobApplication {
  _id: string;
  jobId: {
    _id: string;
    title: string;
    department: string;
  };
  applicantInfo: {
    firstName: string;
    lastName: string;
    email: string;
  };
  status: 'new' | 'reviewed' | 'shortlisted' | 'interviewed' | 'rejected' | 'hired';
  createdAt: string;
}

export default function CareersManagement() {
  const [jobOpenings, setJobOpenings] = useState<JobOpening[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('postings');

  // Fetch job openings
  const fetchJobOpenings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/careers?limit=100', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch job openings');
      }

      const result = await response.json();
      if (result.success) {
        setJobOpenings(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching job openings:', error);
      toast.error('Failed to load job openings');
      setJobOpenings([]); // Set empty array on error
    }
  };

  // Fetch applications
  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/applications?limit=50', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }

      const result = await response.json();
      if (result.success) {
        setApplications(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
      setApplications([]); // Set empty array on error
    }
  };

  // Delete job opening
  const deleteJobOpening = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job opening?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/careers', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete job opening');
      }

      const result = await response.json();
      if (result.success) {
        toast.success('Job opening deleted successfully');
        fetchJobOpenings();
      }
    } catch (error) {
      console.error('Error deleting job opening:', error);
      toast.error('Failed to delete job opening');
    }
  };

  // Toggle job opening status
  const toggleJobStatus = async (id: string, isActive: boolean) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/careers', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, isActive: !isActive }),
      });

      if (!response.ok) {
        throw new Error('Failed to update job status');
      }

      const result = await response.json();
      if (result.success) {
        toast.success(`Job opening ${!isActive ? 'activated' : 'deactivated'} successfully`);
        fetchJobOpenings();
      }
    } catch (error) {
      console.error('Error updating job status:', error);
      toast.error('Failed to update job status');
    }
  };



  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchJobOpenings(), fetchApplications()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const getApplicationStats = () => {
    const stats = {
      total: applications.length,
      new: applications.filter(app => app.status === 'new').length,
      shortlisted: applications.filter(app => app.status === 'shortlisted').length,
      hired: applications.filter(app => app.status === 'hired').length,
    };
    return stats;
  };

  const stats = getApplicationStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Loading careers data...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Careers Management</h1>
        <Button asChild>
          <Link href="/cms-admin/dashboard/pages/careers">
            <Plus className="h-4 w-4 mr-2" />
            Go to Careers Management
          </Link>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="postings" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Job Postings
            <Badge variant="secondary">{jobOpenings.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="applications" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Applications
            <Badge variant="secondary">{applications.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="postings" className="space-y-6">
          {/* Job Postings Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{jobOpenings.length}</div>
                <div className="text-sm text-gray-600">Total Jobs</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {jobOpenings.filter(job => job.isActive).length}
                </div>
                <div className="text-sm text-gray-600">Active Jobs</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {jobOpenings.filter(job => job.isUrgent).length}
                </div>
                <div className="text-sm text-gray-600">Urgent Jobs</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-gray-600">
                  {new Set(jobOpenings.map(job => job.department)).size}
                </div>
                <div className="text-sm text-gray-600">Departments</div>
              </CardContent>
            </Card>
          </div>

          {/* Job Postings List */}
          <div className="space-y-4">
            {jobOpenings.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Briefcase className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No job postings found</h3>
                  <p className="text-gray-500 mb-4">Create your first job posting to get started.</p>
                  <Button asChild>
                    <Link href="/cms-admin/dashboard/careers/create">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Job Posting
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              jobOpenings.map((job) => (
                <Card key={job._id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{job.title}</h3>
                          <Badge variant={job.isActive ? "default" : "secondary"}>
                            {job.isActive ? "Active" : "Inactive"}
                          </Badge>
                          {job.isUrgent && (
                            <Badge variant="destructive">Urgent</Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4" />
                            {job.department}
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {job.type}
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {new Date(job.postedDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleJobStatus(job._id, job.isActive)}
                        >
                          {job.isActive ? "Deactivate" : "Activate"}
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/cms-admin/dashboard/careers/edit/${job._id}`}>
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteJobOpening(job._id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="applications" className="space-y-6">
          {/* Applications Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                <div className="text-sm text-gray-600">Total Applications</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.new}</div>
                <div className="text-sm text-gray-600">New Applications</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{stats.shortlisted}</div>
                <div className="text-sm text-gray-600">Shortlisted</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-emerald-600">{stats.hired}</div>
                <div className="text-sm text-gray-600">Hired</div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Recent Applications</h2>
            <Button asChild variant="outline">
              <Link href="/cms-admin/dashboard/careers/applications">
                <Eye className="h-4 w-4 mr-2" />
                View All Applications
              </Link>
            </Button>
          </div>

          {/* Recent Applications List */}
          <div className="space-y-4">
            {applications.slice(0, 5).map((application) => (
              <Card key={application._id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">
                        {application.applicantInfo.firstName} {application.applicantInfo.lastName}
                      </h4>
                      <p className="text-sm text-gray-600">{application.jobId.title}</p>
                      <p className="text-xs text-gray-500">
                        Applied on {new Date(application.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        application.status === 'new' ? 'default' :
                        application.status === 'shortlisted' ? 'secondary' :
                        application.status === 'hired' ? 'default' : 'outline'
                      }>
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {applications.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
                  <p className="text-gray-500">Applications will appear here when candidates apply for your job postings.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
