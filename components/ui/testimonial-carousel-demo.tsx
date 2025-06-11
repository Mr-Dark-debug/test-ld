"use client";

import { useState, useEffect } from "react";
import { TestimonialCarousel } from "@/components/ui/testimonial-carousel";
import { TestimonialCarouselSkeleton } from "@/components/ui/loading";
import { testimonialsApi } from "@/lib/api";

interface TestimonialCarouselData {
  title: string;
  quote: string;
  name: string;
  role: string;
  youtubeUrl: string;
  thumbnailSrc: string;
}

export function TestimonialCarouselDemo() {
  const [isLoading, setIsLoading] = useState(true);
  const [testimonialData, setTestimonialData] = useState<TestimonialCarouselData[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fallback static data in case API fails
  const fallbackData = [
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
      thumbnailSrc: "https://img.youtube.com/vi/3bmdwCqPiBA/hqdefault.jpg",
    },
  ];

  // Helper function to extract YouTube video ID
  const getYouTubeVideoId = (url: string) => {
    if (!url) return null;
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // Transform API testimonial to carousel format
  const transformTestimonial = (testimonial: any) => {
    const videoId = getYouTubeVideoId(testimonial.youtubeUrl);
    return {
      title: `${testimonial.rating} Star${testimonial.rating > 1 ? 's' : ''} Review`,
      quote: testimonial.content,
      name: testimonial.name,
      role: [testimonial.designation, testimonial.company].filter(Boolean).join(', ') || 'Valued Client',
      youtubeUrl: testimonial.youtubeUrl || '',
      // Use hqdefault instead of maxresdefault as fallback, and provide a default image
      thumbnailSrc: videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '/images/testimonial-placeholder.jpg',
    };
  };

  // Fetch featured testimonials from API
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch featured and approved testimonials
        const response = await testimonialsApi.getAll({
          featured: true,
          approved: true,
          limit: 6 // Limit to 6 featured testimonials
        });

        if (response.success && response.data && response.data.length > 0) {
          // Transform API data to carousel format
          const transformedData = response.data.map(transformTestimonial);
          setTestimonialData(transformedData);
        } else {
          // Use fallback data if no featured testimonials found
          setTestimonialData(fallbackData);
        }
      } catch (err) {
        console.error('Error fetching testimonials:', err);
        setError('Failed to load testimonials');
        // Use fallback data on error
        setTestimonialData(fallbackData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimonials();
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