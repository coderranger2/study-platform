import React from 'react';
import { useCampus } from '../../context/CampusContext';
import { sound } from '../../services/soundEffects';

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({ isOpen, onClose }) => {
  const {
    openWindow,
    stats,
    currentRoom,
    switchRoom,
    toggleCinemaMode,
    sensory,
    showToast,
  } = useCampus();

  if (!isOpen) return null;

  const handleLaunch = (windowId: string) => {
    sound.playClick();
    openWindow(windowId);
    onClose();
  };

  const handleShutdown = () => {
    sound.playTimerDone();
    showToast('☕ Great work today, Scholar! Take a restful offline breather.');
    onClose();
  };

  return (
    <>
      {/* Invisible backdrop to dismiss Start Menu on outside click */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      <div
        className="fixed bottom-[44px] left-0 z-50 w-72 retro-window-frame shadow-2xl flex select-none animate-in fade-in slide-in-from-bottom-2 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
      {/* 90s Vertical Banner */}
      <div className="w-9 bg-gradient-to-t from-[#000080] via-[#1084d0] to-[#000080] flex items-end justify-center py-4 border-r-2 border-white/50">
        <span className="font-display text-white text-xs tracking-widest -rotate-90 origin-bottom-left whitespace-nowrap font-bold pl-3">
          CampusOS 98
        </span>
      </div>

      {/* Main Menu Body */}
      <div className="flex-1 bg-[#c0c0c0] p-1.5 flex flex-col text-xs font-pixel space-y-1">
        {/* User Profile Card */}
        <div className="p-2 bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded retro-inset mb-1">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🎓</span>
            <div className="flex-1 min-w-0">
              <div className="font-bold truncate text-amber-300">Scholar_User</div>
              <div className="text-[10px] text-blue-200">
                Level {stats.level} • {stats.xp} XP
              </div>
            </div>
            <div className="text-right">
              <span className="text-amber-400 font-bold">🪙 {stats.coins}</span>
            </div>
          </div>
        </div>

        {/* Core Apps Group */}
        <div className="text-[10px] uppercase font-bold text-gray-600 px-2 pt-1">Study Applications</div>

        <button
          onClick={() => handleLaunch('campus-map')}
          className="w-full flex items-center space-x-2 px-2 py-1.5 hover:bg-[#000080] hover:text-white rounded text-left group transition-none"
        >
          <span className="text-base">🗺️</span>
          <div className="flex-1">
            <span className="font-bold">Campus Quad Map</span>
            <span className="text-[10px] text-gray-500 group-hover:text-blue-200 block">Shortcuts: L, R, C, N</span>
          </div>
        </button>

        <button
          onClick={() => handleLaunch('study-room')}
          className="w-full flex items-center space-x-2 px-2 py-1.5 hover:bg-[#000080] hover:text-white rounded text-left group transition-none"
        >
          <span className="text-base">👥</span>
          <div className="flex-1">
            <span className="font-bold">Multiplayer Study Rooms</span>
            <span className="text-[10px] text-gray-500 group-hover:text-blue-200 block">Current: {currentRoom}</span>
          </div>
        </button>

        <button
          onClick={() => handleLaunch('study-bot')}
          className="w-full flex items-center space-x-2 px-2 py-1.5 hover:bg-[#000080] hover:text-white rounded text-left group transition-none"
        >
          <span className="text-base">🤖</span>
          <div className="flex-1">
            <span className="font-bold">StudyBot.exe (AI Tutor)</span>
            <span className="text-[10px] text-gray-500 group-hover:text-blue-200 block">Explain, Debug, Quiz</span>
          </div>
        </button>

        <button
          onClick={() => handleLaunch('reader')}
          className="w-full flex items-center space-x-2 px-2 py-1.5 hover:bg-[#000080] hover:text-white rounded text-left group transition-none"
        >
          <span className="text-base">📖</span>
          <div className="flex-1">
            <span className="font-bold">Adaptive Reader & Notes</span>
            <span className="text-[10px] text-gray-500 group-hover:text-blue-200 block">Bionic, Irlen Tints, Summarizer</span>
          </div>
        </button>

        <button
          onClick={() => handleLaunch('flashcards')}
          className="w-full flex items-center space-x-2 px-2 py-1.5 hover:bg-[#000080] hover:text-white rounded text-left group transition-none"
        >
          <span className="text-base">🃏</span>
          <div className="flex-1">
            <span className="font-bold">Flashcards 3D Arena</span>
            <span className="text-[10px] text-gray-500 group-hover:text-blue-200 block">Active-Recall Mastery</span>
          </div>
        </button>

        <button
          onClick={() => handleLaunch('pomodoro')}
          className="w-full flex items-center space-x-2 px-2 py-1.5 hover:bg-[#000080] hover:text-white rounded text-left group transition-none"
        >
          <span className="text-base">⏱️</span>
          <div className="flex-1">
            <span className="font-bold">Pomodoro Dial Timer</span>
            <span className="text-[10px] text-gray-500 group-hover:text-blue-200 block">25/5 and 50/10 Sprints</span>
          </div>
        </button>

        <button
          onClick={() => handleLaunch('sound-mixer')}
          className="w-full flex items-center space-x-2 px-2 py-1.5 hover:bg-[#000080] hover:text-white rounded text-left group transition-none"
        >
          <span className="text-base">🎚️</span>
          <div className="flex-1">
            <span className="font-bold">Sound Mixer & Binaural</span>
            <span className="text-[10px] text-gray-500 group-hover:text-blue-200 block">Pink Rain, Vinyl, Coffeehouse</span>
          </div>
        </button>

        <button
          onClick={() => handleLaunch('sensory-tv')}
          className="w-full flex items-center space-x-2 px-2 py-1.5 hover:bg-[#000080] hover:text-white rounded text-left group transition-none"
        >
          <span className="text-base">📺</span>
          <div className="flex-1">
            <span className="font-bold">Sensory TV (Lo-Fi Streams)</span>
            <span className="text-[10px] text-gray-500 group-hover:text-blue-200 block">Pixel rain & Minecraft ambient</span>
          </div>
        </button>

        <button
          onClick={() => handleLaunch('shop')}
          className="w-full flex items-center space-x-2 px-2 py-1.5 hover:bg-[#000080] hover:text-white rounded text-left group transition-none"
        >
          <span className="text-base">🛍️</span>
          <div className="flex-1">
            <span className="font-bold">Campus Bookstore & Shop</span>
            <span className="text-[10px] text-gray-500 group-hover:text-blue-200 block">Themes, Wallpapers, Pets</span>
          </div>
        </button>

        <div className="border-t border-gray-400 my-1" />

        {/* Quick Toggles */}
        <button
          onClick={toggleCinemaMode}
          className="w-full flex items-center space-x-2 px-2 py-1.5 hover:bg-[#000080] hover:text-white rounded text-left group"
        >
          <span className="text-base">🎬</span>
          <div className="flex-1">
            <span className="font-bold">Cinema Mode</span>
            <span className="text-[10px] text-gray-500 group-hover:text-blue-200">
              {sensory.cinemaMode ? 'Active (Click to disable)' : 'Inactive'}
            </span>
          </div>
        </button>

        <button
          onClick={handleShutdown}
          className="w-full flex items-center space-x-2 px-2 py-1.5 hover:bg-red-700 hover:text-white rounded text-left text-red-900 group"
        >
          <span className="text-base">🚪</span>
          <div className="flex-1">
            <span className="font-bold">Shut Down / Take a Rest</span>
            <span className="text-[10px] text-gray-500 group-hover:text-red-200">Sign off study session</span>
          </div>
        </button>
      </div>
    </div>
    </>
  );
};
