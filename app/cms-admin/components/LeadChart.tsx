'use client'

import React, { useState, useEffect } from 'react'
import { TrendingUp, Users, Target, Calendar, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// Lead data service to get leads from localStorage
const LeadService = {
  getAllLeads: () => {
    if (typeof window === 'undefined') return [];
    const leads = localStorage.getItem('leadData');
    return leads ? JSON.parse(leads) : [];
  },
  
  // Initialize with sample data if no leads exist
  initSampleData: () => {
    if (typeof window === 'undefined') return;
    const leads = LeadService.getAllLeads();
    
    if (leads.length === 0) {
      // Generate realistic data for the past 6 months
      const today = new Date();
      const sampleLeads = [];
      
      // Generate random leads with a realistic growth trend
      for (let i = 0; i < 250; i++) {
        // Random date within past 6 months
        const randomMonthOffset = Math.floor(Math.random() * 6);
        const randomDayOffset = Math.floor(Math.random() * 30);
        const leadDate = new Date();
        leadDate.setMonth(today.getMonth() - randomMonthOffset);
        leadDate.setDate(today.getDate() - randomDayOffset);
        
        // Increase chances of newer leads to show growth trend
        const chanceOfNewerLead = (6 - randomMonthOffset) * 5;
        if (Math.random() * 100 > chanceOfNewerLead) continue;
        
        // Generate lead data
        const propertyTypes = ['residential', 'commercial', 'luxury', 'affordable'];
        const sources = ['website', 'social media', 'referral', 'direct', 'phone'];
        const statuses = ['new', 'contacted', 'qualified', 'proposal', 'closed', 'lost'];
        
        // Higher conversion rates for older leads
        const leadAgeInDays = randomMonthOffset * 30 + randomDayOffset;
        let status;
        if (leadAgeInDays > 60) {
          // Old leads are mostly closed or lost
          status = Math.random() > 0.3 ? 'closed' : 'lost';
        } else if (leadAgeInDays > 30) {
          // Medium-age leads are in progress
          const statusIndex = Math.min(Math.floor(Math.random() * 4) + 2, 5);
          status = statuses[statusIndex];
        } else {
          // Newer leads are mostly new or contacted
          const statusIndex = Math.min(Math.floor(Math.random() * 3), 2);
          status = statuses[statusIndex];
        }
        
        sampleLeads.push({
          id: `lead-${i}`,
          name: `Lead ${i}`,
          email: `lead${i}@example.com`,
          phone: `+1${Math.floor(1000000000 + Math.random() * 9000000000)}`,
          propertyType: propertyTypes[Math.floor(Math.random() * propertyTypes.length)],
          source: sources[Math.floor(Math.random() * sources.length)],
          status,
          createdAt: leadDate.toISOString(),
          updatedAt: new Date(leadDate.getTime() + Math.random() * 1000 * 60 * 60 * 24 * 15).toISOString()
        });
      }
      
      localStorage.setItem('leadData', JSON.stringify(sampleLeads));
    }
  }
};

export function LeadChart() {
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d' | '6m' | '1y'>('6m');
  const [leadData, setLeadData] = useState<{
    month: string;
    leads: number;
    conversions: number;
  }[]>([]);
  const [totalStats, setTotalStats] = useState({
    totalLeads: 0,
    conversions: 0,
    conversionRate: 0
  });
  
  useEffect(() => {
    // Initialize sample data if needed
    LeadService.initSampleData();
    
    // Get all leads from localStorage
    const allLeads = LeadService.getAllLeads();
    
    // Calculate date range based on selected timeframe
    const endDate = new Date();
    let startDate = new Date();
    
    switch (timeframe) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(endDate.getDate() - 90);
        break;
      case '6m':
        startDate.setMonth(endDate.getMonth() - 6);
        break;
      case '1y':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
    }
    
    // Filter leads by date range
    const filteredLeads = allLeads.filter((lead: any) => {
      const leadDate = new Date(lead.createdAt);
      return leadDate >= startDate && leadDate <= endDate;
    });
    
    // Count conversions (closed deals)
    const conversions = filteredLeads.filter((lead: any) => lead.status === 'closed').length;
    
    // Group leads by month/week depending on timeframe
    const groupedData = [];
    let format: 'month' | 'week' | 'day' = 'month';
    let numGroups = 6;
    
    if (timeframe === '7d') {
      format = 'day';
      numGroups = 7;
    } else if (timeframe === '30d') {
      format = 'week';
      numGroups = 4;
    } else if (timeframe === '90d') {
      format = 'week';
      numGroups = 12;
    }
    
    // Create time periods
    for (let i = 0; i < numGroups; i++) {
      const periodEndDate = new Date(endDate);
      const periodStartDate = new Date(endDate);
      
      if (format === 'month') {
        periodEndDate.setMonth(endDate.getMonth() - i);
        periodStartDate.setMonth(endDate.getMonth() - i - 1);
        periodStartDate.setDate(periodStartDate.getDate() + 1);
      } else if (format === 'week') {
        periodEndDate.setDate(endDate.getDate() - (i * 7));
        periodStartDate.setDate(endDate.getDate() - ((i + 1) * 7) + 1);
      } else {
        periodEndDate.setDate(endDate.getDate() - i);
        periodStartDate.setDate(endDate.getDate() - i);
      }
      
      // Filter leads for this period
      const periodLeads = filteredLeads.filter((lead: any) => {
        const leadDate = new Date(lead.createdAt);
        return leadDate >= periodStartDate && leadDate <= periodEndDate;
      });
      
      // Count conversions for this period
      const periodConversions = periodLeads.filter((lead: any) => lead.status === 'closed').length;
      
      // Format label based on period type
      let label;
      if (format === 'month') {
        label = periodEndDate.toLocaleString('en-US', { month: 'short' });
      } else if (format === 'week') {
        label = `W${numGroups - i}`;
      } else {
        label = periodEndDate.toLocaleString('en-US', { day: '2-digit' });
      }
      
      groupedData.push({
        month: label,
        leads: periodLeads.length,
        conversions: periodConversions
      });
    }
    
    // Reverse to show chronological order
    groupedData.reverse();
    
    // Update state
    setLeadData(groupedData);
    setTotalStats({
      totalLeads: filteredLeads.length,
      conversions,
      conversionRate: filteredLeads.length > 0 ? Math.round((conversions / filteredLeads.length) * 100) : 0
    });
  }, [timeframe]);
  
  const maxLeads = Math.max(...leadData.map((d) => d.leads), 1);
  const trend: 'up' | 'down' | 'neutral' = totalStats.totalLeads > 0 ? 'up' : 'neutral';
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Lead Analytics
          </h3>
          <p className="text-sm text-gray-600">
            {timeframe === '7d' ? 'Daily' : timeframe === '30d' || timeframe === '90d' ? 'Weekly' : 'Monthly'} lead generation and conversion trends
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Leads</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-gray-600">Conversions</span>
            </div>
          </div>
          
          <Select
            value={timeframe}
            onValueChange={(value: any) => setTimeframe(value)}
          >
            <SelectTrigger className="w-24 h-8 text-xs border-gray-200">
              <SelectValue placeholder="6 Months" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
              <SelectItem value="6m">6 Months</SelectItem>
              <SelectItem value="1y">1 Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Chart */}
      <div className="h-64 flex items-end justify-between space-x-2 mb-6">
        {leadData.map((data, index) => (
          <div
            key={index}
            className="flex-1 flex flex-col items-center space-y-2 group"
          >
            <div className="w-full flex flex-col items-center space-y-1 relative">
              <div
                className={`w-full bg-blue-500 rounded-t-sm group-hover:bg-blue-600 transition-all duration-200 h-[${Math.max((data.leads / maxLeads) * 200, 2)}px]`}
              >
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-800 text-white text-xs rounded py-1 px-2 min-w-[80px] text-center pointer-events-none">
                  <span className="block font-medium">{data.leads} Leads</span>
                </div>
              </div>
              
              <div
                className={`w-full bg-green-500 rounded-t-sm group-hover:bg-green-600 transition-all duration-200 ${data.conversions > 0 ? `h-[${Math.max((data.conversions / maxLeads) * 200, 2)}px]` : 'h-0'}`}
              >
                {/* Tooltip */}
                {data.conversions > 0 && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-800 text-white text-xs rounded py-1 px-2 min-w-[80px] text-center pointer-events-none">
                    <span className="block font-medium">{data.conversions} Conversions</span>
                    <span className="block text-gray-300 text-[10px]">
                      {data.leads > 0 ? Math.round((data.conversions / data.leads) * 100) : 0}% Rate
                    </span>
                  </div>
                )}
              </div>
            </div>
            <span className="text-xs text-gray-600 font-medium">
              {data.month}
            </span>
          </div>
        ))}
      </div>
      
      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg mx-auto mb-2">
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{totalStats.totalLeads}</p>
          <p className="text-xs text-gray-600">Total Leads</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-lg mx-auto mb-2">
            <Target className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{totalStats.conversions}</p>
          <p className="text-xs text-gray-600">Conversions</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-lg mx-auto mb-2">
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <div className="flex items-center justify-center">
            <p className="text-2xl font-bold text-gray-900">{totalStats.conversionRate}%</p>
            {trend === 'up' && (
              <span className="ml-1 text-green-500">
                <ChevronUp className="w-4 h-4" />
              </span>
            )}
            {trend === 'neutral' && (
              <span className="ml-1 text-gray-500">
                <ChevronUp className="w-4 h-4" />
              </span>
            )}
          </div>
          <p className="text-xs text-gray-600">Conv. Rate</p>
        </div>
      </div>
      
      {/* View All Link */}
      <div className="mt-4 pt-4 border-t border-gray-200 text-center">
        <a href="/cms-admin/dashboard/leads" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium">
          View All Leads
          <ArrowRight className="ml-1 w-4 h-4" />
        </a>
      </div>
    </div>
  )
}
