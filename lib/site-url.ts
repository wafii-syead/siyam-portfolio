export function siteUrl(): string | undefined {
  const raw = process.env.SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined);
  if (!raw) return undefined;
  try { const url = new URL(raw); return ['https:', 'http:'].includes(url.protocol) ? url.origin : undefined; } catch { return undefined; }
}
