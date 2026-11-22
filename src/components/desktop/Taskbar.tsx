import React, { useState, useEffect } from 'react';
import { useCampus } from '../../context/CampusContext';
import { StartMenu } from './StartMenu';
import { sound } from '../../services/soundEffects';
import { SkyMode, RoomId } from '../../types';

export const Taskbar: React.FC = () => {
  const {
    windows,
    activeWindowId,
    bringToFront,
    minimizeWindow,
    openWindow,
    pomodoroMinutesLeft,
    pomodoroSecondsLeft,
    isPomodoroRunning,
    startPomodoro,
    pausePomodoro,
    stats,
    currentRoom,
    switchRoom,
    skyMode,
    setSkyMode,
    soundState,
    updateSoundState,
    toggleCinemaMode,
    sensory,
  } = useCampus();

  const [isStartOpen, setIsStartOpen] = useState(false);
  const [timeStr, setTimeStr] = useState('');

  // Clock tick
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Window tab click handler
  const handleWindowTabClick = (winId: string) => {
    sound.playClick();
    const win = windows.find((w) => w.id === winId);
    if (!win) return;

    if (win.isMinimized) {
      bringToFront(winId);
    } else if (activeWindowId === winId) {
      minimizeWindow(winId);
    } else {
      bringToFront(winId);
    }
  };

  const cycleSkyMode = () => {
    sound.playClick();
    const modes: SkyMode[] = ['twilight', 'midnight', 'golden', 'dawn', 'realtime'];
    const nextIdx = (modes.indexOf(skyMode) + 1) % modes.length;
    setSkyMode(modes[nextIdx]);
  };

  const toggleSoundMute = () => {
    sound.playClick();
    updateSoundState({ isMuted: !soundState.isMuted });
  };

  const getSkyIcon = () => {
    switch (skyMode) {
      case 'golden':
        return '☀️ Golden Hour';
      case 'midnight':
        return '🌌 Midnight Lo-Fi';
      case 'dawn':
        return '🌅 Dawn';
      case 'realtime':
        return '🕒 Real-Time';
      case 'twilight':
      default:
        return '🌆 Twilight';
    }
  };

  // Rooms list for quick taskbar switcher
  const roomsList: { id: RoomId; name: string; key: string }[] = [
    { id: 'library', name: 'Lib', key: 'L' },
    { id: 'rooftop', name: 'Roof', key: 'R' },
    { id: 'cafe', name: 'Cafe', key: 'C' },
    { id: 'arcade', name: 'Arc', key: 'N' },
  ];

  const xpProgress = Math.min(100, Math.round(((stats.xp % 200) / 200) * 100));

  return (
    <>
      <StartMenu isOpen={isStartOpen} onClose={() => setIsStartOpen(false)} />

      <footer className="fixed bottom-0 left-0 right-0 h-11 bg-[#c0c0c0] retro-outset z-40 flex items-center px-1.5 select-none text-black font-pixel space-x-1">
        {/* Start / Campus Map Button */}
        <button
          onClick={() => {
            sound.playClick();
            setIsStartOpen((prev) => !prev);
          }}
          className={`h-8 px-2.5 flex items-center space-x-1.5 retro-btn font-bold text-sm tracking-wide ${
            isStartOpen ? 'pressed bg-[#dfdfdf]' : ''
          }`}
          title="Click to open CampusOS 98 Start Menu"
        >
          <span className="text-base">🏛️</span>
          <span className="font-display text-xs">Start</span>
        </button>

        {/* Room Switcher Shortcuts */}
        <div className="hidden md:flex items-center space-x-0.5 px-1 py-0.5 retro-inset bg-gray-300">
          <span className="text-[10px] text-gray-600 font-bold mr-1">Quad:</span>
          {roomsList.map((r) => (
            <button
              key={r.id}
              onClick={() => switchRoom(r.id)}
              className={`px-1.5 py-0.5 text-xs font-bold rounded ${
                currentRoom === r.id
                  ? 'bg-[#000080] text-white'
                  : 'hover:bg-gray-400 text-black'
              }`}
              title={`Switch to ${r.name} (Hotkey: ${r.key})`}
            >
              [{r.key}] {r.name}
            </button>
          ))}
        </div>

        {/* Taskbar Active Window Tabs */}
        <div className="flex-1 flex items-center space-x-1 overflow-x-auto h-8 px-1 scrollbar-none">
          {windows
            .filter((w) => w.isOpen)
            .map((win) => {
              const isActive = activeWindowId === win.id && !win.isMinimized;
              return (
                <button
                  key={win.id}
                  onClick={() => handleWindowTabClick(win.id)}
                  className={`h-7 px-2 max-w-[150px] flex items-center space-x-1.5 text-xs truncate retro-btn font-bold ${
                    isActive ? 'pressed bg-[#dfdfdf] border-t-black' : 'bg-[#c0c0c0]'
                  }`}
                  title={win.title}
                >
                  <span className="text-sm flex-shrink-0">{win.icon}</span>
                  <span className="truncate">{win.title.split('-')[0].trim()}</span>
                </button>
              );
            })}
        </div>

        {/* Live Pomodoro Taskbar Mini-Widget */}
        <div
          onClick={() => openWindow('pomodoro')}
          className="cursor-pointer flex items-center space-x-1.5 px-2 py-0.5 retro-inset bg-black text-amber-400 font-pixel text-xs tracking-wider"
          title="Click to open Pomodoro Sprint Dial"
        >
          <span className="text-sm">⏱️</span>
          <span className="font-bold text-sm">
            {String(pomodoroMinutesLeft).padStart(2, '0')}:
            {String(pomodoroSecondsLeft).padStart(2, '0')}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (isPomodoroRunning) pausePomodoro();
              else startPomodoro();
            }}
            className="w-4 h-4 bg-amber-400 text-black font-bold flex items-center justify-center rounded text-[10px] hover:bg-amber-300"
            title={isPomodoroRunning ? 'Pause timer' : 'Start sprint'}
          >
            {isPomodoroRunning ? '⏸' : '▶'}
          </button>
        </div>

        {/* XP and Level Bar */}
        <div
          onClick={() => openWindow('quests')}
          className="hidden lg:flex items-center space-x-1.5 px-2 py-0.5 retro-inset bg-gray-200 cursor-pointer"
          title="Daily Quests & Level Progress"
        >
          <span className="font-bold text-xs text-blue-900">Lv.{stats.level}</span>
          <div className="w-14 h-3 bg-gray-400 retro-inset overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
          <span className="text-[10px] text-gray-700 font-bold">{stats.xp}XP</span>
        </div>

        {/* Coin Balance Pill */}
        <button
          onClick={() => {
            sound.playCoin();
            openWindow('shop');
          }}
          className="flex items-center space-x-1 px-2 py-0.5 retro-inset bg-amber-100 text-amber-950 hover:bg-amber-200 cursor-pointer text-xs font-bold"
          title="Campus Bookstore & Reward Shop"
        >
          <span>🪙</span>
          <span>{stats.coins}</span>
        </button>

        {/* System Tray */}
        <div className="flex items-center space-x-1.5 px-2 py-0.5 retro-inset bg-[#dfdfdf] text-xs">
          {/* Cinema mode toggle button */}
          <button
            onClick={toggleCinemaMode}
            className={`px-1 py-0.5 rounded text-xs ${
              sensory.cinemaMode ? 'bg-amber-400 text-black font-bold' : 'hover:bg-gray-300'
            }`}
            title={`Cinema Focus Mode: ${sensory.cinemaMode ? 'ON' : 'OFF'}`}
          >
            🎬
          </button>

          {/* Sky Backdrop Cycle Button */}
          <button
            onClick={cycleSkyMode}
            className="px-1 py-0.5 hover:bg-gray-300 rounded text-xs flex items-center space-x-0.5"
            title="Switch Sky Backdrop Time (Golden / Twilight / Midnight / Dawn / Real-Time)"
          >
            <span className="text-xs">{getSkyIcon()}</span>
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={toggleSoundMute}
            className="px-1 py-0.5 hover:bg-gray-300 rounded text-xs"
            title={soundState.isMuted ? 'Unmute Audio Suite' : 'Mute Sound Effects'}
          >
            {soundState.isMuted ? '🔇' : '🔊'}
          </button>

          {/* Digital Clock */}
          <span className="font-bold text-xs pl-1 border-l border-gray-400">{timeStr}</span>
        </div>
      </footer>
    </>
  );
};
