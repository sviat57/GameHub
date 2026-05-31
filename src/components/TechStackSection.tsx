import { motion } from 'framer-motion'
import { Code2, Database, Gamepad2, Layers, MonitorSmartphone, Sparkles } from 'lucide-react'
import { SectionHeading } from './shared/SectionHeading'

const stack = [
  { label: 'React', icon: Code2 },
  { label: 'TypeScript', icon: Code2 },
  { label: 'Tailwind CSS', icon: Layers },
  { label: 'Framer Motion', icon: Sparkles },
  { label: 'lucide-react', icon: Sparkles },
  { label: 'localStorage', icon: Database },
  { label: 'Game Loops', icon: Gamepad2 },
  { label: 'Responsive UI', icon: MonitorSmartphone },
]

export function TechStackSection() {
  return (
    <section className="relative z-10 px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Build Stack"
          title="Tech Stack"
          description="A compact web stack chosen for fast iteration, responsive UI, animation and local saved stats."
        />

        <motion.div
          className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.22 }}
          variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
        >
          {stack.map((item) => {
            const Icon = item.icon

            return (
              <motion.div
                key={item.label}
                className="rounded-lg border border-white/10 bg-white/[0.035] p-4 backdrop-blur-xl transition duration-300 hover:border-arcade-mint/35 hover:bg-white/[0.055]"
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{ y: -4 }}
              >
                <Icon size={21} className="text-arcade-mint" strokeWidth={2.5} />
                <p className="mt-4 text-sm font-extrabold uppercase tracking-[0.14em] text-white">
                  {item.label}
                </p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
