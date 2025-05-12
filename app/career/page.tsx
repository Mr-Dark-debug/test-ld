import { Metadata } from "next/types";
import CareerClient from "@/components/sections/CareerClient";

export const metadata: Metadata = {
  title: "Careers | Laxmi Developers",
  description: "Join our team at Laxmi Developers. Explore current job openings and apply for opportunities in real estate development.",
};

// Mock job openings
const jobOpenings = [
  {
    id: "job-1",
    title: "Senior Architect",
    department: "Design",
    location: "Surat, Gujarat",
    type: "Full-time",
    description:
      "We are seeking an experienced Senior Architect to join our design team. The ideal candidate will have a proven track record of designing innovative residential and commercial spaces.",
    responsibilities: [
      "Develop architectural designs for residential and commercial projects",
      "Coordinate with engineering teams for technical specifications",
      "Ensure all designs meet regulatory standards and client requirements",
      "Supervise junior architects and design staff",
      "Present design concepts to clients and stakeholders",
    ],
    requirements: [
      "Bachelor's or Master's degree in Architecture",
      "Minimum 5 years of experience in real estate development",
      "Proficiency in AutoCAD, Revit, and 3D rendering software",
      "Strong portfolio demonstrating creative design capabilities",
      "Excellent communication and presentation skills",
    ],
  },
  {
    id: "job-2",
    title: "Civil Engineer",
    department: "Construction",
    location: "Surat, Gujarat",
    type: "Full-time",
    description:
      "We are looking for a detail-oriented Civil Engineer to oversee construction projects and ensure they are completed to the highest standards of quality and safety.",
    responsibilities: [
      "Review and approve construction plans and specifications",
      "Monitor construction progress and quality control",
      "Coordinate with contractors and suppliers",
      "Ensure compliance with building codes and safety regulations",
      "Prepare project reports and documentation",
    ],
    requirements: [
      "Bachelor's degree in Civil Engineering",
      "3+ years of experience in construction management",
      "Knowledge of construction methods, materials, and industry standards",
      "Familiarity with project management software",
      "Strong analytical and problem-solving skills",
    ],
  },
  {
    id: "job-3",
    title: "Marketing Executive",
    department: "Marketing",
    location: "Surat, Gujarat",
    type: "Full-time",
    description:
      "Join our marketing team to help promote our properties and strengthen our brand presence in the real estate market.",
    responsibilities: [
      "Develop and implement marketing strategies for property launches",
      "Create compelling content for digital and traditional marketing channels",
      "Manage social media presence and engagement",
      "Organize property exhibitions and client events",
      "Track marketing metrics and prepare performance reports",
    ],
    requirements: [
      "Bachelor's degree in Marketing, Business, or related field",
      "2+ years of experience in real estate marketing",
      "Strong understanding of digital marketing channels",
      "Excellent written and verbal communication skills",
      "Creative thinking and attention to detail",
    ],
  },
];

export default function CareerPage() {
  return <CareerClient jobOpenings={jobOpenings} />;
} 