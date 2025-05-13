"use client";

import { ProjectBrochureSection } from "@/components/ProjectBrochureSection";

export default function ProjectPage() {
  // Project details
  const projectInfo = {
    name: "Millennium Park",
    location: "Vesu, Surat",
    brochureUrl: "/brochures/millennium-park.pdf", // Path to your brochure file
  };

  return (
    <main className="min-h-screen">
      {/* Hero section for the project would go here */}
      <section className="py-12 bg-muted">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">{projectInfo.name}</h1>
          <p className="text-xl text-muted-foreground mb-8">{projectInfo.location}</p>
          
          {/* Project details would go here */}
        </div>
      </section>
      
      {/* Brochure download section */}
      <ProjectBrochureSection 
        projectName={projectInfo.name}
        brochureUrl={projectInfo.brochureUrl}
      />
      
      {/* Other project sections would go here */}
    </main>
  );
} 