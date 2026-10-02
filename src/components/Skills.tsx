const categories: [string, string[]][] = [
  ['AI / Generative AI', ['Python', 'LLMs', 'Generative AI', 'Prompt Engineering', 'AI Agents', 'AI Automation', 'Gemini', 'Ollama', 'n8n', 'Voice AI', 'AI-generated media']],
  ['Robotics / Embedded', ['ESP32', 'Sensors', 'Stepper Motors', 'Servo Motors', 'MPU6050', 'AS5600', 'TCA9548A', 'PCA9685', 'Motor Drivers', 'I²C', 'Embedded Systems', 'Robotics']],
  ['Computer Vision', ['OpenCV', 'YOLO', 'Machine Vision']],
  ['Software / Web', ['Python', 'HTML', 'CSS', 'JavaScript', 'Web Development']],
  ['Engineering', ['Inverse Kinematics', 'Trajectory Planning', 'CNC', 'SolidWorks']],
  ['Creative Technology', ['Premiere Pro', 'After Effects', 'CapCut', 'Kdenlive', 'Blender', 'Canva']],
  ['Linux / Security', ['Ubuntu', 'Garuda Linux', 'Kali Linux']],
]

export default function Skills() {
  return <section id="skills" className="skills-section"><div className="section-shell"><div className="reveal"><p className="section-label">§ 05 — Skills</p><h2 className="section-title">Technical toolkit.</h2><p className="section-copy">A grouped view of tools and topics I use or explore—without artificial proficiency scores.</p></div><div className="skills-grid">{categories.map(([title, items]) => <article className="skills-card reveal" key={title}><h3>{title}</h3><div>{items.map((item) => <span className="tech-tag" key={item}>{item}</span>)}</div></article>)}</div></div></section>
}
