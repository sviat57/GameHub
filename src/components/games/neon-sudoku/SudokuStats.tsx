import {
  AlertTriangle,
  Gauge,
  Keyboard,
  Lightbulb,
  MousePointer2,
  PencilLine,
  Timer,
  Trophy,
} from 'lucide-react'
import type { Difficulty, InputMode, MarkMode } from './types'

type SudokuStatsProps = {
  bestTimeLabel: string
  difficulty: Difficulty
  filledCount: number
  formattedTime: string
  hintsUsed: number
  inputMode: InputMode
  markMode: MarkMode
  mistakes: number
}

const statRows = [
  { key: 'time', label: 'Time', icon: Timer },
  { key: 'mistakes', label: 'Mistakes', icon: AlertTriangle },
  { key: 'hints', label: 'Hints Used', icon: Lightbulb },
  { key: 'filled', label: 'Filled Cells', icon: Gauge },
  { key: 'mark', label: 'Current Mode', icon: PencilLine },
  { key: 'input', label: 'Current Input', icon: MousePointer2 },
  { key: 'best', label: 'Best Time', icon: Trophy },
] as const

export function SudokuStats({
  bestTimeLabel,
  difficulty,
  filledCount,
  formattedTime,
  hintsUsed,
  inputMode,
  markMode,
  mistakes,
}: SudokuStatsProps) {
  const values = {
    time: formattedTime,
    mistakes: mistakes.toString(),
    hints: hintsUsed.toString(),
    filled: `${filledCount}/81`,
    mark: markMode === 'pen' ? 'Pen' : 'Pencil',
    input: inputMode === 'normal' ? 'Normal' : 'Quick',
    best: bestTimeLabel,
  }

  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.035] p-4 shadow-[0_18px_55px_rgba(0,0,0,0.25)] backdrop-blur-xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-jakarta text-[10px] font-extrabold uppercase tracking-[0.18em] text-arcade-mint">
            Run Stats
          </p>
          <h2 className="mt-1 text-lg font-extrabold text-white">{difficulty}</h2>
        </div>
        <span className="inline-flex size-10 items-center justify-center rounded-md border border-cyan-200/20 bg-cyan-200/10 text-cyan-100">
          <Keyboard size={19} strokeWidth={2.4} />
        </span>
      </div>

      <div className="mt-4 grid gap-2">
        {statRows.map(({ key, label, icon: Icon }) => (
          <div
            key={key}
            className="flex items-center justify-between gap-3 rounded-md border border-white/[0.08] bg-white/[0.025] px-3 py-2.5"
          >
            <span className="flex items-center gap-2 text-xs font-bold text-white/58">
              <Icon size={15} strokeWidth={2.4} className="text-cyan-100/70" />
              {label}
            </span>
            <span className="text-sm font-extrabold text-white">{values[key]}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
