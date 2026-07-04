// Thin localStorage persistence layer for saved estimates, the client
// database, and the running estimate-number counter. Everything is
// namespaced under a single prefix so it never collides with anything else
// on the domain.
//
// Storage keys are versioned (`-v2`) because the estimate/client shape
// changed in V2 (client database, inspection, photos). Bumping the suffix
// again in the future is the intended way to migrate a breaking shape
// change without writing a migration script for a browser-only data store.

import type { ClientRecord, SavedEstimate } from '../types'

const ESTIMATES_KEY = 'hh-estimates-v2'
const CLIENTS_KEY = 'hh-clients-v2'
const COUNTER_KEY = 'hh-estimate-counter-v1'

function readArray<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeArray<T>(key: string, value: T[]): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    // Most likely a quota error (photos are the biggest consumer of space).
    return false
  }
}

// ── Estimates ──────────────────────────────────────────────────────────

export function loadEstimates(): SavedEstimate[] {
  return readArray<SavedEstimate>(ESTIMATES_KEY)
}

export function saveEstimates(estimates: SavedEstimate[]): boolean {
  return writeArray(ESTIMATES_KEY, estimates)
}

export function addEstimate(estimate: SavedEstimate): { estimates: SavedEstimate[]; ok: boolean } {
  const updated = [estimate, ...loadEstimates()]
  const ok = saveEstimates(updated)
  return { estimates: ok ? updated : loadEstimates(), ok }
}

export function deleteEstimate(id: string): SavedEstimate[] {
  const updated = loadEstimates().filter((e) => e.id !== id)
  saveEstimates(updated)
  return updated
}

// ── Clients ────────────────────────────────────────────────────────────

export function loadClients(): ClientRecord[] {
  return readArray<ClientRecord>(CLIENTS_KEY)
}

export function saveClients(clients: ClientRecord[]): void {
  writeArray(CLIENTS_KEY, clients)
}

/** Insert a new client, or update an existing one matched by id. Matches by
 * name+phone when no id is given yet (first save from the calculator form). */
export function upsertClient(client: Omit<ClientRecord, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): ClientRecord {
  const clients = loadClients()
  const now = new Date().toISOString()
  const existingIndex = client.id
    ? clients.findIndex((c) => c.id === client.id)
    : clients.findIndex(
        (c) => c.name.trim().toLowerCase() === client.name.trim().toLowerCase() && c.phone.trim() === client.phone.trim() && c.name.trim() !== '',
      )

  if (existingIndex >= 0) {
    const updated: ClientRecord = { ...clients[existingIndex], ...client, id: clients[existingIndex].id, updatedAt: now }
    const next = [...clients]
    next[existingIndex] = updated
    saveClients(next)
    return updated
  }

  const created: ClientRecord = { ...client, id: crypto.randomUUID(), createdAt: now, updatedAt: now }
  saveClients([created, ...clients])
  return created
}

export function deleteClient(id: string): ClientRecord[] {
  const updated = loadClients().filter((c) => c.id !== id)
  saveClients(updated)
  return updated
}

// ── Estimate numbering ────────────────────────────────────────────────

export function getNextEstimateSequence(): number {
  const raw = localStorage.getItem(COUNTER_KEY)
  const current = raw ? parseInt(raw, 10) : 0
  const next = Number.isFinite(current) ? current + 1 : 1
  localStorage.setItem(COUNTER_KEY, String(next))
  return next
}

export function peekNextEstimateSequence(): number {
  const raw = localStorage.getItem(COUNTER_KEY)
  const current = raw ? parseInt(raw, 10) : 0
  return (Number.isFinite(current) ? current : 0) + 1
}
