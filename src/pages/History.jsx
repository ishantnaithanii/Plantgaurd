import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ChevronDown, Leaf, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { clearHistory, getHistory, removeFromHistory } from '../utils/history'

function confidenceBadge(confidence) {
  if (confidence >= 80) {
    return 'bg-green-100 text-green-900 dark:bg-green-800 dark:text-green-100'
  }
  if (confidence >= 60) {
    return 'bg-amber-100 text-amber-900 dark:bg-amber-900 dark:text-amber-100'
  }
  return 'bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100'
}

function treatmentText(treatment) {
  return typeof treatment === 'string' ? treatment : treatment?.title
}

export default function History() {
  const [historyState, setHistoryState] = useState(() => {
    try {
      return { entries: getHistory(), error: null }
    } catch (error) {
      return { entries: [], error }
    }
  })
  const { entries, error: loadError } = historyState
  const [expandedId, setExpandedId] = useState(null)
  const [isConfirmingClear, setIsConfirmingClear] = useState(false)
  const clearConfirmationTimer = useRef(null)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    if (loadError) {
      console.error('Could not load prediction history.', loadError)
      toast.error('Could not load prediction history')
    }
  }, [loadError])

  useEffect(() => {
    return () => window.clearTimeout(clearConfirmationTimer.current)
  }, [])

  function handleRemove(id) {
    try {
      setHistoryState({ entries: removeFromHistory(id), error: null })
      if (expandedId === id) setExpandedId(null)
      toast.success('Prediction removed')
    } catch (error) {
      console.error('Could not remove prediction history entry.', error)
      toast.error('Could not remove prediction')
    }
  }

  function handleClearHistory() {
    if (!isConfirmingClear) {
      setIsConfirmingClear(true)
      clearConfirmationTimer.current = window.setTimeout(
        () => setIsConfirmingClear(false),
        4000,
      )
      return
    }

    window.clearTimeout(clearConfirmationTimer.current)
    try {
      clearHistory()
      setHistoryState({ entries: [], error: null })
      setExpandedId(null)
      setIsConfirmingClear(false)
      toast.success('History cleared')
    } catch (error) {
      console.error('Could not clear prediction history.', error)
      toast.error('Could not clear prediction history')
      setIsConfirmingClear(false)
    }
  }

  return (
    <main className="flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-7xl">
        <PageHeader
          title="History"
          subtitle="Your past predictions (saved on this device)."
        />

        {entries.length > 0 && (
          <div className="mb-5 flex justify-end">
            <button
              type="button"
              onClick={handleClearHistory}
              className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white/70 px-4 py-2 text-sm font-semibold text-red-700 shadow-sm transition hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 dark:border-red-900 dark:bg-gray-950/70 dark:text-red-300 dark:hover:bg-red-950"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              {isConfirmingClear ? 'Click again to clear all' : 'Clear all'}
            </button>
          </div>
        )}

        {entries.length === 0 ? (
          <section className="rounded-2xl border border-green-100 bg-white/60 px-6 py-14 text-center shadow-lg shadow-green-950/5 backdrop-blur-xl dark:border-green-900 dark:bg-green-950/60">
            <Leaf className="mx-auto h-12 w-12 text-green-700 dark:text-green-300" aria-hidden="true" />
            <h2 className="mt-4 text-xl font-semibold text-green-950 dark:text-green-100">
              No saved predictions yet
            </h2>
            <p className="mt-2 text-green-800 dark:text-gray-300">
              Save a result to find it here later.
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex rounded-xl bg-green-800 px-5 py-3 text-sm font-semibold text-white shadow-[0_4px_0_var(--color-green-950)] transition active:translate-y-0.5 active:shadow-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-700 dark:bg-green-700"
            >
              Go to PlantGuard
            </Link>
          </section>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
          >
            <AnimatePresence initial={false}>
              {entries.map((entry) => {
                const isExpanded = expandedId === entry.id
                const date = new Date(entry.date)
                const formattedDate = Number.isNaN(date.getTime())
                  ? 'Unknown date'
                  : date.toLocaleString()

                return (
                  <motion.article
                    key={entry.id}
                    layout
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
                    className="overflow-hidden rounded-2xl border border-green-100 bg-white/60 shadow-lg shadow-green-950/5 backdrop-blur-xl dark:border-green-900 dark:bg-green-950/60"
                  >
                    <div className="flex gap-4 p-4">
                      {entry.thumbnail ? (
                        <img
                          src={entry.thumbnail}
                          alt={`${entry.disease} prediction`}
                          className="h-24 w-24 shrink-0 rounded-xl bg-green-50 object-cover dark:bg-green-900"
                        />
                      ) : (
                        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200">
                          <Leaf className="h-8 w-8" aria-hidden="true" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h2 className="font-semibold text-green-950 dark:text-green-100">
                            {entry.disease}
                          </h2>
                          <button
                            type="button"
                            onClick={() => handleRemove(entry.id)}
                            className="rounded-lg p-1.5 text-green-700 hover:bg-red-50 hover:text-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700 dark:text-green-300 dark:hover:bg-red-950 dark:hover:text-red-300"
                            aria-label={`Delete ${entry.disease} prediction`}
                          >
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </div>
                        {entry.scientificName && (
                          <p className="mt-0.5 truncate text-sm italic text-green-800 dark:text-gray-300">
                            {entry.scientificName}
                          </p>
                        )}
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${confidenceBadge(entry.confidence)}`}>
                            {entry.confidence}% confidence
                          </span>
                        </div>
                        <time className="mt-2 block text-xs text-green-700 dark:text-gray-400" dateTime={entry.date}>
                          {formattedDate}
                        </time>
                      </div>
                    </div>

                    <div className="border-t border-green-100 dark:border-green-900">
                      <button
                        type="button"
                        onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                        aria-expanded={isExpanded}
                        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-green-900 hover:bg-green-50/70 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-green-700 dark:text-green-100 dark:hover:bg-green-900/40"
                      >
                        View treatments
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          aria-hidden="true"
                        />
                      </button>
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={shouldReduceMotion ? false : { height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
                            className="overflow-hidden"
                          >
                            <ul className="space-y-2 px-4 pb-4 text-sm leading-6 text-green-800 dark:text-gray-300">
                              {entry.treatments?.length ? (
                                entry.treatments.map((treatment, index) => (
                                  <li key={`${treatmentText(treatment)}-${index}`}>
                                    <span className="font-medium text-green-950 dark:text-green-100">
                                      {treatmentText(treatment)}
                                    </span>
                                    {typeof treatment === 'object' && treatment.description && (
                                      <p>{treatment.description}</p>
                                    )}
                                  </li>
                                ))
                              ) : (
                                <li>No treatment suggestions were saved.</li>
                              )}
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.article>
                )
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </main>
  )
}
