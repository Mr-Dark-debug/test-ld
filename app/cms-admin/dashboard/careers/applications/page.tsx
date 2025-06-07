"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  FileText, 
  ExternalLink,
  Eye,
  Edit,
  Trash2,
  Filter,
  Search,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  Users
} from 'lucide-react';
import { toast } from 'sonner';

interface JobApplication {
  _id: string;
  jobId: {
    _id: string;
    title: string;
    department: string;
    location: string;
  };
  applicantInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address?: string;
    linkedinUrl?: string;
    portfolioUrl?: string;
  };
  resume: {
    filename: string;
    url: string;
    uploadedAt: string;
  };
  coverLetter?: string;
  experience: string;
  expectedSalary?: number;
  availableFrom?: string;
  status: 'new' | 'reviewed' | 'shortlisted' | 'interviewed' | 'rejected' | 'hired';
  notes?: string;
  reviewedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

const statusColors = {
  new: 'bg-blue-100 text-blue-800',
  reviewed: 'bg-yellow-100 text-yellow-800',
  shortlisted: 'bg-green-100 text-green-800',
  interviewed: 'bg-purple-100 text-purple-800',
  rejected: 'bg-red-100 text-red-800',
  hired: 'bg-emerald-100 text-emerald-800'
};

const statusIcons = {
  new: Clock,
  reviewed: Eye,
  shortlisted: CheckCircle,
  interviewed: Users,
  rejected: XCircle,
  hired: CheckCircle
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch applications
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/applications', {
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
        setApplications(result.data);
        setFilteredApplications(result.data);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  // Update application status
  const updateApplicationStatus = async (applicationId: string, status: string, notes?: string) => {
    try {
      setIsUpdating(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/applications', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: applicationId,
          status,
          notes: notes || ''
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update application');
      }

      const result = await response.json();
      if (result.success) {
        toast.success('Application status updated successfully');
        fetchApplications(); // Refresh the list
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error('Error updating application:', error);
      toast.error('Failed to update application status');
    } finally {
      setIsUpdating(false);
    }
  };

  // Filter applications
  useEffect(() => {
    let filtered = applications;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.applicantInfo.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.applicantInfo.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.applicantInfo.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.jobId.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredApplications(filtered);
  }, [applications, statusFilter, searchTerm]);

  useEffect(() => {
    fetchApplications();
  }, []);

  const getStatusStats = () => {
    const stats = {
      total: applications.length,
      new: applications.filter(app => app.status === 'new').length,
      reviewed: applications.filter(app => app.status === 'reviewed').length,
      shortlisted: applications.filter(app => app.status === 'shortlisted').length,
      interviewed: applications.filter(app => app.status === 'interviewed').length,
      rejected: applications.filter(app => app.status === 'rejected').length,
      hired: applications.filter(app => app.status === 'hired').length,
    };
    return stats;
  };

  const stats = getStatusStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Loading applications...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Job Applications</h1>
        <Button onClick={fetchApplications} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.new}</div>
            <div className="text-sm text-gray-600">New</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.reviewed}</div>
            <div className="text-sm text-gray-600">Reviewed</div>
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
            <div className="text-2xl font-bold text-purple-600">{stats.interviewed}</div>
            <div className="text-sm text-gray-600">Interviewed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            <div className="text-sm text-gray-600">Rejected</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-emerald-600">{stats.hired}</div>
            <div className="text-sm text-gray-600">Hired</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by name, email, or job title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="reviewed">Reviewed</SelectItem>
            <SelectItem value="shortlisted">Shortlisted</SelectItem>
            <SelectItem value="interviewed">Interviewed</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="hired">Hired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-gray-500">No applications found</div>
            </CardContent>
          </Card>
        ) : (
          filteredApplications.map((application) => {
            const StatusIcon = statusIcons[application.status];
            return (
              <Card key={application._id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">
                          {application.applicantInfo.firstName} {application.applicantInfo.lastName}
                        </h3>
                        <Badge className={statusColors[application.status]}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {application.applicantInfo.email}
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {application.applicantInfo.phone}
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          {application.jobId.title}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {new Date(application.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Dialog open={isDialogOpen && selectedApplication?._id === application._id} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedApplication(application)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </DialogTrigger>
                        <ApplicationDialog 
                          application={selectedApplication} 
                          onUpdateStatus={updateApplicationStatus}
                          isUpdating={isUpdating}
                        />
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

// Application Detail Dialog Component
function ApplicationDialog({ 
  application, 
  onUpdateStatus, 
  isUpdating 
}: { 
  application: JobApplication | null;
  onUpdateStatus: (id: string, status: string, notes?: string) => void;
  isUpdating: boolean;
}) {
  const [newStatus, setNewStatus] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (application) {
      setNewStatus(application.status);
      setNotes(application.notes || '');
    }
  }, [application]);

  if (!application) return null;

  const handleUpdateStatus = () => {
    onUpdateStatus(application._id, newStatus, notes);
  };

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>
          Application Details - {application.applicantInfo.firstName} {application.applicantInfo.lastName}
        </DialogTitle>
      </DialogHeader>
      
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="resume">Resume & Links</TabsTrigger>
          <TabsTrigger value="status">Update Status</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Job Position</Label>
              <p className="text-sm text-gray-600">{application.jobId.title}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Department</Label>
              <p className="text-sm text-gray-600">{application.jobId.department}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Email</Label>
              <p className="text-sm text-gray-600">{application.applicantInfo.email}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Phone</Label>
              <p className="text-sm text-gray-600">{application.applicantInfo.phone}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Experience</Label>
              <p className="text-sm text-gray-600">{application.experience}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Expected Salary</Label>
              <p className="text-sm text-gray-600">
                {application.expectedSalary ? `₹${application.expectedSalary.toLocaleString()}` : 'Not specified'}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium">Available From</Label>
              <p className="text-sm text-gray-600">
                {application.availableFrom ? new Date(application.availableFrom).toLocaleDateString() : 'Immediately'}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium">Applied On</Label>
              <p className="text-sm text-gray-600">{new Date(application.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          
          {application.coverLetter && (
            <div>
              <Label className="text-sm font-medium">Cover Letter</Label>
              <div className="mt-1 p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{application.coverLetter}</p>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="resume" className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Resume</Label>
              <div className="mt-1">
                <Button variant="outline" asChild>
                  <a href={application.resume.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Resume
                  </a>
                </Button>
              </div>
            </div>
            
            {application.applicantInfo.linkedinUrl && (
              <div>
                <Label className="text-sm font-medium">LinkedIn Profile</Label>
                <div className="mt-1">
                  <Button variant="outline" asChild>
                    <a href={application.applicantInfo.linkedinUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View LinkedIn
                    </a>
                  </Button>
                </div>
              </div>
            )}
            
            {application.applicantInfo.portfolioUrl && (
              <div>
                <Label className="text-sm font-medium">Portfolio/Website</Label>
                <div className="mt-1">
                  <Button variant="outline" asChild>
                    <a href={application.applicantInfo.portfolioUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Portfolio
                    </a>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="status" className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="status">Application Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                  <SelectItem value="shortlisted">Shortlisted</SelectItem>
                  <SelectItem value="interviewed">Interviewed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="hired">Hired</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about this application..."
                rows={4}
              />
            </div>
            
            <Button 
              onClick={handleUpdateStatus} 
              disabled={isUpdating}
              className="w-full"
            >
              {isUpdating ? 'Updating...' : 'Update Status'}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </DialogContent>
  );
}
