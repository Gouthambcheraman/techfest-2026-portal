import type { GalleryImage } from '../types';

const photo = (id: string, width = 1000) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;

export const galleryImages: GalleryImage[] = [
  {
    id: 'technical-1',
    title: 'Building what comes next',
    category: 'Technical',
    image: photo('photo-1518770660439-4636190af475'),
    alt: 'Close-up of a circuit board during a technology showcase',
  },
  {
    id: 'workshop-1',
    title: 'Ideas take shape',
    category: 'Workshops',
    image: photo('photo-1522202176988-66273c2fd55f'),
    alt: 'Students collaborating around a table',
  },
  {
    id: 'cultural-1',
    title: 'A night to remember',
    category: 'Cultural',
    image: photo('photo-1506157786151-b8491531f063'),
    alt: 'Crowd enjoying a live performance',
  },
  {
    id: 'competition-1',
    title: 'The final round',
    category: 'Competitions',
    image: photo('photo-1516321318423-f06f85e504b3'),
    alt: 'Team working together at a laptop',
  },
  {
    id: 'technical-2',
    title: 'Curious minds at work',
    category: 'Technical',
    image: photo('photo-1531482615713-2afd69097998'),
    alt: 'Students taking part in a collaborative technology session',
  },
  {
    id: 'workshop-2',
    title: 'Learn by doing',
    category: 'Workshops',
    image: photo('photo-1516321497487-e288fb19713f'),
    alt: 'A student learning with a laptop',
  },
  {
    id: 'cultural-2',
    title: 'Together on stage',
    category: 'Cultural',
    image: photo('photo-1501386761578-eac5c94b800a'),
    alt: 'Audience gathered for a music performance',
  },
  {
    id: 'competition-2',
    title: 'Made to compete',
    category: 'Competitions',
    image: photo('photo-1521737711867-e3b97375f902'),
    alt: 'A team discussing their competition project',
  },
];
