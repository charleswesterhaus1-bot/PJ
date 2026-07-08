// The client-facing estimate. On screen this renders as a dark glass card;
// for physical printing, a separate light/ink-friendly version is portaled
// into #print-root (see PrintableEstimate.tsx) — a sibling of #root, not a
// descendant — so print output can never be affected by this component's
// own layout/animation, and internal-only figures (labor cost, margin)
// can never end up on a client's copy since they're simply never passed to
// either version.

import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Clipboard, FileDown, Printer, Save, TriangleAlert } from 'lucide-react'
import { GlassPanel } from '../ui/GlassPanel'
import { StatRow } from '../ui/StatRow'
import { AnimatedNumber } from '../ui/AnimatedNumber'
import { Button } from '../ui/Button'
import { PrintableEstimate } from './PrintableEstimate'
import type { ClientDraft, EstimateResult, EstimateSelections, VehicleInfo } from '../../types'
import { formatCurrency, formatDate, formatSignedCurrency } from '../../utils/format'
import { buildEstimateText } from '../../utils/estimateText'
import { copyToClipboard } from '../../utils/clipboard'
import { buildTechnicianNotes } from '../../utils/vehicleHandlingNotes'
import { useToast } from '../../hooks/useToast'
import { pricingConfig } from '../../config/pricingConfig'

const printRoot = typeof document !== 'undefined' ? document.getElementById('print-root') : null

interface EstimateSummaryProps {
  client: ClientDraft
  vehicle: VehicleInfo
  selections: EstimateSelections
  result: EstimateResult
  estimateNumber: string
  createdAt: string
  onSave: () => void
}

export function EstimateSummary({ client, vehicle, selections, result, estimateNumber, createdAt, onSave }: EstimateSummaryProps) {
  const { showToast } = useToast()
  const [exporting, setExporting] = useState(false)

  const vehicleLine = [vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(' ')
  const vehicleTypeLabel = pricingConfig.vehicleTypes.find((t) => t.id === selections.vehicleTypeId)?.label
  const service = pricingConfig.services.find((s) => s.id === selections.serviceId)
  const showExterior = service?.relevantConditions.includes('exterior') ?? true
  const showInterior = service?.relevantConditions.includes('interior') ?? true
  const technicianNotes = buildTechnicianNotes(vehicle, selections)

  async function handleCopy() {
    const text = buildEstimateText(estimateNumber, createdAt, client, vehicle, selections, result)
    const ok = await copyToClipboard(text)
    showToast(ok ? 'Estimate copied to clipboard' : 'Could not copy estimate', ok ? 'success' : 'error')
  }

  function handlePrint() {
    window.print()
  }

  async function handleExportPdf() {
    setExporting(true)
    try {
      const { exportEstimateToPdf } = await import('../../utils/pdfExport')
      await exportEstimateToPdf({ estimateNumber, createdAt, client, vehicle, selections, result }, `${estimateNumber}.pdf`)
      showToast('PDF exported', 'success')
    } catch {
      showToast('Could not export PDF', 'error')
    } finally {
      setExporting(false)
    }
  }

  return (
    <GlassPanel className="overflow-hidden p-0" delay={0.1}>
      {printRoot &&
        createPortal(
          <PrintableEstimate client={client} vehicle={vehicle} selections={selections} result={result} estimateNumber={estimateNumber} createdAt={createdAt} />,
          printRoot,
        )}
      <div className="bg-transparent">
        {/* Header */}
        <div className="border-b border-white/10 px-6 py-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#C9A227]/80">
            {pricingConfig.company.name} · Estimate {estimateNumber}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">{formatDate(createdAt)}</p>
          {(client.name || vehicleLine) && (
            <div className="mt-3 space-y-0.5 text-sm">
              {client.name && <p className="font-medium text-slate-100">{client.name}</p>}
              {vehicleLine && (
                <p className="text-slate-400">
                  {vehicleLine}
                  {vehicle.color ? ` · ${vehicle.color}` : ''}
                  {vehicleTypeLabel ? ` · ${vehicleTypeLabel}` : ''}
                </p>
              )}
            </div>
          )}
        </div>

        {technicianNotes.length > 0 && (
          <div className="border-b border-white/10 bg-amber-400/[0.04] px-6 py-3">
            <p className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-amber-300">
              <TriangleAlert className="h-3 w-3" />
              Technician Notes
            </p>
            <ul className="space-y-1">
              {technicianNotes.map((note) => (
                <li key={note} className="text-xs text-amber-200/80">
                  {note}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Total */}
        <div className="relative px-6 py-9 text-center">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-36 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C9A227]/15 blur-3xl"
          />
          <p className="relative text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">Estimated Total</p>
          <AnimatedNumber
            value={result.total}
            format={formatCurrency}
            className="hh-gold-text relative mt-2 block font-serif text-6xl font-bold tracking-tight"
          />
        </div>

        <div className="hh-divider mx-6" />

        {/* Itemized breakdown */}
        <div className="px-6 py-4">
          <StatRow label={`Base Service — ${result.baseService.label}`} value={formatCurrency(result.baseService.amount)} />

          {showExterior && (
            <ExplainedRow label={`Exterior Condition — ${result.exteriorCondition.label}`} amount={result.exteriorCondition.amount} factors={result.exteriorCondition.factors} />
          )}

          {showInterior && (
            <ExplainedRow label={`Interior Condition — ${result.interiorCondition.label}`} amount={result.interiorCondition.amount} factors={result.interiorCondition.factors} />
          )}

          {result.addOnLineItems.length > 0 && (
            <div className="mt-2 space-y-1 border-t border-white/5 pt-2">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Premium Enhancements</p>
              {result.addOnLineItems.map((item) => (
                <StatRow key={item.label} label={item.label} value={formatCurrency(item.amount)} muted />
              ))}
            </div>
          )}

          <div className="mt-2 border-t border-white/5 pt-2">
            <StatRow label={`Travel Fee (${result.travelMilesBilled} billable mi)`} value={formatCurrency(result.travelFee)} muted />
          </div>

          <div className="mt-2 border-t border-white/10 pt-2">
            <StatRow label="Subtotal" value={formatCurrency(result.subtotal)} />
            {result.discountAmount > 0 && (
              <StatRow label={`Discount — ${result.discountLabel}`} value={`-${formatCurrency(result.discountAmount)}`} negative />
            )}
          </div>
        </div>

        {client.notes && (
          <>
            <div className="hh-divider mx-6" />
            <div className="px-6 py-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Notes</p>
              <p className="mt-1 text-sm text-slate-300">{client.notes}</p>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 border-t border-white/10 bg-black/20 p-4">
        <Button variant="secondary" icon={<Clipboard className="h-4 w-4" />} onClick={handleCopy}>
          Copy
        </Button>
        <Button variant="secondary" icon={<Printer className="h-4 w-4" />} onClick={handlePrint}>
          Print
        </Button>
        <Button variant="secondary" icon={<FileDown className="h-4 w-4" />} onClick={handleExportPdf} disabled={exporting}>
          {exporting ? 'Exporting…' : 'Export PDF'}
        </Button>
        <Button variant="primary" icon={<Save className="h-4 w-4" />} onClick={onSave}>
          Save
        </Button>
      </div>
      <p className="border-t border-white/5 px-4 py-2.5 text-center text-[10px] tracking-wide text-slate-600">
        <kbd className="text-slate-500">⌘S</kbd> Save · <kbd className="text-slate-500">⌘K</kbd> Copy ·{' '}
        <kbd className="text-slate-500">⌘P</kbd> Print · <kbd className="text-slate-500">⌘N</kbd> New Estimate
      </p>
    </GlassPanel>
  )
}

function ExplainedRow({ label, amount, factors }: { label: string; amount: number; factors?: string[] }) {
  return (
    <div className="py-1.5">
      <StatRow label={label} value={formatSignedCurrency(amount)} muted />
      {factors && factors.length > 0 && factors.join('') !== '' && <p className="mt-0.5 text-xs text-slate-500">{factors.filter(Boolean).join(' · ')}</p>}
    </div>
  )
}
