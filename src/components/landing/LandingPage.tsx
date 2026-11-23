import React, { useState } from 'react';
import { useCampus } from '../../context/CampusContext';
import { CampusBackdrop } from '../CampusBackdrop';
import { RoomId } from '../../types';
import { sound } from '../../services/soundEffects';

export const LandingPage: React.FC = () => {
  const { currentRoom, switchRoom, openAuthModal, rooms, soundState, updateSoundState } = useCampus();
  const [bentoCardFlipped, setBentoCardFlipped] = useState(false);
  const [demoPptExtracted, setDemoPptExtracted] = useState(false);

  const handleHeroRoomClick = (roomId: RoomId) => {
    sound.playClick();
    switchRoom(roomId);
  };

  const currentRoomData = rooms[currentRoom];

  return (
    <div className="relative min-h-screen text-slate-100 overflow-x-hidden font-sans selection:bg-amberGold-400/30 selection:text-white">
      {/* Dynamic Campus Backdrop Canvas behind hero */}
      <CampusBackdrop className="opacity-80" />

      {/* Subtle overlay gradient */}
      <div className="fixed inset-0 bg-gradient-to-b from-twilight-950/60 via-twilight-950/80 to-twilight-950 pointer-events-none" />

      {/* Top Navbar */}
      <header className="relative z-20 border-b border-white/10 bg-twilight-950/70 backdrop-blur-md sticky top-0 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-amberGold-400/15 border border-amberGold-400/30 flex items-center justify-center text-xl text-amberGold-400 shadow-soft-glow">
            🏛️
          </div>
          <div>
            <h1 className="font-editorial text-xl font-bold text-white tracking-wide">
              Campus <span className="text-amberGold-400 font-normal italic">StudyHub</span>
            </h1>
            <span className="text-[10px] text-gray-400 tracking-wider uppercase block font-semibold">
              Cozy Twilight Study Platform
            </span>
          </div>
        </div>

        {/* Live presence counter */}
        <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 font-semibold">2,418 Students Online</span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-300">Across 4 Quads</span>
        </div>

        {/* Auth CTA buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={openAuthModal}
            className="px-4 py-2 text-xs font-semibold text-gray-300 hover:text-white transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={openAuthModal}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-amberGold-400 to-amberGold-500 hover:from-amberGold-500 hover:to-amberGold-600 text-twilight-950 font-bold text-xs shadow-soft-glow transition-all active:scale-95"
          >
            Start Studying Free →
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative z-10 pt-16 pb-20 px-6 max-w-6xl mx-auto text-center flex flex-col items-center">
        {/* Live Quad Pill */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-amberGold-400/10 border border-amberGold-400/30 text-amberGold-300 text-xs font-medium mb-6 shadow-soft-glow">
          <span>✨</span>
          <span>A cozy, ambient sanctuary designed for deep cognitive flow</span>
        </div>

        {/* Headline */}
        <h2 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1] max-w-4xl mb-6">
          The Cozy, Multiplayer Study Workspace for{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amberGold-300 via-amberGold-400 to-amber-500 italic">
            Deep Focus.
          </span>
        </h2>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto mb-8 font-light leading-relaxed">
          Escape distractions. Study alongside companions in atmospheric campus environments, digest lecture slides with smart AI summaries, and build active-recall memory decks.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
          <button
            onClick={openAuthModal}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amberGold-400 via-amberGold-500 to-amber-500 hover:from-amberGold-500 hover:to-amber-600 text-twilight-950 font-bold text-sm shadow-soft-glow transition-all active:scale-95 flex items-center justify-center space-x-2"
          >
            <span>Enter Study Workspace Free</span>
            <span>→</span>
          </button>
          <button
            onClick={openAuthModal}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-semibold text-sm border border-white/10 transition-all flex items-center justify-center space-x-2"
          >
            <span>1-Click Demo Profile</span>
          </button>
        </div>

        {/* Interactive Environment Preview Switcher */}
        <div className="w-full max-w-2xl bg-twilight-900/80 backdrop-blur-md p-3 rounded-2xl border border-white/15 shadow-cozy-card">
          <div className="text-xs text-gray-400 mb-2 font-medium flex items-center justify-between px-2">
            <span>Interactive Quad Backdrop Switcher:</span>
            <span className="text-amberGold-400">Current: {currentRoomData.name}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(['library', 'rooftop', 'cafe', 'arcade'] as RoomId[]).map((r) => {
              const isSelected = currentRoom === r;
              const rData = rooms[r];
              return (
                <button
                  key={r}
                  onClick={() => handleHeroRoomClick(r)}
                  className={`p-2.5 rounded-xl text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-amberGold-400/20 border-2 border-amberGold-400 shadow-soft-glow'
                      : 'bg-white/5 hover:bg-white/10 border border-white/5 text-gray-300'
                  }`}
                >
                  <div className="text-xl mb-1">{rData.icon}</div>
                  <div>
                    <span className="font-editorial text-xs font-semibold text-white block">
                      {rData.name.split(' ')[0]}
                    </span>
                    <span className="text-[10px] text-gray-400 block truncate">
                      {rData.occupants} studying
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* BENTO GRID FEATURE PREVIEWS */}
      <section className="relative z-10 py-16 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-widest text-amberGold-400 font-bold block mb-2">
            High-Craft Study Tools
          </span>
          <h3 className="font-editorial text-3xl sm:text-5xl font-bold text-white">
            Everything you need for effortless academic mastery.
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Bento Card 1: PDF & PPT Lecture Studio (Col 1-7) */}
          <div className="md:col-span-7 bg-twilight-850/80 backdrop-blur-md rounded-3xl p-6 border border-white/10 shadow-cozy-card flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="p-2.5 rounded-2xl bg-amberGold-400/10 border border-amberGold-400/20 text-xl text-amberGold-400">
                  📑
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">
                  AI Lecture Digest
                </span>
              </div>
              <h4 className="font-editorial text-2xl font-semibold text-white mb-2">
                PDF & Presentation Analyzer
              </h4>
              <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                Drag and drop your lecture slides or syllabus notes. Get slide-by-slide concepts, mathematical breakdowns, and one-click flashcards.
              </p>

              {/* Interactive Mini-Demo */}
              <div className="bg-twilight-950/80 p-4 rounded-2xl border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-white/5">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">📊</span>
                    <span className="font-medium text-white">CS440_Raft_Consensus.pptx</span>
                  </div>
                  <button
                    onClick={() => {
                      sound.playClick();
                      setDemoPptExtracted(!demoPptExtracted);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-amberGold-400 text-twilight-950 font-bold text-[11px] hover:bg-amberGold-500"
                  >
                    {demoPptExtracted ? '↺ Reset Demo' : '⚡ Extract Concepts'}
                  </button>
                </div>

                {demoPptExtracted ? (
                  <div className="text-xs space-y-2 pt-1 animate-in fade-in duration-300">
                    <div className="p-2 rounded-lg bg-white/5 text-gray-300">
                      <span className="text-amberGold-300 font-bold block">Slide 1: State Machine Replication</span>
                      <span>Execution sequences must be identical across all cluster nodes.</span>
                    </div>
                    <div className="p-2 rounded-lg bg-white/5 text-gray-300">
                      <span className="text-amberGold-300 font-bold block">Slide 2: Quorum Invariant</span>
                      <span>Overlapping majorities guarantee latest term commit is preserved.</span>
                    </div>
                    <button
                      onClick={openAuthModal}
                      className="w-full py-1.5 bg-amberGold-400/15 hover:bg-amberGold-400/25 border border-amberGold-400/30 text-amberGold-300 rounded-lg text-xs font-semibold text-center"
                    >
                      Convert to Study Deck in Studio →
                    </button>
                  </div>
                ) : (
                  <div className="py-4 text-center text-xs text-gray-500 border border-dashed border-white/10 rounded-xl">
                    Click "Extract Concepts" to test live slide schema parsing
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
              <span>Supports PDF, PPTX, Markdown, Text</span>
              <button onClick={openAuthModal} className="text-amberGold-300 hover:underline font-semibold">
                Try in Workspace →
              </button>
            </div>
          </div>

          {/* Bento Card 2: 3D Active-Recall Flashcards (Col 8-12) */}
          <div className="md:col-span-5 bg-twilight-850/80 backdrop-blur-md rounded-3xl p-6 border border-white/10 shadow-cozy-card flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="p-2.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-xl text-purple-400">
                  🃏
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">
                  Active Recall
                </span>
              </div>
              <h4 className="font-editorial text-2xl font-semibold text-white mb-2">
                3D Flashcards Arena
              </h4>
              <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                Test yourself with 3D tactile flip cards, spaced repetition intervals, and streak tracking.
              </p>

              {/* Interactive Flip Card Demo */}
              <div
                id="bento-flashcard-preview"
                onClick={() => {
                  sound.playCardFlip();
                  setBentoCardFlipped(!bentoCardFlipped);
                }}
                className="cursor-pointer bg-gradient-to-br from-twilight-950 to-plum-950 p-5 rounded-2xl border border-white/15 h-36 flex flex-col justify-between hover:border-amberGold-400/40 transition-all select-none"
              >
                <div className="flex items-center justify-between text-[11px] text-gray-400">
                  <span>{bentoCardFlipped ? 'ANSWER (BACK)' : 'PROMPT (FRONT)'}</span>
                  <span className="text-amberGold-400">Click to flip ↺</span>
                </div>
                <div className="text-center font-medium text-sm text-white">
                  {bentoCardFlipped
                    ? 'Active retrieval practice triggers neurogenesis and strengthens synaptic potentiation.'
                    : 'Why is Active Recall biologically superior to passive re-reading?'}
                </div>
                <div className="text-[10px] text-gray-500 text-center">
                  Cognitive Science Deck
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
              <span>Spaced repetition engine</span>
              <button onClick={openAuthModal} className="text-amberGold-300 hover:underline font-semibold">
                Open Flashcards →
              </button>
            </div>
          </div>

          {/* Bento Card 3: Discord-Style Live Study Rooms (Col 1-6) */}
          <div className="md:col-span-6 bg-twilight-850/80 backdrop-blur-md rounded-3xl p-6 border border-white/10 shadow-cozy-card flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="p-2.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xl text-blue-400">
                  👥
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">
                  Multiplayer Presence
                </span>
              </div>
              <h4 className="font-editorial text-2xl font-semibold text-white mb-2">
                Live Companion Study Tables
              </h4>
              <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                Take a seat beside peers across the globe. See real-time focus task badges and synchronize Pomodoro cycles.
              </p>

              {/* Companion Avatars Preview */}
              <div className="bg-twilight-950/80 p-3.5 rounded-2xl border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-white/5">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">👩‍💻</span>
                    <div>
                      <span className="font-semibold text-white block">Sasha_CS</span>
                      <span className="text-[10px] text-gray-400">Debugging Distributed Systems</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold">● 142m Focus</span>
                </div>

                <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-white/5">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">👨‍🔬</span>
                    <div>
                      <span className="font-semibold text-white block">Kenji_Neuro</span>
                      <span className="text-[10px] text-gray-400">Reading Synaptic Plasticity Ch. 4</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold">● 89m Focus</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
              <span>Silent focus & collaborative channels</span>
              <button onClick={openAuthModal} className="text-amberGold-300 hover:underline font-semibold">
                Join a Table →
              </button>
            </div>
          </div>

          {/* Bento Card 4: Sensory Soundscapes & Focus Timers (Col 7-12) */}
          <div className="md:col-span-6 bg-twilight-850/80 backdrop-blur-md rounded-3xl p-6 border border-white/10 shadow-cozy-card flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xl text-amberGold-400">
                  🎚️
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">
                  Web Audio Procedural
                </span>
              </div>
              <h4 className="font-editorial text-2xl font-semibold text-white mb-2">
                Procedural Ambient Soundscapes
              </h4>
              <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                Zero external audio downloads. Real-time synthesized pink-noise rain, crackling vinyl, warm cafe murmurs, and 10Hz alpha binaural beats.
              </p>

              {/* Interactive Sound Sliders Demo */}
              <div className="bg-twilight-950/80 p-3.5 rounded-2xl border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-300 flex items-center space-x-1.5">
                    <span>🌧️</span>
                    <span>Pink Noise Rain</span>
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={soundState.rainVolume}
                    onChange={(e) => updateSoundState({ rainVolume: parseFloat(e.target.value) })}
                    className="w-32 accent-amberGold-400 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-300 flex items-center space-x-1.5">
                    <span>📻</span>
                    <span>Vinyl Record Crackle</span>
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={soundState.crackleVolume}
                    onChange={(e) => updateSoundState({ crackleVolume: parseFloat(e.target.value) })}
                    className="w-32 accent-amberGold-400 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
              <span>Binaural beats & ergonomic timers</span>
              <button onClick={openAuthModal} className="text-amberGold-300 hover:underline font-semibold">
                Open Sound Mixer →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <footer className="relative z-10 border-t border-white/10 bg-twilight-950/80 backdrop-blur-md py-12 px-6 text-center">
        <h4 className="font-editorial text-2xl font-bold text-white mb-2">
          Ready to transform how you study?
        </h4>
        <p className="text-xs text-gray-400 max-w-md mx-auto mb-6">
          Join thousands of university scholars focusing in ambient twilight quads.
        </p>
        <button
          onClick={openAuthModal}
          className="px-8 py-3 rounded-xl bg-amberGold-400 hover:bg-amberGold-500 text-twilight-950 font-bold text-xs shadow-soft-glow transition-all"
        >
          Create Free Student Account →
        </button>
        <div className="text-[11px] text-gray-500 mt-6">
          StudyHub / Campus • Accessible EdTech & Cozy Focus Platform
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
