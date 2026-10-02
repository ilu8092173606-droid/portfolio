import { CONTACT, safeMailto, safeTel, siteProfile } from '../data/site'
import SocialLinks from './SocialLinks'

const socialLinks: [string, string][] = [
  ['LinkedIn', CONTACT.LINKEDIN_URL], ['GitHub', CONTACT.GITHUB_URL], ['Instagram', CONTACT.INSTAGRAM_URL], ['YouTube', CONTACT.YOUTUBE_URL], ['Hugging Face', CONTACT.HUGGINGFACE_URL],
]

export default function ContactSection() {
  const mailto = safeMailto(CONTACT.EMAIL)
  const tel = safeTel(CONTACT.PHONE)
  return <section id="contact" className="contact-section"><div className="section-shell contact-shell">
    <div className="reveal"><p className="section-label">§ 09 — Contact</p><h2 className="section-title">Let’s build something thoughtful.</h2><p className="section-copy">For collaboration, freelance enquiries or an idea worth exploring, contact details will appear here once they are ready to share.</p></div>
    <div className="reveal contact-panel">
      {mailto ? <a className="btn-primary" href={mailto}>Email Bittu <span aria-hidden="true">→</span></a> : <p><span>CONTACT DETAILS</span>Coming soon</p>}
      {tel && <p className="contact-phone"><a href={tel}>{CONTACT.PHONE}</a></p>}
      {siteProfile.location && <p className="contact-location">{siteProfile.location}</p>}
      <SocialLinks links={socialLinks} className="contact-links" />
    </div>
  </div></section>
}
