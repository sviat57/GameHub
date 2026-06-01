import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Check, Play, Repeat, RotateCcw, Shield } from 'lucide-react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { DIFFICULTIES } from './types'
import type { Difficulty, GameMode, GameStatus } from './types'
import { difficultyConfig, gameModeConfig } from './useSnakeGame'

type SnakeOverlayProps = {
  difficulty: Difficulty
  gameMode: GameMode
  highScore: number
  score: number
  status: GameStatus
  onDifficultyChange: (difficulty: Difficulty) => void
  onModeChange: (mode: GameMode) => void
  onRestart: () => void
  onResume: () => void
  onStart: () => void
}

const joinClasses = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ')

const primaryButton =
  'inline-flex h-11 items-center justify-center gap-2 rounded-full bg-arcade-mint px-6 text-xs font-extrabold uppercase text-arcade-black shadow-[0_0_30px_rgba(94,210,156,0.28)] transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white'

export function SnakeOverlay({
  difficulty,
  gameMode,
  highScore,
  score,
  status,
  onDifficultyChange,
  onModeChange,
  onRestart,
  onResume,
  onStart,
}: SnakeOverlayProps) {
  const isVisible = status === 'idle' || status === 'paused' || status === 'gameOver'
  const isGameOver = status === 'gameOver'
  const usesViewportModal = status === 'idle' || isGameOver

  const overlay = (
    <AnimatePresence>
      {isVisible ? (
        <motion.div
          className={joinClasses(
            'grid place-items-center px-4 backdrop-blur-md',
            usesViewportModal
              ? 'fixed inset-0 z-[80] overflow-y-auto bg-arcade-black/78 py-8 sm:py-10'
              : 'absolute inset-3 z-50 rounded-md border border-white/10 bg-arcade-black/72 shadow-[inset_0_0_40px_rgba(94,210,156,0.08)] sm:inset-5',
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
        >
          <motion.div
            className={joinClasses(
              'w-full rounded-lg border border-arcade-mint/30 bg-white/[0.06] p-5 text-center shadow-[0_0_80px_rgba(94,210,156,0.18)] backdrop-blur-2xl sm:p-6',
              isGameOver ? 'max-w-md' : 'max-w-lg',
            )}
            initial={{ opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 18 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
          >
            {status === 'idle' ? (
              <>
                <p className="font-jakarta text-[10px] font-extrabold uppercase tracking-[0.2em] text-arcade-mint">
                  Classic Arcade
                </p>
                <h2 className="mt-3 text-4xl font-extrabold uppercase leading-none text-white">
                  Neon Snake
                </h2>
                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-white/64">
                  Choose a pace and wall rule, then chase glowing cells before the
                  grid tightens.
                </p>

                <div className="mt-5 grid gap-2 sm:grid-cols-4">
                  {DIFFICULTIES.map((level) => {
                    const active = difficulty === level

                    return (
                      <button
                        key={level}
                        type="button"
                        onClick={() => onDifficultyChange(level)}
                        className={joinClasses(
                          'rounded-md border p-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcade-mint',
                          active
                            ? 'border-arcade-mint/65 bg-arcade-mint/12'
                            : 'border-white/10 bg-white/[0.035] hover:border-cyan-200/35',
                        )}
                      >
                        <span className="flex items-center justify-between gap-2 text-xs font-extrabold text-white">
                          {level}
                          {active ? (
                            <Check size={14} strokeWidth={3} className="text-arcade-mint" />
                          ) : null}
                        </span>
                        <span className="mt-1 block text-[11px] leading-4 text-white/50">
                          {difficultyConfig[level].moveDelay}ms
                        </span>
                      </button>
                    )
                  })}
                </div>

                <div className="mt-3 grid grid-cols-2 rounded-md border border-white/10 bg-white/[0.025] p-1">
                  {(['classic', 'portal'] as const).map((mode) => {
                    const active = gameMode === mode
                    const Icon = mode === 'classic' ? Shield : Repeat

                    return (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => onModeChange(mode)}
                        className={joinClasses(
                          'inline-flex min-h-11 items-center justify-center gap-2 rounded px-3 text-xs font-extrabold uppercase transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcade-mint',
                          active
                            ? 'bg-arcade-mint text-arcade-black'
                            : 'text-white/66 hover:text-arcade-mint',
                        )}
                      >
                        <Icon size={15} strokeWidth={2.5} />
                        {gameModeConfig[mode].label}
                      </button>
                    )
                  })}
                </div>

                <button type="button" onClick={onStart} className={`${primaryButton} mt-5`}>
                  <Play size={16} strokeWidth={2.6} />
                  Start Game
                </button>
                <p className="mx-auto mt-4 max-w-sm text-xs font-bold leading-5 text-white/46">
                  Arrow keys, WASD, swipe, or the glass pad steer. Space or P pauses.
                </p>
                <Link
                  to="/games"
                  className="mt-4 inline-flex items-center justify-center gap-2 text-xs font-extrabold uppercase tracking-[0.14em] text-white/58 transition hover:text-arcade-mint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcade-mint"
                >
                  <ArrowLeft size={15} strokeWidth={2.6} />
                  Back to Games
                </Link>
              </>
            ) : null}

            {status === 'paused' ? (
              <>
                <p className="font-jakarta text-[10px] font-extrabold uppercase tracking-[0.2em] text-arcade-mint">
                  Neon Snake
                </p>
                <h2 className="mt-3 text-4xl font-extrabold text-white">Paused</h2>
                <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-white/64">
                  The board is frozen. Resume when the route is clear.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <button type="button" onClick={onResume} className={primaryButton}>
                    <Play size={16} strokeWidth={2.6} />
                    Resume
                  </button>
                  <button
                    type="button"
                    onClick={onRestart}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.035] px-5 text-xs font-extrabold uppercase text-white/82 transition hover:border-arcade-mint/50 hover:text-arcade-mint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcade-mint"
                  >
                    <RotateCcw size={16} strokeWidth={2.6} />
                    Restart
                  </button>
                </div>
              </>
            ) : null}

            {status === 'gameOver' ? (
              <>
                <p className="font-jakarta text-[10px] font-extrabold uppercase tracking-[0.2em] text-arcade-mint">
                  Run Complete
                </p>
                <h2 className="mt-3 text-4xl font-extrabold text-white">Game Over</h2>
                <div className="mt-5 grid grid-cols-2 gap-2 text-left">
                  {[
                    ['Score', score.toLocaleString()],
                    ['Best Score', highScore.toLocaleString()],
                    ['Difficulty', difficulty],
                    ['Mode', gameModeConfig[gameMode].label],
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
                  <button type="button" onClick={onRestart} className={primaryButton}>
                    <RotateCcw size={16} strokeWidth={2.6} />
                    Restart
                  </button>
                  <Link
                    to="/games"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.035] px-5 text-xs font-extrabold uppercase text-white/82 transition hover:border-arcade-mint/50 hover:text-arcade-mint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcade-mint"
                  >
                    <ArrowLeft size={16} strokeWidth={2.6} />
                    Back to Games
                  </Link>
                </div>
              </>
            ) : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )

  if (usesViewportModal && typeof document !== 'undefined') {
    return createPortal(overlay, document.body)
  }

  return overlay
}
