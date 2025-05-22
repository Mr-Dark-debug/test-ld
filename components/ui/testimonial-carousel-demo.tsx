"use client";

import { TestimonialCarousel } from "@/components/ui/testimonial-carousel";

export function TestimonialCarouselDemo() {
  const testimonialData = [
    {
      title: "Exceptional Quality",
      quote: "Laxmi Developers delivered beyond our expectations. The attention to detail and quality of construction is outstanding. We're extremely happy with our investment.",
      name: "Rajesh Patel",
      role: "Homeowner, Millennium Park",
      videoSrc: "/videos/testimonial-1.mp4",
      thumbnailSrc: "/images/projects/Millennium Park.jpg",
    },
    {
      title: "Professional Service",
      quote: "The team at Laxmi Developers was professional from start to finish. They guided us through the entire process and delivered exactly what was promised.",
      name: "Priya Shah",
      role: "Business Owner, Business Hub",
      videoSrc: "/videos/testimonial-2.mp4",
      thumbnailSrc: "/images/projects/Millennium Business Hub.jpg",
    },
    {
      title: "Timely Delivery",
      quote: "What impressed me most was how Laxmi Developers completed the project on schedule. The construction quality is excellent and the design is modern and functional.",
      name: "Amit Desai",
      role: "Investor, Laxmi Nova",
      videoSrc: "/videos/testimonial-3.mp4",
      thumbnailSrc: "/images/projects/Laxmi Nova.jpg",
    },
    {
      title: "Beautiful Design",
      quote: "Our experience with Laxmi Developers has been fantastic. They created a beautiful, functional space that perfectly meets our needs. Highly recommended!",
      name: "Neha Mehta",
      role: "Resident, Laxmi Residency",
      videoSrc: "/videos/testimonial-4.mp4",
      thumbnailSrc: "/images/projects/Millennium Textile Market 3.jpg",
    },
  ];
  
  return (
    <div className="relative overflow-hidden w-full py-20 bg-gradient-to-b from-background to-background/90">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Hear directly from our satisfied clients about their experience working with Laxmi Developers. 
            Click the play button in the top right corner to watch their testimonials.
          </p>
        </div>
        
        <TestimonialCarousel 
          testimonials={testimonialData} 
          autoScroll={true}
          scrollInterval={4000}
        />
      </div>
    </div>
  );
} 