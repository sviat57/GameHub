import { motion } from 'framer-motion'
import { Brain, Gamepad2, Github } from 'lucide-react'

const features = [
  {
    title: 'Game Logic',
    description: 'Collision, puzzles, scoring and state management.',
    icon: Brain,
  },
  {
    title: 'Modern UI',
    description: 'Glassmorphism, neon effects and smooth animations.',
    icon: Github,
  },
  {
    title: 'Portfolio Ready',
    description: 'Playable pages, clean routes and responsive design.',
    icon: Gamepad2,
  },
]

export function AboutSection() {
  return (
    <section
      id="about"
      className="relative z-10 px-5 py-20 sm:px-8 lg:px-10 lg:py-28"
    >
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.58, ease: 'easeOut' }}
        >
          <p className="font-jakarta text-[11px] font-extrabold uppercase tracking-[0.24em] text-arcade-mint">
            Project Story
          </p>
          <h2 className="mt-4 max-w-xl text-3xl font-extrabold uppercase tracking-tight text-white sm:text-5xl">
            From Small Games to a Real Web Arcade
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.58, ease: 'easeOut', delay: 0.08 }}
        >
          <p className="max-w-2xl text-base leading-8 text-white/70">
            These games started as small coding projects and were redesigned into
            polished browser games with modern UI, animations, responsive layouts
            and clean TypeScript logic.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon

              return (
                <motion.div
                  key={feature.title}
                  className="rounded-lg border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl transition duration-300 hover:border-arcade-mint/35 hover:bg-white/[0.055]"
                  whileHover={{ y: -5 }}
                >
                  <Icon className="text-arcade-mint" size={24} strokeWidth={2.4} />
                  <h3 className="mt-5 text-sm font-extrabold uppercase tracking-[0.14em] text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-white/62">
                    {feature.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
