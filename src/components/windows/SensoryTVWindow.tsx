import React, { useState, useRef, useEffect } from 'react';
import { sound } from '../../services/soundEffects';

interface TVChannel {
  id: string;
  name: string;
  genre: string;
  videoUrl?: string;
  type: 'canvas' | 'video';
  theme: 'rain' | 'minecraft' | 'synthwave' | 'fireplace';
}

const CHANNELS: TVChannel[] = [
  {
    id: 'ch-lofi',
    name: 'CH 03: Lo-Fi Study Window & Rain',
    genre: 'Ambient Chill',
    type: 'canvas',
    theme: 'rain',
  },
  {
    id: 'ch-minecraft',
    name: 'CH 05: Minecraft Cozy Campfire',
    genre: 'Sensory Comfort',
    type: 'canvas',
    theme: 'minecraft',
  },
  {
    id: 'ch-synth',
    name: 'CH 08: Mario Kart & Cyber Highway',
    genre: 'Retro Focus Flow',
    type: 'canvas',
    theme: 'synthwave',
  },
  {
    id: 'ch-fireplace',
    name: 'CH 11: Cozy Dorm Hearth',
    genre: 'Warm Glow',
    type: 'canvas',
    theme: 'fireplace',
  },
];

export const SensoryTVWindow: React.FC = () => {
  const [channelIdx, setChannelIdx] = useState(0);
  const [isPowerOn, setIsPowerOn] = useState(true);
  const [scanlinesOn, setScanlinesOn] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const currentChannel = CHANNELS[channelIdx];

  const handleNextChannel = () => {
    sound.playClick();
    setChannelIdx((prev) => (prev + 1) % CHANNELS.length);
  };

  const handlePrevChannel = () => {
    sound.playClick();
    setChannelIdx((prev) => (prev - 1 + CHANNELS.length) % CHANNELS.length);
  };

  // Canvas visual loop for selected sensory channel
  useEffect(() => {
    if (!isPowerOn) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const render = () => {
      t += 0.03;
      const w = canvas.width;
      const h = canvas.height;

      if (currentChannel.theme === 'rain') {
        // Rainy window with city bokeh
        ctx.fillStyle = '#0a0d1a';
        ctx.fillRect(0, 0, w, h);

        // Warm background bokeh lights
        for (let i = 0; i < 16; i++) {
          const bx = ((i * 37) % w);
          const by = ((i * 29) % h);
          const rad = 15 + Math.sin(t + i) * 6;
          ctx.beginPath();
          ctx.arc(bx, by, rad, 0, Math.PI * 2);
          ctx.fillStyle = i % 2 === 0 ? 'rgba(251, 191, 36, 0.25)' : 'rgba(236, 72, 153, 0.2)';
          ctx.fill();
        }

        // Falling raindrops
        ctx.strokeStyle = 'rgba(200, 230, 255, 0.6)';
        ctx.lineWidth = 1.5;
        for (let j = 0; j < 35; j++) {
          const rx = (j * 23 + t * 40) % w;
          const ry = (j * 47 + t * 240) % h;
          ctx.beginPath();
          ctx.moveTo(rx, ry);
          ctx.lineTo(rx - 2, ry + 16);
          ctx.stroke();
        }
      } else if (currentChannel.theme === 'minecraft') {
        // Blocky campfire in night forest
        ctx.fillStyle = '#06101e';
        ctx.fillRect(0, 0, w, h);

        // Ground blocks
        ctx.fillStyle = '#1b261e';
        ctx.fillRect(0, h * 0.75, w, h * 0.25);

        // Blocky logs
        ctx.fillStyle = '#5c3a21';
        ctx.fillRect(w * 0.42, h * 0.72, 45, 15);
        ctx.fillStyle = '#3e2715';
        ctx.fillRect(w * 0.46, h * 0.70, 35, 12);

        // Fire pixel particles
        for (let f = 0; f < 25; f++) {
          const fx = w * 0.48 + Math.sin(t * 3 + f) * 16;
          const fy = h * 0.68 - ((t * 80 + f * 12) % 45);
          ctx.fillStyle = f % 2 === 0 ? '#f59e0b' : '#ef4444';
          ctx.fillRect(fx, fy, 6, 6);
        }
      } else if (currentChannel.theme === 'synthwave') {
        // Perspective Grid & Neon Sun (Mario Kart / Outrun style)
        ctx.fillStyle = '#120524';
        ctx.fillRect(0, 0, w, h);

        // Neon Horizon Sun
        const sunY = h * 0.52;
        const grad = ctx.createLinearGradient(0, sunY - 40, 0, sunY);
        grad.addColorStop(0, '#f43f5e');
        grad.addColorStop(1, '#fbbf24');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(w * 0.5, sunY, 38, Math.PI, 0);
        ctx.fill();

        // 3D Perspective Grid
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 1;
        const horizon = sunY;

        // Radiating perspective lines
        for (let x = -w * 0.5; x <= w * 1.5; x += 35) {
          ctx.beginPath();
          ctx.moveTo(w * 0.5, horizon);
          ctx.lineTo(x, h);
          ctx.stroke();
        }

        // Horizontal moving grid lines
        for (let y = 0; y < 10; y++) {
          const py = horizon + Math.pow((y + (t % 1)) / 10, 2) * (h - horizon);
          ctx.beginPath();
          ctx.moveTo(0, py);
          ctx.lineTo(w, py);
          ctx.stroke();
        }
      } else {
        // Cozy fireplace glow
        ctx.fillStyle = '#1c0f0d';
        ctx.fillRect(0, 0, w, h);

        const flameGrad = ctx.createRadialGradient(w * 0.5, h * 0.6, 10, w * 0.5, h * 0.6, 90);
        flameGrad.addColorStop(0, 'rgba(251, 146, 60, 0.9)');
        flameGrad.addColorStop(0.5, 'rgba(239, 68, 68, 0.4)');
        flameGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = flameGrad;
        ctx.fillRect(0, 0, w, h);
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [channelIdx, isPowerOn, currentChannel.theme]);

  return (
    <div className="flex flex-col h-full font-sans select-none overflow-hidden space-y-2 p-1">
      {/* Retro CRT TV Bezel */}
      <div className="bg-[#3e2723] p-4 rounded-xl retro-outset border-4 border-[#2b1810] shadow-2xl flex-1 flex flex-col justify-between">
        {/* Screen Bezel */}
        <div className="relative bg-black rounded-lg p-2 retro-inset border-4 border-gray-700 flex-1 overflow-hidden flex items-center justify-center">
          {isPowerOn ? (
            <>
              <canvas
                ref={canvasRef}
                width={420}
                height={230}
                className="w-full h-full object-cover rounded"
              />
              {/* Scanlines Overlay */}
              {scanlinesOn && (
                <div className="absolute inset-0 scanlines pointer-events-none opacity-60" />
              )}
              {/* Channel Watermark */}
              <div className="absolute top-3 left-4 bg-black/60 px-2 py-0.5 rounded text-emerald-400 font-pixel text-xs tracking-wider border border-emerald-500/40">
                {currentChannel.name}
              </div>
            </>
          ) : (
            <div className="text-gray-600 font-pixel text-xs">TV POWER OFF</div>
          )}
        </div>

        {/* Vintage TV Bottom Knob Controls */}
        <div className="flex items-center justify-between pt-3 px-2 text-white font-pixel text-xs">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                sound.playClick();
                setIsPowerOn((p) => !p);
              }}
              className={`px-3 py-1 retro-btn text-xs font-bold ${
                isPowerOn ? 'bg-red-600 text-white' : 'bg-gray-600 text-gray-300'
              }`}
            >
              ⏻ Power
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setScanlinesOn((s) => !s);
              }}
              className={`px-2 py-1 retro-btn text-[11px] text-black ${
                scanlinesOn ? 'bg-amber-300' : 'bg-gray-300'
              }`}
            >
              Scanlines: {scanlinesOn ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="text-gray-300 text-[10px]">Tuner Dial:</span>
            <button
              onClick={handlePrevChannel}
              className="w-7 h-7 retro-btn text-black font-bold flex items-center justify-center"
            >
              ◀
            </button>
            <button
              onClick={handleNextChannel}
              className="w-7 h-7 retro-btn text-black font-bold flex items-center justify-center"
            >
              ▶
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
