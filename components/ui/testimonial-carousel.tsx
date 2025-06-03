"use client";
import { IconArrowNarrowRight, IconPlayerPlay, IconPlayerPause, IconVolume, IconVolumeOff } from "@tabler/icons-react";
import { useState, useRef, useId, useEffect } from "react";

interface TestimonialData {
  title: string;
  quote: string;
  name: string;
  role: string;
  videoSrc?: string;
  youtubeUrl?: string;
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
  const [isHovered, setIsHovered] = useState(false);
  const [showText, setShowText] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

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

  // Handle text visibility based on hover and play state
  useEffect(() => {
    if (current !== index) {
      setShowText(true);
      setIsPlaying(false);
    }
  }, [current, index]);

  const handleMouseMove = (event: React.MouseEvent) => {
    const el = slideRef.current;
    if (!el) return;

    const r = el.getBoundingClientRect();
    xRef.current = event.clientX - (r.left + Math.floor(r.width / 2));
    yRef.current = event.clientY - (r.top + Math.floor(r.height / 2));
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (current === index) {
      setShowText(false);
    }
  };

  const handleMouseLeave = () => {
    xRef.current = 0;
    yRef.current = 0;
    setIsHovered(false);
    if (!isPlaying) {
      setShowText(true);
    }
  };

  const handleVideoPlay = () => {
    setIsPlaying(true);
    setShowText(false);
  };

  const handleVideoPause = () => {
    setIsPlaying(false);
    if (!isHovered) {
      setShowText(true);
    }
  };

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const { videoSrc, youtubeUrl, thumbnailSrc, quote, title, name, role } = testimonial;
  const youtubeVideoId = youtubeUrl ? getYouTubeVideoId(youtubeUrl) : null;

  return (
    <div className="[perspective:1200px] [transform-style:preserve-3d]">
      <li
        ref={slideRef}
        className="flex flex-1 flex-col items-center justify-center relative text-center text-white opacity-100 transition-all duration-300 ease-in-out w-[90vmin] sm:w-[80vmin] md:w-[70vmin] h-[90vmin] sm:h-[80vmin] md:h-[70vmin] mx-[4vmin] z-10"
        onClick={() => handleSlideClick(index)}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
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
          {/* YouTube embed - always show for active slide */}
          {youtubeVideoId && current === index ? (
            <iframe
              ref={iframeRef}
              className="absolute inset-0 w-full h-full rounded-xl"
              src={`https://www.youtube.com/embed/${youtubeVideoId}?enablejsapi=1&controls=1&rel=0&modestbranding=1&fs=1&cc_load_policy=0&iv_load_policy=3&autohide=1`}
              title={`${name} Testimonial Video`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{
                opacity: 1,
                zIndex: 10,
              }}
            />
          ) : youtubeVideoId ? (
            // Show thumbnail for inactive slides
            <img
              src={thumbnailSrc}
              alt={`${name} testimonial thumbnail`}
              className="absolute inset-0 w-full h-full object-cover rounded-xl"
              style={{
                opacity: 0.7,
              }}
            />
          ) : videoSrc ? (
            <>
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

              {/* Video controls in top-right corner - only for regular videos */}
              <div className="absolute top-4 right-4 flex items-center space-x-2 z-20">
                <button
                  type="button"
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
                  type="button"
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
            </>
          ) : (
            // Fallback: show thumbnail image if no video
            <img
              src={thumbnailSrc}
              alt={`${name} testimonial`}
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                opacity: current === index ? 1 : 0.5,
              }}
            />
          )}
          
          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        </div>

        {/* Text overlay - hide on hover for YouTube videos */}
        <article
          className={`absolute inset-0 flex flex-col justify-end p-4 sm:p-[4vmin] transition-all duration-500 ease-in-out ${
            current === index && showText ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
          style={{
            zIndex: showText ? 20 : 5,
            background: showText ? "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)" : "transparent",
            pointerEvents: youtubeVideoId && current === index ? "none" : "auto"
          }}
        >
          <div className="text-white">
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
          </div>
        </article>

        {/* Play button hint for YouTube videos */}
        {youtubeVideoId && current === index && showText && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
            <div className="bg-black/50 rounded-full p-4 backdrop-blur-sm">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
            <p className="text-white text-sm text-center mt-2 font-medium">Hover to play video</p>
          </div>
        )}
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
      type="button"
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