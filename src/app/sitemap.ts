import type { MetadataRoute } from 'next'
import { fetchVisitVisas, fetchWorkPermits, fetchSkilledMigrations, fetchJobSeekerVisas, fetchWorkingHolidayVisas, fetchPostsRest } from '@/lib/wp-rest'

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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl()

  const entries: { url: string; lastModified?: string }[] = []

  // Static pages
  const staticPaths = [
    '/',
    '/about-us',
    '/contact-us',
    '/visit-visa',
    '/work-permit',
    '/skilled-migration',
    '/job-seeker-visa',
    '/working-holiday',
    '/success-stories',
  ]
  for (const p of staticPaths) entries.push({ url: `${siteUrl}${p}` })

  // Dynamic collections from WP
  const [visitVisas, workPermits, skilledMigrations, jobSeekers, workingHoliday, posts] = await Promise.all([
    fetchVisitVisas(),
    fetchWorkPermits(),
    fetchSkilledMigrations(),
    fetchJobSeekerVisas(),
    fetchWorkingHolidayVisas(),
    fetchPostsRest(100),
  ])

  for (const it of visitVisas) entries.push({ url: `${siteUrl}/visit-visa/${it.slug}` })
  for (const it of workPermits) entries.push({ url: `${siteUrl}/work-permit/${it.slug}` })
  for (const it of skilledMigrations) entries.push({ url: `${siteUrl}/skilled-migration/${it.slug}` })
  for (const it of jobSeekers) entries.push({ url: `${siteUrl}/job-seeker-visa/${it.slug}` })
  for (const it of workingHoliday) entries.push({ url: `${siteUrl}/working-holiday/${it.slug}` })
  for (const p of posts) entries.push({ url: `${siteUrl}/posts/${p.slug}` })

  return entries
}


