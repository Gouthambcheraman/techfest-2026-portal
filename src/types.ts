export type User = {
  id: string;
  name: string;
  email: string;
};

export type GalleryCategory = 'Technical' | 'Workshops' | 'Cultural' | 'Competitions';

export type GalleryImage = {
  id: string;
  title: string;
  category: GalleryCategory;
  image: string;
  alt: string;
};

export type FeedbackEntry = {
  _id: string;
  category: string;
  rating: number;
  message: string;
  createdAt: string;
};
