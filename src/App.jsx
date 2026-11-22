import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import ErrorBoundary from './components/ErrorBoundary'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import OfflineBanner from './components/OfflineBanner'
import About from './pages/About'
import Contact from './pages/Contact'
import DiseaseInfo from './pages/DiseaseInfo'
import Home from './pages/Home'
import History from './pages/History'
import HowItWorks from './pages/HowItWorks'
import NotFound from './pages/NotFound'
import QRCodePage from './pages/QRCodePage'
import Metrics from './pages/Metrics'

export default function App() {
  const location = useLocation()
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="flex min-h-screen flex-col bg-transparent">
      <Toaster
        position="top-center"
        toastOptions={{
          className: 'rounded-xl',
          style: {
            background: 'var(--color-green-900)',
            color: 'white',
            borderRadius: '0.75rem',
          },
        }}
      />
      <OfflineBanner />
      <Navbar />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          className="flex flex-1 flex-col"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={
            shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -12 }
          }
          transition={{
            duration: shouldReduceMotion ? 0 : 0.25,
            ease: 'easeInOut',
          }}
        >
          <ErrorBoundary>
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/disease-info" element={<DiseaseInfo />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/qr" element={<QRCodePage />} />
              <Route path="/history" element={<History />} />
              <Route path="/metrics" element={<Metrics />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ErrorBoundary>
        </motion.div>
      </AnimatePresence>
      <Footer />
    </div>
  )
}
