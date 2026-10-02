import { useState, useCallback } from 'react'

interface Node {
  id: string
  label: string
  x: number
  y: number
  connections: string[]
  color: string
}

const nodes: Node[] = [
  { id: 'center', label: 'BITTU', x: 50, y: 50, connections: ['ai', 'python', 'llms', 'automation', 'robotics', 'esp32', 'iot', 'web', 'linux', 'apis'], color: 'var(--blue)' },
  { id: 'ai', label: 'AI', x: 50, y: 14, connections: ['center', 'llms', 'automation', 'python'] , color: 'var(--blue)' },
  { id: 'python', label: 'Python', x: 78, y: 22, connections: ['center', 'ai', 'automation', 'apis'], color: 'var(--cyan)' },
  { id: 'llms', label: 'LLMs', x: 90, y: 45, connections: ['center', 'ai', 'apis'], color: 'var(--blue)' },
  { id: 'automation', label: 'Automation', x: 80, y: 72, connections: ['center', 'ai', 'python', 'apis'], color: 'var(--violet)' },
  { id: 'robotics', label: 'Robotics', x: 55, y: 88, connections: ['center', 'esp32', 'python'], color: 'var(--orange)' },
  { id: 'esp32', label: 'ESP32', x: 30, y: 82, connections: ['center', 'robotics', 'iot'], color: 'var(--orange)' },
  { id: 'iot', label: 'IoT', x: 12, y: 63, connections: ['center', 'esp32', 'apis'], color: 'var(--cyan)' },
  { id: 'web', label: 'Web', x: 10, y: 38, connections: ['center', 'python', 'apis'], color: 'var(--cyan)' },
  { id: 'linux', label: 'Linux', x: 22, y: 18, connections: ['center', 'python'], color: 'var(--text-muted)' },
  { id: 'apis', label: 'APIs', x: 68, y: 32, connections: ['center', 'python', 'automation', 'web', 'iot'], color: 'var(--violet)' },
]

const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]))

function getColor(varName: string): string {
  if (varName === 'var(--blue)') return '#2C3480'
  if (varName === 'var(--cyan)') return '#ffffff'
  if (varName === 'var(--violet)') return '#2C3480'
  if (varName === 'var(--orange)') return '#2C3480'
  return '#a3a3a3'
}

export default function TechConstellation() {
  const [hovered, setHovered] = useState<string | null>(null)

  const isHighlighted = useCallback(
    (nodeId: string) => {
      if (!hovered) return true
      const h = nodeMap[hovered]
      return nodeId === hovered || h.connections.includes(nodeId)
    },
    [hovered]
  )

  const isEdgeHighlighted = useCallback(
    (a: string, b: string) => {
      if (!hovered) return false
      return (a === hovered || b === hovered) && (nodeMap[hovered].connections.includes(a) || nodeMap[hovered].connections.includes(b))
    },
    [hovered]
  )

  return (
    <section
      id="constellation"
      style={{ padding: '6rem 0', background: 'var(--surface)', position: 'relative', overflow: 'hidden' }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
        <div className="reveal" style={{ marginBottom: '3.5rem' }}>
          <p className="section-label" style={{ marginBottom: '1rem' }}>§ 06 — Technology Map</p>
          <h2 className="section-title">Technology Constellation</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: '48ch', marginTop: '0.75rem' }}>
            Hover a node to see its connections across my stack.
          </p>
        </div>

        <div className="reveal" style={{ position: 'relative', width: '100%', maxWidth: 680, margin: '0 auto' }}>
          <svg
            viewBox="0 0 100 100"
            style={{ width: '100%', height: 'auto', overflow: 'visible' }}
          >
            {/* Edges */}
            {nodes.map((node) =>
              node.connections
                .filter((c) => c !== 'center' || node.id === 'center')
                .filter((c) => node.id < c || node.id === 'center')
                .map((connId) => {
                  const conn = nodeMap[connId]
                  if (!conn) return null
                  const highlighted = isEdgeHighlighted(node.id, connId)
                  const dimmed = hovered && !highlighted
                  return (
                    <line
                      key={`${node.id}-${connId}`}
                      x1={node.x}
                      y1={node.y}
                      x2={conn.x}
                      y2={conn.y}
                      stroke={highlighted ? '#2C3480' : 'rgba(44,52,128,0.15)'}
                      strokeWidth={highlighted ? 0.4 : 0.2}
                      opacity={dimmed ? 0.05 : 1}
                      style={{ transition: 'opacity 0.2s, stroke 0.2s, stroke-width 0.2s' }}
                    />
                  )
                })
            )}

            {/* Nodes */}
            {nodes.map((node) => {
              const isCenter = node.id === 'center'
              const color = getColor(node.color)
              const highlighted = isHighlighted(node.id)
              const dimmed = hovered && !highlighted

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHovered(node.id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {/* Glow ring */}
                  {(isCenter || hovered === node.id) && (
                    <circle
                      r={isCenter ? 7 : 4.5}
                      fill="none"
                      stroke={color}
                      strokeWidth={0.3}
                      opacity={0.4}
                      style={{ animation: 'pulse 2s ease-in-out infinite' }}
                    />
                  )}

                  {/* Node circle */}
                  <circle
                    r={isCenter ? 5 : 3}
                    fill={isCenter ? color : highlighted ? `${color}30` : 'rgba(13,21,38,0.8)'}
                    stroke={color}
                    strokeWidth={0.5}
                    opacity={dimmed ? 0.2 : 1}
                    style={{ transition: 'opacity 0.2s, fill 0.2s' }}
                  />

                  {/* Label */}
                  <text
                    y={isCenter ? 0.4 : (node.y > 50 ? 5 : -4)}
                    textAnchor="middle"
                    dominantBaseline={isCenter ? 'middle' : 'auto'}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: isCenter ? 2.2 : 1.9,
                      fill: isCenter ? 'white' : dimmed ? 'rgba(163,163,163,0.3)' : color,
                      fontWeight: isCenter ? 700 : 400,
                      letterSpacing: '0.1em',
                      transition: 'fill 0.2s',
                      userSelect: 'none',
                    }}
                  >
                    {node.label}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>
      </div>
    </section>
  )
}
