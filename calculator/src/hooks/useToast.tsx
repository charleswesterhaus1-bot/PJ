// Lightweight toast notification system. A single provider sits near the
// root of the app; any component can call `useToast()` to show a message.

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Info, TriangleAlert, X } from 'lucide-react'

type ToastVariant = 'success' | 'info' | 'error'

interface ToastItem {
  id: number
  message: string
  variant: ToastVariant
}

interface ToastContextValue {
  showToast: (message: string, variant?: ToastVariant) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const ICONS: Record<ToastVariant, ReactNode> = {
  success: <CheckCircle2 className="h-5 w-5 text-emerald-400" />,
  info: <Info className="h-5 w-5 text-[#C9A227]" />,
  error: <TriangleAlert className="h-5 w-5 text-rose-400" />,
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const idRef = useRef(0)

  const showToast = useCallback((message: string, variant: ToastVariant = 'success') => {
    const id = idRef.current++
    setToasts((prev) => [...prev, { id, message, variant }])
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3600)
  }, [])

  const dismiss = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id))

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[100] flex flex-col items-center gap-3 px-4">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-auto flex items-center gap-3 rounded-full border border-[#C9A227]/30 bg-[#0B1B3A]/95 px-5 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-xl"
            >
              {ICONS[toast.variant]}
              <span className="text-sm font-medium tracking-wide text-slate-100">{toast.message}</span>
              <button
                onClick={() => dismiss(toast.id)}
                className="ml-1 text-slate-400 transition hover:text-white"
                aria-label="Dismiss notification"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}
