"use client";
import { useEffect, useRef } from "react";

const CHARS = [
  "0","1","$","%",">","<","{","}","[","]",".",",",
  "BUY","SELL","LONG","SHORT","MCP","API",
  "0","1","$",">","<",".",",","0","1","$",
];

interface Particle {
  x: number;
  y: number;
  char: string;
  speed: number;
  opacity: number;
  targetOpacity: number;
  angle: number;
  size: number;
  fadeTimer: number;
  fadeDuration: number;
}

export default function CharacterBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let particles: Particle[] = [];

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function spawnParticle(): Particle {
      if (!canvas) return {} as Particle;
      const isWord = Math.random() < 0.08;
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        char: CHARS[Math.floor(Math.random() * CHARS.length)],
        speed: 0.15 + Math.random() * 0.25,
        opacity: 0,
        targetOpacity: isWord ? 0.055 : 0.035 + Math.random() * 0.045,
        angle: (Math.random() - 0.5) * 0.3,
        size: isWord ? 9 : 10 + Math.random() * 4,
        fadeTimer: 0,
        fadeDuration: 60 + Math.random() * 120,
      };
    }

    function init() {
      if (!canvas) return;
      particles = [];
      const count = Math.floor((canvas.width * canvas.height) / 18000);
      for (let i = 0; i < count; i++) {
        const p = spawnParticle();
        p.y = Math.random() * canvas.height;
        p.opacity = Math.random() * p.targetOpacity;
        particles.push(p);
      }
    }

    function draw() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(153,225,217,1)";

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Fade in/out
        p.fadeTimer++;
        if (p.fadeTimer < p.fadeDuration * 0.3) {
          p.opacity = Math.min(p.targetOpacity, p.opacity + p.targetOpacity / (p.fadeDuration * 0.3));
        } else if (p.fadeTimer > p.fadeDuration * 0.7) {
          p.opacity = Math.max(0, p.opacity - p.targetOpacity / (p.fadeDuration * 0.3));
        }

        // Drift
        p.y += p.speed;
        p.x += Math.sin(p.fadeTimer * 0.01) * 0.15;

        // Respawn
        if (p.fadeTimer >= p.fadeDuration || p.y > canvas.height + 30) {
          particles[i] = spawnParticle();
          particles[i].y = p.y > canvas.height + 30 ? -20 : Math.random() * canvas.height;
        }

        ctx.globalAlpha = p.opacity;
        ctx.font = `${p.size}px 'Geist Mono', monospace`;
        ctx.fillText(p.char, p.x, p.y);
      }

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    }

    resize();
    init();
    draw();

    const handleResize = () => { resize(); init(); };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
