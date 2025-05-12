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

// Mock Featured Projects
export const featuredProjects: Project[] = [
  {
    id: "project-1",
    title: "Laxmi Heights",
    type: "residential",
    status: "ongoing",
    location: "Vesu, Surat",
    imageSrc: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    href: "/residential/on-going/laxmi-heights",
  },
  {
    id: "project-2",
    title: "Laxmi Arcade",
    type: "commercial",
    status: "completed",
    location: "Ring Road, Surat",
    imageSrc: "https://images.unsplash.com/photo-1579632652768-6cb9dcf85912?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    href: "/commercial/completed/laxmi-arcade",
  },
  {
    id: "project-3",
    title: "Laxmi Paradise",
    type: "residential",
    status: "ongoing",
    location: "Adajan, Surat",
    imageSrc: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    href: "/residential/on-going/laxmi-paradise",
  },
  {
    id: "project-4",
    title: "Laxmi Business Hub",
    type: "commercial",
    status: "upcoming",
    location: "Citylight, Surat",
    imageSrc: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    href: "/commercial/upcoming/laxmi-business-hub",
  },
  {
    id: "project-5",
    title: "Laxmi Royal Residency",
    type: "residential",
    status: "completed",
    location: "Piplod, Surat",
    imageSrc: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    href: "/residential/completed/laxmi-royal-residency",
  },
  {
    id: "project-6",
    title: "Laxmi Trade Center",
    type: "commercial",
    status: "ongoing",
    location: "Pal, Surat",
    imageSrc: "https://images.unsplash.com/photo-1497366858526-0766cadbe8fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    href: "/commercial/on-going/laxmi-trade-center",
  },
];

// Mock Project Details for individual project pages
export const projectDetails = {
  "laxmi-heights": {
    title: "Laxmi Heights",
    description:
      "Laxmi Heights is a premium residential project offering luxury living spaces designed for modern families. Located in the heart of Vesu, Surat, these apartments offer a perfect blend of comfort, convenience, and sophisticated living. With spacious 2 & 3 BHK options, each apartment is thoughtfully designed to maximize natural light and ventilation.",
    location: "Vesu, Surat",
    status: "ongoing",
    type: "residential",
    imageSrc: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    specifications: residentialSpecs,
    amenities: projectAmenities,
    brochureUrl: "/brochures/laxmi-heights.pdf",
    contactPhone: "+91 9978600222",
    reraNumber: "PR/GJ/SURAT/SURAT CITY/LAXMI/CAA00612/130222",
  },
  "laxmi-arcade": {
    title: "Laxmi Arcade",
    description:
      "Laxmi Arcade is a state-of-the-art commercial complex offering premium retail and office spaces. Strategically located on Ring Road, Surat, it features modern amenities and excellent connectivity, making it an ideal investment opportunity. The complex is designed to provide a conducive environment for businesses to thrive.",
    location: "Ring Road, Surat",
    status: "completed",
    type: "commercial",
    imageSrc: "https://images.unsplash.com/photo-1579632652768-6cb9dcf85912?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    specifications: commercialSpecs,
    amenities: projectAmenities.slice(0, 6),
    brochureUrl: "/brochures/laxmi-arcade.pdf",
    contactPhone: "+91 9978600222",
    reraNumber: "PR/GJ/SURAT/SURAT CITY/LAXMI/CAA00498/260621",
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