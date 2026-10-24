# Verification and handover

## Passed

- `npm run build`: production Next.js build completed, including the homepage, contact API, icon, sharing image, sitemap, and robots routes.
- `npm run typecheck`: no TypeScript errors.
- `npm test`: 21 backend tests passed. These cover validation, honeypot rejection, body limits, Origin checks, rate-store failures, rate limits, mail failure, acceptance, idempotency, and privacy. Providers were mocked; no live messages were sent.
- `npm run test:render`: production server rendering returned HTTP 200. All 11 script tags carried the request nonce, consecutive requests received different nonces, all 8 referenced built assets existed, and the response carried a private/no-store policy and production frame/MIME protections. The generated page contains one H1 and no empty anchor links.
- `npm audit --omit=dev --audit-level=high`: reported zero known vulnerabilities at the time of checking. This is a point-in-time package audit, not a security guarantee.
- All ten included WebP image files exist. The hero and the first project covers loaded in the initial desktop browser inspection.
- The sharing image was generated and visually inspected.
- The standalone `PREVIEW.html` was compiled from the same portfolio component with embedded images, fonts, CSS, and JavaScript. Its initial content is also server rendered.

## Observed size and performance facts

- Production server-rendered homepage: approximately 67 KB of HTML, approximately 11.1 KB compressed with gzip. Nonce randomness slightly changes compressed byte counts.
- Ten local WebP images combined: 1,137,208 bytes, approximately 1.08 MiB. The live Next.js site serves responsive optimized variants and lazy-loads images below the hero.
- Standalone design preview: approximately 3.85 MiB because it embeds all artwork, fonts, and UI code. This is not the live website's initial transfer size.
- No Lighthouse score or real-user Core Web Vitals result is claimed. Measure the actual Vercel deployment after domain and email setup.

## Browser checks that remain incomplete

The initial desktop hero and work layout were visually inspected. The first development-preview attempt did not initialize the React filter/gallery controls. Its rendered markup included an unnonced Next.js hot-reload script, so the development-only CSP was adjusted to accommodate hot reload. Production retains nonce-protected scripts, and its complete server rendering subsequently passed the local checks above.

During the preview restart, the browser URL security policy rejected further access. No attempt was made to bypass that block. As a result, the development adjustment and live client interactions have not been fully rechecked in a browser. The standalone preview also has not been browser-verified.

Before public launch, verify at 360, 390, 768, 1024, and 1440 pixels, plus 320-pixel reflow:

1. Navigation, hero layout, all project covers, and absence of horizontal overflow.
2. All project filters; artwork opening, next/previous controls, Escape closing, and focus return.
3. Mobile-menu opening/closing and keyboard focus containment.
4. FAQ expansion, service preselection, and normal anchor navigation.
5. The ribbon pause control and Reduce motion toggle; also test the operating-system reduced-motion preference.
6. Contact required-field errors, sending state, rejected-request state, provider error state, and success acceptance. Confirm an actual email reaches your configured inbox.
7. The browser console, production CSP, sharing image, canonical URL, and sitemap on your actual domain.

## Configuration still needed from the owner

- A Vercel project and deployment domain.
- A verified Resend sender, API key, and real recipient inbox.
- An Upstash Redis REST URL/token and a random rate-limit secret.
- Optional: the exact original Anisol project URL/assets, real testimonials, or authored insights.

The email form is hidden until required server configuration is present. Social contact links work independently. This archive has not been deployed to the owner's Vercel account.
