"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/lib/theme-context";
import { Menu, MenuItem, HoveredLink } from "@/components/ui/navbar-menu";
import ThemeToggle from "@/components/ui/ThemeToggle";

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
  const { theme, toggleTheme } = useTheme();
  const [active, setActive] = useState<string | null>(null);

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

  // Add extra backdrop blur when scrolled for better readability
  const headerClass = isScrolled ? "backdrop-blur-sm" : "";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-3">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex-grow">
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

        {/* Theme Toggle */}
        <div className="flex-shrink-0 ml-8">
          <ThemeToggle />
        </div>

        {/* Mobile menu button for small screens */}
        <div className="lg:hidden fixed top-4 right-4 z-50">
          <button
            type="button"
            className="p-2 rounded-full bg-white/90 dark:bg-black/80 shadow-md border border-gray-200 dark:border-gray-700"
            aria-label="Toggle mobile menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-5 w-5 text-black dark:text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}