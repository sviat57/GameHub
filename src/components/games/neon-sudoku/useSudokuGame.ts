import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type {
  BestTimes,
  Board,
  Difficulty,
  GameStatus,
  InputMode,
  MarkMode,
  NumericBoard,
  Position,
} from './types'
import {
  DIGITS,
  SIZE,
  boardToNumbers,
  buildCells,
  cloneBoard,
  difficultyConfig,
  formatTime,
  generatePuzzle,
  getCandidates,
  getCellKey,
  getConflictingCellKeys,
  getFilledCount,
  getPeerPositions,
  isBoardSolved,
} from './sudokuUtils'

type GameData = {
  puzzle: NumericBoard
  solution: NumericBoard
  board: Board
}

const STORAGE_KEYS = {
  bestTimes: 'neon-sudoku:best-times',
  difficulty: 'neon-sudoku:last-difficulty',
  inputMode: 'neon-sudoku:input-mode',
  mistakeChecking: 'neon-sudoku:mistake-checking',
}

const isDifficulty = (value: string | null): value is Difficulty =>
  value === 'Easy' || value === 'Medium' || value === 'Hard' || value === 'Expert'

const isInputMode = (value: string | null): value is InputMode =>
  value === 'normal' || value === 'quick'

const loadBestTimes = (): BestTimes => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.bestTimes)
    return raw ? (JSON.parse(raw) as BestTimes) : {}
  } catch {
    return {}
  }
}

const loadDifficulty = (): Difficulty => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.difficulty)
    return isDifficulty(saved) ? saved : 'Medium'
  } catch {
    return 'Medium'
  }
}

const loadInputMode = (): InputMode => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.inputMode)
    return isInputMode(saved) ? saved : 'normal'
  } catch {
    return 'normal'
  }
}

const loadMistakeChecking = () => {
  try {
    return localStorage.getItem(STORAGE_KEYS.mistakeChecking) !== 'off'
  } catch {
    return true
  }
}

const createGameData = (difficulty: Difficulty): GameData => {
  const { puzzle, solution } = generatePuzzle(difficulty)

  return {
    puzzle,
    solution,
    board: buildCells(puzzle, solution),
  }
}

const removePeerNotes = (board: Board, row: number, col: number, value: number) => {
  for (const peer of getPeerPositions(row, col)) {
    const peerCell = board[peer.row][peer.col]

    if (peerCell.given || peerCell.value !== null) {
      continue
    }

    peerCell.notes = peerCell.notes.filter((note) => note !== value)
  }
}

export function useSudokuGame() {
  const [difficulty, setDifficulty] = useState<Difficulty>(() => loadDifficulty())
  const [game, setGame] = useState<GameData>(() => createGameData(loadDifficulty()))
  const [status, setStatus] = useState<GameStatus>('playing')
  const [selected, setSelected] = useState<Position | null>({ row: 0, col: 0 })
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null)
  const [inputMode, setInputMode] = useState<InputMode>(() => loadInputMode())
  const [markMode, setMarkMode] = useState<MarkMode>('pen')
  const [mistakeChecking, setMistakeChecking] = useState(() => loadMistakeChecking())
  const [elapsed, setElapsed] = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [lastHint, setLastHint] = useState<Position | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [bestTimes, setBestTimes] = useState<BestTimes>(() => loadBestTimes())
  const feedbackTimer = useRef<number | null>(null)

  const showFeedback = useCallback((message: string) => {
    setFeedback(message)

    if (feedbackTimer.current) {
      window.clearTimeout(feedbackTimer.current)
    }

    feedbackTimer.current = window.setTimeout(() => {
      setFeedback(null)
    }, 1700)
  }, [])

  useEffect(() => {
    return () => {
      if (feedbackTimer.current) {
        window.clearTimeout(feedbackTimer.current)
      }
    }
  }, [])

  useEffect(() => {
    if (status !== 'playing') {
      return undefined
    }

    const timer = window.setInterval(() => {
      setElapsed((current) => current + 1)
    }, 1000)

    return () => window.clearInterval(timer)
  }, [status])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.difficulty, difficulty)
    } catch {
      return
    }
  }, [difficulty])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.inputMode, inputMode)
    } catch {
      return
    }
  }, [inputMode])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.mistakeChecking, mistakeChecking ? 'on' : 'off')
    } catch {
      return
    }
  }, [mistakeChecking])

  const completeIfSolved = useCallback(
    (board: Board) => {
      if (!isBoardSolved(board)) {
        return
      }

      setStatus('completed')
      showFeedback('Puzzle solved')

      setBestTimes((current) => {
        const currentBest = current[difficulty]

        if (currentBest && currentBest <= elapsed) {
          return current
        }

        const next = { ...current, [difficulty]: elapsed }

        try {
          localStorage.setItem(STORAGE_KEYS.bestTimes, JSON.stringify(next))
        } catch {
          return next
        }

        return next
      })
    },
    [difficulty, elapsed, showFeedback],
  )

  const newGame = useCallback(
    (nextDifficulty = difficulty) => {
      setDifficulty(nextDifficulty)
      setGame(createGameData(nextDifficulty))
      setStatus('playing')
      setSelected({ row: 0, col: 0 })
      setSelectedNumber(null)
      setMarkMode('pen')
      setElapsed(0)
      setMistakes(0)
      setHintsUsed(0)
      setLastHint(null)
      showFeedback(`${nextDifficulty} puzzle generated`)
    },
    [difficulty, showFeedback],
  )

  const restartPuzzle = useCallback(() => {
    setGame((current) => ({
      ...current,
      board: buildCells(current.puzzle, current.solution),
    }))
    setStatus('playing')
    setSelected({ row: 0, col: 0 })
    setSelectedNumber(null)
    setMarkMode('pen')
    setElapsed(0)
    setMistakes(0)
    setHintsUsed(0)
    setLastHint(null)
    showFeedback('Puzzle restarted')
  }, [showFeedback])

  const pause = useCallback(() => {
    if (status === 'completed') {
      return
    }

    setStatus('paused')
  }, [status])

  const resume = useCallback(() => {
    if (status === 'paused') {
      setStatus('playing')
    }
  }, [status])

  const togglePause = useCallback(() => {
    if (status === 'completed') {
      return
    }

    setStatus((current) => (current === 'paused' ? 'playing' : 'paused'))
  }, [status])

  const applyNumberToCell = useCallback(
    (row: number, col: number, value: number) => {
      if (status !== 'playing') {
        return
      }

      const cell = game.board[row]?.[col]

      if (!cell) {
        return
      }

      if (cell.given || cell.isHint) {
        showFeedback('That clue is locked')
        return
      }

      const updated = cloneBoard(game.board)
      const target = updated[row][col]

      if (markMode === 'pencil') {
        if (target.value !== null) {
          showFeedback('Erase the value before adding notes')
          return
        }

        target.notes = target.notes.includes(value)
          ? target.notes.filter((note) => note !== value)
          : [...target.notes, value].sort((a, b) => a - b)

        setGame({ ...game, board: updated })
        return
      }

      const isDifferentValue = target.value !== value
      target.value = value
      target.notes = []

      if (value === target.solution) {
        removePeerNotes(updated, row, col, value)
      } else if (isDifferentValue) {
        setMistakes((current) => current + 1)
      }

      setSelectedNumber(value)
      setGame({ ...game, board: updated })
      completeIfSolved(updated)
    },
    [completeIfSolved, game, markMode, showFeedback, status],
  )

  const handleNumberInput = useCallback(
    (value: number) => {
      if (status !== 'playing') {
        return
      }

      setSelectedNumber(value)

      if (inputMode === 'quick') {
        return
      }

      if (!selected) {
        showFeedback('Select a cell first')
        return
      }

      applyNumberToCell(selected.row, selected.col, value)
    },
    [applyNumberToCell, inputMode, selected, showFeedback, status],
  )

  const selectCell = useCallback(
    (row: number, col: number) => {
      if (status !== 'playing') {
        return
      }

      setSelected({ row, col })

      if (inputMode === 'quick' && selectedNumber !== null) {
        applyNumberToCell(row, col, selectedNumber)
      }
    },
    [applyNumberToCell, inputMode, selectedNumber, status],
  )

  const eraseCell = useCallback(
    (row: number, col: number) => {
      if (status !== 'playing') {
        return
      }

      const cell = game.board[row]?.[col]

      if (!cell) {
        return
      }

      if (cell.given || cell.isHint) {
        showFeedback('That clue is locked')
        return
      }

      const updated = cloneBoard(game.board)
      updated[row][col] = {
        ...updated[row][col],
        value: null,
        notes: [],
        isHint: false,
      }

      setGame({ ...game, board: updated })
    },
    [game, showFeedback, status],
  )

  const eraseSelected = useCallback(() => {
    if (!selected) {
      return
    }

    eraseCell(selected.row, selected.col)
  }, [eraseCell, selected])

  const autoNotes = useCallback(() => {
    if (status !== 'playing') {
      return
    }

    const numericBoard = boardToNumbers(game.board)
    const updated = cloneBoard(game.board)
    let filledCells = 0

    for (let row = 0; row < SIZE; row += 1) {
      for (let col = 0; col < SIZE; col += 1) {
        const cell = updated[row][col]

        if (cell.given || cell.value !== null) {
          continue
        }

        cell.notes = getCandidates(numericBoard, row, col)
        filledCells += 1
      }
    }

    setGame({ ...game, board: updated })
    showFeedback(filledCells ? 'Auto notes updated' : 'No empty cells to annotate')
  }, [game, showFeedback, status])

  const requestHint = useCallback(() => {
    if (status !== 'playing') {
      return
    }

    const maxHints = difficultyConfig[difficulty].hints

    if (hintsUsed >= maxHints) {
      showFeedback('No hints left for this difficulty')
      return
    }

    const selectedCell = selected ? game.board[selected.row]?.[selected.col] : null
    const emptyCells = game.board.flat().filter((cell) => cell.value === null)
    const target =
      selectedCell && selectedCell.value === null && !selectedCell.given
        ? selectedCell
        : emptyCells[Math.floor(Math.random() * emptyCells.length)]

    if (!target) {
      showFeedback('No empty cells left')
      return
    }

    const updated = cloneBoard(game.board)
    const hintCell = updated[target.row][target.col]
    hintCell.value = hintCell.solution
    hintCell.notes = []
    hintCell.isHint = true
    removePeerNotes(updated, target.row, target.col, hintCell.value)

    setGame({ ...game, board: updated })
    setSelected({ row: target.row, col: target.col })
    setSelectedNumber(hintCell.value)
    setHintsUsed((current) => current + 1)
    setLastHint({ row: target.row, col: target.col })
    showFeedback('Hint placed')
    completeIfSolved(updated)
  }, [completeIfSolved, difficulty, game, hintsUsed, selected, showFeedback, status])

  const moveSelection = useCallback(
    (rowDelta: number, colDelta: number) => {
      if (status !== 'playing') {
        return
      }

      setSelected((current) => {
        const origin = current ?? { row: 0, col: 0 }

        return {
          row: (origin.row + rowDelta + SIZE) % SIZE,
          col: (origin.col + colDelta + SIZE) % SIZE,
        }
      })
    },
    [status],
  )

  const toggleMarkMode = useCallback(() => {
    if (status !== 'playing') {
      return
    }

    setMarkMode((current) => (current === 'pen' ? 'pencil' : 'pen'))
  }, [status])

  const toggleInputMode = useCallback(() => {
    if (status !== 'playing') {
      return
    }

    setInputMode((current) => (current === 'normal' ? 'quick' : 'normal'))
  }, [status])

  const toggleMistakeChecking = useCallback(() => {
    setMistakeChecking((current) => !current)
  }, [])

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null

      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
        return
      }

      const key = event.key.toLowerCase()
      const shouldPreventScroll =
        status === 'playing' || status === 'paused'
          ? ['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(key)
          : false

      if (shouldPreventScroll) {
        event.preventDefault()
      }

      if (key >= '1' && key <= '9') {
        handleNumberInput(Number(key))
        return
      }

      if (key === 'backspace' || key === 'delete' || key === '0') {
        event.preventDefault()
        eraseSelected()
        return
      }

      if (key === 'arrowup') {
        moveSelection(-1, 0)
        return
      }

      if (key === 'arrowdown') {
        moveSelection(1, 0)
        return
      }

      if (key === 'arrowleft') {
        moveSelection(0, -1)
        return
      }

      if (key === 'arrowright') {
        moveSelection(0, 1)
        return
      }

      if (key === 'p') {
        toggleMarkMode()
        return
      }

      if (key === 'q') {
        toggleInputMode()
        return
      }

      if (key === 'n') {
        newGame()
        return
      }

      if (key === 'h') {
        requestHint()
        return
      }

      if (key === ' ' && status !== 'completed') {
        togglePause()
        return
      }

      if (key === 'escape') {
        event.preventDefault()

        if (status === 'paused') {
          resume()
          return
        }

        if (selected) {
          setSelected(null)
          return
        }

        pause()
      }
    },
    [
      eraseSelected,
      handleNumberInput,
      moveSelection,
      newGame,
      pause,
      requestHint,
      resume,
      selected,
      status,
      toggleInputMode,
      toggleMarkMode,
      togglePause,
    ],
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const conflictKeys = useMemo(
    () => (mistakeChecking ? getConflictingCellKeys(game.board) : new Set<string>()),
    [game.board, mistakeChecking],
  )

  const numberCounts = useMemo(() => {
    const counts = DIGITS.reduce<Record<number, number>>((current, value) => {
      current[value] = 0
      return current
    }, {})

    for (const row of game.board) {
      for (const cell of row) {
        if (cell.value !== null) {
          counts[cell.value] += 1
        }
      }
    }

    return counts
  }, [game.board])

  const filledCount = useMemo(() => getFilledCount(game.board), [game.board])
  const remainingHints = Math.max(difficultyConfig[difficulty].hints - hintsUsed, 0)
  const formattedTime = formatTime(elapsed)
  const bestTime = bestTimes[difficulty]

  return {
    board: game.board,
    bestTime,
    conflictKeys,
    difficulty,
    elapsed,
    feedback,
    filledCount,
    formattedTime,
    hintsUsed,
    inputMode,
    lastHint,
    markMode,
    mistakes,
    mistakeChecking,
    numberCounts,
    remainingHints,
    selected,
    selectedNumber,
    status,
    actions: {
      autoNotes,
      eraseSelected,
      handleNumberInput,
      newGame,
      pause,
      restartPuzzle,
      resume,
      selectCell,
      setDifficulty: newGame,
      setInputMode,
      setMarkMode,
      toggleInputMode,
      toggleMarkMode,
      toggleMistakeChecking,
      togglePause,
      requestHint,
    },
    labels: {
      bestTime: bestTime ? formatTime(bestTime) : '--:--',
    },
    helpers: {
      getCellKey,
    },
  }
}
