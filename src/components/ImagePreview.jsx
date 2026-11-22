import { Crop as CropIcon, LoaderCircle, RotateCcw, X } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

export default function ImagePreview({
  file,
  src,
  onRemove,
  onPredict,
  onCrop,
  onReset,
  isLoading = false,
}) {
  const shouldReduceMotion = useReducedMotion()

  function handleRemove(event) {
    event.stopPropagation()
    onRemove()
  }

  function handlePredict(event) {
    event.stopPropagation()
    if (!isLoading) onPredict?.(file)
  }

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="relative overflow-hidden rounded-xl">
        <motion.img
          key={src}
          src={src}
          alt={`Selected leaf: ${file.name}`}
          className="mx-auto h-56 w-full object-cover"
          initial={
            shouldReduceMotion
              ? false
              : { rotateY: 75, scale: 0.82, opacity: 0 }
          }
          animate={{ rotateY: 0, scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 160, damping: 18 }}
        />
        <AnimatePresence>
          {isLoading && (
            <motion.div
              className="pointer-events-none absolute inset-0 overflow-hidden bg-green-900/10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.15 }}
              aria-hidden="true"
            >
              {!shouldReduceMotion && (
                <motion.div
                  className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_49.5%,color-mix(in_srgb,var(--brand-400)_95%,transparent)_50%,transparent_50.5%)] shadow-[0_0_14px_4px_color-mix(in_srgb,var(--brand-400)_45%,transparent)]"
                  animate={{ y: ['-100%', '100%', '-100%'] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />
              )}
              <motion.p
                className="absolute right-3 bottom-3 rounded-full bg-green-900/85 px-3 py-1 text-xs font-semibold text-white"
                animate={
                  shouldReduceMotion
                    ? { opacity: 1, scale: 1 }
                    : { opacity: [0.65, 1, 0.65], scale: [0.98, 1, 0.98] }
                }
                transition={{
                  duration: shouldReduceMotion ? 0 : 1.2,
                  repeat: shouldReduceMotion ? 0 : Infinity,
                  ease: 'easeInOut',
                }}
              >
                Analyzing...
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          type="button"
          onClick={handleRemove}
          disabled={isLoading}
          className="absolute right-2 top-2 rounded-full bg-green-900 p-1.5 text-white transition-none hover:bg-green-700"
          aria-label="Remove selected image"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="min-w-0 truncate text-sm text-green-950 dark:text-gray-200">
          {file.name}
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={onCrop}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 rounded-lg border border-green-300 px-2.5 py-1.5 text-xs font-semibold text-green-950 shadow-[0_3px_0_var(--color-green-300)] transition active:translate-y-0.5 active:shadow-none disabled:opacity-60 dark:border-green-700 dark:text-green-100 dark:shadow-[0_3px_0_var(--color-green-900)]"
          >
            <CropIcon className="h-3.5 w-3.5" aria-hidden="true" />
            Crop
          </button>
          <button
            type="button"
            onClick={onReset}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 rounded-lg border border-green-300 px-2.5 py-1.5 text-xs font-semibold text-green-950 shadow-[0_3px_0_var(--color-green-300)] transition active:translate-y-0.5 active:shadow-none disabled:opacity-60 dark:border-green-700 dark:text-green-100 dark:shadow-[0_3px_0_var(--color-green-900)]"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Reset
          </button>
        </div>
      </div>
      <button
        type="button"
        onClick={handlePredict}
        disabled={isLoading}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-green-700 px-6 py-3 text-sm font-semibold text-white transition-none hover:bg-green-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700 disabled:cursor-wait disabled:opacity-70"
      >
        {isLoading && !shouldReduceMotion && (
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="flex"
          >
            <LoaderCircle className="h-4 w-4" />
          </motion.span>
        )}
        {isLoading ? 'Analyzing...' : 'Predict Disease'}
      </button>
    </div>
  )
}
