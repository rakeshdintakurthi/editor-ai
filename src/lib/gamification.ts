import { supabase } from './supabase';

export interface UserProfile {
  id: string;
  user_id: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  college?: string;
  graduation_year?: number;
  github_url?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  created_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  total_xp: number;
  current_level: number;
  challenges_completed: number;
  lessons_completed: number;
  streak_days: number;
  last_activity_date: string;
}

export interface Badge {
  id: string;
  badge_name: string;
  description?: string;
  icon_url?: string;
  category: string;
  rarity: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
  badge?: Badge;
}

export interface Level {
  id: string;
  level_number: number;
  level_name: string;
  xp_required: number;
  icon_url?: string;
}

export interface Achievement {
  id: string;
  achievement_name: string;
  description?: string;
  requirement_type: string;
  requirement_value: number;
  xp_reward: number;
  badge_id?: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  progress: number;
  completed: boolean;
  completed_at?: string;
  achievement?: Achievement;
}

export interface LeaderboardEntry {
  id: string;
  user_id: string;
  scope: string;
  scope_value?: string;
  total_xp: number;
  rank?: number;
  week_start: string;
  profile?: UserProfile;
}

export interface CareerTrack {
  id: string;
  track_name: string;
  description?: string;
  icon_url?: string;
  difficulty: string;
  estimated_hours?: number;
  is_active: boolean;
  order_index: number;
}

export interface Course {
  id: string;
  track_id: string;
  course_name: string;
  description?: string;
  thumbnail_url?: string;
  difficulty: string;
  estimated_hours?: number;
  order_index: number;
  is_published: boolean;
}

export interface Lesson {
  id: string;
  course_id: string;
  lesson_title: string;
  lesson_type: string;
  content?: string;
  video_url?: string;
  code_template?: string;
  language?: string;
  xp_reward: number;
  order_index: number;
  is_published: boolean;
}

export interface Challenge {
  id: string;
  lesson_id?: string;
  track_id?: string;
  challenge_title: string;
  description?: string;
  difficulty: string;
  language: string;
  starter_code?: string;
  solution_code?: string;
  test_cases?: any;
  xp_reward: number;
  time_limit_seconds: number;
  is_published: boolean;
}

export interface ChallengeSubmission {
  id: string;
  user_id: string;
  challenge_id: string;
  submitted_code: string;
  status: string;
  test_results?: any;
  execution_time_ms?: number;
  xp_earned: number;
  attempts: number;
  created_at: string;
}

export const gamificationService = {
  // User Profile Management
  async createProfile(userId: string, username: string, profile: Partial<UserProfile>): Promise<UserProfile> {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert({ user_id: userId, username, ...profile })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
    const { error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('user_id', userId);
    if (error) throw error;
  },

  // User Progress Management
  async initializeProgress(userId: string): Promise<UserProgress> {
    const { data, error } = await supabase
      .from('user_progress')
      .insert({ user_id: userId })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getProgress(userId: string): Promise<UserProgress | null> {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async addXP(userId: string, xpAmount: number): Promise<UserProgress> {
    const progress = await this.getProgress(userId);
    if (!progress) throw new Error('User progress not found');

    const newXP = progress.total_xp + xpAmount;
    const newLevel = await this.calculateLevel(newXP);

    const { data, error } = await supabase
      .from('user_progress')
      .update({
        total_xp: newXP,
        current_level: newLevel,
        last_activity_date: new Date().toISOString().split('T')[0],
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async calculateLevel(totalXP: number): Promise<number> {
    const { data, error } = await supabase
      .from('levels')
      .select('level_number')
      .lte('xp_required', totalXP)
      .order('level_number', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data?.level_number || 1;
  },

  async updateStreak(userId: string): Promise<void> {
    const progress = await this.getProgress(userId);
    if (!progress) return;

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    let newStreak = progress.streak_days;

    if (progress.last_activity_date === yesterday) {
      newStreak += 1;
    } else if (progress.last_activity_date !== today) {
      newStreak = 1;
    }

    const { error } = await supabase
      .from('user_progress')
      .update({
        streak_days: newStreak,
        last_activity_date: today,
      })
      .eq('user_id', userId);

    if (error) throw error;
  },

  // Levels
  async getAllLevels(): Promise<Level[]> {
    const { data, error } = await supabase
      .from('levels')
      .select('*')
      .order('level_number', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async getLevel(levelNumber: number): Promise<Level | null> {
    const { data, error } = await supabase
      .from('levels')
      .select('*')
      .eq('level_number', levelNumber)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  // Badges
  async getAllBadges(): Promise<Badge[]> {
    const { data, error } = await supabase
      .from('badges')
      .select('*')
      .order('category', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async getUserBadges(userId: string): Promise<UserBadge[]> {
    const { data, error } = await supabase
      .from('user_badges')
      .select('*, badge:badges(*)')
      .eq('user_id', userId)
      .order('earned_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async awardBadge(userId: string, badgeId: string): Promise<UserBadge> {
    const { data, error } = await supabase
      .from('user_badges')
      .insert({ user_id: userId, badge_id: badgeId })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Achievements
  async getAllAchievements(): Promise<Achievement[]> {
    const { data, error } = await supabase
      .from('achievements')
      .select('*');
    if (error) throw error;
    return data || [];
  },

  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    const { data, error } = await supabase
      .from('user_achievements')
      .select('*, achievement:achievements(*)')
      .eq('user_id', userId);
    if (error) throw error;
    return data || [];
  },

  async updateAchievementProgress(
    userId: string,
    achievementId: string,
    progress: number
  ): Promise<void> {
    const achievement = await this.getAchievement(achievementId);
    if (!achievement) return;

    const completed = progress >= achievement.requirement_value;

    const { error } = await supabase
      .from('user_achievements')
      .upsert({
        user_id: userId,
        achievement_id: achievementId,
        progress,
        completed,
        completed_at: completed ? new Date().toISOString() : null,
      });

    if (error) throw error;

    if (completed && achievement.badge_id) {
      await this.awardBadge(userId, achievement.badge_id);
    }
    if (completed && achievement.xp_reward > 0) {
      await this.addXP(userId, achievement.xp_reward);
    }
  },

  async getAchievement(achievementId: string): Promise<Achievement | null> {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('id', achievementId)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  // Leaderboard
  async getLeaderboard(
    scope: string = 'global',
    scopeValue?: string,
    limit: number = 100
  ): Promise<LeaderboardEntry[]> {
    let query = supabase
      .from('leaderboards')
      .select('*, profile:user_profiles!user_id(*)')
      .eq('scope', scope)
      .order('total_xp', { ascending: false })
      .limit(limit);

    if (scopeValue) {
      query = query.eq('scope_value', scopeValue);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async updateLeaderboard(userId: string, totalXP: number): Promise<void> {
    const profile = await this.getProfile(userId);

    await supabase.from('leaderboards').upsert({
      user_id: userId,
      scope: 'global',
      total_xp: totalXP,
      week_start: new Date().toISOString().split('T')[0],
    });

    if (profile?.college) {
      await supabase.from('leaderboards').upsert({
        user_id: userId,
        scope: 'college',
        scope_value: profile.college,
        total_xp: totalXP,
        week_start: new Date().toISOString().split('T')[0],
      });
    }
  },

  // Career Tracks
  async getAllTracks(): Promise<CareerTrack[]> {
    const { data, error } = await supabase
      .from('career_tracks')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async getTrack(trackId: string): Promise<CareerTrack | null> {
    const { data, error } = await supabase
      .from('career_tracks')
      .select('*')
      .eq('id', trackId)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  // Courses
  async getCoursesByTrack(trackId: string): Promise<Course[]> {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('track_id', trackId)
      .eq('is_published', true)
      .order('order_index', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async getCourse(courseId: string): Promise<Course | null> {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  // Lessons
  async getLessonsByCourse(courseId: string): Promise<Lesson[]> {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', courseId)
      .eq('is_published', true)
      .order('order_index', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async getLesson(lessonId: string): Promise<Lesson | null> {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', lessonId)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async completeLesson(userId: string, lessonId: string): Promise<void> {
    const lesson = await this.getLesson(lessonId);
    if (!lesson) return;

    const progress = await this.getProgress(userId);
    if (!progress) return;

    await supabase
      .from('user_progress')
      .update({
        lessons_completed: progress.lessons_completed + 1,
      })
      .eq('user_id', userId);

    await this.addXP(userId, lesson.xp_reward);
    await this.updateStreak(userId);
  },

  // Challenges
  async getChallengesByTrack(trackId: string): Promise<Challenge[]> {
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .eq('track_id', trackId)
      .eq('is_published', true);
    if (error) throw error;
    return data || [];
  },

  async getChallengesByLesson(lessonId: string): Promise<Challenge[]> {
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .eq('lesson_id', lessonId)
      .eq('is_published', true);
    if (error) throw error;
    return data || [];
  },

  async getChallenge(challengeId: string): Promise<Challenge | null> {
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .eq('id', challengeId)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async submitChallenge(
    userId: string,
    challengeId: string,
    submittedCode: string,
    status: string,
    testResults?: any,
    executionTime?: number
  ): Promise<ChallengeSubmission> {
    const challenge = await this.getChallenge(challengeId);
    if (!challenge) throw new Error('Challenge not found');

    const xpEarned = status === 'passed' ? challenge.xp_reward : 0;

    const { data, error } = await supabase
      .from('challenge_submissions')
      .insert({
        user_id: userId,
        challenge_id: challengeId,
        submitted_code: submittedCode,
        status,
        test_results: testResults,
        execution_time_ms: executionTime,
        xp_earned: xpEarned,
        attempts: 1,
      })
      .select()
      .single();

    if (error) throw error;

    if (status === 'passed') {
      const progress = await this.getProgress(userId);
      if (progress) {
        await supabase
          .from('user_progress')
          .update({
            challenges_completed: progress.challenges_completed + 1,
          })
          .eq('user_id', userId);

        await this.addXP(userId, xpEarned);
        await this.updateStreak(userId);
      }
    }

    return data;
  },

  async getUserSubmissions(userId: string, challengeId?: string): Promise<ChallengeSubmission[]> {
    let query = supabase
      .from('challenge_submissions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (challengeId) {
      query = query.eq('challenge_id', challengeId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },
};
