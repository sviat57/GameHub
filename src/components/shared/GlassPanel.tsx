import type { HTMLAttributes, ReactNode } from 'react'

type GlassPanelProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
  className?: string
}

export function GlassPanel({ children, className = '', ...props }: GlassPanelProps) {
  return (
    <div
      {...props}
      className={`rounded-lg border border-white/10 bg-white/[0.035] shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl ${className}`}
    >
      {children}
    </div>
  )
}
