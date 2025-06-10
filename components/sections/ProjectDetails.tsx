"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { AmenitiesFeatures } from "@/components/AmenitiesFeatures";
import { motion, AnimatePresence, useAnimation, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon, MapPin, ExternalLink, XIcon, QrCodeIcon } from "lucide-react";
import { toast } from 'sonner';

const NAVY_BLUE_BACKGROUND = "bg-[#324189]/80";
const NAVY_BLUE_BACKGROUND_HOVER = "bg-[#324189]/90";

export interface Amenity {
  id: string;
  name: string;
  icon: React.ReactNode;
}

export interface Specification {
  name: string;
  value: string;
}

interface ProjectDetailsProps {
  title: string;
  description: string;
  location: string;
  status: "ongoing" | "completed" | "upcoming";
  type: "residential" | "commercial";
  imageSrc: string;
  threeDModelUrl?: string; // For future actual 3D model
  specifications: Specification[];
  amenities: Amenity[];
  brochureUrl?: string;
  contactPhone?: string;
  reraNumber?: string;
  mapEmbedUrl?: string;
  reraQrImage?: string;
}

export default function ProjectDetails({
  title,
  description,
  location,
  status,
  type,
  imageSrc,
  threeDModelUrl, // Will be used if/when an actual model URL is provided
  specifications,
  amenities,
  brochureUrl,
  contactPhone,
  reraNumber,
  mapEmbedUrl,
  reraQrImage,
}: ProjectDetailsProps) {
  const [currentSlide, setCurrentSlide] = useState(0); // 0 for image, 1 for 3D view
  const [isLoading3D, setIsLoading3D] = useState(false);
  const [is3DModelLoaded, setIs3DModelLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showMap, setShowMap] = useState(false); // State for map visibility
  const [showReraQrPopup, setShowReraQrPopup] = useState(false); // State for RERA QR popup

  const has3DView = true; // Set to true to always show the 3D view slide option

  const handleLoad3DModel = () => {
    setIsLoading3D(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsLoading3D(false);
          setIs3DModelLoaded(true);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const slides = ["image"];
  if (has3DView) {
    slides.push("3dview");
  }

  const changeSlide = (direction: number) => {
    setCurrentSlide(prev => {
      const newSlide = prev + direction;
      if (newSlide < 0) return slides.length - 1;
      if (newSlide >= slides.length) return 0;
      return newSlide;
    });
  };
  
  const getStatusColor = () => {
    switch (status) {
      case "ongoing": return `${NAVY_BLUE_BACKGROUND} hover:${NAVY_BLUE_BACKGROUND_HOVER} text-white`;
      case "completed": return `${NAVY_BLUE_BACKGROUND} hover:${NAVY_BLUE_BACKGROUND_HOVER} text-white`;
      case "upcoming": return `${NAVY_BLUE_BACKGROUND} hover:${NAVY_BLUE_BACKGROUND_HOVER} text-white`;
      default: return "bg-gray-500/80 hover:bg-gray-600/90 text-white";
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case "residential": return `${NAVY_BLUE_BACKGROUND} hover:${NAVY_BLUE_BACKGROUND_HOVER} text-white`;
      case "commercial": return `${NAVY_BLUE_BACKGROUND} hover:${NAVY_BLUE_BACKGROUND_HOVER} text-white`;
      default: return "bg-gray-500/80 hover:bg-gray-600/90 text-white";
    }
  };

  // Placeholder: Generate a Google Maps embed URL from the location string
  // In a real app, you might use a geocoding API or have structured address data
  const getMapEmbedUrl = (loc: string) => {
    return `https://maps.google.com/maps?q=${encodeURIComponent(loc)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  };

  const getReraQrCodeUrl = (reraNum: string) => {
    if (!reraNum) return "";
    // Using a public QR code generator API
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(reraNum)}`;
  };

  return (
    <>
      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {/* Project Image / 3D View Slider */}
            <div className="relative h-[350px] sm:h-[450px] md:h-[550px] lg:h-full min-h-[450px] rounded-lg shadow-xl group overflow-hidden">
              <AnimatePresence initial={false} custom={currentSlide}>
                {slides[currentSlide] === "image" && (
                  <motion.div
                    key="image"
                    initial={{ opacity: 0, x: currentSlide === 0 ? 0 : (currentSlide > 0 ? 300 : -300) }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: currentSlide === 0 ? (currentSlide > 0 ? -300: 300) : 0}}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={imageSrc}
                      alt={title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </motion.div>
                )}
                {slides[currentSlide] === "3dview" && (
                  <motion.div
                    key="3dview"
                    initial={{ opacity: 0, x: currentSlide === 1 ? 0 : (currentSlide > 1 ? 300 : -300) }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: currentSlide === 1 ? (currentSlide > 0 ? -300 : 300) : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 via-slate-900 to-black p-8 text-center"
                  >
                    {!is3DModelLoaded && !isLoading3D && (
                      <div className="flex flex-col items-center">
                        <h3 className="text-2xl sm:text-3xl font-semibold text-white mb-3">Interactive 3D Tour</h3>
                        <p className="text-gray-300 mb-6 text-sm sm:text-base max-w-md">Explore the project in immersive 3D. Click below to load the experience.</p>
                        <ShimmerButton
                          onClick={handleLoad3DModel}
                          shimmerColor="#FFFFFFCC"
                          shimmerSize="0.1em"
                          background="rgba(var(--highlight-rgb), 0.9)"
                          className="font-medium px-8 py-3 text-sm sm:text-base rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          Load 3D Model
                        </ShimmerButton>
                      </div>
                    )}
                    {isLoading3D && (
                      <div className="w-full max-w-xs flex flex-col items-center">
                        <div className="h-3 w-full relative max-w-xs rounded-full overflow-hidden bg-gray-700/50 mb-2.5">
                          <motion.div 
                            className="h-full bg-highlight absolute"
                            initial={{ width: "0%" }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.2, ease: "linear"}}
                          />
                        </div>
                        <p className="text-white text-xs sm:text-sm">Loading 3D Model... {progress}%</p>
                      </div>
                    )}
                    {is3DModelLoaded && (
                      <div className="text-white text-xl sm:text-2xl font-semibold">
                        3D Model will be added here.
                        {/* Replace above with actual <iframe> or 3D component when URL is available */}
                        {/* e.g., <iframe src={threeDModelUrl} ... /> */}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Arrows */}
              {slides.length > 1 && (
                <>
                  <button 
                    onClick={() => changeSlide(-1)} 
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 p-2 rounded-full text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-highlight/80 shadow-lg"
                    aria-label="Previous Slide"
                  >
                    <ChevronLeftIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                  <button 
                    onClick={() => changeSlide(1)} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 p-2 rounded-full text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-highlight/80 shadow-lg"
                    aria-label="Next Slide"
                  >
                    <ChevronRightIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </>
              )}

              {/* Dot Indicators */}
              {slides.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
                  {slides.map((_, index) => (
                    <button 
                      key={index} 
                      onClick={() => setCurrentSlide(index)}
                      className={cn(
                        "w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 focus:outline-none",
                        currentSlide === index ? "bg-highlight scale-125" : "bg-white/50 hover:bg-white/80"
                      )}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Project Info */}
            <div className="flex flex-col justify-center pt-12 lg:pt-0">
              <div className="flex flex-wrap gap-2 mb-3">
                {type && (
                  <span className={cn("px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium shadow-md transition-colors duration-300", getTypeColor())}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </span>
                )}
                {status && (
                  <span className={cn("px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium shadow-md transition-colors duration-300", getStatusColor())}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display mb-3">{title}</h1>
              
              {/* Location with Map Toggle */}
              <button 
                onClick={() => setShowMap(!showMap)} 
                className="flex items-center mb-1 text-sm sm:text-base text-foreground/70 hover:text-highlight transition-colors duration-200 w-full text-left group"
              >
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-highlight mr-2 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span>{location}</span>
                <ChevronRightIcon className={`w-4 h-4 ml-auto transform transition-transform duration-300 ${showMap ? 'rotate-90' : ''}`} />
              </button>
              {showMap && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 overflow-hidden border rounded-md shadow-md"
                >
                  <div className="aspect-video">
                    <iframe
                      src={mapEmbedUrl || getMapEmbedUrl(location)}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen={false}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`Map of ${title} at ${location}`}
                    ></iframe>
                  </div>
                   <a 
                    href={`https://maps.google.com/maps?q=${encodeURIComponent(location)}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block text-xs text-center py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-foreground/70"
                  >
                    View on Google Maps <ExternalLink className="inline w-3 h-3 ml-1" />
                  </a>
                </motion.div>
              )}
              {/* End Location with Map Toggle */}

              {reraNumber && (
                <div className="mb-4 mt-2 text-xs sm:text-sm text-foreground/60">
                  <button
                    type="button"
                    onClick={() => {
                      if (!reraNumber.trim() || !reraQrImage) {
                        toast.error('No RERA QR code available for this project');
                        return;
                      }
                      setShowReraQrPopup(true);
                    }}
                    className="bg-muted/50 dark:bg-gray-800/30 p-2.5 rounded-md inline-flex items-center hover:bg-muted dark:hover:bg-gray-800/60 transition-colors group"
                    aria-label="Show RERA QR Code"
                  >
                    RERA: {reraNumber}
                    <QrCodeIcon className="w-4 h-4 ml-2 opacity-70 group-hover:opacity-100 transition-opacity" />
                  </button>
                </div>
              )}
              
              <p className="text-foreground/80 mb-6 text-sm sm:text-base leading-relaxed">
                {description}
              </p>

              {/* Specifications */}
              {specifications && specifications.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl md:text-2xl font-display mb-3">Specifications</h3>
                  <div className="bg-card/70 dark:bg-card/50 p-4 sm:p-6 rounded-lg shadow-md space-y-3">
                    {specifications.map((spec, index) => (
                      <div
                        key={index}
                        className={`flex justify-between items-start text-sm sm:text-base ${
                          index < specifications.length - 1
                            ? "pb-3 border-b border-border/60"
                            : ""
                        }`}
                      >
                        <span className="font-medium text-foreground/90">{spec.name}</span>
                        <span className="text-foreground/70 text-right ml-4">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {contactPhone && (
                <div className="mt-2">
                  <ShimmerButton
                    onClick={() => window.location.href = `tel:${contactPhone.replace(/\s+/g, "")}`}
                    shimmerColor="#FFFFFFCC"
                    shimmerSize="0.1em"
                    background="rgba(var(--highlight-rgb), 0.9)" // Using highlight color from theme
                    className="font-medium w-full sm:w-auto px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2.5 flex-shrink-0"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"
                      />
                    </svg>
                    Contact Sales
                  </ShimmerButton>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Amenities Section */}
      {amenities && amenities.length > 0 && (
        <AmenitiesFeatures 
          amenities={amenities.map(amenity => ({
            icon: amenity.icon,
            title: amenity.name
          }))}
          projectName={title}
          brochureUrl={brochureUrl}
        />
      )}

      {/* RERA QR Code Popup */}
      {showReraQrPopup && reraNumber && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowReraQrPopup(false)} // Close on overlay click
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 15, stiffness: 200 }}
              className="bg-card dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-2xl max-w-xs w-full relative"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
            >
              <button
                onClick={() => setShowReraQrPopup(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                aria-label="Close RERA QR Code Popup"
              >
                <XIcon className="w-6 h-6" />
              </button>
              <div className="text-center">
                <h3 className="text-lg sm:text-xl font-display mb-1 text-foreground dark:text-white">RERA Information</h3>
                <p className="text-xs sm:text-sm text-foreground/70 dark:text-gray-300/80 mb-4">Scan the QR code or view details: <span className="font-semibold">{reraNumber}</span></p>
                <div className="bg-white p-3 rounded-md inline-block shadow-inner">
                  {reraQrImage ? (
                    <Image
                      src={reraQrImage}
                      alt={`RERA QR Code for ${reraNumber}`}
                      width={180}
                      height={180}
                      className="rounded"
                    />
                  ) : (
                    <div className="w-[180px] h-[180px] bg-gray-100 rounded flex items-center justify-center">
                      <p className="text-gray-500 text-sm text-center">No QR Code<br />Available</p>
                    </div>
                  )}
                </div>
                {/* Optional: Add a link to official RERA website if available */}
                {/* <a href={`YOUR_RERA_VERIFICATION_URL_PREFIX/${reraNumber}`} target="_blank" rel="noopener noreferrer" className="text-sm text-highlight hover:underline mt-4 block">Verify on RERA Portal</a> */}
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </>
  );
} 