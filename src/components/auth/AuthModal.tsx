import React, { useState } from 'react';
import { useCampus } from '../../context/CampusContext';
import { sound } from '../../services/soundEffects';

const MAJORS = [
  'Computer Science & AI',
  'Cognitive Neuroscience',
  'Pre-Med & Biology',
  'Architecture & Design',
  'Mathematics & Statistics',
  'Psychology & Philosophy',
  'Mechanical Engineering',
  'Literature & Creative Writing',
];

const AVATARS = ['🎓', '👩‍💻', '👨‍🔬', '🎨', '🎧', '📐', '📚', '☕', '💡', '🐱'];

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, login } = useCampus();
  const [name, setName] = useState('');
  const [major, setMajor] = useState(MAJORS[0]);
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [isSignUp, setIsSignUp] = useState(true);

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(name || (isSignUp ? 'New Scholar' : 'Student Scholar'), major, avatar);
  };

  const handleDemoLogin = () => {
    login('Alex_Scholar', 'Computer Science & AI', '👩‍💻');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={closeAuthModal} />

      <div
        className="relative w-full max-w-md bg-twilight-900 border border-white/15 rounded-3xl p-6 shadow-cozy-card z-10 flex flex-col space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2">
            <span className="text-2xl p-1 bg-amberGold-400/10 rounded-xl border border-amberGold-400/30">
              🏛️
            </span>
            <div>
              <h3 className="font-editorial text-xl font-bold text-white">
                {isSignUp ? 'Join Campus StudyHub' : 'Welcome Back, Scholar'}
              </h3>
              <p className="text-xs text-gray-400">
                {isSignUp ? 'Create your student workspace profile' : 'Sign in to access your study rooms'}
              </p>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center text-sm transition-all"
          >
            ✕
          </button>
        </div>

        {/* 1-Click Demo Login Banner */}
        <div className="bg-amberGold-400/10 border border-amberGold-400/25 p-3 rounded-2xl flex items-center justify-between">
          <div className="text-xs text-amberGold-200">
            <span className="font-bold block text-white">Instant Demo Access</span>
            <span>Explore live rooms & AI studio instantly</span>
          </div>
          <button
            onClick={handleDemoLogin}
            className="px-3.5 py-1.5 bg-amberGold-400 hover:bg-amberGold-500 text-twilight-950 font-bold text-xs rounded-xl shadow-soft-glow transition-all"
          >
            1-Click Demo →
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Your Name or Student Handle
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Maya_Neuro or Devin_CS"
              className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-amberGold-400/60 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Academic Major / Study Focus
            </label>
            <select
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-twilight-800 border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-amberGold-400/60 transition-all"
            >
              {MAJORS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Select Your Student Avatar
            </label>
            <div className="flex flex-wrap gap-2">
              {AVATARS.map((av) => (
                <button
                  type="button"
                  key={av}
                  onClick={() => {
                    sound.playClick();
                    setAvatar(av);
                  }}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all ${
                    avatar === av
                      ? 'bg-amberGold-400/20 border-2 border-amberGold-400 scale-105'
                      : 'bg-white/5 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-gradient-to-r from-amberGold-400 to-amberGold-500 hover:from-amberGold-500 hover:to-amberGold-600 text-twilight-950 font-bold text-sm rounded-xl shadow-soft-glow transition-all active:scale-[0.99] mt-2"
          >
            {isSignUp ? 'Create Student Account & Enter Quad →' : 'Sign In to Workspace →'}
          </button>
        </form>

        {/* Toggle between Sign Up and Sign In */}
        <div className="text-center pt-2 border-t border-white/10 text-xs text-gray-400">
          <span>{isSignUp ? 'Already have an account? ' : "Don't have an account yet? "}</span>
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-amberGold-300 hover:underline font-semibold"
          >
            {isSignUp ? 'Sign In' : 'Create Free Account'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
