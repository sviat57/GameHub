import { motion } from 'framer-motion'
import { Eraser, Lightbulb, Pause, Play, RotateCcw, Sparkles, Wand2 } from 'lucide-react'
import { DIGITS } from './sudokuUtils'
import type { GameStatus } from './types'

type NumberPadProps = {
  numberCounts: Record<number, number>
  remainingHints: number
  selectedNumber: number | null
  status: GameStatus
  onAutoNotes: () => void
  onErase: () => void
  onHint: () => void
  onNewGame: () => void
  onNumber: (value: number) => void
  onPauseToggle: () => void
  onRestart: () => void
}

const joinClasses = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ')

const actionButton =
  'inline-flex h-11 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-3 text-xs font-extrabold uppercase text-white/82 transition duration-200 hover:border-arcade-mint/45 hover:bg-arcade-mint/10 hover:text-arcade-mint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcade-mint disabled:cursor-not-allowed disabled:opacity-45'

export function NumberPad({
  numberCounts,
  remainingHints,
  selectedNumber,
  status,
  onAutoNotes,
  onErase,
  onHint,
  onNewGame,
  onNumber,
  onPauseToggle,
  onRestart,
}: NumberPadProps) {
  const isPlaying = status === 'playing'

  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.035] p-4 shadow-[0_18px_55px_rgba(0,0,0,0.25)] backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-jakarta text-[10px] font-extrabold uppercase tracking-[0.18em] text-arcade-mint">
            Input Deck
          </p>
          <h2 className="mt-1 text-lg font-extrabold text-white">Number Pad</h2>
        </div>
        <div className="rounded-full border border-cyan-200/20 bg-cyan-200/10 px-3 py-1 text-[11px] font-bold text-cyan-100">
          {remainingHints} hints
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {DIGITS.map((value) => {
          const isComplete = numberCounts[value] >= 9
          const isSelected = selectedNumber === value

          return (
            <motion.button
              key={value}
              type="button"
              aria-label={`Choose ${value}`}
              disabled={!isPlaying || isComplete}
              onClick={() => onNumber(value)}
              whileHover={isPlaying && !isComplete ? { y: -2 } : undefined}
              whileTap={isPlaying && !isComplete ? { scale: 0.96 } : undefined}
              className={joinClasses(
                'relative h-14 rounded-md border text-xl font-extrabold outline-none transition duration-200 focus-visible:ring-2 focus-visible:ring-arcade-mint',
                'border-white/10 bg-white/[0.045] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]',
                'hover:border-arcade-mint/50 hover:bg-arcade-mint/10 hover:text-arcade-mint',
                isSelected &&
                  'border-arcade-mint/70 bg-arcade-mint/18 text-arcade-mint shadow-[0_0_24px_rgba(94,210,156,0.22)]',
                isComplete && 'cursor-not-allowed opacity-35',
              )}
            >
              {value}
              <span className="absolute bottom-1 right-2 text-[10px] font-bold text-white/35">
                {numberCounts[value]}/9
              </span>
            </motion.button>
          )
        })}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          className={actionButton}
          disabled={!isPlaying}
          onClick={onErase}
          aria-label="Erase selected cell"
        >
          <Eraser size={16} strokeWidth={2.5} />
          Erase
        </button>
        <button
          type="button"
          className={actionButton}
          disabled={!isPlaying || remainingHints <= 0}
          onClick={onHint}
          aria-label="Use a hint"
        >
          <Lightbulb size={16} strokeWidth={2.5} />
          Hint
        </button>
        <button
          type="button"
          className={actionButton}
          disabled={!isPlaying}
          onClick={onAutoNotes}
          aria-label="Fill automatic pencil notes"
        >
          <Wand2 size={16} strokeWidth={2.5} />
          Auto Notes
        </button>
        <button
          type="button"
          className={actionButton}
          onClick={onPauseToggle}
          aria-label={status === 'paused' ? 'Resume puzzle' : 'Pause puzzle'}
        >
          {status === 'paused' ? (
            <Play size={16} strokeWidth={2.5} />
          ) : (
            <Pause size={16} strokeWidth={2.5} />
          )}
          {status === 'paused' ? 'Resume' : 'Pause'}
        </button>
        <button
          type="button"
          className={actionButton}
          onClick={onRestart}
          aria-label="Restart current puzzle"
        >
          <RotateCcw size={16} strokeWidth={2.5} />
          Restart
        </button>
        <button
          type="button"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-arcade-mint px-3 text-xs font-extrabold uppercase text-arcade-black shadow-[0_0_28px_rgba(94,210,156,0.28)] transition duration-200 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          onClick={onNewGame}
          aria-label="Start a new puzzle"
        >
          <Sparkles size={16} strokeWidth={2.5} />
          New Game
        </button>
      </div>
    </section>
  )
}
