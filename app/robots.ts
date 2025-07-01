import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.laxmideveloper.com'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/projects',
          '/about-us',
          '/why-laxmi',
          '/blogs',
          '/contact',
          '/career',
          '/information',
          '/_next/static/', // Allow access to static assets
          '/_next/image/',  // Allow access to optimized images
        ],
        disallow: [
          '/cms-admin/',
          '/api/',
          '/admin/',
          // '*.json$', // Allowing sitemap.xml, removing this generally. If specific JSONs need disallowing, add them.
          // '*.xml$', // Specifically allowing sitemap.xml by removing this.
        ],
        // crawlDelay: 1, // crawl-delay is not officially supported by Google, removing.
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
