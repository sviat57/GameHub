export function LiquidGlassCard() {
  return (
    <div className="liquid-card flex h-[200px] w-[200px] flex-col justify-between rounded-lg p-6">
      <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.22em] text-white/55">
        <span>[ 2025 ]</span>
        <span className="size-2 rounded-full bg-arcade-mint shadow-[0_0_18px_rgba(94,210,156,0.9)]" />
      </div>

      <div>
        <h2 className="max-w-[145px] text-2xl font-extrabold uppercase leading-[1.02] tracking-tight text-white">
          4 Games. One{' '}
          <span className="font-serif italic normal-case tracking-normal text-arcade-mint">
            Arcade
          </span>
          .
        </h2>
        <p className="mt-4 text-[12px] leading-5 text-white/62">
          Block Drop, Neon Sudoku, Neon Snake and Smart Cards rebuilt with modern
          web UI.
        </p>
      </div>
    </div>
  )
}
