import { motion } from 'framer-motion'

type SectionHeadingProps = {
  eyebrow: string
  title: string
  description?: string
  align?: 'left' | 'center'
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
}: SectionHeadingProps) {
  return (
    <motion.div
      className={align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
    >
      <p className="font-jakarta text-[11px] font-extrabold uppercase tracking-[0.24em] text-arcade-mint">
        {eyebrow}
      </p>
      <h2 className="mt-4 text-3xl font-extrabold uppercase tracking-tight text-white sm:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-5 text-sm leading-7 text-white/68 sm:text-base">
          {description}
        </p>
      ) : null}
    </motion.div>
  )
}
