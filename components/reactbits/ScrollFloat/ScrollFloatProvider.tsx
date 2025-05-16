"use client";

import React, { ReactNode } from "react";
import ScrollFloat from "./ScrollFloat";

interface ScrollFloatProviderProps {
  children: ReactNode;
}

// Enhanced Heading Components with ScrollFloat
export const EnhancedH1 = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <ScrollFloat containerClassName={`h1 ${className}`}>
    {children}
  </ScrollFloat>
);

export const EnhancedH2 = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <ScrollFloat containerClassName={`h2 ${className}`}>
    {children}
  </ScrollFloat>
);

export const EnhancedH3 = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <ScrollFloat containerClassName={`h3 ${className}`}>
    {children}
  </ScrollFloat>
);

export const EnhancedH4 = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <ScrollFloat containerClassName={`h4 ${className}`}>
    {children}
  </ScrollFloat>
);

const ScrollFloatProvider: React.FC<ScrollFloatProviderProps> = ({ children }) => {
  return <>{children}</>;
};

export default ScrollFloatProvider; 