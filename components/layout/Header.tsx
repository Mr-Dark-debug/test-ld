"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "../ui/ThemeToggle";
import { useTheme } from "@/lib/theme-context";
import { usePathname } from "next/navigation";

type MenuItem = {
  title: string;
  href: string;
  submenu?: MenuItem[];
};

const navItems: MenuItem[] = [
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const { theme } = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleSubmenu = (title: string) => {
    if (openSubmenu === title) {
      setOpenSubmenu(null);
    } else {
      setOpenSubmenu(title);
    }
  };

  const headerBgClass = theme === "light" 
    ? isScrolled ? "bg-white/80 backdrop-blur-lg shadow-lg" : "bg-transparent" 
    : isScrolled ? "bg-primary/80 backdrop-blur-lg shadow-lg" : "bg-transparent";

  // Define the logo and text colors based on theme
  const logoTextColor = theme === "light" ? "#334390" : "#ffffff";
  const navHoverColor = theme === "light" ? "#334390" : "#334390";

  // Check if a nav item is active
  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBgClass}`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo with separate text */}
          <Link href="/" className="flex items-center gap-3">
            {/* Logo image only (cropped) */}
            <div className="relative w-16 h-16 overflow-hidden">
              <Image 
                src="/images/logo/logo.png" 
                alt="Laxmi Developers Logo" 
                width={220} 
                height={60}
                className="object-contain w-full h-full" 
                priority
              />
            </div>
            {/* Company name as text */}
            <span className="text-2xl font-display font-semibold" style={{ color: logoTextColor }}>Laxmi Developers</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <div key={item.title} className="relative group">
                <Link
                  href={item.href}
                  className={`text-foreground hover:text-[${navHoverColor}] transition-colors duration-300 py-2 relative ${
                    isActive(item.href) ? 'text-[#334390] font-medium' : ''
                  }`}
                >
                  {item.title}
                  {isActive(item.href) && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#334390] transform scale-x-100 transition-transform duration-300"></span>
                  )}
                  {!isActive(item.href) && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#334390] transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
                  )}
                </Link>
                
                {item.submenu && (
                  <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-64 bg-card rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    <div className="p-2">
                      {item.submenu.map((subitem) => (
                        <Link
                          key={subitem.title}
                          href={subitem.href}
                          className={`block px-4 py-2 text-sm rounded-md transition-colors duration-300 ${
                            pathname === subitem.href 
                              ? 'text-[#334390] font-medium bg-muted/50' 
                              : 'hover:bg-muted hover:text-[#334390]'
                          }`}
                        >
                          {subitem.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {/* Theme Toggle */}
            <div className="ml-2">
              <ThemeToggle />
            </div>
          </nav>

          <div className="lg:hidden flex items-center gap-2">
            {/* Theme Toggle - Mobile */}
            <ThemeToggle />
            
            {/* Mobile menu button */}
            <button
              className="text-foreground"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-primary/95 backdrop-blur-lg">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <div key={item.title} className="py-1">
                  {item.submenu ? (
                    <>
                      <button
                        onClick={() => toggleSubmenu(item.title)}
                        className={`flex items-center justify-between w-full py-2 text-foreground hover:text-[${navHoverColor}] transition-colors ${
                          isActive(item.href) ? 'text-[#334390] font-medium' : ''
                        }`}
                      >
                        <span>{item.title}</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-4 w-4 transition-transform ${
                            openSubmenu === item.title ? "rotate-180" : ""
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                      {openSubmenu === item.title && (
                        <div className="pl-4 mt-1 space-y-2 border-l border-muted">
                          {item.submenu.map((subitem) => (
                            <Link
                              key={subitem.title}
                              href={subitem.href}
                              className={`block py-1 text-sm text-foreground hover:text-[#334390] transition-colors ${
                                pathname === subitem.href ? 'text-[#334390] font-medium' : ''
                              }`}
                              onClick={toggleMobileMenu}
                            >
                              {subitem.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className={`block py-2 text-foreground hover:text-[${navHoverColor}] transition-colors ${
                        isActive(item.href) ? 'text-[#334390] font-medium' : ''
                      }`}
                      onClick={toggleMobileMenu}
                    >
                      {item.title}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
} 