import React, { useState, useEffect } from 'react';
import { useCampus } from '../../context/CampusContext';
import { sound } from '../../services/soundEffects';

export const DeskPet: React.FC = () => {
  const { activePet, stats } = useCampus();
  const [posX, setPosX] = useState(120);
  const [posY, setPosY] = useState(window.innerHeight - 100);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [speech, setSpeech] = useState<string | null>('Ready to study! ✨');
  const [isWandering, setIsWandering] = useState(true);

  // Random wander loop
  useEffect(() => {
    if (!isWandering) return;
    const interval = window.setInterval(() => {
      const maxX = Math.max(100, window.innerWidth - 140);
      const newX = Math.max(40, Math.min(maxX, posX + (Math.random() - 0.5) * 160));
      setDirection(newX > posX ? 'right' : 'left');
      setPosX(newX);

      // Random friendly tips
      if (Math.random() < 0.3) {
        const tips = [
          'Stay hydrated! 💧',
          'Remember to blink! 👁️',
          'Deep breaths, scholar. 🌿',
          `You have ${stats.coins} coins in your stash! 🪙`,
          'Focus now, arcade later! 🕹️',
          '20-20-20 rule: rest your eyes!',
          'Great focus streak today! ⭐',
        ];
        const tip = tips[Math.floor(Math.random() * tips.length)];
        setSpeech(tip);
        setTimeout(() => setSpeech(null), 4000);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [posX, isWandering, stats.coins]);

  // Pet Sprite mapping
  const getPetSprite = () => {
    switch (activePet) {
      case 'pet-duck':
        return { emoji: '🦆', name: 'Duck Debugger', sound: 'Quack! Check your syntax!' };
      case 'pet-dragon':
        return { emoji: '🐉', name: 'Fire Drake', sound: 'Rawr! Study streak ablaze!' };
      case 'pet-cat':
      default:
        return { emoji: '🐱', name: 'Pixel Cat', sound: 'Purr... Keep up the great work!' };
    }
  };

  const petInfo = getPetSprite();

  const handleClick = () => {
    sound.playCoin();
    setIsWandering((prev) => !prev);
    setSpeech(petInfo.sound);
    setTimeout(() => setSpeech(null), 3000);
  };

  return (
    <div
      className="fixed z-20 cursor-pointer select-none transition-all duration-700 ease-out"
      style={{
        left: `${posX}px`,
        bottom: `46px`,
      }}
      onClick={handleClick}
      title={`${petInfo.name} - Click to pet or toggle wandering`}
    >
      {/* Speech bubble */}
      {speech && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white text-black text-xs font-pixel px-2 py-1 rounded shadow-retro-window border border-black animate-bounce">
          {speech}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-black" />
        </div>
      )}

      {/* Pet Sprite */}
      <div
        className={`text-3xl p-1 bg-white/70 backdrop-blur-xs rounded-full border border-black/40 shadow-retro-window hover:scale-110 active:scale-95 transition-transform ${
          direction === 'left' ? 'scale-x-[-1]' : ''
        }`}
      >
        {petInfo.emoji}
      </div>
    </div>
  );
};
