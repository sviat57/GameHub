import { motion } from 'framer-motion'
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Check,
  Pause,
  Play,
  Repeat,
  RotateCcw,
  Settings2,
  Shield,
  Sparkles,
  Zap,
} from 'lucide-react'
import { DIFFICULTIES } from './types'
import type { Difficulty, Direction, GameMode, GameStatus } from './types'
import { difficultyConfig, gameModeConfig } from './useSnakeGame'

type SnakeControlsProps = {
  difficulty: Difficulty
  gameMode: GameMode
  status: GameStatus
  onDifficultyChange: (difficulty: Difficulty) => void
  onDirectionChange: (direction: Direction) => void
  onModeChange: (mode: GameMode) => void
  onNewRun: () => void
  onPauseToggle: () => void
  onRestart: () => void
  onStart: () => void
}

const joinClasses = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ')

const actionButton =
  'inline-flex h-11 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-3 text-xs font-extrabold uppercase text-white/82 transition duration-200 hover:border-arcade-mint/45 hover:bg-arcade-mint/10 hover:text-arcade-mint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcade-mint disabled:cursor-not-allowed disabled:opacity-45'

const directionButton =
  'inline-flex h-14 min-h-14 items-center justify-center rounded-md border border-white/10 bg-white/[0.045] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition duration-200 hover:border-arcade-mint/50 hover:bg-arcade-mint/10 hover:text-arcade-mint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcade-mint active:scale-95'

export function SnakeControls({
  difficulty,
  gameMode,
  status,
  onDifficultyChange,
  onDirectionChange,
  onModeChange,
  onNewRun,
  onPauseToggle,
  onRestart,
  onStart,
}: SnakeControlsProps) {
  const canChangeSetup = status === 'idle' || status === 'gameOver'
  const primaryLabel =
    status === 'idle'
      ? 'Start Game'
      : status === 'playing'
        ? 'Pause'
        : status === 'paused'
          ? 'Resume'
          : 'Restart'
  const primaryAction =
    status === 'idle' ? onStart : status === 'gameOver' ? onRestart : onPauseToggle
  const PrimaryIcon = status === 'playing' ? Pause : Play

  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.035] p-4 shadow-[0_18px_55px_rgba(0,0,0,0.25)] backdrop-blur-xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-jakarta text-[10px] font-extrabold uppercase tracking-[0.18em] text-arcade-mint">
            Control Deck
          </p>
          <h2 className="mt-1 text-lg font-extrabold text-white">Run Setup</h2>
        </div>
        <span className="inline-flex size-10 items-center justify-center rounded-md border border-cyan-200/20 bg-cyan-200/10 text-cyan-100">
          <Settings2 size={19} strokeWidth={2.4} />
        </span>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {DIFFICULTIES.map((level) => {
          const active = difficulty === level

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
                  <Zap size={14} strokeWidth={2.6} className="text-cyan-100/70" />
                  {level}
                </span>
                {active ? (
                  <Check size={15} strokeWidth={3} className="text-arcade-mint" />
                ) : null}
              </span>
              <span className="mt-1 block text-xs leading-5 text-white/52">
                {difficultyConfig[level].description}
              </span>
            </button>
          )
        })}
      </div>

      <div className="mt-4 grid grid-cols-2 rounded-md border border-white/10 bg-white/[0.025] p-1">
        {(['classic', 'portal'] as const).map((mode) => {
          const active = gameMode === mode
          const Icon = mode === 'classic' ? Shield : Repeat

          return (
            <button
              key={mode}
              type="button"
              disabled={!canChangeSetup}
              onClick={() => onModeChange(mode)}
              className={joinClasses(
                'inline-flex min-h-12 flex-col items-center justify-center gap-1 rounded px-2 text-center text-[11px] font-extrabold uppercase transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcade-mint disabled:cursor-not-allowed disabled:opacity-55',
                active
                  ? 'bg-arcade-mint text-arcade-black'
                  : 'text-white/66 hover:text-arcade-mint',
              )}
            >
              <span className="inline-flex items-center gap-1.5">
                <Icon size={14} strokeWidth={2.5} />
                {gameModeConfig[mode].label}
              </span>
              <span
                className={joinClasses(
                  'normal-case tracking-normal',
                  active ? 'text-arcade-black/70' : 'text-white/42',
                )}
              >
                {gameModeConfig[mode].description}
              </span>
            </button>
          )
        })}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-arcade-mint px-3 text-xs font-extrabold uppercase text-arcade-black shadow-[0_0_28px_rgba(94,210,156,0.28)] transition duration-200 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          onClick={primaryAction}
          aria-label={primaryLabel}
        >
          <PrimaryIcon size={16} strokeWidth={2.5} />
          {primaryLabel}
        </button>
        <button
          type="button"
          className={actionButton}
          onClick={onRestart}
          disabled={status === 'idle'}
          aria-label="Restart run"
        >
          <RotateCcw size={16} strokeWidth={2.5} />
          Restart
        </button>
        <button
          type="button"
          className={actionButton}
          onClick={onNewRun}
          aria-label="Prepare a new run"
        >
          <Sparkles size={16} strokeWidth={2.5} />
          New Run
        </button>
        <button
          type="button"
          className={actionButton}
          onClick={onPauseToggle}
          disabled={status === 'idle' || status === 'gameOver'}
          aria-label={status === 'paused' ? 'Resume game' : 'Pause game'}
        >
          {status === 'paused' ? (
            <Play size={16} strokeWidth={2.5} />
          ) : (
            <Pause size={16} strokeWidth={2.5} />
          )}
          {status === 'paused' ? 'Resume' : 'Pause'}
        </button>
      </div>

      <div className="mt-5">
        <p className="mb-2 text-xs font-bold text-white/58">Touch controls</p>
        <div className="mx-auto grid max-w-[260px] grid-cols-3 gap-2 sm:max-w-none">
          <span aria-hidden="true" />
          <motion.button
            type="button"
            className={directionButton}
            onClick={() => onDirectionChange('up')}
            whileTap={{ scale: 0.94 }}
            aria-label="Move up"
          >
            <ArrowUp size={22} strokeWidth={2.7} />
          </motion.button>
          <span aria-hidden="true" />
          <motion.button
            type="button"
            className={directionButton}
            onClick={() => onDirectionChange('left')}
            whileTap={{ scale: 0.94 }}
            aria-label="Move left"
          >
            <ArrowLeft size={22} strokeWidth={2.7} />
          </motion.button>
          <span className="grid h-14 place-items-center rounded-md border border-arcade-mint/20 bg-arcade-mint/[0.055]">
            <span className="size-2.5 rounded-full bg-arcade-mint shadow-[0_0_18px_rgba(94,210,156,0.9)]" />
          </span>
          <motion.button
            type="button"
            className={directionButton}
            onClick={() => onDirectionChange('right')}
            whileTap={{ scale: 0.94 }}
            aria-label="Move right"
          >
            <ArrowRight size={22} strokeWidth={2.7} />
          </motion.button>
          <span aria-hidden="true" />
          <motion.button
            type="button"
            className={directionButton}
            onClick={() => onDirectionChange('down')}
            whileTap={{ scale: 0.94 }}
            aria-label="Move down"
          >
            <ArrowDown size={22} strokeWidth={2.7} />
          </motion.button>
          <span aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
