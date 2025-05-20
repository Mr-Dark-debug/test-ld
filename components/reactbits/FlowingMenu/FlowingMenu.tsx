"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';

interface FlowingMenuItem {
  link: string;
  text: string;
  image: string;
}

interface FlowingMenuProps {
  items: FlowingMenuItem[];
}

const FlowingMenu: React.FC<FlowingMenuProps> = ({ items }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([]);

  // Auto-rotate the active item every 5 seconds if not being hovered
  useEffect(() => {
    if (hoverIndex !== null) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [items.length, hoverIndex]);

  // Calculate positions of menu items
  const getItemStyle = (index: number) => {
    const isActive = hoverIndex === index || (hoverIndex === null && activeIndex === index);
    const isHovering = hoverIndex !== null;
    const itemCount = items.length;
    const baseWidth = 100 / itemCount;
    const expandedWidth = isActive ? 45 : (100 - 45) / (itemCount - 1);
    
    // When hovering, adjust widths to expand the hovered item
    const width = isHovering 
      ? (index === hoverIndex ? 45 : (100 - 45) / (itemCount - 1)) 
      : baseWidth;
    
    return {
      width: `${width}%`,
    };
  };

  return (
    <div className="flex h-full w-full overflow-hidden relative" ref={menuRef}>
      {items.map((item, index) => {
        const isActive = hoverIndex === index || (hoverIndex === null && activeIndex === index);
        
        return (
          <Link
            href={item.link}
            key={`${item.text}-${index}`}
            className="relative h-full transition-all duration-700 ease-in-out overflow-hidden flex-grow"
            style={getItemStyle(index)}
            onMouseEnter={() => setHoverIndex(index)}
            onMouseLeave={() => setHoverIndex(null)}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
      >
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full">
              <Image
                src={item.image}
                alt={item.text}
                fill
                className={`object-cover transition-transform duration-700 ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            </div>

            {/* Text Content */}
            <div className="absolute inset-0 flex items-end p-6 md:p-8">
              <div className="w-full relative z-10">
                <motion.h3
                  className="text-white font-display text-lg md:text-2xl mb-2 md:mb-4"
                  initial={{ opacity: 0.8, y: 10 }}
                  animate={{ 
                    opacity: isActive ? 1 : 0.8, 
                    y: isActive ? 0 : 10 
                  }}
                  transition={{ duration: 0.4 }}
                >
                  {item.text}
                </motion.h3>
                
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <span className="text-white/80 text-sm md:text-base">
                        Learn more
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-4 w-4 inline-block ml-2" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M14 5l7 7m0 0l-7 7m7-7H3" 
                          />
                        </svg>
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
          </div>
        </div>
          </Link>
        );
      })}
    </div>
  );
};

export default FlowingMenu;

// Note: this is also needed
// /** @type {import('tailwindcss').Config} */
// export default {
//   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
//   theme: {
//     extend: {
//       translate: {
//         '101': '101%',
//       },
//       keyframes: {
//         marquee: {
//           'from': { transform: 'translateX(0%)' },
//           'to': { transform: 'translateX(-50%)' }
//         }
//       },
//       animation: {
//         marquee: 'marquee 15s linear infinite'
//       }
//     }
//   },
//   plugins: [],
// };
