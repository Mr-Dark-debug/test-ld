"use client";
import React from "react";
import { motion } from "motion/react";
import AnimatedTitle from "@/components/ui/AnimatedTitle";

// Testimonial data
const testimonials = [
  {
    text: "I'm extremely impressed with Laxmi Developers' commitment to quality. My apartment exceeds all expectations with its thoughtful design and premium finishes.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&h=100&fit=crop",
    name: "Priyanka Mehta",
    role: "Homeowner, Laxmi Residency",
  },
  {
    text: "The entire process from booking to possession was seamless. Their team guided us patiently through every step, making our first home purchase a pleasant experience.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&h=100&fit=crop",
    name: "Aditya Shah",
    role: "Resident, Laxmi Villa Township",
  },
  {
    text: "Moving to Laxmi Villa Township was the best decision for our family. The community atmosphere and amenities are exceptional, and the construction quality is outstanding.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&h=100&fit=crop",
    name: "Neha Patel",
    role: "Homeowner",
  },
  {
    text: "Our shop in Millennium Textile Market has proven to be an excellent investment. The location and facilities have helped our business grow exponentially.",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=100&h=100&fit=crop",
    name: "Rajesh Desai",
    role: "Business Owner",
  },
  {
    text: "Laxmi Developers delivered exactly what they promised - a premium property with unmatched quality and timely possession. Highly recommend their projects.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=100&h=100&fit=crop",
    name: "Vikram Singh",
    role: "Investor",
  },
  {
    text: "The architectural design of our commercial space in Laxmi Enclave has received numerous compliments from clients. It's both functional and aesthetically pleasing.",
    image: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?q=80&w=100&h=100&fit=crop",
    name: "Meena Sharma",
    role: "Business Owner",
  },
  {
    text: "We've been living in our Laxmi Developers home for three years now, and the quality of construction is still as impressive as day one. Truly built to last.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&h=100&fit=crop",
    name: "Arjun Kapoor",
    role: "Resident",
  },
  {
    text: "The attention to detail in our apartment is remarkable. From the layout to the fixtures, everything has been thoughtfully designed and expertly executed.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&h=100&fit=crop",
    name: "Sanjay Verma",
    role: "Homeowner",
  },
  {
    text: "Working with Laxmi Developers for our office space was a pleasure. They understood our requirements perfectly and delivered a workspace that enhances productivity.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100&h=100&fit=crop",
    name: "Anita Joshi",
    role: "Corporate Client",
  },
];

const TestimonialsColumn = (props: {
  className?: string;
  testimonials: typeof testimonials;
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6 bg-background"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, image, name, role }, i) => (
                <div className="p-6 rounded-2xl border border-accent/10 shadow-md shadow-primary/10 max-w-xs w-full bg-background" key={i}>
                  <div className="text-foreground/80 text-sm">{text}</div>
                  <div className="flex items-center gap-2 mt-4">
                    <img
                      width={40}
                      height={40}
                      src={image}
                      alt={name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                      <div className="font-medium tracking-tight leading-5 text-foreground">{name}</div>
                      <div className="leading-5 text-foreground/60 tracking-tight text-xs">{role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
};

export const TestimonialsColumns = () => {
  const firstColumn = testimonials.slice(0, 3);
  const secondColumn = testimonials.slice(3, 6);
  const thirdColumn = testimonials.slice(6, 9);

  return (
    <section className="bg-background py-20 relative">
      <div className="container z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[540px] mx-auto"
        >
          <div className="flex justify-center mb-2">
            <div className="border border-accent/20 py-1 px-4 rounded-lg text-accent">Testimonials</div>
          </div>

          <AnimatedTitle as="h2" className="mb-4 text-center">
            What our clients say
          </AnimatedTitle>
          <p className="text-center mt-2 text-foreground/75 max-w-md mx-auto">
            Hear from people who have experienced the Laxmi Developers difference.
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 mt-12 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[720px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
        </div>
      </div>
    </section>
  );
}; 