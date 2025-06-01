'use client'

import React, { useState } from 'react'
import { Toaster } from 'sonner'
import { Search, Filter, Phone, Mail, Eye, Tag, Clock, Calendar, Building, Download, Globe, Users } from 'lucide-react'
import Link from 'next/link'
import AnimatedBackground from '@/components/ui/animated-tabs'
import { useLeads, transformLeadForComponent } from '@/hooks/useLeads'

export default function LeadsList() {
  const [sourceFilter, setSourceFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Fetch real leads data
  const {
    leads: leadsData,
    loading,
    error,
    stats,
    updateLeadStatus: updateStatus,
    refetch
  } = useLeads({
    search: searchQuery || undefined,
    type: sourceFilter === 'Contact Form' ? 'contact' : sourceFilter === 'Brochure Download' ? 'brochure' : undefined,
    status: statusFilter !== 'all' ? statusFilter.toLowerCase() as any : undefined
  });

  // Transform leads for display
  const leads = leadsData.map(transformLeadForComponent);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-800'
      case 'Contacted':
        return 'bg-purple-100 text-purple-800'
      case 'Qualified':
        return 'bg-amber-100 text-amber-800'
      case 'Negotiation':
        return 'bg-indigo-100 text-indigo-800'
      case 'Closed':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'Contact Form':
        return <Globe className="w-4 h-4 text-blue-500 mr-2" />
      case 'Brochure Download':
        return <Download className="w-4 h-4 text-green-500 mr-2" />
      case 'Website':
        return <Globe className="w-4 h-4 text-indigo-500 mr-2" />
      case 'Property Portal':
        return <Building className="w-4 h-4 text-purple-500 mr-2" />
      case 'Referral':
        return <Users className="w-4 h-4 text-amber-500 mr-2" />
      default:
        return <Tag className="w-4 h-4 text-gray-400 mr-2" />
    }
  }

  // Filter leads based on filters and search query (filtering is now handled by the API)
  const filteredLeads = leads;

  // Function to update lead status
  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    const result = await updateStatus(leadId, newStatus);
    if (result.success) {
      // Refresh the data
      refetch();
    } else {
      alert(`Failed to update lead status: ${result.error}`);
    }
  }

  return (
    <>
      <Toaster position="top-right" expand={true} richColors />
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Leads Management</h1>
            <p className="text-gray-600">Track and manage all your leads in one place</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/cms-admin/dashboard/leads/contact" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Globe className="w-4 h-4 mr-2" />
              Contact Inquiries
            </Link>
            <Link href="/cms-admin/dashboard/leads/brochures" className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Brochure Requests
            </Link>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Leads</p>
                <p className="text-2xl font-semibold">{loading ? '...' : stats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Contact Inquiries</p>
                <p className="text-2xl font-semibold">{loading ? '...' : stats.contactInquiries}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Globe className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Brochure Requests</p>
                <p className="text-2xl font-semibold">{loading ? '...' : stats.brochureRequests}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Download className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">New Today</p>
                <p className="text-2xl font-semibold">{loading ? '...' : stats.newToday}</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-full">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search leads..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="border rounded-lg overflow-hidden">
                <AnimatedBackground
                  defaultValue={sourceFilter}
                  className="bg-blue-50"
                  transition={{
                    type: "spring",
                    bounce: 0.2,
                    duration: 0.3,
                  }}
                  onValueChange={(value) => setSourceFilter(value || 'all')}
                >
                  <button
                    data-id="all"
                    className="py-2 px-3 text-sm font-medium text-gray-700 data-[checked=true]:text-blue-600"
                  >
                    All Sources
                  </button>
                  <button
                    data-id="Contact Form"
                    className="py-2 px-3 text-sm font-medium text-gray-700 data-[checked=true]:text-blue-600"
                  >
                    Contact
                  </button>
                  <button
                    data-id="Brochure Download"
                    className="py-2 px-3 text-sm font-medium text-gray-700 data-[checked=true]:text-blue-600"
                  >
                    Brochure
                  </button>
                </AnimatedBackground>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <AnimatedBackground
                  defaultValue={statusFilter}
                  className="bg-blue-50"
                  transition={{
                    type: "spring",
                    bounce: 0.2,
                    duration: 0.3,
                  }}
                  onValueChange={(value) => setStatusFilter(value || 'all')}
                >
                  <button
                    data-id="all"
                    className="py-2 px-3 text-sm font-medium text-gray-700 data-[checked=true]:text-blue-600"
                  >
                    All Status
                  </button>
                  <button
                    data-id="New"
                    className="py-2 px-3 text-sm font-medium text-gray-700 data-[checked=true]:text-blue-600"
                  >
                    New
                  </button>
                  <button
                    data-id="Contacted"
                    className="py-2 px-3 text-sm font-medium text-gray-700 data-[checked=true]:text-blue-600"
                  >
                    Contacted
                  </button>
                  <button
                    data-id="Qualified"
                    className="py-2 px-3 text-sm font-medium text-gray-700 data-[checked=true]:text-blue-600"
                  >
                    Qualified
                  </button>
                </AnimatedBackground>
              </div>
            </div>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lead
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      Loading leads...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-red-500">
                      Error loading leads: {error}
                    </td>
                  </tr>
                ) : filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {lead.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{lead.email}</div>
                      <div className="text-sm text-gray-500">{lead.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {lead.project}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(lead.status)}`}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getSourceIcon(lead.source)}
                        <span className="text-sm text-gray-900">
                          {lead.source}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {lead.date}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          title={`View details for ${lead.name}`}
                          aria-label={`View details for ${lead.name}`}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          onClick={() => {
                            alert(`Viewing details for: ${lead.name}`)
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          title={`Call ${lead.name}`}
                          aria-label={`Call ${lead.name}`}
                          className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                          onClick={() => {
                            window.open(`tel:${lead.phone}`, '_blank')
                          }}
                        >
                          <Phone className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          title={`Email ${lead.name}`}
                          aria-label={`Email ${lead.name}`}
                          className="p-1 text-gray-400 hover:text-purple-600 transition-colors"
                          onClick={() => {
                            window.open(`mailto:${lead.email}`, '_blank')
                          }}
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                        <div className="relative group">
                          <button
                            type="button"
                            title={`Update status for ${lead.name}`}
                            aria-label={`Update status for ${lead.name}`}
                            className="p-1 text-gray-400 hover:text-amber-600 transition-colors"
                          >
                            <Tag className="w-4 h-4" />
                          </button>
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                            <button
                              type="button"
                              onClick={() => updateLeadStatus(lead.id, 'New')}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                            >
                              Mark as New
                            </button>
                            <button
                              type="button"
                              onClick={() => updateLeadStatus(lead.id, 'Contacted')}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                            >
                              Mark as Contacted
                            </button>
                            <button
                              type="button"
                              onClick={() => updateLeadStatus(lead.id, 'Qualified')}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-700"
                            >
                              Mark as Qualified
                            </button>
                            <button
                              type="button"
                              onClick={() => updateLeadStatus(lead.id, 'Negotiation')}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                            >
                              Mark as In Negotiation
                            </button>
                            <button
                              type="button"
                              onClick={() => updateLeadStatus(lead.id, 'Closed')}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700"
                            >
                              Mark as Closed
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredLeads.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                      No leads match your search criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
