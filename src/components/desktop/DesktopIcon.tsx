import React from 'react';
import { useCampus } from '../../context/CampusContext';
import { sound } from '../../services/soundEffects';

interface DesktopIconProps {
  id: string;
  title: string;
  icon: string;
  badge?: string;
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({ id, title, icon, badge }) => {
  const { openWindow, bringToFront, windows } = useCampus();

  const handleClick = () => {
    sound.playClick();
    const win = windows.find((w) => w.id === id);
    if (win && win.isOpen) {
      bringToFront(id);
    } else {
      openWindow(id);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="group w-20 flex flex-col items-center justify-center p-2 rounded cursor-pointer hover:bg-white/15 active:bg-blue-600/30 transition-all select-none text-center"
      title={`Open ${title}`}
    >
      <div className="relative text-3xl mb-1 filter drop-shadow-md group-hover:scale-105 transition-transform">
        <span>{icon}</span>
        {badge && (
          <span className="absolute -top-1 -right-2 bg-red-600 text-white font-pixel text-[10px] px-1 rounded-full border border-white">
            {badge}
          </span>
        )}
      </div>
      <span className="text-white font-pixel text-xs leading-tight tracking-wider px-1 py-0.5 rounded shadow-sm group-hover:bg-[#000080] group-hover:text-white drop-shadow-[1px_1px_1px_rgba(0,0,0,0.8)]">
        {title}
      </span>
    </div>
  );
};
