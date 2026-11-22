import { motion, useReducedMotion } from 'framer-motion'
import { Leaf } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <section className="relative w-full max-w-2xl rounded-2xl border border-green-200 bg-white/60 px-6 py-12 text-center shadow-xl shadow-green-950/10 backdrop-blur-xl dark:border-green-800 dark:bg-green-950/60 sm:px-10 sm:py-16">
        <motion.span
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
          animate={
            shouldReduceMotion
              ? undefined
              : { y: [0, -8, 0], rotate: [0, 7, -7, 0] }
          }
          transition={{
            duration: shouldReduceMotion ? 0 : 3,
            repeat: shouldReduceMotion ? 0 : Infinity,
            ease: 'easeInOut',
          }}
          aria-hidden="true"
        >
          <Leaf className="h-8 w-8" />
        </motion.span>
        <p className="mt-5 text-7xl font-extrabold tracking-tight text-green-800 dark:text-green-200 sm:text-8xl">
          404
        </p>
        <h1 className="mt-4 text-xl font-semibold text-green-950 dark:text-green-100 sm:text-2xl">
          This page wandered off like a leaf in the wind.
        </h1>
        <Link
          to="/"
          className="mt-8 inline-flex rounded-xl bg-green-800 px-6 py-3 text-sm font-semibold text-white shadow-[0_4px_0_var(--color-green-950)] transition active:translate-y-0.5 active:shadow-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-700 dark:bg-green-700"
        >
          Go home
        </Link>
      </section>
    </main>
  )
}
