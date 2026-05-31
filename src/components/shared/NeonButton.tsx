import { motion } from 'framer-motion'
import type { MouseEventHandler, ReactNode } from 'react'

type NeonButtonProps = {
  children: ReactNode
  href?: string
  onClick?: MouseEventHandler<HTMLButtonElement>
  className?: string
  variant?: 'primary' | 'ghost' | 'glass'
  ariaLabel?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const base =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-xs font-extrabold uppercase tracking-[0.14em] transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcade-mint'

const variants = {
  glass:
    'border border-white/12 bg-white/[0.04] text-white/82 hover:border-arcade-mint/50 hover:text-arcade-mint hover:shadow-[0_0_24px_rgba(94,210,156,0.18)]',
  ghost:
    'border border-white/10 bg-transparent text-white/70 hover:border-cyan-200/35 hover:bg-cyan-200/[0.055] hover:text-cyan-100',
  primary:
    'bg-arcade-mint text-arcade-black shadow-[0_0_32px_rgba(94,210,156,0.28)] hover:bg-white',
}

export function NeonButton({
  children,
  href,
  onClick,
  className = '',
  variant = 'primary',
  ariaLabel,
  disabled,
  type = 'button',
}: NeonButtonProps) {
  const classes = `${base} ${variants[variant]} ${className}`

  if (href) {
    return (
      <motion.a
        href={href}
        aria-label={ariaLabel}
        className={classes}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.97 }}
      >
        {children}
      </motion.a>
    )
  }

  return (
    <motion.button
      type={type}
      aria-label={ariaLabel}
      className={`${classes} disabled:cursor-not-allowed disabled:opacity-45`}
      disabled={disabled}
      onClick={onClick}
      whileHover={disabled ? undefined : { y: -1 }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
    >
      {children}
    </motion.button>
  )
}
