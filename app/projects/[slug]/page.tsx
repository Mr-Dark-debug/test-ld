import React from 'react';
import { notFound } from 'next/navigation';
import ProjectDetailClient from './ProjectDetailClient';

interface ProjectDetailPageProps {
  params: {
    slug: string;
  };
}

async function getProject(slug: string) {
  try {
    // Use environment variable for base URL with fallbacks
    let baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    // If no base URL is set, determine it based on environment
    if (!baseUrl) {
      if (process.env.VERCEL_URL) {
        baseUrl = `https://${process.env.VERCEL_URL}`;
      } else if (process.env.NODE_ENV === 'development') {
        // In development, try to detect the current port
        baseUrl = 'http://localhost:3000';
      } else {
        // Production fallback
        baseUrl = 'https://laxmidev-ashy.vercel.app';
      }
    }

    console.log(`Fetching project: ${baseUrl}/api/projects/${slug}`);

    const response = await fetch(`${baseUrl}/api/projects/${slug}`, {
      cache: 'no-store', // Always fetch fresh data
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 0 } // Disable caching for debugging
    });

    console.log(`Response status: ${response.status}`);

    if (!response.ok) {
      console.error(`Failed to fetch project: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    console.log('Project data received:', data.success ? 'Success' : 'Failed');
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
