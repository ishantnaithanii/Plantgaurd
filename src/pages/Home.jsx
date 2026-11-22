import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { LoaderCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import CropModal from '../components/CropModal'
import ImagePreview from '../components/ImagePreview'
import PredictionResult from '../components/PredictionResult'
import Reveal from '../components/Reveal'
import TiltCard from '../components/TiltCard'
import UploadBox from '../components/UploadBox'
import CallToAction from '../components/home/CallToAction'
import MiniSteps from '../components/home/MiniSteps'
import PhotoTips from '../components/home/PhotoTips'
import { predictDisease } from '../services/api'

const Hero3D = lazy(() => import('../components/Hero3D'))

export default function Home() {
  const shouldReduceMotion = useReducedMotion()
  const [isDesktop, setIsDesktop] = useState(
    () => window.matchMedia('(min-width: 768px)').matches,
  )
  const [selectedImage, setSelectedImage] = useState(null)
  const [originalImage, setOriginalImage] = useState(null)
  const [isCropOpen, setIsCropOpen] = useState(false)
  const [prediction, setPrediction] = useState(null)
  const [predictionVersion, setPredictionVersion] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const previewUrls = useRef(new Set())

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)')
    const updateDesktop = (event) => setIsDesktop(event.matches)
    mediaQuery.addEventListener('change', updateDesktop)
    return () => mediaQuery.removeEventListener('change', updateDesktop)
  }, [])

  useEffect(
    () => () => {
      previewUrls.current.forEach((url) => URL.revokeObjectURL(url))
      previewUrls.current.clear()
    },
    [],
  )

  const handleFileSelect = useCallback((file) => {
    previewUrls.current.forEach((url) => URL.revokeObjectURL(url))
    previewUrls.current.clear()
    const preview = URL.createObjectURL(file)
    previewUrls.current.add(preview)
    const image = { file, preview }
    setOriginalImage(image)
    setSelectedImage(image)
    setPrediction(null)
    setError('')
    setIsCropOpen(true)
  }, [])

  function revokePreview(url) {
    if (!url || !previewUrls.current.has(url)) return
    URL.revokeObjectURL(url)
    previewUrls.current.delete(url)
  }

  function handleRemoveImage() {
    previewUrls.current.forEach((url) => URL.revokeObjectURL(url))
    previewUrls.current.clear()
    setSelectedImage(null)
    setOriginalImage(null)
    setPrediction(null)
    setError('')
    setIsCropOpen(false)
  }

  function handleCropDone(file) {
    const preview = URL.createObjectURL(file)
    previewUrls.current.add(preview)
    if (selectedImage?.preview !== originalImage?.preview) {
      revokePreview(selectedImage?.preview)
    }
    setSelectedImage({ file, preview })
    setPrediction(null)
    setError('')
    setIsCropOpen(false)
  }

  function handleResetCrop() {
    if (!originalImage) return
    if (selectedImage?.preview !== originalImage.preview) {
      revokePreview(selectedImage?.preview)
    }
    setSelectedImage(originalImage)
    setPrediction(null)
    setError('')
  }

  async function handlePredict(file) {
    setIsLoading(true)
    setPrediction(null)
    setError('')

    try {
      const result = await predictDisease(file)
      setPrediction(result)
      setPredictionVersion((version) => version + 1)
      toast.success('Prediction complete')
    } catch (predictionError) {
      console.error('Could not predict plant disease.', predictionError)
      setError('Prediction failed. Please try again.')
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <section className="mx-auto max-w-7xl">
        <header className="mb-10 grid items-center gap-6 text-center md:grid-cols-2 md:text-left">
          <div>
            <Reveal
              as="p"
              trigger="load"
              className="text-sm font-semibold tracking-[0.18em] text-green-700 uppercase dark:text-green-300"
            >
              Plant disease detection
            </Reveal>
            <Reveal
              as="h1"
              trigger="load"
              delay={0.12}
              className="mt-3 text-3xl font-bold tracking-tight text-green-950 dark:text-green-100 sm:text-4xl"
            >
              Keep your plants healthy
            </Reveal>
            <Reveal
              as="p"
              trigger="load"
              delay={0.24}
              className="mx-auto mt-3 max-w-2xl text-base leading-7 text-green-800 dark:text-gray-300 md:mx-0"
            >
              Upload a clear photo of a plant leaf to get started, or try one of
              the sample images.
            </Reveal>
          </div>
          <div className="hidden h-[320px] md:block">
            {isDesktop && !shouldReduceMotion ? (
              <Suspense fallback={<div className="h-full w-full" aria-hidden="true" />}>
                <Hero3D />
              </Suspense>
            ) : (
              <div className="h-full w-full" aria-hidden="true" />
            )}
          </div>
        </header>

        <div
          id="upload"
          className="grid scroll-mt-28 grid-cols-1 items-start gap-6 lg:grid-cols-3"
        >
          <Reveal className="min-w-0" trigger="load">
            <TiltCard className="h-full p-5 sm:p-6">
              <h2 className="mb-5 text-lg font-semibold text-green-950 dark:text-green-100">
                Upload an image
              </h2>
              <UploadBox onFileSelect={handleFileSelect} />
            </TiltCard>
          </Reveal>

          <Reveal className="min-w-0" trigger="load" delay={0.12}>
            <TiltCard as="section" className="h-full p-5 text-center sm:p-6">
              <h2 className="mb-5 text-left text-lg font-semibold text-green-950 dark:text-green-100">
                Image preview
              </h2>
              {selectedImage ? (
                <ImagePreview
                  file={selectedImage.file}
                  src={selectedImage.preview}
                  onRemove={handleRemoveImage}
                  onCrop={() => setIsCropOpen(true)}
                  onReset={handleResetCrop}
                  onPredict={handlePredict}
                  isLoading={isLoading}
                />
              ) : (
                <div className="flex min-h-56 items-center justify-center rounded-xl border border-dashed border-green-300 bg-green-50 px-5 dark:border-green-800 dark:bg-green-950">
                  <p className="text-sm text-green-800 dark:text-gray-300">
                    Your selected leaf image will appear here.
                  </p>
                </div>
              )}
            </TiltCard>
          </Reveal>

          <Reveal className="min-w-0" trigger="load" delay={0.24}>
            <TiltCard
              as="section"
              maxTilt={1.5}
              className="h-full p-5 sm:p-6 lg:min-h-[700px]"
            >
              <h2 className="mb-5 text-lg font-semibold text-green-950 dark:text-green-100">
                Disease prediction
              </h2>
              {isLoading ? (
                <div
                  className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-xl bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-300"
                  role="status"
                  aria-live="polite"
                >
                  <LoaderCircle className="h-8 w-8 animate-spin" />
                  <p className="text-sm font-medium">Analyzing your image…</p>
                </div>
              ) : prediction ? (
                <PredictionResult
                  key={predictionVersion}
                  {...prediction}
                  imageUrl={selectedImage.preview}
                  fileName={selectedImage.file.name}
                />
              ) : error ? (
                <p
                  className="rounded-xl bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950 dark:text-red-200"
                  role="alert"
                >
                  {error}
                </p>
              ) : (
                <div className="flex min-h-56 items-center justify-center rounded-xl bg-green-50 px-5 text-center dark:bg-green-950">
                  <p className="text-sm text-green-800 dark:text-gray-300">
                    Select an image and choose Predict Disease to see the result.
                  </p>
                </div>
              )}
            </TiltCard>
          </Reveal>
        </div>
      </section>
      <MiniSteps />
      <PhotoTips />
      <CallToAction />
      {isCropOpen && selectedImage && (
        <CropModal
          imageUrl={selectedImage.preview}
          fileName={selectedImage.file.name}
          onCancel={() => setIsCropOpen(false)}
          onDone={handleCropDone}
        />
      )}
    </main>
  )
}
