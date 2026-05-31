export const DIFFICULTIES = ['Easy', 'Medium', 'Hard', 'Expert'] as const

export type Difficulty = (typeof DIFFICULTIES)[number]
export type InputMode = 'normal' | 'quick'
export type MarkMode = 'pen' | 'pencil'
export type GameStatus = 'idle' | 'playing' | 'paused' | 'completed'

export type Position = {
  row: number
  col: number
}

export type Cell = Position & {
  value: number | null
  solution: number
  given: boolean
  notes: number[]
  isHint: boolean
}

export type Board = Cell[][]
export type NumericBoard = number[][]
export type Notes = number[]

export type DifficultyConfig = {
  givenRange: [number, number]
  hints: number
  label: string
}

export type BestTimes = Partial<Record<Difficulty, number>>
