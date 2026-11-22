import { useCallback, useEffect, useRef, useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { buildSpeech, languages } from '../data/speechText'

const speechRates = [0.8, 1, 1.2]

function waitForVoices(synthesis) {
  const availableVoices = synthesis.getVoices()
  if (availableVoices.length > 0) {
    return { promise: Promise.resolve(availableVoices), cancel: () => {} }
  }

  let timeoutId
  let finish
  const promise = new Promise((resolve) => {
    let isFinished = false
    finish = (voices) => {
      if (isFinished) return
      isFinished = true
      window.clearTimeout(timeoutId)
      synthesis.removeEventListener('voiceschanged', handleVoicesChanged)
      resolve(voices)
    }

    function handleVoicesChanged() {
      finish(synthesis.getVoices())
    }

    synthesis.addEventListener('voiceschanged', handleVoicesChanged, {
      once: true,
    })
    timeoutId = window.setTimeout(() => finish(synthesis.getVoices()), 3000)
  })

  return {
    promise,
    cancel: () => {
      finish?.([])
    },
  }
}

function findMatchingVoice(voices, lang) {
  const normalizedLang = lang.toLowerCase()
  return (
    voices.find((voice) => voice.lang.toLowerCase() === normalizedLang) ??
    voices.find((voice) =>
      voice.lang.toLowerCase().startsWith(normalizedLang.split('-')[0]),
    )
  )
}

export default function ReadAloud({ result, lang = 'en-US' }) {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [rate, setRate] = useState(1)
  const [selectedLang, setSelectedLang] = useState(() => {
    if (typeof window === 'undefined') return lang
    try {
      const savedLang = window.localStorage.getItem('plantguard-voice-lang')
      return languages.some(({ code }) => code === savedLang) ? savedLang : lang
    } catch (error) {
      console.error('Could not read the saved speech language.', error)
      return lang
    }
  })
  const [voices, setVoices] = useState(() =>
    typeof window !== 'undefined' && 'speechSynthesis' in window
      ? window.speechSynthesis.getVoices()
      : [],
  )
  const [voicesLoaded, setVoicesLoaded] = useState(() =>
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    window.speechSynthesis.getVoices().length > 0,
  )
  const operationRef = useRef(0)
  const cancelVoiceWaitRef = useRef(null)
  const isSupported =
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    typeof window.SpeechSynthesisUtterance === 'function'
  const selectedVoice = findMatchingVoice(voices, selectedLang)

  const stopSpeech = useCallback(() => {
    operationRef.current += 1
    cancelVoiceWaitRef.current?.()
    cancelVoiceWaitRef.current = null
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
    setIsSpeaking(false)
  }, [])

  useEffect(() => {
    if (!isSupported) return undefined

    const synthesis = window.speechSynthesis
    const updateVoices = () => {
      setVoices(synthesis.getVoices())
      setVoicesLoaded(true)
    }
    synthesis.addEventListener('voiceschanged', updateVoices)
    return () => synthesis.removeEventListener('voiceschanged', updateVoices)
  }, [isSupported])

  useEffect(() => {
    return () => {
      operationRef.current += 1
      cancelVoiceWaitRef.current?.()
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [result, selectedLang])

  if (!isSupported) return null

  async function handleListen() {
    if (isSpeaking) {
      stopSpeech()
      return
    }

    const text = buildSpeech(result, selectedLang)
    if (!text) return
    if (!selectedVoice && voicesLoaded) return

    const synthesis = window.speechSynthesis
    synthesis.cancel()
    const operation = operationRef.current + 1
    operationRef.current = operation
    setIsSpeaking(true)

    const voiceWait = waitForVoices(synthesis)
    cancelVoiceWaitRef.current = voiceWait.cancel
    const availableVoices = await voiceWait.promise
    cancelVoiceWaitRef.current = null
    if (operationRef.current !== operation) return
    setVoices(availableVoices)
    setVoicesLoaded(true)
    const voice = findMatchingVoice(availableVoices, selectedLang)
    if (!voice) {
      setIsSpeaking(false)
      return
    }

    const utterance = new window.SpeechSynthesisUtterance(text)
    utterance.lang = selectedLang
    utterance.rate = rate
    utterance.voice = voice

    const resetState = () => {
      if (operationRef.current !== operation) return
      setIsSpeaking(false)
    }
    utterance.onend = resetState
    utterance.onerror = resetState
    try {
      synthesis.speak(utterance)
    } catch (error) {
      console.error('Could not read the prediction aloud.', error)
      resetState()
    }
  }

  function handleLanguageChange(event) {
    const nextLang = event.target.value
    stopSpeech()
    setSelectedLang(nextLang)
    try {
      window.localStorage.setItem('plantguard-voice-lang', nextLang)
    } catch (error) {
      console.error('Could not save the speech language.', error)
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={handleListen}
        disabled={voicesLoaded && !selectedVoice}
        className={`inline-flex items-center justify-center gap-2 rounded-lg border border-green-300 bg-white px-5 py-3 text-sm font-semibold text-green-900 shadow-[0_4px_0_var(--color-green-300)] transition active:translate-y-0.5 active:shadow-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700 dark:border-green-700 dark:bg-green-950 dark:text-green-100 dark:shadow-[0_4px_0_var(--color-green-900)] ${
          isSpeaking ? 'animate-pulse' : ''
        } disabled:cursor-not-allowed disabled:opacity-50`}
        aria-pressed={isSpeaking}
      >
        {isSpeaking ? (
          <VolumeX className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Volume2 className="h-4 w-4" aria-hidden="true" />
        )}
        {isSpeaking ? 'Stop' : 'Listen'}
      </button>
      <label className="flex items-center gap-2 text-sm font-medium text-green-900 dark:text-green-100">
        Speed
        <select
          value={rate}
          onChange={(event) => setRate(Number(event.target.value))}
          className="rounded-lg border border-green-300 bg-white px-2.5 py-2 text-sm text-green-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700 dark:border-green-700 dark:bg-green-950 dark:text-green-100"
        >
          {speechRates.map((speechRate) => (
            <option key={speechRate} value={speechRate}>
              {speechRate}x
            </option>
          ))}
        </select>
      </label>
      <label className="flex items-center gap-2 text-sm font-medium text-green-900 dark:text-green-100">
        Language
        <select
          value={selectedLang}
          onChange={handleLanguageChange}
          className="rounded-lg border border-green-300 bg-white px-2.5 py-2 text-sm text-green-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700 dark:border-green-700 dark:bg-green-950 dark:text-green-100"
        >
          {languages.map(({ code, label }) => (
            <option key={code} value={code}>
              {label}
            </option>
          ))}
        </select>
      </label>
      {voicesLoaded && !selectedVoice && (
        <p className="basis-full text-xs leading-5 text-amber-900 dark:text-amber-200" role="status">
          No voice for this language is installed on your device. Install it in
          your device&apos;s text-to-speech settings.
        </p>
      )}
    </div>
  )
}
