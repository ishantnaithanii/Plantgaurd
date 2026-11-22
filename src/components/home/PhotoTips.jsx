import { motion, useReducedMotion } from 'framer-motion'
import { Check, Focus, Image, ScanLine, Sun, X } from 'lucide-react'

const tips = [
  { title: 'Good daylight', description: 'Use bright, natural light.', icon: Sun },
  { title: 'One leaf in focus', description: 'Keep the leaf sharp and clear.', icon: Focus },
  { title: 'Plain background', description: 'Avoid busy details behind the leaf.', icon: Image },
  { title: 'Fill the frame', description: 'Move close enough to show leaf detail.', icon: ScanLine },
]

const doPoints = [
  'Photograph a healthy-looking leaf area.',
  'Keep the camera steady.',
  'Capture the whole leaf when possible.',
]

const dontPoints = [
  'Use a blurry or dark photo.',
  'Cover the leaf with your fingers.',
  'Include several overlapping leaves.',
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

export default function PhotoTips() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section
      aria-labelledby="photo-tips-title"
      className="mx-auto mt-14 w-full max-w-7xl rounded-2xl border border-white/60 bg-white/60 px-6 py-5 shadow-lg shadow-green-950/5 backdrop-blur-xl dark:border-green-800 dark:bg-green-950/60 sm:py-7"
    >
      <div className="mb-6 text-center">
        <h2
          id="photo-tips-title"
          className="text-2xl font-bold tracking-tight text-green-950 dark:text-green-100 sm:text-3xl"
        >
          Get the best result
        </h2>
        <p className="mt-2 text-green-800 dark:text-gray-300">
          A good photo means a better prediction.
        </p>
      </div>
      <motion.div
        className="grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_1fr]"
        variants={containerVariants}
        initial={shouldReduceMotion ? false : 'hidden'}
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.ul
          variants={containerVariants}
          className="grid grid-cols-1 gap-3 sm:grid-cols-2"
          aria-label="Photo tips"
        >
          {tips.map(({ title, description, icon: Icon }) => (
            <motion.li
              key={title}
              variants={itemVariants}
              className="rounded-xl border border-green-200/70 bg-green-50/80 p-4 dark:border-green-800 dark:bg-green-900/50"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-3 font-semibold text-green-950 dark:text-green-100">
                {title}
              </h3>
              <p className="mt-1 text-sm leading-5 text-green-800 dark:text-gray-300">
                {description}
              </p>
            </motion.li>
          ))}
        </motion.ul>

        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1"
        >
          <div className="rounded-xl border border-green-200/70 bg-green-50/80 p-4 dark:border-green-800 dark:bg-green-900/50">
            <h3 className="flex items-center gap-2 font-semibold text-green-800 dark:text-green-200">
              <Check className="h-5 w-5" aria-hidden="true" />
              Do
            </h3>
            <ul className="mt-3 space-y-2 text-sm leading-5 text-green-800 dark:text-gray-300">
              {doPoints.map((point) => (
                <li key={point} className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-700 dark:text-green-300" aria-hidden="true" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-green-200/70 bg-green-50/80 p-4 dark:border-green-800 dark:bg-green-900/50">
            <h3 className="flex items-center gap-2 font-semibold text-green-800 dark:text-green-200">
              <X className="h-5 w-5" aria-hidden="true" />
              Don&apos;t
            </h3>
            <ul className="mt-3 space-y-2 text-sm leading-5 text-green-800 dark:text-gray-300">
              {dontPoints.map((point) => (
                <li key={point} className="flex gap-2">
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-green-700 dark:text-green-300" aria-hidden="true" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
