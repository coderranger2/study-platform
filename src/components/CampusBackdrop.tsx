import React, { useEffect, useRef } from 'react';
import { useCampus } from '../context/CampusContext';
import { RoomId } from '../types';

export const CampusBackdrop: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { currentRoom, skyMode, soundState } = useCampus();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Rain particles
    const rainDrops = Array.from({ length: 60 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      speed: Math.random() * 8 + 12,
      length: Math.random() * 14 + 8,
    }));

    // Steam / dust motes
    const motes = Array.from({ length: 30 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -Math.random() * 0.5 - 0.2,
      radius: Math.random() * 2 + 1,
      alpha: Math.random() * 0.6 + 0.2,
    }));

    // Stargazing stars
    const stars = Array.from({ length: 80 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height * 0.6,
      radius: Math.random() * 1.5 + 0.5,
      blink: Math.random() * 0.03 + 0.01,
      alpha: Math.random(),
    }));

    let t = 0;

    const render = () => {
      t += 0.02;

      // Render custom artwork according to current room
      if (currentRoom === 'library') {
        // --- 1. campus_library_backdrop ---
        // Warm mahogany tones, stained glass, arched windows, glowing banker lamps
        const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
        bgGrad.addColorStop(0, '#1c1008');
        bgGrad.addColorStop(0.5, '#2e180d');
        bgGrad.addColorStop(1, '#150a04');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Bookshelf rows in silhouette
        ctx.fillStyle = '#110702';
        for (let b = 0; b < 6; b++) {
          const bx = (b * width) / 5;
          ctx.fillRect(bx - 30, height * 0.2, 50, height * 0.8);
          // Books on shelves
          for (let s = 0; s < 8; s++) {
            ctx.fillStyle = s % 2 === 0 ? '#3d2012' : '#261309';
            ctx.fillRect(bx - 25, height * 0.25 + s * 45, 40, 35);
            ctx.fillStyle = '#110702';
          }
        }

        // Warm Arched Stained Glass Window in center
        const winX = width * 0.5;
        const winY = height * 0.35;
        const winRad = Math.min(180, width * 0.2);

        ctx.save();
        ctx.fillStyle = '#3a2010';
        ctx.beginPath();
        ctx.arc(winX, winY, winRad, Math.PI, 0);
        ctx.rect(winX - winRad, winY, winRad * 2, height * 0.35);
        ctx.fill();

        // Amber glow from window
        const winGlow = ctx.createRadialGradient(winX, winY, 10, winX, winY, winRad * 1.4);
        winGlow.addColorStop(0, 'rgba(251, 191, 36, 0.4)');
        winGlow.addColorStop(0.7, 'rgba(217, 119, 6, 0.2)');
        winGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = winGlow;
        ctx.fill();
        ctx.restore();

        // Green Banker's desk lamps glow
        const lampX1 = width * 0.25;
        const lampX2 = width * 0.75;
        const lampY = height * 0.75;
        [lampX1, lampX2].forEach((lx) => {
          const lGlow = ctx.createRadialGradient(lx, lampY, 5, lx, lampY, 90);
          lGlow.addColorStop(0, 'rgba(52, 211, 153, 0.6)');
          lGlow.addColorStop(0.3, 'rgba(251, 191, 36, 0.3)');
          lGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = lGlow;
          ctx.beginPath();
          ctx.arc(lx, lampY, 90, 0, Math.PI * 2);
          ctx.fill();
        });

      } else if (currentRoom === 'rooftop') {
        // --- 2. campus_rooftop_backdrop ---
        // Twilight skyline, stars, shooting stars, fairy string lights, campus clock tower
        const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
        skyGrad.addColorStop(0, '#090514');
        skyGrad.addColorStop(0.45, '#2e1065');
        skyGrad.addColorStop(0.75, '#701a75');
        skyGrad.addColorStop(1, '#0f172a');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, width, height);

        // Twinkling stars
        stars.forEach((s) => {
          s.alpha += s.blink;
          const a = Math.abs(Math.sin(s.alpha));
          ctx.fillStyle = `rgba(255, 255, 255, ${a})`;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
          ctx.fill();
        });

        // Distant university gothic clock tower silhouette
        const towerX = width * 0.55;
        const towerY = height * 0.65;
        ctx.fillStyle = '#05020c';
        ctx.beginPath();
        ctx.rect(towerX - 35, towerY - 120, 70, 160);
        ctx.moveTo(towerX - 40, towerY - 120);
        ctx.lineTo(towerX, towerY - 180); // Spire
        ctx.lineTo(towerX + 40, towerY - 120);
        ctx.fill();

        // Clock face glowing amber
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(towerX, towerY - 90, 11, 0, Math.PI * 2);
        ctx.fill();

        // Fairy light garland across rooftop railing
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, height * 0.72);
        for (let x = 0; x <= width; x += 60) {
          ctx.quadraticCurveTo(x + 30, height * 0.72 + 18, x + 60, height * 0.72);
        }
        ctx.stroke();

        // Fairy light glowing bulbs
        for (let x = 30; x < width; x += 60) {
          const ly = height * 0.72 + 12 + Math.sin(t * 2 + x) * 2;
          ctx.fillStyle = x % 120 === 0 ? '#fde047' : '#ec4899';
          ctx.beginPath();
          ctx.arc(x, ly, 4, 0, Math.PI * 2);
          ctx.fill();
        }

      } else if (currentRoom === 'cafe') {
        // --- 3. campus_cafe_backdrop ---
        // Warm brick, neon "Bean & Byte" sign, rising espresso steam, hanging lamps
        const cafeGrad = ctx.createLinearGradient(0, 0, 0, height);
        cafeGrad.addColorStop(0, '#1c120c');
        cafeGrad.addColorStop(0.6, '#2d1810');
        cafeGrad.addColorStop(1, '#0e0704');
        ctx.fillStyle = cafeGrad;
        ctx.fillRect(0, 0, width, height);

        // Brick wall lines
        ctx.strokeStyle = 'rgba(78, 38, 20, 0.4)';
        ctx.lineWidth = 1;
        for (let y = 0; y < height; y += 22) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }

        // Warm pendant cone lights
        [width * 0.2, width * 0.5, width * 0.8].forEach((lx) => {
          ctx.strokeStyle = '#78350f';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(lx, 0);
          ctx.lineTo(lx, height * 0.25);
          ctx.stroke();

          const coneGlow = ctx.createRadialGradient(lx, height * 0.25, 5, lx, height * 0.25, 140);
          coneGlow.addColorStop(0, 'rgba(251, 191, 36, 0.55)');
          coneGlow.addColorStop(0.6, 'rgba(245, 158, 11, 0.15)');
          coneGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = coneGlow;
          ctx.beginPath();
          ctx.arc(lx, height * 0.25, 140, 0, Math.PI * 2);
          ctx.fill();
        });

        // Rising coffee steam particles
        motes.forEach((m) => {
          m.y += m.vy;
          m.x += Math.sin(t * 3 + m.y * 0.05) * 0.8;
          if (m.y < height * 0.3) m.y = height * 0.85;

          ctx.fillStyle = `rgba(255, 237, 213, ${m.alpha * 0.4})`;
          ctx.beginPath();
          ctx.arc(m.x, m.y, m.radius * 2, 0, Math.PI * 2);
          ctx.fill();
        });

      } else {
        // --- 4. campus_arcade_backdrop ---
        // Cyberpunk retro 90s arcade, neon cyan/magenta grid, CRT arcade cabinets
        ctx.fillStyle = '#0a0518';
        ctx.fillRect(0, 0, width, height);

        // Neon Horizon Sun
        const sunY = height * 0.52;
        const sunGrad = ctx.createLinearGradient(0, sunY - 60, 0, sunY);
        sunGrad.addColorStop(0, '#f43f5e');
        sunGrad.addColorStop(1, '#fbbf24');
        ctx.fillStyle = sunGrad;
        ctx.beginPath();
        ctx.arc(width * 0.5, sunY, 60, Math.PI, 0);
        ctx.fill();

        // 3D Perspective Neon Grid Floor
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 1.2;
        const horizon = sunY;

        for (let x = -width * 0.5; x <= width * 1.5; x += 45) {
          ctx.beginPath();
          ctx.moveTo(width * 0.5, horizon);
          ctx.lineTo(x, height);
          ctx.stroke();
        }

        for (let y = 0; y < 12; y++) {
          const py = horizon + Math.pow((y + (t % 1)) / 12, 2) * (height - horizon);
          ctx.beginPath();
          ctx.moveTo(0, py);
          ctx.lineTo(width, py);
          ctx.stroke();
        }

        // Arcade Cabinet Silhouettes on sides
        ctx.fillStyle = '#180d2b';
        ctx.fillRect(0, height * 0.4, 110, height * 0.6);
        ctx.fillRect(width - 110, height * 0.4, 110, height * 0.6);

        // Glowing Cabinet CRT screens
        ctx.fillStyle = '#22d3ee';
        ctx.fillRect(20, height * 0.45, 65, 45);
        ctx.fillStyle = '#f43f5e';
        ctx.fillRect(width - 85, height * 0.45, 65, 45);
      }

      // Rain particles if sound mixer rain is active
      if (soundState.rainVolume > 0.05 && !soundState.isMuted) {
        ctx.strokeStyle = `rgba(186, 230, 253, ${Math.min(0.4, soundState.rainVolume)})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        rainDrops.forEach((d) => {
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(d.x - 1, d.y + d.length);
          d.y += d.speed;
          if (d.y > height) {
            d.y = -10;
            d.x = Math.random() * width;
          }
        });
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [currentRoom, skyMode, soundState.rainVolume, soundState.isMuted]);

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-0 overflow-hidden ${className}`}
      data-room-backdrop={`campus_${currentRoom}_backdrop`}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
      {/* 90s Dither Texture Overlay */}
      <div className="absolute inset-0 retro-dither pointer-events-none opacity-30 mix-blend-overlay" />
    </div>
  );
};

export default CampusBackdrop;
