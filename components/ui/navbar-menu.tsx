"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const transition = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

export const MenuItem = ({
  setActive,
  active,
  item,
  children,
  href,
}: {
  setActive: (item: string) => void;
  active: string | null;
  item: string;
  children?: React.ReactNode;
  href?: string;
}) => {
  const [isHovering, setIsHovering] = useState(false);
  
  return (
    <div 
      className="relative"
      onMouseEnter={() => {
        setActive(item);
        setIsHovering(true);
      }}
      onMouseLeave={() => {
        setIsHovering(false);
        // Don't reset active state here to allow hovering on submenu
      }}
    >
      <Link href={href || "#"} className="relative group py-1 block">
        <div className="flex items-center gap-1">
          <motion.p
            transition={{ duration: 0.3 }}
            className="cursor-pointer text-black hover:opacity-[0.9] dark:text-white font-medium"
          >
            {item}
          </motion.p>
          {children && (
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className={`transition-transform duration-200 ${active === item ? "rotate-180" : ""}`}
            >
              <path d="m6 9 6 6 6-6"/>
            </svg>
          )}
        </div>
        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300"></span>
      </Link>
      
      {children && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ 
            opacity: active === item ? 1 : 0,
            y: active === item ? 0 : 10,
            visibility: active === item ? "visible" : "hidden"
          }}
          transition={transition}
          className="absolute top-full left-1/2 transform -translate-x-1/2 z-50 pt-2 w-max"
          onMouseEnter={() => {
            setActive(item);
            setIsHovering(true);
          }}
          onMouseLeave={() => {
            setIsHovering(false);
            // Small delay to check if we're hovering elsewhere
            setTimeout(() => {
              if (!isHovering) {
                setActive("");
              }
            }, 50);
          }}
        >
          <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-lg overflow-hidden border border-black/10 dark:border-white/10 shadow-xl">
            <div className="w-max h-full p-4">
              {children}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export const Menu = ({
  setActive,
  children,
  logoSrc,
}: {
  setActive: (item: string | null) => void;
  children: React.ReactNode;
  logoSrc?: string;
}) => {
  return (
    <nav
      className="relative flex items-center justify-between px-8 py-4 before:content-[''] before:absolute before:bottom-0 before:left-0 before:right-0 before:h-12 before:bg-gradient-to-t before:from-background/80 before:to-transparent before:backdrop-blur-md before:z-10"
    >
      {/* Logo Section */}
      {logoSrc && (
        <div className="flex-shrink-0 mr-8 flex items-center">
          <Link href="/" className="flex items-center">
            <Image
              src={logoSrc}
              alt="Logo"
              width={120}
              height={40}
              className="h-10 w-auto"
            />
            <span className="ml-3 font-display text-xl font-semibold text-black dark:text-white">Laxmi Developers</span>
          </Link>
        </div>
      )}

      {/* Menu Items */}
      <div className="flex items-center justify-center space-x-6 flex-grow">
        {children}
      </div>

      {/* Theme Toggle placeholder - now handled in Header.tsx */}
      <div className="flex-shrink-0 ml-8">
      </div>
    </nav>
  );
};

export const ProductItem = ({
  title,
  description,
  href,
  src,
}: {
  title: string;
  description: string;
  href: string;
  src: string;
}) => {
  return (
    <Link href={href} className="flex space-x-2">
      <Image
        src={src}
        width={140}
        height={70}
        alt={title}
        className="flex-shrink-0 rounded-md shadow-2xl"
      />
      <div>
        <h4 className="text-xl font-bold mb-1 text-black dark:text-white">
          {title}
        </h4>
        <p className="text-neutral-700 text-sm max-w-[10rem] dark:text-neutral-300">
          {description}
        </p>
      </div>
    </Link>
  );
};

export const HoveredLink = ({ children, ...rest }: any) => {
  return (
    <Link
      {...rest}
      className="text-neutral-700 dark:text-neutral-200 hover:text-accent dark:hover:text-accent transition-colors px-2 py-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/10 block w-full relative group"
    >
      <span>{children}</span>
      <span className="absolute -bottom-1 left-2 right-2 h-px bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"></span>
    </Link>
  );
};
