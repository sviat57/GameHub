import type { ReactNode } from 'react'

type GameBadgeProps = {
  children: ReactNode
  tone?: 'mint' | 'cyan' | 'white'
}

const tones = {
  cyan: 'border-cyan-200/25 bg-cyan-200/10 text-cyan-100',
  mint: 'border-arcade-mint/30 bg-arcade-mint/10 text-arcade-mint',
  white: 'border-white/10 bg-white/[0.04] text-white/72',
}

export function GameBadge({ children, tone = 'mint' }: GameBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] ${tones[tone]}`}
    >
      {children}
    </span>
  )
}
