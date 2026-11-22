import { useState } from 'react'
import { createPortal } from 'react-dom'
import Cropper from 'react-easy-crop'
import 'react-easy-crop/react-easy-crop.css'
import { motion, useReducedMotion } from 'framer-motion'
import { getCroppedFile } from '../utils/cropImage'

const aspectOptions = [
  { label: '1:1', value: 1 },
  { label: '4:3', value: 4 / 3 },
  { label: '3:4', value: 3 / 4 },
]

export default function CropModal({
  imageUrl,
  fileName = 'plant-image',
  onCancel,
  onDone,
}) {
  const shouldReduceMotion = useReducedMotion()
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [aspect, setAspect] = useState(1)
  const [pixelCrop, setPixelCrop] = useState(null)
  const [error, setError] = useState('')
  const [isApplying, setIsApplying] = useState(false)

  async function handleApply() {
    if (!pixelCrop) {
      setError('Adjust the image before applying the crop.')
      return
    }

    setIsApplying(true)
    setError('')
    try {
      const croppedFile = await getCroppedFile(
        imageUrl,
        pixelCrop,
        rotation,
        fileName,
      )
      onDone(croppedFile)
    } catch (cropError) {
      console.error('Could not crop the selected image.', cropError)
      setError('Could not crop the image. Please try again.')
    } finally {
      setIsApplying(false)
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center overflow-y-auto bg-green-950/80 p-3 backdrop-blur-sm sm:p-5"
      onClick={(event) => {
        if (event.target === event.currentTarget && !isApplying) onCancel()
      }}
    >
      <motion.section
        role="dialog"
        aria-modal="true"
        aria-labelledby="crop-modal-title"
        className="my-auto w-full max-w-2xl rounded-2xl border border-white/50 bg-white/95 p-4 shadow-2xl backdrop-blur-xl dark:border-green-800 dark:bg-green-950 sm:p-6"
        initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.22, ease: 'easeOut' }}
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2
            id="crop-modal-title"
            className="text-xl font-semibold text-green-950 dark:text-green-100"
          >
            Crop your image
          </h2>
          <button
            type="button"
            onClick={onCancel}
            disabled={isApplying}
            className="rounded-lg border border-green-300 px-3 py-1.5 text-sm font-semibold text-green-950 shadow-[0_3px_0_var(--color-green-300)] transition active:translate-y-0.5 active:shadow-none disabled:opacity-60 dark:border-green-700 dark:text-green-100 dark:shadow-[0_3px_0_var(--color-green-900)]"
          >
            Skip
          </button>
        </div>

        <div className="relative h-[min(56vh,420px)] min-h-56 overflow-hidden rounded-xl bg-green-950">
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspect}
            minZoom={1}
            maxZoom={3}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            onCropComplete={(_, areaPixels) => setPixelCrop(areaPixels)}
            restrictPosition
          />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium text-green-950 dark:text-green-100">
            Zoom: {zoom.toFixed(1)}×
            <input
              type="range"
              min="1"
              max="3"
              step="0.1"
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
              className="mt-2 block w-full accent-green-700"
              aria-label="Zoom"
            />
          </label>
          <label className="text-sm font-medium text-green-950 dark:text-green-100">
            Rotation: {rotation}°
            <input
              type="range"
              min="-180"
              max="180"
              step="1"
              value={rotation}
              onChange={(event) => setRotation(Number(event.target.value))}
              className="mt-2 block w-full accent-green-700"
              aria-label="Rotation"
            />
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="mr-1 text-sm font-medium text-green-950 dark:text-green-100">
            Aspect ratio
          </span>
          {aspectOptions.map(({ label, value }) => (
            <button
              key={label}
              type="button"
              onClick={() => setAspect(value)}
              aria-pressed={aspect === value}
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold shadow-[0_3px_0_var(--color-green-300)] transition active:translate-y-0.5 active:shadow-none dark:shadow-[0_3px_0_var(--color-green-900)] ${
                aspect === value
                  ? 'bg-green-800 text-white dark:bg-green-700'
                  : 'border border-green-300 bg-white text-green-950 dark:border-green-700 dark:bg-green-950 dark:text-green-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {error && (
          <p className="mt-3 text-sm text-red-700 dark:text-red-300" role="alert">
            {error}
          </p>
        )}

        <div className="mt-5 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isApplying}
            className="rounded-lg border border-green-300 px-5 py-2.5 text-sm font-semibold text-green-950 shadow-[0_3px_0_var(--color-green-300)] transition active:translate-y-0.5 active:shadow-none disabled:opacity-60 dark:border-green-700 dark:text-green-100 dark:shadow-[0_3px_0_var(--color-green-900)]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            disabled={isApplying}
            className="rounded-lg bg-green-700 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_0_var(--color-green-900)] transition active:translate-y-0.5 active:shadow-none disabled:cursor-wait disabled:opacity-60 dark:bg-green-700 dark:shadow-[0_4px_0_var(--color-green-900)]"
          >
            {isApplying ? 'Applying…' : 'Apply Crop'}
          </button>
        </div>
      </motion.section>
    </div>,
    document.body,
  )
}
