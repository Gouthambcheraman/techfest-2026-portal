import type { GalleryImage } from '../types';

export function GalleryCard({ image, onClick }: { image: GalleryImage; onClick: () => void }) {
  return (
    <button className="gallery-card" onClick={onClick} aria-label={`View ${image.title}`}>
      <img src={image.image} alt={image.alt} loading="lazy" />
      <span className="gallery-card-overlay">
        <span className="gallery-category">{image.category}</span>
        <strong>{image.title}</strong>
      </span>
    </button>
  );
}
