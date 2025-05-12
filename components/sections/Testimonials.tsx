"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface Testimonial {
  id: string;
  name: string;
  role?: string;
  quote: string;
  avatarSrc?: string;
}

interface TestimonialsProps {
  title: string;
  subtitle?: string;
  testimonials: Testimonial[];
}

export default function Testimonials({
  title,
  subtitle,
  testimonials,
}: TestimonialsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (testimonials.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
        );
      }, 8000);

      return () => clearInterval(interval);
    }
  }, [testimonials.length]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display mb-4">{title}</h2>
          {subtitle && (
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Testimonial Carousel */}
          <div className="overflow-hidden">
            <div
              className="transition-transform duration-700 ease-in-out flex"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="w-full flex-shrink-0 px-4"
                >
                  <div className="bg-card rounded-lg p-8 md:p-10 shadow-lg">
                    <div className="flex flex-col items-center text-center">
                      {testimonial.avatarSrc ? (
                        <div className="w-20 h-20 rounded-full overflow-hidden mb-6 border-4 border-highlight">
                          <Image
                            src={testimonial.avatarSrc}
                            alt={testimonial.name}
                            width={80}
                            height={80}
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-highlight flex items-center justify-center mb-6 text-primary text-xl font-bold">
                          {testimonial.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                      )}

                      <svg
                        className="w-12 h-12 text-highlight/20 mb-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>

                      <blockquote className="text-lg md:text-xl mb-6 italic">
                        {testimonial.quote}
                      </blockquote>

                      <div>
                        <h4 className="text-lg font-display">{testimonial.name}</h4>
                        {testimonial.role && (
                          <p className="text-sm text-foreground/70">{testimonial.role}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          {testimonials.length > 1 && (
            <>
              <button
                className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 md:-translate-x-6 w-12 h-12 rounded-full bg-highlight text-primary flex items-center justify-center shadow-md hover:bg-highlight/90 transition-colors focus:outline-none"
                onClick={handlePrev}
                aria-label="Previous testimonial"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 md:translate-x-6 w-12 h-12 rounded-full bg-highlight text-primary flex items-center justify-center shadow-md hover:bg-highlight/90 transition-colors focus:outline-none"
                onClick={handleNext}
                aria-label="Next testimonial"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </>
          )}

          {/* Indicators */}
          {testimonials.length > 1 && (
            <div className="mt-8 flex justify-center space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentIndex
                      ? "bg-highlight w-6"
                      : "bg-foreground/30"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
} 