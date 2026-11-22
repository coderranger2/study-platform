import React from 'react';
import { useCampus } from '../../context/CampusContext';
import { sound } from '../../services/soundEffects';

export const QuestsWindow: React.FC = () => {
  const { quests, claimQuest, stats } = useCampus();

  const xpForNextLevel = stats.level * 200;
  const currentLevelProgress = stats.xp % 200;
  const percent = Math.min(100, Math.round((currentLevelProgress / 200) * 100));

  return (
    <div className="flex flex-col h-full font-sans select-none overflow-y-auto space-y-3 p-1">
      {/* 1. Level & Milestone Header */}
      <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-purple-950 text-white p-3 rounded retro-inset">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-3xl">🏅</span>
            <div>
              <h3 className="font-pixel text-base font-bold text-amber-300">
                SCHOLAR PROGRESSION & MILESTONES
              </h3>
              <span className="text-xs text-blue-200 font-sans">
                Level {stats.level} Scholar • {stats.xp} Total XP Accumulated
              </span>
            </div>
          </div>
          <div className="text-right font-pixel text-amber-400 font-bold text-sm">
            🪙 {stats.coins} Coins
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between text-[11px] font-pixel text-gray-300 mb-1">
            <span>Next Level ({stats.level + 1})</span>
            <span>{currentLevelProgress} / 200 XP</span>
          </div>
          <div className="w-full h-4 bg-black/60 retro-inset overflow-hidden rounded">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. Daily Study Quests List */}
      <div className="bg-white p-3 rounded retro-inset border border-gray-400 space-y-2.5">
        <div className="font-pixel text-xs font-bold text-gray-800 border-b border-gray-300 pb-1 flex items-center justify-between">
          <span>📜 Active Daily Quests</span>
          <span className="text-gray-500 text-[10px]">Resets Daily at Midnight</span>
        </div>

        <div className="space-y-2">
          {quests.map((q) => {
            const progressPct = Math.min(100, Math.round((q.current / q.target) * 100));
            return (
              <div
                key={q.id}
                className={`p-2.5 rounded retro-outset border flex flex-col justify-between ${
                  q.completed ? 'bg-emerald-50 border-emerald-300' : 'bg-gray-50 border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl p-1 bg-white rounded retro-inset">{q.icon}</span>
                    <div>
                      <h4 className="font-bold text-xs text-gray-900">{q.title}</h4>
                      <p className="text-[11px] text-gray-600 leading-snug">{q.desc}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-amber-900 font-pixel font-bold block">
                      +{q.rewardXp} XP • +{q.rewardCoins} 🪙
                    </span>
                  </div>
                </div>

                {/* Progress bar inside quest */}
                <div className="space-y-1 mt-1">
                  <div className="flex items-center justify-between text-[10px] font-pixel text-gray-500">
                    <span>Progress: {q.current} / {q.target}</span>
                    <span>{progressPct}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-200 retro-inset overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        q.completed ? 'bg-emerald-600' : 'bg-blue-600'
                      }`}
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>

                {/* Claim Button */}
                {q.completed && (
                  <div className="pt-2 mt-2 border-t border-gray-200 flex justify-end">
                    <button
                      onClick={() => {
                        sound.playCoin();
                        claimQuest(q.id);
                      }}
                      disabled={q.claimed}
                      className={`px-3 py-1 rounded text-xs font-pixel font-bold ${
                        q.claimed
                          ? 'bg-gray-300 text-gray-600 cursor-default'
                          : 'bg-emerald-600 text-white hover:bg-emerald-500 animate-pulse'
                      }`}
                    >
                      {q.claimed ? 'Claimed ✓' : `Claim Reward (+${q.rewardCoins} Coins)`}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
