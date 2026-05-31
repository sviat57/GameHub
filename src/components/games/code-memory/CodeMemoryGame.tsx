import { AnimatePresence, motion } from 'framer-motion'
import { Brain, Sparkles } from 'lucide-react'
import { getGameById } from '../../../data/games'
import { BackToGames } from '../../shared/BackToGames'
import { GameDetailsPanel } from '../../shared/GameDetailsPanel'
import { MemoryBoard } from './MemoryBoard'
import { MemoryControls } from './MemoryControls'
import { MemoryOverlay } from './MemoryOverlay'
import { MemoryStats } from './MemoryStats'
import { useCodeMemoryGame } from './useCodeMemoryGame'

export function CodeMemoryGame() {
  const game = useCodeMemoryGame()
  const gameMeta = getGameById('smart-cards')!
  const shouldSoftenBoard =
    game.status === 'idle' || game.status === 'paused' || game.status === 'completed'

  return (
    <main className="relative min-h-screen overflow-hidden px-5 pb-12 pt-24 sm:px-8 lg:px-10 lg:pb-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(rgba(94,210,156,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.045)_1px,transparent_1px)] bg-[size:42px_42px] opacity-35"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-64 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-arcade-mint/12 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[8%] top-32 -z-10 h-[300px] w-[300px] rounded-full bg-cyan-400/10 blur-3xl"
      />

      <motion.div
        className="mx-auto max-w-7xl"
        aria-hidden={game.status === 'completed' ? true : undefined}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <BackToGames />

        <header className="mt-7 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-arcade-mint/30 bg-arcade-mint/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-arcade-mint">
              <Brain size={13} strokeWidth={2.6} />
              {gameMeta.type}
            </div>
            <h1 className="mt-4 text-4xl font-extrabold uppercase leading-none text-white sm:text-6xl">
              {gameMeta.name}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/68 sm:text-base">
              {gameMeta.description}
            </p>
          </div>

          <AnimatePresence>
            {game.status === 'playing' && game.stats.combo > 1 ? (
              <motion.div
                className="inline-flex items-center gap-2 rounded-full border border-cyan-200/20 bg-cyan-200/10 px-4 py-2 text-xs font-bold text-cyan-100 shadow-[0_0_26px_rgba(34,211,238,0.12)]"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <Sparkles size={15} strokeWidth={2.5} />
                Combo x{game.stats.combo}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </header>

        <div className="mt-6">
          <GameDetailsPanel game={gameMeta} />
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-start">
          <section className="relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.026] p-2 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-5">
            <div
              className={
                shouldSoftenBoard
                  ? 'pointer-events-none blur-[2px] transition duration-300'
                  : 'transition duration-300'
              }
            >
              <MemoryBoard
                cards={game.cards}
                checking={game.checking}
                difficulty={game.difficulty}
                feedback={game.feedback}
                onCardSelect={game.actions.selectCard}
                status={game.status}
                wrongCardIds={game.wrongCardIds}
              />
            </div>

            <MemoryOverlay
              bestForDifficulty={game.bestForDifficulty}
              completedSummary={game.completedSummary}
              difficulty={game.difficulty}
              status={game.status}
              onDifficultyChange={game.actions.setDifficulty}
              onNewGame={game.actions.newGame}
              onRestart={game.actions.restart}
              onResume={game.actions.resume}
              onStart={game.actions.start}
            />
          </section>

          <aside className="grid gap-4">
            <MemoryControls
              difficulty={game.difficulty}
              status={game.status}
              onDifficultyChange={game.actions.setDifficulty}
              onNewGame={game.actions.newGame}
              onPauseToggle={game.actions.togglePause}
              onRestart={game.actions.restart}
              onStart={game.actions.start}
            />

            <MemoryStats
              bestMovesLabel={game.labels.bestMoves}
              bestTimeLabel={game.labels.bestTime}
              difficulty={game.difficulty}
              formattedTime={game.labels.formattedTime}
              stats={game.stats}
            />
          </aside>
        </div>
      </motion.div>
    </main>
  )
}
