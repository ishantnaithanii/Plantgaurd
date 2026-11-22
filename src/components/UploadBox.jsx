import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Camera, ImagePlus, CloudUpload } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import toast from 'react-hot-toast'
import CameraModal from './CameraModal'
import healthyImg from '../assets/examples/healthy.png'
import earlyBlightImg from '../assets/examples/early-blight.png'
import lateBlightImg from '../assets/examples/late-blight.jpg'
import leafSpotImg from '../assets/examples/leaf-spot.png'

const MAX_SIZE = 5 * 1024 * 1024

const examples = [
  { label: 'Healthy', src: healthyImg, fileName: 'healthy.png' },
  { label: 'Early Blight', src: earlyBlightImg, fileName: 'early-blight.png' },
  { label: 'Late Blight', src: lateBlightImg, fileName: 'late-blight.jpg' },
  { label: 'Leaf Spot', src: leafSpotImg, fileName: 'leaf-spot.png' },
]

function getErrorMessage(rejections) {
  const code = rejections[0]?.errors[0]?.code
  if (code === 'file-too-large') return 'Image must be 5MB or smaller.'
  if (code === 'file-invalid-type') return 'Only JPG and PNG files are allowed.'
  return 'Could not add that file. Try a JPG or PNG under 5MB.'
}

export default function UploadBox({ onFileSelect }) {
  const [error, setError] = useState('')
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  const applyFile = useCallback((nextFile) => {
    setError('')
    onFileSelect(nextFile)
    toast.success('Image selected')
  }, [onFileSelect])

  const onDrop = useCallback((accepted) => {
    if (accepted[0]) applyFile(accepted[0])
  }, [applyFile])

  const onDropRejected = useCallback((rejections) => {
    const message = getErrorMessage(rejections)
    setError(message)
    toast.error(message)
  }, [])

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    onDropRejected,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxSize: MAX_SIZE,
    multiple: false,
    noClick: true,
    noKeyboard: true,
  })

  async function loadExample(example) {
    try {
      const response = await fetch(example.src)
      if (!response.ok) throw new Error(`Image request failed: ${response.status}`)
      const blob = await response.blob()
      applyFile(new File([blob], example.fileName, { type: blob.type }))
    } catch (loadError) {
      console.error('Could not load the example image.', loadError)
      setError('Could not load that example image. Please try again.')
    }
  }

  return (
    <section className="w-full text-left">
      <motion.div
        {...getRootProps()}
        className={`relative rounded-2xl border-2 border-dashed bg-white px-6 py-10 text-center shadow-sm sm:px-10 sm:py-12 ${
          isDragActive
            ? 'border-green-900 bg-green-100/50 dark:border-green-400 dark:bg-green-900/50'
            : 'border-green-700/40 dark:border-green-700 dark:bg-green-950'
        }`}
        animate={{
          scale: !shouldReduceMotion && isDragActive ? 1.035 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 20,
          duration: shouldReduceMotion ? 0 : undefined,
        }}
      >
        <input {...getInputProps()} />

        <motion.div
          className="pointer-events-none absolute inset-0 rounded-[inherit] bg-green-700/15"
          animate={{ opacity: !shouldReduceMotion && isDragActive ? 1 : 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
          aria-hidden="true"
        />
        <motion.span
          className="relative z-10 mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-950 dark:bg-green-900 dark:text-green-200"
          animate={
            !shouldReduceMotion && isDragActive ? { y: [0, -8, 0] } : { y: 0 }
          }
          transition={
            !shouldReduceMotion && isDragActive
              ? { duration: 0.65, repeat: Infinity, ease: 'easeInOut' }
              : { type: 'spring', stiffness: 300, damping: 18, duration: 0 }
          }
        >
          <CloudUpload className="h-7 w-7" strokeWidth={2} />
        </motion.span>
        <p className="relative z-10 text-lg font-semibold text-green-950 dark:text-green-100">
          {isDragActive
            ? 'Drop your image here'
            : 'Drag and drop your image here'}
        </p>
        <p className="relative z-10 mt-1 text-sm text-green-700 dark:text-green-300">or</p>
        <div className="relative z-10 mt-3 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={open}
            className="inline-flex items-center gap-2 rounded-lg bg-green-700 px-6 py-2.5 text-sm font-semibold text-white transition-none hover:bg-green-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
          >
            <ImagePlus className="h-4 w-4" />
            Choose File
          </button>
          <button
            type="button"
            onClick={() => setIsCameraOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-green-700 px-6 py-2.5 text-sm font-semibold text-white transition-none hover:bg-green-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
          >
            <Camera className="h-4 w-4" />
            Take Photo
          </button>
        </div>
        <p className="relative z-10 mt-4 text-sm text-green-800 dark:text-gray-300">JPG/PNG only · Max 5MB</p>
      </motion.div>

      {isCameraOpen && (
        <CameraModal
          onCapture={applyFile}
          onClose={() => setIsCameraOpen(false)}
        />
      )}

      {error && (
        <p className="mt-3 text-center text-sm text-red-700 dark:text-red-300" role="alert">
          {error}
        </p>
      )}

      <div className="mt-8">
        <h2 className="mb-4 text-center text-sm font-semibold tracking-wide text-green-950 uppercase dark:text-green-100">
          Quick Examples
        </h2>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {examples.map((example) => (
            <li key={example.label}>
              <button
                type="button"
                onClick={() => loadExample(example)}
                className="group w-full text-left focus-visible:rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
              >
                <img
                  src={example.src}
                  alt={`${example.label} leaf example`}
                  className="aspect-square w-full rounded-xl object-cover ring-1 ring-green-900/15 transition-opacity group-hover:opacity-85"
                />
                <span className="mt-2 block text-center text-sm font-medium text-green-950 dark:text-green-100">
                  {example.label}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
