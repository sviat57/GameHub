import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Play, Sparkles } from 'lucide-react'
import type { Difficulty, GameStatus } from './types'

type SudokuOverlayProps = {
  difficulty: Difficulty
  formattedTime: string
  hintsUsed: number
  mistakes: number
  status: GameStatus
  onNewGame: () => void
  onResume: () => void
}

export function SudokuOverlay({
  difficulty,
  formattedTime,
  hintsUsed,
  mistakes,
  status,
  onNewGame,
  onResume,
}: SudokuOverlayProps) {
  const isVisible = status === 'paused' || status === 'completed'

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.div
          className="fixed inset-0 z-[80] grid place-items-center bg-arcade-black/78 px-5 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
        >
          <motion.div
            className="w-full max-w-md rounded-lg border border-arcade-mint/30 bg-white/[0.06] p-6 text-center shadow-[0_0_80px_rgba(94,210,156,0.18)] backdrop-blur-2xl"
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
          >
            {status === 'paused' ? (
              <>
                <p className="font-jakarta text-[10px] font-extrabold uppercase tracking-[0.2em] text-arcade-mint">
                  Neon Sudoku
                </p>
                <h2 className="mt-3 text-4xl font-extrabold text-white">Paused</h2>
                <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-white/64">
                  Timer frozen. Board protected.
                </p>
                <button
                  type="button"
                  onClick={onResume}
                  className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-arcade-mint px-6 text-xs font-extrabold uppercase text-arcade-black shadow-[0_0_30px_rgba(94,210,156,0.28)] transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <Play size={16} strokeWidth={2.6} />
                  Resume
                </button>
              </>
            ) : (
              <>
                <p className="font-jakarta text-[10px] font-extrabold uppercase tracking-[0.2em] text-arcade-mint">
                  Puzzle Solved
                </p>
                <h2 className="mt-3 text-4xl font-extrabold text-white">Puzzle Solved</h2>
                <div className="mt-5 grid grid-cols-2 gap-2 text-left">
                  {[
                    ['Difficulty', difficulty],
                    ['Time', formattedTime],
                    ['Mistakes', mistakes.toString()],
                    ['Hints', hintsUsed.toString()],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-md border border-white/10 bg-white/[0.035] p-3"
                    >
                      <p className="text-[11px] font-bold text-white/48">{label}</p>
                      <p className="mt-1 text-lg font-extrabold text-white">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={onNewGame}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-arcade-mint px-5 text-xs font-extrabold uppercase text-arcade-black shadow-[0_0_30px_rgba(94,210,156,0.28)] transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <Sparkles size={16} strokeWidth={2.6} />
                    New Game
                  </button>
                  <a
                    href="/games"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.035] px-5 text-xs font-extrabold uppercase text-white/82 transition hover:border-arcade-mint/50 hover:text-arcade-mint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcade-mint"
                  >
                    <ArrowLeft size={16} strokeWidth={2.6} />
                    Back to Games
                  </a>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
