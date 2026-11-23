import React from 'react';
import { CampusProvider, useCampus } from './context/CampusContext';
import { LandingPage } from './components/landing/LandingPage';
import { DiscordWorkspace } from './components/workspace/DiscordWorkspace';
import { AuthModal } from './components/auth/AuthModal';

const CampusApp: React.FC = () => {
  const { user } = useCampus();

  return (
    <div className="min-h-screen bg-twilight-950 text-slate-100 font-sans selection:bg-amberGold-400/30 selection:text-white">
      {user && user.isAuthenticated ? <DiscordWorkspace /> : <LandingPage />}
      <AuthModal />
    </div>
  );
};

export function App() {
  return (
    <CampusProvider>
      <CampusApp />
    </CampusProvider>
  );
}

export default App;
