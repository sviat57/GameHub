import { motion } from 'framer-motion'
import { ArrowRight, Github } from 'lucide-react'
import { LiquidGlassCard } from './LiquidGlassCard'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

export function HeroSection() {
  return (
    <section
      id="top"
      className="relative z-10 flex min-h-[82svh] items-center px-5 pb-8 pt-24 sm:px-8 sm:pb-14 sm:pt-28 lg:min-h-[88svh] lg:px-10 lg:pb-16 lg:pt-32"
    >
      <div className="mx-auto grid w-full max-w-7xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <motion.div
          className="mx-auto max-w-3xl text-center lg:mx-0 lg:text-left"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1, delayChildren: 0.12 } },
          }}
        >
          <motion.p
            className="font-jakarta text-[11px] font-extrabold uppercase tracking-[0.24em] text-arcade-mint"
            variants={fadeUp}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          >
            PYTHON-BORN WEB ARCADE
          </motion.p>

          <motion.h1
            className="mt-4 text-[40px] font-extrabold uppercase leading-[0.95] tracking-tight text-white sm:mt-5 sm:text-[56px] lg:text-[72px]"
            variants={fadeUp}
            transition={{ duration: 0.62, ease: 'easeOut' }}
          >
            Play mini games. Explore my code
            <span className="text-arcade-mint">.</span>
          </motion.h1>

          <motion.p
            className="mx-auto mt-5 max-w-[560px] text-sm leading-7 text-white/70 sm:mt-6 sm:text-base lg:mx-0"
            variants={fadeUp}
            transition={{ duration: 0.62, ease: 'easeOut' }}
          >
            A collection of small games that started as coding projects and were
            rebuilt into modern, responsive web experiences.
          </motion.p>

          <motion.div
            className="mt-7 flex items-center justify-center gap-3 sm:mt-8 lg:justify-start"
            variants={fadeUp}
            transition={{ duration: 0.62, ease: 'easeOut' }}
          >
            <a
              href="/games"
              className="group inline-flex h-11 min-w-0 flex-1 items-center justify-center gap-2 rounded-full bg-arcade-mint px-4 text-[11px] font-extrabold uppercase tracking-[0.1em] text-[#070b0a] shadow-[0_0_34px_rgba(94,210,156,0.34)] transition duration-300 hover:bg-white sm:h-12 sm:flex-none sm:px-6 sm:text-xs sm:tracking-[0.16em]"
            >
              Play Games
              <ArrowRight
                size={17}
                strokeWidth={2.6}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </a>

            <a
              href="/#projects"
              className="inline-flex h-11 min-w-0 flex-1 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-4 text-[11px] font-extrabold uppercase tracking-[0.1em] text-white backdrop-blur-md transition duration-300 hover:border-arcade-mint/60 hover:text-arcade-mint hover:shadow-[0_0_26px_rgba(94,210,156,0.2)] sm:h-12 sm:flex-none sm:px-6 sm:text-xs sm:tracking-[0.16em]"
            >
              <Github size={17} strokeWidth={2.5} />
              View Projects
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          className="order-first flex justify-center lg:order-last lg:justify-end lg:pr-24"
          initial={{ opacity: 0, y: -18, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.75, ease: 'easeOut', delay: 0.22 }}
        >
          <div className="lg:-translate-y-[50px]">
            <motion.div
              animate={{ y: [-8, 8, -8] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            >
              <LiquidGlassCard />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
