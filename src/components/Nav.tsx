import { useState, useEffect } from 'react'

const links = ['Home', 'Projects', 'AI Lab', 'About', 'Skills', 'Credentials', 'Contact']

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 100,
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        transition: 'background 0.3s, border-color 0.3s, backdrop-filter 0.3s',
        background: scrolled ? 'rgba(7,9,26,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(44,52,128,0.12)' : '1px solid transparent',
      }}
    >
      {/* Logo */}
      <a
        href="#home"
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: '1.4rem',
          letterSpacing: '0.08em',
          color: 'var(--text)',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 36,
            height: 36,
            background: 'var(--blue)',
            color: 'white',
            fontSize: '0.9rem',
            fontWeight: 700,
            letterSpacing: 0,
            borderRadius: 4,
          }}
        >
          BK
        </span>
      </a>

      {/* Desktop links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(1rem, 2vw, 2rem)' }} className="hidden lg:flex">
        {links.map((l) => (
          <a
            key={l}
            href={`#${l.toLowerCase().replace(' ', '-')}`}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              letterSpacing: '0.08em',
              color: 'var(--text-muted)',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = 'var(--blue-bright)')}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'var(--text-muted)')}
          >
            {l}
          </a>
        ))}
        <a href="#contact" className="btn-primary" style={{ padding: '0.5rem 1.1rem', fontSize: '0.7rem' }}>
          Let's Build →
        </a>
      </div>

      {/* Mobile hamburger */}
      <button
        onClick={() => setOpen(!open)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, display: 'flex', flexDirection: 'column', gap: 5 }}
        className="lg:hidden"
        aria-label="Toggle menu"
        aria-expanded={open}
        aria-controls="mobile-navigation"
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              display: 'block',
              width: 22,
              height: 1.5,
              background: 'var(--text)',
              borderRadius: 1,
              transition: 'transform 0.2s, opacity 0.2s',
              transform: open
                ? i === 0 ? 'rotate(45deg) translate(4px, 5px)'
                : i === 2 ? 'rotate(-45deg) translate(4px, -5px)'
                : 'none'
                : 'none',
              opacity: open && i === 1 ? 0 : 1,
            }}
          />
        ))}
      </button>

      {/* Mobile menu */}
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 64,
            left: 0,
            right: 0,
            background: 'rgba(7,9,26,0.97)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(44,52,128,0.12)',
            padding: '0.75rem 1.25rem 1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0',
            maxHeight: 'calc(100dvh - 64px)',
            overflowY: 'auto',
          }}
          id="mobile-navigation"
        >
          {links.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase().replace(' ', '-')}`}
              onClick={() => setOpen(false)}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                letterSpacing: '0.08em',
                color: 'var(--text-muted)',
                textDecoration: 'none',
                padding: '0.85rem 0',
                minHeight: 44,
                display: 'flex',
                alignItems: 'center',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
              }}
            >
              {l}
            </a>
          ))}
          <a href="#contact" className="btn-primary" style={{ marginTop: '1rem', justifyContent: 'center' }}>
            Let's Build →
          </a>
        </div>
      )}
    </nav>
  )
}
