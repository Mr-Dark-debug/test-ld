"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type FloatingActionMenuProps = {
  options: {
    label: string;
    onClick: () => void;
    Icon?: React.ReactNode;
  }[];
  className?: string;
};

const FloatingActionMenu = ({
  options,
  className,
}: FloatingActionMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [isPulsing, setIsPulsing] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    setRotation(rotation + 120); // Larger rotation for more dramatic effect
    setIsPulsing(true);
  };

  // Reset pulsing after animation completes
  useEffect(() => {
    if (isPulsing) {
      const timer = setTimeout(() => {
        setIsPulsing(false);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [isPulsing]);

  return (
    <div className={cn("fixed bottom-8 right-8 z-[100]", className)}>
      <div className="relative">
        {/* Gradient border container - only visible when menu is open */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              className="absolute -inset-[3px] rounded-full z-0 overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ 
                opacity: 1, 
                scale: isPulsing ? [1, 1.15, 1] : 1,
              }}
              exit={{ opacity: 0, scale: 0.9 }}
              style={{
                background: `linear-gradient(${rotation}deg, #0066ff, #4d9aff, #80bdff, #0066ff)`,
                backgroundSize: "400% 400%",
                boxShadow: "0 0 15px rgba(77, 154, 255, 0.6)",
              }}
              transition={{
                opacity: { duration: 0.3 },
                scale: { duration: 0.7, ease: "easeInOut" },
                exit: { duration: 0.2 },
              }}
            />
          )}
        </AnimatePresence>
        
        {/* Main button */}
        <Button
          onClick={toggleMenu}
          className={cn(
            "relative w-12 h-12 rounded-full border-none z-10 transition-all duration-300",
            isOpen 
              ? "bg-[#0066ff] hover:bg-[#0055d4] shadow-[0_0_20px_rgba(0,102,255,0.4)]" 
              : "bg-[#11111198] hover:bg-[#111111d1] shadow-[0_0_20px_rgba(0,0,0,0.2)]"
          )}
          aria-label={isOpen ? "Close actions menu" : "Open actions menu"}
          variant="default"
          size="icon"
        >
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
          >
            <Plus className="w-6 h-6 text-white" />
          </motion.div>
        </Button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 10, y: 10, filter: "blur(10px)" }}
            animate={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: 10, y: 10, filter: "blur(10px)" }}
            transition={{
              duration: 0.6,
              type: "spring",
              stiffness: 300,
              damping: 20,
              delay: 0.1,
            }}
            className="absolute bottom-14 right-0 mb-2"
          >
            <div className="flex flex-col items-end gap-2">
              {options.map((option, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05,
                  }}
                >
                  <Button
                    onClick={option.onClick}
                    size="sm"
                    className="flex items-center gap-2 bg-[#11111198] hover:bg-[#111111d1] text-white shadow-[0_0_12px_rgba(0,0,0,0.2)] border-none rounded-xl backdrop-blur-sm"
                    variant="default"
                  >
                    {option.Icon}
                    <span>{option.label}</span>
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingActionMenu; 