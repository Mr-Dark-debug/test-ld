'use client'

import React from 'react'
import { Toaster } from 'sonner'
import { Mail, Server, Shield, Database } from 'lucide-react'
import { notify } from '../../components/Notification'

export default function SystemSettings() {
  return (
    <>
      <Toaster position="top-right" expand={true} richColors />
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600">
            Configure system-wide settings and preferences
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            General Configuration
          </h2>
          <div className="space-y-4">
            <button
              onClick={() => notify.info('Email settings will be implemented')}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-gray-400 mr-3" />
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-900">
                    Email Settings
                  </div>
                  <div className="text-xs text-gray-500">
                    Configure SMTP and email templates
                  </div>
                </div>
              </div>
              <div className="text-sm text-blue-600">Configure</div>
            </button>
            <button
              onClick={() => notify.info('Server settings will be implemented')}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="flex items-center">
                <Server className="w-5 h-5 text-gray-400 mr-3" />
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-900">
                    Server Configuration
                  </div>
                  <div className="text-xs text-gray-500">
                    File upload limits and server settings
                  </div>
                </div>
              </div>
              <div className="text-sm text-blue-600">Configure</div>
            </button>
            <button
              onClick={() => notify.info('User permissions will be implemented')}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="flex items-center">
                <Shield className="w-5 h-5 text-gray-400 mr-3" />
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-900">
                    User Permissions
                  </div>
                  <div className="text-xs text-gray-500">
                    Role-based access control
                  </div>
                </div>
              </div>
              <div className="text-sm text-blue-600">Configure</div>
            </button>
            <button
              onClick={() => notify.info('Backup settings will be implemented')}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="flex items-center">
                <Database className="w-5 h-5 text-gray-400 mr-3" />
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-900">
                    Backup & Maintenance
                  </div>
                  <div className="text-xs text-gray-500">
                    System backup and maintenance settings
                  </div>
                </div>
              </div>
              <div className="text-sm text-blue-600">Configure</div>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
