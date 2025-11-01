import { useState, useEffect } from 'react';
import { Trophy, Medal, Award, TrendingUp, Users, GraduationCap } from 'lucide-react';
import { gamificationService, LeaderboardEntry } from '../lib/gamification';

export default function Leaderboard() {
  const [scope, setScope] = useState<'global' | 'college'>('global');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, [scope]);

  async function loadLeaderboard() {
    setLoading(true);
    try {
      const data = await gamificationService.getLeaderboard(scope, undefined, 100);
      setLeaderboard(data);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  }

  function getMedalColor(rank: number): string {
    if (rank === 1) return 'from-yellow-400 to-yellow-600';
    if (rank === 2) return 'from-gray-300 to-gray-400';
    if (rank === 3) return 'from-orange-400 to-orange-600';
    return 'from-slate-600 to-slate-700';
  }

  function getMedalIcon(rank: number) {
    if (rank === 1) return <Trophy className="w-5 h-5 text-white" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-white" />;
    if (rank === 3) return <Award className="w-5 h-5 text-white" />;
    return null;
  }

  return (
    <div className="h-full overflow-auto bg-slate-900">
      <div className="max-w-5xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-400" />
            Leaderboard
          </h1>
          <p className="text-slate-400">Compete with learners around the world</p>
        </div>

        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setScope('global')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              scope === 'global'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            <Users className="w-5 h-5" />
            Global
          </button>
          <button
            onClick={() => setScope('college')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              scope === 'college'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            <GraduationCap className="w-5 h-5" />
            My College
          </button>
        </div>

        {leaderboard.length > 0 && leaderboard.slice(0, 3).length === 3 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="order-2">
              <TopThreeCard
                rank={1}
                entry={leaderboard[0]}
                medalColor={getMedalColor(1)}
                icon={getMedalIcon(1)}
              />
            </div>
            <div className="order-1">
              <TopThreeCard
                rank={2}
                entry={leaderboard[1]}
                medalColor={getMedalColor(2)}
                icon={getMedalIcon(2)}
                smaller
              />
            </div>
            <div className="order-3">
              <TopThreeCard
                rank={3}
                entry={leaderboard[2]}
                medalColor={getMedalColor(3)}
                icon={getMedalIcon(3)}
                smaller
              />
            </div>
          </div>
        )}

        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="bg-slate-750 px-6 py-4 border-b border-slate-700">
            <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-slate-400">
              <div className="col-span-1">Rank</div>
              <div className="col-span-6">Player</div>
              <div className="col-span-3 text-right">XP</div>
              <div className="col-span-2 text-right">Level</div>
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-500">Loading leaderboard...</div>
          ) : leaderboard.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No entries yet. Be the first!</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-700">
              {leaderboard.map((entry, index) => {
                const rank = index + 1;
                return (
                  <div
                    key={entry.id}
                    className={`px-6 py-4 hover:bg-slate-750 transition-colors ${
                      rank <= 3 ? 'bg-slate-750/50' : ''
                    }`}
                  >
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-1">
                        {rank <= 3 ? (
                          <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getMedalColor(rank)} flex items-center justify-center`}>
                            {getMedalIcon(rank)}
                          </div>
                        ) : (
                          <span className="text-slate-400 font-medium">#{rank}</span>
                        )}
                      </div>

                      <div className="col-span-6 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                          {entry.profile?.username?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="text-white font-medium">{entry.profile?.username || 'Anonymous'}</p>
                          {entry.profile?.college && (
                            <p className="text-xs text-slate-400">{entry.profile.college}</p>
                          )}
                        </div>
                      </div>

                      <div className="col-span-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <TrendingUp className="w-4 h-4 text-green-400" />
                          <span className="text-white font-semibold">{entry.total_xp.toLocaleString()}</span>
                          <span className="text-slate-400 text-sm">XP</span>
                        </div>
                      </div>

                      <div className="col-span-2 text-right">
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
                          Lvl {Math.floor(entry.total_xp / 100) + 1}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Climb the Leaderboard!</h3>
              <p className="text-blue-100 text-sm mb-3">
                Complete challenges, maintain your streak, and help others to earn more XP and climb the ranks.
              </p>
              <button className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                Start a Challenge
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TopThreeCard({
  rank,
  entry,
  medalColor,
  icon,
  smaller = false,
}: {
  rank: number;
  entry: LeaderboardEntry;
  medalColor: string;
  icon: React.ReactNode;
  smaller?: boolean;
}) {
  return (
    <div className={`bg-slate-800 rounded-xl border border-slate-700 p-4 text-center ${smaller ? 'mt-8' : ''}`}>
      <div className={`relative inline-block mb-3 ${smaller ? 'w-16 h-16' : 'w-20 h-20'}`}>
        <div className={`w-full h-full rounded-full bg-gradient-to-br ${medalColor} flex items-center justify-center`}>
          {icon}
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-900 rounded-full border-2 border-slate-700 flex items-center justify-center text-white font-bold text-sm">
          {rank}
        </div>
      </div>

      <div className={`w-${smaller ? '12' : '16'} h-${smaller ? '12' : '16'} mx-auto mb-3 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center`}>
        <span className={`text-white font-bold ${smaller ? 'text-xl' : 'text-2xl'}`}>
          {entry.profile?.username?.charAt(0).toUpperCase() || 'U'}
        </span>
      </div>

      <h3 className="text-white font-semibold mb-1">{entry.profile?.username || 'Anonymous'}</h3>
      {entry.profile?.college && (
        <p className="text-xs text-slate-400 mb-2">{entry.profile.college}</p>
      )}
      <div className="flex items-center justify-center gap-1 text-blue-400">
        <TrendingUp className="w-4 h-4" />
        <span className="font-semibold">{entry.total_xp.toLocaleString()}</span>
        <span className="text-slate-400 text-sm">XP</span>
      </div>
    </div>
  );
}
