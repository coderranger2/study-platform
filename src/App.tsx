import React from 'react';
import { CampusProvider, useCampus } from './context/CampusContext';
import { CampusBackdrop } from './components/CampusBackdrop';
import { CampusMascot } from './components/CampusMascot';
import { RetroWindow } from './components/RetroWindow';
import { DesktopIcon } from './components/desktop/DesktopIcon';
import { CinemaOverlay } from './components/desktop/CinemaOverlay';
import { Taskbar } from './components/Taskbar';

// Windows
import { CampusMapWindow } from './components/windows/CampusMapWindow';
import { StudyRoomsWindow } from './components/windows/StudyRoomsWindow';
import { StudyBotWindow } from './components/windows/StudyBotWindow';
import { ReaderWindow } from './components/windows/ReaderWindow';
import { FlashcardsWindow } from './components/windows/FlashcardsWindow';
import { PomodoroWindow } from './components/windows/PomodoroWindow';
import { SoundMixerWindow } from './components/windows/SoundMixerWindow';
import { SensoryTVWindow } from './components/windows/SensoryTVWindow';
import { PostureGuardWindow } from './components/windows/PostureGuardWindow';
import { ShopWindow } from './components/windows/ShopWindow';
import { QuestsWindow } from './components/windows/QuestsWindow';

const DesktopShell: React.FC = () => {
  const { windows, activeTheme, toastMessage } = useCampus();

  const renderWindowContent = (winId: string) => {
    switch (winId) {
      case 'campus-map':
        return <CampusMapWindow />;
      case 'study-room':
        return <StudyRoomsWindow />;
      case 'study-bot':
        return <StudyBotWindow />;
      case 'reader':
        return <ReaderWindow />;
      case 'flashcards':
        return <FlashcardsWindow />;
      case 'pomodoro':
        return <PomodoroWindow />;
      case 'sound-mixer':
        return <SoundMixerWindow />;
      case 'sensory-tv':
        return <SensoryTVWindow />;
      case 'posture-guard':
        return <PostureGuardWindow />;
      case 'shop':
        return <ShopWindow />;
      case 'quests':
        return <QuestsWindow />;
      default:
        return null;
    }
  };

  return (
    <div
      className="relative w-screen h-screen overflow-hidden select-none"
      data-theme={activeTheme}
    >
      {/* 1. Dynamic Room Artwork Backdrop (Library, Rooftop, Cafe, Arcade) */}
      <CampusBackdrop />

      {/* 2. Cinema Mode Vignette Overlay */}
      <CinemaOverlay />

      {/* 3. Retro 90s Desktop Icon Grid */}
      <div className="absolute top-3 left-2 z-20 flex flex-col gap-y-1 w-20 pointer-events-auto max-h-[calc(100vh-56px)] overflow-y-auto scrollbar-none select-none">
        <DesktopIcon id="campus-map" title="Campus Map" icon="🗺️" badge="L,R,C,N" />
        <DesktopIcon id="study-room" title="Study Rooms" icon="👥" badge="Live" />
        <DesktopIcon id="study-bot" title="StudyBot AI" icon="🤖" />
        <DesktopIcon id="reader" title="Adaptive Reader" icon="📖" />
        <DesktopIcon id="flashcards" title="Flashcards 3D" icon="🃏" />
        <DesktopIcon id="pomodoro" title="Pomodoro Dial" icon="⏱️" />
        <DesktopIcon id="sound-mixer" title="Sound Mixer" icon="🎚️" />
        <DesktopIcon id="sensory-tv" title="Sensory TV" icon="📺" />
        <DesktopIcon id="posture-guard" title="Posture Guard" icon="🧘" />
        <DesktopIcon id="shop" title="Campus Shop" icon="🛍️" />
        <DesktopIcon id="quests" title="Daily Quests" icon="📜" />
      </div>

      {/* 4. Active Windows Layer */}
      <div className="absolute inset-0 pointer-events-none">
        {windows.map((win) => {
          if (!win.isOpen || win.isMinimized) return null;
          return (
            <div key={win.id} className="pointer-events-auto">
              <RetroWindow window={win}>{renderWindowContent(win.id)}</RetroWindow>
            </div>
          );
        })}
      </div>

      {/* 5. Campus Mascot Companion */}
      <CampusMascot />

      {/* 6. Retro Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-[#ffffe1] text-black font-pixel text-xs px-3 py-2 rounded shadow-2xl retro-outset border border-black flex items-center space-x-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <span className="text-sm">🔔</span>
          <span className="font-bold">{toastMessage}</span>
        </div>
      )}

      {/* 7. Persistent CampusOS 98 Bottom Taskbar */}
      <Taskbar />
    </div>
  );
};

export function App() {
  return (
    <CampusProvider>
      <DesktopShell />
    </CampusProvider>
  );
}

export default App;
