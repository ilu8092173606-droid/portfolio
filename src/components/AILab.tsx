import { projects } from '../data/projects'
import { sitePath } from '../data/sitePath'

export default function AILab() {
  const experiments = projects.filter((project) => project.theme === 'ai' || project.theme === 'agents')
  return <section id="ai-lab" className="ai-lab"><div className="section-shell">
    <div className="reveal"><p className="section-label">§ 04 — AI Lab</p><h2 className="section-title">Experiments with clear boundaries.</h2><p className="section-copy">A living index of assistant, agent and automation work. These entries show what is being explored without turning prototypes into production claims.</p></div>
    <div className="lab-list">{experiments.map((project) => <a className="lab-row reveal" href={sitePath(`/projects/${project.slug}`)} key={project.slug}>
      <div><span>{project.status}</span><h3>{project.title}</h3><p>{project.shortDescription}</p></div><b aria-hidden="true">→</b>
    </a>)}</div>
  </div></section>
}
