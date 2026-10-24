import { createHmac } from 'node:crypto';
import { services } from './content';

type Env = Record<string, string | undefined>;
type ContactData = { name: string; email: string; service: string; message: string; budget: string; website: string; requestId: string };
type ContactConfig = { apiKey: string; from: string; to: string; redisUrl: string; redisToken: string; secret: string };
export type FieldErrors = Partial<Record<keyof ContactData, string>>;
const EMAIL = /^[^\s<>@\r\n]+@[^\s<>@\r\n]+\.[^\s<>@\r\n]+$/;
const MAX_BODY = 16_384;
const ID = /^[a-zA-Z0-9-]{16,80}$/;
const trim = (v: unknown) => typeof v === 'string' ? v.trim() : '';
export function contactConfig(env: Env = process.env): ContactConfig | null {
  const apiKey = trim(env.RESEND_API_KEY), from = trim(env.CONTACT_FROM_EMAIL), to = trim(env.CONTACT_TO_EMAIL);
  const redisUrl = trim(env.UPSTASH_REDIS_REST_URL), redisToken = trim(env.UPSTASH_REDIS_REST_TOKEN), secret = trim(env.RATE_LIMIT_SECRET);
  if (!apiKey || !EMAIL.test(from) || !EMAIL.test(to) || !redisToken || secret.length < 32) return null;
  try { const u = new URL(redisUrl); if (u.protocol !== 'https:' || u.username || u.password || u.search || u.hash) return null; } catch { return null; }
  return { apiKey, from, to, redisUrl: redisUrl.replace(/\/$/, ''), redisToken, secret };
}
export function validateContact(input: unknown): { data?: ContactData; errors: FieldErrors } {
  const errors: FieldErrors = {};
  if (!input || typeof input !== 'object' || Array.isArray(input)) return { errors: { message: 'Send a valid project brief.' } };
  const p = input as Record<string, unknown>;
  const data: ContactData = { name: trim(p.name), email: trim(p.email).toLowerCase(), service: trim(p.service), message: trim(p.message), budget: trim(p.budget), website: trim(p.website), requestId: trim(p.requestId) };
  for (const key of Object.keys(data) as (keyof ContactData)[]) {
    if (p[key] !== undefined && typeof p[key] !== 'string') errors[key] = 'Use a text value.';
  }
  if (data.name.length < 2 || data.name.length > 80 || /[\r\n\x00-\x1f]/.test(data.name)) errors.name = 'Enter your name (2–80 characters).';
  if (data.email.length > 254 || !EMAIL.test(data.email)) errors.email = 'Enter a valid email address.';
  if (!services.some(s => s.id === data.service) && data.service !== 'other') errors.service = 'Choose a service.';
  if (data.message.length < 20 || data.message.length > 5000 || /[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(data.message)) errors.message = 'Use 20–5,000 characters for your project brief.';
  if (data.budget.length > 80 || /[\r\n\x00-\x1f]/.test(data.budget)) errors.budget = 'Keep the budget under 80 characters.';
  if (data.website.length || typeof p.website !== 'string') errors.website = 'Your submission could not be accepted.';
  if (!ID.test(data.requestId)) errors.requestId = 'Reload the page and try again.';
  return Object.keys(errors).length ? { errors } : { data, errors };
}
export function allowedOrigins(env: Env): Set<string> {
  const raw = [env.SITE_URL, ...(env.CONTACT_ALLOWED_ORIGINS || '').split(','), env.VERCEL_URL ? `https://${env.VERCEL_URL}` : undefined, env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined];
  if (!env.VERCEL && env.NODE_ENV !== 'production') raw.push('http://localhost:4173', 'http://127.0.0.1:4173');
  const origins = new Set<string>();
  for (const value of raw) {
    if (!value?.trim()) continue;
    try {
      const u = new URL(value.trim());
      const local = !env.VERCEL && ['localhost', '127.0.0.1', 'terminal.local'].includes(u.hostname);
      if ((u.protocol === 'https:' || (local && u.protocol === 'http:')) && !u.username && !u.password && u.pathname === '/' && !u.search && !u.hash) origins.add(u.origin);
    } catch { /* Invalid environment entries never broaden the origin policy. */ }
  }
  return origins;
}
const RATE_SCRIPT = `
local blocked = 0
local retry = 1
for i = 1, #KEYS do
  local count = redis.call('INCR', KEYS[i])
  local period = tonumber(ARGV[(i-1)*2+2])
  if count == 1 then redis.call('EXPIRE', KEYS[i], period) end
  local ttl = redis.call('TTL', KEYS[i])
  if ttl < 0 then redis.call('EXPIRE', KEYS[i], period); ttl = period end
  if count > tonumber(ARGV[(i-1)*2+1]) then
    blocked = 1
    retry = math.max(retry, ttl)
  end
end
return {blocked, retry}
`;
const hash = (secret: string, value: string) => createHmac('sha256', secret).update(value).digest('hex');
const json = (body: unknown, status: number, extra: Record<string, string> = {}) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...extra } });
async function readBody(request: Request): Promise<unknown> {
  const advertised = request.headers.get('content-length');
  if (advertised && Number(advertised) > MAX_BODY) throw new Error('too_large');
  if (!request.body) throw new Error('invalid_json');
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY) { await reader.cancel(); throw new Error('too_large'); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(size); let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
}
export async function handleContact(request: Request, env: Env = process.env, fetcher: typeof fetch = fetch): Promise<Response> {
  if (request.method !== 'POST') return json({ ok: false, error: 'Use POST.' }, 405, { Allow: 'POST' });
  const origin = request.headers.get('origin');
  if (!origin || !allowedOrigins(env).has(origin) || request.headers.get('sec-fetch-site') === 'cross-site') return json({ ok: false, error: 'This request is not allowed.' }, 403);
  if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') return json({ ok: false, error: 'Use application/json.' }, 415);
  const config = contactConfig(env);
  if (!config) return json({ ok: false, error: 'The project form is unavailable. Please use a social contact link.' }, 503);
  let body: unknown;
  try { body = await readBody(request); } catch (error) {
    const tooLarge = error instanceof Error && error.message === 'too_large';
    return json({ ok: false, error: tooLarge ? 'The project brief is too large.' : 'Send a valid project brief.' }, tooLarge ? 413 : 400);
  }
  const { data, errors } = validateContact(body);
  if (!data) return json({ ok: false, error: 'Please check the form fields.', errors }, 400);
  // Vercel supplies this header. Do not trust arbitrary forwarded headers on other hosts.
  const ip = env.VERCEL === '1' ? (request.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim() || 'unknown') : 'local-development';
  const keys = [`siyam:contact:ip:${hash(config.secret, ip)}`, `siyam:contact:email:${hash(config.secret, data.email)}`, 'siyam:contact:global'];
  try {
    const response = await fetcher(config.redisUrl, {
      method: 'POST', headers: { Authorization: `Bearer ${config.redisToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(['EVAL', RATE_SCRIPT, '3', ...keys, '5', '600', '3', '3600', '50', '3600']),
      cache: 'no-store', signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error('rate_store');
    const payload = await response.json() as { result?: [number, number]; error?: string };
    if (payload.error || !Array.isArray(payload.result) || payload.result.length !== 2 || ![0, 1].includes(payload.result[0]) || !Number.isFinite(payload.result[1])) throw new Error('rate_store');
    if (payload.result[0] === 1) return json({ ok: false, error: 'You’ve sent several requests. Please try again later or use a social link.' }, 429, { 'Retry-After': String(Math.max(1, Math.ceil(payload.result[1]))) });
  } catch {
    // Fail closed: a Redis outage must not remove spam protection.
    return json({ ok: false, error: 'The project form is temporarily unavailable. Please try again later or use a social link.' }, 503);
  }
  const service = services.find(s => s.id === data.service)?.title || 'Something else';
  const text = `Portfolio project enquiry\n\nName: ${data.name}\nEmail: ${data.email}\nService: ${service}\nBudget: ${data.budget || 'Not specified'}\n\nProject brief:\n${data.message}`;
  const idempotencyKey = hash(config.secret, `${data.requestId}\n${data.email}\n${text}`);
  try {
    const response = await fetcher('https://api.resend.com/emails', {
      method: 'POST', headers: { Authorization: `Bearer ${config.apiKey}`, 'Content-Type': 'application/json', 'Idempotency-Key': `portfolio-${idempotencyKey}` },
      body: JSON.stringify({ from: config.from, to: [config.to], reply_to: data.email, subject: `Portfolio enquiry: ${service}`, text }),
      cache: 'no-store', signal: AbortSignal.timeout(10000),
    });
    const result = await response.json() as { id?: string };
    if (!response.ok || typeof result.id !== 'string' || !result.id) throw new Error('delivery');
    return json({ ok: true, message: 'Your brief has been accepted for email delivery. Thank you for getting in touch.' }, 200);
  } catch {
    // Never log the request body, provider response, personal information, or credentials.
    return json({ ok: false, error: 'We could not confirm email acceptance. Your brief is still here; you can retry or contact me through a social link.' }, 502);
  }
}
