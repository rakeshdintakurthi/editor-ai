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

export interface CourseLevel {
  id: string;
  course_id: string;
  level_number: number;
  level_name: string;
  level_description?: string;
  xp_required: number;
  unlock_criteria?: any;
  order_index: number;
  created_at: string;
}

export interface LevelModule {
  id: string;
  level_id: string;
  module_number: number;
  module_title: string;
  module_description?: string;
  module_type: string;
  content?: any;
  estimated_minutes: number;
  xp_reward: number;
  is_required: boolean;
  order_index: number;
  created_at: string;
}

export interface ModuleCompletion {
  id: string;
  user_id: string;
  module_id: string;
  completed: boolean;
  score?: number;
  time_spent_minutes: number;
  attempts: number;
  completed_at?: string;
  created_at: string;
}

export interface UserCourseProgress {
  id: string;
  user_id: string;
  course_id: string;
  current_level_number: number;
  current_module_id?: string;
  total_modules_completed: number;
  total_xp_earned: number;
  completion_percentage: number;
  last_accessed_at: string;
  started_at: string;
  completed_at?: string;
  certificate_id?: string;
  created_at: string;
}

export interface CourseMaterial {
  id: string;
  module_id: string;
  material_type: string;
  title: string;
  description?: string;
  url?: string;
  file_size_kb?: number;
  duration_minutes?: number;
  thumbnail_url?: string;
  content_data?: any;
  order_index: number;
  is_required: boolean;
  created_at: string;
}

export interface MaterialProgress {
  id: string;
  user_id: string;
  material_id: string;
  viewed: boolean;
  progress_percentage: number;
  time_spent_minutes: number;
  last_position: number;
  completed: boolean;
  completed_at?: string;
  created_at: string;
}

export interface CourseCertificate {
  id: string;
  user_id: string;
  course_id: string;
  certificate_number: string;
  course_name: string;
  completion_date: string;
  total_xp_earned: number;
  final_score?: number;
  hours_spent?: number;
  issued_at: string;
  verification_url?: string;
  certificate_data?: any;
  created_at: string;
}

export interface UserStar {
  id: string;
  user_id: string;
  star_category: string;
  star_count: number;
  reason?: string;
  awarded_at: string;
  created_at: string;
}

export interface ChatSession {
  id: string;
  user_id: string;
  module_id?: string;
  session_type: string;
  topic?: string;
  language?: string;
  status: string;
  created_at: string;
  ended_at?: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  sender_type: string;
  message_content: string;
  code_snippet?: string;
  language?: string;
  message_metadata?: any;
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

  // Course Levels & Modules
  async getCourseLevels(courseId: string): Promise<CourseLevel[]> {
    const { data, error } = await supabase
      .from('course_levels')
      .select('*')
      .eq('course_id', courseId)
      .order('level_number', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async getCourseLevel(levelId: string): Promise<CourseLevel | null> {
    const { data, error } = await supabase
      .from('course_levels')
      .select('*')
      .eq('id', levelId)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async getLevelModules(levelId: string): Promise<LevelModule[]> {
    const { data, error } = await supabase
      .from('level_modules')
      .select('*')
      .eq('level_id', levelId)
      .order('order_index', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async getModule(moduleId: string): Promise<LevelModule | null> {
    const { data, error } = await supabase
      .from('level_modules')
      .select('*')
      .eq('id', moduleId)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async completeModule(userId: string, moduleId: string, score?: number, timeSpent?: number): Promise<void> {
    const module = await this.getModule(moduleId);
    if (!module) return;

    await supabase
      .from('module_completions')
      .upsert({
        user_id: userId,
        module_id: moduleId,
        completed: true,
        score,
        time_spent_minutes: timeSpent || 0,
        completed_at: new Date().toISOString(),
      });

    await this.addXP(userId, module.xp_reward);
    await this.updateStreak(userId);
    await this.updateCourseProgress(userId, moduleId);
  },

  async getModuleCompletion(userId: string, moduleId: string): Promise<ModuleCompletion | null> {
    const { data, error } = await supabase
      .from('module_completions')
      .select('*')
      .eq('user_id', userId)
      .eq('module_id', moduleId)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  // User Course Progress & Journey
  async getUserCourseProgress(userId: string, courseId: string): Promise<UserCourseProgress | null> {
    const { data, error } = await supabase
      .from('user_course_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async startCourse(userId: string, courseId: string): Promise<UserCourseProgress> {
    const { data, error } = await supabase
      .from('user_course_progress')
      .insert({
        user_id: userId,
        course_id: courseId,
        current_level_number: 1,
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateCourseProgress(userId: string, currentModuleId: string): Promise<void> {
    const module = await this.getModule(currentModuleId);
    if (!module) return;

    const level = await this.getCourseLevel(module.level_id);
    if (!level) return;

    const progress = await this.getUserCourseProgress(userId, level.course_id);
    if (!progress) return;

    const completedModules = await supabase
      .from('module_completions')
      .select('id')
      .eq('user_id', userId)
      .eq('completed', true);

    const totalModules = await supabase
      .from('level_modules')
      .select('id')
      .eq('level_id', module.level_id);

    const completionPercentage = totalModules.data
      ? (completedModules.data?.length || 0) / totalModules.data.length * 100
      : 0;

    await supabase
      .from('user_course_progress')
      .update({
        current_level_number: level.level_number,
        current_module_id: currentModuleId,
        total_modules_completed: completedModules.data?.length || 0,
        completion_percentage: Math.round(completionPercentage),
        last_accessed_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .eq('course_id', level.course_id);

    if (level.level_number === 10 && completionPercentage === 100) {
      await this.generateCertificate(userId, level.course_id);
    }
  },

  async resumeCourse(userId: string, courseId: string): Promise<{ level: CourseLevel | null; module: LevelModule | null }> {
    const progress = await this.getUserCourseProgress(userId, courseId);
    if (!progress || !progress.current_module_id) {
      return { level: null, module: null };
    }

    const module = await this.getModule(progress.current_module_id);
    const level = module ? await this.getCourseLevel(module.level_id) : null;

    return { level, module };
  },

  // Course Materials
  async getMaterialsByModule(moduleId: string): Promise<CourseMaterial[]> {
    const { data, error } = await supabase
      .from('course_materials')
      .select('*')
      .eq('module_id', moduleId)
      .order('order_index', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async getMaterial(materialId: string): Promise<CourseMaterial | null> {
    const { data, error } = await supabase
      .from('course_materials')
      .select('*')
      .eq('id', materialId)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async updateMaterialProgress(
    userId: string,
    materialId: string,
    progressPercentage: number,
    timeSpent?: number
  ): Promise<void> {
    await supabase
      .from('material_progress')
      .upsert({
        user_id: userId,
        material_id: materialId,
        viewed: progressPercentage > 0,
        progress_percentage: progressPercentage,
        time_spent_minutes: timeSpent || 0,
        completed: progressPercentage >= 100,
        completed_at: progressPercentage >= 100 ? new Date().toISOString() : null,
      });
  },

  async getMaterialProgress(userId: string, materialId: string): Promise<MaterialProgress | null> {
    const { data, error } = await supabase
      .from('material_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('material_id', materialId)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  // Certificates
  async generateCertificate(userId: string, courseId: string): Promise<CourseCertificate> {
    const course = await this.getCourse(courseId);
    if (!course) throw new Error('Course not found');

    const progress = await this.getUserCourseProgress(userId, courseId);
    if (!progress) throw new Error('Course progress not found');

    const certificateNumber = `CERT-${Date.now()}-${userId.substring(0, 8)}`;

    const { data, error } = await supabase
      .from('course_certificates')
      .insert({
        user_id: userId,
        course_id: courseId,
        certificate_number: certificateNumber,
        course_name: course.course_name,
        total_xp_earned: progress.total_xp_earned,
        verification_url: `https://example.com/verify/${certificateNumber}`,
      })
      .select()
      .single();

    if (error) throw error;

    await supabase
      .from('user_course_progress')
      .update({
        completed_at: new Date().toISOString(),
        certificate_id: data.id,
      })
      .eq('user_id', userId)
      .eq('course_id', courseId);

    await this.awardStar(userId, 'course_completion', 1, `Completed ${course.course_name}`);

    return data;
  },

  async getUserCertificates(userId: string): Promise<CourseCertificate[]> {
    const { data, error } = await supabase
      .from('course_certificates')
      .select('*')
      .eq('user_id', userId)
      .order('issued_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  // Stars
  async awardStar(userId: string, category: string, count: number, reason?: string): Promise<UserStar> {
    const { data, error } = await supabase
      .from('user_stars')
      .insert({
        user_id: userId,
        star_category: category,
        star_count: count,
        reason,
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getUserStars(userId: string): Promise<UserStar[]> {
    const { data, error } = await supabase
      .from('user_stars')
      .select('*')
      .eq('user_id', userId)
      .order('awarded_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getTotalStars(userId: string): Promise<number> {
    const { data, error } = await supabase
      .from('user_stars')
      .select('star_count')
      .eq('user_id', userId);
    if (error) throw error;
    return data?.reduce((sum, star) => sum + star.star_count, 0) || 0;
  },

  // Chat Sessions
  async createChatSession(userId: string, moduleId?: string, sessionType?: string): Promise<ChatSession> {
    const { data, error } = await supabase
      .from('chat_sessions')
      .insert({
        user_id: userId,
        module_id: moduleId,
        session_type: sessionType || 'general',
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getChatSession(sessionId: string): Promise<ChatSession | null> {
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('id', sessionId)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async getUserChatSessions(userId: string): Promise<ChatSession[]> {
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async addChatMessage(
    sessionId: string,
    senderType: string,
    messageContent: string,
    codeSnippet?: string
  ): Promise<ChatMessage> {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        session_id: sessionId,
        sender_type: senderType,
        message_content: messageContent,
        code_snippet: codeSnippet,
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getChatMessages(sessionId: string): Promise<ChatMessage[]> {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async endChatSession(sessionId: string): Promise<void> {
    await supabase
      .from('chat_sessions')
      .update({
        status: 'archived',
        ended_at: new Date().toISOString(),
      })
      .eq('id', sessionId);
  },
};
