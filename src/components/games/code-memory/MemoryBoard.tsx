import { AnimatePresence, motion } from 'framer-motion'
import { MemoryCard } from './MemoryCard'
import { difficultyConfig } from './types'
import type { ComboFeedback, Difficulty, GameStatus, MemoryCard as MemoryCardModel } from './types'

type MemoryBoardProps = {
  cards: MemoryCardModel[]
  checking: boolean
  difficulty: Difficulty
  feedback: ComboFeedback | null
  onCardSelect: (cardId: string) => void
  status: GameStatus
  wrongCardIds: string[]
}

const joinClasses = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ')

const boardWidth: Record<Difficulty, string> = {
  Easy: 'max-w-[560px]',
  Medium: 'max-w-[620px]',
  Hard: 'max-w-[720px]',
  Expert: 'max-w-[820px]',
}

export function MemoryBoard({
  cards,
  checking,
  difficulty,
  feedback,
  onCardSelect,
  status,
  wrongCardIds,
}: MemoryBoardProps) {
  const config = difficultyConfig[difficulty]
  const wrongIds = new Set(wrongCardIds)

  return (
    <div className="relative mx-auto w-full">
      <AnimatePresence>
        {feedback ? (
          <motion.div
            key={feedback.id}
            className={joinClasses(
              'pointer-events-none absolute left-1/2 top-3 z-20 -translate-x-1/2 rounded-full border px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] backdrop-blur-xl sm:top-5',
              feedback.tone === 'cyan'
                ? 'border-cyan-200/35 bg-cyan-200/12 text-cyan-100 shadow-[0_0_30px_rgba(34,211,238,0.2)]'
                : 'border-arcade-mint/40 bg-arcade-mint/12 text-arcade-mint shadow-[0_0_30px_rgba(94,210,156,0.22)]',
            )}
            initial={{ opacity: 0, scale: 0.78, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -16 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
          >
            {feedback.text}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.div
        key={difficulty}
        className={joinClasses('mx-auto grid w-full gap-1.5 sm:gap-2.5', boardWidth[difficulty])}
        style={{ gridTemplateColumns: `repeat(${config.columns}, minmax(0, 1fr))` }}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.025 } },
        }}
        role="grid"
        aria-label={`${difficulty} Smart Cards board, ${config.rows} by ${config.columns}`}
      >
        {cards.map((card) => (
          <motion.div
            key={card.id}
            variants={{
              hidden: { opacity: 0, scale: 0.92, y: 10 },
              visible: { opacity: 1, scale: 1, y: 0 },
            }}
            transition={{ duration: 0.24, ease: 'easeOut' }}
          >
            <MemoryCard
              card={card}
              disabled={
                status !== 'playing' || checking || card.isFlipped || card.isMatched
              }
              isWrong={wrongIds.has(card.id)}
              onSelect={onCardSelect}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
