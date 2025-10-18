export interface User {
  id: string;
  clerk_user_id: string;
  email?: string;
  username?: string;
  created_at: string;
  updated_at: string;
}

export interface Story {
  id: string;
  user_id?: string;
  clerk_user_id: string;
  title?: string;
  summary: string;
  full_story?: string;
  duration?: number;
  characters?: any[];
  created_at: string;
  updated_at: string;
}

export interface Scene {
  id: string;
  story_id: string;
  clerk_user_id: string;
  scene_number: number;
  description: string;
  image_prompt?: string;
  location?: string;
  characters?: any[];
  created_at: string;
  updated_at: string;
}

export interface Series {
  id: string;
  user_id?: string;
  clerk_user_id: string;
  title: string;
  summary: string;
  number_of_episodes: number;
  characters?: any[];
  episode_outlines?: any[];
  plot_threads?: any[];
  created_at: string;
  updated_at: string;
}

export interface Episode {
  id: string;
  series_id: string;
  clerk_user_id: string;
  episode_number: number;
  title: string;
  full_episode: string;
  duration?: number;
  created_at: string;
  updated_at: string;
}

export interface EpisodeScene {
  id: string;
  episode_id: string;
  clerk_user_id: string;
  scene_number: number;
  description: string;
  main_prompt?: string;
  close_up_prompt?: string;
  wide_shot_prompt?: string;
  over_shoulder_prompt?: string;
  dutch_angle_prompt?: string;
  birds_eye_prompt?: string;
  created_at: string;
  updated_at: string;
}

export interface WorkflowRun {
  id: string;
  clerk_user_id: string;
  workflow_id: string;
  workflow_name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  input?: any;
  output?: any;
  error?: string;
  started_at: string;
  completed_at?: string;
  created_at: string;
}
