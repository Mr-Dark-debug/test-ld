'use client'

import React, { useState, useEffect } from 'react'
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
  Info,
  Globe,
  Download,
  Filter
} from 'lucide-react'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'

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
    icon: Users,
    submenu: true,
    submenuItems: [
      {
        name: 'All Leads',
        href: '/cms-admin/dashboard/leads',
        icon: Filter,
      },
      {
        name: 'Contact Inquiries',
        href: '/cms-admin/dashboard/leads/contact',
        icon: Globe,
      },
      {
        name: 'Brochure Requests',
        href: '/cms-admin/dashboard/leads/brochures',
        icon: Download,
      },
    ],
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
      {
        name: 'Contact Us',
        href: '/cms-admin/dashboard/pages/contact-us',
        icon: MapPin,
      },
      {
        name: 'Careers',
        href: '/cms-admin/dashboard/pages/careers',
        icon: Users,
      },
    ],
  },
  {
    name: 'Settings',
    href: '/cms-admin/dashboard/settings',
    icon: Settings,
  },
]

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname() || ''
  const { user } = useAuth()
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  
  useEffect(() => {
    navigation.forEach(item => {
      if (item.submenu && item.submenuItems?.some(subItem => 
        pathname === subItem.href || pathname.startsWith(`${subItem.href}/`))) {
        setOpenSubmenu(item.name);
      }
    });
  }, [pathname]);
  
  const toggleSubmenu = (name: string) => {
    setOpenSubmenu(openSubmenu === name ? null : name)
  }

  const isCurrentPath = (itemPath: string) => {
    return pathname === itemPath;
  }
  
  const isActivePath = (itemPath: string) => {
    return pathname.startsWith(`${itemPath}/`);
  }
  
  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.name) return 'U';
    
    const nameParts = user.name.trim().split(' ');
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }
    
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };
  
  // Get role display name
  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'Super Admin';
      case 'admin':
        return 'Admin';
      case 'editor':
        return 'Editor';
      default:
        return role;
    }
  };
  
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
              const isActive = item.submenu 
                ? item.submenuItems?.some(subItem => isCurrentPath(subItem.href) || isActivePath(subItem.href))
                : (item.href && (isCurrentPath(item.href) || isActivePath(item.href)));
              
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
                            const isSubItemActive = isCurrentPath(subItem.href);
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
                        className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isCurrentPath(item.href) ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}
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
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-blue-700">
                {getUserInitials()}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-gray-500">
                {user ? getRoleDisplayName(user.role) : 'Loading...'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
