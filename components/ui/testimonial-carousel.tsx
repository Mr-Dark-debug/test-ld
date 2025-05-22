"use client";
import { IconArrowNarrowRight, IconPlayerPlay, IconPlayerPause, IconVolume, IconVolumeOff } from "@tabler/icons-react";
import { useState, useRef, useId, useEffect } from "react";

interface TestimonialData {
  title: string;
  quote: string;
  name: string;
  role: string;
  videoSrc: string;
  thumbnailSrc: string;
}

interface TestimonialSlideProps {
  testimonial: TestimonialData;
  index: number;
  current: number;
  handleSlideClick: (index: number) => void;
  totalItems: number;
}

const TestimonialSlide = ({ testimonial, index, current, handleSlideClick, totalItems }: TestimonialSlideProps) => {
  const slideRef = useRef<HTMLLIElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const xRef = useRef<number>(0);
  const yRef = useRef<number>(0);
  const frameRef = useRef<number | undefined>(undefined);

  // Calculate if the slide is active based on the looping logic
  const isActive = 
    current === index || 
    (current === 0 && index === totalItems - 1) || 
    (current === totalItems - 1 && index === 0);

  useEffect(() => {
    const animate = () => {
      if (!slideRef.current) return;

      const x = xRef.current;
      const y = yRef.current;

      slideRef.current.style.setProperty("--x", `${x}px`);
      slideRef.current.style.setProperty("--y", `${y}px`);

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  // Pause video when slide is not active
  useEffect(() => {
    if (videoRef.current) {
      if (current !== index && isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [current, index, isPlaying]);

  const handleMouseMove = (event: React.MouseEvent) => {
    const el = slideRef.current;
    if (!el) return;

    const r = el.getBoundingClientRect();
    xRef.current = event.clientX - (r.left + Math.floor(r.width / 2));
    yRef.current = event.clientY - (r.top + Math.floor(r.height / 2));
  };

  const handleMouseLeave = () => {
    xRef.current = 0;
    yRef.current = 0;
  };

  const handlePlayVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const { videoSrc, thumbnailSrc, quote, title, name, role } = testimonial;

  return (
    <div className="[perspective:1200px] [transform-style:preserve-3d]">
      <li
        ref={slideRef}
        className="flex flex-1 flex-col items-center justify-center relative text-center text-white opacity-100 transition-all duration-300 ease-in-out w-[90vmin] sm:w-[80vmin] md:w-[70vmin] h-[90vmin] sm:h-[80vmin] md:h-[70vmin] mx-[4vmin] z-10"
        onClick={() => handleSlideClick(index)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform:
            current !== index
              ? "scale(0.98) rotateX(8deg)"
              : "scale(1) rotateX(0deg)",
          transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          transformOrigin: "bottom",
        }}
      >
        <div
          className="absolute top-0 left-0 w-full h-full bg-[#1D1F2F] dark:bg-gray-900 rounded-xl overflow-hidden transition-all duration-150 ease-out shadow-xl border border-gray-200 dark:border-gray-800"
          style={{
            transform:
              current === index
                ? "translate3d(calc(var(--x) / 30), calc(var(--y) / 30), 0)"
                : "none",
          }}
        >
          {/* Video element with thumbnail as poster */}
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover opacity-100"
            style={{
              opacity: current === index ? 1 : 0.5,
            }}
            poster={thumbnailSrc}
            src={videoSrc}
            preload="metadata"
            playsInline
            muted={isMuted}
          />
          
          {/* Video controls in top-right corner */}
          <div className="absolute top-4 right-4 flex items-center space-x-2 z-20">
            <button
              onClick={handlePlayVideo}
              className="w-8 h-8 sm:w-10 sm:h-10 bg-accent/90 rounded-full flex items-center justify-center cursor-pointer hover:bg-accent transition-colors"
              aria-label={isPlaying ? "Pause video" : "Play video"}
            >
              {isPlaying ? (
                <IconPlayerPause className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              ) : (
                <IconPlayerPlay className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              )}
            </button>
            
            <button
              onClick={handleToggleMute}
              className="w-8 h-8 sm:w-10 sm:h-10 bg-accent/90 rounded-full flex items-center justify-center cursor-pointer hover:bg-accent transition-colors"
              aria-label={isMuted ? "Unmute video" : "Mute video"}
            >
              {isMuted ? (
                <IconVolumeOff className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              ) : (
                <IconVolume className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              )}
            </button>
          </div>
          
          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        </div>

        <article
          className={`relative p-4 sm:p-[4vmin] transition-opacity duration-1000 ease-in-out ${
            current === index ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
          style={{ 
            zIndex: 10,
            pointerEvents: "none" // Make text non-interactive so controls can be clicked
          }}
        >
          <h2 className="text-base sm:text-lg md:text-2xl lg:text-4xl font-semibold relative mb-2 sm:mb-4">
            {title}
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-white/90 mb-3 sm:mb-6 italic">
            "{quote}"
          </p>
          <div className="mt-2 sm:mt-4">
            <p className="font-medium text-sm sm:text-base">{name}</p>
            <p className="text-xs sm:text-sm text-white/70">{role}</p>
          </div>
        </article>
      </li>
    </div>
  );
};

interface CarouselControlProps {
  type: string;
  title: string;
  handleClick: () => void;
}

const CarouselControl = ({
  type,
  title,
  handleClick,
}: CarouselControlProps) => {
  return (
    <button
      className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center mx-2 justify-center bg-neutral-200 dark:bg-neutral-800 border-3 border-transparent rounded-full focus:border-accent focus:ring-2 focus:ring-accent focus:outline-none hover:-translate-y-0.5 active:translate-y-0.5 transition duration-200 ${
        type === "previous" ? "rotate-180" : ""
      }`}
      title={title}
      onClick={handleClick}
      aria-label={title}
    >
      <IconArrowNarrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-600 dark:text-neutral-200" />
    </button>
  );
};

interface TestimonialCarouselProps {
  testimonials: TestimonialData[];
  autoScroll?: boolean;
  scrollInterval?: number;
}

export function TestimonialCarousel({ 
  testimonials,
  autoScroll = true,
  scrollInterval = 5000
}: TestimonialCarouselProps) {
  const [current, setCurrent] = useState(0);
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const isHovering = useRef(false);

  // Auto scroll functionality with looping
  useEffect(() => {
    if (autoScroll) {
      const startAutoScroll = () => {
        autoScrollRef.current = setInterval(() => {
          if (!isHovering.current) {
            setCurrent(prev => (prev + 1) % testimonials.length);
          }
        }, scrollInterval);
      };

      startAutoScroll();

      return () => {
        if (autoScrollRef.current) {
          clearInterval(autoScrollRef.current);
        }
      };
    }
  }, [autoScroll, testimonials.length, scrollInterval]);

  // Pause auto-scroll on hover
  useEffect(() => {
    const carousel = carouselRef.current;
    
    const handleMouseEnter = () => {
      isHovering.current = true;
    };
    
    const handleMouseLeave = () => {
      isHovering.current = false;
    };
    
    if (carousel) {
      carousel.addEventListener('mouseenter', handleMouseEnter);
      carousel.addEventListener('mouseleave', handleMouseLeave);
      
      return () => {
        carousel.removeEventListener('mouseenter', handleMouseEnter);
        carousel.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, []);

  const handlePreviousClick = () => {
    const previous = current - 1;
    setCurrent(previous < 0 ? testimonials.length - 1 : previous);
  };

  const handleNextClick = () => {
    const next = current + 1;
    setCurrent(next === testimonials.length ? 0 : next);
  };

  const handleSlideClick = (index: number) => {
    if (current !== index) {
      setCurrent(index);
    }
  };

  const id = useId();

  return (
    <div className="w-full flex flex-col items-center">
      <div
        ref={carouselRef}
        className="relative w-[90vmin] sm:w-[80vmin] md:w-[70vmin] h-[90vmin] sm:h-[80vmin] md:h-[70vmin] mx-auto"
        aria-labelledby={`carousel-heading-${id}`}
      >
        <ul
          className="absolute flex mx-[-4vmin] transition-transform duration-1000 ease-in-out"
          style={{
            transform: `translateX(-${current * (100 / testimonials.length)}%)`,
          }}
        >
          {testimonials.map((testimonial, index) => (
            <TestimonialSlide
              key={index}
              testimonial={testimonial}
              index={index}
              current={current}
              handleSlideClick={handleSlideClick}
              totalItems={testimonials.length}
            />
          ))}
        </ul>

        <div className="absolute flex justify-center w-full bottom-[-4rem]">
          <CarouselControl
            type="previous"
            title="Go to previous testimonial"
            handleClick={handlePreviousClick}
          />

          <CarouselControl
            type="next"
            title="Go to next testimonial"
            handleClick={handleNextClick}
          />
        </div>
      </div>
    </div>
  );
} 