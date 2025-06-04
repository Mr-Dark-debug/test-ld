'use client'

import React from 'react'
import { DashboardLayout } from '../components/DashboardLayout'
import { withAuth } from '@/contexts/AuthContext'

function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>
}

// Protect the dashboard with authentication (allow all authenticated users)
export default withAuth(Layout, ['super_admin', 'admin', 'editor', 'user'])
