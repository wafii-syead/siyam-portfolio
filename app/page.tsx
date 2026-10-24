import { headers } from 'next/headers';
import Portfolio from '@/components/portfolio';
import { contactConfig, allowedOrigins } from '@/lib/contact';
import { identity, socialLinks } from '@/lib/content';
import { siteUrl } from '@/lib/site-url';
export const dynamic = 'force-dynamic';
export default async function Home() {
  const nonce = (await headers()).get('x-nonce') || undefined;
  const url = siteUrl();
  const person = { '@context': 'https://schema.org', '@type': 'Person', name: identity.name, jobTitle: identity.roles, worksFor: { '@type': 'Organization', name: identity.employer.name, url: identity.employer.url }, sameAs: socialLinks.map(s => s.url), ...(url ? { url, image: `${url}/images/portrait.webp` } : {}) };
  return <><script type="application/ld+json" nonce={nonce} dangerouslySetInnerHTML={{ __html: JSON.stringify(person).replace(/</g, '\\u003c') }} /><Portfolio contactEnabled={Boolean(contactConfig()) && allowedOrigins(process.env).size > 0} year={new Date().getFullYear()} /></>;
}
