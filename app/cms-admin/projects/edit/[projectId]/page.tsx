import { AddEditProjectForm } from "@/app/cms-admin/components/AddEditProjectForm";
import React from "react";

interface EditProjectPageProps {
  params: {
    projectId: string;
  };
}

export default function EditProjectPage({ params }: EditProjectPageProps) {
  return (
    <div className="container mx-auto py-8 px-4">
      <AddEditProjectForm projectId={params.projectId} />
    </div>
  );
} 