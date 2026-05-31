import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useRef, type TouchEvent } from 'react'
import { SnakeCell } from './SnakeCell'
import type { Direction, Food, Particle, Position, ScorePopup } from './types'

type SnakeBoardProps = {
  boardSize: number
  bonusFood: Food | null
  direction: Direction
  food: Food
  onDirectionChange: (direction: Direction) => void
  particles: Particle[]
  scorePopups: ScorePopup[]
  snake: Position[]
}

const SWIPE_THRESHOLD = 28

const positionKey = ({ row, col }: Position) => `${row}:${col}`

export function SnakeBoard({
  boardSize,
  bonusFood,
  direction,
  food,
  onDirectionChange,
  particles,
  scorePopups,
  snake,
}: SnakeBoardProps) {
  const touchStart = useRef<Position | null>(null)
  const snakeMap = useMemo(
    () =>
      new Map(
        snake.map((segment, index) => [
          positionKey(segment),
          {
            index,
            isHead: index === 0,
          },
        ]),
      ),
    [snake],
  )
  const foodKey = positionKey(food)
  const bonusFoodKey = bonusFood ? positionKey(bonusFood) : null

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0]

    if (!touch) {
      return
    }

    touchStart.current = {
      col: touch.clientX,
      row: touch.clientY,
    }
  }

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const start = touchStart.current
    const touch = event.changedTouches[0]
    touchStart.current = null

    if (!start || !touch) {
      return
    }

    const deltaX = touch.clientX - start.col
    const deltaY = touch.clientY - start.row
    const absX = Math.abs(deltaX)
    const absY = Math.abs(deltaY)

    if (Math.max(absX, absY) < SWIPE_THRESHOLD) {
      return
    }

    event.preventDefault()
    onDirectionChange(absX > absY ? (deltaX > 0 ? 'right' : 'left') : deltaY > 0 ? 'down' : 'up')
  }

  return (
    <motion.div
      className="mx-auto w-full max-w-[680px]"
      initial={{ opacity: 0, scale: 0.96, y: 18 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
    >
      <div className="relative rounded-lg border border-arcade-mint/30 bg-white/[0.035] p-2 shadow-[0_0_76px_rgba(94,210,156,0.17)] backdrop-blur-xl sm:p-3">
        <div className="absolute -inset-7 -z-10 rounded-[34px] bg-[radial-gradient(circle_at_50%_50%,rgba(94,210,156,0.18),transparent_58%)] blur-2xl" />
        <div
          className="relative grid aspect-square overflow-hidden rounded-md border-2 border-cyan-200/28 bg-arcade-ink/90 shadow-[inset_0_0_36px_rgba(34,211,238,0.11)]"
          role="grid"
          aria-label="Neon Snake board"
          onTouchEnd={handleTouchEnd}
          onTouchStart={handleTouchStart}
          style={{
            gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))`,
            touchAction: 'none',
          }}
          tabIndex={0}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(94,210,156,0.12),transparent_46%)] mix-blend-screen"
          />
          {Array.from({ length: boardSize * boardSize }, (_, index) => {
            const row = Math.floor(index / boardSize)
            const col = index % boardSize
            const key = `${row}:${col}`
            const snakeSegment = snakeMap.get(key)

            return (
              <SnakeCell
                key={key}
                direction={direction}
                hasBonusFood={bonusFoodKey === key}
                hasFood={foodKey === key}
                isHead={Boolean(snakeSegment?.isHead)}
                isSnake={Boolean(snakeSegment)}
                segmentIndex={snakeSegment?.index ?? 0}
                snakeLength={snake.length}
              />
            )
          })}

          <AnimatePresence>
            {particles.map((particle) => (
              <motion.span
                key={particle.id}
                className="pointer-events-none absolute z-30 size-1.5 rounded-full"
                style={{
                  backgroundColor: particle.color,
                  boxShadow: `0 0 14px ${particle.color}`,
                  left: `${((particle.col + 0.5) / boardSize) * 100}%`,
                  top: `${((particle.row + 0.5) / boardSize) * 100}%`,
                }}
                initial={{ opacity: 0.95, scale: 1, x: 0, y: 0 }}
                animate={{
                  opacity: 0,
                  scale: 0.2,
                  x: Math.cos(particle.angle) * particle.distance,
                  y: Math.sin(particle.angle) * particle.distance,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.62, ease: 'easeOut' }}
              />
            ))}
          </AnimatePresence>

          <AnimatePresence>
            {scorePopups.map((popup) => (
              <motion.span
                key={popup.id}
                className="pointer-events-none absolute z-40 rounded-full border border-white/10 bg-arcade-black/70 px-2 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] backdrop-blur-md"
                style={{
                  color: popup.tone === 'cyan' ? '#a5f3fc' : '#bbf7d0',
                  left: `${((popup.col + 0.25) / boardSize) * 100}%`,
                  textShadow:
                    popup.tone === 'cyan'
                      ? '0 0 16px rgba(103,232,249,0.72)'
                      : '0 0 16px rgba(94,210,156,0.72)',
                  top: `${((popup.row + 0.2) / boardSize) * 100}%`,
                }}
                initial={{ opacity: 0, scale: 0.86, y: 0 }}
                animate={{ opacity: [0, 1, 0], scale: 1, y: -34 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
              >
                {popup.text}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
