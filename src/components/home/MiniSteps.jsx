import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, ScanSearch, ShieldPlus, UploadCloud } from 'lucide-react'
import { Link } from 'react-router-dom'

const steps = [
  {
    title: 'Upload',
    description: 'Add a clear leaf photo',
    icon: UploadCloud,
  },
  {
    title: 'Analyze',
    description: 'AI checks the leaf for disease',
    icon: ScanSearch,
  },
  {
    title: 'Treat',
    description: 'Get simple treatment tips',
    icon: ShieldPlus,
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
}

export default function MiniSteps() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section
      aria-labelledby="mini-steps-title"
      className="mx-auto mt-14 w-full max-w-7xl rounded-2xl border border-white/60 bg-white/60 px-6 py-5 shadow-lg shadow-green-950/5 backdrop-blur-xl dark:border-green-800 dark:bg-green-950/60 sm:py-7"
    >
      <div className="mb-6 text-center">
        <h2
          id="mini-steps-title"
          className="text-2xl font-bold tracking-tight text-green-950 dark:text-green-100 sm:text-3xl"
        >
          From photo to plant care
        </h2>
      </div>
      <motion.div
        className="relative grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-4"
        variants={containerVariants}
        initial={shouldReduceMotion ? false : 'hidden'}
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div
          className="pointer-events-none absolute top-8 bottom-8 left-6 w-px bg-green-300 dark:bg-green-700 sm:top-6 sm:right-[16.66%] sm:bottom-auto sm:left-[16.66%] sm:h-px sm:w-auto"
          aria-hidden="true"
        />
        {steps.map(({ title, description, icon: Icon }, index) => (
          <motion.article
            key={title}
            variants={itemVariants}
            className="relative z-10 flex items-center gap-4 sm:flex-col sm:text-center"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center gap-0.5 rounded-full border-4 border-green-50 bg-green-700 text-white dark:border-green-950 dark:bg-green-600">
              <span className="text-xs font-bold">{index + 1}</span>
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <h3 className="font-semibold text-green-950 dark:text-green-100">
                {title}
              </h3>
              <p className="mt-1 text-sm leading-6 text-green-800 dark:text-gray-300">
                {description}
              </p>
            </div>
          </motion.article>
        ))}
        <motion.div
          variants={itemVariants}
          className="sm:col-span-3 sm:text-center"
        >
          <Link
            to="/how-it-works"
            className="inline-flex items-center gap-2 text-sm font-semibold text-green-800 hover:text-green-950 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-700 dark:text-green-300 dark:hover:text-green-100"
          >
            Learn more
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
}
