import { Github } from 'lucide-react'
import { games } from '../../data/games'
import { GlassPanel } from './GlassPanel'

export function CodeLinksNotice() {
  return (
    <GlassPanel className="p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-jakarta text-[10px] font-extrabold uppercase tracking-[0.2em] text-arcade-mint">
            Code links
          </p>
          <h3 className="mt-2 text-xl font-extrabold text-white">
            Project repositories coming soon
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/62">
            The code buttons are wired to safe placeholders for now. Replace each
            placeholder anchor with a real GitHub URL when the repositories are ready.
          </p>
        </div>
        <Github className="text-white/42" size={26} strokeWidth={2.4} />
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {games.map((game) => (
          <div
            key={game.id}
            id={game.codeUrl.replace('#', '')}
            className="rounded-md border border-white/10 bg-white/[0.025] p-3"
          >
            <p className="text-sm font-extrabold text-white">{game.name}</p>
            <p className="mt-1 text-xs text-white/50">GitHub URL placeholder</p>
          </div>
        ))}
      </div>
    </GlassPanel>
  )
}
