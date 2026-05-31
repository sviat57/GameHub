import {
  Activity,
  Gauge,
  Hourglass,
  MousePointerClick,
  Percent,
  Sparkles,
  Target,
  Timer,
  Trophy,
} from 'lucide-react'
import type { Difficulty, GameStats } from './types'

type MemoryStatsProps = {
  bestMovesLabel: string
  bestTimeLabel: string
  difficulty: Difficulty
  formattedTime: string
  stats: GameStats
}

const statRows = [
  { icon: Gauge, key: 'difficulty', label: 'Difficulty' },
  { icon: Timer, key: 'time', label: 'Time' },
  { icon: MousePointerClick, key: 'moves', label: 'Moves' },
  { icon: Target, key: 'matches', label: 'Matches' },
  { icon: Percent, key: 'accuracy', label: 'Accuracy' },
  { icon: Activity, key: 'combo', label: 'Combo' },
  { icon: Sparkles, key: 'bestCombo', label: 'Best Combo' },
  { icon: Hourglass, key: 'bestTime', label: 'Best Time' },
  { icon: Trophy, key: 'bestMoves', label: 'Best Moves' },
] as const

export function MemoryStats({
  bestMovesLabel,
  bestTimeLabel,
  difficulty,
  formattedTime,
  stats,
}: MemoryStatsProps) {
  const values: Record<(typeof statRows)[number]['key'], string> = {
    accuracy: `${stats.accuracy}%`,
    bestCombo: stats.bestCombo > 0 ? `x${stats.bestCombo}` : '--',
    bestMoves: bestMovesLabel,
    bestTime: bestTimeLabel,
    combo: stats.combo > 0 ? `x${stats.combo}` : '--',
    difficulty,
    matches: `${stats.matches}/${stats.totalPairs}`,
    moves: stats.moves.toString(),
    time: formattedTime,
  }

  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.035] p-4 shadow-[0_18px_55px_rgba(0,0,0,0.25)] backdrop-blur-xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-jakarta text-[10px] font-extrabold uppercase tracking-[0.18em] text-arcade-mint">
            Match Stats
          </p>
          <h2 className="mt-1 text-lg font-extrabold text-white">Live Telemetry</h2>
        </div>
        <span className="inline-flex size-10 items-center justify-center rounded-md border border-cyan-200/20 bg-cyan-200/10 text-cyan-100">
          <Target size={19} strokeWidth={2.4} />
        </span>
      </div>

      <div className="mt-4 grid gap-2">
        {statRows.map(({ icon: Icon, key, label }) => (
          <div
            key={key}
            className="flex items-center justify-between gap-3 rounded-md border border-white/[0.08] bg-white/[0.025] px-3 py-2.5"
          >
            <span className="flex items-center gap-2 text-xs font-bold text-white/58">
              <Icon size={15} strokeWidth={2.4} className="text-cyan-100/70" />
              {label}
            </span>
            <span className="text-right text-sm font-extrabold text-white">
              {values[key]}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
