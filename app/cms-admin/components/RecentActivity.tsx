'use client'

import React, { useState, useEffect } from 'react'
import { Clock, User, FileText, Building2, MessageSquare, Settings, Shield, Loader2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'

// Define activity icon mapping
const activityIcons = {
  project: Building2,
  blog: FileText,
  lead: User,
  testimonial: MessageSquare,
  user: Shield,
  amenity: Settings,
  system: Settings,
};

// Define activity color mapping
const colorClasses = {
  project: 'bg-blue-100 text-blue-600',
  blog: 'bg-green-100 text-green-600',
  lead: 'bg-purple-100 text-purple-600',
  testimonial: 'bg-amber-100 text-amber-600',
  user: 'bg-indigo-100 text-indigo-600',
  amenity: 'bg-teal-100 text-teal-600',
  system: 'bg-gray-100 text-gray-600'
};

interface Activity {
  _id: string;
  type: keyof typeof activityIcons;
  action: string;
  title: string;
  userName: string;
  createdAt: string;
}

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch('/api/activities?limit=5');
        const data = await response.json();
        
        if (data.success && data.data) {
          setActivities(data.data);
        } else {
          setError(data.error || 'Failed to fetch activities');
        }
      } catch (err) {
        console.error('Error fetching activities:', err);
        setError('Failed to fetch activities');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchActivities();
  }, []);

  const formatTime = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      return 'some time ago';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <Clock className="w-5 h-5 text-gray-400" />
      </div>
      
      {isLoading ? (
        <div className="py-8 flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
          <p className="text-sm text-gray-500">Loading activities...</p>
        </div>
      ) : error ? (
        <div className="py-8 text-center">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      ) : activities.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-sm text-gray-500">No recent activities found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => {
            const IconComponent = activityIcons[activity.type] || Settings;
            const colorClass = colorClasses[activity.type] || 'bg-gray-100 text-gray-600';
            
            return (
              <div key={activity._id} className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-full ${colorClass} flex items-center justify-center flex-shrink-0`}>
                  <IconComponent className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.title}
                  </p>
                  <div className="flex items-center mt-1 text-xs text-gray-500">
                    <span>by {activity.userName}</span>
                    <span className="mx-1">•</span>
                    <span>{formatTime(activity.createdAt)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      <Link href="/cms-admin/dashboard/activity" className="block w-full mt-4 text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
        View all activity
      </Link>
    </div>
  )
}
