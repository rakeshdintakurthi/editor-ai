# Gamified AI-Powered Coding Platform

A comprehensive, Duolingo-style coding education platform that combines AI assistance, gamification, and collaborative learning.

## Features Implemented

### 1. Gamification System
- **XP and Levels**: 20 levels from Code Newbie to Code Legend
- **Badges**: 15+ achievement badges (First Steps, Speed Demon, Perfect Score, etc.)
- **Achievements**: Track progress with specific goals and rewards
- **Streak System**: Daily streak tracking to encourage consistent learning
- **Progress Dashboard**: Visual representation of your learning journey

### 2. Learning System
- **Career Tracks**: 12 learning paths including:
  - Web Development Fundamentals
  - Frontend Development
  - Backend Development
  - Full Stack JavaScript
  - Data Structures & Algorithms
  - Python Programming
  - Machine Learning & AI
  - DevOps Engineering
  - Mobile App Development
  - Cybersecurity Basics
  - Database Design
  - System Design

- **Courses & Lessons**: Structured curriculum with:
  - Video lessons
  - Text-based tutorials
  - Interactive code challenges
  - Code templates and starter code

- **Coding Challenges**:
  - Multiple difficulty levels (Easy, Medium, Hard)
  - Automated test case evaluation
  - XP rewards for completion
  - Time tracking
  - Performance metrics

### 3. Leaderboard System
- **Global Leaderboard**: Compete with learners worldwide
- **College Leaderboard**: Compare with peers from your institution
- **Weekly Rankings**: Fresh competition every week
- **Top 3 Highlights**: Special recognition for top performers

### 4. User Profile System
- **Comprehensive Profile**:
  - Avatar and bio
  - College and graduation year
  - Social links (GitHub, LinkedIn, Portfolio)
- **Statistics Dashboard**:
  - Total XP earned
  - Current level
  - Challenges completed
  - Lessons completed
  - Current streak
- **Badge Collection**: Display all earned badges by rarity

### 5. Code Editor (Existing)
- **Multi-language Support**: JavaScript, TypeScript, Python, Java, Go, HTML, CSS
- **AI Code Suggestions**: OpenAI-powered inline completions
- **Gemini AI Assistant**: Conceptual help and best practices
- **Real-time Execution**: Run code directly in the platform

### 6. AI Assistance (Existing)
- **OpenAI Integration**: Code completion, optimization, debugging, documentation
- **Gemini Integration**: Conceptual explanations, design patterns, architecture guidance

## Database Schema

The platform uses Supabase with the following tables:

### User Management
- `user_profiles` - Extended user information
- `user_progress` - XP, level, and learning progress
- `user_badges` - Badge achievements
- `user_certificates` - Earned certificates
- `user_achievements` - Achievement tracking

### Gamification
- `levels` - Level definitions (20 levels)
- `badges` - Badge definitions (15+ badges)
- `achievements` - Achievement definitions
- `leaderboards` - Leaderboard entries (global & college)

### Learning Content
- `career_tracks` - Learning paths (12 tracks)
- `courses` - Course definitions
- `lessons` - Individual lessons
- `challenges` - Coding challenges
- `challenge_submissions` - User challenge attempts
- `learning_resources` - Videos, PDFs, external links

### Collaboration (Schema Ready)
- `assist_sessions` - Quick Assist live help sessions
- `code_pairs` - Pair programming sessions
- `comments` - Discussion comments
- `comment_votes` - Upvotes/downvotes

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Supabase account and project
- OpenAI API key (optional, for code suggestions)
- Gemini API key (optional, for AI assistant)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd ai-code-editor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory:
   ```env
   # Supabase Configuration (REQUIRED for gamification)
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

   # AI Assistants (Optional)
   VITE_GEMINI_API_KEY=your_gemini_api_key
   VITE_OPENAI_API_KEY=your_openai_api_key
   ```

4. **Set up Supabase database**

   The migration has already been applied! Your database includes:
   - All gamification tables
   - 20 levels (Code Newbie to Code Legend)
   - 15+ badges (First Steps, Speed Demon, etc.)
   - 10+ achievements
   - 12 career tracks
   - Sample coding challenges

5. **Run the application**

   Terminal 1 - Frontend:
   ```bash
   npm run dev
   ```

   Terminal 2 - Backend (for code execution):
   ```bash
   npm run server
   ```

6. **Access the platform**

   Open your browser to `http://localhost:5173`

## Platform Navigation

### Learn Dashboard
- View your current level and XP progress
- Check your daily streak
- See recent badges earned
- Track daily goals
- Browse career tracks

### Learning Library
- Explore all available career tracks
- Navigate through courses and lessons
- Access learning resources
- Start coding challenges

### Leaderboard
- View global rankings
- Compare with college peers
- See top 3 performers
- Track your ranking

### Code Editor
- Write and test code in multiple languages
- Get AI-powered suggestions
- Use Gemini assistant for help
- Execute code in real-time

### Profile
- View and edit your profile
- Display badge collection
- Track statistics
- Share social links

### Analytics Dashboard
- View AI suggestion metrics
- Track acceptance rates
- Monitor response times
- Analyze usage patterns

## How It Works

### XP and Level System
1. Complete challenges to earn XP
2. XP accumulates to increase your level
3. Each level has specific XP requirements
4. Progress from Level 1 (Code Newbie) to Level 20 (Code Legend)

### Badge System
1. Earn badges by completing achievements
2. Badges have different rarities: Common, Uncommon, Rare, Epic, Legendary
3. Displayed in your profile badge collection
4. Share your achievements with the community

### Challenge System
1. Select a challenge from the library
2. Read the description and requirements
3. Write code in the provided editor
4. Run tests to validate your solution
5. Earn XP upon successful completion
6. Build your streak by solving daily

### Leaderboard Ranking
1. Earn XP through challenges and lessons
2. Your total XP determines your rank
3. Rankings update in real-time
4. Compete globally or within your college
5. Fresh weekly rankings

## Sample Challenges

The platform includes several starter challenges:

### JavaScript
- Sum Two Numbers (Easy, 50 XP)
- Reverse String (Easy, 75 XP)
- Find Maximum (Easy, 100 XP)

### Python
- Hello Python (Easy, 50 XP)
- List Sum (Easy, 75 XP)
- Count Vowels (Medium, 125 XP)

### Java
- Hello Java (Easy, 50 XP)
- Factorial (Medium, 150 XP)

## API Services

### Gamification Service (`src/lib/gamification.ts`)

Comprehensive API for all gamification features:

**User Profile**
- `createProfile()` - Create new user profile
- `getProfile()` - Get user profile
- `updateProfile()` - Update profile information

**Progress Management**
- `initializeProgress()` - Initialize user progress
- `getProgress()` - Get current progress
- `addXP()` - Add XP and auto-level up
- `updateStreak()` - Update daily streak

**Levels**
- `getAllLevels()` - Get all level definitions
- `getLevel()` - Get specific level info
- `calculateLevel()` - Calculate level from XP

**Badges**
- `getAllBadges()` - Get all badges
- `getUserBadges()` - Get user's earned badges
- `awardBadge()` - Award badge to user

**Achievements**
- `getAllAchievements()` - Get all achievements
- `getUserAchievements()` - Get user's achievements
- `updateAchievementProgress()` - Update progress

**Leaderboard**
- `getLeaderboard()` - Get leaderboard (global/college)
- `updateLeaderboard()` - Update user ranking

**Learning Content**
- `getAllTracks()` - Get all career tracks
- `getCoursesByTrack()` - Get courses in a track
- `getLessonsByCourse()` - Get lessons in a course
- `completeLesson()` - Mark lesson as complete

**Challenges**
- `getChallengesByTrack()` - Get track challenges
- `getChallenge()` - Get challenge details
- `submitChallenge()` - Submit solution
- `getUserSubmissions()` - Get user's submissions

## Future Enhancements (Not Yet Implemented)

### Quick Assist (Live Help)
- Screen sharing with mentors
- Real-time collaboration
- Voice/video chat integration

### Certificate System
- Auto-generate completion certificates
- PDF download
- Verification system

### Discussion System
- Comments on lessons
- Q&A threads
- Upvote helpful answers

### Advanced Features
- AI Project Generator
- Mock Technical Interviews
- Hackathon Mode
- Speed Run Challenges
- Code Pairing Mode
- Weekly Coding Newsletter

## Technology Stack

**Frontend**
- React 18
- TypeScript
- Vite
- TailwindCSS
- Monaco Editor
- Lucide Icons

**Backend**
- Node.js + Express
- Supabase (PostgreSQL)
- OpenAI API
- Google Gemini API

**Code Execution**
- Multi-language runtime support
- Sandboxed execution
- Real-time output

## Security

- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Public read access for leaderboards and course content
- Authentication required for all operations
- Secure API key management

## Performance

- Optimized database queries with indexes
- Real-time leaderboard updates
- Efficient XP calculation and level progression
- Lazy loading for large datasets
- Build size: ~390 KB (gzipped: ~110 KB)

## Contributing

The platform is designed to be extensible:

1. Add new career tracks in `career_tracks` table
2. Create courses and lessons
3. Design new challenges with test cases
4. Add achievements and badges
5. Extend the gamification service

## Support

For issues or questions:
1. Check database migrations are applied
2. Verify Supabase credentials
3. Ensure code execution server is running
4. Check browser console for errors

## License

MIT License

---

**Start your coding journey today and become a Code Legend!**
