"use client";
import SplitText from "@/components/reactbits/SplitText/SplitText";
import HeroImageCarousel from "@/components/ui/HeroImageCarousel";
import AnimatedContent from "@/components/reactbits/AnimatedContent/AnimatedContent";
import TiltedCard from "@/components/reactbits/TiltedCard/TiltedCard";

// Define your theme color
const THEME_COLOR_HEX = "#324189";
const EXCELLENCE_COLOR_HEX = "#FFBF00"; // Amber/Gold for excellence

// Property items for the TiltedCards - now 5 items
const propertyItems = [
  { imageSrc: "/images/hero/hero-1.jpg", alt: "Horizon, Greece", title: "Horizon, Greece" },
  { imageSrc: "/images/projects/Aleta.jpg", alt: "Sunset Ridge Villa, USA", title: "Sunset Ridge Villa, USA" },
  { imageSrc: "/images/projects/Millennium Park.jpg", alt: "Willowbrook Home, Oregon", title: "Willowbrook Home, Oregon" },
  { imageSrc: "/images/projects/Laxmi Nova.jpg", alt: "Whispering Pines, Canada", title: "Whispering Pines, Canada" },
  { imageSrc: "/images/projects/Alexa.jpg", alt: "Alexa Apartments", title: "Alexa Apartments" },
];

// Helper function getRandomPosition is no longer needed and will be removed implicitly by not using it.

export default function Hero() {
  const titleLine1 = `Laxmi Developers.`;
  const titleLine2 = `Brick By Brick`;
  const titleLine3 = `Building Excellence`;
  const baseDelaySplitText = 70;
  const overallTextAnimationDelay = 500; // ms, delay for the whole text block fade-in

  const carouselImages = propertyItems.map(item => ({ src: item.imageSrc, alt: item.alt }));

  return (
    <section className="bg-white dark:bg-gray-900 md:min-h-0 flex flex-col md:pt-20 lg:pt-24 md:pb-16 lg:pb-20 overflow-hidden">
      {/* Mobile Layout: Carousel + Text Block (height determined by content) */}
      <div className="md:hidden flex flex-col w-full"> {/* Removed h-screen, height now from content */}
        <div className="h-[70vh] w-full">
          <HeroImageCarousel images={carouselImages} interval={3000} />
        </div>
        <div className="flex flex-col justify-center items-center p-6 py-8 text-center bg-background flex-shrink-0"> {/* Increased py-8 for a bit more breathing room for text */}
          <AnimatedContent distance={0} delay={overallTextAnimationDelay} direction="vertical"> 
            <SplitText
              text={titleLine1}
              className="text-3xl font-serif leading-tight text-gray-900 dark:text-white block mb-1"
              delay={baseDelaySplitText}
              textAlign="center"
              animationFrom={{ opacity: 0, transform: 'translate3d(0,20px,0)' }}
              animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
            />
            <div style={{ color: THEME_COLOR_HEX }}>
              <SplitText
                text={titleLine2}
                className="text-2xl font-serif leading-tight block mb-1"
                delay={baseDelaySplitText}
                textAlign="center"
                animationFrom={{ opacity: 0, transform: 'translate3d(0,20px,0)' }}
                animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
              />
            </div>
            <p className="text-3xl font-serif leading-tight text-gray-900 dark:text-white block">
              {titleLine3}
            </p>
          </AnimatedContent>
        </div>
      </div>

      {/* Desktop Layout - Text part */}
      <div className="hidden md:flex md:flex-col md:justify-center container mx-auto px-4 sm:px-6 lg:px-8 flex-grow py-10">
        <div className="text-center relative">
          <AnimatedContent distance={0} delay={overallTextAnimationDelay} direction="vertical"> 
            <div className="relative z-10 max-w-4xl mx-auto">
              <SplitText
                text={titleLine1}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-serif leading-tight text-gray-900 dark:text-white block mb-2 sm:mb-3"
                delay={baseDelaySplitText}
                textAlign="center"
                animationFrom={{ opacity: 0, transform: 'translate3d(0,30px,0)' }}
                animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
              />
              <div style={{ color: THEME_COLOR_HEX }}>
                <SplitText
                  text={titleLine2}
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-[58px] font-serif leading-tight block mb-2 sm:mb-3"
                  delay={baseDelaySplitText}
                  textAlign="center"
                  animationFrom={{ opacity: 0, transform: 'translate3d(0,30px,0)' }}
                  animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
                />
              </div>
              <p className="text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-serif leading-tight text-gray-900 dark:text-white block">
                {titleLine3}
              </p>
            </div>
          </AnimatedContent>
        </div>
      </div>
      
      {/* Desktop Property Cards Section - Reinstated */}
      <div className="hidden md:block mt-10 md:mt-12 lg:mt-16">
        <div className="flex flex-wrap justify-center items-start gap-x-4 sm:gap-x-6 lg:gap-x-8 gap-y-12 sm:gap-y-16 px-4">
          {propertyItems.map((item, idx) => (
            <AnimatedContent
              key={item.title + idx + "-anim-desktop"} // Added -desktop to key for clarity
              direction="vertical"
              distance={50}
              delay={200 * idx}
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
