import { Code2, Info, Keyboard, Layers } from 'lucide-react'
import type { Game } from '../../data/games'
import { GameBadge } from './GameBadge'
import { GlassPanel } from './GlassPanel'
import { NeonButton } from './NeonButton'

type GameDetailsPanelProps = {
  game: Game
}

export function GameDetailsPanel({ game }: GameDetailsPanelProps) {
  const codeAnchor = game.codeUrl.startsWith('#') ? game.codeUrl.slice(1) : undefined

  return (
    <GlassPanel className="p-4 sm:p-5" id="details">
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.95fr_0.95fr]">
        <div>
          <div className="flex flex-wrap gap-2">
            <GameBadge>{game.status}</GameBadge>
            <GameBadge tone="cyan">{game.difficulty}</GameBadge>
          </div>
          <h2 className="mt-5 flex items-center gap-2 text-lg font-extrabold text-white">
            <Info size={19} className="text-arcade-mint" strokeWidth={2.5} />
            About this game
          </h2>
          <p className="mt-3 text-sm leading-7 text-white/66">{game.focus}</p>
        </div>

        <div>
          <h2 className="flex items-center gap-2 text-lg font-extrabold text-white">
            <Keyboard size={19} className="text-cyan-100" strokeWidth={2.5} />
            How to play
          </h2>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-white/64">
            {game.howToPlay.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-arcade-mint" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="flex items-center gap-2 text-lg font-extrabold text-white">
            <Layers size={19} className="text-arcade-mint" strokeWidth={2.5} />
            Tech used
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {game.techTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-[11px] font-bold text-white/70"
              >
                {tag}
              </span>
            ))}
          </div>
          <NeonButton
            href={game.codeUrl}
            variant="glass"
            className="mt-5 w-full"
            ariaLabel={`View code placeholder for ${game.name}`}
          >
            <Code2 size={16} strokeWidth={2.5} />
            Code
          </NeonButton>
          {codeAnchor ? (
            <p id={codeAnchor} className="mt-3 text-xs leading-5 text-white/48">
              Code links coming soon. Replace this placeholder with the live
              GitHub repository URL when it is ready.
            </p>
          ) : null}
        </div>
      </div>
    </GlassPanel>
  )
}
