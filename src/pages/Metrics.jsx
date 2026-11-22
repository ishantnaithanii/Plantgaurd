import { useEffect, useRef } from 'react'
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'framer-motion'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import PageHeader from '../components/PageHeader'
import metrics from '../data/metrics'

const statDefinitions = [
  { label: 'Accuracy', key: 'overallAccuracy' },
  { label: 'Precision', key: 'macroPrecision' },
  { label: 'Recall', key: 'macroRecall' },
  { label: 'F1', key: 'macroF1' },
]

function MetricCard({ label, value, shouldReduceMotion }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const count = useMotionValue(shouldReduceMotion ? Math.round(value * 100) : 0)
  const displayValue = useTransform(count, (current) => Math.round(current))

  useEffect(() => {
    if (!inView || shouldReduceMotion) return undefined

    const controls = animate(0, Math.round(value * 100), {
      duration: 1,
      ease: 'easeOut',
      onUpdate: count.set,
    })
    return () => controls.stop()
  }, [count, inView, shouldReduceMotion, value])

  return (
    <motion.article
      ref={ref}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.35 }}
      className="rounded-2xl border border-white/60 bg-white/60 p-5 text-center shadow-lg shadow-green-950/5 backdrop-blur-xl dark:border-green-800 dark:bg-green-950/60"
    >
      <p className="text-sm font-semibold text-green-800 dark:text-green-300">
        {label}
      </p>
      <p className="mt-2 text-3xl font-bold tabular-nums text-green-950 dark:text-green-100">
        <motion.span>{displayValue}</motion.span>%
      </p>
    </motion.article>
  )
}

function ConfusionMatrix({ classes, matrix }) {
  const largestCount = Math.max(1, ...matrix.flat())
  const columns = `minmax(5rem, 1.5fr) repeat(${classes.length}, minmax(2.75rem, 1fr))`

  return (
    <div className="overflow-x-auto">
      <div
        className="mx-auto grid min-w-[34rem] gap-1.5 text-center text-xs sm:gap-2 sm:text-sm"
        style={{ gridTemplateColumns: columns }}
        role="table"
        aria-label="Confusion matrix; rows are actual classes and columns are predicted classes"
      >
        <div role="columnheader" className="flex items-end justify-center p-2 text-green-800 dark:text-green-300">
          Actual ↓
          <span className="sr-only">Predicted class columns</span>
        </div>
        {classes.map((item) => (
          <div
            key={`column-${item.name}`}
            role="columnheader"
            className="flex min-h-12 items-end justify-center p-1 font-semibold text-green-900 dark:text-green-100"
          >
            <span className="[writing-mode:vertical-rl] rotate-180 sm:[writing-mode:horizontal-tb]">
              {item.name}
            </span>
          </div>
        ))}
        {matrix.map((row, rowIndex) => (
          <div key={`row-${classes[rowIndex].name}`} className="contents" role="row">
            <div
              role="rowheader"
              className="flex items-center justify-end px-2 py-3 text-right font-semibold text-green-900 dark:text-green-100"
            >
              {classes[rowIndex].name}
            </div>
            {row.map((count, columnIndex) => {
              const intensity = Math.round((count / largestCount) * 78) + 10
              const isStrong = intensity > 52
              const label = `${classes[rowIndex].name} actual, ${classes[columnIndex].name} predicted: ${count}`

              return (
                <div
                  key={`${rowIndex}-${columnIndex}`}
                  role="cell"
                  title={label}
                  aria-label={label}
                  className={`flex min-h-12 items-center justify-center rounded-lg border border-green-200/60 font-semibold transition-colors dark:border-green-800/60 ${
                    isStrong
                      ? 'text-white dark:text-green-950'
                      : 'text-green-950 dark:text-green-100'
                  }`}
                  style={{
                    backgroundColor: `color-mix(in srgb, var(--color-green-700) ${intensity}%, transparent)`,
                  }}
                >
                  {count}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Metrics() {
  const shouldReduceMotion = useReducedMotion()
  const chartData = metrics.classes.map(({ name, precision, recall, f1 }) => ({
    name,
    Precision: precision * 100,
    Recall: recall * 100,
    'F1-score': f1 * 100,
  }))

  return (
    <main className="flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-7xl">
        <PageHeader
          title="Model Performance"
          subtitle="How well the model performs on the held-out test set."
        />

        <div
          className="mb-8 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-100"
          role="note"
        >
          Values are placeholders until the model is trained.
        </div>

        <section
          className="grid grid-cols-2 gap-4 lg:grid-cols-4"
          aria-label="Overall model metrics"
        >
          {statDefinitions.map(({ label, key }) => (
            <MetricCard
              key={key}
              label={label}
              value={metrics[key]}
              shouldReduceMotion={shouldReduceMotion}
            />
          ))}
        </section>

        <section className="mt-8 rounded-2xl border border-white/60 bg-white/60 p-4 shadow-lg shadow-green-950/5 backdrop-blur-xl dark:border-green-800 dark:bg-green-950/60 sm:p-6">
          <h2 className="mb-4 text-xl font-semibold text-green-950 dark:text-green-100">
            Per-class metrics
          </h2>
          <div className="h-80 w-full" aria-label="Grouped bar chart of precision, recall, and F1-score per class">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
                <CartesianGrid stroke="var(--color-green-200)" strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fill: 'var(--color-green-900)', fontSize: 12 }} />
                <YAxis domain={[0, 100]} unit="%" tick={{ fill: 'var(--color-green-900)', fontSize: 12 }} />
                <Tooltip
                  formatter={(value) => [`${Number(value).toFixed(1)}%`]}
                  contentStyle={{
                    backgroundColor: 'var(--brand-50)',
                    borderColor: 'var(--brand-300)',
                    borderRadius: '0.75rem',
                  }}
                />
                <Legend />
                <Bar dataKey="Precision" fill="var(--color-green-700)" radius={[4, 4, 0, 0]} isAnimationActive={!shouldReduceMotion} />
                <Bar dataKey="Recall" fill="var(--color-green-500)" radius={[4, 4, 0, 0]} isAnimationActive={!shouldReduceMotion} />
                <Bar dataKey="F1-score" fill="var(--color-green-300)" radius={[4, 4, 0, 0]} isAnimationActive={!shouldReduceMotion} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-white/60 bg-white/60 p-4 shadow-lg shadow-green-950/5 backdrop-blur-xl dark:border-green-800 dark:bg-green-950/60 sm:p-6">
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-green-950 dark:text-green-100">
              Confusion matrix
            </h2>
            <p className="mt-1 text-sm text-green-800 dark:text-gray-300">
              Rows show actual classes; columns show predicted classes.
            </p>
          </div>
          <ConfusionMatrix
            classes={metrics.classes}
            matrix={metrics.confusionMatrix}
          />
        </section>
      </div>
    </main>
  )
}
