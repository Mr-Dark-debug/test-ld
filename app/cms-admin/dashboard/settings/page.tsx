'use client'

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/badge'
import AnimatedBackground from '@/components/ui/animated-tabs'
import { toast } from 'react-hot-toast'
import {
  Users,
  Loader2
} from 'lucide-react'

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('roles');



  useEffect(() => {
    setIsLoading(true);
    // Simulate loading for system settings
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);





  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2 text-lg">Loading settings...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">System Settings</h1>
          <p className="text-gray-600 mt-1">
            Manage system configuration and role permissions
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="w-full">
        <div className="rounded-xl bg-white overflow-hidden mb-8">
          <AnimatedBackground
            defaultValue={activeTab}
            className="bg-blue-50 dark:bg-blue-900/20"
            transition={{
              type: "spring",
              bounce: 0.2,
              duration: 0.3,
            }}
            onValueChange={(value) => value && setActiveTab(value)}
          >
            <button
              type="button"
              data-id="roles"
              className="py-2 px-6 font-medium text-gray-700 data-[checked=true]:text-blue-600 dark:text-gray-300 dark:data-[checked=true]:text-blue-400"
            >
              Role Permissions
            </button>

            <button
              type="button"
              data-id="system"
              className="py-2 px-6 font-medium text-gray-700 data-[checked=true]:text-blue-600 dark:text-gray-300 dark:data-[checked=true]:text-blue-400"
            >
              System Settings
            </button>
          </AnimatedBackground>
        </div>



        {/* Role Permissions Tab */}
        {activeTab === "roles" && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Role Permissions</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium text-purple-600 mb-2">Super Admin</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Full system access</li>
                    <li>• User management</li>
                    <li>• System settings</li>
                    <li>• All content management</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium text-blue-600 mb-2">Admin</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Content management</li>
                    <li>• User management (limited)</li>
                    <li>• View analytics</li>
                    <li>• Manage projects</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium text-green-600 mb-2">Editor</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Create/edit content</li>
                    <li>• Manage blogs</li>
                    <li>• Upload media</li>
                    <li>• View reports</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium text-gray-600 mb-2">User</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• View content</li>
                    <li>• Basic interactions</li>
                    <li>• Profile management</li>
                    <li>• Limited access</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        )}



        {/* System Settings Tab */}
        {activeTab === "system" && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">System Configuration</h2>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Database Status</h3>
                <p className="text-sm text-green-600">✓ Connected to MongoDB</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">API Status</h3>
                <p className="text-sm text-green-600">✓ All APIs operational</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Authentication</h3>
                <p className="text-sm text-green-600">✓ JWT tokens active (7 days expiry)</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">User Management</h3>
                <p className="text-sm text-blue-600">
                  <a href="/cms-admin/dashboard/users" className="hover:underline">
                    → Manage users in dedicated page
                  </a>
                </p>
              </div>
            </div>
          </Card>
        )}


      </div>
    </div>
  );
}
