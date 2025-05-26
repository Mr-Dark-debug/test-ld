'use client'

import React from 'react'
import { DashboardLayout } from '../components/DashboardLayout'

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>
}
