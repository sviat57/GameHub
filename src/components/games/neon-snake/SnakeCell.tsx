import { motion } from 'framer-motion'
import type { Direction } from './types'

type SnakeCellProps = {
  direction: Direction
  hasBonusFood: boolean
  hasFood: boolean
  isHead: boolean
  isSnake: boolean
  segmentIndex: number
  snakeLength: number
}

const joinClasses = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ')

export function SnakeCell({
  direction,
  hasBonusFood,
  hasFood,
  isHead,
  isSnake,
  segmentIndex,
  snakeLength,
}: SnakeCellProps) {
  const tailDepth = snakeLength > 1 ? segmentIndex / (snakeLength - 1) : 0
  const segmentOpacity = isHead ? 1 : Math.max(0.46, 0.96 - tailDepth * 0.42)
  const segmentScale = isHead ? 0.9 : Math.max(0.66, 0.86 - tailDepth * 0.12)
  const scannerClass =
    direction === 'left' || direction === 'right'
      ? 'h-[18%] w-[46%]'
      : 'h-[46%] w-[18%]'

  return (
    <div
      className="relative aspect-square border border-white/[0.025] bg-white/[0.012]"
      role="gridcell"
    >
      {isSnake ? (
        <span
          className={joinClasses(
            'absolute inset-[9%] rounded-[5px] transition-transform duration-100',
            isHead
              ? 'bg-gradient-to-br from-white via-arcade-mint to-cyan-200 shadow-[0_0_18px_rgba(94,210,156,0.75),inset_0_0_10px_rgba(255,255,255,0.32)]'
              : 'bg-gradient-to-br from-arcade-mint via-emerald-300 to-cyan-200 shadow-[0_0_13px_rgba(94,210,156,0.42),inset_0_0_8px_rgba(255,255,255,0.18)]',
          )}
          style={{
            opacity: segmentOpacity,
            transform: `scale(${segmentScale})`,
          }}
        >
          {isHead ? (
            <>
              <span className="absolute inset-[18%] rounded-[4px] border border-white/45" />
              <span
                className={joinClasses(
                  'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-arcade-ink/70 shadow-[0_0_12px_rgba(255,255,255,0.65)]',
                  scannerClass,
                )}
              />
            </>
          ) : null}
        </span>
      ) : null}

      {hasFood ? (
        <span className="absolute left-1/2 top-1/2 size-[58%] -translate-x-1/2 -translate-y-1/2">
          <motion.span
            className="relative block size-full rounded-full border border-arcade-mint/60 bg-arcade-mint shadow-[0_0_18px_rgba(94,210,156,0.86),0_0_34px_rgba(94,210,156,0.34)]"
            animate={{ opacity: [0.72, 1, 0.72], scale: [0.78, 1.08, 0.78] }}
            transition={{ duration: 1.05, ease: 'easeInOut', repeat: Infinity }}
          >
            <span className="absolute inset-[26%] rounded-full bg-white/85" />
          </motion.span>
        </span>
      ) : null}

      {hasBonusFood ? (
        <span className="absolute left-1/2 top-1/2 size-[62%] -translate-x-1/2 -translate-y-1/2">
          <motion.span
            className="relative block size-full rounded-[4px] border border-cyan-200/70 bg-cyan-300 shadow-[0_0_20px_rgba(103,232,249,0.9),0_0_38px_rgba(168,85,247,0.28)]"
            animate={{
              opacity: [0.72, 1, 0.72],
              rotate: [45, 45, 45],
              scale: [0.72, 1, 0.72],
            }}
            transition={{ duration: 0.82, ease: 'easeInOut', repeat: Infinity }}
          >
            <span className="absolute inset-[28%] rounded-sm bg-white/88" />
          </motion.span>
        </span>
      ) : null}
    </div>
  )
}
