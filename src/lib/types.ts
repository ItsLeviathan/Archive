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
  /**
   * Pre-formatted date/time as the writer's own device clock saw it at the
   * moment they published (e.g. "AUGUST 25, 2026" / "3:30 PM"). Computed
   * client-side in WriteFlow and passed through here because computing it
   * on the server would use the server's timezone, not the writer's —
   * which is wrong for a "this is when I wrote this" timestamp.
   * Optional so older/non-JS clients still get a (server-time) fallback.
   */
  date?: string;
  time?: string;
}