import { FormEvent, useState } from 'react'
import { changeHostedPassword } from '../data/portfolioStore'

function PasswordForm({ kind, title, help, setNotice }: { kind: 'admin' | 'documents'; title: string; help: string; setNotice: (value: string) => void }) {
  const [currentPassword, setCurrentPassword] = useState(''); const [newPassword, setNewPassword] = useState(''); const [confirmPassword, setConfirmPassword] = useState(''); const [busy, setBusy] = useState(false)
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setNotice('')
    const result = await changeHostedPassword(kind, currentPassword, newPassword, confirmPassword)
    if (result.ok) { setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); setNotice(`${title} password changed.`) }
    else setNotice(result.error || 'Could not change the password.')
    setBusy(false)
  }
  return <section className="studio-security-card"><h2>{title}</h2><p className="studio-help">{help}</p><form className="studio-security-form" onSubmit={submit}>
    <label className="studio-field"><span>Current admin password</span><input type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} autoComplete="current-password" required /></label>
    <label className="studio-field"><span>New password</span><input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} autoComplete="new-password" minLength={12} required /><small>Use at least 12 characters.</small></label>
    <label className="studio-field"><span>Confirm new password</span><input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" minLength={12} required /></label>
    <button className="btn-primary" type="submit" disabled={busy}>{busy ? 'Saving…' : `Change ${kind === 'admin' ? 'admin' : 'document'} password`}</button>
  </form></section>
}

export default function SecuritySettings({ hosted, setNotice }: { hosted: boolean; setNotice: (value: string) => void }) {
  return <><p className="section-label">Account security</p><h1>Password settings</h1>{hosted ? <><p className="studio-help">Passwords are stored as server-side password hashes. Changing either password ends document unlock sessions. Admin sessions expire after two hours of inactivity.</p><div className="studio-security-grid"><PasswordForm kind="admin" title="Admin login" help="Changes the password used to sign in to this studio. You’ll remain signed in on this device." setNotice={setNotice} /><PasswordForm kind="documents" title="Private document access" help="Changes the shared password visitors use to unlock private documents. All existing unlock sessions are revoked." setNotice={setNotice} /></div></> : <p className="studio-error" role="alert">Hosted PHP authentication is unavailable. Password changes are disabled in browser-local preview mode.</p>}</>
}
