"use client";

import { useState, useEffect } from "react";
import { TestimonialCarousel } from "@/components/ui/testimonial-carousel";
import { TestimonialCarouselSkeleton } from "@/components/ui/loading";

export function TestimonialCarouselDemo() {
  const [isLoading, setIsLoading] = useState(true);
  // Use static data for better performance - no API calls on every page load
  const [testimonialData] = useState([
    // Default YouTube testimonials - these load instantly
    {
      title: "Exceptional Quality",
      quote: "Laxmi Developers delivered beyond our expectations. The attention to detail and quality of construction is outstanding. We're extremely happy with our investment.",
      name: "Rajesh Patel",
      role: "Homeowner, Millennium Park",
      youtubeUrl: "https://youtu.be/MUDMUMetgnw",
      thumbnailSrc: "https://img.youtube.com/vi/MUDMUMetgnw/maxresdefault.jpg",
    },
    {
      title: "Professional Service",
      quote: "The team at Laxmi Developers was professional from start to finish. They guided us through the entire process and delivered exactly what was promised.",
      name: "Priya Shah",
      role: "Business Owner, Business Hub",
      youtubeUrl: "https://youtu.be/IrOBu0q6fQI",
      thumbnailSrc: "https://img.youtube.com/vi/IrOBu0q6fQI/maxresdefault.jpg",
    },
    {
      title: "Timely Delivery",
      quote: "What impressed me most was how Laxmi Developers completed the project on schedule. The construction quality is excellent and the design is modern and functional.",
      name: "Amit Desai",
      role: "Investor, Laxmi Nova",
      youtubeUrl: "https://youtu.be/9Bdx26mKPyc",
      thumbnailSrc: "https://img.youtube.com/vi/9Bdx26mKPyc/maxresdefault.jpg",
    },
    {
      title: "Great Investment",
      quote: "Investing with Laxmi Developers was one of the best decisions I made. The returns have been excellent and the property value has appreciated significantly.",
      name: "Meera Joshi",
      role: "Property Investor, Laxmi Heights",
      youtubeUrl: "https://youtu.be/3bmdwCqPiBA",
      thumbnailSrc: "https://img.youtube.com/vi/3bmdwCqPiBA/maxresdefault.jpg",
    },
  ]);

  // Simulate loading for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <TestimonialCarouselSkeleton />;
  }

  return (
    <div className="relative overflow-hidden w-full py-20 bg-gradient-to-b from-background to-background/90">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Hear directly from our satisfied clients about their experience working with Laxmi Developers.
            Watch their video testimonials below.
          </p>
        </div>

        <TestimonialCarousel
          testimonials={testimonialData}
          autoScroll={true}
          scrollInterval={5000}
        />
      </div>
    </div>
  );
}