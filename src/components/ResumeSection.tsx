import { CONTACT, safeExternalUrl } from '../data/site'

export default function ResumeSection() {
  const resumeUrl = safeExternalUrl(CONTACT.RESUME_URL)
  const hasResume = Boolean(resumeUrl)
  return (
    <section
      id="resume"
      style={{ padding: '6rem 0', position: 'relative', overflow: 'hidden' }}
    >
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(44,52,128,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem', position: 'relative', zIndex: 1 }}>
        <div className="reveal" style={{ marginBottom: '1rem' }}>
          <p className="section-label" style={{ marginBottom: '1rem' }}>§ 07 — Resume</p>
        </div>

        <div
          className="reveal reveal-delay-1"
          style={{
            background: 'var(--surface)',
            border: '1px solid rgba(44,52,128,0.15)',
            padding: 'clamp(2rem, 5vw, 4rem)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '2rem',
            maxWidth: 640,
            margin: '0 auto',
          }}
        >
          {/* Icon */}
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              border: '1px solid rgba(44,52,128,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="1.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>

          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', color: 'var(--text)', margin: '0 0 0.75rem' }}>
              {hasResume ? 'Resume' : 'Resume coming soon'}
            </h2>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--text-muted)', maxWidth: '42ch', margin: '0 auto' }}>
              {hasResume ? 'A concise overview of education, skills and projects.' : 'A final PDF is being prepared. In the meantime, the project case studies contain the most current details.'}
            </p>
          </div>

          {hasResume && <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
            <a href={resumeUrl || undefined} className="btn-primary" target="_blank" rel="noopener noreferrer">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              View Resume
            </a>
            <a href={resumeUrl || undefined} className="btn-ghost" download>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download Resume
            </a>
          </div>}
        </div>
      </div>
    </section>
  )
}
