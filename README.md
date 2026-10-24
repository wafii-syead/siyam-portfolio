# Shariyar Siyam — Vercel portfolio

A complete Next.js + TypeScript portfolio with an animated interface and a server-side contact API. Your two real portraits and eight Behance project covers are included. You do not need a separate backend server.

## See the design immediately

Open **PREVIEW.html** in Chrome, Edge, Safari, or Firefox. It contains its own images, fonts, styles, and UI code. This is an offline design preview: it uses your social links for contact. Deploy the Next.js project below to use the backend.

## Run the real project

Install Node.js 22 or newer. Open a terminal in the folder containing `package.json`:

```bash
npm ci
npm run dev
```

Open http://localhost:4173. For a production build:

```bash
npm run build
npm start
```

The homepage works without any account credentials. The email form stays hidden until valid server configuration is present. Facebook and Instagram contact links remain available.

## Put it on Vercel

1. Unzip this package and put the contents of `siyam-portfolio` in a GitHub repository. Include `package-lock.json` and `.gitignore`. Do not upload `node_modules`, `.next`, or private `.env` files.
2. In your Vercel dashboard, create a new project and import that repository.
3. Select **Next.js**. The root directory must contain `package.json`. Keep the default output directory. The included `vercel.json` specifies `npm ci` and `npm run build`.
4. Deploy. Both the website and `/api/contact` are part of this one deployment.
5. Copy the resulting HTTPS site origin into `SITE_URL` in the project's environment variables, for example `https://your-real-project.vercel.app`. Use the actual URL, with no path. Redeploy so canonical links, sitemap, and sharing metadata use the right address.
6. To activate email, configure the variables in the next section and redeploy. Without them, the site intentionally uses social contact.

This package has not been uploaded to or deployed in your Vercel account. No account credentials or API keys are included.

## Activate the contact backend

Create a Resend account, verify a sending domain you control, and create a sending API key. Create an Upstash Redis database for the shared rate limiter. These services have their own account, usage, and billing settings; choose the appropriate plans in their dashboards.

In Vercel → your project → Settings → Environment Variables, add:

| Variable | What to enter |
|---|---|
| `SITE_URL` | The exact HTTPS origin of your live portfolio. |
| `RESEND_API_KEY` | Your Resend API key. Keep it server-only. |
| `CONTACT_FROM_EMAIL` | A plain email address on your verified sending domain. Do not include a display name. |
| `CONTACT_TO_EMAIL` | The inbox where you want project enquiries delivered. |
| `UPSTASH_REDIS_REST_URL` | The HTTPS REST endpoint shown for your Redis database. |
| `UPSTASH_REDIS_REST_TOKEN` | That database's REST token. |
| `RATE_LIMIT_SECRET` | A random secret, at least 32 characters. |
| `CONTACT_ALLOWED_ORIGINS` | Optional comma-separated extra exact origins, such as a `www` domain. Never use `*`. |

Generate the rate-limit secret locally:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

For local development, copy `.env.example` to `.env.local`, fill in your own values, and restart the dev server. Do not paste secrets into the source files. Never give these variables a `NEXT_PUBLIC_` prefix.

Vercel's exact deployment URL and production domain are also accepted when its automatic system environment variables are available. You can choose separate credentials and an inbox you control for Preview deployments.

After configuration, submit one brief yourself and confirm it arrives. The UI reports **accepted for email delivery** only after Resend returns an acceptance ID. Acceptance is not a guarantee that the recipient inbox delivered the message; check the provider dashboard if an email is missing. No live email was sent during development.

## What the backend does

- `POST /api/contact`, implemented in `app/api/contact/route.ts` and `lib/contact.ts`.
- Validates strings, required fields, email format, service values, and lengths on the server.
- Caps request bodies at 16 KB, including streamed bodies with a misleading content length.
- Requires an exact allowed Origin and JSON content. Rejects cross-site fetches.
- Uses a honeypot, a shared atomic Redis limiter, and an email-provider idempotency key.
- Limits requests to 5 per IP per 10 minutes, 3 per email per hour, and 50 total per hour. These limits are intentionally conservative and are defined in `lib/contact.ts`.
- Fails closed if the rate-limit service is unavailable. There is no in-memory production fallback.
- Sends messages as plain text to the configured inbox. Does not log message bodies or provider credentials.
- Stores short-lived HMAC hashes for rate limits, not raw IP addresses or email addresses, in Redis. Enquiry content goes to the mail provider and configured inbox.
- Uses no visitor accounts, cookies, public uploads, or admin dashboard. Content is edited in source files.

Use a dedicated Redis database, or change the `siyam:contact:` key prefix if you share a database with another copy of this project.

## Edit your content

| Change | File |
|---|---|
| Name, roles, biography, social links, services, projects, FAQs | `lib/content.ts` |
| Layout and interactions | `components/portfolio.tsx` |
| Contact form labels and states | `components/contact-form.tsx` |
| Colors, spacing, typography, responsive styles | `app/globals.css` |
| Search title, description, social metadata | `app/layout.tsx` |
| Social sharing image | `app/opengraph-image.tsx` |
| Portraits and project covers | `public/images/` |
| Form validation, delivery, spam limits | `lib/contact.ts` |

The additional Facebook page is configurable but hidden because its ownership/role was not supplied. Testimonials and insights render only when their arrays contain real content. The Canva layout illustration is explicitly labeled as an illustration. Project covers link to the original Behance pages, and no client results or experience statistics have been invented.

## Security and rendering notes

`proxy.ts` generates a new script nonce for each page request. Production pages are dynamically rendered and not shared in a CDN HTML cache, so one request's nonce is not reused. Scripts use a nonce-based Content Security Policy. Inline styles are allowed because Next Image and Motion set element styles; inline scripts are not generally allowed. Production prohibits embedding in frames. Development permits same-origin frames and inline/eval scripts for Next.js hot reload. Those allowances are not used in the production script policy.

Vercel provides HTTPS. The project also sets HSTS in production, MIME-sniffing protection, a referrer policy, frame protection, and restricted camera/microphone/geolocation permissions. This is a hardened starting configuration, not a claim that any website is unhackable.

## Verification

```bash
npm test
npm run build
npm run typecheck
npm run test:render
npm audit --omit=dev
```

Read **VERIFICATION.md** for completed checks and the remaining browser-validation limits. The first desktop render was inspected, but full interactive and responsive browser verification could not be completed in this environment. Check navigation, filters, gallery, keyboard focus, motion controls, mobile menu, and the live configured form before announcing the site.

## Official setup references

- Next.js route handlers: https://nextjs.org/docs/app/getting-started/route-handlers
- Next.js Content Security Policy: https://nextjs.org/docs/app/guides/content-security-policy
- Vercel environment variables: https://vercel.com/docs/environment-variables
- Resend sending API: https://resend.com/docs/api-reference/emails/send-email
- Upstash REST API: https://upstash.com/docs/redis/features/restapi

Artwork and photographs remain the property of their respective rights holders. Included typography is distributed under the SIL Open Font License. Font packages include their license notices; the sharing-image font license is also in `public/fonts/OFL.txt`.
