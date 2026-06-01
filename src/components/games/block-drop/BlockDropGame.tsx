import { motion } from 'framer-motion'
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Blocks,
  Gauge,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Trophy,
  Zap,
} from 'lucide-react'
import { useEffect, useMemo, useReducer } from 'react'
import { Link } from 'react-router-dom'
import { getGameById } from '../../../data/games'
import { BackToGames } from '../../shared/BackToGames'
import { GameBadge } from '../../shared/GameBadge'
import { GameDetailsPanel } from '../../shared/GameDetailsPanel'
import { GlassPanel } from '../../shared/GlassPanel'

const BOARD_WIDTH = 10
const BOARD_HEIGHT = 20
const HIGH_SCORE_KEY = 'block-drop:high-score'

type CellColor = string | null
type Board = CellColor[][]
type Matrix = number[][]
type GameStatus = 'ready' | 'playing' | 'paused' | 'gameOver'
type PieceKey = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z'

type Piece = {
  id: PieceKey
  matrix: Matrix
  color: string
  row: number
  col: number
}

type BlockDropState = {
  board: Board
  current: Piece
  highScore: number
  lastClear: number
  level: number
  lines: number
  next: Piece
  score: number
  status: GameStatus
}

type BlockDropAction =
  | { type: 'hardDrop' }
  | { type: 'move'; colDelta: number; rowDelta: number; scoreSoftDrop?: boolean }
  | { type: 'pause' }
  | { type: 'restart' }
  | { type: 'resume' }
  | { type: 'rotate' }
  | { type: 'start' }
  | { type: 'tick' }
  | { type: 'togglePause' }

const pieces: Record<PieceKey, { color: string; matrix: Matrix }> = {
  I: {
    color: '#67e8f9',
    matrix: [[1, 1, 1, 1]],
  },
  J: {
    color: '#93c5fd',
    matrix: [
      [1, 0, 0],
      [1, 1, 1],
    ],
  },
  L: {
    color: '#f0abfc',
    matrix: [
      [0, 0, 1],
      [1, 1, 1],
    ],
  },
  O: {
    color: '#fef08a',
    matrix: [
      [1, 1],
      [1, 1],
    ],
  },
  S: {
    color: '#5ed29c',
    matrix: [
      [0, 1, 1],
      [1, 1, 0],
    ],
  },
  T: {
    color: '#c4b5fd',
    matrix: [
      [0, 1, 0],
      [1, 1, 1],
    ],
  },
  Z: {
    color: '#fb7185',
    matrix: [
      [1, 1, 0],
      [0, 1, 1],
    ],
  },
}

const pieceKeys = Object.keys(pieces) as PieceKey[]

const createBoard = (): Board =>
  Array.from({ length: BOARD_HEIGHT }, () =>
    Array.from({ length: BOARD_WIDTH }, () => null),
  )

const createPiece = (): Piece => {
  const id = pieceKeys[Math.floor(Math.random() * pieceKeys.length)]
  const piece = pieces[id]

  return {
    id,
    matrix: piece.matrix,
    color: piece.color,
    row: 0,
    col: Math.floor((BOARD_WIDTH - piece.matrix[0].length) / 2),
  }
}

const readHighScore = () => {
  if (typeof window === 'undefined') {
    return 0
  }

  try {
    const saved = window.localStorage.getItem(HIGH_SCORE_KEY)
    const parsed = saved ? Number(saved) : 0

    return Number.isFinite(parsed) ? Math.max(0, Math.floor(parsed)) : 0
  } catch {
    return 0
  }
}

const createInitialState = (highScore: number, status: GameStatus = 'ready') => ({
  board: createBoard(),
  current: createPiece(),
  highScore,
  lastClear: 0,
  level: 1,
  lines: 0,
  next: createPiece(),
  score: 0,
  status,
})

const rotateMatrix = (matrix: Matrix): Matrix =>
  matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]).reverse())

const collides = (
  board: Board,
  piece: Piece,
  row = piece.row,
  col = piece.col,
  matrix = piece.matrix,
) => {
  for (let y = 0; y < matrix.length; y += 1) {
    for (let x = 0; x < matrix[y].length; x += 1) {
      if (!matrix[y][x]) {
        continue
      }

      const boardRow = row + y
      const boardCol = col + x

      if (boardCol < 0 || boardCol >= BOARD_WIDTH || boardRow >= BOARD_HEIGHT) {
        return true
      }

      if (boardRow >= 0 && board[boardRow][boardCol]) {
        return true
      }
    }
  }

  return false
}

const mergePiece = (board: Board, piece: Piece): Board => {
  const nextBoard = board.map((row) => [...row])

  for (let y = 0; y < piece.matrix.length; y += 1) {
    for (let x = 0; x < piece.matrix[y].length; x += 1) {
      if (!piece.matrix[y][x]) {
        continue
      }

      const boardRow = piece.row + y
      const boardCol = piece.col + x

      if (boardRow >= 0) {
        nextBoard[boardRow][boardCol] = piece.color
      }
    }
  }

  return nextBoard
}

const clearRows = (board: Board) => {
  const remainingRows = board.filter((row) => row.some((cell) => !cell))
  const linesCleared = BOARD_HEIGHT - remainingRows.length
  const emptyRows = Array.from({ length: linesCleared }, () =>
    Array.from({ length: BOARD_WIDTH }, () => null),
  )

  return {
    board: [...emptyRows, ...remainingRows],
    linesCleared,
  }
}

const getLineScore = (linesCleared: number, level: number) => {
  const scores = [0, 100, 300, 500, 800]

  return (scores[linesCleared] ?? 0) * level
}

const getDropInterval = (level: number) => Math.max(90, 760 - (level - 1) * 55)

const getGhostRow = (board: Board, piece: Piece) => {
  let row = piece.row

  while (!collides(board, piece, row + 1, piece.col, piece.matrix)) {
    row += 1
  }

  return row
}

const centerPiece = (piece: Piece): Piece => ({
  ...piece,
  row: 0,
  col: Math.floor((BOARD_WIDTH - piece.matrix[0].length) / 2),
})

const lockPiece = (state: BlockDropState, scoreBonus = 0): BlockDropState => {
  const mergedBoard = mergePiece(state.board, state.current)
  const { board, linesCleared } = clearRows(mergedBoard)
  const lines = state.lines + linesCleared
  const level = Math.floor(lines / 10) + 1
  const score = state.score + getLineScore(linesCleared, state.level) + scoreBonus
  const highScore = Math.max(state.highScore, score)
  const current = centerPiece(state.next)
  const next = createPiece()
  const status = collides(board, current) ? 'gameOver' : state.status

  return {
    ...state,
    board,
    current,
    highScore,
    lastClear: linesCleared,
    level,
    lines,
    next,
    score,
    status,
  }
}

const blockDropReducer = (
  state: BlockDropState,
  action: BlockDropAction,
): BlockDropState => {
  switch (action.type) {
    case 'start':
      return createInitialState(state.highScore, 'playing')
    case 'restart':
      return createInitialState(state.highScore, 'playing')
    case 'pause':
      return state.status === 'playing' ? { ...state, status: 'paused' } : state
    case 'resume':
      return state.status === 'paused' ? { ...state, status: 'playing' } : state
    case 'togglePause':
      if (state.status === 'playing') {
        return { ...state, status: 'paused' }
      }

      if (state.status === 'paused') {
        return { ...state, status: 'playing' }
      }

      return state
    case 'move': {
      if (state.status !== 'playing') {
        return state
      }

      const nextRow = state.current.row + action.rowDelta
      const nextCol = state.current.col + action.colDelta

      if (!collides(state.board, state.current, nextRow, nextCol)) {
        return {
          ...state,
          current: { ...state.current, col: nextCol, row: nextRow },
          score:
            action.scoreSoftDrop && action.rowDelta > 0
              ? state.score + 1
              : state.score,
        }
      }

      if (action.rowDelta > 0) {
        return lockPiece(state)
      }

      return state
    }
    case 'tick':
      return blockDropReducer(state, { colDelta: 0, rowDelta: 1, type: 'move' })
    case 'rotate': {
      if (state.status !== 'playing') {
        return state
      }

      const rotated = rotateMatrix(state.current.matrix)
      const kicks = [0, -1, 1, -2, 2]
      const validKick = kicks.find(
        (kick) =>
          !collides(
            state.board,
            state.current,
            state.current.row,
            state.current.col + kick,
            rotated,
          ),
      )

      if (validKick === undefined) {
        return state
      }

      return {
        ...state,
        current: {
          ...state.current,
          col: state.current.col + validKick,
          matrix: rotated,
        },
      }
    }
    case 'hardDrop': {
      if (state.status !== 'playing') {
        return state
      }

      const ghostRow = getGhostRow(state.board, state.current)
      const distance = ghostRow - state.current.row

      return lockPiece(
        {
          ...state,
          current: { ...state.current, row: ghostRow },
        },
        Math.max(0, distance * 2),
      )
    }
    default:
      return state
  }
}

const getRenderedCells = (board: Board, piece: Piece) => {
  const rendered = board.map((row) =>
    row.map((color) => ({ color, ghost: false, active: false })),
  )
  const ghostRow = getGhostRow(board, piece)

  for (let y = 0; y < piece.matrix.length; y += 1) {
    for (let x = 0; x < piece.matrix[y].length; x += 1) {
      if (!piece.matrix[y][x]) {
        continue
      }

      const ghostBoardRow = ghostRow + y
      const boardCol = piece.col + x
      const activeBoardRow = piece.row + y

      if (ghostBoardRow >= 0 && !rendered[ghostBoardRow][boardCol].color) {
        rendered[ghostBoardRow][boardCol] = {
          color: piece.color,
          ghost: true,
          active: false,
        }
      }

      if (activeBoardRow >= 0) {
        rendered[activeBoardRow][boardCol] = {
          color: piece.color,
          ghost: false,
          active: true,
        }
      }
    }
  }

  return rendered.flat()
}

function useBlockDropGame() {
  const [state, dispatch] = useReducer(blockDropReducer, undefined, () =>
    createInitialState(readHighScore()),
  )
  const dropInterval = getDropInterval(state.level)

  useEffect(() => {
    if (state.status !== 'playing') {
      return undefined
    }

    const interval = window.setInterval(() => {
      dispatch({ type: 'tick' })
    }, dropInterval)

    return () => window.clearInterval(interval)
  }, [dropInterval, state.status])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    try {
      window.localStorage.setItem(HIGH_SCORE_KEY, state.highScore.toString())
    } catch {
      return
    }
  }, [state.highScore])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null

      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
        return
      }

      const key = event.key.toLowerCase()
      const scrollKeys = ['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' ']

      if (scrollKeys.includes(key)) {
        event.preventDefault()
      }

      if (key === 'enter' && state.status === 'ready') {
        dispatch({ type: 'start' })
        return
      }

      if (key === 'arrowleft' || key === 'a') {
        dispatch({ colDelta: -1, rowDelta: 0, type: 'move' })
        return
      }

      if (key === 'arrowright' || key === 'd') {
        dispatch({ colDelta: 1, rowDelta: 0, type: 'move' })
        return
      }

      if (key === 'arrowdown' || key === 's') {
        dispatch({ colDelta: 0, rowDelta: 1, scoreSoftDrop: true, type: 'move' })
        return
      }

      if (key === 'arrowup' || key === 'w' || key === 'x') {
        dispatch({ type: 'rotate' })
        return
      }

      if (key === ' ') {
        dispatch({ type: 'hardDrop' })
        return
      }

      if (key === 'p' || key === 'escape') {
        dispatch({ type: 'togglePause' })
        return
      }

      if (key === 'r') {
        dispatch({ type: 'restart' })
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [state.status])

  const actions = useMemo(
    () => ({
      hardDrop: () => dispatch({ type: 'hardDrop' }),
      moveDown: () =>
        dispatch({ colDelta: 0, rowDelta: 1, scoreSoftDrop: true, type: 'move' }),
      moveLeft: () => dispatch({ colDelta: -1, rowDelta: 0, type: 'move' }),
      moveRight: () => dispatch({ colDelta: 1, rowDelta: 0, type: 'move' }),
      restart: () => dispatch({ type: 'restart' }),
      rotate: () => dispatch({ type: 'rotate' }),
      start: () => dispatch({ type: 'start' }),
      togglePause: () => dispatch({ type: 'togglePause' }),
    }),
    [],
  )

  return {
    ...state,
    actions,
    dropInterval,
  }
}

function BlockDropBoard({ state }: { state: BlockDropState }) {
  const cells = getRenderedCells(state.board, state.current)
  const softened = state.status === 'ready' || state.status === 'paused'

  return (
    <div className="relative mx-auto w-full max-w-[390px]">
      <div className="relative rounded-lg border border-arcade-mint/30 bg-white/[0.035] p-2 shadow-[0_0_76px_rgba(94,210,156,0.17)] backdrop-blur-xl sm:p-3">
        <div className="absolute -inset-7 -z-10 rounded-[34px] bg-[radial-gradient(circle_at_50%_50%,rgba(94,210,156,0.18),transparent_58%)] blur-2xl" />
        <div
          className={`grid aspect-[10/20] overflow-hidden rounded-md border-2 border-cyan-200/28 bg-arcade-ink/90 shadow-[inset_0_0_36px_rgba(34,211,238,0.11)] transition duration-300 ${
            softened ? 'blur-[2px]' : ''
          }`}
          role="grid"
          aria-label="Block Drop board"
          style={{
            gridTemplateColumns: `repeat(${BOARD_WIDTH}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${BOARD_HEIGHT}, minmax(0, 1fr))`,
          }}
        >
          {cells.map((cell, index) => (
            <span
              key={index}
              className="border border-white/[0.035]"
              style={{
                background: cell.color
                  ? cell.ghost
                    ? 'transparent'
                    : cell.color
                  : 'rgba(255,255,255,0.018)',
                boxShadow: cell.active
                  ? `inset 0 0 0 1px rgba(255,255,255,0.52), 0 0 16px ${cell.color}`
                  : cell.color && !cell.ghost
                    ? `inset 0 0 0 1px rgba(255,255,255,0.22), 0 0 10px ${cell.color}44`
                    : cell.ghost
                      ? `inset 0 0 0 2px ${cell.color}88`
                      : undefined,
              }}
            />
          ))}
        </div>

        {state.status !== 'playing' ? (
          <div className="absolute inset-3 z-20 grid place-items-center rounded-md border border-white/10 bg-arcade-black/74 p-4 text-center backdrop-blur-md sm:inset-5">
            <div>
              <p className="font-jakarta text-[10px] font-extrabold uppercase tracking-[0.2em] text-arcade-mint">
                {state.status === 'gameOver' ? 'Run Complete' : 'Block Drop'}
              </p>
              <h2 className="mt-3 text-3xl font-extrabold text-white">
                {state.status === 'gameOver'
                  ? 'Game Over'
                  : state.status === 'paused'
                    ? 'Paused'
                    : 'Ready'}
              </h2>
              <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-white/62">
                {state.status === 'gameOver'
                  ? `Final score ${state.score.toLocaleString()}.`
                  : 'Stack pieces, clear rows and keep the well open.'}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

function PiecePreview({ piece }: { piece: Piece }) {
  return (
    <div className="grid h-24 w-24 place-items-center rounded-md border border-white/10 bg-arcade-ink/70 p-3">
      <div
        className="grid gap-1"
        style={{
          gridTemplateColumns: `repeat(${piece.matrix[0].length}, minmax(0, 1fr))`,
        }}
      >
        {piece.matrix.flat().map((cell, index) => (
          <span
            key={index}
            className="size-4 rounded-sm"
            style={{
              background: cell ? piece.color : 'transparent',
              boxShadow: cell ? `0 0 12px ${piece.color}88` : undefined,
            }}
          />
        ))}
      </div>
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Trophy
  label: string
  value: string
}) {
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.03] p-4">
      <Icon size={18} className="text-arcade-mint" strokeWidth={2.5} />
      <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.16em] text-white/42">
        {label}
      </p>
      <p className="mt-1 text-2xl font-extrabold text-white">{value}</p>
    </div>
  )
}

export function BlockDropGame() {
  const game = useBlockDropGame()
  const gameMeta = getGameById('block-drop')!
  const primaryLabel =
    game.status === 'ready'
      ? 'Start'
      : game.status === 'playing'
        ? 'Pause'
        : game.status === 'paused'
          ? 'Resume'
          : 'Restart'
  const primaryAction =
    game.status === 'ready'
      ? game.actions.start
      : game.status === 'gameOver'
        ? game.actions.restart
        : game.actions.togglePause
  const PrimaryIcon = game.status === 'playing' ? Pause : Play

  return (
    <main className="relative min-h-screen overflow-hidden px-5 pb-12 pt-24 sm:px-8 lg:px-10 lg:pb-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(rgba(94,210,156,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.045)_1px,transparent_1px)] bg-[size:42px_42px] opacity-35"
      />

      <motion.div
        className="mx-auto max-w-7xl"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <BackToGames />

        <header className="mt-7 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-arcade-mint/30 bg-arcade-mint/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-arcade-mint">
              <Blocks size={13} strokeWidth={2.6} />
              {gameMeta.type}
            </div>
            <h1 className="mt-4 text-4xl font-extrabold uppercase leading-none text-white sm:text-6xl">
              {gameMeta.name}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/68 sm:text-base">
              {gameMeta.description}
            </p>
          </div>

          {game.lastClear > 0 ? (
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200/20 bg-cyan-200/10 px-4 py-2 text-xs font-bold text-cyan-100 shadow-[0_0_26px_rgba(34,211,238,0.12)]">
              <Sparkles size={15} strokeWidth={2.5} />
              {game.lastClear === 4 ? 'Quad clear' : `${game.lastClear} line clear`}
            </div>
          ) : null}
        </header>

        <div className="mt-6">
          <GameDetailsPanel game={gameMeta} />
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-start">
          <section className="relative rounded-lg border border-white/10 bg-white/[0.026] p-3 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-5">
            <BlockDropBoard state={game} />
          </section>

          <aside className="grid gap-4">
            <GlassPanel className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-jakarta text-[10px] font-extrabold uppercase tracking-[0.18em] text-arcade-mint">
                    Control Deck
                  </p>
                  <h2 className="mt-1 text-lg font-extrabold text-white">
                    Drop Controls
                  </h2>
                </div>
                <GameBadge tone={game.status === 'playing' ? 'mint' : 'cyan'}>
                  {game.status === 'gameOver' ? 'Game Over' : game.status}
                </GameBadge>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={primaryAction}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-arcade-mint px-3 text-xs font-extrabold uppercase text-arcade-black shadow-[0_0_28px_rgba(94,210,156,0.28)] transition duration-200 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <PrimaryIcon size={16} strokeWidth={2.5} />
                  {primaryLabel}
                </button>
                <button
                  type="button"
                  onClick={game.actions.restart}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-3 text-xs font-extrabold uppercase text-white/82 transition duration-200 hover:border-arcade-mint/45 hover:bg-arcade-mint/10 hover:text-arcade-mint"
                >
                  <RotateCcw size={16} strokeWidth={2.5} />
                  Restart
                </button>
                <Link
                  to="/games"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-3 text-xs font-extrabold uppercase text-white/82 transition duration-200 hover:border-arcade-mint/45 hover:bg-arcade-mint/10 hover:text-arcade-mint"
                >
                  <ArrowLeft size={16} strokeWidth={2.5} />
                  Games
                </Link>
                <a
                  href={gameMeta.codeUrl}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-3 text-xs font-extrabold uppercase text-white/82 transition duration-200 hover:border-cyan-200/45 hover:bg-cyan-200/10 hover:text-cyan-100"
                >
                  <Zap size={16} strokeWidth={2.5} />
                  Code
                </a>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2">
                <span />
                <button
                  type="button"
                  onClick={game.actions.rotate}
                  className="inline-flex h-14 items-center justify-center rounded-md border border-white/10 bg-white/[0.045] text-white transition hover:border-arcade-mint/50 hover:text-arcade-mint"
                  aria-label="Rotate piece"
                >
                  <ArrowUp size={22} strokeWidth={2.7} />
                </button>
                <span />
                <button
                  type="button"
                  onClick={game.actions.moveLeft}
                  className="inline-flex h-14 items-center justify-center rounded-md border border-white/10 bg-white/[0.045] text-white transition hover:border-arcade-mint/50 hover:text-arcade-mint"
                  aria-label="Move piece left"
                >
                  <ArrowLeft size={22} strokeWidth={2.7} />
                </button>
                <button
                  type="button"
                  onClick={game.actions.moveDown}
                  className="inline-flex h-14 items-center justify-center rounded-md border border-white/10 bg-white/[0.045] text-white transition hover:border-arcade-mint/50 hover:text-arcade-mint"
                  aria-label="Soft drop"
                >
                  <ArrowDown size={22} strokeWidth={2.7} />
                </button>
                <button
                  type="button"
                  onClick={game.actions.moveRight}
                  className="inline-flex h-14 items-center justify-center rounded-md border border-white/10 bg-white/[0.045] text-white transition hover:border-arcade-mint/50 hover:text-arcade-mint"
                  aria-label="Move piece right"
                >
                  <ArrowRight size={22} strokeWidth={2.7} />
                </button>
              </div>

              <button
                type="button"
                onClick={game.actions.hardDrop}
                className="mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-cyan-200/20 bg-cyan-200/10 px-3 text-xs font-extrabold uppercase text-cyan-100 transition hover:border-cyan-200/45 hover:bg-cyan-200/15"
              >
                <Zap size={16} strokeWidth={2.5} />
                Hard Drop
              </button>

              <p className="mt-4 text-xs leading-5 text-white/48">
                Keyboard: arrows or WASD move, Up/W rotates, Space hard drops, P
                pauses, R restarts.
              </p>
            </GlassPanel>

            <GlassPanel className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-jakarta text-[10px] font-extrabold uppercase tracking-[0.18em] text-arcade-mint">
                    Next Piece
                  </p>
                  <p className="mt-1 text-lg font-extrabold text-white">{game.next.id}</p>
                </div>
                <PiecePreview piece={game.next} />
              </div>
            </GlassPanel>

            <div className="grid grid-cols-2 gap-3">
              <StatCard
                icon={Trophy}
                label="Score"
                value={game.score.toLocaleString()}
              />
              <StatCard
                icon={Trophy}
                label="Best"
                value={game.highScore.toLocaleString()}
              />
              <StatCard icon={Gauge} label="Level" value={game.level.toString()} />
              <StatCard icon={Blocks} label="Lines" value={game.lines.toString()} />
            </div>
          </aside>
        </div>
      </motion.div>
    </main>
  )
}
