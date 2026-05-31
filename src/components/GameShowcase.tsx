import { motion } from 'framer-motion'
import { GameCard } from './GameCard'
import { games } from '../data/games'
import { SectionHeading } from './shared/SectionHeading'

export function GameShowcase() {
  return (
    <section id="games" className="relative z-10 px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Game Shelf"
          title="Featured Games"
          description="Four polished mini games with their own playable pages, stats, controls and saved best results."
        />

        <motion.div
          className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.18 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.09 } },
          }}
        >
          {games.map((game) => (
            <GameCard key={game.name} game={game} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
