import { useEffect, useMemo, useReducer } from 'react'
import { BOARD_SIZE, DIFFICULTIES, GAME_MODES } from './types'
import type {
  Difficulty,
  DifficultyConfig,
  Direction,
  Food,
  GameMode,
  GameModeConfig,
  Particle,
  Position,
  ScorePopup,
  SnakeGameState,
} from './types'

const HIGH_SCORE_KEY = 'neon-snake:high-score'
const SETTINGS_KEY = 'neon-snake:settings'
const COMBO_WINDOW_MS = 4_200
const PARTICLE_TTL_MS = 850
const SCORE_POPUP_TTL_MS = 900
const BONUS_FOOD_TTL_MS = 6_500
const BONUS_FOOD_CHANCE = 0.14
const SPEED_STEP_MS = 5
const SPEED_STEP_FOODS = 5
const MAX_COMBO = 9

export const difficultyConfig: Record<Difficulty, DifficultyConfig> = {
  Chill: {
    description: 'Slower turns with room to breathe.',
    moveDelay: 180,
    minDelay: 96,
  },
  Normal: {
    description: 'Balanced arcade pacing.',
    moveDelay: 130,
    minDelay: 72,
  },
  Fast: {
    description: 'Sharper reflexes, faster routes.',
    moveDelay: 95,
    minDelay: 55,
  },
  Insane: {
    description: 'A high-voltage sprint.',
    moveDelay: 70,
    minDelay: 44,
  },
}

export const gameModeConfig: Record<GameMode, GameModeConfig> = {
  classic: {
    description: 'Walls end the run.',
    label: 'Classic Walls',
  },
  portal: {
    description: 'Edges wrap like portals.',
    label: 'Portal Walls',
  },
}

const directionVectors: Record<Direction, Position> = {
  down: { row: 1, col: 0 },
  left: { row: 0, col: -1 },
  right: { row: 0, col: 1 },
  up: { row: -1, col: 0 },
}

const oppositeDirections: Record<Direction, Direction> = {
  down: 'up',
  left: 'right',
  right: 'left',
  up: 'down',
}

type StoredSetup = {
  difficulty: Difficulty
  gameMode: GameMode
  highScore: number
}

type SnakeAction =
  | { type: 'changeDirection'; direction: Direction }
  | { type: 'newRun' }
  | { type: 'pause' }
  | { type: 'restart' }
  | { type: 'resume' }
  | { type: 'setDifficulty'; difficulty: Difficulty }
  | { type: 'setMode'; gameMode: GameMode }
  | { type: 'start' }
  | { type: 'tick'; now: number }
  | { type: 'togglePause' }

const positionKey = ({ row, col }: Position) => `${row}:${col}`

const samePosition = (a: Position, b: Position) => a.row === b.row && a.col === b.col

const isDifficulty = (value: unknown): value is Difficulty =>
  typeof value === 'string' && DIFFICULTIES.includes(value as Difficulty)

const isGameMode = (value: unknown): value is GameMode =>
  typeof value === 'string' && GAME_MODES.includes(value as GameMode)

const createId = (prefix: string, now = Date.now(), index = 0) =>
  `${prefix}-${now}-${index}-${Math.random().toString(36).slice(2, 8)}`

const createInitialSnake = (): Position[] => {
  const center = Math.floor(BOARD_SIZE / 2)

  return [
    { row: center, col: center + 1 },
    { row: center, col: center },
    { row: center, col: center - 1 },
  ]
}

const getEmptyPosition = (occupied: Position[], boardSize = BOARD_SIZE) => {
  const occupiedKeys = new Set(occupied.map(positionKey))
  const emptyCells: Position[] = []

  for (let row = 0; row < boardSize; row += 1) {
    for (let col = 0; col < boardSize; col += 1) {
      const position = { row, col }

      if (!occupiedKeys.has(positionKey(position))) {
        emptyCells.push(position)
      }
    }
  }

  if (emptyCells.length === 0) {
    return null
  }

  return emptyCells[Math.floor(Math.random() * emptyCells.length)]
}

const spawnFood = (
  occupied: Position[],
  kind: Food['kind'],
  now = Date.now(),
): Food | null => {
  const position = getEmptyPosition(occupied)

  if (!position) {
    return null
  }

  return {
    ...position,
    expiresAt: kind === 'bonus' ? now + BONUS_FOOD_TTL_MS : undefined,
    id: createId(kind, now),
    kind,
  }
}

const getSpeed = (difficulty: Difficulty, foodsEaten: number) => {
  const speedLevel = Math.floor(foodsEaten / SPEED_STEP_FOODS) + 1
  const config = difficultyConfig[difficulty]
  const moveDelay = Math.max(
    config.minDelay,
    config.moveDelay - (speedLevel - 1) * SPEED_STEP_MS,
  )

  return { moveDelay, speedLevel }
}

const createParticles = (
  position: Position,
  now: number,
  tone: ScorePopup['tone'],
): Particle[] =>
  Array.from({ length: 12 }, (_, index) => ({
    ...position,
    angle: (Math.PI * 2 * index) / 12 + Math.random() * 0.36,
    color: tone === 'cyan' ? '#67e8f9' : '#5ed29c',
    createdAt: now,
    distance: 20 + Math.random() * 24,
    id: createId('particle', now, index),
  }))

const createInitialState = (
  difficulty: Difficulty,
  gameMode: GameMode,
  highScore: number,
  status: SnakeGameState['status'] = 'idle',
): SnakeGameState => {
  const snake = createInitialSnake()
  const food =
    spawnFood(snake, 'normal') ?? {
      col: 4,
      id: createId('normal'),
      kind: 'normal',
      row: 4,
    }
  const speed = getSpeed(difficulty, 0)

  return {
    boardSize: BOARD_SIZE,
    bonusFood: null,
    combo: 1,
    difficulty,
    direction: 'right',
    food,
    foodsEaten: 0,
    gameMode,
    highScore,
    lastFoodAt: null,
    moveDelay: speed.moveDelay,
    particles: [],
    queuedDirection: null,
    score: 0,
    scorePopups: [],
    snake,
    speedLevel: speed.speedLevel,
    status,
  }
}

const readStoredSetup = (): StoredSetup => {
  const fallback: StoredSetup = {
    difficulty: 'Normal',
    gameMode: 'classic',
    highScore: 0,
  }

  if (typeof window === 'undefined') {
    return fallback
  }

  try {
    const rawScore = window.localStorage.getItem(HIGH_SCORE_KEY)
    const parsedScore = rawScore ? Number(rawScore) : 0
    const highScore = Number.isFinite(parsedScore)
      ? Math.max(0, Math.floor(parsedScore))
      : 0
    const rawSettings = window.localStorage.getItem(SETTINGS_KEY)

    if (!rawSettings) {
      return { ...fallback, highScore }
    }

    const settings = JSON.parse(rawSettings) as Partial<{
      difficulty: unknown
      gameMode: unknown
    }>

    return {
      difficulty: isDifficulty(settings.difficulty)
        ? settings.difficulty
        : fallback.difficulty,
      gameMode: isGameMode(settings.gameMode) ? settings.gameMode : fallback.gameMode,
      highScore,
    }
  } catch {
    return fallback
  }
}

const cleanTimedEffects = (state: SnakeGameState, now: number): SnakeGameState => {
  const bonusFood =
    state.bonusFood && state.bonusFood.expiresAt && state.bonusFood.expiresAt <= now
      ? null
      : state.bonusFood
  const combo =
    state.combo > 1 && state.lastFoodAt && now - state.lastFoodAt > COMBO_WINDOW_MS
      ? 1
      : state.combo

  return {
    ...state,
    bonusFood,
    combo,
    particles: state.particles.filter(
      (particle) => now - particle.createdAt < PARTICLE_TTL_MS,
    ),
    scorePopups: state.scorePopups.filter(
      (popup) => now - popup.createdAt < SCORE_POPUP_TTL_MS,
    ),
  }
}

const finishRun = (state: SnakeGameState): SnakeGameState => ({
  ...state,
  highScore: Math.max(state.highScore, state.score),
  queuedDirection: null,
  status: 'gameOver',
})

const getNextHead = (
  head: Position,
  direction: Direction,
  gameMode: GameMode,
  boardSize = BOARD_SIZE,
) => {
  const vector = directionVectors[direction]
  const next = {
    col: head.col + vector.col,
    row: head.row + vector.row,
  }

  if (gameMode === 'portal') {
    return {
      col: (next.col + boardSize) % boardSize,
      row: (next.row + boardSize) % boardSize,
    }
  }

  const hitsWall =
    next.row < 0 || next.row >= boardSize || next.col < 0 || next.col >= boardSize

  return hitsWall ? null : next
}

const advanceSnake = (state: SnakeGameState, now: number): SnakeGameState => {
  const current = cleanTimedEffects(state, now)
  const direction = current.queuedDirection ?? current.direction
  const nextHead = getNextHead(current.snake[0], direction, current.gameMode)

  if (!nextHead) {
    return finishRun({ ...current, direction, queuedDirection: null })
  }

  const eatsFood = samePosition(nextHead, current.food)
  const eatsBonus = current.bonusFood ? samePosition(nextHead, current.bonusFood) : false
  const grows = eatsFood || eatsBonus
  const collisionBody = grows ? current.snake : current.snake.slice(0, -1)

  if (collisionBody.some((segment) => samePosition(segment, nextHead))) {
    return finishRun({ ...current, direction, queuedDirection: null })
  }

  const snake = [nextHead, ...current.snake]

  if (!grows) {
    snake.pop()
  }

  if (!grows) {
    return {
      ...current,
      direction,
      queuedDirection: null,
      snake,
    }
  }

  const isCombo =
    current.lastFoodAt !== null && now - current.lastFoodAt <= COMBO_WINDOW_MS
  const combo = isCombo ? Math.min(current.combo + 1, MAX_COMBO) : 1
  const baseScore = eatsBonus ? 50 : 10
  const gainedScore = baseScore * combo
  const score = current.score + gainedScore
  const highScore = Math.max(current.highScore, score)
  const foodsEaten = current.foodsEaten + (eatsFood ? 1 : 0)
  const speed = getSpeed(current.difficulty, foodsEaten)
  const tone: ScorePopup['tone'] = eatsBonus ? 'cyan' : 'mint'
  const particles = [...current.particles, ...createParticles(nextHead, now, tone)].slice(
    -42,
  )
  const scorePopups = [
    ...current.scorePopups,
    {
      ...nextHead,
      createdAt: now,
      id: createId('score', now),
      text: `+${gainedScore}`,
      tone,
    },
    ...(combo > 1
      ? [
          {
            ...nextHead,
            col: nextHead.col + 1,
            createdAt: now,
            id: createId('combo', now),
            text: `COMBO x${combo}`,
            tone,
          } satisfies ScorePopup,
        ]
      : []),
  ].slice(-8)
  let food = current.food
  let bonusFood = eatsBonus ? null : current.bonusFood

  if (eatsFood) {
    const occupiedForFood = bonusFood ? [...snake, bonusFood] : snake
    const nextFood = spawnFood(occupiedForFood, 'normal', now)

    if (!nextFood) {
      return finishRun({
        ...current,
        combo,
        direction,
        food,
        foodsEaten,
        highScore,
        lastFoodAt: now,
        moveDelay: speed.moveDelay,
        particles,
        queuedDirection: null,
        score,
        scorePopups,
        snake,
        speedLevel: speed.speedLevel,
      })
    }

    food = nextFood

    if (!bonusFood && Math.random() < BONUS_FOOD_CHANCE) {
      bonusFood = spawnFood([...snake, food], 'bonus', now)
    }
  }

  return {
    ...current,
    bonusFood,
    combo,
    direction,
    food,
    foodsEaten,
    highScore,
    lastFoodAt: now,
    moveDelay: speed.moveDelay,
    particles,
    queuedDirection: null,
    score,
    scorePopups,
    snake,
    speedLevel: speed.speedLevel,
  }
}

const snakeReducer = (state: SnakeGameState, action: SnakeAction): SnakeGameState => {
  switch (action.type) {
    case 'changeDirection': {
      if (state.status !== 'playing') {
        return state
      }

      const activeDirection = state.queuedDirection ?? state.direction

      if (oppositeDirections[activeDirection] === action.direction) {
        return state
      }

      return { ...state, queuedDirection: action.direction }
    }
    case 'newRun':
      return createInitialState(state.difficulty, state.gameMode, state.highScore, 'idle')
    case 'pause':
      return state.status === 'playing' ? { ...state, status: 'paused' } : state
    case 'restart':
      return createInitialState(state.difficulty, state.gameMode, state.highScore, 'playing')
    case 'resume':
      return state.status === 'paused' ? { ...state, status: 'playing' } : state
    case 'setDifficulty': {
      if (state.status === 'idle' || state.status === 'gameOver') {
        return createInitialState(action.difficulty, state.gameMode, state.highScore, 'idle')
      }

      const speed = getSpeed(action.difficulty, state.foodsEaten)

      return {
        ...state,
        difficulty: action.difficulty,
        moveDelay: speed.moveDelay,
        speedLevel: speed.speedLevel,
      }
    }
    case 'setMode':
      if (state.status === 'idle' || state.status === 'gameOver') {
        return createInitialState(state.difficulty, action.gameMode, state.highScore, 'idle')
      }

      return { ...state, gameMode: action.gameMode }
    case 'start':
      return createInitialState(state.difficulty, state.gameMode, state.highScore, 'playing')
    case 'tick':
      return state.status === 'playing' ? advanceSnake(state, action.now) : state
    case 'togglePause':
      if (state.status === 'playing') {
        return { ...state, status: 'paused' }
      }

      if (state.status === 'paused') {
        return { ...state, status: 'playing' }
      }

      return state
    default:
      return state
  }
}

const keyDirectionMap: Record<string, Direction | undefined> = {
  a: 'left',
  down: 'down',
  left: 'left',
  arrowdown: 'down',
  arrowleft: 'left',
  arrowright: 'right',
  arrowup: 'up',
  d: 'right',
  right: 'right',
  s: 'down',
  up: 'up',
  w: 'up',
}

export function useSnakeGame() {
  const [state, dispatch] = useReducer(snakeReducer, undefined, () => {
    const setup = readStoredSetup()

    return createInitialState(setup.difficulty, setup.gameMode, setup.highScore)
  })

  useEffect(() => {
    if (state.status !== 'playing') {
      return undefined
    }

    const interval = window.setInterval(() => {
      dispatch({ now: Date.now(), type: 'tick' })
    }, state.moveDelay)

    return () => window.clearInterval(interval)
  }, [state.moveDelay, state.status])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()
      const direction = keyDirectionMap[key]

      if (direction) {
        if (state.status === 'playing') {
          event.preventDefault()
          dispatch({ direction, type: 'changeDirection' })
        }

        return
      }

      if (event.code === 'Space' || key === 'p') {
        if (state.status === 'playing' || state.status === 'paused') {
          event.preventDefault()
          dispatch({ type: 'togglePause' })
        }
      }

      if (key === 'escape' && state.status === 'playing') {
        event.preventDefault()
        dispatch({ type: 'pause' })
      }

      if (key === 'r' && state.status !== 'idle') {
        event.preventDefault()
        dispatch({ type: 'restart' })
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [state.status])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(HIGH_SCORE_KEY, state.highScore.toString())
  }, [state.highScore])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify({
        difficulty: state.difficulty,
        gameMode: state.gameMode,
      }),
    )
  }, [state.difficulty, state.gameMode])

  const actions = useMemo(
    () => ({
      changeDirection: (direction: Direction) =>
        dispatch({ direction, type: 'changeDirection' }),
      newRun: () => dispatch({ type: 'newRun' }),
      pause: () => dispatch({ type: 'pause' }),
      restart: () => dispatch({ type: 'restart' }),
      resume: () => dispatch({ type: 'resume' }),
      setDifficulty: (difficulty: Difficulty) =>
        dispatch({ difficulty, type: 'setDifficulty' }),
      setMode: (gameMode: GameMode) => dispatch({ gameMode, type: 'setMode' }),
      start: () => dispatch({ type: 'start' }),
      togglePause: () => dispatch({ type: 'togglePause' }),
    }),
    [],
  )

  return {
    ...state,
    actions,
  }
}
