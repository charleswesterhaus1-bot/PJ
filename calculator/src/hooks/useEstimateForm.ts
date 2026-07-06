// Owns all live form state for the calculator screen: client, vehicle,
// inspection, pricing selections, and photos. Derives recommendations and
// the priced EstimateResult on every change via useMemo.
//
// Two fields auto-sync from other state but stay fully overridable: vehicle
// classification (from Make/Model) and condition tier (from the inspection
// findings). Each tracks "the last value we auto-set" in a ref — if the
// current value still matches that, we know the user hasn't overridden it
// and it's safe to keep auto-updating; the moment they pick something else
// manually, we stop touching it until the underlying signal changes again.

import { useEffect, useMemo, useRef, useState } from 'react'
import type { ClientDraft, EstimateSelections, EstimatePhoto, InspectionState, VehicleInfo } from '../types'
import { calculateEstimate, defaultSelections } from '../utils/calculateEstimate'
import { previewNextEstimateNumber } from '../utils/estimateNumber'
import { classifyVehicle } from '../utils/classifyVehicle'
import { computeRecommendations } from '../utils/recommendationEngine'
import { emptyInspectionState } from '../config/inspectionConfig'

function emptyClientDraft(): ClientDraft {
  return { id: null, name: '', phone: '', email: '', address: '', notes: '' }
}

function emptyVehicleInfo(): VehicleInfo {
  return {
    year: '',
    make: '',
    model: '',
    color: '',
    mileage: '',
    vin: '',
    licensePlate: '',
    ppf: 'unknown',
    ceramicCoating: 'unknown',
    mattePaint: false,
    vinylWrap: false,
    convertibleTop: false,
    carbonFiberExterior: false,
  }
}

export function useEstimateForm() {
  const [client, setClient] = useState<ClientDraft>(emptyClientDraft())
  const [vehicle, setVehicle] = useState<VehicleInfo>(emptyVehicleInfo())
  const [inspection, setInspection] = useState<InspectionState>(() => emptyInspectionState())
  const [selections, setSelections] = useState<EstimateSelections>(defaultSelections())
  const [photos, setPhotos] = useState<EstimatePhoto[]>([])
  const [estimateNumber, setEstimateNumber] = useState(() => previewNextEstimateNumber())
  const [createdAt, setCreatedAt] = useState(() => new Date().toISOString())

  const classification = useMemo(() => classifyVehicle(vehicle.make, vehicle.model), [vehicle.make, vehicle.model])
  const recommendations = useMemo(() => computeRecommendations(inspection), [inspection])

  const lastAutoVehicleType = useRef<string | null>(selections.vehicleTypeId)
  const lastAutoCondition = useRef<string | null>(selections.conditionId)

  // Auto-classify vehicle class from Make/Model, unless the user has since
  // overridden the Vehicle Class select away from our last suggestion.
  //
  // The ref check/mutation happens here in the effect body, NOT inside the
  // setSelections updater — React 18 StrictMode double-invokes functional
  // updaters in dev to catch impure ones, and a ref mutation inside the
  // updater is exactly that: the two invocations see different ref state
  // and disagree, silently dropping the update. Keeping the updater a pure
  // "just set this value" and doing the decision here avoids that entirely.
  useEffect(() => {
    if (selections.vehicleTypeId !== lastAutoVehicleType.current) return
    if (selections.vehicleTypeId === classification) return
    lastAutoVehicleType.current = classification
    setSelections((prev) => ({ ...prev, vehicleTypeId: classification }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classification, selections.vehicleTypeId])

  // Auto-suggest condition tier from inspection severity, same override rule.
  useEffect(() => {
    if (selections.conditionId !== lastAutoCondition.current) return
    if (selections.conditionId === recommendations.suggestedConditionId) return
    lastAutoCondition.current = recommendations.suggestedConditionId
    setSelections((prev) => ({ ...prev, conditionId: recommendations.suggestedConditionId }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recommendations.suggestedConditionId, selections.conditionId])

  const result = useMemo(
    () => calculateEstimate(selections, recommendations.findings, recommendations.addOnReasons),
    [selections, recommendations],
  )

  function updateClient<K extends keyof ClientDraft>(key: K, value: ClientDraft[K]) {
    setClient((prev) => ({ ...prev, [key]: value }))
  }

  function applyClientRecord(record: ClientDraft) {
    setClient(record)
  }

  function updateVehicle<K extends keyof VehicleInfo>(key: K, value: VehicleInfo[K]) {
    setVehicle((prev) => ({ ...prev, [key]: value }))
  }

  function replaceVehicle(next: VehicleInfo) {
    setVehicle(next)
  }

  function updateSelection<K extends keyof EstimateSelections>(key: K, value: EstimateSelections[K]) {
    setSelections((prev) => ({ ...prev, [key]: value }))
  }

  function setInspectionSeverity(category: keyof InspectionState, itemId: string, level: number) {
    setInspection((prev) => ({ ...prev, [category]: { ...prev[category], [itemId]: level } }))
  }

  function toggleAddOn(id: string) {
    setSelections((prev) => ({
      ...prev,
      addOnIds: prev.addOnIds.includes(id) ? prev.addOnIds.filter((a) => a !== id) : [...prev.addOnIds, id],
    }))
  }

  function addPhoto(photo: EstimatePhoto) {
    setPhotos((prev) => [...prev, photo])
  }

  function removePhoto(id: string) {
    setPhotos((prev) => prev.filter((p) => p.id !== id))
  }

  function reset() {
    setClient(emptyClientDraft())
    setVehicle(emptyVehicleInfo())
    setInspection(emptyInspectionState())
    setSelections(defaultSelections())
    setPhotos([])
    setEstimateNumber(previewNextEstimateNumber())
    setCreatedAt(new Date().toISOString())
    lastAutoVehicleType.current = defaultSelections().vehicleTypeId
    lastAutoCondition.current = defaultSelections().conditionId
  }

  return {
    client,
    vehicle,
    inspection,
    selections,
    photos,
    result,
    recommendations,
    classification,
    estimateNumber,
    createdAt,
    updateClient,
    applyClientRecord,
    updateVehicle,
    replaceVehicle,
    updateSelection,
    setInspectionSeverity,
    toggleAddOn,
    addPhoto,
    removePhoto,
    reset,
    refreshEstimateNumber: () => setEstimateNumber(previewNextEstimateNumber()),
  }
}
