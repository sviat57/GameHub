import { motion } from 'framer-motion'
import { SudokuCell } from './SudokuCell'
import { getCellKey, isSameBox } from './sudokuUtils'
import type { Board, Position } from './types'

type SudokuBoardProps = {
  board: Board
  conflictKeys: Set<string>
  lastHint: Position | null
  mistakeChecking: boolean
  selected: Position | null
  selectedNumber: number | null
  onCellSelect: (row: number, col: number) => void
}

export function SudokuBoard({
  board,
  conflictKeys,
  lastHint,
  mistakeChecking,
  selected,
  selectedNumber,
  onCellSelect,
}: SudokuBoardProps) {
  const selectedCell = selected ? board[selected.row]?.[selected.col] : null
  const activeNumber = selectedNumber ?? selectedCell?.value ?? null

  return (
    <motion.div
      className="mx-auto w-full max-w-[620px]"
      initial={{ opacity: 0, y: 18, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
    >
      <div className="relative rounded-lg border border-arcade-mint/30 bg-white/[0.035] p-2 shadow-[0_0_70px_rgba(94,210,156,0.16)] backdrop-blur-xl sm:p-3">
        <div className="absolute -inset-6 -z-10 rounded-[32px] bg-[radial-gradient(circle_at_50%_50%,rgba(94,210,156,0.2),transparent_60%)] blur-2xl" />
        <div
          className="grid aspect-square grid-cols-9 overflow-hidden rounded-md border-2 border-cyan-200/35 bg-arcade-ink/88 shadow-[inset_0_0_34px_rgba(34,211,238,0.1)]"
          role="grid"
          aria-label="Neon Sudoku board"
        >
          {board.flat().map((cell) => {
            const isSelected =
              selected?.row === cell.row && selected?.col === cell.col
            const isRelated = selected
              ? selected.row === cell.row ||
                selected.col === cell.col ||
                isSameBox(selected, cell)
              : false
            const isSameNumber = Boolean(
              activeNumber && cell.value !== null && cell.value === activeNumber,
            )
            const isWrong = Boolean(
              mistakeChecking &&
                cell.value !== null &&
                !cell.given &&
                !cell.isHint &&
                cell.value !== cell.solution,
            )
            const isConflict = conflictKeys.has(getCellKey(cell.row, cell.col))
            const isLastHint =
              lastHint?.row === cell.row && lastHint?.col === cell.col

            return (
              <SudokuCell
                key={getCellKey(cell.row, cell.col)}
                cell={cell}
                isConflict={isConflict}
                isLastHint={isLastHint}
                isRelated={isRelated}
                isSameNumber={isSameNumber}
                isSelected={isSelected}
                isWrong={isWrong}
                onSelect={() => onCellSelect(cell.row, cell.col)}
              />
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
