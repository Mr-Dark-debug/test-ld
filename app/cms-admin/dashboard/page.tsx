'use client'

import React, { useState, useEffect } from 'react'
import { Toaster, toast } from 'sonner'
import { StatsCard } from '../components/StatsCard'
import { RecentActivity } from '../components/RecentActivity'
import { LeadChart } from '../components/LeadChart'
import { dashboardApi } from '@/lib/api'
import {
  Building2,
  FileText,
  Users,
  MessageSquare,
  UserPlus,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Loader2,
} from 'lucide-react'

// Icon mapping for dynamic icons
const iconMap = {
  Building2,
  FileText,
  Users,
  MessageSquare,
  TrendingUp,
  UserPlus,
};

export default function DashboardOverview() {
  const [stats, setStats] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [alerts, setAlerts] = useState<any[]>([]);

  // Fetch dashboard statistics and alerts
  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsResponse, alertsResponse] = await Promise.all([
        dashboardApi.getStats(),
        fetch('/api/alerts')
      ]);

      if (statsResponse.success && statsResponse.data) {
        // Map icons to actual components
        const statsWithIcons = statsResponse.data.stats.map((stat: any) => ({
          ...stat,
          icon: iconMap[stat.icon as keyof typeof iconMap] || Building2,
        }));

        setStats(statsWithIcons);
        setAnalytics(statsResponse.data.analytics);
        setLastUpdated(statsResponse.data.lastUpdated);
      } else {
        setError(statsResponse.error || 'Failed to fetch dashboard statistics');
        // Fallback to dummy data if API fails
        setStats([
          {
            title: 'Total Projects',
            value: '0',
            change: '+0%',
            trend: 'up' as const,
            icon: Building2,
            color: 'blue' as const,
          },
          {
            title: 'Published Blogs',
            value: '0',
            change: '+0%',
            trend: 'up' as const,
            icon: FileText,
            color: 'green' as const,
          },
          {
            title: 'Active Users',
            value: '0',
            change: '+0%',
            trend: 'up' as const,
            icon: Users,
            color: 'purple' as const,
          },
          {
            title: 'Total Testimonials',
            value: '0',
            change: '+0%',
            trend: 'up' as const,
            icon: MessageSquare,
            color: 'amber' as const,
          },
          {
            title: 'Total Leads',
            value: '0',
            change: '+0%',
            trend: 'up' as const,
            icon: TrendingUp,
            color: 'indigo' as const,
          },
          {
            title: 'New Leads Today',
            value: '0',
            change: '+0%',
            trend: 'up' as const,
            icon: UserPlus,
            color: 'red' as const,
          },
        ]);
      }

      // Fetch alerts
      if (alertsResponse.ok) {
        const alertsData = await alertsResponse.json();
        if (alertsData.success && alertsData.data) {
          setAlerts(alertsData.data);
        }
      } else {
        // Fallback alerts
        setAlerts([
          {
            type: 'warning',
            title: 'Pending blog approvals',
            description: 'Review and publish',
            count: 3,
            link: '/cms-admin/dashboard/blogs'
          },
          {
            type: 'error',
            title: 'High priority leads',
            description: 'Need follow-up',
            count: 12,
            link: '/cms-admin/dashboard/leads'
          },
          {
            type: 'success',
            title: 'System status',
            description: 'All systems operational',
            count: 0,
            link: null
          }
        ]);
      }
    } catch (err: any) {
      console.error('Error fetching dashboard stats:', err);
      setError(err.message || 'Failed to fetch dashboard statistics');
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();

    // Set up auto-refresh every 5 minutes
    const interval = setInterval(fetchDashboardStats, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

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
            {error && (
              <p className="text-red-500 text-sm mt-1">
                {error} - Showing fallback data
              </p>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={fetchDashboardStats}
              disabled={loading}
              className="inline-flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Refresh
            </button>
            <div className="text-sm text-gray-500">
              Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleString() : 'Never'}
            </div>
          </div>
        </div>
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && stats.length === 0 ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="animate-pulse">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-8 h-8 bg-gray-200 rounded"></div>
                    <div className="w-16 h-4 bg-gray-200 rounded"></div>
                  </div>
                  <div className="w-20 h-8 bg-gray-200 rounded mb-2"></div>
                  <div className="w-24 h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))
          ) : (
            stats.map((stat, index) => (
              <StatsCard key={index} {...stat} />
            ))
          )}
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
              <a href="/cms-admin/projects/add" className="flex items-center justify-center p-4 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors">
                <Building2 className="w-5 h-5 mr-2" />
                Add Project
              </a>
              <a href="/cms-admin/dashboard/blogs/create" className="flex items-center justify-center p-4 border-2 border-dashed border-green-300 rounded-lg text-green-600 hover:bg-green-50 transition-colors">
                <FileText className="w-5 h-5 mr-2" />
                Write Blog
              </a>
              <a href="/cms-admin/dashboard/leads" className="flex items-center justify-center p-4 border-2 border-dashed border-purple-300 rounded-lg text-purple-600 hover:bg-purple-50 transition-colors">
                <Users className="w-5 h-5 mr-2" />
                View Leads
              </a>
              <a href="/cms-admin/dashboard/testimonials" className="flex items-center justify-center p-4 border-2 border-dashed border-amber-300 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors">
                <MessageSquare className="w-5 h-5 mr-2" />
                Add Testimonial
              </a>
            </div>
          </div>
          {/* Pending Approvals & Alerts */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Alerts & Approvals
            </h3>
            <div className="space-y-3">
              {alerts.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  No alerts at this time
                </div>
              ) : (
                alerts.map((alert, index) => {
                  const alertStyles = {
                    warning: {
                      bg: 'bg-amber-50',
                      border: 'border-amber-200',
                      icon: 'text-amber-600',
                      title: 'text-amber-800',
                      desc: 'text-amber-600'
                    },
                    error: {
                      bg: 'bg-red-50',
                      border: 'border-red-200',
                      icon: 'text-red-600',
                      title: 'text-red-800',
                      desc: 'text-red-600'
                    },
                    success: {
                      bg: 'bg-green-50',
                      border: 'border-green-200',
                      icon: 'text-green-600',
                      title: 'text-green-800',
                      desc: 'text-green-600'
                    }
                  };

                  const style = alertStyles[alert.type as keyof typeof alertStyles] || alertStyles.warning;
                  const IconComponent = alert.type === 'success' ? CheckCircle : AlertCircle;

                  return (
                    <div key={index} className={`flex items-center p-3 ${style.bg} rounded-lg border ${style.border} ${alert.link ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
                      onClick={() => alert.link && (window.location.href = alert.link)}
                    >
                      <IconComponent className={`w-5 h-5 ${style.icon} mr-3`} />
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${style.title}`}>
                          {alert.count > 0 ? `${alert.count} ${alert.title}` : alert.title}
                        </p>
                        <p className={`text-xs ${style.desc}`}>{alert.description}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
