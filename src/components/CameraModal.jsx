import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Camera, X } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'

function getCameraError(error) {
  if (
    error?.name === 'NotAllowedError' ||
    error?.name === 'PermissionDeniedError' ||
    error?.name === 'SecurityError'
  ) {
    return 'Camera access was denied. Allow camera permission in your browser settings and try again.'
  }

  if (
    error?.name === 'NotFoundError' ||
    error?.name === 'DevicesNotFoundError'
  ) {
    return 'No camera was found on this device.'
  }

  return 'The camera could not be started. Please check your camera and try again.'
}

export default function CameraModal({ onCapture, onClose }) {
  const shouldReduceMotion = useReducedMotion()
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [isReady, setIsReady] = useState(false)
  const [isCapturing, setIsCapturing] = useState(false)

  useEffect(() => {
    let isActive = true

    async function startCamera() {
      // Camera access requires HTTPS or localhost.
      if (!navigator.mediaDevices?.getUserMedia) {
        setErrorMessage('Camera capture is not supported by this browser.')
        return
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        })

        if (!isActive) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }

        streamRef.current = stream
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        if (isActive) setIsReady(true)
      } catch (cameraError) {
        streamRef.current?.getTracks().forEach((track) => track.stop())
        streamRef.current = null
        if (isActive) setErrorMessage(getCameraError(cameraError))
      }
    }

    startCamera()

    return () => {
      isActive = false
      streamRef.current?.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
  }, [])

  async function handleCapture() {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas || !video.videoWidth || !video.videoHeight) return

    setIsCapturing(true)
    try {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const context = canvas.getContext('2d')
      if (!context) throw new Error('Could not access the photo canvas.')
      context.drawImage(video, 0, 0, canvas.width, canvas.height)

      const photoBlob = await new Promise((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob)
            else reject(new Error('Could not encode the captured photo.'))
          },
          'image/jpeg',
          0.92,
        )
      })

      onCapture(new File([photoBlob], 'leaf-photo.jpg', { type: 'image/jpeg' }))
      onClose()
    } catch (captureError) {
      console.error('Could not capture a photo from the camera.', captureError)
      setErrorMessage('Could not capture the photo. Please try again.')
    } finally {
      setIsCapturing(false)
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-green-950/75 p-4 backdrop-blur-sm"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <motion.section
        role="dialog"
        aria-modal="true"
        aria-labelledby="camera-modal-title"
        className="w-full max-w-xl rounded-2xl border border-white/50 bg-white/90 p-5 shadow-2xl backdrop-blur-xl dark:border-green-800 dark:bg-green-950 sm:p-7"
        initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.2, ease: 'easeOut' }}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2
            id="camera-modal-title"
            className="text-xl font-semibold text-green-950 dark:text-green-100"
          >
            Take a leaf photo
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-green-800 transition-none hover:bg-green-100 hover:text-green-950 dark:text-gray-300 dark:hover:bg-green-900 dark:hover:text-white"
            aria-label="Close camera"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {errorMessage ? (
          <div className="rounded-xl bg-green-50 p-5 text-center dark:bg-green-900">
            <p className="text-sm leading-6 text-green-800 dark:text-gray-200" role="alert">
              {errorMessage}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-5 rounded-lg bg-green-700 px-6 py-2.5 text-sm font-semibold text-white transition-none hover:bg-green-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-hidden rounded-xl bg-green-950">
              <video
                ref={videoRef}
                className="aspect-[4/3] w-full object-cover"
                autoPlay
                playsInline
                muted
                aria-label="Live camera preview"
              />
            </div>
            <canvas ref={canvasRef} className="hidden" />
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-green-300 px-5 py-2.5 text-sm font-semibold text-green-950 transition-none hover:bg-green-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700 dark:border-green-700 dark:text-green-100 dark:hover:bg-green-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCapture}
                disabled={!isReady || isCapturing}
                className="inline-flex items-center gap-2 rounded-lg bg-green-700 px-5 py-2.5 text-sm font-semibold text-white transition-none hover:bg-green-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Camera className="h-4 w-4" aria-hidden="true" />
                {isCapturing ? 'Capturing…' : 'Capture'}
              </button>
            </div>
          </>
        )}
      </motion.section>
    </div>,
    document.body,
  )
}
