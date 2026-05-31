import { AnimatePresence, motion } from 'framer-motion'
import { Brain, Sparkles } from 'lucide-react'
import { getGameById } from '../../../data/games'
import { BackToGames } from '../../shared/BackToGames'
import { GameDetailsPanel } from '../../shared/GameDetailsPanel'
import { NumberPad } from './NumberPad'
import { SudokuBoard } from './SudokuBoard'
import { SudokuControls } from './SudokuControls'
import { SudokuOverlay } from './SudokuOverlay'
import { SudokuStats } from './SudokuStats'
import { useSudokuGame } from './useSudokuGame'

export function NeonSudokuGame() {
  const game = useSudokuGame()
  const gameMeta = getGameById('neon-sudoku')!

  return (
    <main className="relative min-h-screen overflow-hidden px-5 pb-12 pt-24 sm:px-8 lg:px-10 lg:pb-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(rgba(94,210,156,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.045)_1px,transparent_1px)] bg-[size:42px_42px] opacity-35"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-64 -z-10 h-[460px] w-[460px] -translate-x-1/2 rounded-full bg-arcade-mint/12 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[8%] top-32 -z-10 h-[280px] w-[280px] rounded-full bg-cyan-400/10 blur-3xl"
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
            {game.feedback ? (
              <motion.div
                className="inline-flex items-center gap-2 rounded-full border border-cyan-200/20 bg-cyan-200/10 px-4 py-2 text-xs font-bold text-cyan-100 shadow-[0_0_26px_rgba(34,211,238,0.12)]"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <Sparkles size={15} strokeWidth={2.5} />
                {game.feedback}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </header>

        <div className="mt-6">
          <GameDetailsPanel game={gameMeta} />
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
          <section className="relative rounded-lg border border-white/10 bg-white/[0.026] p-3 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-5">
            <div
              className={
                game.status === 'paused'
                  ? 'pointer-events-none blur-sm transition duration-300'
                  : 'transition duration-300'
              }
            >
              <SudokuBoard
                board={game.board}
                conflictKeys={game.conflictKeys}
                lastHint={game.lastHint}
                mistakeChecking={game.mistakeChecking}
                selected={game.selected}
                selectedNumber={game.selectedNumber}
                onCellSelect={game.actions.selectCell}
              />
            </div>
          </section>

          <aside className="grid gap-4">
            <SudokuStats
              bestTimeLabel={game.labels.bestTime}
              difficulty={game.difficulty}
              filledCount={game.filledCount}
              formattedTime={game.formattedTime}
              hintsUsed={game.hintsUsed}
              inputMode={game.inputMode}
              markMode={game.markMode}
              mistakes={game.mistakes}
            />

            <NumberPad
              numberCounts={game.numberCounts}
              remainingHints={game.remainingHints}
              selectedNumber={game.selectedNumber}
              status={game.status}
              onAutoNotes={game.actions.autoNotes}
              onErase={game.actions.eraseSelected}
              onHint={game.actions.requestHint}
              onNewGame={() => game.actions.newGame()}
              onNumber={game.actions.handleNumberInput}
              onPauseToggle={game.actions.togglePause}
              onRestart={game.actions.restartPuzzle}
            />

            <SudokuControls
              difficulty={game.difficulty}
              inputMode={game.inputMode}
              markMode={game.markMode}
              mistakeChecking={game.mistakeChecking}
              onDifficultyChange={game.actions.setDifficulty}
              onInputModeChange={game.actions.setInputMode}
              onMarkModeChange={game.actions.setMarkMode}
              onMistakeCheckingToggle={game.actions.toggleMistakeChecking}
            />
          </aside>
        </div>
      </motion.div>

      <SudokuOverlay
        difficulty={game.difficulty}
        formattedTime={game.formattedTime}
        hintsUsed={game.hintsUsed}
        mistakes={game.mistakes}
        status={game.status}
        onNewGame={() => game.actions.newGame()}
        onResume={game.actions.resume}
      />
    </main>
  )
}
