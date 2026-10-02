import { FormEvent, useState } from 'react'
import type { StudioSnapshot } from '../data/portfolioStore'
import { uploadHostedFile, uploadPrivateDocument } from '../data/portfolioStore'

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="studio-field"><span>{label}</span><input value={value} onChange={(event) => onChange(event.target.value)} /></label>
}

export default function CredentialManager({ data, hosted, onChange, setNotice }: { data: StudioSnapshot; hosted: boolean; onChange: (next: StudioSnapshot) => void; setNotice: (value: string) => void }) {
  const [title, setTitle] = useState(''); const [issuer, setIssuer] = useState(''); const [date, setDate] = useState(''); const [documentTitle, setDocumentTitle] = useState(''); const [documentDate, setDocumentDate] = useState(''); const [busy, setBusy] = useState(false)
  async function addCertificate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = event.currentTarget; const file = (form.elements.namedItem('certificate-file') as HTMLInputElement).files?.[0]
    if (!hosted) return setNotice('Certificate uploads need the hosted PHP service.')
    if (!file) return setNotice('Choose a certificate file first.')
    setBusy(true); const result = await uploadHostedFile(file)
    if (!result.ok || !result.url) { setNotice(result.error || 'Certificate upload failed.'); setBusy(false); return }
    onChange({ ...data, certificates: [...(data.certificates || []), { id: crypto.randomUUID(), title, issuer, date, url: result.url }] })
    setTitle(''); setIssuer(''); setDate(''); form.reset(); setNotice('Certificate added to the public credentials section.'); setBusy(false)
  }
  async function addDocument(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = event.currentTarget; const file = (form.elements.namedItem('private-document-file') as HTMLInputElement).files?.[0]
    if (!hosted) return setNotice('Private document uploads need the hosted PHP service.')
    if (!file) return setNotice('Choose a document first.')
    setBusy(true); const result = await uploadPrivateDocument(file, documentTitle, documentDate)
    setNotice(result.ok ? 'Private document uploaded. It will appear after the site password is entered.' : result.error || 'Document upload failed.')
    if (result.ok) { setDocumentTitle(''); setDocumentDate(''); form.reset() }
    setBusy(false)
  }
  return <><p className="section-label">Credentials</p><h1>Certificates & documents</h1><p className="studio-help">Certificates are public. Private uploads are stored outside the public URL path and served only after the shared password is verified.</p>
    <div className="studio-media-grid studio-credential-admin">
      <section><h2>Public certificates</h2><form className="studio-credential-form" onSubmit={addCertificate}><Field label="Certificate title" value={title} onChange={setTitle} /><Field label="Issuer" value={issuer} onChange={setIssuer} /><Field label="Date" value={date} onChange={setDate} /><label className="studio-upload">Choose PDF or image<input name="certificate-file" type="file" accept="application/pdf,image/*" required /></label><button className="btn-primary" type="submit" disabled={busy}>{busy ? 'Uploading…' : 'Add certificate'}</button></form>
      {data.certificates?.map((item) => <article className="studio-credential-item" key={item.id}><div><strong>{item.title}</strong><small>{item.issuer}{item.date ? ` · ${item.date}` : ''}</small></div><button className="studio-text-button" onClick={() => onChange({ ...data, certificates: data.certificates.filter((certificate) => certificate.id !== item.id) })}>Remove</button></article>)}</section>
      <section><h2>Password-protected documents</h2><form className="studio-credential-form" onSubmit={addDocument}><Field label="Document title" value={documentTitle} onChange={setDocumentTitle} /><Field label="Date or note" value={documentDate} onChange={setDocumentDate} /><label className="studio-upload">Choose PDF, Word or text file<input name="private-document-file" type="file" accept="application/pdf,.doc,.docx,.txt" required /></label><button className="btn-primary" type="submit" disabled={busy}>{busy ? 'Uploading…' : 'Upload private document'}</button></form><p className="studio-help">Private documents do not get a public file URL. Their file links work only after visitors enter the document password.</p></section>
    </div>
  </>
}
