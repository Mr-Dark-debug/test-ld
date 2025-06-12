"use client";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@/lib/theme-context";
import Aurora from "../reactbits/Aurora/Aurora";
import SocialMediaLinks from "../ui/SocialMediaLinks";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { theme } = useTheme();

  // Increased font size for headings
  const headingClass = "text-2xl sm:text-3xl font-display text-white mb-8 font-medium";

  return (
    <footer className={`${theme === "dark" ? "bg-primary" : "bg-gray-900"} text-foreground p-8 py-12 sm:py-16 rounded-xl mx-4 my-8 relative overflow-hidden`}>
      <div className="absolute inset-0 z-0">
        <Aurora colorStops={["#2939FF", "#4A29FF", "#7029FF"]} blend={0.5} amplitude={0.6} speed={0.3} />
      </div>
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 items-start">
          {/* Company Logo & Address */}
          <div className="mb-8 md:mb-0">
            <div className="mb-8">
              <Image
                src="/images/logo/logo.png"
                alt="Laxmi Developers Logo"
                width={200}
                height={56}
                className="h-auto w-auto"
              />
            </div>
            <address className="not-italic text-gray-300 space-y-3 text-base">
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
              <div className="pt-2">
                <SocialMediaLinks />
              </div>
            </address>
          </div>

          {/* Quick Links */}
          <div className="mb-8 md:mb-0">
            <h3 className={headingClass}>Quick Links</h3>
            <ul className="space-y-3 text-gray-300 text-base">
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
            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
              <div>
                <h4 className="font-semibold mb-4 text-gray-100 text-xl">Residential</h4>
                <ul className="space-y-3">
                  <li>
                    <Link href="/residential/on-going" className="text-base text-gray-300 hover:text-white hover:opacity-75 transition-colors duration-300">On-Going</Link>
                  </li>
                  <li>
                    <Link href="/residential/completed" className="text-base text-gray-300 hover:text-white hover:opacity-75 transition-colors duration-300">Completed</Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-gray-100 text-xl">Commercial</h4>
                <ul className="space-y-3">
                  <li>
                    <Link href="/commercial/on-going" className="text-base text-gray-300 hover:text-white hover:opacity-75 transition-colors duration-300">On-Going</Link>
                  </li>
                  <li>
                    <Link href="/commercial/completed" className="text-base text-gray-300 hover:text-white hover:opacity-75 transition-colors duration-300">Completed</Link>
                  </li>
                  <li>
                    <Link href="/commercial/upcoming" className="text-base text-gray-300 hover:text-white hover:opacity-75 transition-colors duration-300">Upcoming</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className={headingClass}>Subscribe</h3>
            <p className="mb-5 text-gray-300 text-base">Stay updated with our latest projects and offers.</p>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-3 bg-gray-800/70 border border-gray-700 text-gray-300 rounded-md focus:ring-highlight focus:border-highlight placeholder-gray-500"
                required
                autoComplete="email"
                suppressHydrationWarning
              />
              <button
                type="submit"
                className="w-full px-4 py-3 bg-[#2528c0] text-white font-medium rounded-md hover:bg-[#2528c0]/90 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-highlight"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Section with RERA and Copyright */}
        <div className="mt-16 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* RERA Badge - Left */}
            <div className="mb-4 md:mb-0 flex items-center">
              <div className="flex items-center justify-center border border-gray-600 rounded-full w-12 h-12 mr-2 hover:border-gray-500 transition-colors duration-300">
                <span className="text-white font-bold text-sm">RERA</span>
              </div>
              <div>
                <p className="text-white font-medium text-sm">Registered Projects</p>
                <p className="text-gray-300 text-xs">Gujarat RERA Approved</p>
              </div>
            </div>

            {/* Copyright Text - Right */}
            <div className="text-right">
              <p className="text-gray-400 text-sm">&copy; {currentYear} Laxmi Developers. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}