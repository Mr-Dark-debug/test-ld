'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Search, Check, X } from 'lucide-react'
import * as LucideIcons from 'lucide-react'

// Extract all icons from Lucide
const iconNames = Object.keys(LucideIcons).filter(
  key => typeof LucideIcons[key as keyof typeof LucideIcons] === 'function' && key !== 'createLucideIcon'
)

interface IconSelectorProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function IconSelector({ value, onChange, className = '' }: IconSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIcon, setSelectedIcon] = useState(value || 'Home')
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  // Filter icons based on search query
  const filteredIcons = iconNames.filter(name =>
    name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  // Handle clicking outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  
  // Handle icon selection
  const handleSelectIcon = (iconName: string) => {
    setSelectedIcon(iconName)
    onChange(iconName)
    setIsOpen(false)
  }
  
  // Get the selected icon component
  const SelectedIconComponent = LucideIcons[selectedIcon as keyof typeof LucideIcons] as React.FC<{ className?: string }>
  
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Selected icon button */}
      <button
        type="button"
        className="w-full flex items-center justify-between border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          {SelectedIconComponent && (
            <SelectedIconComponent className="w-5 h-5 mr-2 text-gray-600" />
          )}
          <span className="text-sm">{selectedIcon}</span>
        </div>
        <span className="text-gray-400">{isOpen ? '▲' : '▼'}</span>
      </button>
      
      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
          {/* Search input */}
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search icons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>
          </div>
          
          {/* Icons grid */}
          <div className="max-h-60 overflow-y-auto p-2">
            {filteredIcons.length === 0 ? (
              <div className="py-4 text-center text-gray-500 text-sm">No icons found</div>
            ) : (
              <div className="grid grid-cols-4 gap-2">
                {filteredIcons.map((iconName) => {
                  const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons] as React.FC<{ className?: string }>
                  const isSelected = iconName === selectedIcon
                  
                  return (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => handleSelectIcon(iconName)}
                      className={`flex flex-col items-center justify-center p-2 rounded-md hover:bg-gray-100 ${
                        isSelected ? 'bg-blue-50 text-blue-600 border border-blue-200' : ''
                      }`}
                    >
                      <IconComponent className="w-5 h-5 mb-1" />
                      <span className="text-xs truncate w-full text-center">{iconName}</span>
                      {isSelected && (
                        <Check className="absolute top-1 right-1 h-3 w-3 text-blue-600" />
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
} 