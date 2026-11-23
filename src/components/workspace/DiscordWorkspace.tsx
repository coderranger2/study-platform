import React, { useState } from 'react';
import { useCampus } from '../../context/CampusContext';
import { RoomId, ChannelId } from '../../types';
import { sound } from '../../services/soundEffects';
import { CampusBackdrop } from '../CampusBackdrop';
import { CampusMascot } from '../CampusMascot';

// Windows / Studio Tools
import { StudyRoomsWindow } from '../windows/StudyRoomsWindow';
import { PdfPptAnalyzer } from '../studio/PdfPptAnalyzer';
import { ReaderWindow } from '../windows/ReaderWindow';
import { FlashcardsWindow } from '../windows/FlashcardsWindow';
import { StudyBotWindow } from '../windows/StudyBotWindow';
import { PomodoroWindow } from '../windows/PomodoroWindow';
import { SoundMixerWindow } from '../windows/SoundMixerWindow';
import { SensoryTVWindow } from '../windows/SensoryTVWindow';
import { PostureGuardWindow } from '../windows/PostureGuardWindow';
import { ShopWindow } from '../windows/ShopWindow';
import { QuestsWindow } from '../windows/QuestsWindow';

export const DiscordWorkspace: React.FC = () => {
  const {
    user,
    logout,
    currentRoom,
    switchRoom,
    rooms,
    stats,
    activeChannel,
    setActiveChannel,
    pomodoroMinutesLeft,
    pomodoroSecondsLeft,
    isPomodoroRunning,
    startPomodoro,
    pausePomodoro,
    skyMode,
    setSkyMode,
    soundState,
    updateSoundState,
    sensory,
    toggleCinemaMode,
    toastMessage,
  } = useCampus();

  const [focusHubTab, setFocusHubTab] = useState<'timer' | 'sound' | 'tv' | 'posture'>('timer');

  const currentRoomData = rooms[currentRoom];

  const handleSelectEnvironment = (rId: RoomId) => {
    switchRoom(rId);
    if (rId === 'library') setActiveChannel('silent-library');
    else if (rId === 'rooftop') setActiveChannel('pomodoro-50-10');
    else if (rId === 'cafe') setActiveChannel('late-night-cafe');
    else if (rId === 'arcade') setActiveChannel('lofi-gaming-lounge');
  };

  const handleSelectChannel = (cId: ChannelId) => {
    sound.playClick();
    setActiveChannel(cId);

    // Sync room environment if switching room channels
    if (cId === 'silent-library') switchRoom('library');
    else if (cId === 'pomodoro-50-10') switchRoom('rooftop');
    else if (cId === 'late-night-cafe') switchRoom('cafe');
    else if (cId === 'lofi-gaming-lounge') switchRoom('arcade');
  };

  const xpProgress = Math.min(100, Math.round(((stats.xp % 200) / 200) * 100));

  // Render the active full-scale workspace tool
  const renderMainStudio = () => {
    switch (activeChannel) {
      case 'silent-library':
      case 'pomodoro-50-10':
      case 'late-night-cafe':
      case 'lofi-gaming-lounge':
        return (
          <div className="h-full p-4 overflow-hidden">
            <StudyRoomsWindow />
          </div>
        );

      case 'pdf-ppt-analyzer':
        return <PdfPptAnalyzer />;

      case 'adaptive-reader':
        return (
          <div className="h-full p-4 overflow-hidden">
            <ReaderWindow />
          </div>
        );

      case 'flashcards-3d':
        return (
          <div className="h-full p-4 overflow-hidden max-w-4xl mx-auto">
            <FlashcardsWindow />
          </div>
        );

      case 'studybot-ai':
        return (
          <div className="h-full p-4 overflow-hidden max-w-5xl mx-auto">
            <StudyBotWindow />
          </div>
        );

      case 'focus-timer-hub':
        return (
          <div className="h-full p-4 overflow-y-auto max-w-4xl mx-auto space-y-4">
            {/* Hub Tab Switcher */}
            <div className="flex space-x-2 border-b border-white/10 pb-2">
              <button
                onClick={() => setFocusHubTab('timer')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  focusHubTab === 'timer'
                    ? 'bg-amberGold-400 text-twilight-950 font-bold'
                    : 'bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                ⏱️ Pomodoro & Sprints
              </button>
              <button
                onClick={() => setFocusHubTab('sound')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  focusHubTab === 'sound'
                    ? 'bg-amberGold-400 text-twilight-950 font-bold'
                    : 'bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                🎚️ Ambient Sound Mixer
              </button>
              <button
                onClick={() => setFocusHubTab('tv')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  focusHubTab === 'tv'
                    ? 'bg-amberGold-400 text-twilight-950 font-bold'
                    : 'bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                📺 Sensory CRT TV
              </button>
              <button
                onClick={() => setFocusHubTab('posture')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  focusHubTab === 'posture'
                    ? 'bg-amberGold-400 text-twilight-950 font-bold'
                    : 'bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                🧘 Posture & Ergonomics
              </button>
            </div>

            {/* Hub Body */}
            {focusHubTab === 'timer' && <PomodoroWindow />}
            {focusHubTab === 'sound' && <SoundMixerWindow />}
            {focusHubTab === 'tv' && <SensoryTVWindow />}
            {focusHubTab === 'posture' && <PostureGuardWindow />}
          </div>
        );

      case 'posture-guard':
        return (
          <div className="h-full p-4 overflow-y-auto max-w-3xl mx-auto">
            <PostureGuardWindow />
          </div>
        );

      case 'bookstore-shop':
        return (
          <div className="h-full p-4 overflow-y-auto max-w-4xl mx-auto">
            <ShopWindow />
          </div>
        );

      case 'daily-quests':
        return (
          <div className="h-full p-4 overflow-y-auto max-w-3xl mx-auto">
            <QuestsWindow />
          </div>
        );

      default:
        return <PdfPptAnalyzer />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-twilight-950 text-slate-200 select-none font-sans relative">
      {/* Background Campus Canvas */}
      <CampusBackdrop className="opacity-40" />

      {/* Cinema Overlay */}
      {sensory.cinemaMode && (
        <div
          onClick={toggleCinemaMode}
          className="fixed inset-0 z-40 bg-black/75 backdrop-blur-xs cursor-pointer flex items-start justify-center pt-6"
        >
          <div className="bg-amberGold-400 text-twilight-950 font-bold text-xs px-4 py-1.5 rounded-full shadow-soft-glow animate-pulse">
            🎬 Cinema Focus Mode Active • Click anywhere to exit
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* COLUMN 1: LEFT NAVIGATION RAIL (68px)                          */}
      {/* ============================================================== */}
      <nav className="w-18 bg-twilight-950/90 border-r border-white/10 flex flex-col items-center py-3 z-30 space-y-3 flex-shrink-0 backdrop-blur-md">
        {/* Brand Home Icon */}
        <div
          onClick={() => handleSelectEnvironment('library')}
          className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amberGold-400 to-amberGold-600 text-twilight-950 flex items-center justify-center text-xl font-bold cursor-pointer hover:rounded-xl shadow-soft-glow transition-all"
          title="Campus StudyHub Quad"
        >
          🏛️
        </div>

        <div className="w-8 h-0.5 bg-white/10 rounded-full" />

        {/* 4 Campus Environment Switcher Icons */}
        <div className="flex-1 space-y-2.5 flex flex-col items-center overflow-y-auto scrollbar-none w-full">
          <button
            onClick={() => handleSelectEnvironment('library')}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all relative group ${
              currentRoom === 'library'
                ? 'bg-amberGold-400/20 text-amberGold-300 border-2 border-amberGold-400 rounded-xl shadow-soft-glow'
                : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5 hover:rounded-xl'
            }`}
            title="Quiet Oak Library [L]"
          >
            <span>📚</span>
            {currentRoom === 'library' && (
              <span className="absolute -left-1 top-3 bottom-3 w-1 bg-amberGold-400 rounded-r" />
            )}
          </button>

          <button
            onClick={() => handleSelectEnvironment('rooftop')}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all relative group ${
              currentRoom === 'rooftop'
                ? 'bg-purple-500/20 text-purple-300 border-2 border-purple-400 rounded-xl shadow-soft-glow'
                : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5 hover:rounded-xl'
            }`}
            title="Stargazer Rooftop Lounge [R]"
          >
            <span>🌆</span>
            {currentRoom === 'rooftop' && (
              <span className="absolute -left-1 top-3 bottom-3 w-1 bg-purple-400 rounded-r" />
            )}
          </button>

          <button
            onClick={() => handleSelectEnvironment('cafe')}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all relative group ${
              currentRoom === 'cafe'
                ? 'bg-amber-500/20 text-amber-300 border-2 border-amber-400 rounded-xl shadow-soft-glow'
                : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5 hover:rounded-xl'
            }`}
            title="Bean & Byte Cafe [C]"
          >
            <span>☕</span>
            {currentRoom === 'cafe' && (
              <span className="absolute -left-1 top-3 bottom-3 w-1 bg-amber-400 rounded-r" />
            )}
          </button>

          <button
            onClick={() => handleSelectEnvironment('arcade')}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all relative group ${
              currentRoom === 'arcade'
                ? 'bg-pink-500/20 text-pink-300 border-2 border-pink-400 rounded-xl shadow-soft-glow'
                : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5 hover:rounded-xl'
            }`}
            title="Pixel Quad Arcade [N]"
          >
            <span>🕹️</span>
            {currentRoom === 'arcade' && (
              <span className="absolute -left-1 top-3 bottom-3 w-1 bg-pink-400 rounded-r" />
            )}
          </button>

          <div className="w-8 h-0.5 bg-white/10 rounded-full my-1" />

          {/* Quick Studio Tool Rails */}
          <button
            onClick={() => handleSelectChannel('pdf-ppt-analyzer')}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all ${
              activeChannel === 'pdf-ppt-analyzer'
                ? 'bg-white/20 text-white rounded-xl'
                : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white hover:rounded-xl'
            }`}
            title="PDF & PPT Lecture Studio"
          >
            📑
          </button>

          <button
            onClick={() => handleSelectChannel('bookstore-shop')}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all ${
              activeChannel === 'bookstore-shop'
                ? 'bg-white/20 text-white rounded-xl'
                : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white hover:rounded-xl'
            }`}
            title="Campus Bookstore & Reward Shop"
          >
            🛍️
          </button>

          <button
            onClick={() => handleSelectChannel('daily-quests')}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all ${
              activeChannel === 'daily-quests'
                ? 'bg-white/20 text-white rounded-xl'
                : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white hover:rounded-xl'
            }`}
            title="Daily Study Quests"
          >
            📜
          </button>
        </div>

        {/* User Avatar & Logout */}
        <div className="pt-2 flex flex-col items-center space-y-2">
          <div
            className="w-10 h-10 rounded-full bg-twilight-800 border-2 border-amberGold-400/60 flex items-center justify-center text-lg shadow-sm relative group cursor-pointer"
            title={`${user?.name || 'Scholar'} (${user?.major || 'Student'}) • Click to sign out`}
            onClick={logout}
          >
            <span>{user?.avatar || '🎓'}</span>
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-twilight-950" />
          </div>
          <button
            onClick={logout}
            className="text-[10px] text-gray-500 hover:text-red-400 transition-colors"
            title="Sign out"
          >
            Sign out
          </button>
        </div>
      </nav>

      {/* ============================================================== */}
      {/* COLUMN 2: MIDDLE CHANNELS & STUDIO TOOLS SIDEBAR (240px)       */}
      {/* ============================================================== */}
      <aside className="w-60 bg-twilight-900/90 border-r border-white/10 flex flex-col z-20 flex-shrink-0 backdrop-blur-md">
        {/* Environment Header */}
        <div className="p-3.5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-2 truncate">
            <span className="text-xl p-1 rounded-xl bg-white/5 border border-white/10">
              {currentRoomData.icon}
            </span>
            <div className="truncate">
              <h3 className="font-editorial text-sm font-bold text-white truncate">
                {currentRoomData.name}
              </h3>
              <span className="text-[10px] text-gray-400 truncate block">
                {currentRoomData.occupants} students active
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono text-amberGold-300 bg-amberGold-400/10 px-1.5 py-0.5 rounded border border-amberGold-400/20">
            [{currentRoomData.hotkey}]
          </span>
        </div>

        {/* Channels Scroll Area */}
        <div className="flex-1 overflow-y-auto p-2.5 space-y-4 text-xs font-sans">
          {/* Group 1: Study Rooms */}
          <div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-1.5">
              Multiplayer Rooms
            </div>
            <div className="space-y-0.5">
              <button
                data-channel="silent-library"
                onClick={() => handleSelectChannel('silent-library')}
                className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-xl transition-all text-left ${
                  activeChannel === 'silent-library'
                    ? 'bg-white/15 text-white font-semibold'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`}
              >
                <span>📚</span>
                <span className="truncate"># silent-library</span>
              </button>

              <button
                data-channel="pomodoro-50-10"
                onClick={() => handleSelectChannel('pomodoro-50-10')}
                className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-xl transition-all text-left ${
                  activeChannel === 'pomodoro-50-10'
                    ? 'bg-white/15 text-white font-semibold'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`}
              >
                <span>🌆</span>
                <span className="truncate"># pomodoro-50-10</span>
              </button>

              <button
                data-channel="late-night-cafe"
                onClick={() => handleSelectChannel('late-night-cafe')}
                className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-xl transition-all text-left ${
                  activeChannel === 'late-night-cafe'
                    ? 'bg-white/15 text-white font-semibold'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`}
              >
                <span>☕</span>
                <span className="truncate"># late-night-cafe</span>
              </button>

              <button
                data-channel="lofi-gaming-lounge"
                onClick={() => handleSelectChannel('lofi-gaming-lounge')}
                className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-xl transition-all text-left ${
                  activeChannel === 'lofi-gaming-lounge'
                    ? 'bg-white/15 text-white font-semibold'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`}
              >
                <span>🕹️</span>
                <span className="truncate"># lofi-gaming-lounge</span>
              </button>
            </div>
          </div>

          {/* Group 2: AI & Docs Studio */}
          <div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-1.5">
              AI & Docs Studio
            </div>
            <div className="space-y-0.5">
              <button
                data-channel="pdf-ppt-analyzer"
                onClick={() => handleSelectChannel('pdf-ppt-analyzer')}
                className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-xl transition-all text-left ${
                  activeChannel === 'pdf-ppt-analyzer'
                    ? 'bg-amberGold-400/20 text-amberGold-300 font-semibold border border-amberGold-400/30'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`}
              >
                <span>📑</span>
                <span className="truncate"># pdf-ppt-analyzer</span>
              </button>

              <button
                data-channel="adaptive-reader"
                onClick={() => handleSelectChannel('adaptive-reader')}
                className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-xl transition-all text-left ${
                  activeChannel === 'adaptive-reader'
                    ? 'bg-white/15 text-white font-semibold'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`}
              >
                <span>📖</span>
                <span className="truncate"># adaptive-reader</span>
              </button>

              <button
                data-channel="flashcards-3d"
                onClick={() => handleSelectChannel('flashcards-3d')}
                className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-xl transition-all text-left ${
                  activeChannel === 'flashcards-3d'
                    ? 'bg-white/15 text-white font-semibold'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`}
              >
                <span>🃏</span>
                <span className="truncate"># flashcards-3d</span>
              </button>

              <button
                data-channel="studybot-ai"
                onClick={() => handleSelectChannel('studybot-ai')}
                className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-xl transition-all text-left ${
                  activeChannel === 'studybot-ai'
                    ? 'bg-white/15 text-white font-semibold'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`}
              >
                <span>🤖</span>
                <span className="truncate"># studybot-ai</span>
              </button>
            </div>
          </div>

          {/* Group 3: Focus Methods */}
          <div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-1.5">
              Focus & Health
            </div>
            <div className="space-y-0.5">
              <button
                data-channel="focus-timer-hub"
                onClick={() => handleSelectChannel('focus-timer-hub')}
                className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-xl transition-all text-left ${
                  activeChannel === 'focus-timer-hub'
                    ? 'bg-white/15 text-white font-semibold'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`}
              >
                <span>⏱️</span>
                <span className="truncate"># focus-timer-hub</span>
              </button>

              <button
                data-channel="posture-guard"
                onClick={() => handleSelectChannel('posture-guard')}
                className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-xl transition-all text-left ${
                  activeChannel === 'posture-guard'
                    ? 'bg-white/15 text-white font-semibold'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`}
              >
                <span>🧘</span>
                <span className="truncate"># posture-guard</span>
              </button>
            </div>
          </div>

          {/* Group 4: Campus Life */}
          <div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-1.5">
              Campus Life
            </div>
            <div className="space-y-0.5">
              <button
                data-channel="bookstore-shop"
                onClick={() => handleSelectChannel('bookstore-shop')}
                className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-xl transition-all text-left ${
                  activeChannel === 'bookstore-shop'
                    ? 'bg-white/15 text-white font-semibold'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`}
              >
                <span>🛍️</span>
                <span className="truncate"># bookstore-shop</span>
              </button>

              <button
                data-channel="daily-quests"
                onClick={() => handleSelectChannel('daily-quests')}
                className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-xl transition-all text-left ${
                  activeChannel === 'daily-quests'
                    ? 'bg-white/15 text-white font-semibold'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`}
              >
                <span>📜</span>
                <span className="truncate"># daily-quests</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Bottom Sync Footer */}
        <div className="p-3 border-t border-white/10 bg-twilight-950/60 space-y-2">
          {/* Live Pomodoro Mini status */}
          <div
            onClick={() => handleSelectChannel('focus-timer-hub')}
            className="cursor-pointer bg-white/5 hover:bg-white/10 p-2 rounded-xl flex items-center justify-between text-xs transition-colors"
          >
            <div className="flex items-center space-x-2">
              <span>⏱️</span>
              <span className="font-mono font-bold text-amberGold-400">
                {String(pomodoroMinutesLeft).padStart(2, '0')}:
                {String(pomodoroSecondsLeft).padStart(2, '0')}
              </span>
            </div>
            <button
              id="mini-pomodoro-toggle"
              onClick={(e) => {
                e.stopPropagation();
                if (isPomodoroRunning) pausePomodoro();
                else startPomodoro();
              }}
              className="px-2 py-0.5 rounded-md bg-amberGold-400 text-twilight-950 font-bold text-[10px]"
            >
              {isPomodoroRunning ? 'PAUSE' : 'START'}
            </button>
          </div>

          {/* User Level & Coins */}
          <div className="flex items-center justify-between text-[11px] px-1 text-gray-400 font-medium">
            <span>Level {stats.level} Scholar</span>
            <span className="text-amberGold-300 font-bold">🪙 {stats.coins}</span>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amberGold-400 to-amberGold-500 rounded-full transition-all duration-300"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
        </div>
      </aside>

      {/* ============================================================== */}
      {/* COLUMN 3: MAIN FULL-HEIGHT STUDIO WORKSPACE (Flex-1)           */}
      {/* ============================================================== */}
      <main className="flex-1 flex flex-col min-w-0 z-10 bg-twilight-900/60 backdrop-blur-xs relative overflow-hidden">
        {/* Top Control Bar */}
        <header className="h-14 border-b border-white/10 px-5 flex items-center justify-between flex-shrink-0 bg-twilight-950/50 backdrop-blur-md">
          <div className="flex items-center space-x-3">
            <span className="font-editorial text-lg font-bold text-white flex items-center space-x-1.5">
              <span className="text-gray-400">#</span>
              <span>{activeChannel}</span>
            </span>
            <span className="hidden sm:inline-block text-gray-500">•</span>
            <span className="hidden sm:inline-block text-xs text-emerald-400">
              ● Connected to {currentRoomData.name}
            </span>
          </div>

          {/* Right Toolbar: Sound, Sky, Cinema */}
          <div className="flex items-center space-x-2">
            {/* Cinema Focus Mode Button */}
            <button
              onClick={toggleCinemaMode}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                sensory.cinemaMode
                  ? 'bg-amberGold-400 text-twilight-950 font-bold'
                  : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
              }`}
              title="Cinema Focus Mode"
            >
              <span>🎬</span>
              <span className="hidden md:inline">Cinema</span>
            </button>

            {/* Sky Time Cycler */}
            <button
              onClick={() => {
                sound.playClick();
                const modes = ['golden', 'twilight', 'midnight', 'dawn'] as const;
                const nextIdx = (modes.indexOf(skyMode as any) + 1) % modes.length;
                setSkyMode(modes[nextIdx]);
              }}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 text-xs font-semibold flex items-center space-x-1.5 capitalize transition-all"
              title="Cycle Sky Ambience"
            >
              <span>🌤️</span>
              <span className="hidden md:inline">{skyMode}</span>
            </button>

            {/* Audio Toggle */}
            <button
              onClick={() => {
                sound.playClick();
                updateSoundState({ isMuted: !soundState.isMuted });
              }}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 text-xs font-semibold flex items-center space-x-1.5 transition-all"
              title={soundState.isMuted ? 'Unmute' : 'Mute'}
            >
              <span>{soundState.isMuted ? '🔇' : '🔊'}</span>
            </button>
          </div>
        </header>

        {/* Studio Content Canvas */}
        <div className="flex-1 overflow-hidden relative">
          {renderMainStudio()}
        </div>

        {/* Quad Mascot Floating on workspace */}
        <CampusMascot />
      </main>

      {/* Retro Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-twilight-800 text-white border border-amberGold-400/40 px-4 py-2.5 rounded-2xl shadow-cozy-card flex items-center space-x-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <span className="text-amberGold-400">🔔</span>
          <span className="text-xs font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default DiscordWorkspace;
