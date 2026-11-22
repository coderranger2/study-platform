import React from 'react';
import { useCampus } from '../../context/CampusContext';
import { sound } from '../../services/soundEffects';

export const PomodoroWindow: React.FC = () => {
  const {
    pomodoroMinutesLeft,
    pomodoroSecondsLeft,
    isPomodoroRunning,
    pomodoroMode,
    startPomodoro,
    pausePomodoro,
    resetPomodoro,
    setPomodoroMode,
    stats,
    quests,
    claimQuest,
  } = useCampus();

  const totalSecondsInMode = pomodoroMode === 'focus' ? 25 * 60 : pomodoroMode === 'shortBreak' ? 5 * 60 : 15 * 60;
  const currentSecondsLeft = pomodoroMinutesLeft * 60 + pomodoroSecondsLeft;
  const progressPercent = Math.max(0, Math.min(100, Math.round(((totalSecondsInMode - currentSecondsLeft) / totalSecondsInMode) * 100)));

  return (
    <div className="flex flex-col h-full font-sans select-none overflow-y-auto space-y-3 p-1">
      {/* 1. Mode Presets */}
      <div className="flex space-x-1 border-b border-gray-400 pb-2">
        <button
          onClick={() => {
            sound.playClick();
            setPomodoroMode('focus');
            resetPomodoro(25);
          }}
          className={`flex-1 py-1.5 retro-btn font-pixel text-xs font-bold ${
            pomodoroMode === 'focus' ? 'pressed bg-amber-200 text-amber-950' : 'bg-gray-200'
          }`}
        >
          ⏱️ 25m Sprint
        </button>
        <button
          onClick={() => {
            sound.playClick();
            setPomodoroMode('focus');
            resetPomodoro(50);
          }}
          className={`flex-1 py-1.5 retro-btn font-pixel text-xs font-bold ${
            pomodoroMinutesLeft === 50 ? 'pressed bg-amber-200 text-amber-950' : 'bg-gray-200'
          }`}
        >
          🔥 50m Deep
        </button>
        <button
          onClick={() => {
            sound.playClick();
            setPomodoroMode('shortBreak');
            resetPomodoro(5);
          }}
          className={`flex-1 py-1.5 retro-btn font-pixel text-xs font-bold ${
            pomodoroMode === 'shortBreak' ? 'pressed bg-emerald-200 text-emerald-950' : 'bg-gray-200'
          }`}
        >
          ☕ 5m Break
        </button>
      </div>

      {/* 2. Retro Digital & Dial Display */}
      <div className="bg-black p-4 rounded-lg retro-inset border-2 border-gray-600 flex flex-col items-center justify-center text-center shadow-inner relative">
        <div className="absolute top-2 left-3 text-[10px] text-amber-500 font-pixel uppercase tracking-widest">
          {pomodoroMode === 'focus' ? 'FOCUS CADENCE' : 'REST CADENCE'}
        </div>

        {/* Circular Progress Ring Indicator */}
        <div className="relative w-36 h-36 flex items-center justify-center my-2">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="72"
              cy="72"
              r="60"
              stroke="#27272a"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="72"
              cy="72"
              r="60"
              stroke={pomodoroMode === 'focus' ? '#f59e0b' : '#10b981'}
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 60}
              strokeDashoffset={2 * Math.PI * 60 * (1 - progressPercent / 100)}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          </svg>

          <div className="absolute flex flex-col items-center justify-center">
            <span className="font-pixel text-4xl font-bold text-amber-400 tracking-wider">
              {String(pomodoroMinutesLeft).padStart(2, '0')}:
              {String(pomodoroSecondsLeft).padStart(2, '0')}
            </span>
            <span className="text-[10px] text-gray-400 font-mono mt-0.5">
              {isPomodoroRunning ? 'RUNNING' : 'PAUSED'}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex space-x-2 mt-2">
          <button
            onClick={() => (isPomodoroRunning ? pausePomodoro() : startPomodoro())}
            className="px-5 py-1.5 bg-amber-400 text-black font-pixel font-bold text-sm rounded shadow hover:bg-amber-300 active:scale-95"
          >
            {isPomodoroRunning ? '⏸ PAUSE' : '▶ START'}
          </button>
          <button
            onClick={() => resetPomodoro(pomodoroMode === 'focus' ? 25 : 5)}
            className="px-3 py-1.5 bg-gray-800 text-gray-300 font-pixel font-bold text-sm rounded hover:bg-gray-700"
          >
            ↺ RESET
          </button>
        </div>
      </div>

      {/* 3. Session Statistics */}
      <div className="grid grid-cols-3 gap-1.5 text-center font-pixel text-xs">
        <div className="bg-[#dfdfdf] p-2 retro-inset rounded">
          <span className="text-gray-500 block text-[10px]">Today Sprints</span>
          <span className="font-bold text-sm text-blue-900">{stats.pomodorosCompleted}</span>
        </div>
        <div className="bg-[#dfdfdf] p-2 retro-inset rounded">
          <span className="text-gray-500 block text-[10px]">Focus Time</span>
          <span className="font-bold text-sm text-amber-900">{stats.studyMinutesToday}m</span>
        </div>
        <div className="bg-[#dfdfdf] p-2 retro-inset rounded">
          <span className="text-gray-500 block text-[10px]">Streak</span>
          <span className="font-bold text-sm text-emerald-900">{stats.streakDays} Days</span>
        </div>
      </div>

      {/* 4. Mini Daily Quests Checklist */}
      <div className="bg-white p-2.5 rounded retro-inset border border-gray-400">
        <div className="font-pixel text-xs font-bold text-gray-800 mb-2 flex items-center justify-between">
          <span>📜 Daily Study Quests</span>
          <span className="text-[10px] text-emerald-700 font-bold">Earn XP & Coins</span>
        </div>

        <div className="space-y-1.5">
          {quests.map((q) => (
            <div
              key={q.id}
              className={`p-1.5 rounded flex items-center justify-between text-xs border ${
                q.completed ? 'bg-emerald-50 border-emerald-300' : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center space-x-1.5 truncate flex-1 min-w-0">
                <span>{q.icon}</span>
                <div className="truncate">
                  <span className="font-bold truncate text-[11px] block">{q.title}</span>
                  <span className="text-[10px] text-gray-500 block">
                    {q.current}/{q.target} completed
                  </span>
                </div>
              </div>

              {q.completed ? (
                <button
                  onClick={() => claimQuest(q.id)}
                  disabled={q.claimed}
                  className={`px-2 py-0.5 rounded text-[10px] font-pixel font-bold ${
                    q.claimed
                      ? 'bg-gray-300 text-gray-600 cursor-default'
                      : 'bg-emerald-600 text-white hover:bg-emerald-500 animate-bounce'
                  }`}
                >
                  {q.claimed ? 'Claimed ✓' : `Claim +${q.rewardCoins}🪙`}
                </button>
              ) : (
                <span className="text-[10px] font-pixel text-gray-400">In Progress</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
