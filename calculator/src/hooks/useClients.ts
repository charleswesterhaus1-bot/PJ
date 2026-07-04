// React binding around the localStorage client database: search, upsert,
// and delete saved clients.

import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ClientRecord } from '../types'
import { deleteClient, loadClients, upsertClient } from '../utils/storage'

export function useClients() {
  const [clients, setClients] = useState<ClientRecord[]>([])

  useEffect(() => {
    setClients(loadClients())
  }, [])

  const save = useCallback((client: Parameters<typeof upsertClient>[0]) => {
    const saved = upsertClient(client)
    setClients(loadClients())
    return saved
  }, [])

  const remove = useCallback((id: string) => {
    setClients(deleteClient(id))
  }, [])

  const search = useCallback(
    (query: string) => {
      const q = query.trim().toLowerCase()
      if (!q) return []
      return clients.filter((c) => [c.name, c.phone, c.email].join(' ').toLowerCase().includes(q))
    },
    [clients],
  )

  return { clients, save, remove, search }
}

export function useClientHistory(clientId: string | null, estimates: { clientId: string | null }[]) {
  return useMemo(() => (clientId ? estimates.filter((e) => e.clientId === clientId) : []), [clientId, estimates])
}
