import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import type { GalleryCategory, GalleryImage } from '../types';
import { GalleryCard } from '../components/GalleryCard';
import { galleryImages } from '../data/gallery';

const categories: Array<'All' | GalleryCategory> = ['All', 'Technical', 'Workshops', 'Cultural', 'Competitions'];

export function GalleryPage() {
  const [category, setCategory] = useState<(typeof categories)[number]>('All');
  const [selected, setSelected] = useState<GalleryImage | null>(null);
  const filteredImages = category === 'All' ? galleryImages : galleryImages.filter((image) => image.category === category);
  const selectedIndex = selected ? filteredImages.findIndex((image) => image.id === selected.id) : -1;

  function moveSelection(direction: -1 | 1) {
    if (selectedIndex < 0 || filteredImages.length < 2) return;
    const nextIndex = (selectedIndex + direction + filteredImages.length) % filteredImages.length;
    setSelected(filteredImages[nextIndex]);
  }

  useEffect(() => {
    if (!selected) return undefined;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setSelected(null);
      if (event.key === 'ArrowLeft') moveSelection(-1);
      if (event.key === 'ArrowRight') moveSelection(1);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selected, selectedIndex, filteredImages]);

  return (
    <main className="page-container gallery-page">
      <div className="page-intro">
        <span className="eyebrow">THE FEST, THROUGH OUR EYES</span>
        <h1>TechFest <span>Gallery</span></h1>
        <p>From big breakthroughs to little in-between moments. Take a look around.</p>
      </div>

      <div className="filter-row" role="group" aria-label="Filter gallery by category">
        {categories.map((item) => (
          <button key={item} type="button" className={`filter-button${category === item ? ' filter-button-active' : ''}`} onClick={() => setCategory(item)}>
            {item}
          </button>
        ))}
        <span className="gallery-count">{filteredImages.length} moments</span>
      </div>

      <div className="gallery-grid">
        {filteredImages.map((image) => <GalleryCard key={image.id} image={image} onClick={() => setSelected(image)} />)}
      </div>

      {selected && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
          <div className="image-modal" role="dialog" aria-modal="true" aria-label={selected.title}>
            <button type="button" className="modal-close" onClick={() => setSelected(null)} aria-label="Close image"><X size={21} /></button>
            <button type="button" className="modal-arrow modal-arrow-left" onClick={() => moveSelection(-1)} aria-label="Previous image"><ArrowLeft size={20} /></button>
            <img src={selected.image.replace(/w=\d+/, 'w=1800')} alt={selected.alt} />
            <button type="button" className="modal-arrow modal-arrow-right" onClick={() => moveSelection(1)} aria-label="Next image"><ArrowRight size={20} /></button>
            <div className="modal-caption"><span>{selected.category}</span><strong>{selected.title}</strong></div>
          </div>
        </div>
      )}
    </main>
  );
}
