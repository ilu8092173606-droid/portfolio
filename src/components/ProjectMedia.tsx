import { useRef, useEffect } from 'react'
import { safeAssetUrl } from '../data/site'

interface Props {
  videoSrc?: string
  imageSrc?: string
  poster?: string
  alt: string
  aspectRatio?: string
}

export default function ProjectMedia({ videoSrc, imageSrc, poster, alt, aspectRatio = '16/9' }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const safeVideoSrc = videoSrc ? safeAssetUrl(videoSrc) : null
  const safeImageSrc = imageSrc ? safeAssetUrl(imageSrc) : null
  const safePoster = poster ? safeAssetUrl(poster) : null

  useEffect(() => {
    if (!videoRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!videoRef.current) return
        if (entry.isIntersecting) {
          videoRef.current.play().catch(() => {})
        } else {
          videoRef.current.pause()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(videoRef.current)
    return () => observer.disconnect()
  }, [safeVideoSrc])

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio,
        background: 'var(--surface)',
        border: '1px solid rgba(44,52,128,0.15)',
        overflow: 'hidden',
      }}
    >
      {safeVideoSrc ? (
        <video
          ref={videoRef}
          src={safeVideoSrc}
          poster={safePoster || undefined}
          preload="metadata"
          muted
          controls={false}
          loop
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      ) : safeImageSrc ? (
        <img
          src={safeImageSrc}
          alt={alt}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      ) : (
        /* Placeholder */
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            background: 'linear-gradient(135deg, var(--surface) 0%, var(--surface-2) 100%)',
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              border: '1px solid rgba(44,52,128,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(44,52,128,0.6)" strokeWidth="1.5">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.1em', color: 'rgba(44,52,128,0.5)', marginBottom: '0.25rem' }}>
              [ PROJECT VIDEO ]
            </p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.06em', color: 'var(--text-dim)' }}>
              Replace with MP4 · WebM · YouTube · Vimeo · Images
            </p>
          </div>
        </div>
      )}

      {/* Scan line overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
      }} />
    </div>
  )
}
