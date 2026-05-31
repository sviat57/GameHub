export const BOARD_SIZE = 20

export const DIRECTIONS = ['up', 'down', 'left', 'right'] as const
export const DIFFICULTIES = ['Chill', 'Normal', 'Fast', 'Insane'] as const

export const GAME_MODES = ['classic', 'portal'] as const

export type Direction = (typeof DIRECTIONS)[number]
export type Difficulty = (typeof DIFFICULTIES)[number]
export type GameMode = (typeof GAME_MODES)[number]
export type GameStatus = 'idle' | 'playing' | 'paused' | 'gameOver'

export type Position = {
  row: number
  col: number
}

export type Food = Position & {
  id: string
  kind: 'normal' | 'bonus'
  expiresAt?: number
}

export type Particle = Position & {
  id: string
  angle: number
  color: string
  createdAt: number
  distance: number
}

export type ScorePopup = Position & {
  id: string
  createdAt: number
  text: string
  tone: 'mint' | 'cyan'
}

export type SnakeGameState = {
  boardSize: number
  bonusFood: Food | null
  combo: number
  difficulty: Difficulty
  direction: Direction
  food: Food
  foodsEaten: number
  gameMode: GameMode
  highScore: number
  lastFoodAt: number | null
  moveDelay: number
  particles: Particle[]
  queuedDirection: Direction | null
  score: number
  scorePopups: ScorePopup[]
  snake: Position[]
  speedLevel: number
  status: GameStatus
}

export type DifficultyConfig = {
  description: string
  moveDelay: number
  minDelay: number
}

export type GameModeConfig = {
  description: string
  label: string
}
