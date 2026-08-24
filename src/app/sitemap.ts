import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteUrl()
  const lastModified = new Date()

  return [
    '/',
    '/jobs',
    '/remote-jobs',
    '/companies',
    '/categories',
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified,
  }))
}
