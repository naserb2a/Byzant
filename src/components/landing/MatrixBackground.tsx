"use client";
import { useEffect, useRef } from "react";

/* ── Character pool ──────────────────────────────────────────────────── */
const SINGLE_POOL = (
  "01234567890123456789" +
  "$%><{}[].,+-=*/|" +
  "0123456789" +
  ".,><[]"
).split("");

const WORD_POOL = ["BUY", "SELL", "LONG", "MCP", "API", "RISK"];
const WORD_PROB = 0.028;

/* ── Layout constants (13×14 ≈ 23% denser than prev 15×16) ──────────── */
const FONT_SIZE = 11;
const COL_SPACING = 13;
const ROW_SPACING = 14;

/* ── Opacity ─────────────────────────────────────────────────────────── */
const BASE_OPACITY_MIN = 0.035;
const BASE_OPACITY_MAX = 0.085;
const BRIGHT_OPACITY = 0.38;

/* ── Mouse reaction ──────────────────────────────────────────────────── */
const REACT_RADIUS = 120;
const REPEL_MAX = 4;
const REPEL_DECAY = 0.87;
const BRIGHT_DECAY = 0.972;

/* ── Color: #99E1D9 → #B2EBE5 on hover ───────────────────────────────── */
const BASE_R = 77;  const BASE_G = 159; const BASE_B = 255;
const BRIGHT_R = 110; const BRIGHT_G = 184;

interface Particle {
  baseX: number;
  y: number;
  char: string;
  drift: number;
  baseOp: number;
  phase: number;
  phaseSpd: number;
  repelX: number;
  repelY: number;
  bright: number;
}

interface State {
  particles: Particle[];
  mouseX: number;
  mouseY: number;
  animId: number;
  W: number;
  H: number;
  lastMoveTime: number;
  mouseInfluence: number;
}

export default function MatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<State>({
    particles: [], mouseX: -9999, mouseY: -9999, animId: 0, W: 0, H: 0,
    lastMoveTime: 0, mouseInfluence: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const state = stateRef.current;
    const cv = canvas as HTMLCanvasElement;
    const cx = ctx as CanvasRenderingContext2D;

    function build(w: number, h: number): Particle[] {
      const cols = Math.floor(w / COL_SPACING) + 2;
      const rows = Math.floor(h / ROW_SPACING) + 3;
      const out: Particle[] = [];
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const isWord = Math.random() < WORD_PROB;
          const char = isWord
            ? WORD_POOL[Math.floor(Math.random() * WORD_POOL.length)]
            : SINGLE_POOL[Math.floor(Math.random() * SINGLE_POOL.length)];
          out.push({
            baseX: c * COL_SPACING + (Math.random() - 0.5) * 5,
            y: r * ROW_SPACING + Math.random() * ROW_SPACING,
            char,
            drift: 0.1 + Math.random() * 0.3,
            baseOp: BASE_OPACITY_MIN + Math.random() * (BASE_OPACITY_MAX - BASE_OPACITY_MIN),
            phase: Math.random() * Math.PI * 2,
            phaseSpd: 0.003 + Math.random() * 0.009,
            repelX: 0, repelY: 0, bright: 0,
          });
        }
      }
      return out;
    }

    function resize() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      state.W = w; state.H = h;
      cv.width = w; cv.height = h;
      state.particles = build(w, h);
    }

    function draw() {
      const { W, H, particles, mouseX, mouseY } = state;

      // Fade influence in (fast, ~200ms) when mouse recently moved, out (slow, ~1500ms) when idle
      const idleMs = Date.now() - state.lastMoveTime;
      if (idleMs < 300) {
        state.mouseInfluence = Math.min(1, state.mouseInfluence + 0.083);
      } else {
        state.mouseInfluence = Math.max(0, state.mouseInfluence - 0.011);
      }
      const mi = state.mouseInfluence;

      cx.clearRect(0, 0, W, H);
      cx.font = `${FONT_SIZE}px 'Geist Mono', monospace`;
      cx.textBaseline = "top";

      for (const p of particles) {
        p.y += p.drift;
        if (p.y > H + 20) {
          p.y = -ROW_SPACING + Math.random() * 8;
          if (Math.random() < 0.4) {
            const isWord = Math.random() < WORD_PROB;
            p.char = isWord
              ? WORD_POOL[Math.floor(Math.random() * WORD_POOL.length)]
              : SINGLE_POOL[Math.floor(Math.random() * SINGLE_POOL.length)];
          }
        }

        p.phase += p.phaseSpd;
        const osc = p.baseOp * (0.55 + 0.45 * Math.sin(p.phase));

        const px = p.baseX + p.repelX;
        const py = p.y + p.repelY;
        const dx = px - mouseX;
        const dy = py - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < REACT_RADIUS && dist > 0 && mi > 0) {
          const t = 1 - dist / REACT_RADIUS;
          p.bright = Math.min(1, p.bright + t * 0.12 * mi);
          const force = REPEL_MAX * t * t * 0.08 * mi;
          p.repelX += (dx / dist) * force;
          p.repelY += (dy / dist) * force;
        } else {
          p.bright *= BRIGHT_DECAY;
        }

        p.repelX *= REPEL_DECAY;
        p.repelY *= REPEL_DECAY;
        const mag = Math.sqrt(p.repelX * p.repelX + p.repelY * p.repelY);
        if (mag > REPEL_MAX) {
          p.repelX = (p.repelX / mag) * REPEL_MAX;
          p.repelY = (p.repelY / mag) * REPEL_MAX;
        }

        const finalOp = osc + p.bright * (BRIGHT_OPACITY - osc);
        if (finalOp < 0.005) continue;

        const r = Math.round(BASE_R + p.bright * (BRIGHT_R - BASE_R));
        const g = Math.round(BASE_G + p.bright * (BRIGHT_G - BASE_G));
        cx.fillStyle = `rgba(${r},${g},${BASE_B},${finalOp})`;
        cx.fillText(p.char, p.baseX + p.repelX, p.y + p.repelY);
      }

      state.animId = requestAnimationFrame(draw);
    }

    // With position: fixed, mouse coords = clientX/Y directly
    function onMouseMove(e: MouseEvent) {
      state.mouseX = e.clientX;
      state.mouseY = e.clientY;
      state.lastMoveTime = Date.now();
    }
    function onMouseLeave() {
      state.mouseX = -9999;
      state.mouseY = -9999;
    }

    resize();
    draw();

    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseleave", onMouseLeave, { passive: true });

    return () => {
      cancelAnimationFrame(state.animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="matrix-bg"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
