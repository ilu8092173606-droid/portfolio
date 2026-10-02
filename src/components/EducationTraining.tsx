import { education, training } from '../data/site'

export default function EducationTraining() {
  return <section id="education" className="education-section"><div className="section-shell">
    <div className="reveal"><p className="section-label">§ 07 — Education & Learning</p><h2 className="section-title">Learning across software and hardware.</h2></div>
    <div className="education-grid">
      <div className="reveal"><h3>Education</h3>{education.map((item) => <article className="timeline-card" key={item.title}><h4>{item.title}</h4><p>{item.institution}</p><span>{item.detail}</span></article>)}</div>
      <div className="reveal reveal-delay-1"><h3>Training & workshops</h3>{training.map((item) => <article className="timeline-card" key={item.title}><h4>{item.title}</h4><p>{item.institution}</p><span>{item.date} {item.certificate ? '· Certificate available' : ''}</span></article>)}<p className="learning-note">Also participating in online learning experiences, AI / Generative AI learning sessions and webinars.</p></div>
    </div>
  </div></section>
}
