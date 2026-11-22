import React, { useEffect, useRef } from 'react';
import { useCampus } from '../../context/CampusContext';
import { SkyMode } from '../../types';

interface DynamicCampusBackdropProps {
  className?: string;
}

export const DynamicCampusBackdrop: React.FC<DynamicCampusBackdropProps> = ({ className = '' }) => {
  const { skyMode, soundState, activeWallpaper } = useCampus();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Compute effective color palette from skyMode
  const getSkyColors = (mode: SkyMode) => {
    let effective = mode;
    if (mode === 'realtime') {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 8) effective = 'dawn';
      else if (hour >= 8 && hour < 17) effective = 'golden';
      else if (hour >= 17 && hour < 20) effective = 'twilight';
      else effective = 'midnight';
    }

    switch (effective) {
      case 'dawn':
        return {
          top: '#2d1b4e',
          mid: '#7b337d',
          horizon: '#f97316',
          starsOpacity: 0.3,
          windowGlow: '#fde047',
          silhouettes: '#1a102f',
        };
      case 'golden':
        return {
          top: '#1e3a8a',
          mid: '#3b82f6',
          horizon: '#fbbf24',
          starsOpacity: 0.05,
          windowGlow: '#fef08a',
          silhouettes: '#1e293b',
        };
      case 'midnight':
        return {
          top: '#050814',
          mid: '#0f172a',
          horizon: '#1e1b4b',
          starsOpacity: 0.95,
          windowGlow: '#fbbf24',
          silhouettes: '#030712',
        };
      case 'twilight':
      default:
        return {
          top: '#181033',
          mid: '#431d60',
          horizon: '#c026d3',
          starsOpacity: 0.75,
          windowGlow: '#facc15',
          silhouettes: '#090514',
        };
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Stars data
    const starCount = 120;
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height * 0.65,
      radius: Math.random() * 1.5 + 0.5,
      blinkSpeed: Math.random() * 0.02 + 0.005,
      alpha: Math.random(),
    }));

    // Fireflies / quad motes
    const fireflyCount = 28;
    const fireflies = Array.from({ length: fireflyCount }, () => ({
      x: Math.random() * width,
      y: height * 0.6 + Math.random() * (height * 0.35),
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 1,
      alpha: Math.random(),
      fadeSpeed: Math.random() * 0.03 + 0.01,
      fadingIn: true,
    }));

    // Shooting star
    let shootingStar: { x: number; y: number; length: number; speed: number; angle: number; active: boolean } | null = null;
    let shootingStarTimer = 0;

    // Rain particles
    const rainDrops = Array.from({ length: 90 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      length: Math.random() * 15 + 10,
      speed: Math.random() * 8 + 12,
    }));

    // Render Loop
    let time = 0;
    const render = () => {
      time += 0.02;
      const palette = getSkyColors(skyMode);

      // 1. Sky Gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, palette.top);
      skyGrad.addColorStop(0.45, palette.mid);
      skyGrad.addColorStop(0.72, palette.horizon);
      skyGrad.addColorStop(1, '#0b0f19');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Stars
      if (palette.starsOpacity > 0.1) {
        stars.forEach((star) => {
          star.alpha += star.blinkSpeed;
          const currentAlpha = Math.abs(Math.sin(star.alpha)) * palette.starsOpacity;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha})`;
          ctx.fill();
        });
      }

      // 3. Shooting Star
      shootingStarTimer++;
      if (shootingStarTimer > 320 && Math.random() < 0.03 && !shootingStar) {
        shootingStarTimer = 0;
        shootingStar = {
          x: Math.random() * width * 0.8 + width * 0.1,
          y: Math.random() * height * 0.3,
          length: Math.random() * 80 + 60,
          speed: Math.random() * 12 + 15,
          angle: (Math.PI / 4) + (Math.random() - 0.5) * 0.2,
          active: true,
        };
      }
      if (shootingStar && shootingStar.active) {
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 240, 0.85)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(shootingStar.x, shootingStar.y);
        const endX = shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length;
        const endY = shootingStar.y - Math.sin(shootingStar.angle) * shootingStar.length;
        ctx.lineTo(endX, endY);
        ctx.stroke();
        ctx.restore();

        shootingStar.x += Math.cos(shootingStar.angle) * shootingStar.speed;
        shootingStar.y += Math.sin(shootingStar.angle) * shootingStar.speed;
        if (shootingStar.y > height * 0.7 || shootingStar.x > width) {
          shootingStar = null;
        }
      }

      // 4. Distant Campus Silhouette (Hills, Trees, Towers)
      const horizonY = height * 0.68;

      // Distant mountain/treeline
      ctx.fillStyle = palette.silhouettes + '99';
      ctx.beginPath();
      ctx.moveTo(0, horizonY);
      for (let x = 0; x <= width; x += 40) {
        const y = horizonY - 18 - Math.sin(x * 0.005 + 1) * 22;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fill();

      // Campus Architectural Gothic Hall & Clock Tower Silhouette
      ctx.fillStyle = palette.silhouettes;
      ctx.beginPath();
      ctx.moveTo(0, horizonY + 20);

      // Quad Building 1 (Library)
      const libX = width * 0.18;
      const libW = Math.max(160, width * 0.18);
      ctx.lineTo(libX, horizonY);
      ctx.lineTo(libX, horizonY - 90);
      ctx.lineTo(libX + libW * 0.5, horizonY - 125); // peaked roof
      ctx.lineTo(libX + libW, horizonY - 90);
      ctx.lineTo(libX + libW, horizonY);

      // Campus Clock Tower
      const towerX = width * 0.48;
      const towerW = Math.max(70, width * 0.07);
      ctx.lineTo(towerX, horizonY);
      ctx.lineTo(towerX, horizonY - 180);
      ctx.lineTo(towerX + towerW * 0.5, horizonY - 240); // spire
      ctx.lineTo(towerX + towerW, horizonY - 180);
      ctx.lineTo(towerX + towerW, horizonY);

      // Quad Science Hall
      const sciX = width * 0.72;
      const sciW = Math.max(180, width * 0.2);
      ctx.lineTo(sciX, horizonY);
      ctx.lineTo(sciX, horizonY - 100);
      ctx.lineTo(sciX + sciW * 0.3, horizonY - 130);
      ctx.lineTo(sciX + sciW * 0.7, horizonY - 130);
      ctx.lineTo(sciX + sciW, horizonY - 100);
      ctx.lineTo(sciX + sciW, horizonY);

      ctx.lineTo(width, horizonY + 20);
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fill();

      // Glowing Amber Windows in Campus Buildings
      const drawGlowWindow = (wx: number, wy: number, ww: number, wh: number, arched = true) => {
        ctx.save();
        ctx.fillStyle = palette.windowGlow;
        ctx.shadowColor = palette.windowGlow;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        if (arched) {
          ctx.arc(wx + ww / 2, wy + ww / 2, ww / 2, Math.PI, 0);
          ctx.rect(wx, wy + ww / 2, ww, wh - ww / 2);
        } else {
          ctx.rect(wx, wy, ww, wh);
        }
        ctx.fill();
        ctx.restore();
      };

      // Library arched windows
      drawGlowWindow(libX + 25, horizonY - 70, 16, 32, true);
      drawGlowWindow(libX + 55, horizonY - 70, 16, 32, true);
      drawGlowWindow(libX + 85, horizonY - 70, 16, 32, true);
      if (libW > 140) {
        drawGlowWindow(libX + 115, horizonY - 70, 16, 32, true);
      }

      // Clock Tower Rose Window & Clock Face
      const clockCenterX = towerX + towerW / 2;
      const clockCenterY = horizonY - 145;
      ctx.save();
      ctx.fillStyle = '#fffbeb';
      ctx.shadowColor = '#fef08a';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(clockCenterX, clockCenterY, 14, 0, Math.PI * 2);
      ctx.fill();

      // Clock hands showing current time
      const date = new Date();
      const hrs = date.getHours() % 12;
      const mins = date.getMinutes();
      const hrAngle = (hrs * 30 + mins * 0.5) * (Math.PI / 180) - Math.PI / 2;
      const minAngle = mins * 6 * (Math.PI / 180) - Math.PI / 2;

      ctx.strokeStyle = '#1e1b4b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(clockCenterX, clockCenterY);
      ctx.lineTo(clockCenterX + Math.cos(hrAngle) * 7, clockCenterY + Math.sin(hrAngle) * 7);
      ctx.stroke();

      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(clockCenterX, clockCenterY);
      ctx.lineTo(clockCenterX + Math.cos(minAngle) * 10, clockCenterY + Math.sin(minAngle) * 10);
      ctx.stroke();
      ctx.restore();

      // Science hall study group windows
      drawGlowWindow(sciX + 30, horizonY - 80, 18, 28, false);
      drawGlowWindow(sciX + 65, horizonY - 80, 18, 28, false);
      drawGlowWindow(sciX + 100, horizonY - 80, 18, 28, false);

      // 5. Fireflies on Quad Lawn
      fireflies.forEach((f) => {
        f.x += f.vx;
        f.y += f.vy;
        if (f.x < 0) f.x = width;
        if (f.x > width) f.x = 0;
        if (f.y < height * 0.55) f.y = height * 0.9;
        if (f.y > height) f.y = height * 0.6;

        if (f.fadingIn) {
          f.alpha += f.fadeSpeed;
          if (f.alpha >= 1) f.fadingIn = false;
        } else {
          f.alpha -= f.fadeSpeed;
          if (f.alpha <= 0.1) f.fadingIn = true;
        }

        ctx.beginPath();
        ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(250, 204, 21, ${f.alpha * 0.8})`;
        ctx.shadowColor = '#fde047';
        ctx.shadowBlur = 6;
        ctx.fill();
      });

      // 6. Rain effect if sound mixer rain is active
      if (soundState.rainVolume > 0.05 && !soundState.isMuted) {
        ctx.strokeStyle = `rgba(186, 230, 253, ${Math.min(0.4, soundState.rainVolume)})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        rainDrops.forEach((drop) => {
          ctx.moveTo(drop.x, drop.y);
          ctx.lineTo(drop.x - 2, drop.y + drop.length);
          drop.y += drop.speed;
          drop.x -= 1;
          if (drop.y > height) {
            drop.y = -20;
            drop.x = Math.random() * width;
          }
        });
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [skyMode, soundState.rainVolume, soundState.isMuted]);

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-0 overflow-hidden ${className}`}
      data-wallpaper={activeWallpaper}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
      {/* 90s Pixel Dithering Sub-Layer */}
      <div className="absolute inset-0 retro-dither pointer-events-none opacity-40 mix-blend-overlay" />
    </div>
  );
};
