import type { SVGProps } from 'react';
type Props = SVGProps<SVGSVGElement> & { name?: string };
export function Icon({ name = 'arrow', ...props }: Props) {
  const paths: Record<string, React.ReactNode> = {
    arrow: <><path d="M4 12h15M13 5l7 7-7 7" /></>,
    diagonal: <><path d="M5 19 19 5M5 5h14v14" /></>,
    down: <><path d="M12 3v18m-7-7 7 7 7-7" /></>,
    up: <><path d="M12 21V3m-7 7 7-7 7 7" /></>,
    spark: <><path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 2Z" /></>,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    cursor: <><path d="m4 2 5 19 4-7 7-4L4 2Zm9 12 6 7" /></>,
    layers: <><path d="m12 2 10 6-10 6L2 8l10-6Zm-9 11 9 5 9-5M3 18l9 5 9-5" /></>,
    poster: <><rect x="4" y="2" width="16" height="20" rx="1" /><path d="M8 7h8M8 11h6M8 17h8" /></>,
    play: <><rect x="2" y="4" width="20" height="16" rx="4" /><path d="m10 8 6 4-6 4V8Z" /></>,
    plus: <><path d="M12 4v16M4 12h16" /></>,
    close: <><path d="m5 5 14 14M5 19 19 5" /></>,
    menu: <><path d="M3 7h18M3 17h18" /></>,
    check: <><path d="m4 12 5 5L20 6" /></>,
    pause: <><path d="M9 5v14M15 5v14" /></>,
    resume: <><path d="m8 4 12 8-12 8V4Z" /></>,
  };
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name] || paths.spark}</svg>;
}
export function Asterisk({ className = '' }: { className?: string }) { return <svg className={className} viewBox="0 0 100 100" fill="none" aria-hidden="true"><path d="M50 4v92M4 50h92M17 17l66 66M17 83l66-66M30 8l40 84M8 30l84 40M8 70l84-40M30 92 70 8" stroke="currentColor" strokeWidth="6" /></svg>; }
export function Smile({ className = '' }: { className?: string }) { return <svg className={className} viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="48" fill="currentColor" /><g fill="none" stroke="#111" strokeWidth="5" strokeLinecap="round"><path d="M25 55c6 28 42 29 50 0M36 28l-2 12M63 28l-2 12" /></g></svg>; }
