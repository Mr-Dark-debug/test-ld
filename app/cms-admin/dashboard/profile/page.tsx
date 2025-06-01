'use client'

import React, { useState } from 'react'
import { Toaster, toast } from 'sonner'
import { User, Mail, Phone, Lock, Shield, LogOut, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function ProfileSettings() {
  const { user, updateProfile, logout, isLoading } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  
  // Form state
  const [name, setName] = useState(user?.name || '')
  const [phone, setPhone] = useState(user?.phone || '')
  
  // Reset form when canceling
  const handleCancel = () => {
    setName(user?.name || '')
    setPhone(user?.phone || '')
    setIsEditing(false)
  }
  
  // Handle form submit
  const handleSave = async () => {
    if (!user) return
    
    try {
      setIsUpdating(true)
      
      // Basic validation
      if (!name.trim()) {
        toast.error('Name is required')
        return
      }
      
      const result = await updateProfile({
        name,
        phone
      })
      
      if (result.success) {
        toast.success('Profile updated successfully')
        setIsEditing(false)
      } else {
        toast.error(result.error || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('An error occurred while updating your profile')
    } finally {
      setIsUpdating(false)
    }
  }
  
  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Logged out successfully')
      router.push('/cms-admin')
    } catch (error) {
      toast.error('Error logging out')
    }
  }
  
  // Function to get role display name
  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'Super Admin'
      case 'admin':
        return 'Admin'
      case 'editor':
        return 'Editor'
      default:
        return role
    }
  }
  
  // Show loading state if user data is loading
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    )
  }
  
  // Show error if no user data
  if (!user) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          <p>User data not available. Please try logging in again.</p>
        </div>
      </div>
    )
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
              onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              disabled={isUpdating}
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
                <button 
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  onClick={() => toast.info('Profile image upload will be implemented')}
                >
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
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!isEditing || isUpdating}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={!isEditing || isUpdating}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <input
                  type="text"
                  value={getRoleDisplayName(user.role)}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>
            </div>
            {isEditing && (
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={isUpdating}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 inline animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
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
                toast.info('Password change dialog will be implemented')
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
                    Last changed {user.lastLogin 
                      ? new Date(user.lastLogin).toLocaleDateString() 
                      : 'never'}
                  </div>
                </div>
              </div>
              <div className="text-sm text-blue-600">Update</div>
            </button>
            <button
              onClick={() => toast.info('2FA setup will be implemented')}
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
              onClick={handleLogout}
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
