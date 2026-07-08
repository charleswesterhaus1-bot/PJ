// Owns all live form state for the calculator screen: client, vehicle,
// pricing selections, and photos. Derives the priced EstimateResult on
// every change via useMemo.
//
// Vehicle Class auto-syncs from Make/Model but stays fully overridable: a
// ref tracks "the last value we auto-set" — if the current value still
// matches that, we know the user hasn't overridden it and it's safe to keep
// auto-updating; the moment they pick something else manually, we stop
// touching it until the underlying signal changes again.

import { useEffect, useMemo, useRef, useState } from 'react'
import type { ClientDraft, EstimateSelections, EstimatePhoto, VehicleInfo } from '../types'
import { calculateEstimate, defaultSelections } from '../utils/calculateEstimate'
import { previewNextEstimateNumber } from '../utils/estimateNumber'
import { classifyVehicle } from '../utils/classifyVehicle'
import { pricingConfig } from '../config/pricingConfig'

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
    interiorMaterial: 'other',
    ppf: 'unknown',
    ceramicCoating: 'unknown',
    mattePaint: false,
    convertibleTop: false,
    carbonFiberExterior: false,
  }
}

const LEATHER_INTERIOR_MATERIALS = ['leather', 'leather-alcantara']

export function useEstimateForm() {
  const [client, setClient] = useState<ClientDraft>(emptyClientDraft())
  const [vehicle, setVehicle] = useState<VehicleInfo>(emptyVehicleInfo())
  const [selections, setSelections] = useState<EstimateSelections>(defaultSelections())
  const [photos, setPhotos] = useState<EstimatePhoto[]>([])
  const [estimateNumber, setEstimateNumber] = useState(() => previewNextEstimateNumber())
  const [createdAt, setCreatedAt] = useState(() => new Date().toISOString())

  const classification = useMemo(() => classifyVehicle(vehicle.make, vehicle.model), [vehicle.make, vehicle.model])

  const lastAutoVehicleType = useRef<string | null>(selections.vehicleTypeId)

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

  // Drop any selected add-on that isn't valid for the currently selected
  // service (e.g. Iron Removal was picked, then the service changed to
  // Paint Enhancement, which already includes it) or that requires a
  // leather interior the vehicle no longer has (e.g. Interior Material was
  // changed to Alcantara after Leather Conditioning was already selected).
  useEffect(() => {
    const hasLeatherInterior = LEATHER_INTERIOR_MATERIALS.includes(vehicle.interiorMaterial)
    setSelections((prev) => {
      const validIds = prev.addOnIds.filter((id) => {
        const addOn = pricingConfig.addOns.find((a) => a.id === id)
        if (!addOn) return false
        if (!addOn.availableForServiceIds.includes(prev.serviceId)) return false
        if (addOn.requiresLeatherInterior && !hasLeatherInterior) return false
        return true
      })
      if (validIds.length === prev.addOnIds.length) return prev
      const droppedIds = prev.addOnIds.filter((id) => !validIds.includes(id))
      const addOnSurcharges = { ...prev.addOnSurcharges }
      droppedIds.forEach((id) => delete addOnSurcharges[id])
      return { ...prev, addOnIds: validIds, addOnSurcharges }
    })
  }, [selections.serviceId, vehicle.interiorMaterial])

  const result = useMemo(() => calculateEstimate(selections), [selections])

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

  function toggleAddOn(id: string) {
    setSelections((prev) => {
      const isSelected = prev.addOnIds.includes(id)
      const addOnSurcharges = { ...prev.addOnSurcharges }
      if (isSelected) delete addOnSurcharges[id]
      return {
        ...prev,
        addOnIds: isSelected ? prev.addOnIds.filter((a) => a !== id) : [...prev.addOnIds, id],
        addOnSurcharges,
      }
    })
  }

  function updateAddOnSurcharge(id: string, amount: number) {
    setSelections((prev) => ({ ...prev, addOnSurcharges: { ...prev.addOnSurcharges, [id]: Math.max(0, amount) } }))
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
    setSelections(defaultSelections())
    setPhotos([])
    setEstimateNumber(previewNextEstimateNumber())
    setCreatedAt(new Date().toISOString())
    lastAutoVehicleType.current = defaultSelections().vehicleTypeId
  }

  return {
    client,
    vehicle,
    selections,
    photos,
    result,
    classification,
    estimateNumber,
    createdAt,
    updateClient,
    applyClientRecord,
    updateVehicle,
    replaceVehicle,
    updateSelection,
    toggleAddOn,
    updateAddOnSurcharge,
    addPhoto,
    removePhoto,
    reset,
    refreshEstimateNumber: () => setEstimateNumber(previewNextEstimateNumber()),
  }
}
