import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Check,
  Gauge,
  Pause,
  Play,
  RotateCcw,
  Settings2,
  Sparkles,
} from 'lucide-react'
import { DIFFICULTIES, difficultyConfig } from './types'
import type { Difficulty, GameStatus } from './types'

type MemoryControlsProps = {
  difficulty: Difficulty
  onDifficultyChange: (difficulty: Difficulty) => void
  onNewGame: () => void
  onPauseToggle: () => void
  onRestart: () => void
  onStart: () => void
  status: GameStatus
}

const joinClasses = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ')

const actionButton =
  'inline-flex h-11 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-3 text-xs font-extrabold uppercase text-white/82 transition duration-200 hover:border-arcade-mint/45 hover:bg-arcade-mint/10 hover:text-arcade-mint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcade-mint disabled:cursor-not-allowed disabled:opacity-45'

export function MemoryControls({
  difficulty,
  onDifficultyChange,
  onNewGame,
  onPauseToggle,
  onRestart,
  onStart,
  status,
}: MemoryControlsProps) {
  const canChangeSetup = status === 'idle' || status === 'completed'
  const primaryLabel =
    status === 'idle'
      ? 'Start Game'
      : status === 'playing'
        ? 'Pause'
        : status === 'paused'
          ? 'Resume'
          : 'New Game'
  const primaryAction =
    status === 'idle' ? onStart : status === 'completed' ? onNewGame : onPauseToggle
  const PrimaryIcon = status === 'playing' ? Pause : status === 'completed' ? Sparkles : Play

  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.035] p-4 shadow-[0_18px_55px_rgba(0,0,0,0.25)] backdrop-blur-xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-jakarta text-[10px] font-extrabold uppercase tracking-[0.18em] text-arcade-mint">
            Control Deck
          </p>
          <h2 className="mt-1 text-lg font-extrabold text-white">Grid Setup</h2>
        </div>
        <span className="inline-flex size-10 items-center justify-center rounded-md border border-cyan-200/20 bg-cyan-200/10 text-cyan-100">
          <Settings2 size={19} strokeWidth={2.4} />
        </span>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {DIFFICULTIES.map((level) => {
          const active = difficulty === level
          const config = difficultyConfig[level]

          return (
            <button
              key={level}
              type="button"
              disabled={!canChangeSetup}
              onClick={() => onDifficultyChange(level)}
              className={joinClasses(
                'group rounded-md border p-3 text-left transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcade-mint disabled:cursor-not-allowed disabled:opacity-55',
                active
                  ? 'border-arcade-mint/65 bg-arcade-mint/12 shadow-[0_0_24px_rgba(94,210,156,0.16)]'
                  : 'border-white/10 bg-white/[0.025] hover:border-cyan-200/35 hover:bg-cyan-200/[0.055]',
              )}
            >
              <span className="flex items-center justify-between gap-2 text-sm font-extrabold text-white">
                <span className="inline-flex items-center gap-2">
                  <Gauge size={14} strokeWidth={2.6} className="text-cyan-100/70" />
                  {level}
                </span>
                {active ? (
                  <Check size={15} strokeWidth={3} className="text-arcade-mint" />
                ) : null}
              </span>
              <span className="mt-1 block text-xs leading-5 text-white/52">
                {config.columns}x{config.rows} / {config.description}
              </span>
            </button>
          )
        })}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <motion.button
          type="button"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-arcade-mint px-3 text-xs font-extrabold uppercase text-arcade-black shadow-[0_0_28px_rgba(94,210,156,0.28)] transition duration-200 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          onClick={primaryAction}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.97 }}
          aria-label={primaryLabel}
        >
          <PrimaryIcon size={16} strokeWidth={2.5} />
          {primaryLabel}
        </motion.button>
        <button
          type="button"
          className={actionButton}
          onClick={onRestart}
          disabled={status === 'idle'}
          aria-label="Restart game"
        >
          <RotateCcw size={16} strokeWidth={2.5} />
          Restart
        </button>
        <button
          type="button"
          className={actionButton}
          onClick={onNewGame}
          aria-label="Prepare a new game"
        >
          <Sparkles size={16} strokeWidth={2.5} />
          New Game
        </button>
        <a href="/games" className={actionButton} aria-label="Back to games">
          <ArrowLeft size={16} strokeWidth={2.5} />
          Games
        </a>
      </div>
    </section>
  )
}
