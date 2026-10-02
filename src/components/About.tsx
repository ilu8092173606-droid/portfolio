const pipelineSteps = [
  { label: 'AI', color: 'var(--blue)', desc: 'Models & Algorithms' },
  { label: 'SOFTWARE', color: 'var(--cyan)', desc: 'Python, Web Dev' },
  { label: 'AUTOMATION', color: 'var(--violet)', desc: 'Workflows & Agents' },
  { label: 'HARDWARE', color: 'var(--orange)', desc: 'ESP32, Robotics' },
  { label: 'REAL WORLD', color: 'var(--blue)', desc: 'Impact & Results' },
]

const interests = [
  'Artificial Intelligence', 'Generative AI', 'AI Agents', 'AI Automation',
  'Robotics', 'IoT', 'Python', 'Software Development', 'Emerging Technologies',
]

export default function About() {
  return (
    <section
      id="about"
      style={{ padding: '6rem 0', position: 'relative', overflow: 'hidden' }}
    >
      {/* Subtle background glow */}
      <div style={{
        position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(44,52,128,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
        {/* Header */}
        <div className="reveal" style={{ marginBottom: '3.5rem' }}>
          <p className="section-label" style={{ marginBottom: '1rem' }}>§ 02 — About</p>
          <h2 className="section-title">Beyond Code. I Build Systems.</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '4rem' }} className="md-two-col">
          {/* Left: Text */}
          <div className="reveal" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.75, color: 'var(--text)', maxWidth: '52ch' }}>
              I'm <span style={{ color: 'var(--blue-bright)', fontWeight: 500 }}>Bittu Kumar</span>, a BCA student with a deep interest in building across the full stack — from AI models and software to physical machines and electronics.
            </p>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.75, color: 'var(--text-muted)', maxWidth: '52ch' }}>
              I'm currently <strong style={{ color: 'var(--text)' }}>building, exploring, and experimenting</strong> with AI agents, generative models, automation workflows, embedded systems, and robotics. My goal is to understand how technology works at every layer, from LLM prompts to servo motor control.
            </p>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.75, color: 'var(--text-muted)', maxWidth: '52ch' }}>
              I believe the most interesting problems live at the intersection of software and the physical world.
            </p>

            {/* Interest tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
              {interests.map((item) => (
                <span
                  key={item}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem',
                    letterSpacing: '0.05em',
                    padding: '4px 12px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: 'var(--text-muted)',
                    borderRadius: 3,
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Pipeline visualization */}
          <div className="reveal reveal-delay-2" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.12em', color: 'var(--text-dim)', marginBottom: '1.5rem', textTransform: 'uppercase' }}>
              Technology Pipeline
            </p>
            {pipelineSteps.map((step, i) => (
              <div key={step.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: 320 }}>
                {/* Node */}
                <div
                  style={{
                    width: '100%',
                    padding: '0.9rem 1.5rem',
                    background: 'var(--surface)',
                    border: `1px solid ${step.color}40`,
                    borderLeft: `3px solid ${step.color}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'background 0.2s, border-color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = `${step.color}10`
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'var(--surface)'
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.85rem', letterSpacing: '0.1em', color: step.color }}>
                    {step.label}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-dim)', letterSpacing: '0.05em' }}>
                    {step.desc}
                  </span>
                </div>

                {/* Connector */}
                {i < pipelineSteps.length - 1 && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.3rem 0', position: 'relative' }}>
                    <div style={{ width: 1, height: 20, background: `linear-gradient(to bottom, ${step.color}80, ${pipelineSteps[i+1].color}80)` }} />
                    <div style={{ fontSize: '0.5rem', color: 'var(--text-dim)', lineHeight: 1 }}>▼</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .md-two-col { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </section>
  )
}
