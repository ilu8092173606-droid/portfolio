import { useEffect, useMemo, useRef, useState } from 'react'

interface Props { frames: string[]; scrollHeight?: number; label: string; fallback?: string }
export const SCROLL_HEIGHT = 400

export default function ScrollImageSequence({ frames, scrollHeight = SCROLL_HEIGHT, label, fallback }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const images = useRef(new Map<number, HTMLImageElement>())
  const targetFrame = useRef(0)
  const paintedFrame = useRef(-1)
  const raf = useRef<number | null>(null)
  const [loaded, setLoaded] = useState(0)
  const [reduced, setReduced] = useState(false)
  const [mobile, setMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768)
  const [canvasReady, setCanvasReady] = useState(false)
  const sampledFrames = useMemo(() => frames.filter((_, index) => !mobile || index % 2 === 0), [frames, mobile])

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const mobileQuery = window.matchMedia('(max-width: 767px)')
    const update = () => { setReduced(motion.matches); setMobile(mobileQuery.matches) }
    update(); motion.addEventListener('change', update); mobileQuery.addEventListener('change', update)
    return () => { motion.removeEventListener('change', update); mobileQuery.removeEventListener('change', update) }
  }, [])

  useEffect(() => {
    let active = true
    function draw() {
      raf.current = null
      const image = images.current.get(targetFrame.current)
      if (!active || document.hidden || paintedFrame.current === targetFrame.current || !image?.complete || !image.naturalWidth) return
      const canvas = canvasRef.current
      const context = canvas?.getContext('2d')
      if (!canvas || !context) return
      const rect = canvas.getBoundingClientRect()
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(rect.width * ratio); canvas.height = Math.round(rect.height * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0); context.clearRect(0, 0, rect.width, rect.height)
      const scale = Math.min(rect.width / image.naturalWidth, rect.height / image.naturalHeight)
      const width = image.naturalWidth * scale; const height = image.naturalHeight * scale
      context.drawImage(image, (rect.width - width) / 2, (rect.height - height) / 2, width, height)
      paintedFrame.current = targetFrame.current; setCanvasReady(true)
    }
    const schedule = () => { if (!raf.current) raf.current = requestAnimationFrame(draw) }
    const load = (index: number) => {
      if (index < 0 || index >= sampledFrames.length || images.current.has(index)) return
      const image = new Image(); image.decoding = 'async'
      image.onload = () => { if (!active) return; setLoaded((value) => value + 1); schedule() }
      image.src = sampledFrames[index]; images.current.set(index, image)
    }
    const preloadAround = (center: number) => { for (let index = center - 8; index <= center + 26; index += 1) load(index) }
    const onScroll = () => {
      if (reduced || !sectionRef.current) return
      const range = Math.max(sectionRef.current.offsetHeight - window.innerHeight, 1)
      const progress = Math.min(1, Math.max(0, -sectionRef.current.getBoundingClientRect().top / range))
      const nextFrame = Math.round(progress * Math.max(sampledFrames.length - 1, 0))
      if (nextFrame !== targetFrame.current) { targetFrame.current = nextFrame; preloadAround(nextFrame); schedule() }
    }
    const onResize = () => { paintedFrame.current = -1; schedule(); onScroll() }
    preloadAround(0); schedule(); onScroll()
    window.addEventListener('scroll', onScroll, { passive: true }); window.addEventListener('resize', onResize)
    return () => { active = false; window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onResize); if (raf.current) cancelAnimationFrame(raf.current); images.current.clear() }
  }, [sampledFrames, reduced])

  return <section ref={sectionRef} className="sequence-section" style={{ height: reduced ? '100vh' : `${scrollHeight}vh` }} aria-label={`${label} scroll animation`}>
    <div className="sequence-sticky">
      <img className={`sequence-fallback ${canvasReady ? 'sequence-fallback--hidden' : ''}`} src={fallback || sampledFrames[0]} alt="Assembled robotic arm" />
      <canvas ref={canvasRef} className="sequence-canvas" aria-label={`${label} frame animation`} role="img" />
      <div className="sequence-vignette" />
      <div className="sequence-overlay"><p className="sequence-kicker">Robotics / Embedded Systems</p><h1>INDUSTRIAL ARTICULATED ROBOTIC ARM</h1><p>From mechanical motion to machine vision.</p>{!reduced && <span className="sequence-scroll">SCROLL TO EXPLORE ↓</span>}</div>
      {!reduced && loaded < 2 && <div className="sequence-loading"><span>ROBOTIC SYSTEM</span><strong>INITIALIZING…</strong><i style={{ width: `${Math.min(100, loaded * 50)}%` }} /></div>}
    </div>
  </section>
}
