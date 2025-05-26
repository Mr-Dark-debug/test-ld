'use client'

import React from 'react'
import { Clock, User, FileText, Building2, MessageSquare } from 'lucide-react'

const activities = [
  {
    id: 1,
    type: 'project',
    title: 'New project "Skyline Towers" added',
    user: 'Admin User',
    time: '2 minutes ago',
    icon: Building2,
    color: 'blue',
  },
  {
    id: 2,
    type: 'blog',
    title: 'Blog post "Market Trends 2024" published',
    user: 'Content Admin',
    time: '15 minutes ago',
    icon: FileText,
    color: 'green',
  },
  {
    id: 3,
    type: 'lead',
    title: '5 new leads from contact form',
    user: 'System',
    time: '1 hour ago',
    icon: User,
    color: 'purple',
  },
  {
    id: 4,
    type: 'testimonial',
    title: 'New testimonial from John Smith',
    user: 'Admin User',
    time: '2 hours ago',
    icon: MessageSquare,
    color: 'amber',
  },
  {
    id: 5,
    type: 'project',
    title: 'Project "Green Valley" updated',
    user: 'Project Manager',
    time: '3 hours ago',
    icon: Building2,
    color: 'blue',
  },
]

const colorClasses = {
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  purple: 'bg-purple-100 text-purple-600',
  amber: 'bg-amber-100 text-amber-600',
}

export function RecentActivity() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <Clock className="w-5 h-5 text-gray-400" />
      </div>
      <div className="space-y-4">
        {activities.map((activity) => {
          const colorClass =
            colorClasses[activity.color as keyof typeof colorClasses]
          return (
            <div key={activity.id} className="flex items-start space-x-3">
              <div
                className={`w-8 h-8 rounded-full ${colorClass} flex items-center justify-center flex-shrink-0`}
              >
                <activity.icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {activity.title}
                </p>
                <div className="flex items-center mt-1 text-xs text-gray-500">
                  <span>by {activity.user}</span>
                  <span className="mx-1">•</span>
                  <span>{activity.time}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
        View all activity
      </button>
    </div>
  )
}
