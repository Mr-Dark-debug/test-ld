"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  category?: 'promotional' | 'interior' | 'exterior' | 'video';
  floorType?: '3bhk' | '4bhk';
}

interface TabGalleryProps {
  title: string;
  subtitle?: string;
  images: GalleryImage[];
}

const categories = [
  {
    id: 'promotional',
    label: 'Promotional',
    //icon: '✨',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80' // Placeholder image
  },
  {
    id: 'interior',
    label: 'Interior',
    //icon: '🛋️',
    imageUrl: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80' // Placeholder image
  },
  {
    id: 'exterior',
    label: 'Exterior',
    //icon: '🌳',
    imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80' // Placeholder image
  },
  {
    id: 'video',
    label: 'Videos',
    //icon: '🎬',
    imageUrl: 'https://images.unsplash.com/photo-1513106580091-1d82408b8cd6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80' // Placeholder image
  },
];

export default function TabGallery({ title, subtitle, images }: TabGalleryProps) {
  const [activeTab, setActiveTab] = useState<'gallery' | '3bhk' | '4bhk'>('gallery');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Filter images for 3BHK and 4BHK tabs
  const bhk3Images = images.filter(img => img.floorType === '3bhk');
  const bhk4Images = images.filter(img => img.floorType === '4bhk');
  
  // Filter gallery images by category
  const galleryImages = activeCategory 
    ? images.filter(img => img.category === activeCategory)
    : images.filter(img => img.category);

  const handleTabClick = (tab: 'gallery' | '3bhk' | '4bhk') => {
    setActiveTab(tab);
    setActiveCategory(null); // Reset category selection when changing tabs
  };

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  const renderGalleryContent = () => {
    if (activeTab === 'gallery' && !activeCategory) {
      // Show category cards when in gallery tab and no category selected
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6 mt-8">
          {categories.map((category) => (
            <div 
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className="bg-card rounded-lg shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl h-[200px] sm:h-[250px] relative group"
            >
              <Image 
                src={category.imageUrl}
                alt={category.label}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 z-10 backdrop-blur-[4px] bg-black/30"></div>
              <div className="absolute inset-0 flex items-center justify-center p-6 z-20 text-center">
                <h3 className="text-2xl md:text-3xl font-semibold text-white drop-shadow-lg">{category.label}</h3>
              </div>
            </div>
          ))}
        </div>
      );
    } else if (activeTab === 'gallery' && activeCategory) {
      // Show filtered images when a category is selected
      return (
        <div className="mt-8">
          <button 
            onClick={() => setActiveCategory(null)}
            className="mb-6 flex items-center px-4 py-2 rounded-md bg-card hover:bg-card/80 text-foreground transition-colors border border-border group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Categories
          </button>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {renderImageGrid(galleryImages)}
          </div>
        </div>
      );
    } else if (activeTab === '3bhk') {
      // Show 3BHK floor plans
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-8">
          {renderImageGrid(bhk3Images)}
        </div>
      );
    } else {
      // Show 4BHK floor plans
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-8">
          {renderImageGrid(bhk4Images)}
        </div>
      );
    }
  };

  const renderImageGrid = (imagesToRender: GalleryImage[]) => {
    if (imagesToRender.length === 0) {
      return (
        <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted w-16 h-16 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-medium mb-2">No Images Available</h3>
          <p className="text-foreground/60 max-w-md">There are currently no images available in this category. Please check back later for updates.</p>
        </div>
      );
    }
    
    return imagesToRender.map(image => (
      <motion.div
        key={image.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="group relative h-64 md:h-72 lg:h-80 rounded-lg shadow-md overflow-hidden"
      >
        {image.category === 'video' ? (
          <div className="w-full h-full bg-black flex items-center justify-center relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/20 rounded-full p-4 backdrop-blur-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <Image 
              src={image.src} 
              alt={image.alt} 
              fill
              className="object-cover opacity-60"
            />
          </div>
        ) : (
          <Image 
            src={image.src} 
            alt={image.alt} 
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute bottom-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <h3 className="text-lg font-medium">{image.alt}</h3>
        </div>
      </motion.div>
    ));
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-serif mb-3">{title}</h2>
          <div className="w-24 h-1 bg-highlight mx-auto rounded-full"></div>
          {subtitle && (
            <p className="text-foreground/70 mt-4 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* Tabs */}
        <div className="flex flex-col items-center mb-8 md:mb-12">
          <div className="flex space-x-1 sm:space-x-3 md:space-x-4 border-b border-border/70 w-full max-w-lg justify-center overflow-x-auto scrollbar-hide pb-px">
            <button
              onClick={() => handleTabClick('gallery')}
              className={cn(
                "py-2.5 sm:py-3 px-3 sm:px-4 text-sm sm:text-base font-medium transition-colors duration-200 relative whitespace-nowrap focus:outline-none group",
                activeTab === 'gallery' 
                  ? "text-highlight" 
                  : "text-foreground/60 hover:text-foreground/90"
              )}
            >
              Gallery
              {activeTab === 'gallery' && (
                <motion.div 
                  layoutId="activeTabIndicator"
                  className="absolute bottom-[-1px] left-0 right-0 h-[2.5px] bg-highlight rounded-t-full"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
            </button>
            <button
              onClick={() => handleTabClick('3bhk')}
              className={cn(
                "py-2.5 sm:py-3 px-3 sm:px-4 text-sm sm:text-base font-medium transition-colors duration-200 relative whitespace-nowrap focus:outline-none group",
                activeTab === '3bhk' 
                  ? "text-highlight" 
                  : "text-foreground/60 hover:text-foreground/90"
              )}
            >
              3BHK Plans
              {activeTab === '3bhk' && (
                <motion.div 
                  layoutId="activeTabIndicator"
                  className="absolute bottom-[-1px] left-0 right-0 h-[2.5px] bg-highlight rounded-t-full"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
            </button>
            <button
              onClick={() => handleTabClick('4bhk')}
              className={cn(
                "py-2.5 sm:py-3 px-3 sm:px-4 text-sm sm:text-base font-medium transition-colors duration-200 relative whitespace-nowrap focus:outline-none group",
                activeTab === '4bhk' 
                  ? "text-highlight" 
                  : "text-foreground/60 hover:text-foreground/90"
              )}
            >
              4BHK Plans
              {activeTab === '4bhk' && (
                <motion.div 
                  layoutId="activeTabIndicator"
                  className="absolute bottom-[-1px] left-0 right-0 h-[2.5px] bg-highlight rounded-t-full"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeTab}-${activeCategory || 'none'}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            {renderGalleryContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
} 