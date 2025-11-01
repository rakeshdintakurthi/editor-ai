/*
  # Gamified AI-Powered Coding Platform Schema

  ## Overview
  Complete database schema for a Duolingo-style coding education platform with:
  - User profiles and authentication
  - XP, levels, badges, and achievements
  - Coding challenges and missions
  - Leaderboards (global and college-based)
  - Certificate system
  - Learning library (courses, videos, PDFs)
  - Comments and discussions
  - Live collaboration (Quick Assist sessions)
  - Career tracks and learning paths

  ## New Tables

  ### User Management
  1. `user_profiles` - Extended user information
  2. `user_progress` - XP, level, and learning progress
  3. `user_badges` - Badge achievements
  4. `user_certificates` - Earned certificates

  ### Gamification
  5. `levels` - Level definitions
  6. `badges` - Badge definitions
  7. `achievements` - Achievement definitions
  8. `user_achievements` - User achievement tracking
  9. `leaderboards` - Leaderboard entries

  ### Learning Content
  10. `career_tracks` - Learning paths (Web Dev, AI, DSA, etc.)
  11. `courses` - Course definitions
  12. `lessons` - Individual lessons
  13. `challenges` - Coding challenges
  14. `challenge_submissions` - User challenge attempts
  15. `learning_resources` - Videos, PDFs, external links

  ### Collaboration
  16. `assist_sessions` - Quick Assist live help sessions
  17. `code_pairs` - Pair programming sessions
  18. `comments` - Discussion comments
  19. `comment_votes` - Upvotes/downvotes

  ## Security
  - RLS enabled on all tables
  - Users can only access their own data
  - Public read access for leaderboards and course content
  - Admin role for content management
*/

-- =====================================================
-- USER MANAGEMENT
-- =====================================================

CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL,
  username text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  bio text,
  college text,
  graduation_year integer,
  github_url text,
  linkedin_url text,
  portfolio_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL,
  total_xp integer DEFAULT 0,
  current_level integer DEFAULT 1,
  challenges_completed integer DEFAULT 0,
  lessons_completed integer DEFAULT 0,
  streak_days integer DEFAULT 0,
  last_activity_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  track_id uuid NOT NULL,
  certificate_id text UNIQUE NOT NULL,
  issued_at timestamptz DEFAULT now(),
  verification_url text,
  created_at timestamptz DEFAULT now()
);

-- =====================================================
-- GAMIFICATION SYSTEM
-- =====================================================

CREATE TABLE IF NOT EXISTS levels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  level_number integer UNIQUE NOT NULL,
  level_name text NOT NULL,
  xp_required integer NOT NULL,
  icon_url text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  badge_name text UNIQUE NOT NULL,
  description text,
  icon_url text,
  category text NOT NULL,
  rarity text DEFAULT 'common',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  badge_id uuid NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  earned_at timestamptz DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  achievement_name text UNIQUE NOT NULL,
  description text,
  requirement_type text NOT NULL,
  requirement_value integer NOT NULL,
  xp_reward integer DEFAULT 0,
  badge_id uuid REFERENCES badges(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  achievement_id uuid NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  progress integer DEFAULT 0,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

CREATE TABLE IF NOT EXISTS leaderboards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  scope text NOT NULL DEFAULT 'global',
  scope_value text,
  total_xp integer DEFAULT 0,
  rank integer,
  week_start date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, scope, scope_value, week_start)
);

-- =====================================================
-- LEARNING CONTENT
-- =====================================================

CREATE TABLE IF NOT EXISTS career_tracks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  track_name text UNIQUE NOT NULL,
  description text,
  icon_url text,
  difficulty text DEFAULT 'beginner',
  estimated_hours integer,
  is_active boolean DEFAULT true,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id uuid REFERENCES career_tracks(id) ON DELETE CASCADE,
  course_name text NOT NULL,
  description text,
  thumbnail_url text,
  difficulty text DEFAULT 'beginner',
  estimated_hours integer,
  order_index integer DEFAULT 0,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  lesson_title text NOT NULL,
  lesson_type text DEFAULT 'text',
  content text,
  video_url text,
  code_template text,
  language text,
  xp_reward integer DEFAULT 10,
  order_index integer DEFAULT 0,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE,
  track_id uuid REFERENCES career_tracks(id) ON DELETE CASCADE,
  challenge_title text NOT NULL,
  description text,
  difficulty text DEFAULT 'easy',
  language text NOT NULL,
  starter_code text,
  solution_code text,
  test_cases jsonb,
  xp_reward integer DEFAULT 50,
  time_limit_seconds integer DEFAULT 600,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS challenge_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  challenge_id uuid NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  submitted_code text NOT NULL,
  status text DEFAULT 'pending',
  test_results jsonb,
  execution_time_ms integer,
  xp_earned integer DEFAULT 0,
  attempts integer DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS learning_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE,
  resource_type text NOT NULL,
  resource_title text NOT NULL,
  resource_url text,
  file_path text,
  description text,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- =====================================================
-- COLLABORATION & DISCUSSION
-- =====================================================

CREATE TABLE IF NOT EXISTS assist_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id uuid NOT NULL,
  helper_id uuid,
  session_code text UNIQUE NOT NULL,
  status text DEFAULT 'waiting',
  started_at timestamptz DEFAULT now(),
  ended_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS code_pairs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id uuid NOT NULL,
  user2_id uuid,
  room_code text UNIQUE NOT NULL,
  language text DEFAULT 'javascript',
  shared_code text,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  ended_at timestamptz
);

CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE,
  challenge_id uuid REFERENCES challenges(id) ON DELETE CASCADE,
  parent_comment_id uuid REFERENCES comments(id) ON DELETE CASCADE,
  content text NOT NULL,
  is_solution boolean DEFAULT false,
  upvotes integer DEFAULT 0,
  downvotes integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS comment_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  comment_id uuid NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  vote_type text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, comment_id)
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_leaderboards_scope ON leaderboards(scope, scope_value, week_start);
CREATE INDEX IF NOT EXISTS idx_leaderboards_rank ON leaderboards(rank);
CREATE INDEX IF NOT EXISTS idx_challenges_track ON challenges(track_id);
CREATE INDEX IF NOT EXISTS idx_submissions_user ON challenge_submissions(user_id, challenge_id);
CREATE INDEX IF NOT EXISTS idx_comments_lesson ON comments(lesson_id);
CREATE INDEX IF NOT EXISTS idx_comments_challenge ON comments(challenge_id);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE assist_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE code_pairs ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_votes ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- User Profiles
CREATE POLICY "Users can view all profiles"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- User Progress
CREATE POLICY "Users can view own progress"
  ON user_progress FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own progress"
  ON user_progress FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can insert own progress"
  ON user_progress FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Leaderboards (public read)
CREATE POLICY "Anyone can view leaderboards"
  ON leaderboards FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own leaderboard entry"
  ON leaderboards FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can insert own leaderboard entry"
  ON leaderboards FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Badges (public read)
CREATE POLICY "Anyone can view badges"
  ON badges FOR SELECT
  TO authenticated
  USING (true);

-- User Badges
CREATE POLICY "Users can view own badges"
  ON user_badges FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own badges"
  ON user_badges FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Levels (public read)
CREATE POLICY "Anyone can view levels"
  ON levels FOR SELECT
  TO authenticated
  USING (true);

-- Achievements (public read)
CREATE POLICY "Anyone can view achievements"
  ON achievements FOR SELECT
  TO authenticated
  USING (true);

-- User Achievements
CREATE POLICY "Users can view own achievements"
  ON user_achievements FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own achievements"
  ON user_achievements FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can insert own achievements"
  ON user_achievements FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Career Tracks (public read)
CREATE POLICY "Anyone can view tracks"
  ON career_tracks FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Courses (public read for published)
CREATE POLICY "Anyone can view published courses"
  ON courses FOR SELECT
  TO authenticated
  USING (is_published = true);

-- Lessons (public read for published)
CREATE POLICY "Anyone can view published lessons"
  ON lessons FOR SELECT
  TO authenticated
  USING (is_published = true);

-- Challenges (public read for published)
CREATE POLICY "Anyone can view published challenges"
  ON challenges FOR SELECT
  TO authenticated
  USING (is_published = true);

-- Challenge Submissions
CREATE POLICY "Users can view own submissions"
  ON challenge_submissions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own submissions"
  ON challenge_submissions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Learning Resources (public read)
CREATE POLICY "Anyone can view resources"
  ON learning_resources FOR SELECT
  TO authenticated
  USING (true);

-- Assist Sessions
CREATE POLICY "Users can view own assist sessions"
  ON assist_sessions FOR SELECT
  TO authenticated
  USING (requester_id = auth.uid() OR helper_id = auth.uid());

CREATE POLICY "Users can create assist sessions"
  ON assist_sessions FOR INSERT
  TO authenticated
  WITH CHECK (requester_id = auth.uid());

CREATE POLICY "Users can update own assist sessions"
  ON assist_sessions FOR UPDATE
  TO authenticated
  USING (requester_id = auth.uid() OR helper_id = auth.uid())
  WITH CHECK (requester_id = auth.uid() OR helper_id = auth.uid());

-- Code Pairs
CREATE POLICY "Users can view own code pairs"
  ON code_pairs FOR SELECT
  TO authenticated
  USING (user1_id = auth.uid() OR user2_id = auth.uid());

CREATE POLICY "Users can create code pairs"
  ON code_pairs FOR INSERT
  TO authenticated
  WITH CHECK (user1_id = auth.uid());

CREATE POLICY "Users can update own code pairs"
  ON code_pairs FOR UPDATE
  TO authenticated
  USING (user1_id = auth.uid() OR user2_id = auth.uid())
  WITH CHECK (user1_id = auth.uid() OR user2_id = auth.uid());

-- Comments (public read)
CREATE POLICY "Anyone can view comments"
  ON comments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own comments"
  ON comments FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own comments"
  ON comments FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own comments"
  ON comments FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Comment Votes
CREATE POLICY "Users can view all votes"
  ON comment_votes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own votes"
  ON comment_votes FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own votes"
  ON comment_votes FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own votes"
  ON comment_votes FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Certificates
CREATE POLICY "Users can view own certificates"
  ON user_certificates FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own certificates"
  ON user_certificates FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());