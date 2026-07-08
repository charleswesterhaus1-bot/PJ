// Browse, search, and manage previously saved estimates and clients.

import { useMemo, useState } from 'react'
import { Search, Inbox, FileText, Users, ChevronDown } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { EstimateCard } from '../components/history/EstimateCard'
import { ClientCard } from '../components/history/ClientCard'
import { useSavedEstimates } from '../hooks/useSavedEstimates'
import { useClients } from '../hooks/useClients'
import { useToast } from '../hooks/useToast'
import { pricingConfig } from '../config/pricingConfig'
import type { ClientRecord } from '../types'

type Tab = 'estimates' | 'clients'
type SortOrder = 'newest' | 'oldest'

export function HistoryPage({ onStartEstimateForClient }: { onStartEstimateForClient: (client: ClientRecord) => void }) {
  const { estimates, remove: removeEstimate, setStatus } = useSavedEstimates()
  const { clients, remove: removeClient } = useClients()
  const { showToast } = useToast()
  const [tab, setTab] = useState<Tab>('estimates')
  const [query, setQuery] = useState('')
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest')
  const [serviceFilter, setServiceFilter] = useState<string>('all')

  const filteredEstimates = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = estimates
    if (serviceFilter !== 'all') list = list.filter((e) => e.selections.serviceId === serviceFilter)
    if (q) {
      list = list.filter((e) => {
        const haystack = [e.estimateNumber, e.client.name, e.vehicle.make, e.vehicle.model, e.vehicle.year, e.vehicle.licensePlate]
          .join(' ')
          .toLowerCase()
        return haystack.includes(q)
      })
    }
    return [...list].sort((a, b) => {
      const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      return sortOrder === 'newest' ? -diff : diff
    })
  }, [estimates, query, serviceFilter, sortOrder])

  const filteredClients = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return clients
    return clients.filter((c) => [c.name, c.phone, c.email].join(' ').toLowerCase().includes(q))
  }, [clients, query])

  function handleDeleteEstimate(id: string) {
    removeEstimate(id)
    showToast('Estimate deleted', 'info')
  }

  function handleToggleStatus(id: string, status: 'pending' | 'completed') {
    setStatus(id, status)
  }

  function handleDeleteClient(id: string) {
    removeClient(id)
    showToast('Client removed', 'info')
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C9A227]/80">Archive</p>
          <h1 className="font-serif text-3xl font-semibold text-slate-50">{tab === 'estimates' ? 'Previous Estimates' : 'Client Database'}</h1>
        </div>
        <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
          <TabButton active={tab === 'estimates'} onClick={() => setTab('estimates')} icon={<FileText className="h-3.5 w-3.5" />}>
            Estimates
          </TabButton>
          <TabButton active={tab === 'clients'} onClick={() => setTab('clients')} icon={<Users className="h-3.5 w-3.5" />}>
            Clients
          </TabButton>
        </div>
      </div>

      <div className="relative mb-4">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={tab === 'estimates' ? 'Search by client, vehicle, plate, or estimate number…' : 'Search clients by name, phone, or email…'}
          className="hh-input hh-focus-ring w-full rounded-full py-3 pl-11 pr-4 text-sm text-slate-100 outline-none placeholder:text-slate-500"
        />
      </div>

      {tab === 'estimates' && (
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
            <SortButton active={sortOrder === 'newest'} onClick={() => setSortOrder('newest')}>
              Newest
            </SortButton>
            <SortButton active={sortOrder === 'oldest'} onClick={() => setSortOrder('oldest')}>
              Oldest
            </SortButton>
          </div>
          <div className="relative">
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="hh-input hh-focus-ring appearance-none rounded-full py-1.5 pl-3.5 pr-8 text-xs font-medium text-slate-200 outline-none"
            >
              <option value="all">All Services</option>
              {pricingConfig.services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#C9A227]/70" />
          </div>
        </div>
      )}

      {tab === 'estimates' ? (
        filteredEstimates.length === 0 ? (
          <EmptyState message={estimates.length === 0 ? 'No estimates saved yet.' : 'No estimates match your search.'} />
        ) : (
          <AnimatedList>
            {filteredEstimates.map((estimate) => (
              <motion.div key={estimate.id} layout initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}>
                <EstimateCard estimate={estimate} onDelete={handleDeleteEstimate} onToggleStatus={handleToggleStatus} />
              </motion.div>
            ))}
          </AnimatedList>
        )
      ) : filteredClients.length === 0 ? (
        <EmptyState message={clients.length === 0 ? 'No clients saved yet — they save automatically the first time you save an estimate.' : 'No clients match your search.'} />
      ) : (
        <AnimatedList>
          {filteredClients.map((client) => {
            const clientEstimates = estimates.filter((e) => e.clientId === client.id)
            return (
              <motion.div key={client.id} layout initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}>
                <ClientCard
                  client={client}
                  estimateCount={clientEstimates.length}
                  lastEstimate={clientEstimates[0]}
                  onDelete={handleDeleteClient}
                  onStartEstimate={onStartEstimateForClient}
                />
              </motion.div>
            )
          })}
        </AnimatedList>
      )}
    </div>
  )
}

function TabButton({ active, onClick, icon, children }: { active: boolean; onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`hh-focus-ring flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
        active ? 'bg-gradient-to-b from-[#E8CF83] to-[#C9A227] text-[#0B1B3A]' : 'text-slate-300 hover:text-white'
      }`}
    >
      {icon}
      {children}
    </button>
  )
}

function SortButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`hh-focus-ring rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
        active ? 'bg-gradient-to-b from-[#E8CF83] to-[#C9A227] text-[#0B1B3A]' : 'text-slate-300 hover:text-white'
      }`}
    >
      {children}
    </button>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-20 text-center">
      <Inbox className="mb-3 h-8 w-8 text-slate-600" />
      <p className="max-w-xs text-sm text-slate-400">{message}</p>
    </div>
  )
}

function AnimatedList({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <AnimatePresence initial={false}>{children}</AnimatePresence>
    </div>
  )
}
