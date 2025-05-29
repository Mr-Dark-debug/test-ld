'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Building2,
  LayoutDashboard,
  FolderOpen,
  FileText,
  Users,
  MessageSquare,
  Settings,
  X,
  BarChart3,
  MapPin,
  ChevronDown,
  ChevronRight,
  FileEdit,
  Info
} from 'lucide-react'
import Image from 'next/image'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const navigation = [
  {
    name: 'Dashboard',
    href: '/cms-admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Projects',
    href: '/cms-admin/dashboard/projects',
    icon: Building2,
  },
  {
    name: 'Blogs',
    href: '/cms-admin/dashboard/blogs',
    icon: FileText,
  },
  {
    name: 'Leads',
    href: '/cms-admin/dashboard/leads',
    icon: Users,
  },
  {
    name: 'Testimonials',
    href: '/cms-admin/dashboard/testimonials',
    icon: MessageSquare,
  },
  {
    name: 'Pages',
    icon: FileEdit,
    submenu: true,
    submenuItems: [
      {
        name: 'About Us',
        href: '/cms-admin/dashboard/pages/about-us',
        icon: Info,
      },
    ],
  },
  {
    name: 'Amenities',
    href: '/cms-admin/dashboard/amenities',
    icon: MapPin,
  },
  {
    name: 'Settings',
    href: '/cms-admin/dashboard/settings',
    icon: Settings,
  },
]

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname() || ''
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  
  const toggleSubmenu = (name: string) => {
    setOpenSubmenu(openSubmenu === name ? null : name)
  }
  
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={onClose}
          />
        </div>
      )}
      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 bg-transparent rounded-lg">
              <Image src="/images/logo/logo.png" alt="Logo" width={40} height={40} className="w-10 h-10 object-contain" />
            </div>
            <span className="ml-3 text-lg font-semibold text-gray-900">
              CMS
            </span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname ? (item.submenu ? item.submenuItems?.some(subItem => pathname === subItem.href || pathname.startsWith(`${subItem.href}/`)) : pathname === item.href || pathname.startsWith(`${item.href}/`)) : false
              
              return (
                <div key={item.name}>
                  {item.submenu ? (
                    <>
                      <button
                        onClick={() => toggleSubmenu(item.name)}
                        className={`group flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}
                      >
                        <div className="flex items-center">
                          <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                          {item.name}
                        </div>
                        {openSubmenu === item.name ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                      {openSubmenu === item.name && (
                        <div className="ml-6 mt-1 space-y-1">
                          {item.submenuItems?.map((subItem) => {
                            const isSubItemActive = pathname === subItem.href || pathname.startsWith(`${subItem.href}/`)
                            return (
                              <Link
                                key={subItem.name}
                                href={subItem.href}
                                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isSubItemActive ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}
                              >
                                <subItem.icon className="mr-3 h-4 w-4 flex-shrink-0" />
                                {subItem.name}
                              </Link>
                            )
                          })}
                        </div>
                      )}
                    </>
                  ) : (
                    item.href && (
                      <Link
                        href={item.href}
                        className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}
                      >
                        <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                        {item.name}
                      </Link>
                    )
                  )}
                </div>
              )
            })}
          </div>
        </nav>
        {/* User section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700">AD</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">Admin User</p>
              <p className="text-xs text-gray-500">Super Admin</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
