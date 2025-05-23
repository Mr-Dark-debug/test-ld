"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { AmenitiesFeatures } from "@/components/AmenitiesFeatures";
import { motion, useAnimation, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

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
  threeDModelUrl?: string; // Optional URL for the 3D model
  specifications: Specification[];
  amenities: Amenity[];
  brochureUrl?: string;
  contactPhone?: string;
  reraNumber?: string;
}

export default function ProjectDetails({
  title,
  description,
  location,
  status,
  type,
  imageSrc,
  threeDModelUrl,
  specifications,
  amenities,
  brochureUrl,
  contactPhone,
  reraNumber,
}: ProjectDetailsProps) {
  const [show3DView, setShow3DView] = useState(false);
  const [isLoading3D, setIsLoading3D] = useState(false);
  const [progress, setProgress] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const inViewRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(inViewRef, { once: false, amount: 0.3 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView && threeDModelUrl) {
      controls.start({ opacity: 1, y: 0 });
    } else {
      controls.start({ opacity: 0, y: 20 });
    }
  }, [isInView, controls, threeDModelUrl]);

  const handleLoad3DModel = () => {
    setIsLoading3D(true);
    setProgress(0);
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsLoading3D(false);
          setShow3DView(true);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const getStatusColor = () => {
    switch (status) {
      case "ongoing": return "bg-yellow-500/90 hover:bg-yellow-600/90 text-white";
      case "completed": return "bg-green-500/90 hover:bg-green-600/90 text-white";
      case "upcoming": return "bg-blue-500/90 hover:bg-blue-600/90 text-white";
      default: return "bg-gray-500/90 hover:bg-gray-600/90 text-white";
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case "residential": return "bg-purple-500/90 hover:bg-purple-600/90 text-white";
      case "commercial": return "bg-teal-500/90 hover:bg-teal-600/90 text-white";
      default: return "bg-gray-500/90 hover:bg-gray-600/90 text-white";
    }
  };

  return (
    <>
      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {/* Project Image / 3D View */}
            <div ref={scrollContainerRef} className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-full min-h-[450px] rounded-lg overflow-hidden shadow-xl group">
              {!show3DView && (
                <>
                  <Image
                    src={imageSrc}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    priority
                  />
                  {threeDModelUrl && (
                    <motion.div 
                      initial={{opacity:0, y:10}}
                      animate={{opacity:1, y:0}}
                      transition={{delay:0.5}}
                      className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-md text-xs sm:text-sm backdrop-blur-sm shadow-lg">
                      Scroll down for 3D View ↓
                    </motion.div>
                  )}
                </>
              )}

              {show3DView && threeDModelUrl && (
                 <iframe 
                    src={threeDModelUrl} 
                    title={`${title} - 3D View`}
                    className="w-full h-full border-0"
                    allowFullScreen
                  ></iframe>
              )}
              
              {threeDModelUrl && !show3DView && (
                <div ref={inViewRef} className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-black/80 via-black/60 to-black/40 p-8 text-center" style={{ height: '100%', pointerEvents: isInView ? 'auto' : 'none' }}>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={controls} transition={{ duration: 0.5, delay:0.2 }} className="flex flex-col items-center">
                    <h3 className="text-2xl sm:text-3xl font-semibold text-white mb-3">Interactive 3D Tour</h3>
                    <p className="text-gray-300 mb-6 text-sm sm:text-base max-w-md">Explore the project in immersive 3D. Click below to load the experience.</p>
                    {!isLoading3D ? (
                      <ShimmerButton
                        onClick={handleLoad3DModel}
                        shimmerColor="#FFFFFFCC"
                        shimmerSize="0.1em"
                        background="rgba(var(--highlight-rgb), 0.9)" // Using highlight color from theme
                        className="font-medium px-8 py-3 text-sm sm:text-base rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        Load 3D View
                      </ShimmerButton>
                    ) : (
                      <div className="w-full max-w-xs flex flex-col items-center">
                        <div className="h-3 w-full relative max-w-xs rounded-full overflow-hidden bg-gray-700/50">
                          <motion.div 
                            className="h-full bg-highlight absolute transition-all duration-300 ease-linear"
                            initial={{ width: "0%" }}
                            animate={{ width: `${progress}%` }}
                          />
                        </div>
                        <p className="text-white text-xs sm:text-sm mt-2.5">Loading 3D Model... {progress}%</p>
                      </div>
                    )}
                  </motion.div>
                </div>
              )}
            </div>

            {/* Project Info */}
            <div className="flex flex-col justify-center pt-12 lg:pt-0">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className={cn("px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium shadow-md transition-colors duration-300", getTypeColor())}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </span>
                <span className={cn("px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium shadow-md transition-colors duration-300", getStatusColor())}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display mb-3">{title}</h1>
              
              <div className="flex items-center mb-4 text-sm sm:text-base">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 sm:h-5 sm:w-5 text-highlight mr-2 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-foreground/70">{location}</span>
              </div>

              {reraNumber && (
                <div className="bg-muted/70 dark:bg-muted/30 px-3 py-1.5 rounded-md inline-flex items-center mb-4 text-xs sm:text-sm shadow-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 sm:h-5 sm:w-5 text-highlight mr-2 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  <span className="font-medium text-foreground/80">RERA:</span>&nbsp;<span className="text-foreground/70">{reraNumber}</span>
                </div>
              )}

              <p className="text-foreground/80 mb-6 text-sm sm:text-base leading-relaxed hyphens-auto">{description}</p>

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
    </>
  );
} 