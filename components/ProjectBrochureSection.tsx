"use client";

import { useState } from "react";
import { AuroraButton } from "@/components/ui/aurora-button";
import { BrochureDownloadForm } from "@/components/BrochureDownloadForm";

interface ProjectBrochureSectionProps {
  projectName: string;
  brochureUrl: string;
}

export function ProjectBrochureSection({ 
  projectName, 
  brochureUrl 
}: ProjectBrochureSectionProps) {
  const [showForm, setShowForm] = useState(false);
  
  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center">
          {!showForm ? (
            <div className="text-center">
              <h3 className="text-2xl font-semibold mb-4">
                Interested in {projectName}?
              </h3>
              <p className="mb-6 text-muted-foreground max-w-md mx-auto">
                Download our detailed brochure to learn more about the features, amenities, 
                and specifications of this project.
              </p>
              <AuroraButton 
                onClick={() => setShowForm(true)}
                variant="default"
                className="px-6 py-3 font-medium"
              >
                Download Brochure
              </AuroraButton>
            </div>
          ) : (
            <BrochureDownloadForm 
              projectName={projectName} 
              brochureUrl={brochureUrl} 
            />
          )}
        </div>
      </div>
    </div>
  );
} 