import { motion } from 'framer-motion'
import { Check, Code2 } from 'lucide-react'
import type { MemoryCard as MemoryCardModel } from './types'

type MemoryCardProps = {
  card: MemoryCardModel
  disabled: boolean
  isWrong: boolean
  onSelect: (cardId: string) => void
}

const joinClasses = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ')

const toneClasses: Record<MemoryCardModel['tone'], string> = {
  blue: 'border-sky-300/35 text-sky-100 shadow-[0_0_28px_rgba(56,189,248,0.16)]',
  cyan: 'border-cyan-200/40 text-cyan-100 shadow-[0_0_28px_rgba(34,211,238,0.18)]',
  emerald:
    'border-emerald-200/38 text-emerald-100 shadow-[0_0_28px_rgba(16,185,129,0.16)]',
  mint: 'border-arcade-mint/48 text-arcade-mint shadow-[0_0_30px_rgba(94,210,156,0.2)]',
}

export function MemoryCard({
  card,
  disabled,
  isWrong,
  onSelect,
}: MemoryCardProps) {
  const Icon = card.icon
  const revealed = card.isFlipped || card.isMatched

  return (
    <motion.button
      type="button"
      className={joinClasses(
        'group relative aspect-[4/5] min-h-[46px] w-full rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arcade-mint focus-visible:ring-offset-2 focus-visible:ring-offset-arcade-black sm:min-h-[76px]',
        disabled ? 'cursor-default' : 'cursor-pointer',
      )}
      disabled={disabled}
      onClick={() => onSelect(card.id)}
      aria-label={
        revealed
          ? `${card.label} card${card.isMatched ? ', matched' : ', revealed'}`
          : 'Hidden developer card'
      }
      aria-pressed={revealed}
      whileHover={!disabled ? { y: -3, scale: 1.015 } : undefined}
      whileTap={!disabled ? { scale: 0.97 } : undefined}
      animate={
        isWrong
          ? { x: [0, -6, 6, -4, 4, 0], scale: [1, 1.015, 1] }
          : card.isMatched
            ? { scale: [1, 1.025, 1] }
            : { scale: 1, x: 0 }
      }
      transition={{ duration: isWrong ? 0.36 : 0.28, ease: 'easeOut' }}
      style={{ perspective: 1000 }}
    >
      <motion.span
        className="absolute inset-0 block rounded-md"
        animate={{ rotateY: revealed ? 180 : 0 }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <span
          className={joinClasses(
            'absolute inset-0 grid place-items-center overflow-hidden rounded-md border bg-[#07110f] shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_18px_38px_rgba(0,0,0,0.34)]',
            isWrong
              ? 'border-rose-300/55 shadow-[0_0_24px_rgba(244,63,94,0.16)]'
              : 'border-white/10 group-hover:border-arcade-mint/45',
          )}
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(0deg) translateZ(1px)',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,transparent_44%,rgba(94,210,156,0.13)_45%,transparent_55%)]"
          />
          <span
            aria-hidden="true"
            className="absolute left-2 top-2 h-1.5 w-1.5 rounded-full bg-arcade-mint/80 shadow-[0_0_12px_rgba(94,210,156,0.8)] sm:left-3 sm:top-3"
          />
          <span className="relative grid place-items-center gap-1 text-center text-white/70">
            <Code2 size={22} strokeWidth={2.3} className="text-arcade-mint/80 sm:size-7" />
            <span className="font-jakarta text-[9px] font-extrabold uppercase tracking-[0.2em] text-cyan-100/58 sm:text-[10px]">
              01
            </span>
          </span>
        </span>

        <span
          className={joinClasses(
            'absolute inset-0 flex flex-col items-center justify-center overflow-hidden rounded-md border bg-[#07110f] p-1.5 sm:p-3',
            card.isMatched ? toneClasses[card.tone] : 'border-white/12 text-white/88',
          )}
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg) translateZ(1px)',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(94,210,156,0.14),transparent_48%)]"
          />
          <span
            aria-hidden="true"
            className="absolute inset-x-2 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
          />
          {card.isMatched ? (
            <span className="absolute right-1.5 top-1.5 grid size-4 place-items-center rounded-full bg-arcade-mint text-arcade-black shadow-[0_0_16px_rgba(94,210,156,0.55)] sm:size-5">
              <Check size={11} strokeWidth={3.2} />
            </span>
          ) : null}
          <Icon
            size={26}
            strokeWidth={2.2}
            className={joinClasses(
              'drop-shadow-[0_0_14px_rgba(94,210,156,0.25)] sm:size-9',
              card.isMatched ? '' : 'text-cyan-100',
            )}
          />
          <span className="mt-1 max-w-full truncate px-0.5 text-center font-jakarta text-[8px] font-extrabold uppercase tracking-normal text-white/74 sm:mt-2 sm:text-[10px]">
            {card.label}
          </span>
        </span>
      </motion.span>
    </motion.button>
  )
}
