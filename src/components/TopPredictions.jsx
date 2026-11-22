import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

function getChartColors() {
  const styles = getComputedStyle(document.documentElement)
  return {
    top: styles.getPropertyValue('--color-green-700').trim(),
    other: styles.getPropertyValue('--color-green-300').trim(),
  }
}

function PredictionsTooltip({ active, payload }) {
  if (!active || !payload?.length) return null

  const { label, score } = payload[0].payload
  return (
    <div className="rounded-lg border border-green-200 bg-white px-3 py-2 text-sm shadow-lg dark:border-green-700 dark:bg-green-950">
      <p className="font-semibold text-green-950 dark:text-green-100">{label}</p>
      <p className="text-green-800 dark:text-green-300">{score}%</p>
    </div>
  )
}

export default function TopPredictions({ predictions }) {
  const [colors, setColors] = useState(getChartColors)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    const observer = new MutationObserver(() => setColors(getChartColors()))
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })
    return () => observer.disconnect()
  }, [])

  if (!Array.isArray(predictions) || predictions.length === 0) return null

  const normalizedPredictions = predictions.filter(
    ({ label, score }) =>
      typeof label === 'string' &&
      Number.isFinite(score) &&
      score >= 0,
  )
  if (normalizedPredictions.length === 0) return null

  return (
    <section
      className="mt-6 rounded-xl bg-green-50/80 p-4 dark:bg-green-900/40"
      aria-label="Top predictions"
    >
      <h3 className="mb-3 text-sm font-semibold text-green-950 dark:text-green-100">
        Top predictions
      </h3>
      <div className="h-[150px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={normalizedPredictions}
            layout="vertical"
            margin={{ top: 2, right: 38, bottom: 2, left: 0 }}
          >
            <XAxis type="number" domain={[0, 100]} hide />
            <YAxis
              type="category"
              dataKey="label"
              width={100}
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'currentColor', fontSize: 12 }}
              className="text-green-900 dark:text-green-100"
            />
            <Tooltip
              content={<PredictionsTooltip />}
              cursor={{ fill: 'var(--color-green-100)', opacity: 0.6 }}
            />
            <Bar
              dataKey="score"
              radius={[0, 6, 6, 0]}
              isAnimationActive={!shouldReduceMotion}
              animationDuration={700}
            >
              {normalizedPredictions.map((prediction, index) => (
                <Cell
                  key={`${prediction.label}-${index}`}
                  fill={index === 0 ? colors.top : colors.other}
                />
              ))}
              <LabelList
                dataKey="score"
                position="right"
                formatter={(score) => `${score}%`}
                className="fill-green-900 dark:fill-green-100"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
