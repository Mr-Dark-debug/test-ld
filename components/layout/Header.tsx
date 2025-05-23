"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/lib/theme-context";
import { Menu, MenuItem, HoveredLink } from "@/components/ui/navbar-menu";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// Reorganized navigation items with two main categories
const navItems = [
  { 
    title: "Our Projects",
    href: "/projects",
    submenu: [
      { title: "Residential", href: "/residential", 
        submenu: [
          { title: "On-Going Projects", href: "/residential/on-going" },
          { title: "Completed Projects", href: "/residential/completed" },
        ] 
      },
      { title: "Commercial", href: "/commercial", 
        submenu: [
          { title: "On-Going Projects", href: "/commercial/on-going" },
          { title: "Completed Projects", href: "/commercial/completed" },
          { title: "Up-Coming Projects", href: "/commercial/upcoming" },
        ] 
      },
    ],
  },
  { 
    title: "Our Story",
    href: "/about",
    submenu: [
      { title: "About Us", href: "/about-us" },
      { title: "Why Laxmi?", href: "/why-laxmi" },
      { title: "Blogs", href: "/blogs" },
      { title: "Information", href: "/information",
        submenu: [
          { title: "EMI Calculator", href: "/information/emi-calculator" },
          { title: "Why Invest?", href: "/information/why-invest" },
        ] 
      },
      { title: "Contact", href: "/contact" },
      { title: "Career", href: "/career" },
    ],
  },
];

// Original navigation items for mobile view
const mobileNavItems = [
  { title: "Home", href: "/" },
  {
    title: "Residential",
    href: "/residential",
    submenu: [
      { title: "On-Going Projects", href: "/residential/on-going" },
      { title: "Completed Projects", href: "/residential/completed" },
    ],
  },
  {
    title: "Commercial",
    href: "/commercial",
    submenu: [
      { title: "On-Going Projects", href: "/commercial/on-going" },
      { title: "Completed Projects", href: "/commercial/completed" },
      { title: "Up-Coming Projects", href: "/commercial/upcoming" },
    ],
  },
  { title: "About Us", href: "/about-us" },
  { title: "Why Laxmi?", href: "/why-laxmi" },
  { title: "Blogs", href: "/blogs" },
  {
    title: "Information",
    href: "/information",
    submenu: [
      { title: "EMI Calculator", href: "/information/emi-calculator" },
      { title: "Why Invest?", href: "/information/why-invest" },
    ],
  },
  { title: "Contact", href: "/contact" },
  { title: "Career", href: "/career" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [prevScrollY, setPrevScrollY] = useState(0);
  const [headerVisible, setHeaderVisible] = useState(true);
  const { theme, toggleTheme } = useTheme();
  const [active, setActive] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Determine if header should be visible
      if (currentScrollY > 100) {
        setHeaderVisible(prevScrollY > currentScrollY || currentScrollY < 10);
      } else {
        setHeaderVisible(true);
      }
      
      // Track scroll position but don't change background
      setPrevScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollY]);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Function to handle showing submenus with delays to prevent disappearing
  const handleMenuHover = (item: string) => {
    // Allow a small delay before switching to prevent menus from disappearing
    setTimeout(() => {
      setActive(item);
    }, 10);
  };

  // Function to render nested submenu content with better hover handling
  const renderNestedSubmenu = (items: any) => {
    if (!items) return null;
    
    return (
      <div className="grid grid-cols-1 gap-2 min-w-[220px]">
        {items.map((subItem: any) => (
          <div key={subItem.title} className={`relative group ${subItem.submenu ? "submenu-parent" : ""}`}>
            {subItem.submenu ? (
              <div className="flex items-center justify-between w-full hover:bg-black/5 dark:hover:bg-white/10 rounded-md px-2 py-1.5">
                <Link href={subItem.href} className="text-neutral-700 dark:text-neutral-200 hover:text-accent dark:hover:text-accent transition-colors flex-grow">
                  {subItem.title}
                </Link>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">▶</span>
                
                {/* Nested submenu with improved positioning */}
                <div className="absolute left-full top-0 ml-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="pt-0 pl-1 min-w-[180px]">
                    <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-lg shadow-lg border border-black/10 dark:border-white/10 p-2">
                      <div className="flex flex-col space-y-1">
                        {subItem.submenu.map((nestedItem: any) => (
                          <Link 
                            key={nestedItem.title} 
                            href={nestedItem.href}
                            className="text-neutral-700 dark:text-neutral-200 hover:text-accent dark:hover:text-accent transition-colors px-2 py-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/10 block w-full"
                          >
                            {nestedItem.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <HoveredLink href={subItem.href}>
                {subItem.title}
              </HoveredLink>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Reset active menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.navbar-item') && !target.closest('.submenu-parent')) {
        setActive(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 py-3 ${
          !headerVisible && !isMobileMenuOpen ? 'transform -translate-y-full' : 'transform translate-y-0'
        } backdrop-blur-md`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Desktop Navigation */}
          <div className="flex-grow lg:flex hidden items-center justify-between">
            {/* Logo on the left */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center">
                <Image
                  src="/images/logo/logo.png"
                  alt="Logo"
                  width={120}
                  height={40}
                  className="h-10 w-auto"
                />
                <span className="ml-3 font-display text-xl font-semibold text-black dark:text-white">Laxmi Developers</span>
              </Link>
            </div>

            {/* Main navigation on the right */}
            <div className="flex items-center space-x-8">
              <div className="flex space-x-8 items-center">
                <Link 
                  href="/"
                  className="text-black dark:text-white relative group py-1"
                >
                  <span>Home</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300"></span>
                </Link>
                {navItems.map((item) => (
                  <div 
                    key={item.title}
                    className="navbar-item"
                    onMouseEnter={() => handleMenuHover(item.title)}
                  >
                    <MenuItem
                      setActive={setActive}
                      active={active}
                      item={item.title}
                      href={item.href}
                  >
                      {item.submenu && renderNestedSubmenu(item.submenu)}
                    </MenuItem>
                  </div>
                ))}
              </div>
              
              {/* Theme Toggle */}
              <div className="flex-shrink-0">
                <ThemeToggle />
              </div>
            </div>
          </div>

          {/* Logo only for mobile view */}
          <div className="lg:hidden flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/logo/logo.png"
                alt="Logo"
                width={100}
                height={40}
                className="h-8 w-auto"
              />
              {!isScrolled && (
                <span className="ml-2 font-display text-lg font-semibold text-black dark:text-white">
                  Laxmi Developers
                </span>
              )}
            </Link>
          </div>

          {/* Mobile menu button and theme toggle for small screens */}
          <div className="lg:hidden flex items-center absolute right-4 top-1/2 transform -translate-y-1/2 z-50">
            {/* Theme Toggle - For mobile */}
            <div className="mr-3">
              <ThemeToggle />
            </div>
            
            <button
              type="button"
              className={`p-2 rounded-full ${isMobileMenuOpen ? 'bg-gray-100 dark:bg-gray-800' : 'bg-transparent'} shadow-none border-none`}
              aria-label="Toggle mobile menu"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-6 w-6 text-black dark:text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-6 w-6 text-black dark:text-white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay with Animation - Separate from header for proper z-index handling */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={toggleMobileMenu}
          >
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white dark:bg-gray-900 z-50 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={toggleMobileMenu}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Close menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <div className="pt-16 pb-8 px-6">
                <div className="flex flex-col space-y-6">
                  {/* Mobile keeps the original menu structure */}
                  <Link 
                    href="/"
                    className="text-lg font-medium text-gray-900 dark:text-white hover:text-accent"
                    onClick={toggleMobileMenu}
                  >
                    Home
                  </Link>
                  
                  {mobileNavItems.slice(1).map((item) => (
                    <div key={item.title} className="py-1">
                      {item.submenu ? (
                        <div className="mb-2">
                          <Link 
                            href={item.href}
                            className="text-lg font-medium text-gray-900 dark:text-white hover:text-accent"
                            onClick={toggleMobileMenu}
                          >
                            {item.title}
                          </Link>
                          <div className="mt-2 ml-4 flex flex-col space-y-2">
                            {item.submenu.map((subItem) => (
                              <Link 
                                key={subItem.title}
                                href={subItem.href}
                                className="text-gray-600 dark:text-gray-300 hover:text-accent"
                                onClick={toggleMobileMenu}
                              >
                                {subItem.title}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <Link 
                          href={item.href}
                          className="text-lg font-medium text-gray-900 dark:text-white hover:text-accent"
                          onClick={toggleMobileMenu}
                        >
                          {item.title}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add global CSS for navbar transparency */}
      <style jsx global>{`
        .submenu-parent:hover > div > div {
          display: block;
          opacity: 1;
          visibility: visible;
        }
        
        /* Ensure navbar has a base background for blur to work, but can be overridden by theme */
        header {
          /* background: transparent !important; */ /* Removed to allow specified bg with alpha */
        }
        
        /* Remove background on scrolled state - not needed if base header has blur */
        /* header.scrolled {
          background: transparent !important;
        }
        
        .dark header.scrolled {
          background: transparent !important;
        } */
        
        /* Override any potential bg colors from children if necessary */
        /* nav, .navbar-item, .menu-container {
          background: transparent !important; 
        } */
        
        /* Make menu items stand out on transparent navbar */
        .navbar-item a, .home-link {
          text-shadow: 0 1px 2px rgba(0,0,0,0.2);
        }
        
        .dark .navbar-item a, .dark .home-link {
          text-shadow: 0 1px 3px rgba(0,0,0,0.4);
        }
      `}</style>
    </>
  );
}