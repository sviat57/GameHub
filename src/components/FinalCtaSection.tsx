import { ArrowRight, Gamepad2 } from 'lucide-react'
import { NeonButton } from './shared/NeonButton'

export function FinalCtaSection() {
  return (
    <section className="relative z-10 px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-lg border border-arcade-mint/25 bg-[linear-gradient(135deg,rgba(94,210,156,0.14),rgba(34,211,238,0.07)_45%,rgba(255,255,255,0.035))] p-8 shadow-[0_30px_100px_rgba(0,0,0,0.34)] backdrop-blur-xl sm:p-10 lg:p-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="inline-flex size-12 items-center justify-center rounded-lg border border-cyan-200/20 bg-cyan-200/10 text-cyan-100">
              <Gamepad2 size={24} strokeWidth={2.5} />
            </div>
            <h2 className="mt-6 max-w-3xl text-3xl font-extrabold uppercase tracking-tight text-white sm:text-5xl">
              Pick a game and start the arcade.
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/68 sm:text-base">
              Neon Game Hub is ready to expand with dedicated project pages,
              source links and future web remakes.
            </p>
          </div>

          <NeonButton href="/games" className="w-full sm:w-auto">
            Play Games
            <ArrowRight size={17} strokeWidth={2.6} />
          </NeonButton>
        </div>
      </div>
    </section>
  )
}
