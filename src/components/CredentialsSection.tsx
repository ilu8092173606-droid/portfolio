import { FormEvent, useEffect, useState } from 'react'
import { certificates, safeAssetUrl } from '../data/site'
import { loadPrivateDocuments, unlockDocuments } from '../data/portfolioStore'

type PrivateDocument = { id: string; title: string; date: string; filename: string }

export default function CredentialsSection() {
  const staticHosting = import.meta.env.VITE_STATIC_HOSTING === 'true'
  const [password, setPassword] = useState('')
  const [documents, setDocuments] = useState<PrivateDocument[] | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (staticHosting) return
    loadPrivateDocuments().then((items) => { if (items) setDocuments(items) })
  }, [staticHosting])

  async function submit(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError('')
    const result = await unlockDocuments(password)
    if (!result.ok) { setError(result.error || 'That password was not accepted.'); setBusy(false); return }
    const items = await loadPrivateDocuments()
    setDocuments(items || []); setPassword(''); setBusy(false)
  }

  return <section id="credentials" className="credentials-section">
    <div className="section-shell">
      <div className="reveal"><p className="section-label">§ 08 — Credentials</p><h2 className="section-title">Certificates{staticHosting ? '.' : ' & documents.'}</h2><p className="section-copy">{staticHosting ? 'Public certificates and credentials.' : 'Certificates are public. Private documents are available after password verification.'}</p></div>
      <div className={`credential-groups${staticHosting ? ' credential-groups--public-only' : ''}`}>
        <section className="credential-panel reveal" aria-labelledby="certificate-heading">
          <p className="section-label">PUBLIC</p><h3 id="certificate-heading">Certificates</h3>
          {certificates.filter((item) => safeAssetUrl(item.url)).length ? <div className="credential-list">{certificates.filter((item) => safeAssetUrl(item.url)).map((item) => <article key={item.id}><div><h4>{item.title}</h4><p>{item.issuer}{item.date ? ` · ${item.date}` : ''}</p></div><a href={safeAssetUrl(item.url) || undefined} target="_blank" rel="noopener noreferrer">View certificate ↗</a></article>)}</div> : <p className="credential-empty">Certificates will appear here when added.</p>}
        </section>
        {!staticHosting && <section className="credential-panel reveal" aria-labelledby="documents-heading">
          <p className="section-label">PASSWORD REQUIRED</p><h3 id="documents-heading">Documents</h3>
          {documents === null ? <><p className="credential-copy">Enter the access password to view and open private documents.</p><form className="credential-unlock" onSubmit={submit}><label className="studio-field"><span>Access password</span><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required /></label>{error && <p className="studio-error" role="alert">{error}</p>}<button className="btn-primary" type="submit" disabled={busy}>{busy ? 'Checking…' : 'Unlock documents'}</button></form></> : documents.length ? <div className="credential-list">{documents.map((item) => <article key={item.id}><div><h4>{item.title}</h4><p>{item.date}</p></div><a href={`/admin/api.php?action=document-download&id=${encodeURIComponent(item.id)}`} target="_blank" rel="noopener noreferrer">Open document ↗</a></article>)}</div> : <p className="credential-empty">No private documents have been added yet.</p>}
        </section>}
      </div>
    </div>
  </section>
}
