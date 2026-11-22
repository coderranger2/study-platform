import React from 'react';
import { useCampus } from '../../context/CampusContext';

export const CinemaOverlay: React.FC = () => {
  const { sensory, toggleCinemaMode } = useCampus();

  if (!sensory.cinemaMode) return null;

  return (
    <div
      onClick={toggleCinemaMode}
      className="fixed inset-0 z-30 bg-black/65 backdrop-blur-[1px] transition-opacity duration-300 pointer-events-auto cursor-pointer"
      title="Cinema Mode Active - Click background to exit"
    >
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-amber-400 text-black font-pixel text-sm px-4 py-1 rounded shadow-retro-window border border-black flex items-center space-x-2 animate-pulse">
        <span>🎬 CINEMA FOCUS MODE ACTIVE</span>
        <span className="text-xs bg-black text-amber-300 px-1 rounded">Click anywhere to exit</span>
      </div>
    </div>
  );
};
