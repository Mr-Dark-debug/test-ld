"use client";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@/lib/theme-context";
import Aurora from "../reactbits/Aurora/Aurora";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { theme } = useTheme();

  // Use white text for headings instead of golden
  const headingClass = "text-xl font-display text-white mb-6";
  
  return (
    <footer className={`${theme === "dark" ? "bg-primary" : "bg-gray-900"} text-foreground p-8 rounded-xl mx-4 my-8 relative overflow-hidden`}>
      <div className="absolute inset-0 z-0">
        <Aurora colorStops={["#2939FF", "#4A29FF", "#7029FF"]} blend={0.5} amplitude={0.6} speed={0.3} />
      </div>
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-start">
          {/* Company Logo & Address */}
          <div className="mb-8 md:mb-0">
            <div className="mb-6">
              <Image 
                src="/images/logo/logo.png" 
                alt="Laxmi Developers Logo" 
                width={160} 
                height={45} 
                className="h-auto w-auto" 
              />
            </div>
            <address className="not-italic text-gray-300 space-y-2">
              <p>
                Millennium Textile Market 3, <br />
                395002, Surat – Gujarat, India
              </p>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-white flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:+919978600222" className="text-gray-300 hover:text-white hover:opacity-75 transition-colors duration-300">+91 9978600222</a>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-white flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:info@laxmidevelopers.com" className="text-gray-300 hover:text-white hover:opacity-75 transition-colors duration-300">info@laxmidevelopers.com</a>
              </div>
              <p className="flex items-center pl-8 text-gray-300">Sunday: Closed</p>
            </address>
          </div>

          {/* Quick Links */}
          <div className="mb-8 md:mb-0">
            <h3 className={headingClass}>Quick Links</h3>
            <ul className="space-y-3 text-gray-300">
              <li>
                <Link href="/" className="hover:text-white hover:opacity-75 transition-colors duration-300">Home</Link>
              </li>
              <li>
                <Link href="/about-us" className="hover:text-white hover:opacity-75 transition-colors duration-300">About Us</Link>
              </li>
              <li>
                <Link href="/why-laxmi" className="hover:text-white hover:opacity-75 transition-colors duration-300">Why Laxmi?</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white hover:opacity-75 transition-colors duration-300">Contact</Link>
              </li>
              <li>
                <Link href="/career" className="hover:text-white hover:opacity-75 transition-colors duration-300">Career</Link>
              </li>
            </ul>
          </div>

          {/* Projects */}
          <div className="mb-8 md:mb-0">
            <h3 className={headingClass}>Projects</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              <div>
                <h4 className="font-semibold mb-2 text-gray-200">Residential</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="/residential/on-going" className="text-sm text-gray-300 hover:text-white hover:opacity-75 transition-colors duration-300">On-Going</Link>
                  </li>
                  <li>
                    <Link href="/residential/completed" className="text-sm text-gray-300 hover:text-white hover:opacity-75 transition-colors duration-300">Completed</Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-gray-200">Commercial</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="/commercial/on-going" className="text-sm text-gray-300 hover:text-white hover:opacity-75 transition-colors duration-300">On-Going</Link>
                  </li>
                  <li>
                    <Link href="/commercial/completed" className="text-sm text-gray-300 hover:text-white hover:opacity-75 transition-colors duration-300">Completed</Link>
                  </li>
                  <li>
                    <Link href="/commercial/upcoming" className="text-sm text-gray-300 hover:text-white hover:opacity-75 transition-colors duration-300">Upcoming</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="md:max-w-xs">
            <h3 className={headingClass}>Subscribe</h3>
            <p className="mb-4 text-gray-300">Stay updated with our latest projects and offers.</p>
            <form className="space-y-3">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="w-full px-4 py-2.5 bg-gray-800/70 border border-gray-700 text-gray-300 rounded-md focus:ring-highlight focus:border-highlight placeholder-gray-500"
                required
              />
              <button 
                type="submit" 
                className="w-full px-4 py-2.5 bg-[#2528c0] text-white font-medium rounded-md hover:bg-[#2528c0]/90 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-highlight"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Trust Badges */} 
        <div className="mt-16 border-t border-gray-700/50 pt-8 flex flex-col items-center">
          <div className="flex space-x-6 mb-6">
            <div className="flex items-center justify-center border border-gray-600 rounded-full w-16 h-16 hover:border-gray-500 transition-colors duration-300">
              <span className="text-white font-bold">RERA</span>
            </div>
            <div className="flex items-center justify-center border border-gray-600 rounded-full w-16 h-16 hover:border-gray-500 transition-colors duration-300">
              <span className="text-white font-bold">ISO</span>
            </div>
          </div>
          <div className="text-center space-y-1">
            <p className="text-gray-400">
              <span className="text-white font-bold">RERA</span> Registered Projects
            </p>
            <p className="text-gray-400">
              <span className="text-white font-bold">ISO</span> 9001:2015 Certified
            </p>
            <p className="text-gray-400">&copy; {currentYear} Laxmi Developers. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
} 