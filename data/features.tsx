import React from "react";
import { 
  QualityIcon, 
  InnovationIcon, 
  CustomerIcon, 
  TimeIcon, 
  LocationIcon, 
  SustainabilityIcon 
} from "@/components/ui/Icons";

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export const companyFeatures: Feature[] = [
  {
    id: "feature-1",
    title: "Quality Excellence",
    description:
      "We never compromise on quality. Our construction materials and processes adhere to the highest standards, ensuring durability and long-term value for your investment.",
    icon: <QualityIcon />,
  },
  {
    id: "feature-2",
    title: "Innovative Design",
    description:
      "Our architects blend aesthetic appeal with functional practicality. Every project is designed to maximize space utilization while creating visually appealing and comfortable living environments.",
    icon: <InnovationIcon />,
  },
  {
    id: "feature-3",
    title: "Customer Satisfaction",
    description:
      "Our customers' happiness is our priority. We maintain transparent communication throughout the buying process and provide excellent after-sales service to ensure complete satisfaction.",
    icon: <CustomerIcon />,
  },
  {
    id: "feature-4",
    title: "Timely Delivery",
    description:
      "We understand the importance of timely possession. Our dedicated project management team ensures that all projects are completed and delivered on schedule, without compromising on quality.",
    icon: <TimeIcon />,
  },
  {
    id: "feature-5",
    title: "Strategic Locations",
    description:
      "All our properties are strategically located with excellent connectivity, proximity to essential services, and growth potential, ensuring convenience for residents and high return on investment.",
    icon: <LocationIcon />,
  },
  {
    id: "feature-6",
    title: "Sustainability Focus",
    description:
      "We are committed to environmentally responsible development. Our projects incorporate eco-friendly materials, energy-efficient systems, and green spaces to minimize environmental impact.",
    icon: <SustainabilityIcon />,
  },
]; 