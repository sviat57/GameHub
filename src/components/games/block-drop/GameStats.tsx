import { Gauge, Layers3, LineChart, Medal, TimerReset } from "lucide-react";
import { NextPiece } from "./NextPiece";
import type { GameStatus, Piece } from "./types";

type GameStatsProps = {
  score: number;
  highScore: number;
  level: number;
  lines: number;
  nextPiece: Piece;
  status: GameStatus;
  fallDelay: number;
  onPause: () => void;
  onRestart: () => void;
};

const statFormat = new Intl.NumberFormat("en-US");

function StatCard({
  label,
  value,
  icon
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.045] p-4">
      <div className="mb-3 flex items-center justify-between text-white/42">
        <p className="text-xs font-bold uppercase tracking-[0.2em]">{label}</p>
        {icon}
      </div>
      <p className="text-2xl font-black text-white">{value}</p>
    </div>
  );
}

export function GameStats({
  score,
  highScore,
  level,
  lines,
  nextPiece,
  status,
  fallDelay,
  onPause,
  onRestart
}: GameStatsProps) {
  const isPaused = status === "paused";

  return (
    <aside className="glass-panel w-full rounded-2xl p-4 sm:p-5">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-100/70">
            Run Console
          </p>
          <h2 className="mt-1 text-xl font-black text-white">Stats</h2>
        </div>
        <span className="rounded-full border border-emerald-300/25 bg-emerald-300/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-emerald-100">
          {status === "gameOver" ? "Ended" : status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={<LineChart size={18} />}
          label="Score"
          value={statFormat.format(score)}
        />
        <StatCard
          icon={<Medal size={18} />}
          label="Best"
          value={statFormat.format(highScore)}
        />
        <StatCard icon={<Gauge size={18} />} label="Level" value={level} />
        <StatCard icon={<Layers3 size={18} />} label="Lines" value={lines} />
      </div>

      <div className="mt-3 rounded-xl border border-cyan-200/10 bg-cyan-200/[0.045] p-4">
        <div className="mb-2 flex items-center justify-between text-white/42">
          <p className="text-xs font-bold uppercase tracking-[0.2em]">Fall Rate</p>
          <TimerReset size={18} />
        </div>
        <p className="text-2xl font-black text-white">
          {(fallDelay / 1000).toFixed(2)}s
        </p>
      </div>

      <div className="mt-3">
        <NextPiece piece={nextPiece} />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <button
          className="liquid-button rounded-lg px-4 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-45"
          disabled={status === "idle" || status === "gameOver"}
          onClick={onPause}
          type="button"
        >
          {isPaused ? "Resume" : "Pause"}
        </button>
        <button
          className="rounded-lg border border-white/10 bg-white/[0.055] px-4 py-3 text-sm font-bold text-white/84 transition hover:border-emerald-300/35 hover:bg-white/[0.075]"
          onClick={onRestart}
          type="button"
        >
          Restart
        </button>
      </div>

      <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-4">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-white/45">
          Controls
        </p>
        <div className="grid gap-2 text-sm text-white/66">
          <p>Arrow Left / A: move left</p>
          <p>Arrow Right / D: move right</p>
          <p>Arrow Down / S: soft drop</p>
          <p>Arrow Up / W: rotate</p>
          <p>Space: hard drop</p>
          <p>P: pause/resume</p>
          <p>R: restart</p>
        </div>
      </div>
    </aside>
  );
}
