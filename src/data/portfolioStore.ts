import { projects, type Project } from './projects'
import { CONTACT, certificates, education, siteProfile, training } from './site'

const STORAGE_KEY = 'bittu-portfolio-studio-v1'
const AUTH_KEY = 'bittu-portfolio-studio-auth-v1'
const SESSION_KEY = 'bittu-portfolio-studio-session'
const API_URL = '/admin/api.php'

export type StudioSnapshot = { profile: typeof siteProfile; contact: typeof CONTACT; projects: Project[]; education: typeof education; training: typeof training; certificates: typeof certificates }

export function hydratePortfolio() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return
    const data = JSON.parse(saved) as StudioSnapshot
    Object.assign(siteProfile, data.profile || {})
    Object.assign(CONTACT, data.contact || {})
    if (Array.isArray(data.projects)) { projects.splice(0, projects.length, ...data.projects) }
    if (Array.isArray(data.education)) education.splice(0, education.length, ...data.education)
    if (Array.isArray(data.training)) training.splice(0, training.length, ...data.training)
    if (Array.isArray(data.certificates)) certificates.splice(0, certificates.length, ...data.certificates)
  } catch { /* Ignore corrupt local browser data and use the checked-in portfolio. */ }
}

export function snapshotPortfolio(): StudioSnapshot {
  return { profile: { ...siteProfile, links: { ...siteProfile.links } }, contact: { ...CONTACT }, projects: JSON.parse(JSON.stringify(projects)) as Project[], education: JSON.parse(JSON.stringify(education)) as typeof education, training: JSON.parse(JSON.stringify(training)) as typeof training, certificates: JSON.parse(JSON.stringify(certificates)) as typeof certificates }
}

export function savePortfolio(snapshot: StudioSnapshot) {
  applyPortfolio(snapshot)
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshotPortfolio())); return true } catch { return false }
}

export function applyPortfolio(snapshot: StudioSnapshot) {
  Object.assign(siteProfile, snapshot.profile); Object.assign(CONTACT, snapshot.contact)
  projects.splice(0, projects.length, ...snapshot.projects)
  if (snapshot.education) education.splice(0, education.length, ...snapshot.education)
  if (snapshot.training) training.splice(0, training.length, ...snapshot.training)
  if (snapshot.certificates) certificates.splice(0, certificates.length, ...snapshot.certificates)
}

export function clearPortfolioOverrides() { localStorage.removeItem(STORAGE_KEY) }
export function hasStudioPassword() { return Boolean(localStorage.getItem(AUTH_KEY)) }
export function isStudioAuthenticated() { return sessionStorage.getItem(SESSION_KEY) === 'true' }
export function endStudioSession() { sessionStorage.removeItem(SESSION_KEY) }

async function digest(value: string) {
  const data = new TextEncoder().encode(value)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash)).map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

export async function setStudioPassword(password: string) { localStorage.setItem(AUTH_KEY, await digest(password)); sessionStorage.setItem(SESSION_KEY, 'true') }
export async function loginStudio(password: string) {
  const matches = (await digest(password)) === localStorage.getItem(AUTH_KEY)
  if (matches) sessionStorage.setItem(SESSION_KEY, 'true')
  return matches
}

/** A PHP API is copied into dist/admin at build time for shared, hosted editing.
 * The local studio remains useful in Vite/Figma previews where PHP is unavailable. */
async function api<T>(action: string, body?: unknown): Promise<T | null> {
  try {
    const response = await fetch(`${API_URL}?action=${action}`, {
      method: body ? 'POST' : 'GET',
      credentials: 'same-origin',
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    })
    const type = response.headers.get('content-type') || ''
    if (!type.includes('application/json')) return null
    return await response.json() as T
  } catch { return null }
}

export type HostedStatus = { available: boolean; authenticated: boolean; configured: boolean }
export async function hostedStatus(): Promise<HostedStatus> {
  return (await api<HostedStatus>('status')) || { available: false, authenticated: false, configured: false }
}
export async function loadHostedPortfolio(): Promise<StudioSnapshot | null> {
  const result = await api<{ data?: StudioSnapshot }>('content')
  return result?.data || null
}
export async function hostedLogin(username: string, password: string) {
  const result = await api<{ ok?: boolean; error?: string }>('login', { username, password })
  return result || { ok: false, error: 'The hosted admin service is unavailable.' }
}
export async function hostedLogout() { await api('logout', {}) }
export async function changeHostedPassword(kind: 'admin' | 'documents', currentPassword: string, newPassword: string, confirmPassword: string) {
  return (await api<{ ok?: boolean; error?: string }>('change-password', { kind, currentPassword, newPassword, confirmPassword })) || { ok: false, error: 'The password service is unavailable.' }
}
export async function unlockDocuments(password: string) { return (await api<{ ok?: boolean; error?: string }>('document-unlock', { password })) || { ok: false, error: 'The document service is unavailable.' } }
export async function loadPrivateDocuments() { return (await api<{ documents?: { id: string; title: string; date: string; filename: string }[] }>('document-list'))?.documents || null }
export async function uploadPrivateDocument(file: File, title: string, date: string) {
  const form = new FormData(); form.append('file', file); form.append('title', title); form.append('date', date)
  try { const response = await fetch(`${API_URL}?action=document-upload`, { method: 'POST', credentials: 'same-origin', body: form }); return await response.json() as { ok?: boolean; error?: string } }
  catch { return { ok: false, error: 'The private document service is unavailable.' } }
}
export async function saveHostedPortfolio(snapshot: StudioSnapshot) {
  const result = await api<{ ok?: boolean; error?: string }>('save', { data: snapshot })
  return result || { ok: false, error: 'The hosted admin service is unavailable.' }
}
export async function uploadHostedFile(file: File) {
  try {
    const form = new FormData(); form.append('file', file)
    const response = await fetch(`${API_URL}?action=upload`, { method: 'POST', credentials: 'same-origin', body: form })
    return await response.json() as { ok?: boolean; url?: string; error?: string }
  } catch { return { ok: false, error: 'The hosted upload service is unavailable.' } }
}
