import { motion } from 'framer-motion'
import { ArrowRight, Code2, Info } from 'lucide-react'
import type { Game } from '../data/games'
import { GameBadge } from './shared/GameBadge'

type GameCardProps = {
  game: Game
}

export function GameCard({ game }: GameCardProps) {
  const Icon = game.icon

  return (
    <motion.article
      variants={{
        hidden: { opacity: 0, y: 28 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      whileHover={{ y: -8, scale: 1.01 }}
      className="group relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.035] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.24)] backdrop-blur-xl transition-colors duration-300 hover:border-arcade-mint/45 sm:p-6"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(94,210,156,0.16),transparent_42%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="absolute -right-12 -top-12 size-32 rounded-full bg-arcade-mint/10 blur-3xl transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative flex h-full min-h-[270px] flex-col">
        <div className="flex items-start justify-between gap-4">
          <div
            className={`grid size-12 place-items-center rounded-md bg-gradient-to-br ${game.accent} text-arcade-black shadow-[0_0_28px_rgba(94,210,156,0.22)]`}
          >
            <Icon size={25} strokeWidth={2.4} />
          </div>

          <GameBadge>{game.status}</GameBadge>
        </div>

        <div className="mt-7">
          <p className="font-jakarta text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-200/70">
            {game.type}
          </p>
          <h3 className="mt-3 text-2xl font-extrabold tracking-tight text-white">
            {game.name}
          </h3>
          <p className="mt-4 text-sm leading-6 text-white/66">{game.description}</p>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <GameBadge tone="cyan">{game.difficulty}</GameBadge>
          {game.techTags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] font-bold text-white/58"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto grid grid-cols-3 gap-2 pt-8">
          <a
            href={game.route}
            className="group/play inline-flex h-10 items-center justify-center gap-1.5 rounded-full bg-white px-2 text-[11px] font-extrabold uppercase tracking-[0.08em] text-arcade-black transition duration-300 hover:bg-arcade-mint"
            aria-label={`Play ${game.name}`}
          >
            Play
            <ArrowRight
              size={15}
              strokeWidth={2.8}
              className="transition-transform duration-300 group-hover/play:translate-x-0.5"
            />
          </a>
          <a
            href={`${game.route}#details`}
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full border border-white/12 bg-white/[0.03] px-2 text-[11px] font-extrabold uppercase tracking-[0.08em] text-white/82 transition duration-300 hover:border-arcade-mint/50 hover:text-arcade-mint"
            aria-label={`View details for ${game.name}`}
          >
            <Info size={14} strokeWidth={2.5} />
            Details
          </a>
          <a
            href={game.codeUrl}
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full border border-white/12 bg-white/[0.03] px-2 text-[11px] font-extrabold uppercase tracking-[0.08em] text-white/82 transition duration-300 hover:border-cyan-200/45 hover:text-cyan-100"
            aria-label={`View code placeholder for ${game.name}`}
          >
            <Code2 size={14} strokeWidth={2.5} />
            Code
          </a>
        </div>
      </div>
    </motion.article>
  )
}
