/*
  # Multi-Level Course System with Journey Tracking

  ## Overview
  Comprehensive enhancement to the learning platform:
  - 10 Levels per Course with Modules
  - Certificate Generation System
  - Mock Videos & PDF Resources
  - Chat Widget for Q&A Assistance
  - Star Rating System for Profile
  - Journey Tracking & Resume Functionality
  - Real-time Progress Updates

  ## New Tables

  ### Course Structure
  1. `course_levels` - 10 levels per course
  2. `level_modules` - Modules within each level
  3. `module_completions` - Track user progress through modules
  4. `user_course_progress` - Overall course journey tracking

  ### Resources & Materials
  5. `course_materials` - Videos, PDFs, documents per module
  6. `material_progress` - Track viewed/completed materials

  ### Chat & Assistance
  7. `chat_sessions` - Q&A chat sessions
  8. `chat_messages` - Individual chat messages

  ### Certificates & Stars
  9. `certificates` - Generated certificates (updated)
  10. `user_stars` - Star ratings for profile achievements

  ## Key Features
  - Automatic certificate generation upon level 10 completion
  - Journey resume from last checkpoint
  - Real-time progress tracking
  - Mock video/PDF system
  - AI chat assistance for coding questions
*/

-- =====================================================
-- COURSE STRUCTURE - LEVELS & MODULES
-- =====================================================

-- Course Levels (10 levels per course)
CREATE TABLE IF NOT EXISTS course_levels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  level_number integer NOT NULL CHECK (level_number BETWEEN 1 AND 10),
  level_name text NOT NULL,
  level_description text,
  xp_required integer DEFAULT 0,
  unlock_criteria jsonb DEFAULT '{}',
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(course_id, level_number)
);

-- Modules within each level
CREATE TABLE IF NOT EXISTS level_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  level_id uuid NOT NULL REFERENCES course_levels(id) ON DELETE CASCADE,
  module_number integer NOT NULL,
  module_title text NOT NULL,
  module_description text,
  module_type text DEFAULT 'lesson', -- lesson, challenge, quiz, project
  content jsonb DEFAULT '{}',
  estimated_minutes integer DEFAULT 30,
  xp_reward integer DEFAULT 50,
  is_required boolean DEFAULT true,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(level_id, module_number)
);

-- Track module completions
CREATE TABLE IF NOT EXISTS module_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  module_id uuid NOT NULL REFERENCES level_modules(id) ON DELETE CASCADE,
  completed boolean DEFAULT false,
  score integer,
  time_spent_minutes integer DEFAULT 0,
  attempts integer DEFAULT 0,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, module_id)
);

-- User course progress & journey tracking
CREATE TABLE IF NOT EXISTS user_course_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  current_level_number integer DEFAULT 1,
  current_module_id uuid REFERENCES level_modules(id),
  total_modules_completed integer DEFAULT 0,
  total_xp_earned integer DEFAULT 0,
  completion_percentage integer DEFAULT 0,
  last_accessed_at timestamptz DEFAULT now(),
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  certificate_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- =====================================================
-- RESOURCES & MATERIALS
-- =====================================================

-- Course materials (videos, PDFs, docs)
CREATE TABLE IF NOT EXISTS course_materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id uuid NOT NULL REFERENCES level_modules(id) ON DELETE CASCADE,
  material_type text NOT NULL, -- video, pdf, article, code_template, quiz
  title text NOT NULL,
  description text,
  url text, -- mock video URL or PDF path
  file_size_kb integer,
  duration_minutes integer,
  thumbnail_url text,
  content_data jsonb DEFAULT '{}', -- for mock data
  order_index integer DEFAULT 0,
  is_required boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Track material viewing progress
CREATE TABLE IF NOT EXISTS material_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  material_id uuid NOT NULL REFERENCES course_materials(id) ON DELETE CASCADE,
  viewed boolean DEFAULT false,
  progress_percentage integer DEFAULT 0,
  time_spent_minutes integer DEFAULT 0,
  last_position integer DEFAULT 0, -- for video position
  completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, material_id)
);

-- =====================================================
-- CHAT ASSISTANCE SYSTEM
-- =====================================================

-- Chat sessions for Q&A
CREATE TABLE IF NOT EXISTS chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  module_id uuid REFERENCES level_modules(id),
  session_type text DEFAULT 'general', -- general, debug, concept, code_review
  topic text,
  language text,
  status text DEFAULT 'active', -- active, archived
  created_at timestamptz DEFAULT now(),
  ended_at timestamptz
);

-- Chat messages
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  sender_type text NOT NULL, -- user, assistant
  message_content text NOT NULL,
  code_snippet text,
  language text,
  message_metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- =====================================================
-- CERTIFICATES & STARS
-- =====================================================

-- Enhanced certificates table
CREATE TABLE IF NOT EXISTS course_certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  certificate_number text UNIQUE NOT NULL,
  course_name text NOT NULL,
  completion_date date DEFAULT CURRENT_DATE,
  total_xp_earned integer DEFAULT 0,
  final_score integer,
  hours_spent integer,
  issued_at timestamptz DEFAULT now(),
  verification_url text,
  certificate_data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Star rating system for profile
CREATE TABLE IF NOT EXISTS user_stars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  star_category text NOT NULL, -- course_completion, challenge_master, streak_keeper, helper, top_performer
  star_count integer DEFAULT 0,
  reason text,
  awarded_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_course_levels_course ON course_levels(course_id, level_number);
CREATE INDEX IF NOT EXISTS idx_level_modules_level ON level_modules(level_id, order_index);
CREATE INDEX IF NOT EXISTS idx_module_completions_user ON module_completions(user_id, module_id);
CREATE INDEX IF NOT EXISTS idx_user_course_progress_user ON user_course_progress(user_id, course_id);
CREATE INDEX IF NOT EXISTS idx_course_materials_module ON course_materials(module_id, order_index);
CREATE INDEX IF NOT EXISTS idx_material_progress_user ON material_progress(user_id, material_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user ON chat_sessions(user_id, status);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages(session_id, created_at);
CREATE INDEX IF NOT EXISTS idx_certificates_user ON course_certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_user_stars_user ON user_stars(user_id, star_category);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE course_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE level_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stars ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Course Levels (public read)
CREATE POLICY "Anyone can view course levels"
  ON course_levels FOR SELECT
  TO authenticated
  USING (true);

-- Level Modules (public read)
CREATE POLICY "Anyone can view level modules"
  ON level_modules FOR SELECT
  TO authenticated
  USING (true);

-- Module Completions
CREATE POLICY "Users can view own module completions"
  ON module_completions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own module completions"
  ON module_completions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own module completions"
  ON module_completions FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- User Course Progress
CREATE POLICY "Users can view own course progress"
  ON user_course_progress FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own course progress"
  ON user_course_progress FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own course progress"
  ON user_course_progress FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Course Materials (public read)
CREATE POLICY "Anyone can view course materials"
  ON course_materials FOR SELECT
  TO authenticated
  USING (true);

-- Material Progress
CREATE POLICY "Users can view own material progress"
  ON material_progress FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own material progress"
  ON material_progress FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own material progress"
  ON material_progress FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Chat Sessions
CREATE POLICY "Users can view own chat sessions"
  ON chat_sessions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own chat sessions"
  ON chat_sessions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own chat sessions"
  ON chat_sessions FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Chat Messages
CREATE POLICY "Users can view own chat messages"
  ON chat_messages FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM chat_sessions
    WHERE chat_sessions.id = chat_messages.session_id
    AND chat_sessions.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert messages in own sessions"
  ON chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM chat_sessions
    WHERE chat_sessions.id = chat_messages.session_id
    AND chat_sessions.user_id = auth.uid()
  ));

-- Course Certificates
CREATE POLICY "Users can view own certificates"
  ON course_certificates FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Anyone can view certificates by number"
  ON course_certificates FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own certificates"
  ON course_certificates FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- User Stars
CREATE POLICY "Anyone can view user stars"
  ON user_stars FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can view own stars"
  ON user_stars FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own stars"
  ON user_stars FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- =====================================================
-- MOCK DATA SEEDING
-- =====================================================

-- Insert mock course levels for existing courses
INSERT INTO course_levels (course_id, level_number, level_name, level_description, xp_required)
SELECT
  c.id,
  generate_series(1, 10) as level_number,
  'Level ' || generate_series(1, 10) || ' - ' ||
    CASE generate_series(1, 10)
      WHEN 1 THEN 'Foundations'
      WHEN 2 THEN 'Basics'
      WHEN 3 THEN 'Intermediate Concepts'
      WHEN 4 THEN 'Advanced Techniques'
      WHEN 5 THEN 'Mastery Path'
      WHEN 6 THEN 'Expert Strategies'
      WHEN 7 THEN 'Professional Skills'
      WHEN 8 THEN 'Real-world Projects'
      WHEN 9 THEN 'Capstone Challenges'
      WHEN 10 THEN 'Master Certification'
    END as level_name,
  'Complete all modules in this level to progress' as level_description,
  (generate_series(1, 10) * 500) as xp_required
FROM courses c
WHERE c.is_published = true
ON CONFLICT (course_id, level_number) DO NOTHING;

-- Insert mock modules for each level (4-6 modules per level)
INSERT INTO level_modules (level_id, module_number, module_title, module_description, module_type, xp_reward, estimated_minutes)
SELECT
  cl.id as level_id,
  mod_num as module_number,
  'Module ' || mod_num || ': ' ||
    CASE (mod_num % 4)
      WHEN 1 THEN 'Conceptual Learning'
      WHEN 2 THEN 'Practical Exercise'
      WHEN 3 THEN 'Coding Challenge'
      ELSE 'Assessment Quiz'
    END as module_title,
  'Complete this module to gain practical experience' as module_description,
  CASE (mod_num % 4)
    WHEN 1 THEN 'lesson'
    WHEN 2 THEN 'challenge'
    WHEN 3 THEN 'challenge'
    ELSE 'quiz'
  END as module_type,
  (50 + (mod_num * 10)) as xp_reward,
  (20 + (mod_num * 5)) as estimated_minutes
FROM course_levels cl
CROSS JOIN generate_series(1, 5) as mod_num
ON CONFLICT (level_id, module_number) DO NOTHING;

-- Insert mock materials (videos and PDFs)
INSERT INTO course_materials (module_id, material_type, title, description, url, duration_minutes, thumbnail_url, content_data)
SELECT
  lm.id as module_id,
  CASE (RANDOM() * 2)::int
    WHEN 0 THEN 'video'
    WHEN 1 THEN 'pdf'
    ELSE 'article'
  END as material_type,
  'Introduction to ' || lm.module_title as title,
  'Comprehensive guide covering all key concepts' as description,
  CASE (RANDOM() * 2)::int
    WHEN 0 THEN 'https://example.com/videos/intro-' || SUBSTRING(lm.id::text, 1, 8) || '.mp4'
    WHEN 1 THEN 'https://example.com/pdfs/guide-' || SUBSTRING(lm.id::text, 1, 8) || '.pdf'
    ELSE 'https://example.com/articles/' || SUBSTRING(lm.id::text, 1, 8)
  END as url,
  (10 + (RANDOM() * 30)::int) as duration_minutes,
  'https://via.placeholder.com/640x360?text=Course+Video' as thumbnail_url,
  jsonb_build_object(
    'format', 'HD 1080p',
    'language', 'English',
    'captions', true,
    'downloadable', true
  ) as content_data
FROM level_modules lm
LIMIT 100
ON CONFLICT DO NOTHING;
