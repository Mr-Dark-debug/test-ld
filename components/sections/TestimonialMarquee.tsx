"use client";

import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";
import Image from "next/image";
import AnimatedTitle from "@/components/ui/AnimatedTitle";

interface Testimonial {
  id: string;
  name: string;
  role?: string;
  quote: string;
  avatarSrc?: string;
}

interface TestimonialMarqueeProps {
  title: string;
  subtitle?: string;
  testimonials: Testimonial[];
}

const ReviewCard = ({ name, role, quote, avatarSrc, id }: Testimonial) => {
  // Create initials for avatar fallback
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("");

  // Extract initials for IDs to use as avatar colors
  const colorMap: Record<string, string> = {
    RS: "bg-blue-500",
    PP: "bg-green-500", 
    AD: "bg-orange-500",
    NM: "bg-purple-500",
    SK: "bg-pink-500",
    MJ: "bg-indigo-500",
    VS: "bg-red-500",
    AK: "bg-yellow-500"
  };

  const avatarInitials = initials;
  const avatarColor = colorMap[avatarInitials] || "bg-highlight";

  return (
    <figure
      className={cn(
        "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4 mx-2",
        // light styles
        "border-gray-950/[.1] bg-card hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:hover:bg-gray-50/[.15]",
      )}
    >
      <div className="flex flex-row items-center gap-2">
        {avatarSrc ? (
          <div className="relative w-8 h-8">
            <Image 
              className="rounded-full object-cover" 
              width={32} 
              height={32} 
              alt={name} 
              src={avatarSrc}
              onError={(e) => {
                // Hide the image on error
                e.currentTarget.style.display = 'none';
                // Show the parent div which will have the fallback
                if (e.currentTarget.parentElement) {
                  e.currentTarget.parentElement.classList.add(avatarColor);
                  e.currentTarget.parentElement.classList.add('flex', 'items-center', 'justify-center', 'text-white', 'rounded-full', 'text-xs', 'font-bold');
                  e.currentTarget.parentElement.textContent = initials;
                }
              }}
            />
          </div>
        ) : (
          <div className={`w-8 h-8 rounded-full ${avatarColor} flex items-center justify-center text-white text-xs font-bold`}>
            {initials}
          </div>
        )}
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium">{name}</figcaption>
          {role && <p className="text-xs font-medium text-foreground/70">{role}</p>}
        </div>
      </div>
      <blockquote className="mt-3 text-sm">{quote}</blockquote>
    </figure>
  );
};

export default function TestimonialMarquee({
  title,
  subtitle,
  testimonials,
}: TestimonialMarqueeProps) {
  // Split testimonials into two rows for the marquee
  const firstRow = testimonials.slice(0, Math.ceil(testimonials.length / 2));
  const secondRow = testimonials.slice(Math.ceil(testimonials.length / 2));

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <AnimatedTitle as="h2" className="mb-4">
            {title}
          </AnimatedTitle>
          {subtitle && (
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden gap-4">
          <Marquee pauseOnHover className="[--duration:40s]">
            {firstRow.map((testimonial) => (
              <ReviewCard key={testimonial.id} {...testimonial} />
            ))}
          </Marquee>
          <Marquee reverse pauseOnHover className="[--duration:30s]">
            {secondRow.map((testimonial) => (
              <ReviewCard key={testimonial.id} {...testimonial} />
            ))}
          </Marquee>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
        </div>
      </div>
    </section>
  );
} 