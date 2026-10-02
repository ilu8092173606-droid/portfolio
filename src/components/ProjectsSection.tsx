import { projects, type Project, type ProjectTheme } from '../data/projects'
import { sitePath } from '../data/sitePath'

const groups: { title: string; description: string; themes: ProjectTheme[]; accent: string }[] = [
  { title: 'AI / Generative AI', description: 'Assistants and generative workflows under active development.', themes: ['ai'], accent: 'var(--blue)' },
  { title: 'AI Agents & Automation', description: 'Tool-use and automation experiments with clear work-in-progress boundaries.', themes: ['agents'], accent: 'var(--violet)' },
  { title: 'Robotics / Embedded / IoT', description: 'Physical systems, electronics and connected-device experiments.', themes: ['robotics'], accent: 'var(--orange)' },
  { title: 'Web / Applications', description: 'Deployed and archived web projects.', themes: ['web'], accent: 'var(--cyan)' },
  { title: 'Video Editing / Creative Technology', description: 'A dedicated home for finished edits and technical creative work.', themes: ['creative'], accent: 'var(--blue-bright)' },
]

function statusColor(status: Project['status']) {
  if (status === 'Deployed' || status === 'Working') return 'var(--cyan)'
  if (status === 'Partially Functional' || status === 'Under Development') return 'var(--orange)'
  return 'var(--violet)'
}

function ProjectCard({ project, accent }: { project: Project; accent: string }) {
  return <article className="project-card reveal">
    <div className="project-card__top" style={{ borderColor: `${accent}55` }}>
      <p>{project.category}</p><span style={{ color: statusColor(project.status), borderColor: statusColor(project.status) }}>{project.status}</span>
    </div>
    <div className="project-card__body">
      <h3>{project.title}</h3><p>{project.shortDescription}</p>
      <div className="project-card__tags">{project.technologies.slice(0, 5).map((item) => <span className="tech-tag" key={item}>{item}</span>)}</div>
      <a href={sitePath(`/projects/${project.slug}`)} className="btn-ghost">View project <span aria-hidden="true">→</span></a>
    </div>
  </article>
}

export default function ProjectsSection() {
  return <section id="projects" className="projects-section"><div className="section-shell">
    <div className="reveal projects-heading"><p className="section-label">§ 03 — Projects</p><h2 className="section-title">Selected work, honestly documented.</h2><p>Projects are organised by what they explore—not by a list of technologies. Status labels make the current state clear.</p></div>
    {groups.map((group) => {
      const items = projects.filter((project) => group.themes.includes(project.theme))
      return <section className="project-group" key={group.title}>
        <div className="reveal project-group__heading" style={{ borderColor: `${group.accent}33` }}><p style={{ color: group.accent }}>{group.title}</p><span>{group.description}</span></div>
        <div className="project-card-grid">{items.map((project) => <ProjectCard key={project.slug} project={project} accent={group.accent} />)}</div>
      </section>
    })}
  </div></section>
}
