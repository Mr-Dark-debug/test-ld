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
  Filter,
  Award,
  Cog,
  Activity
} from 'lucide-react'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

// Define navigation items with role-based access
const getNavigationItems = (userRole: string) => {
  const baseNavigation = [
    {
      name: 'Dashboard',
      href: '/cms-admin/dashboard',
      icon: LayoutDashboard,
      roles: ['super_admin', 'admin', 'editor', 'user'],
    },
  ];

  // Content management (available to editors and above)
  if (['super_admin', 'admin', 'editor'].includes(userRole)) {
    baseNavigation.push(
      {
        name: 'Projects',
        href: '/cms-admin/dashboard/projects',
        icon: Building2,
        roles: ['super_admin', 'admin', 'editor'],
      },
      {
        name: 'Blogs',
        href: '/cms-admin/dashboard/blogs',
        icon: FileText,
        roles: ['super_admin', 'admin', 'editor'],
      },
      {
        name: 'Testimonials',
        href: '/cms-admin/dashboard/testimonials',
        icon: MessageSquare,
        roles: ['super_admin', 'admin', 'editor'],
      }
    );
  }

  // Lead management (available to admins and above)
  if (['super_admin', 'admin'].includes(userRole)) {
    baseNavigation.push({
      name: 'Leads',
      icon: Users,
      submenu: true,
      roles: ['super_admin', 'admin'],
      submenuItems: [
        {
          name: 'All Leads',
          href: '/cms-admin/dashboard/leads',
          icon: Filter,
          roles: ['super_admin', 'admin'],
        },
        {
          name: 'Contact Inquiries',
          href: '/cms-admin/dashboard/leads/contact',
          icon: Globe,
          roles: ['super_admin', 'admin'],
        },
        {
          name: 'Brochure Requests',
          href: '/cms-admin/dashboard/leads/brochures',
          icon: Download,
          roles: ['super_admin', 'admin'],
        },
      ],
    });
  }

  // Page management (available to editors and above)
  if (['super_admin', 'admin', 'editor'].includes(userRole)) {
    baseNavigation.push({
      name: 'Pages',
      icon: FileEdit,
      submenu: true,
      roles: ['super_admin', 'admin', 'editor'],
      submenuItems: [
        {
          name: 'About Us',
          href: '/cms-admin/dashboard/pages/about-us',
          icon: Info,
          roles: ['super_admin', 'admin', 'editor'],
        },
        {
          name: 'Contact Us',
          href: '/cms-admin/dashboard/pages/contact-us',
          icon: MapPin,
          roles: ['super_admin', 'admin', 'editor'],
        },
        {
          name: 'Careers',
          href: '/cms-admin/dashboard/pages/careers',
          icon: Users,
          roles: ['super_admin', 'admin', 'editor'],
        },
        {
          name: 'Awards',
          href: '/cms-admin/dashboard/pages/awards',
          icon: Award,
          roles: ['super_admin', 'admin', 'editor'],
        },
      ],
    });
  }

  // Settings - always available but with different submenu items based on role
  if (userRole === 'user') {
    // Regular users only see general settings
    baseNavigation.push({
      name: 'Settings',
      href: '/cms-admin/dashboard/settings',
      icon: Settings,
      roles: ['super_admin', 'admin', 'editor', 'user'],
    });
  } else {
    // Admins and above see settings with submenu
    const settingsSubmenu = [
      {
        name: 'General',
        href: '/cms-admin/dashboard/settings',
        icon: Cog,
        roles: ['super_admin', 'admin', 'editor'],
      }
    ];

    // User management (super_admin and admin)
    if (['super_admin', 'admin'].includes(userRole)) {
      settingsSubmenu.push({
        name: 'Users',
        href: '/cms-admin/dashboard/users',
        icon: Users,
        roles: ['super_admin', 'admin'],
      });
    }

    // Activity log (admin and above)
    if (['super_admin', 'admin', 'editor'].includes(userRole)) {
      settingsSubmenu.push({
        name: 'Activity Log',
        href: '/cms-admin/dashboard/activity',
        icon: Activity,
        roles: ['super_admin', 'admin', 'editor'],
      });
    }

    baseNavigation.push({
      name: 'Settings',
      icon: Settings,
      submenu: true,
      roles: ['super_admin', 'admin', 'editor'],
      submenuItems: settingsSubmenu,
    });
  }

  return baseNavigation;
};

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname() || ''
  const { user } = useAuth()
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  const [initialLoad, setInitialLoad] = useState(true)

  // Get navigation items based on user role
  const navigation = user ? getNavigationItems(user.role) : [];

  // Set initial open submenu based on current path (only on first load)
  useEffect(() => {
    if (initialLoad && navigation.length > 0) {
      navigation.forEach(item => {
        if (item.submenu && item.submenuItems?.some(subItem =>
          pathname === subItem.href || pathname.startsWith(`${subItem.href}/`))) {
          setOpenSubmenu(item.name);
        }
      });
      setInitialLoad(false);
    }
  }, [pathname, navigation, initialLoad]);

  const toggleSubmenu = (name: string) => {
    // Always close the current submenu if it's the same, otherwise open the new one
    setOpenSubmenu(prevOpen => prevOpen === name ? null : name)
  }

  // Close sidebar on mobile when navigating to a page
  const handleNavigation = () => {
    // Close sidebar on mobile when navigating
    onClose();
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
      case 'user':
        return 'User';
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
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            toggleSubmenu(item.name);
                          }
                        }}
                        className={`group flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}
                        aria-expanded={openSubmenu === item.name}
                        aria-controls={`submenu-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
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
                        <div
                          className="ml-6 mt-1 space-y-1"
                          id={`submenu-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                          role="menu"
                        >
                          {item.submenuItems?.map((subItem) => {
                            const isSubItemActive = isCurrentPath(subItem.href);
                            return (
                              <Link
                                key={subItem.name}
                                href={subItem.href}
                                onClick={handleNavigation}
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
                        onClick={handleNavigation}
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
