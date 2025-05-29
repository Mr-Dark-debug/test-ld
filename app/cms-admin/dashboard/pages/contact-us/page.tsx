'use client'

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/Button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, Save, Calendar, Mail, Phone, MessageSquare, Clock, CheckCircle, XCircle, ArchiveIcon } from 'lucide-react'
import { defaultContactInfo, mockContactRequests, ContactInfo, ContactRequest } from '@/app/cms-admin/models/contactUs'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'

export default function ContactUsPage() {
  const [contactInfo, setContactInfo] = useState<ContactInfo>(defaultContactInfo)
  const [contactRequests, setContactRequests] = useState<ContactRequest[]>(mockContactRequests)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('info')
  const [newHourRow, setNewHourRow] = useState({ days: '', time: '' })
  const [filteredRequests, setFilteredRequests] = useState<ContactRequest[]>(mockContactRequests)
  const [filter, setFilter] = useState<'all' | 'new' | 'responded' | 'archived'>('all')
  
  useEffect(() => {
    setIsLoading(true)
    // Simulate loading data
    setTimeout(() => {
      setContactInfo(defaultContactInfo)
      setContactRequests(mockContactRequests)
      setFilteredRequests(mockContactRequests)
      setIsLoading(false)
    }, 1000)
  }, [])
  
  useEffect(() => {
    if (filter === 'all') {
      setFilteredRequests(contactRequests)
    } else {
      setFilteredRequests(contactRequests.filter(req => req.status === filter))
    }
  }, [filter, contactRequests])
  
  const handleInfoChange = (field: keyof ContactInfo, value: string) => {
    setContactInfo(prev => ({
      ...prev,
      [field]: value
    }))
  }
  
  const handleHourChange = (index: number, field: 'days' | 'time', value: string) => {
    setContactInfo(prev => {
      const newHours = [...prev.hours]
      newHours[index] = { ...newHours[index], [field]: value }
      return {
        ...prev,
        hours: newHours
      }
    })
  }
  
  const addHourRow = () => {
    if (newHourRow.days && newHourRow.time) {
      setContactInfo(prev => ({
        ...prev,
        hours: [...prev.hours, { days: newHourRow.days, time: newHourRow.time }]
      }))
      setNewHourRow({ days: '', time: '' })
    }
  }
  
  const removeHourRow = (index: number) => {
    setContactInfo(prev => {
      const newHours = [...prev.hours]
      newHours.splice(index, 1)
      return {
        ...prev,
        hours: newHours
      }
    })
  }
  
  const updateRequestStatus = (id: string, status: 'new' | 'responded' | 'archived') => {
    setContactRequests(prev => 
      prev.map(req => req.id === id ? { ...req, status } : req)
    )
  }
  
  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('Contact information saved successfully!')
    } catch (error) {
      console.error('Error saving contact info:', error)
      alert('Failed to save contact information. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2 text-lg">Loading content...</span>
      </div>
    )
  }
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-blue-500">New</Badge>
      case 'responded':
        return <Badge className="bg-green-500">Responded</Badge>
      case 'archived':
        return <Badge className="bg-gray-500">Archived</Badge>
      default:
        return null
    }
  }
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Contact Us Page</h1>
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="w-full sm:w-auto flex items-center justify-center gap-2"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="hidden sm:flex overflow-x-auto pb-2 mb-8 border-b">
          <TabsTrigger value="info" className="px-4 py-2 min-w-[120px] text-center rounded-t-md">
            Contact Information
          </TabsTrigger>
          <TabsTrigger value="requests" className="px-4 py-2 min-w-[120px] text-center rounded-t-md">
            Contact Requests
          </TabsTrigger>
        </TabsList>
        
        {/* Mobile tab navigation */}
        <div className="flex sm:hidden items-center justify-between mb-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setActiveTab('info')}
            className={activeTab === 'info' ? 'bg-blue-50 text-blue-700 border-blue-300' : ''}
          >
            Contact Info
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setActiveTab('requests')}
            className={activeTab === 'requests' ? 'bg-blue-50 text-blue-700 border-blue-300' : ''}
          >
            Requests
          </Button>
        </div>
        
        {/* Contact Information Tab */}
        <TabsContent value="info" className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <Input 
                  value={contactInfo.address} 
                  onChange={(e) => handleInfoChange('address', e.target.value)}
                  placeholder="Enter office address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <Input 
                  value={contactInfo.phone} 
                  onChange={(e) => handleInfoChange('phone', e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Map Embed URL</label>
                <Input 
                  value={contactInfo.mapEmbedSrc} 
                  onChange={(e) => handleInfoChange('mapEmbedSrc', e.target.value)}
                  placeholder="Enter Google Maps embed URL"
                />
                <p className="text-sm text-gray-500 mt-1">
                  This URL is used to display the map on the contact page
                </p>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium">Business Hours</label>
                </div>
                
                <div className="space-y-3">
                  {contactInfo.hours.map((hour, index) => (
                    <div key={index} className="flex flex-wrap gap-2">
                      <div className="flex-1 min-w-[200px]">
                        <Input 
                          value={hour.days} 
                          onChange={(e) => handleHourChange(index, 'days', e.target.value)}
                          placeholder="e.g., Monday to Friday"
                        />
                      </div>
                      <div className="flex-1 min-w-[200px]">
                        <Input 
                          value={hour.time} 
                          onChange={(e) => handleHourChange(index, 'time', e.target.value)}
                          placeholder="e.g., 9:00 AM - 5:00 PM"
                        />
                      </div>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => removeHourRow(index)}
                        className="shrink-0"
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  
                  <div className="flex flex-wrap gap-2">
                    <div className="flex-1 min-w-[200px]">
                      <Input 
                        value={newHourRow.days} 
                        onChange={(e) => setNewHourRow(prev => ({ ...prev, days: e.target.value }))}
                        placeholder="Add days"
                      />
                    </div>
                    <div className="flex-1 min-w-[200px]">
                      <Input 
                        value={newHourRow.time} 
                        onChange={(e) => setNewHourRow(prev => ({ ...prev, time: e.target.value }))}
                        placeholder="Add hours"
                      />
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={addHourRow}
                      className="shrink-0"
                      disabled={!newHourRow.days || !newHourRow.time}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Preview</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Address</h3>
                <p className="text-gray-700">{contactInfo.address}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Phone</h3>
                <p className="text-gray-700">{contactInfo.phone}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Business Hours</h3>
                <div className="space-y-1">
                  {contactInfo.hours.map((hour, index) => (
                    <div key={index} className="flex justify-between border-b pb-1 last:border-0">
                      <span className="text-gray-700">{hour.days}</span>
                      <span className="text-gray-700">{hour.time}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Map</h3>
                <div className="border rounded-lg overflow-hidden h-64">
                  <iframe 
                    src={contactInfo.mapEmbedSrc} 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen={false} 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        {/* Contact Requests Tab */}
        <TabsContent value="requests" className="space-y-4">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
              <h2 className="text-xl font-semibold">Contact Requests</h2>
              <div className="flex gap-2">
                <Button 
                  variant={filter === 'all' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setFilter('all')}
                >
                  All
                </Button>
                <Button 
                  variant={filter === 'new' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setFilter('new')}
                  className={filter === 'new' ? '' : 'text-blue-600'}
                >
                  New
                </Button>
                <Button 
                  variant={filter === 'responded' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setFilter('responded')}
                  className={filter === 'responded' ? '' : 'text-green-600'}
                >
                  Responded
                </Button>
                <Button 
                  variant={filter === 'archived' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setFilter('archived')}
                  className={filter === 'archived' ? '' : 'text-gray-600'}
                >
                  Archived
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              {filteredRequests.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No contact requests found
                </div>
              ) : (
                filteredRequests.map((request) => (
                  <Card key={request.id} className="p-4 border-l-4 hover:shadow-md transition-shadow" 
                    style={{ 
                      borderLeftColor: 
                        request.status === 'new' ? '#3b82f6' : 
                        request.status === 'responded' ? '#22c55e' : '#9ca3af' 
                    }}
                  >
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <h3 className="font-medium text-lg">{request.name}</h3>
                      {getStatusBadge(request.status)}
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex gap-2 items-center text-gray-600">
                        <Mail className="h-4 w-4" />
                        <a href={`mailto:${request.email}`} className="text-blue-600 hover:underline">{request.email}</a>
                      </div>
                      
                      <div className="flex gap-2 items-center text-gray-600">
                        <Phone className="h-4 w-4" />
                        <a href={`tel:${request.phone}`} className="text-blue-600 hover:underline">{request.phone}</a>
                      </div>
                      
                      <div className="flex gap-2 items-start text-gray-600">
                        <MessageSquare className="h-4 w-4 mt-1" />
                        <p className="flex-1">{request.message}</p>
                      </div>
                      
                      <div className="flex gap-2 items-center text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <p>{new Date(request.date).toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {request.status !== 'responded' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => updateRequestStatus(request.id, 'responded')}
                          className="text-green-600"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Mark as Responded
                        </Button>
                      )}
                      
                      {request.status !== 'new' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => updateRequestStatus(request.id, 'new')}
                          className="text-blue-600"
                        >
                          <Clock className="h-4 w-4 mr-1" />
                          Mark as New
                        </Button>
                      )}
                      
                      {request.status !== 'archived' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => updateRequestStatus(request.id, 'archived')}
                          className="text-gray-600"
                        >
                          <ArchiveIcon className="h-4 w-4 mr-1" />
                          Archive
                        </Button>
                      )}
                    </div>
                  </Card>
                ))
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 