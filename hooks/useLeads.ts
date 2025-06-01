import { useState, useEffect } from 'react';
import { leadsApi } from '@/lib/api';

export interface Lead {
  _id: string;
  type: 'contact' | 'brochure';
  name: string;
  email: string;
  phone: string;
  projectInterest?: string;
  projectId?: {
    _id: string;
    title: string;
    type: string;
    status: string;
  };
  message?: string;
  status: 'new' | 'contacted' | 'qualified' | 'negotiation' | 'closed';
  assignedTo?: {
    _id: string;
    name: string;
    email: string;
  };
  notes?: string;
  followUpDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UseLeadsOptions {
  type?: 'contact' | 'brochure';
  status?: 'new' | 'contacted' | 'qualified' | 'negotiation' | 'closed';
  assignedTo?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface UseLeadsReturn {
  leads: Lead[];
  loading: boolean;
  error: string | null;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  refetch: () => void;
  updateLeadStatus: (leadId: string, status: string) => Promise<{ success: boolean; error?: string }>;
  stats: {
    total: number;
    contactInquiries: number;
    brochureRequests: number;
    newToday: number;
  };
}

export function useLeads(options: UseLeadsOptions = {}): UseLeadsReturn {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<UseLeadsReturn['pagination']>();

  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await leadsApi.getAll(options);

      if (response.success && response.data) {
        setLeads(response.data);
        setPagination(response.pagination);
      } else {
        setError(response.error || 'Failed to fetch leads');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch leads');
      console.error('Error fetching leads:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (leadId: string, status: string) => {
    try {
      // This would be implemented when we add the update lead API endpoint
      console.log(`Updating lead ${leadId} to status: ${status}`);

      // For now, update locally and refetch
      setLeads(prevLeads =>
        prevLeads.map(lead =>
          lead._id === leadId ? { ...lead, status: status as any } : lead
        )
      );

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to update lead status' };
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [
    options.type,
    options.status,
    options.assignedTo,
    options.search,
    options.page,
    options.limit
  ]);

  // Calculate stats
  const stats = {
    total: leads.length,
    contactInquiries: leads.filter(lead => lead.type === 'contact').length,
    brochureRequests: leads.filter(lead => lead.type === 'brochure').length,
    newToday: leads.filter(lead => {
      const today = new Date().toISOString().split('T')[0];
      const leadDate = new Date(lead.createdAt).toISOString().split('T')[0];
      return leadDate === today;
    }).length
  };

  return {
    leads,
    loading,
    error,
    pagination,
    refetch: fetchLeads,
    updateLeadStatus,
    stats
  };
}

// Transform API lead to component format
export function transformLeadForComponent(lead: Lead) {
  return {
    id: lead._id,
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    project: lead.projectId?.title || lead.projectInterest || (lead.type === 'contact' ? 'General Inquiry' : 'N/A'),
    status: lead.status.charAt(0).toUpperCase() + lead.status.slice(1),
    source: lead.type === 'contact' ? 'Contact Form' : 'Brochure Download',
    date: new Date(lead.createdAt).toISOString().split('T')[0],
    message: lead.message,
    downloadDate: lead.type === 'brochure' ? new Date(lead.createdAt).toISOString().split('T')[0] : undefined,
    notes: lead.notes || (lead.type === 'contact' ? lead.message : 'Downloaded brochure')
  };
}
