import { useState, useEffect } from 'react';
import { User, Trophy, Award, Code2, Calendar, MapPin, Github, Linkedin, Globe, Edit2, Save, X } from 'lucide-react';
import { gamificationService, UserProfile as Profile, UserProgress, UserBadge } from '../lib/gamification';

interface UserProfileProps {
  userId: string;
}

export default function UserProfile({ userId }: UserProfileProps) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Profile>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, [userId]);

  async function loadProfile() {
    try {
      const [profileData, progressData, badgesData] = await Promise.all([
        gamificationService.getProfile(userId),
        gamificationService.getProgress(userId),
        gamificationService.getUserBadges(userId),
      ]);

      setProfile(profileData);
      setProgress(progressData);
      setBadges(badgesData);
      setEditForm(profileData || {});
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveProfile() {
    try {
      await gamificationService.updateProfile(userId, editForm);
      await loadProfile();
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-slate-400">Loading profile...</div>
      </div>
    );
  }

  const badgesByRarity = badges.reduce((acc, badge) => {
    const rarity = badge.badge?.rarity || 'common';
    if (!acc[rarity]) acc[rarity] = [];
    acc[rarity].push(badge);
    return acc;
  }, {} as Record<string, UserBadge[]>);

  return (
    <div className="h-full overflow-auto bg-slate-900">
      <div className="max-w-5xl mx-auto p-6">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white text-3xl font-bold border-4 border-white/30">
                {profile?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="text-white">
                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editForm.full_name || ''}
                      onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                      placeholder="Full Name"
                      className="bg-white/20 border border-white/30 rounded px-3 py-2 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                    <input
                      type="text"
                      value={editForm.username || ''}
                      onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                      placeholder="Username"
                      className="bg-white/20 border border-white/30 rounded px-3 py-2 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                  </div>
                ) : (
                  <>
                    <h1 className="text-3xl font-bold mb-1">{profile?.full_name || 'Anonymous User'}</h1>
                    <p className="text-blue-100 mb-3">@{profile?.username || 'anonymous'}</p>
                  </>
                )}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    <span className="font-semibold">Level {progress?.current_level || 1}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Code2 className="w-5 h-5" />
                    <span>{progress?.challenges_completed || 0} Challenges</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    <span>{badges.length} Badges</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSaveProfile}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditForm(profile || {});
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg font-medium hover:bg-white/30 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg font-medium hover:bg-white/30 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-400" />
                About
              </h2>
              {isEditing ? (
                <textarea
                  value={editForm.bio || ''}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                  className="w-full bg-slate-900 text-white px-4 py-3 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={4}
                />
              ) : (
                <p className="text-slate-300 leading-relaxed">
                  {profile?.bio || 'No bio yet. Click Edit Profile to add one!'}
                </p>
              )}

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {isEditing ? (
                  <>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        value={editForm.college || ''}
                        onChange={(e) => setEditForm({ ...editForm, college: e.target.value })}
                        placeholder="College/University"
                        className="flex-1 bg-slate-900 text-white px-3 py-2 rounded border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-slate-400" />
                      <input
                        type="number"
                        value={editForm.graduation_year || ''}
                        onChange={(e) => setEditForm({ ...editForm, graduation_year: parseInt(e.target.value) })}
                        placeholder="Graduation Year"
                        className="flex-1 bg-slate-900 text-white px-3 py-2 rounded border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    {profile?.college && (
                      <div className="flex items-center gap-3 text-slate-300">
                        <MapPin className="w-5 h-5 text-slate-400" />
                        <span>{profile.college}</span>
                      </div>
                    )}
                    {profile?.graduation_year && (
                      <div className="flex items-center gap-3 text-slate-300">
                        <Calendar className="w-5 h-5 text-slate-400" />
                        <span>Class of {profile.graduation_year}</span>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="mt-4 flex gap-3">
                {isEditing ? (
                  <>
                    <input
                      type="url"
                      value={editForm.github_url || ''}
                      onChange={(e) => setEditForm({ ...editForm, github_url: e.target.value })}
                      placeholder="GitHub URL"
                      className="flex-1 bg-slate-900 text-white px-3 py-2 rounded border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="url"
                      value={editForm.linkedin_url || ''}
                      onChange={(e) => setEditForm({ ...editForm, linkedin_url: e.target.value })}
                      placeholder="LinkedIn URL"
                      className="flex-1 bg-slate-900 text-white px-3 py-2 rounded border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="url"
                      value={editForm.portfolio_url || ''}
                      onChange={(e) => setEditForm({ ...editForm, portfolio_url: e.target.value })}
                      placeholder="Portfolio URL"
                      className="flex-1 bg-slate-900 text-white px-3 py-2 rounded border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </>
                ) : (
                  <>
                    {profile?.github_url && (
                      <a
                        href={profile.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                      >
                        <Github className="w-4 h-4" />
                        GitHub
                      </a>
                    )}
                    {profile?.linkedin_url && (
                      <a
                        href={profile.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                      >
                        <Linkedin className="w-4 h-4" />
                        LinkedIn
                      </a>
                    )}
                    {profile?.portfolio_url && (
                      <a
                        href={profile.portfolio_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                      >
                        <Globe className="w-4 h-4" />
                        Portfolio
                      </a>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-400" />
                Badge Collection
              </h2>
              {badges.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <Award className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No badges earned yet. Complete challenges to start your collection!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(badgesByRarity).map(([rarity, rarityBadges]) => (
                    <div key={rarity}>
                      <h3 className="text-sm font-semibold text-slate-400 uppercase mb-2">{rarity} ({rarityBadges.length})</h3>
                      <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                        {rarityBadges.map((userBadge) => (
                          <div
                            key={userBadge.id}
                            className="bg-slate-900 rounded-lg p-3 text-center hover:bg-slate-700 transition-colors cursor-pointer group"
                            title={userBadge.badge?.description}
                          >
                            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto mb-2 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <Award className="w-6 h-6 text-white" />
                            </div>
                            <p className="text-xs text-slate-300 truncate">{userBadge.badge?.badge_name}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h2 className="text-lg font-semibold text-white mb-4">Statistics</h2>
              <div className="space-y-4">
                <StatItem label="Total XP" value={progress?.total_xp.toLocaleString() || '0'} color="text-blue-400" />
                <StatItem label="Current Level" value={progress?.current_level || 1} color="text-purple-400" />
                <StatItem label="Challenges Completed" value={progress?.challenges_completed || 0} color="text-green-400" />
                <StatItem label="Lessons Completed" value={progress?.lessons_completed || 0} color="text-yellow-400" />
                <StatItem label="Current Streak" value={`${progress?.streak_days || 0} days`} color="text-orange-400" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl p-6 text-white">
              <h3 className="font-semibold text-lg mb-2">Keep It Going!</h3>
              <p className="text-green-100 text-sm mb-4">
                You're on a {progress?.streak_days || 0} day streak. Complete a challenge today to keep it alive!
              </p>
              <button className="w-full px-4 py-2 bg-white text-green-600 rounded-lg font-medium hover:bg-green-50 transition-colors">
                Start Challenge
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatItem({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-700 last:border-0">
      <span className="text-slate-400 text-sm">{label}</span>
      <span className={`font-semibold ${color}`}>{value}</span>
    </div>
  );
}
