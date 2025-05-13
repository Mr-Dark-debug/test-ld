"use client";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@/lib/theme-context";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { theme } = useTheme();

  return (
    <footer className={`${theme === "dark" ? "bg-primary" : "bg-gray-900"} text-foreground pt-16 pb-8`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Logo & Address */}
          <div>
            <div className="mb-6">
              <Image 
                src="/images/logo/logo.png" 
                alt="Laxmi Developers Logo" 
                width={160} 
                height={45} 
                className="h-auto w-auto" 
              />
            </div>
            <address className="not-italic text-gray-300">
              <p className="mb-4">
                Millennium Textile Market 3, <br />
                395002, Surat – Gujarat, India
              </p>
              <div className="flex items-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#be9e67]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:+919978600222" className="text-gray-300 hover:text-[#be9e67] transition-colors">+91 9978600222</a>
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#be9e67]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:info@laxmidevelopers.com" className="text-gray-300 hover:text-[#be9e67] transition-colors">info@laxmidevelopers.com</a>
              </div>
              <p className="flex items-center mb-2 pl-7 text-gray-300">Sunday: Closed</p>
            </address>
          </div>

          {/* Quick Links */}
          <div className="mb-8 md:mb-0">
            <h3 className="text-xl font-display text-[#be9e67] mb-6">Quick Links</h3>
            <ul className="space-y-4 text-gray-300">
              <li>
                <Link href="/" className="hover:text-[#be9e67] transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/about-us" className="hover:text-[#be9e67] transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/why-laxmi" className="hover:text-[#be9e67] transition-colors">Why Laxmi?</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#be9e67] transition-colors">Contact</Link>
              </li>
              <li>
                <Link href="/career" className="hover:text-[#be9e67] transition-colors">Career</Link>
              </li>
            </ul>
          </div>

          {/* Projects */}
          <div className="mb-8 md:mb-0">
            <h3 className="text-xl font-display text-[#be9e67] mb-6">Projects</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
              <div>
                <h4 className="font-semibold mb-3 text-gray-200">Residential</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="/residential/on-going" className="text-sm text-gray-300 hover:text-[#be9e67] transition-colors">On-Going</Link>
                  </li>
                  <li>
                    <Link href="/residential/completed" className="text-sm text-gray-300 hover:text-[#be9e67] transition-colors">Completed</Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-gray-200">Commercial</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="/commercial/on-going" className="text-sm text-gray-300 hover:text-[#be9e67] transition-colors">On-Going</Link>
                  </li>
                  <li>
                    <Link href="/commercial/completed" className="text-sm text-gray-300 hover:text-[#be9e67] transition-colors">Completed</Link>
                  </li>
                  <li>
                    <Link href="/commercial/upcoming" className="text-sm text-gray-300 hover:text-[#be9e67] transition-colors">Upcoming</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="md:max-w-xs">
            <h3 className="text-xl font-display text-[#be9e67] mb-6">Subscribe</h3>
            <p className="mb-4 text-gray-300">Stay updated with our latest projects and offers.</p>
            <form className="space-y-3">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-gray-300 rounded-md focus:ring-highlight focus:border-highlight"
                required
              />
              <button 
                type="submit" 
                className="w-full px-4 py-2 bg-highlight text-white font-medium rounded-md hover:bg-highlight/90 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-16 border-t border-gray-800 pt-8 flex flex-col items-center">
          <div className="flex space-x-6 mb-6">
            <div className="flex items-center justify-center border border-gray-700 rounded-full w-16 h-16">
              <span className="text-[#be9e67] font-bold">RERA</span>
            </div>
            <div className="flex items-center justify-center border border-gray-700 rounded-full w-16 h-16">
              <span className="text-[#be9e67] font-bold">ISO</span>
            </div>
          </div>
          <div className="text-center">
            <p className="text-gray-400 mb-2">
              <span className="text-[#be9e67] font-bold">RERA</span> Registered Projects
            </p>
            <p className="text-gray-400">
              <span className="text-[#be9e67] font-bold">ISO</span> 9001:2015 Certified
            </p>
            <p className="text-gray-400">&copy; {currentYear} Laxmi Developers. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
} 