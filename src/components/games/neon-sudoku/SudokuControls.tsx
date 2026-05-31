import { Check, MousePointerClick, PenLine, Pencil, ShieldAlert, Zap } from 'lucide-react'
import { DIFFICULTIES } from './types'
import type { Difficulty, InputMode, MarkMode } from './types'
import { difficultyConfig } from './sudokuUtils'

type SudokuControlsProps = {
  difficulty: Difficulty
  inputMode: InputMode
  markMode: MarkMode
  mistakeChecking: boolean
  onDifficultyChange: (difficulty: Difficulty) => void
  onInputModeChange: (mode: InputMode) => void
  onMarkModeChange: (mode: MarkMode) => void
  onMistakeCheckingToggle: () => void
}

const joinClasses = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ')

export function SudokuControls({
  difficulty,
  inputMode,
  markMode,
  mistakeChecking,
  onDifficultyChange,
  onInputModeChange,
  onMarkModeChange,
  onMistakeCheckingToggle,
}: SudokuControlsProps) {
  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.035] p-4 shadow-[0_18px_55px_rgba(0,0,0,0.25)] backdrop-blur-xl">
      <p className="font-jakarta text-[10px] font-extrabold uppercase tracking-[0.18em] text-arcade-mint">
        Control Layer
      </p>
      <h2 className="mt-1 text-lg font-extrabold text-white">Difficulty</h2>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {DIFFICULTIES.map((level) => {
          const active = difficulty === level

          return (
            <button
              key={level}
              type="button"
              onClick={() => onDifficultyChange(level)}
              className={joinClasses(
                'group rounded-md border p-3 text-left transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcade-mint',
                active
                  ? 'border-arcade-mint/65 bg-arcade-mint/12 shadow-[0_0_24px_rgba(94,210,156,0.16)]'
                  : 'border-white/10 bg-white/[0.025] hover:border-cyan-200/35 hover:bg-cyan-200/[0.055]',
              )}
            >
              <span className="flex items-center justify-between gap-2 text-sm font-extrabold text-white">
                {level}
                {active ? (
                  <Check size={15} strokeWidth={3} className="text-arcade-mint" />
                ) : null}
              </span>
              <span className="mt-1 block text-xs leading-5 text-white/52">
                {difficultyConfig[level].givenRange[0]}-
                {difficultyConfig[level].givenRange[1]} clues
              </span>
            </button>
          )
        })}
      </div>

      <div className="mt-5 grid gap-3">
        <div>
          <p className="mb-2 text-xs font-bold text-white/58">Input mode</p>
          <div className="grid grid-cols-2 rounded-md border border-white/10 bg-white/[0.025] p-1">
            <button
              type="button"
              onClick={() => onInputModeChange('normal')}
              className={joinClasses(
                'inline-flex h-10 items-center justify-center gap-2 rounded text-xs font-extrabold uppercase transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcade-mint',
                inputMode === 'normal'
                  ? 'bg-white text-arcade-black'
                  : 'text-white/66 hover:text-arcade-mint',
              )}
            >
              <MousePointerClick size={15} strokeWidth={2.5} />
              Normal Input
            </button>
            <button
              type="button"
              onClick={() => onInputModeChange('quick')}
              className={joinClasses(
                'inline-flex h-10 items-center justify-center gap-2 rounded text-xs font-extrabold uppercase transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcade-mint',
                inputMode === 'quick'
                  ? 'bg-arcade-mint text-arcade-black'
                  : 'text-white/66 hover:text-arcade-mint',
              )}
            >
              <Zap size={15} strokeWidth={2.5} />
              Quick Input
            </button>
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-bold text-white/58">Mark mode</p>
          <div className="grid grid-cols-2 rounded-md border border-white/10 bg-white/[0.025] p-1">
            <button
              type="button"
              onClick={() => onMarkModeChange('pen')}
              className={joinClasses(
                'inline-flex h-10 items-center justify-center gap-2 rounded text-xs font-extrabold uppercase transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcade-mint',
                markMode === 'pen'
                  ? 'bg-white text-arcade-black'
                  : 'text-white/66 hover:text-arcade-mint',
              )}
            >
              <PenLine size={15} strokeWidth={2.5} />
              Pen Mode
            </button>
            <button
              type="button"
              onClick={() => onMarkModeChange('pencil')}
              className={joinClasses(
                'inline-flex h-10 items-center justify-center gap-2 rounded text-xs font-extrabold uppercase transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcade-mint',
                markMode === 'pencil'
                  ? 'bg-arcade-mint text-arcade-black'
                  : 'text-white/66 hover:text-arcade-mint',
              )}
            >
              <Pencil size={15} strokeWidth={2.5} />
              Pencil Mode
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={onMistakeCheckingToggle}
          aria-pressed={mistakeChecking}
          className={joinClasses(
            'flex h-11 items-center justify-between rounded-md border px-3 text-xs font-extrabold uppercase transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcade-mint',
            mistakeChecking
              ? 'border-arcade-mint/50 bg-arcade-mint/12 text-arcade-mint'
              : 'border-white/10 bg-white/[0.025] text-white/66 hover:border-cyan-200/35 hover:text-cyan-100',
          )}
        >
          <span className="inline-flex items-center gap-2">
            <ShieldAlert size={15} strokeWidth={2.5} />
            Mistake Check
          </span>
          <span>{mistakeChecking ? 'On' : 'Off'}</span>
        </button>
      </div>
    </section>
  )
}
