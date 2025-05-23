import React from "react";

export interface GlassIconsItem {
  icon: React.ReactElement;
  color: string;
  label: string;
  customClass?: string;
}

export interface GlassIconsProps {
  items: GlassIconsItem[];
  className?: string;
}

const gradientMapping: Record<string, string> = {
  blue: "linear-gradient(180deg, hsla(223, 90%, 50%, 0.85), hsla(208, 90%, 50%, 0.75))",
  purple: "linear-gradient(180deg, hsla(283, 90%, 50%, 0.85), hsla(268, 90%, 50%, 0.75))",
  red: "linear-gradient(180deg, hsla(3, 90%, 50%, 0.85), hsla(348, 90%, 50%, 0.75))",
  indigo: "linear-gradient(180deg, hsla(253, 90%, 50%, 0.85), hsla(238, 90%, 50%, 0.75))",
  orange: "linear-gradient(180deg, hsla(43, 90%, 50%, 0.85), hsla(28, 90%, 50%, 0.75))",
  green: "linear-gradient(180deg, hsla(123, 90%, 40%, 0.85), hsla(108, 90%, 40%, 0.75))",
};

const GlassIcons: React.FC<GlassIconsProps> = ({ items, className }) => {
  const getBackgroundStyle = (color: string): React.CSSProperties => {
    if (gradientMapping[color]) {
      return { 
        background: gradientMapping[color],
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)"
      };
    }
    // For custom colors, add transparency and blur effects
    return { 
      background: `${color}cc`, // Add 80% opacity
      backdropFilter: "blur(8px)",
      WebkitBackdropFilter: "blur(8px)"
    };
  };

  return (
    <div
      className={`grid gap-8 md:gap-12 grid-cols-2 md:grid-cols-3 mx-auto py-8 overflow-visible ${
        className || ""
      }`}
    >
      {items.map((item, index) => (
        <div
          key={index}
          className="flex flex-col items-center justify-center"
        >
          <button
            type="button"
            aria-label={item.label}
            className={`relative bg-transparent outline-none w-[4.5em] h-[4.5em] [perspective:24em] [transform-style:preserve-3d] [-webkit-tap-highlight-color:transparent] group ${
              item.customClass || ""
            }`}
          >
            {/* Back layer */}
            <span
              className="absolute top-0 left-0 w-full h-full rounded-[1.25em] block transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.83,0,0.17,1)] origin-[100%_100%] rotate-[15deg] group-hover:[transform:rotate(25deg)_translate3d(-0.5em,-0.5em,0.5em)]"
              style={{
                ...getBackgroundStyle(item.color),
                boxShadow: "0.5em -0.5em 1em hsla(223, 10%, 10%, 0.2)",
              }}
            ></span>

            {/* Front layer */}
            <span
              className="absolute top-0 left-0 w-full h-full rounded-[1.25em] bg-[hsla(0,0%,100%,0.2)] transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.83,0,0.17,1)] origin-[80%_50%] flex backdrop-blur-[0.75em] [-webkit-backdrop-filter:blur(0.75em)] transform group-hover:[transform:translateZ(2em)]"
              style={{
                boxShadow: "0 0 0 0.1em hsla(0, 0%, 100%, 0.4) inset",
              }}
            >
              <span
                className="m-auto w-[1.75em] h-[1.75em] flex items-center justify-center"
                aria-hidden="true"
              >
                {item.icon}
              </span>
            </span>
          </button>

          {/* Label - Better styling for visibility */}
          <span className="text-center font-medium mt-4 text-sm md:text-base leading-tight max-w-[120px] opacity-90 group-hover:opacity-100">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default GlassIcons;
