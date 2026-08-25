export type CollectionId =
  | 'unsent'
  | 'longing'
  | 'remembered'
  | 'forgiven'
  | 'goodbye'
  | 'grateful'
  | 'becoming'
  | 'home';

export type CardLayout = 'horizontal' | 'split' | 'minimal' | 'typographic' | 'small' | 'hero';

export interface Collection {
  id: CollectionId;
  label: string;
  desc: string;
}

export interface Story {
  id: string;
  collection: CollectionId;
  emotion: string;
  layout: CardLayout;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  time: string;
  readingTime: string;
  felt: number;
  body: string[];
}

export interface NewStoryInput {
  title: string;
  body: string;
  collection: CollectionId;
  author?: string;
}
