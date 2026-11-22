import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Camera, Link2, ScanLine } from 'lucide-react'
import { QRCodeCanvas } from 'qrcode.react'
import toast from 'react-hot-toast'
import PageHeader from '../components/PageHeader'

const instructions = [
  { icon: Camera, text: 'Open the camera' },
  { icon: ScanLine, text: 'Point at the code' },
  { icon: Link2, text: 'Tap the link' },
]

function isValidHttpUrl(value) {
  if (!/^https?:\/\//i.test(value)) return false

  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export default function QRCodePage() {
  const [url, setUrl] = useState(() => window.location.origin)
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState('')
  const [downloadError, setDownloadError] = useState('')
  const canvasRef = useRef(null)
  const copiedTimeout = useRef(null)
  const shouldReduceMotion = useReducedMotion()
  const validUrl = isValidHttpUrl(url.trim())

  useEffect(
    () => () => {
      window.clearTimeout(copiedTimeout.current)
    },
    [],
  )

  function handleDownload() {
    const canvas = canvasRef.current
    if (!canvas || !validUrl) return

    try {
      const link = document.createElement('a')
      link.href = canvas.toDataURL('image/png')
      link.download = 'plantguard-qr.png'
      document.body.appendChild(link)
      link.click()
      link.remove()
      setDownloadError('')
    } catch (error) {
      console.error('Could not download the QR code.', error)
      setDownloadError('Could not download the QR code. Please try again.')
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url.trim())
      setCopyError('')
      setCopied(true)
      toast.success('Link copied')
      window.clearTimeout(copiedTimeout.current)
      copiedTimeout.current = window.setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Could not copy the URL to the clipboard.', error)
      setCopied(false)
      setCopyError('Could not copy the link. Check your browser clipboard permissions.')
    }
  }

  return (
    <main className="flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <PageHeader
          title="Open on Your Phone"
          subtitle="Scan the code with your phone camera"
        />

        <motion.section
          className="mx-auto max-w-xl rounded-2xl border border-green-200 bg-white/70 p-5 shadow-[0_12px_30px_color-mix(in_srgb,var(--brand-950)_12%,transparent)] backdrop-blur-xl dark:border-green-800 dark:bg-green-950/60 sm:p-7"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.35, ease: 'easeOut' }}
        >
          <label
            htmlFor="qr-url"
            className="mb-2 block text-sm font-medium text-green-950 dark:text-green-100"
          >
            Website URL
          </label>
          <input
            id="qr-url"
            type="url"
            value={url}
            onChange={(event) => {
              setUrl(event.target.value)
              setCopyError('')
            }}
            placeholder="https://example.com"
            aria-invalid={!validUrl}
            aria-describedby="qr-url-help qr-url-error"
            className="w-full rounded-xl border border-green-300 bg-white px-4 py-3 text-green-950 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-700/20 dark:border-green-700 dark:bg-green-950 dark:text-white dark:placeholder:text-gray-400"
          />
          <p
            id="qr-url-help"
            className="mt-2 text-sm leading-6 text-green-800 dark:text-gray-300"
          >
            On the same Wi-Fi, use your PC&apos;s network address, for example
            {' '}http://192.168.1.5:5173, or use your deployed link
          </p>
          {!validUrl && (
            <p
              id="qr-url-error"
              className="mt-2 text-sm text-red-700 dark:text-red-300"
              role="alert"
            >
              Enter a valid URL starting with http:// or https://.
            </p>
          )}

          <div
            className="qr-print-card mx-auto mt-6 flex w-fit flex-col items-center rounded-2xl border-2 border-green-200 bg-white p-4 shadow-lg dark:border-green-700"
            aria-label="QR code"
          >
            {validUrl ? (
              <QRCodeCanvas
                ref={canvasRef}
                value={url.trim()}
                size={240}
                level="H"
                includeMargin
                title="PlantGuard website QR code"
              />
            ) : (
              <div className="flex h-[240px] w-[240px] items-center justify-center rounded bg-green-50 p-5 text-center text-sm text-green-800 dark:bg-green-900 dark:text-gray-200">
                Enter a valid URL to generate the QR code.
              </div>
            )}
            <p className="mt-3 max-w-60 break-all text-center text-xs text-green-800 dark:text-gray-700">
              {validUrl ? url.trim() : ' '}
            </p>
          </div>

          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={handleDownload}
              disabled={!validUrl}
              className="rounded-lg bg-green-700 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_4px_0_var(--color-green-900)] transition active:translate-y-0.5 active:shadow-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-green-700 dark:shadow-[0_4px_0_var(--color-green-900)]"
            >
              Download QR (PNG)
            </button>
            <button
              type="button"
              onClick={handleCopy}
              disabled={!validUrl}
              className="rounded-lg border border-green-300 bg-white px-4 py-2.5 text-sm font-semibold text-green-950 shadow-[0_4px_0_var(--color-green-300)] transition active:translate-y-0.5 active:shadow-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-green-700 dark:bg-green-950 dark:text-green-100 dark:shadow-[0_4px_0_var(--color-green-900)]"
            >
              {copied ? 'Copied!' : 'Copy link'}
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              disabled={!validUrl}
              className="rounded-lg border border-green-300 bg-white px-4 py-2.5 text-sm font-semibold text-green-950 shadow-[0_4px_0_var(--color-green-300)] transition active:translate-y-0.5 active:shadow-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-green-700 dark:bg-green-950 dark:text-green-100 dark:shadow-[0_4px_0_var(--color-green-900)]"
            >
              Print
            </button>
          </div>
          {(copyError || downloadError) && (
            <p className="mt-3 text-center text-sm text-red-700 dark:text-red-300" role="alert">
              {copyError || downloadError}
            </p>
          )}
        </motion.section>

        <ol className="mx-auto mt-8 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-3">
          {instructions.map(({ icon: Icon, text }, index) => (
            <li
              key={text}
              className="flex items-center gap-3 rounded-xl border border-green-100 bg-white/60 p-4 text-sm font-medium text-green-950 dark:border-green-900 dark:bg-green-950/50 dark:text-green-100 sm:flex-col sm:text-center"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span>
                <span className="mr-1 text-green-700 dark:text-green-300">
                  {index + 1}.
                </span>
                {text}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </main>
  )
}
