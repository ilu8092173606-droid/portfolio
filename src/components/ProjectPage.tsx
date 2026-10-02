import { useEffect } from 'react'
import ProjectMedia from './ProjectMedia'
import ProjectGallery from './ProjectGallery'
import ScrollImageSequence from './ScrollImageSequence'
import { projects, type Project } from '../data/projects'
import { safeExternalUrl } from '../data/site'
import roboticArmImage from '../../../ezgif-30f3f90fa3907bb9-jpg/ezgif-frame-001.jpg'

const roboticFrameModules = import.meta.glob('../../../ezgif-30f3f90fa3907bb9-jpg/*.jpg', { eager: true, query: '?url', import: 'default' }) as Record<string, string>
const roboticFrames = Object.entries(roboticFrameModules)
  .sort(([a], [b]) => Number(a.match(/(\d+)\.jpg$/)?.[1]) - Number(b.match(/(\d+)\.jpg$/)?.[1]))
  .map(([, url]) => url)

function Diagram({ project }: { project: Project }) {
  const paths = project.architecture || [{ title: 'System path', nodes: project.theme === 'agents' ? ['INPUT', 'MODEL', 'DECISION', 'TOOL / API', 'OUTPUT'] : ['IDEA', 'INTERFACE', 'BUILD', 'TEST', 'OUTPUT'] }]
  return <div className="architecture-diagram reveal">
    {paths.map((path) => <div className="architecture-path" key={path.title}><p>{path.title}</p>{path.nodes.map((node, index) => <div className="architecture-node" key={node}><span>{node}</span>{index < path.nodes.length - 1 && <i aria-hidden="true">↓</i>}</div>)}</div>)}
  </div>
}

function ProjectNav({ project }: { project: Project }) {
  const current = projects.findIndex((item) => item.slug === project.slug)
  const previous = projects[(current - 1 + projects.length) % projects.length]
  const next = projects[(current + 1) % projects.length]
  return <nav className="project-navigation" aria-label="Project navigation"><a href={`/projects/${previous.slug}`}>← <span>Previous Project</span>{previous.title}</a><a href={`/projects/${next.slug}`}><span>Next Project</span>{next.title} →</a></nav>
}

function GenericHero({ project }: { project: Project }) {
  return <header className={`project-hero project-hero--${project.theme} grid-bg`}>
    <div><p className="section-label">Project case study</p><p className="project-category">{project.category}</p><h1>{project.title}</h1><p className="project-lede">{project.shortDescription}</p></div>
    <div className="project-hero-art" aria-hidden="true"><div /><div /><div /></div>
  </header>
}

export default function ProjectPage({ project }: { project: Project }) {
  useEffect(() => {
    document.title = `${project.title} | Bittu Kumar`
    const setMeta = (selector: string, attribute: 'name' | 'property', key: string, content: string) => {
      const element = document.querySelector<HTMLMetaElement>(selector) || document.head.appendChild(document.createElement('meta'))
      element.setAttribute(attribute, key); element.content = content
    }
    setMeta('meta[name="description"]', 'name', 'description', project.overview)
    setMeta('meta[property="og:title"]', 'property', 'og:title', `${project.title} | Bittu Kumar`)
    setMeta('meta[property="og:description"]', 'property', 'og:description', project.overview)
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [project])
  const isRobot = project.slug === 'robotic-arm'
  const githubUrl = safeExternalUrl(project.github || '')
  const liveDemoUrl = safeExternalUrl(project.liveDemo || '')
  return <main className={`project-page project-page--${project.theme}`}>
    <div className="project-top"><a href="/">BK</a><nav aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><a href="/#projects">Projects</a><span>/</span><strong>{project.title}</strong></nav></div>
    {isRobot ? <ScrollImageSequence frames={roboticFrames} fallback={roboticArmImage} label={project.title} /> : <GenericHero project={project} />}
    <div className="project-content">
      <section className="project-intro reveal"><div><p className="section-label">01 — The Project</p><p className="project-status">Current status: {project.status}</p><h2>{project.title}</h2><p>{project.overview}</p></div><ProjectMedia imageSrc={isRobot ? roboticArmImage : project.imageSrc} alt={`${project.title} project media`} /></section>
      {isRobot && <section className="watch-system reveal"><p className="section-label">Real project media</p><h2>Engineering evidence</h2><p>Project photographs, Python UI captures, CAD/design images and electronics documentation can be added through the centralized media configuration. No real demonstration video is claimed yet.</p></section>}
      <section className="project-section"><p className="section-label">02 — What I Built</p><h2>Engineering the system</h2><div className="build-grid">{project.whatIBuilt.map((item, index) => <article className="build-card reveal" key={item}><b>{String(index + 1).padStart(2, '0')}</b><p>{item}</p></article>)}</div></section>
      <section className="system-section"><div><p className="section-label">03 — System Architecture</p><h2>Connected by design</h2><p>The architecture separates control, feedback and machine-vision paths so each documented capability remains clear.</p></div><Diagram project={project} /></section>
      <section className="project-section"><p className="section-label">04 — Technologies</p><h2>Technology stack</h2><div className="project-tags">{project.technologies.map((item) => <span className="tech-tag" key={item}>{item}</span>)}</div></section>
      <section className="project-section"><p className="section-label">06 — Media</p><h2>Evidence from the build</h2><ProjectGallery media={project.media} title={project.title} /></section>
      <section className="details-section"><p className="section-label">05 — How It Works</p><h2>Technical details</h2><div>{(project.technicalDetails || project.whatIBuilt.slice(0, 5).map((title) => ({ title, text: 'See the project overview and implementation notes for this area of work.' }))).map((item) => <article key={item.title}><h3>{item.title}</h3><p>{item.text}</p></article>)}</div></section>
      <section className="contribution-section"><p className="section-label">07 — My Contribution</p><h2>{isRobot ? 'My contribution to a team project' : 'My contribution'}</h2>{isRobot && <p className="team-note">TEAM PROJECT — this case study distinguishes my hands-on contribution from the complete group build.</p>}<ul>{project.myContribution.map((item) => <li key={item}>{item}</li>)}</ul></section>
      {project.challenges && <section className="challenges-section"><p className="section-label">07 — Challenges & Learnings</p><h2>Notes to complete</h2><div><p><b>Challenge</b>{project.challenges.challenge}</p><p><b>Approach</b>{project.challenges.approach}</p><p><b>Learning</b>{project.challenges.learning}</p></div></section>}
      {(githubUrl || liveDemoUrl) && <section className="project-actions">{githubUrl && <a className="btn-ghost" href={githubUrl} target="_blank" rel="noopener noreferrer">GitHub ↗</a>}{liveDemoUrl && <a className="btn-primary" href={liveDemoUrl} target="_blank" rel="noopener noreferrer">Live Demo ↗</a>}</section>}
      <ProjectNav project={project} />
    </div>
  </main>
}
