import { SupabaseClient } from '@supabase/supabase-js';
import {
  User,
  Story,
  Scene,
  Series,
  Episode,
  EpisodeScene,
  WorkflowRun,
} from '../types';

export class DatabaseService {
  constructor(
    private supabase: SupabaseClient,
    private userId: string
  ) {}

  // User operations
  async upsertUser(data: { clerk_user_id: string; email?: string; username?: string }) {
    const { data: user, error } = await this.supabase
      .from('users')
      .upsert(data, { onConflict: 'clerk_user_id' })
      .select()
      .single();

    if (error) throw error;
    return user as User;
  }

  async getUser(clerkUserId: string) {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('clerk_user_id', clerkUserId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
    return data as User | null;
  }

  // Story operations
  async createStory(data: {
    summary: string;
    title?: string;
    duration?: number;
    full_story?: string;
    characters?: any[];
  }) {
    const { data: story, error } = await this.supabase
      .from('stories')
      .insert({
        ...data,
        clerk_user_id: this.userId,
      })
      .select()
      .single();

    if (error) throw error;
    return story as Story;
  }

  async updateStory(storyId: string, data: Partial<Story>) {
    const { data: story, error } = await this.supabase
      .from('stories')
      .update(data)
      .eq('id', storyId)
      .eq('clerk_user_id', this.userId)
      .select()
      .single();

    if (error) throw error;
    return story as Story;
  }

  async getStory(storyId: string) {
    const { data, error } = await this.supabase
      .from('stories')
      .select('*')
      .eq('id', storyId)
      .eq('clerk_user_id', this.userId)
      .single();

    if (error) throw error;
    return data as Story;
  }

  async getUserStories() {
    const { data, error } = await this.supabase
      .from('stories')
      .select('*')
      .eq('clerk_user_id', this.userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Story[];
  }

  async deleteStory(storyId: string) {
    const { error } = await this.supabase
      .from('stories')
      .delete()
      .eq('id', storyId)
      .eq('clerk_user_id', this.userId);

    if (error) throw error;
  }

  // Scene operations
  async createScenes(
    storyId: string,
    scenes: Array<{
      scene_number: number;
      description: string;
      image_prompt?: string;
      location?: string;
      characters?: any[];
    }>
  ) {
    const scenesWithUserId = scenes.map((scene) => ({
      ...scene,
      story_id: storyId,
      clerk_user_id: this.userId,
    }));

    const { data, error } = await this.supabase.from('scenes').insert(scenesWithUserId).select();

    if (error) throw error;
    return data as Scene[];
  }

  async getStoryScenes(storyId: string) {
    const { data, error } = await this.supabase
      .from('scenes')
      .select('*')
      .eq('story_id', storyId)
      .eq('clerk_user_id', this.userId)
      .order('scene_number', { ascending: true });

    if (error) throw error;
    return data as Scene[];
  }

  // Series operations
  async createSeries(data: {
    title: string;
    summary: string;
    number_of_episodes: number;
    characters?: any[];
    episode_outlines?: any[];
    plot_threads?: any[];
  }) {
    const { data: series, error } = await this.supabase
      .from('series')
      .insert({
        ...data,
        clerk_user_id: this.userId,
      })
      .select()
      .single();

    if (error) throw error;
    return series as Series;
  }

  async getSeries(seriesId: string) {
    const { data, error } = await this.supabase
      .from('series')
      .select('*')
      .eq('id', seriesId)
      .eq('clerk_user_id', this.userId)
      .single();

    if (error) throw error;
    return data as Series;
  }

  async getUserSeries() {
    const { data, error } = await this.supabase
      .from('series')
      .select('*')
      .eq('clerk_user_id', this.userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Series[];
  }

  // Episode operations
  async createEpisode(data: {
    series_id: string;
    episode_number: number;
    title: string;
    full_episode: string;
    duration?: number;
  }) {
    const { data: episode, error } = await this.supabase
      .from('episodes')
      .insert({
        ...data,
        clerk_user_id: this.userId,
      })
      .select()
      .single();

    if (error) throw error;
    return episode as Episode;
  }

  async getEpisode(episodeId: string) {
    const { data, error } = await this.supabase
      .from('episodes')
      .select('*')
      .eq('id', episodeId)
      .eq('clerk_user_id', this.userId)
      .single();

    if (error) throw error;
    return data as Episode;
  }

  async getSeriesEpisodes(seriesId: string) {
    const { data, error } = await this.supabase
      .from('episodes')
      .select('*')
      .eq('series_id', seriesId)
      .eq('clerk_user_id', this.userId)
      .order('episode_number', { ascending: true });

    if (error) throw error;
    return data as Episode[];
  }

  // Episode scene operations
  async createEpisodeScenes(
    episodeId: string,
    scenes: Array<{
      scene_number: number;
      description: string;
      main_prompt?: string;
      close_up_prompt?: string;
      wide_shot_prompt?: string;
      over_shoulder_prompt?: string;
      dutch_angle_prompt?: string;
      birds_eye_prompt?: string;
    }>
  ) {
    const scenesWithUserId = scenes.map((scene) => ({
      ...scene,
      episode_id: episodeId,
      clerk_user_id: this.userId,
    }));

    const { data, error } = await this.supabase
      .from('episode_scenes')
      .insert(scenesWithUserId)
      .select();

    if (error) throw error;
    return data as EpisodeScene[];
  }

  async getEpisodeScenes(episodeId: string) {
    const { data, error } = await this.supabase
      .from('episode_scenes')
      .select('*')
      .eq('episode_id', episodeId)
      .eq('clerk_user_id', this.userId)
      .order('scene_number', { ascending: true });

    if (error) throw error;
    return data as EpisodeScene[];
  }

  // Workflow run operations
  async createWorkflowRun(data: {
    workflow_id: string;
    workflow_name: string;
    status: 'pending' | 'running' | 'completed' | 'failed';
    input?: any;
  }) {
    const { data: run, error } = await this.supabase
      .from('workflow_runs')
      .insert({
        ...data,
        clerk_user_id: this.userId,
      })
      .select()
      .single();

    if (error) throw error;
    return run as WorkflowRun;
  }

  async updateWorkflowRun(
    runId: string,
    data: {
      status?: 'pending' | 'running' | 'completed' | 'failed';
      output?: any;
      error?: string;
      completed_at?: string;
    }
  ) {
    const { data: run, error } = await this.supabase
      .from('workflow_runs')
      .update(data)
      .eq('id', runId)
      .eq('clerk_user_id', this.userId)
      .select()
      .single();

    if (error) throw error;
    return run as WorkflowRun;
  }

  async getWorkflowRun(runId: string) {
    const { data, error } = await this.supabase
      .from('workflow_runs')
      .select('*')
      .eq('id', runId)
      .eq('clerk_user_id', this.userId)
      .single();

    if (error) throw error;
    return data as WorkflowRun;
  }

  async getUserWorkflowRuns(limit = 50) {
    const { data, error } = await this.supabase
      .from('workflow_runs')
      .select('*')
      .eq('clerk_user_id', this.userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data as WorkflowRun[];
  }
}
