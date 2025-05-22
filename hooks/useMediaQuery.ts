"use client";

import { useState, useEffect } from 'react';

/**
 * Custom hook that tells you whether a given media query is active.
 * 
 * @param query - A valid CSS media query
 * @returns boolean - True if the media query matches, false otherwise
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Ensure this runs only in the browser
    if (typeof window === 'undefined') return;
    
    // Create a media query list 
    const mediaQuery = window.matchMedia(query);
    
    // Set the initial value
    setMatches(mediaQuery.matches);

    // Define a callback function to handle changes
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add the event listener
    mediaQuery.addEventListener('change', handleChange);
    
    // Clean up
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
} 