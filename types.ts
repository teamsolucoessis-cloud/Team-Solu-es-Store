export interface Profile {
  id: string;
  name: string;
  bio: string;
  avatar_url: string;
  mascot_url?: string;
}

export interface AppTool {
  id: string;
  title: string;
  description: string;
  icon_url: string;
  apk_url: string;
  pwa_url: string;
  created_at: string;
}

export interface News {
  id: string;
  title: string;
  content: string;
  image_url: string;
  created_at: string;
}

export type ViewType = 'HOME' | 'PRIVACY' | 'ADMIN' | 'NEWS_LIST';