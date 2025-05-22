"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/lib/theme-context";
import { Menu, MenuItem, HoveredLink } from "@/components/ui/navbar-menu";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// Navigation items with submenus
const navItems = [
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
      
      // Set scrolled state for styling
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
      
      setPrevScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollY]);

  // Add extra backdrop blur when scrolled for better readability
  const headerClass = isScrolled ? "backdrop-blur-sm" : "";

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 py-3 ${
          !headerVisible && !isMobileMenuOpen ? 'transform -translate-y-full' : 'transform translate-y-0'
        } ${isScrolled ? 'backdrop-blur-sm' : ''}`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex-grow lg:block hidden">
            <Menu
              setActive={setActive}
              logoSrc="/images/logo/logo.png"
            >
            {navItems.map((item) => (
              <MenuItem
                key={item.title}
                setActive={setActive}
                active={active}
                item={item.title}
                href={item.href}
              >
                {item.submenu && (
                  <div className="flex flex-col space-y-1 text-sm min-w-[150px]">
                    {item.submenu.map((subItem) => (
                      <HoveredLink key={subItem.title} href={subItem.href}>
                        {subItem.title}
                      </HoveredLink>
                    ))}
                  </div>
                )}
              </MenuItem>
            ))}
            </Menu>
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

          {/* Theme Toggle - For desktop */}
          <div className="flex-shrink-0 ml-8 hidden lg:block">
            <ThemeToggle />
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
                  {navItems.map((item) => (
                    <div key={item.title} className="border-b border-gray-200 dark:border-gray-700 pb-4">
                      <Link 
                        href={item.href}
                        className="text-xl font-medium text-gray-900 dark:text-white hover:text-primary transition-colors duration-200"
                        onClick={() => {
                          if (!item.submenu) setIsMobileMenuOpen(false);
                        }}
                      >
                        {item.title}
                      </Link>
                      
                      {item.submenu && (
                        <div className="mt-3 ml-4 flex flex-col space-y-2">
                          {item.submenu.map((subItem) => (
                            <Link 
                              key={subItem.title} 
                              href={subItem.href}
                              className="text-base text-gray-600 dark:text-gray-300 hover:text-primary active:text-primary/80 transition-colors duration-200"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {subItem.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}