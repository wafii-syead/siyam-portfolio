import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/site-url';
export default function robots(): MetadataRoute.Robots { const url = siteUrl(); return { rules: { userAgent: '*', ...(process.env.VERCEL_ENV === 'preview' ? { disallow: '/' } : { allow: '/', disallow: '/api/' }) }, ...(url ? { sitemap: `${url}/sitemap.xml` } : {}) }; }
