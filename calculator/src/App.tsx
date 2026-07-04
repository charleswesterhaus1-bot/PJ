import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Header, type Page } from './components/layout/Header'
import { SplashScreen } from './components/layout/SplashScreen'
import { CalculatorPage } from './pages/CalculatorPage'
import { HistoryPage } from './pages/HistoryPage'
import { ToastProvider } from './hooks/useToast'
import type { ClientRecord } from './types'

function App() {
  const [page, setPage] = useState<Page>('calculator')
  const [loading, setLoading] = useState(true)
  const [prefillClient, setPrefillClient] = useState<ClientRecord | null>(null)

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 1100)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <ToastProvider>
      <div className="hh-app-background" aria-hidden="true" />
      <AnimatePresence>{loading && <SplashScreen key="splash" />}</AnimatePresence>
      <Header page={page} onNavigate={setPage} />
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          {page === 'calculator' ? (
            <CalculatorPage prefillClient={prefillClient} onConsumePrefill={() => setPrefillClient(null)} />
          ) : (
            <HistoryPage
              onStartEstimateForClient={(client) => {
                setPrefillClient(client)
                setPage('calculator')
              }}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </ToastProvider>
  )
}

export default App
