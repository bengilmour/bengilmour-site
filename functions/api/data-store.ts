export interface BlogPost {
  id: string;
  title: string;
  description: string;
  pubDate: string;
  tags: string[];
  content: string;
}

export interface Sermon {
  id: string;
  title: string;
  description: string;
  pubDate: string;
  scripture: string;
  location: string;
  content: string;
}

export interface ImageAsset {
  id: string;
  filename: string;
  alt: string;
  url: string;
}

export const blogPosts: BlogPost[] = [];
export const sermons: Sermon[] = [];
export const images: ImageAsset[] = [];
