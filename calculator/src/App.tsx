import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Header, type Page } from './components/layout/Header'
import { SplashScreen } from './components/layout/SplashScreen'
import { CalculatorPage } from './pages/CalculatorPage'
import { HistoryPage } from './pages/HistoryPage'
import { ToastProvider } from './hooks/useToast'

function App() {
  const [page, setPage] = useState<Page>('calculator')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 1100)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <ToastProvider>
      <div className="hh-app-background" aria-hidden="true" />
      <AnimatePresence>{loading && <SplashScreen key="splash" />}</AnimatePresence>
      <Header page={page} onNavigate={setPage} />
      {page === 'calculator' ? <CalculatorPage /> : <HistoryPage />}
    </ToastProvider>
  )
}

export default App
