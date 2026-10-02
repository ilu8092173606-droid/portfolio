import ProjectMedia from './ProjectMedia'
import type { MediaItem } from '../data/site'

export default function ProjectGallery({ media, title }: { media: MediaItem[]; title: string }) {
  if (!media.length) return <div className="media-placeholder"><span>MEDIA TO BE ADDED</span><p>Project photographs, screenshots, diagrams or video can be connected through the central media configuration.</p></div>
  return <div className="project-gallery">{media.map((item, index) => <article key={`${item.source || item.title}-${index}`}><ProjectMedia imageSrc={item.type === 'image' ? item.source : undefined} videoSrc={item.type === 'video' || item.type === 'cloudinary' ? item.source : undefined} poster={item.poster} alt={item.alt || `${title} media ${index + 1}`} /><p>{item.title || item.alt}</p></article>)}</div>
}
