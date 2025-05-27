"use client";

import { Calendar, MapPin } from "lucide-react"; // Assuming lucide-react for icons

// Placeholder project data - replace with your actual data source
const projects = [
  {
    year: "2023",
    status: "Completed",
    title: "Sunset Apartments",
    location: "Downtown, Cityville",
    description: "Modern residential complex with stunning city views.",
  },
  {
    year: "2024",
    status: "Ongoing",
    title: "Oceanview Villas",
    location: "Coastal Route, Seaview",
    description: "Luxury villas offering direct beach access and premium amenities.",
  },
  {
    year: "2024",
    status: "Completed",
    title: "Greenwood Plaza",
    location: "Suburbia, Townsville",
    description: "A commercial hub with retail spaces and office units.",
  },
  {
    year: "2025",
    status: "Upcoming",
    title: "Skyline Tower",
    location: "Financial District, Metrocity",
    description: "Iconic skyscraper set to redefine the city's skyline.",
  },
  {
    year: "2025",
    status: "Upcoming",
    title: "Eco-Friendly Homes",
    location: "Rural Greens, Countryside",
    description: "Sustainable housing project focused on green living.",
  },
];

const ProjectTimeline = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Project Journey
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our timeline of exceptional developments that have shaped
            communities and redefined living experiences
          </p>
        </div>
        <div className="relative">
          {/* Timeline line - enhanced for animation */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 transform -translate-y-1/2 hidden lg:block">
            <div className="w-full h-full bg-blue-500 animate-timeline-line"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-4">
            {projects.map((project, index) => (
              <div
                key={index}
                className="relative group" // Added group for hover effects
              >
                {/* Timeline dot - enhanced */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-4 border-blue-500 rounded-full shadow-lg z-10 hidden lg:block group-hover:scale-125 transition-transform duration-300" />
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-xl transition-all duration-300 ease-in-out mt-8 lg:mt-12 transform group-hover:-translate-y-2">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span className="text-blue-600 font-semibold">
                      {project.year}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ml-auto ${
                        project.status === "Ongoing"
                          ? "bg-yellow-100 text-yellow-800 animate-pulse-slow" // Added slow pulse for ongoing
                          : project.status === "Upcoming"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-1 mb-3">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 text-sm">
                      {project.location}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{project.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes timeline-line-progress {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }
        .animate-timeline-line {
          transform-origin: left;
          animation: timeline-line-progress 2s ease-out forwards;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </section>
  );
};

export default ProjectTimeline; 