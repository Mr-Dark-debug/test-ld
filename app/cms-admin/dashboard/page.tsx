'use client'

import React from 'react'
import { Toaster } from 'sonner'
import { StatsCard } from '../components/StatsCard'
import { RecentActivity } from '../components/RecentActivity'
import { LeadChart } from '../components/LeadChart'
import {
  Building2,
  FileText,
  Users,
  MessageSquare,
  UserPlus,
  TrendingUp,
  AlertCircle,
  CheckCircle,
} from 'lucide-react'

export default function DashboardOverview() {
  const stats = [
    {
      title: 'Total Projects',
      value: '24',
      change: '+12%',
      trend: 'up' as const,
      icon: Building2,
      color: 'blue' as const,
    },
    {
      title: 'Published Blogs',
      value: '156',
      change: '+8%',
      trend: 'up' as const,
      icon: FileText,
      color: 'green' as const,
    },
    {
      title: 'Active Users',
      value: '1,234',
      change: '+23%',
      trend: 'up' as const,
      icon: Users,
      color: 'purple' as const,
    },
    {
      title: 'Total Testimonials',
      value: '89',
      change: '+5%',
      trend: 'up' as const,
      icon: MessageSquare,
      color: 'amber' as const,
    },
    {
      title: 'Total Leads',
      value: '2,847',
      change: '+18%',
      trend: 'up' as const,
      icon: TrendingUp,
      color: 'indigo' as const,
    },
    {
      title: 'New Leads Today',
      value: '47',
      change: '+32%',
      trend: 'up' as const,
      icon: UserPlus,
      color: 'red' as const,
    },
  ]
  
  return (
    <>
      <Toaster position="top-right" expand={true} richColors />
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Dashboard Overview
            </h1>
            <p className="text-gray-600 mt-1">
              Welcome back! Here's what's happening with your real estate CMS.
            </p>
          </div>
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lead Analytics */}
          <div className="lg:col-span-2">
            <LeadChart />
          </div>
          {/* Recent Activity */}
          <div className="lg:col-span-1">
            <RecentActivity />
          </div>
        </div>
        {/* Quick Actions & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center p-4 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors">
                <Building2 className="w-5 h-5 mr-2" />
                Add Project
              </button>
              <button className="flex items-center justify-center p-4 border-2 border-dashed border-green-300 rounded-lg text-green-600 hover:bg-green-50 transition-colors">
                <FileText className="w-5 h-5 mr-2" />
                Write Blog
              </button>
              <button className="flex items-center justify-center p-4 border-2 border-dashed border-purple-300 rounded-lg text-purple-600 hover:bg-purple-50 transition-colors">
                <Users className="w-5 h-5 mr-2" />
                View Leads
              </button>
              <button className="flex items-center justify-center p-4 border-2 border-dashed border-amber-300 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors">
                <MessageSquare className="w-5 h-5 mr-2" />
                Add Testimonial
              </button>
            </div>
          </div>
          {/* Pending Approvals & Alerts */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Alerts & Approvals
            </h3>
            <div className="space-y-3">
              <div className="flex items-center p-3 bg-amber-50 rounded-lg border border-amber-200">
                <AlertCircle className="w-5 h-5 text-amber-600 mr-3" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-800">
                    3 blogs pending approval
                  </p>
                  <p className="text-xs text-amber-600">Review and publish</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-red-50 rounded-lg border border-red-200">
                <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800">
                    12 leads need follow-up
                  </p>
                  <p className="text-xs text-red-600">High priority contacts</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-800">
                    All systems operational
                  </p>
                  <p className="text-xs text-green-600">No issues detected</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
