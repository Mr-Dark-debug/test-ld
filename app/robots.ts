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
        ],
        disallow: [
          '/cms-admin/',
          '/api/',
          '/_next/',
          '/admin/',
          '*.json$',
          '*.xml$',
        ],
        crawlDelay: 1,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
