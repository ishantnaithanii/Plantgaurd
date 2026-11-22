import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'

export default function CallToAction() {
  const shouldReduceMotion = useReducedMotion()

  function scrollToUpload() {
    document.getElementById('upload')?.scrollIntoView({
      behavior: shouldReduceMotion ? 'auto' : 'smooth',
      block: 'start',
    })
  }

  return (
    <motion.section
      className="mx-auto mt-14 flex w-full max-w-7xl flex-col items-center justify-between gap-5 rounded-2xl border border-green-800 bg-green-900 px-6 py-6 text-center shadow-xl shadow-green-950/10 dark:border-green-700 dark:bg-green-900 sm:flex-row sm:py-8 sm:text-left"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.45, ease: 'easeOut' }}
    >
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Ready to protect your plants?
        </h2>
        <p className="mt-2 text-sm leading-6 text-green-100">
          Start with a clear photo of a leaf.
        </p>
      </div>
      <button
        type="button"
        onClick={scrollToUpload}
        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-green-900 shadow-[0_4px_0_var(--color-green-950)] transition active:translate-y-0.5 active:shadow-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
      >
        <ArrowUp className="h-4 w-4" aria-hidden="true" />
        Upload a leaf now
      </button>
    </motion.section>
  )
}
