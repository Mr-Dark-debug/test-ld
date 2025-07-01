import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.laxmideveloper.com'
  const currentDate = new Date()

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: new URL('/', baseUrl).toString(),
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: new URL('/projects', baseUrl).toString(),
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: new URL('/about-us', baseUrl).toString(),
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: new URL('/why-laxmi', baseUrl).toString(),
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: new URL('/blogs', baseUrl).toString(),
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: new URL('/contact', baseUrl).toString(),
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: new URL('/career', baseUrl).toString(),
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: new URL('/information', baseUrl).toString(),
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: new URL('/information/emi-calculator', baseUrl).toString(),
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: new URL('/information/why-invest', baseUrl).toString(),
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
          url: new URL(`/projects/${project.slug}`, baseUrl).toString(),
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
          url: new URL(`/blogs/${blog.slug}`, baseUrl).toString(),
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
