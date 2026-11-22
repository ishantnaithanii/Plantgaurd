import { useEffect, useMemo, useState } from 'react'
import { BookmarkPlus, Check, Download, Leaf, ShieldCheck, Sprout } from 'lucide-react'
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion'
import { generateReport } from '../utils/generateReport'
import toast from 'react-hot-toast'
import TopPredictions from './TopPredictions'
import { addToHistory, makeThumbnail } from '../utils/history'
import ReadAloud from './ReadAloud'

const treatmentIcons = [Sprout, ShieldCheck, Leaf]
const treatmentsContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
}
const treatmentItem = {
  hidden: { opacity: 0, x: -18 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 220, damping: 22 },
  },
}

export default function PredictionResult({
  diseaseName,
  scientificName,
  confidence,
  predictions,
  treatments = [],
  imageUrl,
  fileName,
}) {
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const [isSavingToHistory, setIsSavingToHistory] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [reportError, setReportError] = useState('')
  const shouldReduceMotion = useReducedMotion()
  const confidenceValue = Number.isFinite(confidence)
    ? Math.min(100, Math.max(0, confidence))
    : 0
  const speechResult = useMemo(
    () => ({ diseaseName, confidence, treatments }),
    [diseaseName, confidence, treatments],
  )
  const confidenceLevel =
    confidenceValue >= 80
      ? 'High confidence'
      : confidenceValue >= 60
        ? 'Medium confidence'
        : 'Low confidence'
  const confidenceBadgeStyles =
    confidenceValue >= 80
      ? 'bg-green-100 text-green-900 dark:bg-green-800 dark:text-green-100'
      : confidenceValue >= 60
        ? 'bg-amber-100 text-amber-900 dark:bg-amber-900 dark:text-amber-100'
        : 'bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100'
  const confidenceProgress = useMotionValue(
    shouldReduceMotion ? confidenceValue : 0,
  )
  const springProgress = useSpring(confidenceProgress, {
    stiffness: 70,
    damping: 18,
  })
  const confidenceNumber = useTransform(springProgress, (value) =>
    `${Math.round(value)}%`,
  )
  useEffect(() => {
    if (shouldReduceMotion) {
      confidenceProgress.set(confidenceValue)
      return undefined
    }

    const controls = animate(confidenceProgress, confidenceValue, {
      type: 'spring',
      stiffness: 70,
      damping: 18,
    })
    return () => controls.stop()
  }, [confidenceProgress, confidenceValue, shouldReduceMotion])

  async function handleSaveToHistory() {
    setIsSavingToHistory(true)
    try {
      const thumbnail = await makeThumbnail(imageUrl)
      addToHistory({
        disease: diseaseName,
        scientificName,
        confidence,
        treatments,
        thumbnail,
      })
      setIsSaved(true)
      toast.success('Prediction saved to history')
    } catch (historyError) {
      console.error('Could not save prediction history.', historyError)
      toast.error('Could not save prediction to history')
    } finally {
      setIsSavingToHistory(false)
    }
  }

  async function handleDownloadReport() {
    setIsGeneratingReport(true)
    setReportError('')
    try {
      await generateReport({
        result: {
          diseaseName,
          scientificName,
          confidence,
          confidenceLevel,
          predictions,
          treatments,
        },
        imageUrl,
        fileName,
      })
      toast.success('PDF downloaded')
    } catch (generationError) {
      console.error('Could not generate the PlantGuard report.', generationError)
      setReportError('Could not generate the report. Please try again.')
    } finally {
      setIsGeneratingReport(false)
    }

  }

  function handleRetakePhoto() {
    document.getElementById('upload')?.scrollIntoView({
      behavior: shouldReduceMotion ? 'auto' : 'smooth',
      block: 'start',
    })
  }

  return (
    <motion.section
      className="mx-auto w-full max-w-3xl text-left"
      aria-labelledby="prediction-result-title"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.35, ease: 'easeOut' }}
    >
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        <motion.div
          className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full p-2"
          style={{
            background: `conic-gradient(var(--brand-700) ${confidenceValue}%, var(--confidence-track) ${confidenceValue}%)`,
            scale: shouldReduceMotion ? 1 : undefined,
          }}
          initial={shouldReduceMotion ? false : { scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: 'spring',
            stiffness: 150,
            damping: 18,
            duration: shouldReduceMotion ? 0 : undefined,
          }}
          role="img"
          aria-label={`Confidence ${Math.round(confidenceValue)}%`}
        >
          <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-white dark:bg-gray-950">
            <motion.span className="text-2xl font-bold text-green-950 dark:text-green-100">
              {confidenceNumber}
            </motion.span>
            <span className="text-xs text-green-800 dark:text-gray-300">confidence</span>
          </div>
        </motion.div>

        <div className="w-full text-center sm:text-left">
          <p className="text-sm font-semibold tracking-wide text-green-700 uppercase dark:text-green-300">
            Prediction result
          </p>
          <div className="mt-1 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <h2
              id="prediction-result-title"
              className="text-2xl font-bold text-green-950 dark:text-green-100"
            >
              {diseaseName}
            </h2>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${confidenceBadgeStyles}`}
            >
              {confidenceLevel}
            </span>
          </div>
          <p className="mt-1 text-sm italic text-green-800 dark:text-gray-300">{scientificName}</p>

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium text-green-950 dark:text-gray-200">
                Prediction confidence
              </span>
              <span className="font-semibold text-green-800 dark:text-green-300">
                {Math.round(confidenceValue)}%
              </span>
            </div>
            <div
              className="h-2.5 w-full overflow-hidden rounded-full bg-green-100 dark:bg-green-900"
              role="progressbar"
              aria-label="Prediction confidence"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(confidenceValue)}
            >
              <motion.div
                className="h-full origin-left rounded-full bg-green-600"
                initial={shouldReduceMotion ? false : { scaleX: 0 }}
                animate={{ scaleX: confidenceValue / 100 }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.9,
                  delay: shouldReduceMotion ? 0 : 0.15,
                  ease: 'easeOut',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {confidenceValue < 60 && (
        <div
          className="mt-6 rounded-xl border border-amber-300 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/60"
          role="alert"
        >
          <p className="text-sm leading-6 text-amber-950 dark:text-amber-100">
            Low confidence. Try a clearer, closer photo of a single leaf.
          </p>
          <button
            type="button"
            onClick={handleRetakePhoto}
            className="mt-3 rounded-lg bg-amber-800 px-4 py-2 text-sm font-semibold text-white shadow-[0_3px_0_var(--color-amber-950)] transition active:translate-y-0.5 active:shadow-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
          >
            Retake photo
          </button>
        </div>
      )}

      <TopPredictions predictions={predictions} />

      <div className="mt-8 border-t border-green-100 pt-6 dark:border-green-800">
        <h3 className="text-lg font-semibold text-green-950 dark:text-green-100">
          Treatment Suggestions
        </h3>
        {treatments.length > 0 ? (
          <motion.ul
            className="mt-4 space-y-3"
            variants={treatmentsContainer}
            initial={shouldReduceMotion ? false : 'hidden'}
            animate="visible"
          >
            {treatments.map((treatment, index) => {
              const Icon = treatment.icon ?? treatmentIcons[index % treatmentIcons.length]
              const title = typeof treatment === 'string' ? treatment : treatment.title
              const description =
                typeof treatment === 'string' ? null : treatment.description

              return (
                <motion.li
                  key={`${title}-${index}`}
                  className="flex items-start gap-3 rounded-xl bg-green-50 p-4 dark:bg-green-900/60"
                  variants={
                    shouldReduceMotion
                      ? { hidden: {}, visible: {} }
                      : treatmentItem
                  }
                >
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-medium text-green-950 dark:text-green-100">{title}</p>
                    {description && (
                      <p className="mt-1 text-sm leading-6 text-green-800 dark:text-gray-300">
                        {description}
                      </p>
                    )}
                  </div>
                </motion.li>
              )
            })}
          </motion.ul>
        ) : (
          <p className="mt-3 text-sm text-green-800 dark:text-gray-300">
            No treatment suggestions are available.
          </p>
        )}
        <div className="mt-6">
          <div className="flex flex-wrap gap-3">
            <ReadAloud
              result={speechResult}
              lang="en-US"
            />
            <button
              type="button"
              onClick={handleDownloadReport}
              disabled={isGeneratingReport}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-700 px-5 py-3 text-sm font-semibold text-white shadow-[0_4px_0_var(--color-green-900)] transition-none hover:bg-green-900 active:translate-y-0.5 active:shadow-[0_2px_0_var(--color-green-900)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700 disabled:cursor-wait disabled:opacity-70"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              {isGeneratingReport ? 'Generating PDF…' : 'Download Report (PDF)'}
            </button>
            <button
              type="button"
              onClick={handleSaveToHistory}
              disabled={isSaved || isSavingToHistory}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-green-300 bg-white px-5 py-3 text-sm font-semibold text-green-900 shadow-[0_4px_0_var(--color-green-300)] transition active:translate-y-0.5 active:shadow-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700 disabled:cursor-default disabled:opacity-70 dark:border-green-700 dark:bg-green-950 dark:text-green-100 dark:shadow-[0_4px_0_var(--color-green-900)]"
            >
              {isSaved ? (
                <Check className="h-4 w-4" aria-hidden="true" />
              ) : (
                <BookmarkPlus className="h-4 w-4" aria-hidden="true" />
              )}
              {isSaved
                ? 'Saved'
                : isSavingToHistory
                  ? 'Saving…'
                  : 'Save to history'}
            </button>
          </div>
          {reportError && (
            <p className="mt-2 text-sm text-red-700 dark:text-red-300" role="alert">
              {reportError}
            </p>
          )}
        </div>
      </div>
    </motion.section>
  )
}
