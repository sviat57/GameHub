import type { ComponentType } from 'react'

export const DIFFICULTIES = ['Easy', 'Medium', 'Hard', 'Expert'] as const

export type Difficulty = (typeof DIFFICULTIES)[number]

export type GameStatus = 'idle' | 'playing' | 'paused' | 'completed'

export type CardTone = 'blue' | 'cyan' | 'emerald' | 'mint'

export type CardIcon = ComponentType<{
  className?: string
  size?: number
  strokeWidth?: number
}>

export type DifficultyConfig = {
  columns: number
  rows: number
  pairs: number
  description: string
}

export type CardSymbol = {
  icon: CardIcon
  id: string
  label: string
  shorthand: string
  tone: CardTone
}

export type MemoryCard = {
  icon: CardIcon
  id: string
  isFlipped: boolean
  isMatched: boolean
  label: string
  pairId: string
  shorthand: string
  tone: CardTone
}

export type DifficultyBestStats = {
  bestAccuracy: number | null
  bestCombo: number | null
  bestMoves: number | null
  bestTime: number | null
}

export type BestStats = Record<Difficulty, DifficultyBestStats>

export type GameStats = {
  accuracy: number
  attempts: number
  bestCombo: number
  combo: number
  elapsedSeconds: number
  matches: number
  moves: number
  totalPairs: number
}

export type ComboFeedback = {
  id: string
  text: string
  tone: 'cyan' | 'mint'
}

export type CompletedSummary = {
  accuracy: number
  bestCombo: number
  difficulty: Difficulty
  elapsedSeconds: number
  moves: number
}

export const difficultyConfig: Record<Difficulty, DifficultyConfig> = {
  Easy: {
    columns: 4,
    description: '6 pairs',
    pairs: 6,
    rows: 3,
  },
  Medium: {
    columns: 4,
    description: '8 pairs',
    pairs: 8,
    rows: 4,
  },
  Hard: {
    columns: 5,
    description: '10 pairs',
    pairs: 10,
    rows: 4,
  },
  Expert: {
    columns: 6,
    description: '12 pairs',
    pairs: 12,
    rows: 4,
  },
}
