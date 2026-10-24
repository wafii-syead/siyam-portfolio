import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
export const alt = 'Shariyar Siyam — Graphic Designer, UI/UX Designer, Canva Expert';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export default async function Image() {
  const font = await readFile(join(process.cwd(), 'public/fonts/display.woff'));
  return new ImageResponse(<div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#FFF6E8', color: '#111', padding: '55px 70px', fontFamily: 'Display' }}><div style={{ display: 'flex', fontSize: 27, letterSpacing: 2 }}>GRAPHIC DESIGNER · UI/UX DESIGNER · CANVA EXPERT</div><div style={{ display: 'flex', flexDirection: 'column', marginTop: 35, fontSize: 132, lineHeight: 0.92, letterSpacing: -2 }}><span>SHARIYAR</span><span style={{ color: '#FF4D00' }}>SIYAM.</span></div><div style={{ display: 'flex', fontSize: 31, marginTop: 35 }}>BRANDS & DIGITAL EXPERIENCES THAT STAND OUT.</div><div style={{ position: 'absolute', right: 90, top: 140, width: 260, height: 260, borderRadius: 130, background: '#FFD000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 240, transform: 'rotate(12deg)' }}><svg width="190" height="190" viewBox="0 0 100 100"><path d="M50 4v92M4 50h92M17 17l66 66M17 83l66-66M30 8l40 84M8 30l84 40M8 70l84-40M30 92 70 8" stroke="#111111" strokeWidth="6"/></svg></div></div>, { ...size, fonts: [{ name: 'Display', data: font, weight: 800, style: 'normal' }] });
}
