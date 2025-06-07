import React from "react";
import { Project } from "@/components/sections/FeaturedProjects";
import { Amenity, Specification } from "@/components/sections/ProjectDetails";
import {
  SecurityIcon,
  PoolIcon,
  FitnessIcon,
  GardenIcon,
  ParkingIcon,
  PlaygroundIcon,
  ClubhouseIcon,
  ElevatorIcon
} from "@/components/ui/AmenityIcons";

// Mock project amenities with placeholder icons
export const projectAmenities: Amenity[] = [
  {
    id: "amenity-1",
    name: "24/7 Security",
    icon: <SecurityIcon />
  },
  {
    id: "amenity-2",
    name: "Swimming Pool",
    icon: <PoolIcon />
  },
  {
    id: "amenity-3",
    name: "Fitness Center",
    icon: <FitnessIcon />
  },
  {
    id: "amenity-4",
    name: "Garden Area",
    icon: <GardenIcon />
  },
  {
    id: "amenity-5",
    name: "Parking Space",
    icon: <ParkingIcon />
  },
  {
    id: "amenity-6",
    name: "Children's Play Area",
    icon: <PlaygroundIcon />
  },
  {
    id: "amenity-7",
    name: "Club House",
    icon: <ClubhouseIcon />
  },
  {
    id: "amenity-8",
    name: "Elevator",
    icon: <ElevatorIcon />
  },
  {
    id: "amenity-9",
    name: "WiFi",
    icon: <SecurityIcon /> // Using existing icon as placeholder, will be replaced by enhanced icon
  },
  {
    id: "amenity-10",
    name: "24-Hour Access",
    icon: <SecurityIcon /> // Using existing icon as placeholder, will be replaced by enhanced icon
  },
  {
    id: "amenity-11",
    name: "Dining Facilities",
    icon: <ClubhouseIcon /> // Using existing icon as placeholder, will be replaced by enhanced icon
  }
];

// Sample residential project specifications
export const residentialSpecs: Specification[] = [
  { name: "Total Units", value: "64" },
  { name: "Unit Types", value: "1BHK, 2BHK, 3BHK" },
  { name: "Unit Area", value: "625 - 1350 sq.ft." },
  { name: "Possession", value: "December 2025" },
  { name: "Structure", value: "RCC Framed Structure" },
  { name: "Flooring", value: "Vitrified Tiles" },
];

// Sample commercial project specifications
export const commercialSpecs: Specification[] = [
  { name: "Total Units", value: "32" },
  { name: "Shop Area", value: "200 - 1200 sq.ft." },
  { name: "Office Area", value: "450 - 2500 sq.ft." },
  { name: "Possession", value: "March 2026" },
  { name: "Structure", value: "RCC Framed Structure" },
  { name: "Flooring", value: "Granite/Vitrified Tiles" },
];

// Featured Projects with Real Images
export const featuredProjects: Project[] = [
  {
    id: "project-1",
    title: "Millennium Park",
    type: "residential",
    status: "ongoing",
    location: "Vesu, Surat",
    imageSrc: "/images/projects/Millennium Park.jpg",
    href: "/residential/on-going/millennium-park",
  },
  {
    id: "project-2",
    title: "Millennium Business Hub",
    type: "commercial",
    status: "completed",
    location: "Ring Road, Surat",
    imageSrc: "/images/projects/Millennium Business Hub.jpg",
    href: "/commercial/completed/millennium-business-hub",
  },
  {
    id: "project-3",
    title: "Laxmi Nova",
    type: "residential",
    status: "ongoing",
    location: "Adajan, Surat",
    imageSrc: "/images/projects/Laxmi Nova.jpg",
    href: "/residential/on-going/laxmi-nova",
  },
  {
    id: "project-4",
    title: "Millennium City Central",
    type: "commercial",
    status: "upcoming",
    location: "Citylight, Surat",
    imageSrc: "/images/projects/Millennium City Central.jpg",
    href: "/commercial/upcoming/millennium-city-central",
  },
  {
    id: "project-5",
    title: "Alexa",
    type: "residential",
    status: "completed",
    location: "Piplod, Surat",
    imageSrc: "/images/projects/Alexa.jpg",
    href: "/residential/completed/alexa",
  },
  {
    id: "project-6",
    title: "Millennium Textile Market",
    type: "commercial",
    status: "ongoing",
    location: "Pal, Surat",
    imageSrc: "/images/projects/Millennium Textile Market 3.jpg",
    href: "/commercial/on-going/millennium-textile-market",
  },
];

// Project Details for individual project pages
export const projectDetails = {
  "millennium-park": {
    title: "Millennium Park",
    description:
      "Millennium Park is a premium residential project offering luxury living spaces designed for modern families. Located in the heart of Vesu, Surat, these apartments offer a perfect blend of comfort, convenience, and sophisticated living. With spacious 2 & 3 BHK options, each apartment is thoughtfully designed to maximize natural light and ventilation.",
    location: "Vesu, Surat",
    status: "ongoing",
    type: "residential",
    imageSrc: "/images/projects/Millennium Park.jpg",
    specifications: residentialSpecs,
    amenities: projectAmenities,
    brochureUrl: "/brochures/millennium-park.pdf",
    contactPhone: "+91 9978600222",
    reraNumber: "PR/GJ/SURAT/SURAT CITY/LAXMI/CAA00612/130222",
  },
  "millennium-business-hub": {
    title: "Millennium Business Hub",
    description:
      "Millennium Business Hub is a state-of-the-art commercial complex offering premium retail and office spaces. Strategically located on Ring Road, Surat, it features modern amenities and excellent connectivity, making it an ideal investment opportunity. The complex is designed to provide a conducive environment for businesses to thrive.",
    location: "Ring Road, Surat",
    status: "completed",
    type: "commercial",
    imageSrc: "/images/projects/Millennium Business Hub.jpg",
    specifications: commercialSpecs,
    amenities: projectAmenities.slice(0, 6),
    brochureUrl: "/brochures/millennium-business-hub.pdf",
    contactPhone: "+91 9978600222",
    reraNumber: "PR/GJ/SURAT/SURAT CITY/LAXMI/CAA00498/260621",
  },
  "laxmi-nova": {
    title: "Laxmi Nova",
    description:
      "Laxmi Nova represents the pinnacle of modern residential living in Surat. This premium project combines contemporary architecture with thoughtful amenities to create an exceptional living experience. Located in Adajan, it offers excellent connectivity and a vibrant community atmosphere.",
    location: "Adajan, Surat",
    status: "ongoing",
    type: "residential",
    imageSrc: "/images/projects/Laxmi Nova.jpg",
    specifications: residentialSpecs,
    amenities: projectAmenities,
    brochureUrl: "/brochures/laxmi-nova.pdf",
    contactPhone: "+91 9978600222",
    reraNumber: "PR/GJ/SURAT/SURAT CITY/LAXMI/CAA00613/140222",
  },
};

// All projects by category
export const allProjects = {
  residential: {
    ongoing: featuredProjects.filter(
      (p) => p.type === "residential" && p.status === "ongoing"
    ),
    completed: featuredProjects.filter(
      (p) => p.type === "residential" && p.status === "completed"
    ),
  },
  commercial: {
    ongoing: featuredProjects.filter(
      (p) => p.type === "commercial" && p.status === "ongoing"
    ),
    completed: featuredProjects.filter(
      (p) => p.type === "commercial" && p.status === "completed"
    ),
    upcoming: featuredProjects.filter(
      (p) => p.type === "commercial" && p.status === "upcoming"
    ),
  },
}; 