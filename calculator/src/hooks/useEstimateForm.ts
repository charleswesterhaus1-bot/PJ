// Owns all live form state for the calculator screen: client info + pricing
// selections, and derives the EstimateResult on every change via useMemo.

import { useMemo, useState } from 'react'
import type { ClientInfo, DiscountKind, EstimateSelections } from '../types'
import { calculateEstimate, defaultSelections } from '../utils/calculateEstimate'
import { previewNextEstimateNumber } from '../utils/estimateNumber'

function emptyClientInfo(): ClientInfo {
  return {
    clientName: '',
    vehicleYear: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleColor: '',
    licensePlate: '',
    notes: '',
  }
}

export function useEstimateForm() {
  const [client, setClient] = useState<ClientInfo>(emptyClientInfo())
  const [selections, setSelections] = useState<EstimateSelections>(defaultSelections())
  const [estimateNumber, setEstimateNumber] = useState(() => previewNextEstimateNumber())
  const [createdAt, setCreatedAt] = useState(() => new Date().toISOString())

  const result = useMemo(() => calculateEstimate(selections), [selections])

  function updateClient<K extends keyof ClientInfo>(key: K, value: ClientInfo[K]) {
    setClient((prev) => ({ ...prev, [key]: value }))
  }

  function updateSelection<K extends keyof EstimateSelections>(key: K, value: EstimateSelections[K]) {
    setSelections((prev) => ({ ...prev, [key]: value }))
  }

  function toggleAddOn(id: string) {
    setSelections((prev) => ({
      ...prev,
      addOnIds: prev.addOnIds.includes(id) ? prev.addOnIds.filter((a) => a !== id) : [...prev.addOnIds, id],
    }))
  }

  function setDiscount(id: DiscountKind | 'none') {
    updateSelection('discountId', id)
  }

  function reset() {
    setClient(emptyClientInfo())
    setSelections(defaultSelections())
    setEstimateNumber(previewNextEstimateNumber())
    setCreatedAt(new Date().toISOString())
  }

  return {
    client,
    selections,
    result,
    estimateNumber,
    createdAt,
    updateClient,
    updateSelection,
    toggleAddOn,
    setDiscount,
    reset,
    refreshEstimateNumber: () => setEstimateNumber(previewNextEstimateNumber()),
  }
}
