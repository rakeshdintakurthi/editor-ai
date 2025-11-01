import { useState, useEffect } from 'react';
import { Trophy, Target, Flame, Award, BookOpen, Code2, TrendingUp, Users } from 'lucide-react';
import { gamificationService, UserProgress, UserProfile, Level, UserBadge, CareerTrack } from '../lib/gamification';

interface LearningDashboardProps {
  userId: string;
}

export default function LearningDashboard({ userId }: LearningDashboardProps) {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [currentLevel, setCurrentLevel] = useState<Level | null>(null);
  const [nextLevel, setNextLevel] = useState<Level | null>(null);
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [tracks, setTracks] = useState<CareerTrack[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [userId]);

  async function loadDashboardData() {
    try {
      const [progressData, profileData, badgesData, tracksData] = await Promise.all([
        gamificationService.getProgress(userId),
        gamificationService.getProfile(userId),
        gamificationService.getUserBadges(userId),
        gamificationService.getAllTracks(),
      ]);

      setProgress(progressData);
      setProfile(profileData);
      setBadges(badgesData);
      setTracks(tracksData);

      if (progressData) {
        const [current, next] = await Promise.all([
          gamificationService.getLevel(progressData.current_level),
          gamificationService.getLevel(progressData.current_level + 1),
        ]);
        setCurrentLevel(current);
        setNextLevel(next);
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-slate-400">Loading your learning journey...</div>
      </div>
    );
  }

  const xpProgress = currentLevel && nextLevel
    ? ((progress?.total_xp || 0) - currentLevel.xp_required) / (nextLevel.xp_required - currentLevel.xp_required) * 100
    : 0;

  return (
    <div className="h-full overflow-auto bg-slate-900">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {profile?.full_name || 'Learner'}!</h1>
          <p className="text-slate-400">Continue your coding journey and level up your skills</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold mb-1">Level {progress?.current_level || 1}</h2>
                <p className="text-blue-100">{currentLevel?.level_name || 'Code Newbie'}</p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Trophy className="w-8 h-8" />
              </div>
            </div>

            <div className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span>{progress?.total_xp || 0} XP</span>
                <span>{nextLevel?.xp_required || 100} XP</span>
              </div>
              <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(xpProgress, 100)}%` }}
                />
              </div>
            </div>
            <p className="text-sm text-blue-100">
              {nextLevel ? `${nextLevel.xp_required - (progress?.total_xp || 0)} XP to Level ${progress!.current_level + 1}` : 'Max level reached!'}
            </p>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-white font-semibold mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <StatItem icon={<Flame className="w-5 h-5 text-orange-400" />} label="Day Streak" value={progress?.streak_days || 0} />
              <StatItem icon={<Code2 className="w-5 h-5 text-green-400" />} label="Challenges" value={progress?.challenges_completed || 0} />
              <StatItem icon={<BookOpen className="w-5 h-5 text-blue-400" />} label="Lessons" value={progress?.lessons_completed || 0} />
              <StatItem icon={<Award className="w-5 h-5 text-yellow-400" />} label="Badges" value={badges.length} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-400" />
              Recent Badges
            </h3>
            {badges.length > 0 ? (
              <div className="grid grid-cols-3 gap-3">
                {badges.slice(0, 6).map((userBadge) => (
                  <div
                    key={userBadge.id}
                    className="bg-slate-900 rounded-lg p-3 text-center hover:bg-slate-700 transition-colors cursor-pointer"
                    title={userBadge.badge?.description}
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-xs text-slate-300 truncate">{userBadge.badge?.badge_name}</p>
                    <p className="text-xs text-slate-500 capitalize">{userBadge.badge?.rarity}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <Award className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Complete challenges to earn badges!</p>
              </div>
            )}
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-400" />
              Daily Goals
            </h3>
            <div className="space-y-4">
              <GoalItem label="Complete 1 Challenge" current={0} target={1} />
              <GoalItem label="Practice 30 minutes" current={15} target={30} />
              <GoalItem label="Earn 100 XP" current={progress?.total_xp || 0} target={100} />
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white font-semibold text-xl">Career Tracks</h3>
            <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">View All</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tracks.slice(0, 6).map((track) => (
              <div
                key={track.id}
                className="bg-slate-900 rounded-lg p-4 border border-slate-700 hover:border-blue-500 transition-all cursor-pointer group"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Code2 className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium mb-1 group-hover:text-blue-400 transition-colors">{track.track_name}</h4>
                    <p className="text-xs text-slate-400 capitalize">{track.difficulty}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-400 mb-3 line-clamp-2">{track.description}</p>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{track.estimated_hours}h estimated</span>
                  <span className="text-blue-400 font-medium group-hover:text-blue-300">Start Learning</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              Your Progress This Week
            </h3>
            <div className="h-48 flex items-end justify-around gap-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                <div key={day} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-slate-700 rounded-t" style={{ height: `${Math.random() * 100}%`, minHeight: '20%' }}>
                    <div className="w-full h-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t" />
                  </div>
                  <span className="text-xs text-slate-500">{day}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              Community Highlights
            </h3>
            <div className="space-y-3">
              <CommunityItem avatar="A" name="Alex Chen" action="completed Web Dev Fundamentals" time="2h ago" />
              <CommunityItem avatar="S" name="Sarah Kim" action="earned Speed Demon badge" time="3h ago" />
              <CommunityItem avatar="M" name="Mike Johnson" action="reached Level 10" time="5h ago" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-slate-300 text-sm">{label}</span>
      </div>
      <span className="text-white font-semibold">{value}</span>
    </div>
  );
}

function GoalItem({ label, current, target }: { label: string; current: number; target: number }) {
  const progress = Math.min((current / target) * 100, 100);

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-slate-300">{label}</span>
        <span className="text-slate-400">{current}/{target}</span>
      </div>
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function CommunityItem({ avatar, name, action, time }: { avatar: string; name: string; action: string; time: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
        {avatar}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-300">
          <span className="font-medium text-white">{name}</span> {action}
        </p>
        <p className="text-xs text-slate-500">{time}</p>
      </div>
    </div>
  );
}
