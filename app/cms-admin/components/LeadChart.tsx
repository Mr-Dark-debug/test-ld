'use client'

import React from 'react'
import { TrendingUp, Users, Target, Calendar } from 'lucide-react'

export function LeadChart() {
  const leadData = [
    {
      month: 'Jan',
      leads: 45,
      conversions: 12,
    },
    {
      month: 'Feb',
      leads: 52,
      conversions: 15,
    },
    {
      month: 'Mar',
      leads: 48,
      conversions: 14,
    },
    {
      month: 'Apr',
      leads: 61,
      conversions: 18,
    },
    {
      month: 'May',
      leads: 55,
      conversions: 16,
    },
    {
      month: 'Jun',
      leads: 67,
      conversions: 22,
    },
  ]
  
  const maxLeads = Math.max(...leadData.map((d) => d.leads))
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Lead Analytics
          </h3>
          <p className="text-sm text-gray-600">
            Monthly lead generation and conversion trends
          </p>
        </div>
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
      </div>
      {/* Chart */}
      <div className="h-64 flex items-end justify-between space-x-2 mb-6">
        {leadData.map((data, index) => (
          <div
            key={index}
            className="flex-1 flex flex-col items-center space-y-2"
          >
            <div className="w-full flex flex-col items-center space-y-1">
              {/* Leads bar */}
              <div
                className="w-full bg-blue-500 rounded-t-sm"
                style={{
                  height: `${(data.leads / maxLeads) * 200}px`,
                }}
              ></div>
              {/* Conversions bar */}
              <div
                className="w-full bg-green-500 rounded-t-sm"
                style={{
                  height: `${(data.conversions / maxLeads) * 200}px`,
                }}
              ></div>
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
          <p className="text-2xl font-bold text-gray-900">328</p>
          <p className="text-xs text-gray-600">Total Leads</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-lg mx-auto mb-2">
            <Target className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">97</p>
          <p className="text-xs text-gray-600">Conversions</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-lg mx-auto mb-2">
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">29.6%</p>
          <p className="text-xs text-gray-600">Conv. Rate</p>
        </div>
      </div>
    </div>
  )
}
