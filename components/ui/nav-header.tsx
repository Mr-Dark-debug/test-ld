"use client"; 

import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Define types for props
interface NavItem {
  title: string;
  href: string;
  submenu?: NavItem[];
}

interface NavHeaderProps {
  navItems: NavItem[];
  theme: "light" | "dark";
}

function NavHeader({ navItems, theme }: NavHeaderProps) {
  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const pathname = usePathname();

  // Make colors more visible with brighter hover effects
  const cursorColor = theme === "light" ? "#334390" : "#6C4FFF";
  const textColorBase = theme === "light" ? "text-gray-700" : "text-gray-300";
  const activeTextColor = "text-white";

  const handleMouseLeave = () => {
    setPosition((pv) => ({ ...pv, opacity: 0 }));
    setActiveSubmenu(null);
  };

  return (
    <div className="relative h-full">
      {/* Keep ul height matching parent height */}
      <ul
        className="relative flex w-fit rounded-full h-full px-2"
        onMouseLeave={handleMouseLeave}
      >
        {navItems.map((item) => (
          <Tab 
            key={item.title} 
            setPosition={setPosition}
            href={item.href}
            hasSubmenu={!!item.submenu}
            isActive={pathname.startsWith(item.href) && item.href !== "/" || pathname === item.href}
            onMouseEnter={() => item.submenu && setActiveSubmenu(item.title)}
            theme={theme}
            textColor={textColorBase}
            activeTextColor={activeTextColor}
          >
            {item.title}
            {item.submenu && (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-0.5 h-3 w-3 inline-block">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            )}
          </Tab>
        ))}
        <Cursor position={position} cursorColor={cursorColor} />
      </ul>

      {/* Submenu dropdown container */}
      <AnimatePresence>
        {navItems.map((item) => (
          item.submenu && activeSubmenu === item.title && (
            <motion.div
              key={`submenu-${item.title}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className={`absolute left-1/2 -translate-x-1/2 mt-2 z-50 min-w-[200px] rounded-lg ${theme === "light" ? "bg-white/95 shadow-lg" : "bg-gray-800/95 shadow-xl"} overflow-hidden border ${theme === "light" ? "border-gray-200" : "border-gray-700"}`}
              onMouseEnter={() => setActiveSubmenu(item.title)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="py-1">
                {item.submenu.map((subitem) => (
                  <Link
                    key={subitem.title}
                    href={subitem.href}
                    className={`block px-4 py-1.5 text-sm ${pathname === subitem.href 
                      ? (theme === "light" ? "bg-[#334390] text-white font-medium" : "bg-[#6C4FFF] text-white font-medium") 
                      : `${textColorBase} hover:${theme === "light" ? "bg-[#334390]" : "bg-[#6C4FFF]"} hover:text-white`} 
                      transition-colors duration-150`}
                  >
                    {subitem.title}
                  </Link>
                ))}
              </div>
            </motion.div>
          )
        ))}
      </AnimatePresence>
    </div>
  );
}

const Tab = ({
  children,
  setPosition,
  href,
  hasSubmenu,
  isActive,
  onMouseEnter,
  theme,
  textColor,
  activeTextColor,
}: {
  children: React.ReactNode;
  setPosition: any;
  href: string;
  hasSubmenu?: boolean;
  isActive: boolean;
  onMouseEnter?: () => void;
  theme: "light" | "dark";
  textColor: string;
  activeTextColor: string;
}) => {
  const ref = useRef<HTMLLIElement>(null);

  const handleMouseEnter = () => {
    if (!ref.current) return;

    const { width } = ref.current.getBoundingClientRect();
    setPosition({
      width,
      opacity: 1,
      left: ref.current.offsetLeft,
    });

    onMouseEnter && onMouseEnter();
  };

  // Adjust Tab to take full height of parent
  return (
    <li
      ref={ref}
      onMouseEnter={handleMouseEnter}
      className={`relative z-10 flex items-center h-full cursor-pointer px-2.5 text-xs uppercase md:text-xs font-medium transition-colors ${isActive ? activeTextColor : textColor}`}
    >
      <Link href={href} className="flex items-center whitespace-nowrap">
        {children}
      </Link>
    </li>
  );
};

// Adjust cursor to match parent height
const Cursor = ({ position, cursorColor }: { position: any; cursorColor: string }) => {
  return (
    <motion.li
      animate={position}
      className="absolute z-0 h-full rounded-full"
      style={{ backgroundColor: cursorColor }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 28,
        opacity: { duration: 0.15 }
      }}
    />
  );
};

export default NavHeader; 