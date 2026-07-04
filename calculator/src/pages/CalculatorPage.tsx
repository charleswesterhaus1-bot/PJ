// The main quoting workspace: form sections on the left, live estimate
// summary pinned on the right.

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { ClientInfoForm } from '../components/calculator/ClientInfoForm'
import { VehicleDetailsForm } from '../components/calculator/VehicleDetailsForm'
import { AddOnsGrid } from '../components/calculator/AddOnsGrid'
import { TravelAndDiscountForm } from '../components/calculator/TravelAndDiscountForm'
import { EstimateSummary } from '../components/calculator/EstimateSummary'
import { useEstimateForm } from '../hooks/useEstimateForm'
import { useSavedEstimates } from '../hooks/useSavedEstimates'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'
import { useToast } from '../hooks/useToast'
import { generateEstimateNumber } from '../utils/estimateNumber'
import { buildEstimateText } from '../utils/estimateText'
import { copyToClipboard } from '../utils/clipboard'
import type { SavedEstimate } from '../types'

export function CalculatorPage() {
  const form = useEstimateForm()
  const { save } = useSavedEstimates()
  const { showToast } = useToast()

  function handleSave() {
    const finalNumber = generateEstimateNumber()
    const estimate: SavedEstimate = {
      id: crypto.randomUUID(),
      estimateNumber: finalNumber,
      createdAt: new Date().toISOString(),
      client: form.client,
      selections: form.selections,
      result: form.result,
    }
    save(estimate)
    form.reset()
    showToast('Estimate saved to browser', 'success')
  }

  useKeyboardShortcuts({
    onSave: handleSave,
    onCopy: async () => {
      const text = buildEstimateText(form.estimateNumber, form.createdAt, form.client, form.selections, form.result)
      const ok = await copyToClipboard(text)
      showToast(ok ? 'Estimate copied to clipboard' : 'Could not copy estimate', ok ? 'success' : 'error')
    },
    onPrint: () => window.print(),
    onNewEstimate: () => {
      form.reset()
      showToast('Started a new estimate', 'info')
    },
  })

  // Keep the "next estimate number" preview fresh if another tab saved one.
  useEffect(() => {
    form.refreshEstimateNumber()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 py-8 lg:grid-cols-[1fr_380px]">
      <motion.div layout className="space-y-6">
        <ClientInfoForm client={form.client} estimateNumber={form.estimateNumber} date={new Date(form.createdAt).toLocaleDateString()} onChange={form.updateClient} />
        <VehicleDetailsForm selections={form.selections} onChange={form.updateSelection} />
        <AddOnsGrid selectedIds={form.selections.addOnIds} onToggle={form.toggleAddOn} />
        <TravelAndDiscountForm selections={form.selections} onChange={form.updateSelection} />
      </motion.div>

      <div>
        <EstimateSummary
          client={form.client}
          selections={form.selections}
          result={form.result}
          estimateNumber={form.estimateNumber}
          createdAt={form.createdAt}
          onSave={handleSave}
        />
      </div>
    </div>
  )
}
