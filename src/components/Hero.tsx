import { useEffect, useRef } from 'react'
import { safeAssetUrl, siteProfile } from '../data/site'

const tags = ['AI', 'GENERATIVE AI', 'PYTHON', 'ROBOTICS', 'AUTOMATION', 'IoT']

// Tiny floating particle dot
function Particle({ style }: { style: React.CSSProperties }) {
  return (
    <div
      style={{
        position: 'absolute',
        width: 3,
        height: 3,
        borderRadius: '50%',
        background: 'var(--blue)',
        opacity: 0.4,
        animation: 'float 4s ease-in-out infinite',
        ...style,
      }}
    />
  )
}

export default function Hero() {
  const scanRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf: number
    let pos = 0
    const animate = () => {
      pos = (pos + 0.3) % 100
      if (scanRef.current) {
        scanRef.current.style.top = `${pos}%`
        scanRef.current.style.opacity = pos > 85 ? String((100 - pos) / 15 * 0.4) : '0.4'
      }
      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <section
      id="home"
      style={{
        minHeight: '100vh',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        overflow: 'hidden',
        paddingTop: 64,
      }}
      className="grid-bg"
    >
      {/* Background image */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(https://images.unsplash.com/photo-1606206873764-fd15e242df52?w=1600&h=900&fit=crop&auto=format)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.18,
        }}
      />

      {/* Dark gradient overlays */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(7,9,26,0.95) 0%, rgba(7,9,26,0.6) 50%, rgba(7,9,26,0.9) 100%)' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%', background: 'linear-gradient(to top, var(--bg), transparent)' }} />

      {/* Blue glow orb */}
      <div
        style={{
          position: 'absolute',
          right: '10%',
          top: '20%',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(44,52,128,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '5%',
          bottom: '20%',
          width: 250,
          height: 250,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(44,52,128,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Scan line */}
      <div
        ref={scanRef}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(44,52,128,0.4), transparent)',
          pointerEvents: 'none',
          top: '0%',
        }}
      />

      {/* Floating particles */}
      <Particle style={{ top: '25%', left: '15%', animationDelay: '0s' }} />
      <Particle style={{ top: '45%', right: '20%', animationDelay: '1.5s', background: 'var(--cyan)' }} />
      <Particle style={{ top: '65%', left: '30%', animationDelay: '0.8s' }} />
      <Particle style={{ top: '30%', right: '35%', animationDelay: '2.2s', background: 'var(--violet)' }} />

      {/* Corner bracket decorations */}
      {[
        { top: 80, left: 24, borderTop: '1px solid', borderLeft: '1px solid' },
        { top: 80, right: 24, borderTop: '1px solid', borderRight: '1px solid' },
        { bottom: 40, left: 24, borderBottom: '1px solid', borderLeft: '1px solid' },
        { bottom: 40, right: 24, borderBottom: '1px solid', borderRight: '1px solid' },
      ].map((s, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: 20,
            height: 20,
            borderColor: 'rgba(44,52,128,0.35)',
            ...s,
          }}
        />
      ))}

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: 1200,
          margin: '0 auto',
          width: '100%',
          padding: '0 2rem',
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '2rem',
        }}
      >
        {/* Label */}
        <div className="reveal" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              letterSpacing: '0.2em',
              color: 'var(--blue)',
              textTransform: 'uppercase',
            }}
          >
            ◆ AI & Technology Portfolio
          </span>
        </div>

        {/* Main heading */}
        <div className="reveal reveal-delay-1">
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 'clamp(3.5rem, 9vw, 8rem)',
              lineHeight: 0.95,
              letterSpacing: '0.03em',
              color: 'var(--text)',
              margin: 0,
            }}
          >
            BITTU
            <br />
            <span style={{ color: 'var(--blue)', textShadow: '0 0 40px rgba(44,52,128,0.4)' }}>
              KUMAR
            </span>
          </h1>
          {safeAssetUrl(siteProfile.profilePhoto) && <img src={safeAssetUrl(siteProfile.profilePhoto) || undefined} alt="Bittu Kumar" className="hero-profile-photo" />}
        </div>

        {/* Role */}
        <div className="reveal reveal-delay-2">
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(0.75rem, 1.5vw, 0.95rem)',
              letterSpacing: '0.25em',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              maxWidth: 480,
            }}
          >
            AI & Technology Generalist
          </p>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1.1rem',
              color: 'var(--text-muted)',
              marginTop: '1rem',
              lineHeight: 1.6,
              maxWidth: 500,
            }}
          >
            Building intelligent systems, automation, software and machines.
          </p>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.85rem',
              color: 'rgba(163,163,163,0.7)',
              marginTop: '0.5rem',
              lineHeight: 1.6,
              maxWidth: 480,
            }}
          >
            Exploring the intersection of Artificial Intelligence, Generative AI, Robotics, IoT and Software.
          </p>
        </div>

        {/* Buttons */}
        <div className="reveal reveal-delay-3" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          <a href="#projects" className="btn-primary">Explore My Work →</a>
          <a href="#about" className="btn-ghost">About my work</a>
        </div>

        {/* Tech tags */}
        <div className="reveal reveal-delay-4" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {tags.map((t) => (
            <span key={t} className="tech-tag">{t}</span>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
          zIndex: 2,
        }}
      >
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.1em', color: 'var(--text-dim)' }}>SCROLL</span>
        <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, var(--blue), transparent)', animation: 'float 2s ease-in-out infinite' }} />
      </div>
    </section>
  )
}
