export const siteProfile = {
  name: 'Bittu Kumar',
  title: 'AI + Robotics + Technology Generalist',
  secondaryTitle: 'Builder / Experimental Technologist',
  tagline: 'I build and experiment with intelligent software, AI systems, automation, robotics and connected physical systems.',
  email: '', location: '', resumeUrl: '', profilePhoto: '',
  links: { linkedin: '', github: '', instagram: '', youtube: '', huggingface: '', portfolio: '' },
}

// Keep personal details in one place. Leave values empty until they are ready to publish.
export const CONTACT: {
  EMAIL: string; PHONE: string; LINKEDIN_URL: string; GITHUB_URL: string; INSTAGRAM_URL: string; YOUTUBE_URL: string; HUGGINGFACE_URL: string; PORTFOLIO_URL: string; RESUME_URL: string
} = {
  EMAIL: '',
  PHONE: '',
  LINKEDIN_URL: '',
  GITHUB_URL: '',
  INSTAGRAM_URL: '',
  YOUTUBE_URL: '',
  HUGGINGFACE_URL: '',
  PORTFOLIO_URL: '',
  RESUME_URL: '',
}

export function safeExternalUrl(value: string): string | null {
  if (typeof value !== 'string') return null
  try { const url = new URL(value); return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : null } catch { return null }
}

export function safeAssetUrl(value: string): string | null {
  if (typeof value !== 'string') return null
  if (value.startsWith('/') && !value.startsWith('//') && !value.split('/').includes('..')) return value
  return safeExternalUrl(value)
}

export function safeMailto(value: string): string | null {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? `mailto:${value}` : null
}

export function safeTel(value: string): string | null {
  return /^\+?[0-9][0-9 ()-]{5,20}$/.test(value) ? `tel:${value.replace(/[ ()-]/g, '')}` : null
}

export const education = [
  { title: 'Bachelor of Computer Applications (BCA)', institution: 'Vivekananda Global University', detail: 'Online / Distance Learning · Expected graduation: December 2029' },
  { title: 'Bachelor of Technology in Mechanical Engineering', institution: 'Guru Nanak Dev Engineering College, Ludhiana, Punjab', detail: '2022–2026 · Dropped out during 2nd year' },
]

export const training = [
  { title: '4-week CNC Training', institution: "Science & Technology Entrepreneurs' Park (STEP-GNDEC), Guru Nanak Dev Engineering College", date: '05/06/2024 – 05/07/2024', certificate: true },
  { title: 'Web Wizards — Peer-to-Peer Web Development Workshop', institution: 'Causmic Club, Guru Nanak Dev Engineering College', date: '15/05/2023 · Duration: 1 week', certificate: true },
]

export interface CertificateItem { id: string; title: string; issuer: string; date: string; url: string }
export const certificates: CertificateItem[] = []

export interface MediaItem {
  type: 'image' | 'video' | 'youtube' | 'cloudinary' | 'diagram'
  provider?: 'local' | 'cloudinary' | 'youtube'
  source?: string
  poster?: string
  alt: string
  title?: string
  autoplay?: boolean
  muted?: boolean
  loop?: boolean
  playsInline?: boolean
  status?: 'available' | 'placeholder'
}

export const mediaConfig = {
  roboticArm: { photos: [] as MediaItem[], pythonUi: [] as MediaItem[], cad: [] as MediaItem[], electronics: [] as MediaItem[], demo: [] as MediaItem[] },
  bharti: [] as MediaItem[], profileo: [] as MediaItem[], primecoat: [] as MediaItem[], dropzone: [] as MediaItem[], videoEditing: [] as MediaItem[],
}

// Add only verified public URLs here. Project UI never contains temporary links.
export const PROJECT_GITHUB_URLS: Record<string, string> = {}
export const PROJECT_DEMO_URLS: Record<string, string> = { primecoat: 'https://primecoat.info' }
export const VIDEO_URLS: Record<string, string> = {}
export const CLOUDINARY_URLS: Record<string, string> = {}
