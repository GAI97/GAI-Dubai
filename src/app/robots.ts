import type { MetadataRoute } from 'next'

function getSiteUrl(): string {
  const fromEnv = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL
  const fallback = 'https://globalallianceimmigration.com'
  try {
    const u = new URL(fromEnv || fallback)
    return u.origin
  } catch {
    return fallback
  }
}

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl()
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}


