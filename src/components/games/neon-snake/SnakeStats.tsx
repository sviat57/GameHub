import { Activity, Gamepad2, Gauge, Keyboard, Layers, Sparkles, Trophy, Zap } from 'lucide-react'
import type { Difficulty, GameMode } from './types'
import { gameModeConfig } from './useSnakeGame'

type SnakeStatsProps = {
  combo: number
  difficulty: Difficulty
  gameMode: GameMode
  highScore: number
  moveDelay: number
  score: number
  snakeLength: number
  speedLevel: number
}

const statRows = [
  { key: 'score', label: 'Score', icon: Sparkles },
  { key: 'best', label: 'Best Score', icon: Trophy },
  { key: 'difficulty', label: 'Difficulty', icon: Gauge },
  { key: 'mode', label: 'Mode', icon: Gamepad2 },
  { key: 'speed', label: 'Speed', icon: Zap },
  { key: 'length', label: 'Snake Length', icon: Layers },
  { key: 'combo', label: 'Combo', icon: Activity },
] as const

export function SnakeStats({
  combo,
  difficulty,
  gameMode,
  highScore,
  moveDelay,
  score,
  snakeLength,
  speedLevel,
}: SnakeStatsProps) {
  const values: Record<(typeof statRows)[number]['key'], string> = {
    best: highScore.toLocaleString(),
    combo: `x${combo}`,
    difficulty,
    length: snakeLength.toString(),
    mode: gameModeConfig[gameMode].label,
    score: score.toLocaleString(),
    speed: `Level ${speedLevel} / ${moveDelay}ms`,
  }

  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.035] p-4 shadow-[0_18px_55px_rgba(0,0,0,0.25)] backdrop-blur-xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-jakarta text-[10px] font-extrabold uppercase tracking-[0.18em] text-arcade-mint">
            Run Stats
          </p>
          <h2 className="mt-1 text-lg font-extrabold text-white">Live Telemetry</h2>
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
            <span className="text-right text-sm font-extrabold text-white">
              {values[key]}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-md border border-arcade-mint/20 bg-arcade-mint/[0.055] p-3">
        <p className="font-jakarta text-[10px] font-extrabold uppercase tracking-[0.18em] text-arcade-mint">
          Controls
        </p>
        <div className="mt-2 grid gap-1.5 text-xs font-bold leading-5 text-white/58">
          <span>Arrow keys or WASD to steer</span>
          <span>Space or P to pause</span>
          <span>R restarts the run</span>
        </div>
      </div>
    </section>
  )
}
