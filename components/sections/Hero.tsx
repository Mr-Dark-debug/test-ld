"use client";
import { Sparkle } from "lucide-react";
import TiltedCard from "@/components/reactbits/TiltedCard/TiltedCard";
import SplitText from "@/components/reactbits/SplitText/SplitText";
import AnimatedContent from "@/components/reactbits/AnimatedContent/AnimatedContent";
import { ShimmerButton } from "@/components/magicui/shimmer-button";

// Define your theme color
const THEME_COLOR_HEX = "#324189";

// Property items for the TiltedCards - now 5 items
const propertyItems = [
  { imageSrc: "/images/hero/hero-1.jpg", alt: "Horizon, Greece", title: "Horizon, Greece" },
  { imageSrc: "/images/projects/Aleta.jpg", alt: "Sunset Ridge Villa, USA", title: "Sunset Ridge Villa, USA" },
  { imageSrc: "/images/projects/Millennium Park.jpg", alt: "Willowbrook Home, Oregon", title: "Willowbrook Home, Oregon" },
  { imageSrc: "/images/projects/Laxmi Nova.jpg", alt: "Whispering Pines, Canada", title: "Whispering Pines, Canada" },
  { imageSrc: "/images/projects/Alexa.jpg", alt: "Alexa Apartments", title: "Alexa Apartments" }, // Added fifth item
];

export default function Hero() {
  const titleLine1 = `Brick By Brick Building Excellence`;
  const titleLine2 = `Laxmi Developers.`;
  const baseDelay = 70;
  const firstLineAnimationDuration = titleLine1.length * baseDelay;

  return (
    <section className="bg-white dark:bg-gray-900 pt-16 md:pt-20 lg:pt-24 pb-12 md:pb-16 lg:pb-20 overflow-x-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center relative mb-12 md:mb-16 lg:mb-20"> {/* Adjusted bottom margin */}
          <Sparkle 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-300 opacity-10 dark:opacity-5 z-0"
            style={{ width: '280px', height: '280px' }} // Slightly larger sparkle 
            strokeWidth={0.5}
          />
          <div className="relative z-10 max-w-3xl mx-auto"> {/* Constrain width and center */}
            <SplitText 
              text={titleLine1}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[64px] xl:text-[68px] font-serif leading-tight text-gray-900 dark:text-white block mb-2 sm:mb-3"
              delay={baseDelay} 
              textAlign="center"
              animationFrom={{ opacity: 0, transform: 'translate3d(0,30px,0)' }}
              animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
            />
            <span style={{ color: THEME_COLOR_HEX }}> {/* Apply color to this span */}
              <SplitText 
                text={titleLine2}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-[64px] xl:text-[68px] font-serif leading-tight block"
                delay={baseDelay} 
                textAlign="center"
                animationFrom={{ opacity: 0, transform: 'translate3d(0,30px,0)' }}
                animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
              />
            </span>
          </div>

          {/* CTA Button */}
          <AnimatedContent
            direction="vertical"
            distance={30}
            delay={firstLineAnimationDuration + (titleLine2.length * baseDelay) + 100} // Delay after both title lines
            threshold={0.1}
          >
            <div className="mt-8 md:mt-10 flex justify-center">
              <ShimmerButton
                background={THEME_COLOR_HEX}
                shimmerColor="#A7C7E7" // A lighter, complementary blue for shimmer
                shimmerDuration="5s" // Slower shimmer
                borderRadius="0.375rem" // Tailwind's 'rounded-md'
                className="px-8 py-3 text-base sm:text-lg font-medium text-white dark:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-800"
                // Ensure text remains white in dark mode if background is dark theme color
                onClick={() => { console.log("Explore Projects clicked!"); /* Replace with actual navigation: e.g. router.push('/projects') */ }}
              >
                Explore Projects
              </ShimmerButton>
            </div>
          </AnimatedContent>
        </div>
      </div>

      {/* Property Cards Section */}
      <div className="mt-10 md:mt-12 lg:mt-16"> {/* Adjusted top margin for cards */}
        <div className="flex flex-wrap justify-center items-start gap-x-4 sm:gap-x-6 lg:gap-x-8 gap-y-12 sm:gap-y-16 px-4">
          {propertyItems.map((item, idx) => (
            <AnimatedContent
              key={item.title + idx + "-anim"}
              direction="vertical"
              distance={50}
              delay={200 * idx} // Slightly increased stagger for cards
              threshold={0.1}
            >
              <div
                className="flex-shrink-0"
                style={{
                  transform: idx % 2 === 0 ? 'translateY(-20px)' : 'translateY(20px)',
                }}
              >
                <TiltedCard
                  imageSrc={item.imageSrc}
                  altText={item.alt}
                  captionText={`${item.title}`}
                  containerHeight="auto"
                  containerWidth="230px" 
                  imageHeight="250px"
                  imageWidth="100%"
                  rotateAmplitude={8}
                  scaleOnHover={1.05}
                  showMobileWarning={false}
                  showTooltip={true}
                  displayOverlayContent={false}
                />
                <div className="mt-3 text-center w-[230px]">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white truncate">{item.title}</h3>
                </div>
              </div>
            </AnimatedContent>
          ))}
        </div>
      </div>
    </section>
  );
}
