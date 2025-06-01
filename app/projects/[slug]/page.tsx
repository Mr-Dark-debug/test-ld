import React from 'react';
import { notFound } from 'next/navigation';
import { projectsApi } from '@/lib/api';
import ProjectDetailClient from './ProjectDetailClient';

interface ProjectDetailPageProps {
  params: {
    slug: string;
  };
}

async function getProject(slug: string) {
  try {
    // Construct the full URL for server-side requests
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NODE_ENV === 'development'
        ? 'http://localhost:3001'
        : 'http://localhost:3000';

    const response = await fetch(`${baseUrl}/api/projects/${slug}`, {
      cache: 'no-store' // Always fetch fresh data
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  // Fix for Next.js 15 - await params before using
  const resolvedParams = await params;
  const project = await getProject(resolvedParams.slug);

  if (!project) {
    notFound();
  }

  return <ProjectDetailClient project={project} />;
}

export async function generateMetadata({ params }: ProjectDetailPageProps) {
  // Fix for Next.js 15 - await params before using
  const resolvedParams = await params;
  const project = await getProject(resolvedParams.slug);

  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  return {
    title: `${project.title} | Laxmi Developers`,
    description: project.description || `Discover ${project.title} by Laxmi Developers`,
    openGraph: {
      title: project.title,
      description: project.description,
      images: project.images?.coverImage ? [project.images.coverImage] : [],
    },
  };
}
