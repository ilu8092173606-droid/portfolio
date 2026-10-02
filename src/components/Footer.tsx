import { CONTACT, siteProfile } from '../data/site'
import SocialLinks from './SocialLinks'

export default function Footer() {
  const links = ([['GitHub', CONTACT.GITHUB_URL], ['LinkedIn', CONTACT.LINKEDIN_URL], ['Instagram', CONTACT.INSTAGRAM_URL]] as [string, string][]).filter(([, href]) => Boolean(href))
  return <footer className="site-footer"><div className="section-shell footer-shell"><div><b>BITTU KUMAR</b><p>{siteProfile.secondaryTitle}</p></div>{links.length > 0 && <SocialLinks links={links} className="footer-social-links" />}<small>© {new Date().getFullYear()} Bittu Kumar</small></div></footer>
}
