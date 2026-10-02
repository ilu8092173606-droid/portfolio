import type { ReactNode } from 'react'
import { safeExternalUrl } from '../data/site'

const icons: Record<string, ReactNode> = {
  LinkedIn: <><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 10v7M8 7v.01M12 17v-4a3 3 0 0 1 6 0v4M12 10v7" stroke="var(--bg)" strokeWidth="2"/></>,
  GitHub: <path d="M12 2.8a9.2 9.2 0 0 0-2.9 17.93c.46.08.63-.2.63-.45v-1.6c-2.56.56-3.1-1.08-3.1-1.08-.42-1.06-1.02-1.34-1.02-1.34-.83-.57.06-.56.06-.56.92.06 1.4.95 1.4.95.82 1.4 2.16 1 2.69.76.08-.6.32-1 .59-1.23-2.04-.23-4.19-1.02-4.19-4.54 0-1 .36-1.82.95-2.47-.1-.23-.41-1.17.09-2.43 0 0 .77-.25 2.53.94a8.8 8.8 0 0 1 4.6 0c1.75-1.19 2.52-.94 2.52-.94.5 1.26.19 2.2.1 2.43.58.65.94 1.47.94 2.47 0 3.53-2.15 4.3-4.2 4.53.33.28.62.83.62 1.67v2.47c0 .25.17.54.64.45A9.2 9.2 0 0 0 12 2.8Z"/>,
  Instagram: <><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/></>,
  YouTube: <><path d="M22 12s0-3.4-.44-5.03a2.5 2.5 0 0 0-1.76-1.76C18.17 4.78 12 4.78 12 4.78s-6.17 0-7.8.43a2.5 2.5 0 0 0-1.76 1.76C2 8.6 2 12 2 12s0 3.4.44 5.03a2.5 2.5 0 0 0 1.76 1.76c1.63.43 7.8.43 7.8.43s6.17 0 7.8-.43a2.5 2.5 0 0 0 1.76-1.76C22 15.4 22 12 22 12Z"/><path d="m10 15 5-3-5-3v6Z" stroke="var(--bg)" strokeWidth="1.5"/></>,
  'Hugging Face': <><circle cx="12" cy="12" r="9"/><path d="M8.5 11h.01M15.5 11h.01M8.5 15c1 .9 2.17 1.35 3.5 1.35s2.5-.45 3.5-1.35M7.5 7.5l1.5 1M16.5 7.5l-1.5 1"/></>,
}

export default function SocialLinks({ links, className = '' }: { links: [string, string][]; className?: string }) {
  return <div className={className}>{links.map(([label, href]) => {
    const safeHref = safeExternalUrl(href); if (!safeHref) return null
    return <a href={safeHref} key={label} target="_blank" rel="noopener noreferrer" aria-label={label} title={label}>
      <svg aria-hidden="true" viewBox="0 0 24 24" width="19" height="19" fill={label === 'LinkedIn' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{icons[label] || <circle cx="12" cy="12" r="8"/>}</svg><span>{label}</span>
    </a>
  })}</div>
}
