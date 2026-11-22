import React from 'react';
import { useCampus } from '../../context/CampusContext';
import { sound } from '../../services/soundEffects';

export const SoundMixerWindow: React.FC = () => {
  const { soundState, updateSoundState, showToast } = useCampus();

  const handleSliderChange = (key: keyof typeof soundState, val: number) => {
    updateSoundState({ [key]: val });
  };

  const applyPreset = (preset: 'rain' | 'cafe' | 'alpha' | 'vinyl') => {
    sound.playClick();
    if (preset === 'rain') {
      updateSoundState({
        rainVolume: 0.8,
        thunderVolume: 0.4,
        crackleVolume: 0.1,
        cafeVolume: 0,
        alphaVolume: 0.1,
      });
      showToast('🌧️ Applied Midnight Rainstorm Soundscape');
    } else if (preset === 'cafe') {
      updateSoundState({
        rainVolume: 0.1,
        thunderVolume: 0,
        crackleVolume: 0.3,
        cafeVolume: 0.75,
        alphaVolume: 0.1,
      });
      showToast('☕ Applied Lo-Fi Coffeehouse Soundscape');
    } else if (preset === 'alpha') {
      updateSoundState({
        rainVolume: 0.2,
        thunderVolume: 0,
        crackleVolume: 0,
        cafeVolume: 0,
        alphaVolume: 0.8,
      });
      showToast('🧠 Applied 10Hz Alpha Waves Deep Study Tone');
    } else if (preset === 'vinyl') {
      updateSoundState({
        rainVolume: 0.25,
        thunderVolume: 0.1,
        crackleVolume: 0.65,
        cafeVolume: 0.2,
        alphaVolume: 0.1,
      });
      showToast('📻 Applied Vintage Vinyl Record Ambience');
    }
  };

  const sliders = [
    { key: 'rainVolume' as const, label: '🌧️ Pink Noise Rain', value: soundState.rainVolume, desc: 'Procedural filtered pink-noise drizzle' },
    { key: 'thunderVolume' as const, label: '⚡ Low-Pass Thunder', value: soundState.thunderVolume, desc: 'Sub-bass rolling rumble' },
    { key: 'crackleVolume' as const, label: '📻 Vinyl Record Crackle', value: soundState.crackleVolume, desc: 'Analog needle pops & warm static' },
    { key: 'cafeVolume' as const, label: '☕ Coffeehouse Murmur', value: soundState.cafeVolume, desc: 'Gentle cafe chatter & porcelain clinks' },
    { key: 'alphaVolume' as const, label: '🧠 10Hz Alpha Binaural', value: soundState.alphaVolume, desc: 'Left/right frequency delta for focus' },
  ];

  return (
    <div className="flex flex-col h-full font-sans select-none overflow-y-auto space-y-3 p-1">
      {/* 1. Header Banner & Master Mute */}
      <div className="bg-[#dfdfdf] p-2 rounded retro-inset flex items-center justify-between">
        <div>
          <span className="font-pixel text-xs font-bold text-gray-900 block">
            🎚️ PROCEDURAL AMBIENT SYNTHESIZER
          </span>
          <span className="text-[10px] text-gray-600">
            Synthesized live via Web Audio API • 0 external audio downloads
          </span>
        </div>
        <button
          onClick={() => updateSoundState({ isMuted: !soundState.isMuted })}
          className={`px-3 py-1 retro-btn font-pixel text-xs font-bold ${
            soundState.isMuted ? 'pressed bg-red-200 text-red-950' : 'bg-emerald-200 text-emerald-950'
          }`}
        >
          {soundState.isMuted ? '🔇 Audio Muted' : '🔊 Audio Active'}
        </button>
      </div>

      {/* 2. Quick Soundscape Presets */}
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => applyPreset('rain')}
          className="flex-1 py-1 px-2 retro-btn font-pixel text-xs text-blue-950 hover:bg-blue-100"
        >
          🌧️ Rainstorm
        </button>
        <button
          onClick={() => applyPreset('cafe')}
          className="flex-1 py-1 px-2 retro-btn font-pixel text-xs text-amber-950 hover:bg-amber-100"
        >
          ☕ Coffeehouse
        </button>
        <button
          onClick={() => applyPreset('alpha')}
          className="flex-1 py-1 px-2 retro-btn font-pixel text-xs text-purple-950 hover:bg-purple-100"
        >
          🧠 Alpha Waves
        </button>
        <button
          onClick={() => applyPreset('vinyl')}
          className="flex-1 py-1 px-2 retro-btn font-pixel text-xs text-stone-950 hover:bg-stone-200"
        >
          📻 Lo-Fi Vinyl
        </button>
      </div>

      {/* 3. Vintage Sliders Rack */}
      <div className="bg-stone-900 text-amber-400 p-3 rounded retro-inset border-2 border-stone-700 space-y-3 font-pixel">
        {sliders.map((s) => (
          <div key={s.key} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold tracking-wide">{s.label}</span>
              <span className="font-mono text-emerald-400">{Math.round(s.value * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={s.value}
              onChange={(e) => handleSliderChange(s.key, parseFloat(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer h-2 bg-stone-700 rounded-lg appearance-none"
            />
            <span className="text-[9px] text-stone-400 block font-sans">{s.desc}</span>
          </div>
        ))}
      </div>

      {/* 4. Master Volume */}
      <div className="bg-[#dfdfdf] p-2 rounded retro-inset flex items-center justify-between text-xs font-pixel">
        <span className="font-bold text-gray-800">Master Volume:</span>
        <div className="flex items-center space-x-2 flex-1 max-w-[200px] ml-2">
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={soundState.masterVolume}
            onChange={(e) => updateSoundState({ masterVolume: parseFloat(e.target.value) })}
            className="w-full accent-blue-700 cursor-pointer"
          />
          <span className="text-gray-700 font-mono w-8 text-right">
            {Math.round(soundState.masterVolume * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
};
