import { useEffect, useState } from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import ProjectsSection from './components/ProjectsSection'
import AILab from './components/AILab'
import Skills from './components/Skills'
import TechConstellation from './components/TechConstellation'
import ResumeSection from './components/ResumeSection'
import ContactSection from './components/ContactSection'
import EducationTraining from './components/EducationTraining'
import PortfolioStudio from './components/PortfolioStudio'
import { applyPortfolio, hydratePortfolio, loadHostedPortfolio } from './data/portfolioStore'
import Footer from './components/Footer'
import ProjectPage from './components/ProjectPage'
import CredentialsSection from './components/CredentialsSection'
import { getProject } from './data/projects'

function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    )

    const elements = document.querySelectorAll('.reveal')
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])
}

function useReadingProgress() {
  useEffect(() => {
    const update = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight
      document.documentElement.style.setProperty('--reading-progress', `${height > 0 ? (window.scrollY / height) * 100 : 0}%`)
    }
    update(); window.addEventListener('scroll', update, { passive: true }); window.addEventListener('resize', update)
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update) }
  }, [])
}

export default function App() {
  useScrollReveal()
  useReadingProgress()
  const [, refresh] = useState(0)
  useEffect(() => { hydratePortfolio(); refresh((value) => value + 1); loadHostedPortfolio().then((saved) => { if (!saved) return; applyPortfolio(saved); refresh((value) => value + 1) }) }, [])
  if (window.location.pathname === '/studio' || window.location.pathname === '/studio/') return <PortfolioStudio />
  const match = window.location.pathname.match(/^\/projects\/([^/]+)\/?$/)
  const project = match ? getProject(match[1]) : undefined
  if (match) return project ? <ProjectPage project={project} /> : <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}><a href="/" className="btn-primary">Return home</a></main>
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      <Nav />
      <Hero />
      <About />
      <ProjectsSection />
      <AILab />
      <Skills />
      <TechConstellation />
      <EducationTraining />
      <ResumeSection />
      <CredentialsSection />
      <ContactSection />
      <Footer />
    </div>
  )
}
