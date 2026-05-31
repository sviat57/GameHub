import { motion } from 'framer-motion'
import { DIGITS } from './sudokuUtils'
import type { Cell } from './types'

type SudokuCellProps = {
  cell: Cell
  isConflict: boolean
  isLastHint: boolean
  isRelated: boolean
  isSameNumber: boolean
  isSelected: boolean
  isWrong: boolean
  onSelect: () => void
}

const joinClasses = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ')

export function SudokuCell({
  cell,
  isConflict,
  isLastHint,
  isRelated,
  isSameNumber,
  isSelected,
  isWrong,
  onSelect,
}: SudokuCellProps) {
  const hasWarning = isWrong || isConflict
  const borderClasses = joinClasses(
    'border border-white/10',
    cell.row % 3 === 0 && 'border-t-2 border-t-cyan-200/40',
    cell.col % 3 === 0 && 'border-l-2 border-l-cyan-200/40',
    cell.row === 8 && 'border-b-2 border-b-cyan-200/40',
    cell.col === 8 && 'border-r-2 border-r-cyan-200/40',
  )

  return (
    <motion.button
      type="button"
      aria-label={`Row ${cell.row + 1}, column ${cell.col + 1}${
        cell.value ? `, value ${cell.value}` : ', empty'
      }`}
      onClick={onSelect}
      whileTap={{ scale: 0.96 }}
      animate={
        isSelected
          ? {
              boxShadow: [
                '0 0 0 rgba(94,210,156,0)',
                '0 0 30px rgba(94,210,156,0.36)',
                '0 0 0 rgba(94,210,156,0)',
              ],
            }
          : { boxShadow: '0 0 0 rgba(94,210,156,0)' }
      }
      transition={{ duration: 1.2, repeat: isSelected ? Infinity : 0, ease: 'easeInOut' }}
      className={joinClasses(
        'relative aspect-square min-h-0 min-w-0 select-none overflow-hidden bg-white/[0.025] text-center outline-none transition duration-150 focus-visible:z-20 focus-visible:ring-2 focus-visible:ring-arcade-mint',
        borderClasses,
        isRelated && 'bg-cyan-300/[0.055]',
        isSameNumber && 'bg-arcade-mint/[0.12]',
        cell.given && 'bg-white/[0.07]',
        cell.isHint && 'bg-cyan-300/[0.11]',
        isSelected &&
          'z-10 bg-arcade-mint/[0.18] ring-2 ring-inset ring-arcade-mint shadow-[0_0_36px_rgba(94,210,156,0.24)]',
        isLastHint && 'ring-2 ring-inset ring-cyan-200/70',
        hasWarning &&
          'bg-rose-500/[0.14] text-rose-100 ring-2 ring-inset ring-rose-400/55 shadow-[0_0_28px_rgba(244,63,94,0.18)]',
      )}
    >
      <span
        aria-hidden="true"
        className={joinClasses(
          'pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200',
          isSelected &&
            'opacity-100 bg-[radial-gradient(circle_at_50%_45%,rgba(94,210,156,0.22),transparent_58%)]',
        )}
      />

      {cell.value ? (
        <span
          className={joinClasses(
            'relative z-10 grid h-full place-items-center text-lg font-extrabold leading-none sm:text-2xl md:text-3xl',
            cell.given && 'text-white',
            !cell.given && !cell.isHint && 'text-arcade-mint',
            cell.isHint && 'text-cyan-100',
            hasWarning && 'text-rose-100',
          )}
        >
          {cell.value}
        </span>
      ) : (
        <span
          className="relative z-10 grid h-full grid-cols-3 grid-rows-3 p-[3px] text-[7px] font-bold leading-none sm:p-1 sm:text-[9px] md:text-[10px]"
          aria-hidden="true"
        >
          {DIGITS.map((note) => (
            <span
              key={note}
              className={joinClasses(
                'grid place-items-center',
                cell.notes.includes(note) ? 'text-cyan-100/72' : 'text-transparent',
              )}
            >
              {note}
            </span>
          ))}
        </span>
      )}
    </motion.button>
  )
}
