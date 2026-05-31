import { ArrowLeft } from 'lucide-react'

export function BackToGames() {
  return (
    <a
      href="/games"
      className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.16em] text-white/68 transition hover:text-arcade-mint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcade-mint"
    >
      <ArrowLeft size={16} strokeWidth={2.6} />
      Back to Games
    </a>
  )
}
