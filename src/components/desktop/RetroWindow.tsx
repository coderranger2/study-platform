import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { useCampus } from '../../context/CampusContext';
import { WindowState } from '../../types';

interface RetroWindowProps {
  window: WindowState;
  children: ReactNode;
}

export const RetroWindow: React.FC<RetroWindowProps> = ({ window: win, children }) => {
  const {
    activeWindowId,
    bringToFront,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    updateWindowPosition,
    sensory,
  } = useCampus();

  const isFocused = activeWindowId === win.id;
  const isCinemaFocused = sensory.cinemaMode && isFocused;

  // Dragging state
  const [isDragging, setIsDragging] = useState(false);
  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleMouseDownHeader = (e: React.MouseEvent) => {
    // Only drag with primary mouse button and not on title buttons
    if (e.button !== 0 || win.isMaximized) return;
    bringToFront(win.id);
    setIsDragging(true);
    dragOffsetRef.current = {
      x: e.clientX - win.position.x,
      y: e.clientY - win.position.y,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const newX = Math.max(10, Math.min(window.innerWidth - 80, e.clientX - dragOffsetRef.current.x));
      const newY = Math.max(10, Math.min(window.innerHeight - 100, e.clientY - dragOffsetRef.current.y));
      updateWindowPosition(win.id, newX, newY);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, win.id, updateWindowPosition]);

  if (!win.isOpen || win.isMinimized) {
    return null;
  }

  // Calculate style for normal vs maximized window
  const windowStyle: React.CSSProperties = win.isMaximized
    ? {
        position: 'fixed',
        left: 0,
        top: 0,
        width: '100vw',
        height: 'calc(100vh - 44px)',
        zIndex: win.zIndex,
      }
    : {
        position: 'fixed',
        left: `${win.position.x}px`,
        top: `${win.position.y}px`,
        width: `${win.size.width}px`,
        height: `${win.size.height}px`,
        zIndex: win.zIndex,
      };

  return (
    <div
      style={windowStyle}
      onClick={() => bringToFront(win.id)}
      className={`retro-window-frame flex flex-col transition-shadow duration-200 select-text ${
        isCinemaFocused
          ? 'ring-4 ring-amber-300 ring-offset-4 ring-offset-black/60 shadow-[0_0_35px_rgba(251,191,36,0.6)]'
          : sensory.cinemaMode
          ? 'opacity-35 pointer-events-none filter blur-[0.5px]'
          : 'shadow-retro-window'
      }`}
    >
      {/* 90s Title Bar */}
      <div
        onMouseDown={handleMouseDownHeader}
        className={`px-2 py-1 flex items-center justify-between select-none cursor-move ${
          isFocused ? 'retro-titlebar-active' : 'retro-titlebar-inactive'
        }`}
      >
        <div className="flex items-center space-x-2 truncate">
          <span className="text-sm">{win.icon}</span>
          <span className="font-pixel text-base font-bold tracking-wide truncate">
            {win.title}
          </span>
        </div>

        {/* Window action buttons: Minimize, Maximize, Close */}
        <div
          className="flex items-center space-x-1.5 flex-shrink-0"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Minimize button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              minimizeWindow(win.id);
            }}
            className="w-6 h-6 retro-btn flex items-center justify-center font-bold text-xs text-black leading-none hover:bg-gray-300 active:bg-gray-400"
            title="Minimize"
          >
            _
          </button>

          {/* Maximize / Restore button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              maximizeWindow(win.id);
            }}
            className="w-6 h-6 retro-btn flex items-center justify-center font-bold text-xs text-black leading-none hover:bg-gray-300 active:bg-gray-400"
            title={win.isMaximized ? 'Restore' : 'Maximize'}
          >
            {win.isMaximized ? '❐' : '□'}
          </button>

          {/* Close button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeWindow(win.id);
            }}
            className="w-6 h-6 retro-btn flex items-center justify-center font-bold text-xs text-black leading-none hover:bg-red-400 hover:text-white active:bg-red-600"
            title="Close"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Window Body */}
      <div className="flex-1 overflow-auto bg-[#c0c0c0] text-black p-2 relative">
        {children}
      </div>
    </div>
  );
};
