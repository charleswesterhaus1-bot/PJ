// The main quoting workspace: the estimate form on the left, the
// client-facing estimate + staff-only Business Summary pinned on the
// right.

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ClientInfoForm } from '../components/calculator/ClientInfoForm'
import { VehicleIdentityForm } from '../components/calculator/VehicleIdentityForm'
import { InspectionForm } from '../components/calculator/InspectionForm'
import { ServiceConditionForm } from '../components/calculator/ServiceConditionForm'
import { AddOnsGrid } from '../components/calculator/AddOnsGrid'
import { TravelAndDiscountForm } from '../components/calculator/TravelAndDiscountForm'
import { PhotoUpload } from '../components/calculator/PhotoUpload'
import { EstimateSummary } from '../components/calculator/EstimateSummary'
import { ProfitabilityPanel } from '../components/calculator/ProfitabilityPanel'
import { useEstimateForm } from '../hooks/useEstimateForm'
import { useSavedEstimates } from '../hooks/useSavedEstimates'
import { useClients } from '../hooks/useClients'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'
import { useToast } from '../hooks/useToast'
import { generateEstimateNumber } from '../utils/estimateNumber'
import { buildEstimateText } from '../utils/estimateText'
import { copyToClipboard } from '../utils/clipboard'
import type { ClientRecord, SavedEstimate } from '../types'

interface CalculatorPageProps {
  prefillClient: ClientRecord | null
  onConsumePrefill: () => void
}

export function CalculatorPage({ prefillClient, onConsumePrefill }: CalculatorPageProps) {
  const form = useEstimateForm()
  const { estimates, save: saveEstimate } = useSavedEstimates()
  const { save: saveClient, search } = useClients()
  const { showToast } = useToast()
  const [clientQuery, setClientQuery] = useState('')

  useEffect(() => {
    if (prefillClient) {
      form.applyClientRecord({
        id: prefillClient.id,
        name: prefillClient.name,
        phone: prefillClient.phone,
        email: prefillClient.email,
        address: prefillClient.address,
        notes: prefillClient.notes,
      })
      onConsumePrefill()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefillClient])

  const clientHistory = form.client.id ? estimates.filter((e) => e.clientId === form.client.id) : []

  function handleSave() {
    const savedClient = saveClient({
      id: form.client.id ?? undefined,
      name: form.client.name,
      phone: form.client.phone,
      email: form.client.email,
      address: form.client.address,
      notes: form.client.notes,
    })
    const estimate: SavedEstimate = {
      id: crypto.randomUUID(),
      estimateNumber: generateEstimateNumber(),
      createdAt: new Date().toISOString(),
      clientId: savedClient.id,
      client: savedClient,
      vehicle: form.vehicle,
      selections: form.selections,
      result: form.result,
      photos: form.photos,
    }
    const ok = saveEstimate(estimate)
    if (ok) {
      form.reset()
      showToast('Estimate saved to browser', 'success')
    } else {
      showToast('Could not save — local storage may be full', 'error')
    }
  }

  useKeyboardShortcuts({
    onSave: handleSave,
    onCopy: async () => {
      const text = buildEstimateText(form.estimateNumber, form.createdAt, form.client, form.vehicle, form.selections, form.result)
      const ok = await copyToClipboard(text)
      showToast(ok ? 'Estimate copied to clipboard' : 'Could not copy estimate', ok ? 'success' : 'error')
    },
    onPrint: () => window.print(),
    onNewEstimate: () => {
      form.reset()
      showToast('Started a new estimate', 'info')
    },
  })

  useEffect(() => {
    form.refreshEstimateNumber()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 py-8 lg:grid-cols-[1fr_380px]">
      <motion.div layout className="space-y-6">
        <ClientInfoForm
          client={form.client}
          estimateNumber={form.estimateNumber}
          date={new Date(form.createdAt).toLocaleDateString()}
          onChange={form.updateClient}
          searchQuery={clientQuery}
          onSearchQueryChange={setClientQuery}
          searchResults={search(clientQuery)}
          onSelectClient={(record) => {
            form.applyClientRecord({
              id: record.id,
              name: record.name,
              phone: record.phone,
              email: record.email,
              address: record.address,
              notes: record.notes,
            })
            setClientQuery('')
          }}
          clientHistory={clientHistory}
          onSelectVehicleFromHistory={form.replaceVehicle}
        />
        <VehicleIdentityForm
          vehicle={form.vehicle}
          onChange={form.updateVehicle}
          classification={form.classification}
          vehicleTypeId={form.selections.vehicleTypeId}
          onVehicleTypeChange={(id) => form.updateSelection('vehicleTypeId', id)}
        />
        <ServiceConditionForm selections={form.selections} onChange={form.updateSelection} />
        <InspectionForm selections={form.selections} onChange={form.updateSelection} />
        <AddOnsGrid
          serviceId={form.selections.serviceId}
          interiorMaterial={form.vehicle.interiorMaterial}
          selectedIds={form.selections.addOnIds}
          addOnSurcharges={form.selections.addOnSurcharges}
          onToggle={form.toggleAddOn}
          onSurchargeChange={form.updateAddOnSurcharge}
        />
        <TravelAndDiscountForm selections={form.selections} onChange={form.updateSelection} />
        <PhotoUpload photos={form.photos} onAdd={form.addPhoto} onRemove={form.removePhoto} />
      </motion.div>

      <div className="sticky top-24 space-y-6 self-start">
        <EstimateSummary
          client={form.client}
          vehicle={form.vehicle}
          selections={form.selections}
          result={form.result}
          estimateNumber={form.estimateNumber}
          createdAt={form.createdAt}
          onSave={handleSave}
        />
        <ProfitabilityPanel result={form.result} />
      </div>
    </div>
  )
}
