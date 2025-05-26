'use client'

import React, { useState } from 'react'
import { Toaster } from 'sonner'
import { User, Mail, Phone, Lock, Shield, LogOut } from 'lucide-react'
import { notify } from '../../components/Notification'

export default function ProfileSettings() {
  const [isEditing, setIsEditing] = useState(false)
  
  const handleSave = () => {
    setIsEditing(false)
    notify.success('Profile updated successfully')
  }
  
  return (
    <>
      <Toaster position="top-right" expand={true} richColors />
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600">
            Manage your account settings and preferences
          </p>
        </div>
        {/* Profile Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Personal Information
            </h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>
          <div className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              {isEditing && (
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Change Avatar
                </button>
              )}
            </div>
            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  defaultValue="Admin User"
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  defaultValue="admin@realestate.com"
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  defaultValue="+1 (555) 123-4567"
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <input
                  type="text"
                  value="Super Admin"
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>
            </div>
            {isEditing && (
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
        {/* Security Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Security</h2>
          <div className="space-y-4">
            <button
              onClick={() =>
                notify.info('Password change dialog will be implemented')
              }
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="flex items-center">
                <Lock className="w-5 h-5 text-gray-400 mr-3" />
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-900">
                    Change Password
                  </div>
                  <div className="text-xs text-gray-500">
                    Last changed 30 days ago
                  </div>
                </div>
              </div>
              <div className="text-sm text-blue-600">Update</div>
            </button>
            <button
              onClick={() => notify.info('2FA setup will be implemented')}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="flex items-center">
                <Shield className="w-5 h-5 text-gray-400 mr-3" />
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-900">
                    Two-Factor Authentication
                  </div>
                  <div className="text-xs text-gray-500">Not enabled</div>
                </div>
              </div>
              <div className="text-sm text-blue-600">Enable</div>
            </button>
            <button
              onClick={() => notify.warning('This action will log you out')}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="flex items-center">
                <LogOut className="w-5 h-5 text-gray-400 mr-3" />
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-900">
                    Sign Out
                  </div>
                  <div className="text-xs text-gray-500">
                    Sign out from all devices
                  </div>
                </div>
              </div>
              <div className="text-sm text-red-600">Sign Out</div>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
