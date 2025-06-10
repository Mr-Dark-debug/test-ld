import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.laxmideveloper.com'
  const currentDate = new Date()

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about-us`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/why-laxmi`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/career`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/information`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/information/emi-calculator`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/information/why-invest`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  try {
    // Fetch dynamic projects with reduced limit and only essential fields
    const projectsResponse = await fetch(`${baseUrl}/api/projects?limit=50&fields=slug,updatedAt`, {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 86400 }, // Revalidate every 24 hours
      cache: 'force-cache'
    })

    if (projectsResponse.ok) {
      const projectsData = await projectsResponse.json()
      if (projectsData.success && projectsData.data) {
        const projectPages: MetadataRoute.Sitemap = projectsData.data.map((project: any) => ({
          url: `${baseUrl}/projects/${project.slug}`,
          lastModified: project.updatedAt ? new Date(project.updatedAt) : currentDate,
          changeFrequency: 'monthly' as const,
          priority: 0.7,
        }))
        staticPages.push(...projectPages)
      }
    }

    // Fetch dynamic blogs with reduced limit and only essential fields
    const blogsResponse = await fetch(`${baseUrl}/api/blogs?status=published&limit=30&fields=slug,updatedAt`, {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 86400 }, // Revalidate every 24 hours
      cache: 'force-cache'
    })

    if (blogsResponse.ok) {
      const blogsData = await blogsResponse.json()
      if (blogsData.success && blogsData.data) {
        const blogPages: MetadataRoute.Sitemap = blogsData.data.map((blog: any) => ({
          url: `${baseUrl}/blogs/${blog.slug}`,
          lastModified: blog.updatedAt ? new Date(blog.updatedAt) : currentDate,
          changeFrequency: 'monthly' as const,
          priority: 0.6,
        }))
        staticPages.push(...blogPages)
      }
    }
  } catch (error) {
    console.error('Error fetching dynamic content for sitemap:', error)
    // Continue with static pages only
  }

  return staticPages
}
