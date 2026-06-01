import { AnimatePresence, motion } from "framer-motion";
import { Pause, Play, RotateCcw, Trophy } from "lucide-react";
import type { GameStatus } from "./types";

type GameOverlayProps = {
  status: GameStatus;
  score: number;
  highScore: number;
  onStart: () => void;
  onRestart: () => void;
  onResume: () => void;
};

const statFormat = new Intl.NumberFormat("en-US");

export function GameOverlay({
  status,
  score,
  highScore,
  onStart,
  onRestart,
  onResume
}: GameOverlayProps) {
  const visible = status === "idle" || status === "paused" || status === "gameOver";

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/72 p-5 backdrop-blur-md"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
        >
          <motion.div
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="glass-panel max-w-sm rounded-2xl p-6 text-center"
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.22 }}
          >
            {status === "idle" ? (
              <>
                <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-xl border border-emerald-300/30 bg-emerald-300/10 text-emerald-100 shadow-[0_0_32px_rgba(94,210,156,0.24)]">
                  <Play size={26} />
                </div>
                <h2 className="text-3xl font-black text-white">Block Drop</h2>
                <p className="mt-3 text-sm leading-6 text-white/64">
                  A Python-born arcade project rebuilt as a polished web game.
                </p>
                <button
                  className="liquid-button mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-black text-white"
                  onClick={onStart}
                  type="button"
                >
                  <Play size={18} />
                  Start Game
                </button>
              </>
            ) : null}

            {status === "paused" ? (
              <>
                <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-xl border border-cyan-200/25 bg-cyan-200/10 text-cyan-100 shadow-[0_0_32px_rgba(103,232,249,0.18)]">
                  <Pause size={26} />
                </div>
                <h2 className="text-3xl font-black text-white">Paused</h2>
                <p className="mt-3 text-sm leading-6 text-white/64">
                  The board is frozen. Resume when your next move is ready.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button
                    className="liquid-button inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-black text-white"
                    onClick={onResume}
                    type="button"
                  >
                    <Play size={18} />
                    Resume
                  </button>
                  <button
                    className="rounded-lg border border-white/10 bg-white/[0.055] px-5 py-3 text-sm font-black text-white/86 transition hover:border-emerald-300/35 hover:bg-white/[0.075]"
                    onClick={onRestart}
                    type="button"
                  >
                    Restart
                  </button>
                </div>
              </>
            ) : null}

            {status === "gameOver" ? (
              <>
                <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-xl border border-rose-300/25 bg-rose-300/10 text-rose-100 shadow-[0_0_32px_rgba(251,113,133,0.2)]">
                  <Trophy size={26} />
                </div>
                <h2 className="text-3xl font-black text-white">Game Over</h2>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-white/10 bg-white/[0.045] p-3">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/42">
                      Score
                    </p>
                    <p className="mt-1 text-xl font-black text-white">
                      {statFormat.format(score)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-emerald-300/20 bg-emerald-300/[0.06] p-3">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/42">
                      Best
                    </p>
                    <p className="mt-1 text-xl font-black text-white">
                      {statFormat.format(highScore)}
                    </p>
                  </div>
                </div>
                <button
                  className="liquid-button mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-black text-white"
                  onClick={onRestart}
                  type="button"
                >
                  <RotateCcw size={18} />
                  Restart Run
                </button>
              </>
            ) : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
