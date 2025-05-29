'use client'

import React, { useState } from 'react'
import { Toaster } from 'sonner'
import { Search, Filter, Phone, Mail, Eye, Tag, Clock, Calendar, RefreshCcw } from 'lucide-react'
import AnimatedBackground from '@/components/ui/animated-tabs'

export default function ContactLeadsList() {
  // Sample contact form lead data
  const leads = [
    {
      id: 1,
      name: "Ravi Patel",
      email: "ravi.patel@example.com",
      phone: "+91 98765 43210",
      message: "I'm interested in investing in property in Surat. Please share more details about your current projects.",
      status: "New",
      source: "Contact Form",
      date: "2024-05-15",
    },
    {
      id: 2,
      name: "Ananya Sharma",
      email: "ananya.s@example.com",
      phone: "+91 98765 12345",
      message: "Looking for a 3BHK apartment in the western part of Surat. Please call me to discuss options.",
      status: "Contacted",
      source: "Contact Form",
      date: "2024-05-12",
    },
    {
      id: 3,
      name: "Vikram Desai",
      email: "vikram.d@example.com",
      phone: "+91 87654 32109",
      message: "I need information about your upcoming projects in Vesu area.",
      status: "Qualified",
      source: "Contact Form",
      date: "2024-05-10",
    },
    {
      id: 4,
      name: "Priya Mehta",
      email: "priya.m@example.com",
      phone: "+91 76543 21098",
      message: "Please provide details about commercial properties in Adajan area.",
      status: "Negotiation",
      source: "Contact Form",
      date: "2024-05-08",
    },
    {
      id: 5,
      name: "Amit Shah",
      email: "amit.s@example.com",
      phone: "+91 65432 10987",
      message: "I'm looking for information on your villa projects. Please contact me.",
      status: "Closed",
      source: "Contact Form",
      date: "2024-05-05",
    }
  ]

  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')

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

  // Filter leads based on search query and status filter
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = searchQuery === '' || 
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.message.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const updateLeadStatus = (leadId: number, newStatus: string) => {
    // This would connect to an API in a real implementation
    console.log(`Updating lead ${leadId} to status: ${newStatus}`)
    
    // For demo purposes, update the leads array locally
    const updatedLeads = leads.map(lead => 
      lead.id === leadId ? { ...lead, status: newStatus } : lead
    );
    
    // In a real app, you would update state here after API call success
    alert(`Lead status updated to: ${newStatus}`)
  }

  return (
    <>
      <Toaster position="top-right" expand={true} richColors />
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Contact Form Inquiries</h1>
            <p className="text-gray-600">Manage leads from website contact form submissions</p>
          </div>
          <div className="flex gap-2">
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <RefreshCcw className="w-4 h-4 mr-2" />
              Refresh
            </button>
            <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Mail className="w-4 h-4 mr-2" />
              Email All
            </button>
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
                  placeholder="Search by name, email, or message..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
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
                    All
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
                  <button
                    data-id="Closed"
                    className="py-2 px-3 text-sm font-medium text-gray-700 data-[checked=true]:text-blue-600"
                  >
                    Closed
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
                    Message
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
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
                {filteredLeads.map((lead) => (
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
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-md truncate">
                        {lead.message}
                      </div>
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
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {lead.date}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button 
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          onClick={() => {
                            alert(`Viewing details for: ${lead.name}`)
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                          onClick={() => {
                            window.open(`tel:${lead.phone}`, '_blank')
                          }}
                        >
                          <Phone className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-1 text-gray-400 hover:text-purple-600 transition-colors"
                          onClick={() => {
                            window.open(`mailto:${lead.email}`, '_blank')
                          }}
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                        <div className="relative group">
                          <button className="p-1 text-gray-400 hover:text-amber-600 transition-colors">
                            <Tag className="w-4 h-4" />
                          </button>
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                            <button 
                              onClick={() => updateLeadStatus(lead.id, 'New')}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                            >
                              Mark as New
                            </button>
                            <button 
                              onClick={() => updateLeadStatus(lead.id, 'Contacted')}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                            >
                              Mark as Contacted
                            </button>
                            <button 
                              onClick={() => updateLeadStatus(lead.id, 'Qualified')}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-700"
                            >
                              Mark as Qualified
                            </button>
                            <button 
                              onClick={() => updateLeadStatus(lead.id, 'Negotiation')}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                            >
                              Mark as In Negotiation
                            </button>
                            <button 
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
                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
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