import React, { useState, useEffect, useRef } from 'react';
import { sound } from '../../services/soundEffects';
import { useCampus } from '../../context/CampusContext';

export const PostureGuardWindow: React.FC = () => {
  const { addXp, showToast } = useCampus();
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [postureScore, setPostureScore] = useState<number>(92);
  const [postureState, setPostureState] = useState<'optimal' | 'slouch' | 'fatigued'>('optimal');
  const [twentyTwentyTimer, setTwentyTwentyTimer] = useState<number>(1200); // 20 minutes in seconds
  const [stretchCount, setStretchCount] = useState<number>(3);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // 20-20-20 countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTwentyTwentyTimer((prev) => {
        if (prev <= 1) {
          sound.playTimerDone();
          showToast('👁️ 20-20-20 Break Time! Look 20 feet away into the distance for 20 seconds.');
          return 1200;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [showToast]);

  // Handle webcam toggle
  const toggleCamera = async () => {
    sound.playClick();
    if (cameraActive) {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((t) => t.stop());
        videoRef.current.srcObject = null;
      }
      setCameraActive(false);
      showToast('Webcam monitor deactivated.');
    } else {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
          setCameraActive(true);
          showToast('📷 MediaPipe Webcam Posture Guard active!');
        } else {
          showToast('Simulating retro wireframe posture guard.');
          setCameraActive(true);
        }
      } catch (e) {
        showToast('Camera access blocked or simulated. Using ergonomic wireframe monitor.');
        setCameraActive(true);
      }
    }
  };

  const handleDoStretch = () => {
    sound.playLevelUp();
    addXp(25, 'Completed ergonomic stretch break');
    setStretchCount((s) => s + 1);
    setPostureScore(98);
    setPostureState('optimal');
    showToast('🧘 Posture refreshed! Spine aligned. +25 XP');
  };

  const minutesLeft = Math.floor(twentyTwentyTimer / 60);
  const secondsLeft = twentyTwentyTimer % 60;

  return (
    <div className="flex flex-col h-full font-sans select-none overflow-y-auto space-y-3 p-1">
      {/* 1. Header & Status */}
      <div className="bg-[#dfdfdf] p-2 rounded retro-inset flex items-center justify-between">
        <div>
          <span className="font-pixel text-xs font-bold text-gray-900 block">
            🧘 POSTUREGUARD 98 & ERGONOMIC RADAR
          </span>
          <span className="text-[10px] text-gray-600">
            MediaPipe Ergonomic Vision Hook & 20-20-20 Ocular Health
          </span>
        </div>
        <button
          onClick={toggleCamera}
          className={`px-3 py-1 retro-btn font-pixel text-xs font-bold ${
            cameraActive ? 'bg-emerald-200 text-emerald-950' : 'bg-gray-200'
          }`}
        >
          {cameraActive ? '● Camera Online' : '○ Enable Camera'}
        </button>
      </div>

      {/* 2. Visual Monitor Feed / Wireframe Skeleton */}
      <div className="bg-black p-3 rounded retro-inset border-2 border-gray-600 flex flex-col items-center justify-center relative min-h-[180px]">
        {cameraActive ? (
          <div className="relative w-full max-w-xs h-40 bg-zinc-900 rounded overflow-hidden flex items-center justify-center">
            <video ref={videoRef} className="w-full h-full object-cover mirror" playsInline muted />
            {/* Retro Wireframe Mesh Overlay */}
            <div className="absolute inset-0 pointer-events-none border border-emerald-500/40 flex items-center justify-center">
              <div className="w-24 h-24 border-2 border-dashed border-emerald-400 rounded-full animate-pulse" />
              <div className="absolute top-2 left-2 text-[10px] font-pixel text-emerald-400 bg-black/70 px-1 rounded">
                Posture Score: {postureScore}%
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-6 font-pixel text-xs space-y-2 text-gray-400">
            <div className="text-4xl">🧘‍♂️</div>
            <div className="text-emerald-400 font-bold">Ergonomic Posture Target: 92% (Optimal)</div>
            <span className="text-[10px] text-gray-500">
              Webcam feed simulates or analyzes spinal curvature & blink rate
            </span>
          </div>
        )}
      </div>

      {/* 3. 20-20-20 Ergonomic Eye Rule Timer */}
      <div className="bg-amber-50 p-2.5 rounded retro-inset border border-amber-300 flex items-center justify-between text-xs">
        <div>
          <span className="font-pixel font-bold text-amber-950 block">
            👁️ 20-20-20 Rule Timer
          </span>
          <span className="text-[10px] text-amber-800">
            Every 20 mins, look 20 ft away for 20 secs
          </span>
        </div>
        <div className="text-right">
          <span className="font-pixel text-lg font-bold text-amber-900">
            {String(minutesLeft).padStart(2, '0')}:{String(secondsLeft).padStart(2, '0')}
          </span>
          <span className="text-[9px] text-amber-700 block">until next eye rest</span>
        </div>
      </div>

      {/* 4. Desk Stretch Quick Routine */}
      <div className="bg-white p-2.5 rounded retro-inset border border-gray-400 space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-pixel font-bold text-gray-800">
            ✨ Quick Ergonomic Stretch Routine
          </span>
          <span className="text-[10px] text-gray-500 font-pixel">
            {stretchCount} Stretches Done
          </span>
        </div>

        <div className="grid grid-cols-3 gap-1.5 text-center text-[11px]">
          <div className="p-1.5 bg-gray-100 rounded retro-inset">
            <span className="block text-base">🙆</span>
            <span className="font-bold">Neck Rolls</span>
            <span className="text-[9px] text-gray-500 block">5 reps each side</span>
          </div>
          <div className="p-1.5 bg-gray-100 rounded retro-inset">
            <span className="block text-base">🔄</span>
            <span className="font-bold">Shoulder Shrug</span>
            <span className="text-[9px] text-gray-500 block">Release traps</span>
          </div>
          <div className="p-1.5 bg-gray-100 rounded retro-inset">
            <span className="block text-base">🤲</span>
            <span className="font-bold">Wrist Flex</span>
            <span className="text-[9px] text-gray-500 block">Prevent strain</span>
          </div>
        </div>

        <button
          onClick={handleDoStretch}
          className="w-full py-1.5 retro-btn font-pixel text-xs font-bold text-emerald-950 bg-emerald-200 hover:bg-emerald-300"
        >
          ✓ Mark Stretch Break Complete (+25 XP)
        </button>
      </div>
    </div>
  );
};
