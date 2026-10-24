// Local production-render smoke check; run after npm run build.
// Uses the installed, pinned Next.js test mocks. Opens no network listener.
process.env.NODE_ENV = 'production';
const assert = require('node:assert/strict');
const next = require('next');
const { createRequestResponseMocks } = require('next/dist/server/lib/mock-request');
const { Socket } = require('node:net');
const { existsSync } = require('node:fs');
const { gzipSync } = require('node:zlib');
(async () => {
  const app = next({ dev: false, dir: process.cwd(), hostname: 'localhost', port: 4173 });
  await app.prepare();
  const handler = app.getRequestHandler();
  async function render() {
    const chunks = [];
    const { req, res } = createRequestResponseMocks({ url: '/', method: 'GET', socket: new Socket(), headers: { host: 'localhost:4173' }, resWriter: c => { chunks.push(Buffer.from(c)); return true; } });
    await handler(req, res);
    return { html: Buffer.concat(chunks).toString(), res };
  }
  try {
    const first = await render(), second = await render();
    assert.equal(first.res.statusCode, 200);
    assert(first.html.includes('</html>') && first.html.includes('I DESIGN BRANDS'));
    const csp = first.res.getHeader('content-security-policy');
    const nonce = csp.match(/'nonce-([^']+)'/)[1];
    assert(!csp.includes("script-src 'self' 'unsafe-inline'"));
    const scripts = first.html.match(/<script\b[^>]*>/g) || [];
    assert(scripts.length > 2);
    for (const tag of scripts) assert(tag.includes(`nonce="${nonce}"`), 'Script without the request nonce: ' + tag);
    const secondNonce = second.res.getHeader('content-security-policy').match(/'nonce-([^']+)'/)[1];
    assert.notEqual(nonce, secondNonce, 'Each request needs a fresh nonce');
    assert.equal(first.res.getHeader('x-frame-options'), 'DENY');
    assert.equal(first.res.getHeader('x-content-type-options'), 'nosniff');
    assert(first.res.getHeader('cache-control').includes('no-store'));
    assert.equal((first.html.match(/<h1\b/g) || []).length, 1);
    assert(!first.html.includes('href="#"'));
    const assets = [...new Set([...first.html.matchAll(/(?:src|href)="(\/_next\/static\/[^"?]+)/g)].map(m => m[1]))];
    for (const asset of assets) assert(existsSync('.next/' + asset.slice('/_next/'.length)), 'Missing built asset: ' + asset);
    console.log(JSON.stringify({ status: 'passed', render: 'production', scriptNonces: scripts.length, nonceIsUnique: true, builtAssetsPresent: assets.length, oneH1: true, noEmptyAnchorLinks: true, privateHTML: true, htmlBytes: Buffer.byteLength(first.html), htmlGzipBytes: gzipSync(first.html).length }, null, 2));
  } finally { await app.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
