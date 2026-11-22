import { motion, useReducedMotion } from 'framer-motion'
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  Database,
  Layers,
  SlidersHorizontal,
  Upload,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import TiltCard from '../components/TiltCard'

const stages = [
  {
    title: 'Input',
    description:
      'Upload a digital plant leaf image through the web interface. JPG and PNG files up to 5MB are supported.',
    icon: Upload,
  },
  {
    title: 'Preprocessing',
    description:
      'The image is validated, resized to the required input dimensions, and its pixel values are normalised.',
    icon: SlidersHorizontal,
  },
  {
    title: 'Inference',
    description:
      'A trained CNN / transfer-learning model using MobileNetV2 predicts probability scores for each class.',
    icon: BrainCircuit,
  },
  {
    title: 'Output',
    description:
      'The highest-scoring category is shown with its confidence and a notice explaining the system’s limitations.',
    icon: BarChart3,
  },
]

const methodology = [
  {
    title: 'Dataset',
    description:
      'The PlantVillage dataset is checked for corrupted files and class imbalance, then split into training, validation, and test sets to prevent data leakage.',
    icon: Database,
  },
  {
    title: 'Model',
    description:
      'A CNN baseline with convolution, pooling, and dense layers is compared with transfer learning using MobileNetV2.',
    icon: Layers,
  },
  {
    title: 'Evaluation',
    description:
      'Performance is assessed on a held-out test set using accuracy, precision, recall, F1-score, and a confusion matrix.',
    icon: BarChart3,
  },
]

const staggeredCards = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
}

const cardEntrance = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function HowItWorks() {
  const shouldReduceMotion = useReducedMotion()
  const reducedMotionProps = shouldReduceMotion
    ? { initial: false, transition: { duration: 0 } }
    : {}

  return (
    <main className="flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-7xl">
        <Reveal trigger="load">
          <PageHeader
            title="How It Works"
            subtitle="From a leaf image to a model prediction: a transparent look at the Plant Leaf Disease Detection System."
          />
        </Reveal>

        <section aria-labelledby="pipeline-heading">
          <motion.div
            className="mb-8 text-center"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.45 }}
          >
            <p className="text-sm font-semibold tracking-[0.16em] text-green-700 uppercase dark:text-green-300">
              The process
            </p>
            <h2
              id="pipeline-heading"
              className="mt-2 text-2xl font-bold tracking-tight text-green-950 dark:text-green-100 sm:text-3xl"
            >
              The detection pipeline
            </h2>
          </motion.div>

          <div className="relative">
            <div
              className="pointer-events-none absolute top-6 bottom-6 left-6 w-px bg-green-600/50 dark:bg-green-700 lg:top-6 lg:right-[12.5%] lg:bottom-auto lg:left-[12.5%] lg:h-px lg:w-auto"
              aria-hidden="true"
            />
            <motion.ol
              className="grid grid-cols-1 gap-5 lg:grid-cols-4 lg:gap-4"
              variants={staggeredCards}
              initial={shouldReduceMotion ? false : 'hidden'}
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
            >
              {stages.map(({ title, description, icon: Icon }, index) => (
                <motion.li
                  key={title}
                  className="relative flex items-start gap-3 lg:block"
                  variants={shouldReduceMotion ? {} : cardEntrance}
                  {...reducedMotionProps}
                >
                  <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-4 border-green-50 bg-green-700 text-sm font-bold text-white shadow-sm dark:border-gray-950 lg:mx-auto">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <TiltCard
                    as="article"
                    className="min-h-56 min-w-0 flex-1 p-6 sm:p-7 lg:mt-4 lg:w-full"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="mt-5 text-lg font-semibold text-green-950 dark:text-green-100">
                      {title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-green-800 dark:text-gray-300">
                      {description}
                    </p>
                  </TiltCard>
                </motion.li>
              ))}
            </motion.ol>
          </div>
        </section>

        <section className="mt-16" aria-labelledby="scenes-heading">
          <motion.div
            className="mb-8 text-center"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.45 }}
          >
            <p className="text-sm font-semibold tracking-[0.16em] text-green-700 uppercase dark:text-green-300">
              Model development
            </p>
            <h2
              id="scenes-heading"
              className="mt-2 text-2xl font-bold tracking-tight text-green-950 dark:text-green-100 sm:text-3xl"
            >
              Behind the scenes
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 gap-5 md:grid-cols-3"
            variants={staggeredCards}
            initial={shouldReduceMotion ? false : 'hidden'}
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            {methodology.map(({ title, description, icon: Icon }) => (
              <motion.div
                key={title}
                variants={shouldReduceMotion ? {} : cardEntrance}
                {...reducedMotionProps}
              >
                <TiltCard as="article" className="h-full p-6 sm:p-7">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-xl font-semibold text-green-950 dark:text-green-100">
                    {title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-green-800 dark:text-gray-300">
                    {description}
                  </p>
                </TiltCard>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <div className="mt-10 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg bg-green-700 px-6 py-3 text-sm font-semibold text-white transition-none hover:bg-green-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
          >
            Try it now
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </main>
  )
}
