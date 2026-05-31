import { useEffect, useMemo, useReducer } from 'react'
import {
  Binary,
  Braces,
  Bug,
  Cloud,
  Code2,
  Database,
  FileCode,
  GitBranch,
  Layers,
  Server,
  Terminal,
} from 'lucide-react'
import {
  DIFFICULTIES,
  difficultyConfig,
  type BestStats,
  type CardSymbol,
  type ComboFeedback,
  type CompletedSummary,
  type Difficulty,
  type DifficultyBestStats,
  type GameStats,
  type GameStatus,
  type MemoryCard,
} from './types'

const BEST_STATS_KEY = 'code-memory:best-stats'
const LAST_DIFFICULTY_KEY = 'code-memory:last-difficulty'
const MISMATCH_DELAY_MS = 700
const FEEDBACK_TTL_MS = 900

const cardSymbols: CardSymbol[] = [
  { icon: Code2, id: 'react', label: 'React', shorthand: '<R>', tone: 'cyan' },
  { icon: Terminal, id: 'python', label: 'Python', shorthand: 'py', tone: 'mint' },
  { icon: Braces, id: 'js', label: 'JS', shorthand: 'JS', tone: 'blue' },
  { icon: FileCode, id: 'html', label: 'HTML', shorthand: 'html', tone: 'emerald' },
  { icon: Layers, id: 'css', label: 'CSS', shorthand: 'css', tone: 'cyan' },
  { icon: GitBranch, id: 'git', label: 'Git', shorthand: 'git', tone: 'mint' },
  { icon: Terminal, id: 'terminal', label: 'Terminal', shorthand: '$_', tone: 'blue' },
  { icon: Database, id: 'database', label: 'Database', shorthand: 'db', tone: 'emerald' },
  { icon: Server, id: 'api', label: 'API', shorthand: 'api', tone: 'cyan' },
  { icon: Cloud, id: 'cloud', label: 'Cloud', shorthand: 'io', tone: 'blue' },
  { icon: Bug, id: 'bug', label: 'Bug', shorthand: 'fix', tone: 'mint' },
  { icon: Binary, id: 'code', label: 'Code', shorthand: '01', tone: 'emerald' },
]

type CodeMemoryState = {
  attempts: number
  bestCombo: number
  bestStats: BestStats
  cards: MemoryCard[]
  checking: boolean
  combo: number
  completedSummary: CompletedSummary | null
  difficulty: Difficulty
  elapsedSeconds: number
  feedback: ComboFeedback | null
  matches: number
  moves: number
  selectedIds: string[]
  status: GameStatus
  wrongCardIds: string[]
}

type CodeMemoryAction =
  | { id: string; type: 'clearFeedback' }
  | { cardId: string; type: 'selectCard' }
  | { difficulty: Difficulty; type: 'setDifficulty' }
  | { ids: string[]; type: 'resolveMismatch' }
  | { type: 'newGame' }
  | { type: 'pause' }
  | { type: 'restart' }
  | { type: 'resume' }
  | { type: 'start' }
  | { type: 'tick' }
  | { type: 'togglePause' }

const createFeedbackId = () => `feedback-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

const isDifficulty = (value: unknown): value is Difficulty =>
  typeof value === 'string' && DIFFICULTIES.includes(value as Difficulty)

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value)

const createDefaultBestStats = (): BestStats => ({
  Easy: {
    bestAccuracy: null,
    bestCombo: null,
    bestMoves: null,
    bestTime: null,
  },
  Medium: {
    bestAccuracy: null,
    bestCombo: null,
    bestMoves: null,
    bestTime: null,
  },
  Hard: {
    bestAccuracy: null,
    bestCombo: null,
    bestMoves: null,
    bestTime: null,
  },
  Expert: {
    bestAccuracy: null,
    bestCombo: null,
    bestMoves: null,
    bestTime: null,
  },
})

const normalizeBestNumber = (value: unknown) =>
  isFiniteNumber(value) && value >= 0 ? Math.floor(value) : null

const normalizeAccuracy = (value: unknown) =>
  isFiniteNumber(value) && value >= 0 && value <= 100 ? Math.round(value) : null

const normalizeBestStats = (value: unknown): BestStats => {
  const fallback = createDefaultBestStats()

  if (!value || typeof value !== 'object') {
    return fallback
  }

  const stored = value as Partial<Record<Difficulty, Partial<DifficultyBestStats>>>

  return DIFFICULTIES.reduce<BestStats>((stats, difficulty) => {
    const current = stored[difficulty]

    stats[difficulty] = {
      bestAccuracy: normalizeAccuracy(current?.bestAccuracy),
      bestCombo: normalizeBestNumber(current?.bestCombo),
      bestMoves: normalizeBestNumber(current?.bestMoves),
      bestTime: normalizeBestNumber(current?.bestTime),
    }

    return stats
  }, fallback)
}

const readStoredSetup = () => {
  const fallback = {
    bestStats: createDefaultBestStats(),
    difficulty: 'Medium' as Difficulty,
  }

  if (typeof window === 'undefined') {
    return fallback
  }

  try {
    const rawDifficulty = window.localStorage.getItem(LAST_DIFFICULTY_KEY)
    const rawBestStats = window.localStorage.getItem(BEST_STATS_KEY)

    return {
      bestStats: rawBestStats
        ? normalizeBestStats(JSON.parse(rawBestStats))
        : fallback.bestStats,
      difficulty: isDifficulty(rawDifficulty) ? rawDifficulty : fallback.difficulty,
    }
  } catch {
    return fallback
  }
}

const shuffleCards = <T,>(items: T[]) => {
  const shuffled = [...items]

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    const current = shuffled[index]

    shuffled[index] = shuffled[swapIndex]
    shuffled[swapIndex] = current
  }

  return shuffled
}

const createDeck = (difficulty: Difficulty): MemoryCard[] => {
  const symbols = cardSymbols.slice(0, difficultyConfig[difficulty].pairs)
  const seed = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const cards = symbols.flatMap((symbol) =>
    [0, 1].map((copy) => ({
      icon: symbol.icon,
      id: `${symbol.id}-${copy}-${seed}`,
      isFlipped: false,
      isMatched: false,
      label: symbol.label,
      pairId: symbol.id,
      shorthand: symbol.shorthand,
      tone: symbol.tone,
    })),
  )

  return shuffleCards(cards)
}

const calculateAccuracy = (matches: number, attempts: number) =>
  attempts === 0 ? 0 : Math.round((matches / attempts) * 100)

const updateBestStats = (
  bestStats: BestStats,
  difficulty: Difficulty,
  summary: CompletedSummary,
): BestStats => {
  const current = bestStats[difficulty]

  return {
    ...bestStats,
    [difficulty]: {
      bestAccuracy:
        current.bestAccuracy === null
          ? summary.accuracy
          : Math.max(current.bestAccuracy, summary.accuracy),
      bestCombo:
        current.bestCombo === null
          ? summary.bestCombo
          : Math.max(current.bestCombo, summary.bestCombo),
      bestMoves:
        current.bestMoves === null
          ? summary.moves
          : Math.min(current.bestMoves, summary.moves),
      bestTime:
        current.bestTime === null
          ? summary.elapsedSeconds
          : Math.min(current.bestTime, summary.elapsedSeconds),
    },
  }
}

const createInitialState = (
  difficulty: Difficulty,
  bestStats: BestStats,
  status: GameStatus = 'idle',
): CodeMemoryState => ({
  attempts: 0,
  bestCombo: 0,
  bestStats,
  cards: createDeck(difficulty),
  checking: false,
  combo: 0,
  completedSummary: null,
  difficulty,
  elapsedSeconds: 0,
  feedback: null,
  matches: 0,
  moves: 0,
  selectedIds: [],
  status,
  wrongCardIds: [],
})

const codeMemoryReducer = (
  state: CodeMemoryState,
  action: CodeMemoryAction,
): CodeMemoryState => {
  switch (action.type) {
    case 'clearFeedback':
      return state.feedback?.id === action.id ? { ...state, feedback: null } : state
    case 'newGame':
      return createInitialState(state.difficulty, state.bestStats)
    case 'pause':
      return state.status === 'playing' ? { ...state, status: 'paused' } : state
    case 'restart':
      return createInitialState(state.difficulty, state.bestStats, 'playing')
    case 'resume':
      return state.status === 'paused' ? { ...state, status: 'playing' } : state
    case 'setDifficulty':
      if (state.status !== 'idle' && state.status !== 'completed') {
        return state
      }

      return createInitialState(action.difficulty, state.bestStats)
    case 'start':
      return createInitialState(state.difficulty, state.bestStats, 'playing')
    case 'tick':
      return state.status === 'playing'
        ? { ...state, elapsedSeconds: state.elapsedSeconds + 1 }
        : state
    case 'togglePause':
      if (state.status === 'playing') {
        return { ...state, status: 'paused' }
      }

      if (state.status === 'paused') {
        return { ...state, status: 'playing' }
      }

      return state
    case 'resolveMismatch': {
      const wrongIds = new Set(action.ids)

      return {
        ...state,
        cards: state.cards.map((card) =>
          wrongIds.has(card.id) && !card.isMatched
            ? { ...card, isFlipped: false }
            : card,
        ),
        checking: false,
        selectedIds: [],
        wrongCardIds: [],
      }
    }
    case 'selectCard': {
      if (state.status !== 'playing' || state.checking || state.selectedIds.length >= 2) {
        return state
      }

      const target = state.cards.find((card) => card.id === action.cardId)

      if (!target || target.isFlipped || target.isMatched) {
        return state
      }

      const cards = state.cards.map((card) =>
        card.id === action.cardId ? { ...card, isFlipped: true } : card,
      )
      const selectedIds = [...state.selectedIds, action.cardId]

      if (selectedIds.length < 2) {
        return {
          ...state,
          cards,
          selectedIds,
          wrongCardIds: [],
        }
      }

      const [firstId, secondId] = selectedIds
      const firstCard = cards.find((card) => card.id === firstId)
      const secondCard = cards.find((card) => card.id === secondId)

      if (!firstCard || !secondCard) {
        return state
      }

      const attempts = state.attempts + 1
      const moves = state.moves + 1

      if (firstCard.pairId !== secondCard.pairId) {
        return {
          ...state,
          attempts,
          cards,
          checking: true,
          combo: 0,
          moves,
          selectedIds,
          wrongCardIds: selectedIds,
        }
      }

      const combo = state.combo + 1
      const matches = state.matches + 1
      const bestCombo = Math.max(state.bestCombo, combo)
      const totalPairs = difficultyConfig[state.difficulty].pairs
      const matchedCards = cards.map((card) =>
        card.pairId === firstCard.pairId
          ? { ...card, isFlipped: true, isMatched: true }
          : card,
      )
      const accuracy = calculateAccuracy(matches, attempts)
      const completed = matches === totalPairs
      const completedSummary: CompletedSummary | null = completed
        ? {
            accuracy,
            bestCombo,
            difficulty: state.difficulty,
            elapsedSeconds: state.elapsedSeconds,
            moves,
          }
        : null
      const bestStats = completedSummary
        ? updateBestStats(state.bestStats, state.difficulty, completedSummary)
        : state.bestStats

      return {
        ...state,
        attempts,
        bestCombo,
        bestStats,
        cards: matchedCards,
        checking: false,
        combo,
        completedSummary,
        feedback: {
          id: createFeedbackId(),
          text: combo > 1 ? `COMBO x${combo}` : 'MATCH!',
          tone: combo > 1 ? 'cyan' : 'mint',
        },
        matches,
        moves,
        selectedIds: [],
        status: completed ? 'completed' : state.status,
        wrongCardIds: [],
      }
    }
    default:
      return state
  }
}

export const formatMemoryTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
    .toString()
    .padStart(2, '0')}`
}

export function useCodeMemoryGame() {
  const [state, dispatch] = useReducer(codeMemoryReducer, undefined, () => {
    const setup = readStoredSetup()

    return createInitialState(setup.difficulty, setup.bestStats)
  })

  useEffect(() => {
    if (state.status !== 'playing') {
      return undefined
    }

    const interval = window.setInterval(() => {
      dispatch({ type: 'tick' })
    }, 1_000)

    return () => window.clearInterval(interval)
  }, [state.status])

  useEffect(() => {
    if (!state.checking || state.wrongCardIds.length !== 2) {
      return undefined
    }

    const ids = state.wrongCardIds
    const timeout = window.setTimeout(() => {
      dispatch({ ids, type: 'resolveMismatch' })
    }, MISMATCH_DELAY_MS)

    return () => window.clearTimeout(timeout)
  }, [state.checking, state.wrongCardIds])

  useEffect(() => {
    if (!state.feedback) {
      return undefined
    }

    const feedbackId = state.feedback.id
    const timeout = window.setTimeout(() => {
      dispatch({ id: feedbackId, type: 'clearFeedback' })
    }, FEEDBACK_TTL_MS)

    return () => window.clearTimeout(timeout)
  }, [state.feedback])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()

      if (key === 'escape' && (state.status === 'playing' || state.status === 'paused')) {
        event.preventDefault()
        dispatch({ type: 'togglePause' })
      }

      if (key === 'r' && state.status !== 'idle') {
        event.preventDefault()
        dispatch({ type: 'restart' })
      }

      if (key === 'n') {
        event.preventDefault()
        dispatch({ type: 'newGame' })
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [state.status])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(BEST_STATS_KEY, JSON.stringify(state.bestStats))
  }, [state.bestStats])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(LAST_DIFFICULTY_KEY, state.difficulty)
  }, [state.difficulty])

  const stats = useMemo<GameStats>(
    () => ({
      accuracy: calculateAccuracy(state.matches, state.attempts),
      attempts: state.attempts,
      bestCombo: state.bestCombo,
      combo: state.combo,
      elapsedSeconds: state.elapsedSeconds,
      matches: state.matches,
      moves: state.moves,
      totalPairs: difficultyConfig[state.difficulty].pairs,
    }),
    [
      state.attempts,
      state.bestCombo,
      state.combo,
      state.difficulty,
      state.elapsedSeconds,
      state.matches,
      state.moves,
    ],
  )

  const bestForDifficulty = state.bestStats[state.difficulty]
  const labels = useMemo(
    () => ({
      bestAccuracy:
        bestForDifficulty.bestAccuracy === null
          ? '--'
          : `${bestForDifficulty.bestAccuracy}%`,
      bestMoves:
        bestForDifficulty.bestMoves === null
          ? '--'
          : bestForDifficulty.bestMoves.toString(),
      bestTime:
        bestForDifficulty.bestTime === null
          ? '--'
          : formatMemoryTime(bestForDifficulty.bestTime),
      formattedTime: formatMemoryTime(state.elapsedSeconds),
    }),
    [
      bestForDifficulty.bestAccuracy,
      bestForDifficulty.bestMoves,
      bestForDifficulty.bestTime,
      state.elapsedSeconds,
    ],
  )

  const actions = useMemo(
    () => ({
      newGame: () => dispatch({ type: 'newGame' }),
      pause: () => dispatch({ type: 'pause' }),
      restart: () => dispatch({ type: 'restart' }),
      resume: () => dispatch({ type: 'resume' }),
      selectCard: (cardId: string) => dispatch({ cardId, type: 'selectCard' }),
      setDifficulty: (difficulty: Difficulty) =>
        dispatch({ difficulty, type: 'setDifficulty' }),
      start: () => dispatch({ type: 'start' }),
      togglePause: () => dispatch({ type: 'togglePause' }),
    }),
    [],
  )

  return {
    ...state,
    actions,
    bestForDifficulty,
    labels,
    stats,
  }
}
