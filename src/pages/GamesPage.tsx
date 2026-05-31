import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { GameCard } from '../components/GameCard'
import { CodeLinksNotice } from '../components/shared/CodeLinksNotice'
import { gameCategories, games, type GameFilter } from '../data/games'

export function GamesPage() {
  const [filter, setFilter] = useState<GameFilter>('All')
  const filteredGames = useMemo(
    () =>
      filter === 'All'
        ? games
        : games.filter((game) => game.category === filter),
    [filter],
  )

  return (
    <main className="relative z-10 px-5 pb-20 pt-32 sm:px-8 lg:px-10 lg:pb-28">
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        >
          <p className="font-jakarta text-[11px] font-extrabold uppercase tracking-[0.24em] text-arcade-mint">
            Neon Game Hub
          </p>
          <h1 className="mt-4 text-4xl font-extrabold uppercase tracking-tight text-white sm:text-6xl">
            Games Library
          </h1>
          <p className="mt-5 text-sm leading-7 text-white/68 sm:text-base">
            Choose a game and start playing.
          </p>
        </motion.div>

        <div className="mt-8 flex flex-wrap gap-2">
          {gameCategories.map((category) => {
            const active = filter === category

            return (
              <button
                key={category}
                type="button"
                onClick={() => setFilter(category)}
                className={
                  active
                    ? 'rounded-full bg-arcade-mint px-4 py-2 text-xs font-extrabold uppercase tracking-[0.14em] text-arcade-black'
                    : 'rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-xs font-extrabold uppercase tracking-[0.14em] text-white/68 transition hover:border-arcade-mint/45 hover:text-arcade-mint'
                }
              >
                {category}
              </button>
            )
          })}
        </div>

        {filteredGames.length > 0 ? (
          <motion.div
            className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5"
            key={filter}
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08 } },
            }}
          >
            {filteredGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </motion.div>
        ) : (
          <div className="mt-10 rounded-lg border border-white/10 bg-white/[0.035] p-8 text-center text-white/64">
            No games match this filter yet.
          </div>
        )}

        <section className="mt-14">
          <CodeLinksNotice />
        </section>
      </div>
    </main>
  )
}
