'use client'

import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string
  change: string
  trend: 'up' | 'down'
  icon: LucideIcon
  color: 'blue' | 'green' | 'purple' | 'amber' | 'indigo' | 'red'
}

const colorClasses = {
  blue: 'bg-blue-500 text-blue-600 bg-blue-50',
  green: 'bg-green-500 text-green-600 bg-green-50',
  purple: 'bg-purple-500 text-purple-600 bg-purple-50',
  amber: 'bg-amber-500 text-amber-600 bg-amber-50',
  indigo: 'bg-indigo-500 text-indigo-600 bg-indigo-50',
  red: 'bg-red-500 text-red-600 bg-red-50',
}

export function StatsCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  color,
}: StatsCardProps) {
  const [bgColor, textColor, lightBg] = colorClasses[color].split(' ')
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <div className="flex items-center mt-2">
            {trend === 'up' ? (
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
            )}
            <span
              className={`text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}
            >
              {change}
            </span>
            <span className="text-sm text-gray-500 ml-1">vs last month</span>
          </div>
        </div>
        <div
          className={`w-12 h-12 ${lightBg} rounded-lg flex items-center justify-center`}
        >
          <Icon className={`w-6 h-6 ${textColor}`} />
        </div>
      </div>
    </div>
  )
}
