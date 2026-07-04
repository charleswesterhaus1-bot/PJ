// Browse, search, and manage previously saved estimates.

import { useMemo, useState } from 'react'
import { Search, Inbox } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { EstimateCard } from '../components/history/EstimateCard'
import { useSavedEstimates } from '../hooks/useSavedEstimates'
import { useToast } from '../hooks/useToast'

export function HistoryPage() {
  const { estimates, remove } = useSavedEstimates()
  const { showToast } = useToast()
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return estimates
    return estimates.filter((e) => {
      const haystack = [
        e.estimateNumber,
        e.client.clientName,
        e.client.vehicleMake,
        e.client.vehicleModel,
        e.client.vehicleYear,
        e.client.licensePlate,
      ]
        .join(' ')
        .toLowerCase()
      return haystack.includes(q)
    })
  }, [estimates, query])

  function handleDelete(id: string) {
    remove(id)
    showToast('Estimate deleted', 'info')
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="mb-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C9A227]/80">Archive</p>
        <h1 className="font-serif text-3xl font-semibold text-slate-50">Previous Estimates</h1>
      </div>

      <div className="relative mb-6">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by client, vehicle, plate, or estimate number…"
          className="hh-input hh-focus-ring w-full rounded-full py-3 pl-11 pr-4 text-sm text-slate-100 outline-none placeholder:text-slate-500"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-20 text-center">
          <Inbox className="mb-3 h-8 w-8 text-slate-600" />
          <p className="text-sm text-slate-400">
            {estimates.length === 0 ? 'No estimates saved yet.' : 'No estimates match your search.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {filtered.map((estimate) => (
              <motion.div
                key={estimate.id}
                layout
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
              >
                <EstimateCard estimate={estimate} onDelete={handleDelete} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
