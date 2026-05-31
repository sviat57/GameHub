import type { Board, Cell, Difficulty, DifficultyConfig, NumericBoard, Position } from './types'

export const SIZE = 9
export const BOX_SIZE = 3
export const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9]

export const difficultyConfig: Record<Difficulty, DifficultyConfig> = {
  Easy: {
    givenRange: [40, 45],
    hints: 5,
    label: 'Relaxed logic with generous starting clues.',
  },
  Medium: {
    givenRange: [34, 39],
    hints: 4,
    label: 'Balanced deduction with a tighter grid.',
  },
  Hard: {
    givenRange: [28, 33],
    hints: 3,
    label: 'Lean clues for careful candidate work.',
  },
  Expert: {
    givenRange: [24, 27],
    hints: 2,
    label: 'Minimal clues and no wasted moves.',
  },
}

const cloneNumericBoard = (board: NumericBoard): NumericBoard => board.map((row) => [...row])

const shuffle = <T,>(items: T[]): T[] => {
  const copy = [...items]

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1))
    ;[copy[index], copy[target]] = [copy[target], copy[index]]
  }

  return copy
}

const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min

export function getCellKey(row: number, col: number) {
  return `${row}-${col}`
}

export function isSameBox(a: Position, b: Position) {
  return (
    Math.floor(a.row / BOX_SIZE) === Math.floor(b.row / BOX_SIZE) &&
    Math.floor(a.col / BOX_SIZE) === Math.floor(b.col / BOX_SIZE)
  )
}

export function isValueAllowed(board: NumericBoard, row: number, col: number, value: number) {
  for (let index = 0; index < SIZE; index += 1) {
    if (index !== col && board[row][index] === value) {
      return false
    }

    if (index !== row && board[index][col] === value) {
      return false
    }
  }

  const startRow = Math.floor(row / BOX_SIZE) * BOX_SIZE
  const startCol = Math.floor(col / BOX_SIZE) * BOX_SIZE

  for (let r = startRow; r < startRow + BOX_SIZE; r += 1) {
    for (let c = startCol; c < startCol + BOX_SIZE; c += 1) {
      if ((r !== row || c !== col) && board[r][c] === value) {
        return false
      }
    }
  }

  return true
}

export function getCandidates(board: NumericBoard, row: number, col: number) {
  if (board[row][col] !== 0) {
    return []
  }

  return DIGITS.filter((value) => isValueAllowed(board, row, col, value))
}

const findBestEmptyCell = (board: NumericBoard) => {
  let best: { row: number; col: number; candidates: number[] } | null = null

  for (let row = 0; row < SIZE; row += 1) {
    for (let col = 0; col < SIZE; col += 1) {
      if (board[row][col] !== 0) {
        continue
      }

      const candidates = getCandidates(board, row, col)

      if (candidates.length === 0) {
        return { row, col, candidates }
      }

      if (!best || candidates.length < best.candidates.length) {
        best = { row, col, candidates }
      }
    }
  }

  return best
}

const hasStartingConflicts = (board: NumericBoard) => {
  for (let row = 0; row < SIZE; row += 1) {
    for (let col = 0; col < SIZE; col += 1) {
      const value = board[row][col]

      if (value === 0) {
        continue
      }

      board[row][col] = 0
      const allowed = isValueAllowed(board, row, col, value)
      board[row][col] = value

      if (!allowed) {
        return true
      }
    }
  }

  return false
}

function searchSolutions(
  board: NumericBoard,
  limit: number,
  randomize: boolean,
): { count: number; solution: NumericBoard | null } {
  const next = findBestEmptyCell(board)

  if (!next) {
    return { count: 1, solution: cloneNumericBoard(board) }
  }

  if (next.candidates.length === 0) {
    return { count: 0, solution: null }
  }

  let count = 0
  let solution: NumericBoard | null = null
  const candidates = randomize ? shuffle(next.candidates) : next.candidates

  for (const value of candidates) {
    board[next.row][next.col] = value
    const result = searchSolutions(board, limit - count, randomize)
    count += result.count
    solution = solution ?? result.solution
    board[next.row][next.col] = 0

    if (count >= limit) {
      break
    }
  }

  return { count, solution }
}

export function countSolutions(board: NumericBoard, limit = 2) {
  const workingBoard = cloneNumericBoard(board)

  if (hasStartingConflicts(workingBoard)) {
    return 0
  }

  return searchSolutions(workingBoard, limit, false).count
}

export function solveBoard(board: NumericBoard) {
  const workingBoard = cloneNumericBoard(board)

  if (hasStartingConflicts(workingBoard)) {
    return null
  }

  return searchSolutions(workingBoard, 1, false).solution
}

export function generateSolvedBoard() {
  const board: NumericBoard = Array.from({ length: SIZE }, () => Array(SIZE).fill(0))

  const fillCell = (index: number): boolean => {
    if (index >= SIZE * SIZE) {
      return true
    }

    const row = Math.floor(index / SIZE)
    const col = index % SIZE

    for (const value of shuffle(DIGITS)) {
      if (!isValueAllowed(board, row, col, value)) {
        continue
      }

      board[row][col] = value

      if (fillCell(index + 1)) {
        return true
      }

      board[row][col] = 0
    }

    return false
  }

  fillCell(0)

  return board
}

export function buildCells(puzzle: NumericBoard, solution: NumericBoard): Board {
  return puzzle.map((row, rowIndex) =>
    row.map<Cell>((value, colIndex) => ({
      row: rowIndex,
      col: colIndex,
      value: value || null,
      solution: solution[rowIndex][colIndex],
      given: value !== 0,
      notes: [],
      isHint: false,
    })),
  )
}

export function boardToNumbers(board: Board): NumericBoard {
  return board.map((row) => row.map((cell) => cell.value ?? 0))
}

export function cloneBoard(board: Board): Board {
  return board.map((row) => row.map((cell) => ({ ...cell, notes: [...cell.notes] })))
}

export function generatePuzzle(difficulty: Difficulty) {
  const { givenRange } = difficultyConfig[difficulty]
  const targetGivens = randomInt(givenRange[0], givenRange[1])
  let bestPuzzle: NumericBoard | null = null
  let bestGivenCount = SIZE * SIZE

  for (let pass = 0; pass < 4; pass += 1) {
    const solution = generateSolvedBoard()
    const puzzle = cloneNumericBoard(solution)
    const positions = shuffle(
      Array.from({ length: SIZE * SIZE }, (_, index) => ({
        row: Math.floor(index / SIZE),
        col: index % SIZE,
      })),
    )

    let givenCount = SIZE * SIZE

    for (const { row, col } of positions) {
      if (givenCount <= targetGivens) {
        break
      }

      const previous = puzzle[row][col]
      puzzle[row][col] = 0

      if (countSolutions(puzzle, 2) !== 1) {
        puzzle[row][col] = previous
        continue
      }

      givenCount -= 1
    }

    if (givenCount >= givenRange[0] && givenCount <= givenRange[1]) {
      return { puzzle, solution }
    }

    if (givenCount < bestGivenCount) {
      bestGivenCount = givenCount
      bestPuzzle = puzzle
    }
  }

  const solution = solveBoard(bestPuzzle ?? generateSolvedBoard()) ?? generateSolvedBoard()

  return {
    puzzle: bestPuzzle ?? cloneNumericBoard(solution),
    solution,
  }
}

export function getPeerPositions(row: number, col: number): Position[] {
  const peers = new Map<string, Position>()

  for (let index = 0; index < SIZE; index += 1) {
    if (index !== col) {
      peers.set(getCellKey(row, index), { row, col: index })
    }

    if (index !== row) {
      peers.set(getCellKey(index, col), { row: index, col })
    }
  }

  const startRow = Math.floor(row / BOX_SIZE) * BOX_SIZE
  const startCol = Math.floor(col / BOX_SIZE) * BOX_SIZE

  for (let r = startRow; r < startRow + BOX_SIZE; r += 1) {
    for (let c = startCol; c < startCol + BOX_SIZE; c += 1) {
      if (r !== row || c !== col) {
        peers.set(getCellKey(r, c), { row: r, col: c })
      }
    }
  }

  return Array.from(peers.values())
}

export function getConflictingCellKeys(board: Board) {
  const conflicts = new Set<string>()
  const numericBoard = boardToNumbers(board)

  for (let row = 0; row < SIZE; row += 1) {
    for (let col = 0; col < SIZE; col += 1) {
      const value = numericBoard[row][col]

      if (value === 0 || isValueAllowed(numericBoard, row, col, value)) {
        continue
      }

      conflicts.add(getCellKey(row, col))
    }
  }

  return conflicts
}

export function getFilledCount(board: Board) {
  return board.reduce(
    (total, row) => total + row.filter((cell) => cell.value !== null).length,
    0,
  )
}

export function isBoardSolved(board: Board) {
  return board.every((row) =>
    row.every((cell) => cell.value !== null && cell.value === cell.solution),
  )
}

export function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
}
