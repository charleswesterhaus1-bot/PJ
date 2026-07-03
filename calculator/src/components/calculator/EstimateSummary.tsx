// The live-updating output panel: itemized pricing, labor/crew estimates,
// and the action row (copy / print / export PDF / save). This is also the
// node captured for print and PDF export (id="hh-print-area").

import { useRef, useState } from 'react'
import { Clipboard, FileDown, Printer, Save, Users, Wrench, Clock3 } from 'lucide-react'
import { GlassPanel } from '../ui/GlassPanel'
import { StatRow } from '../ui/StatRow'
import { AnimatedNumber } from '../ui/AnimatedNumber'
import { Button } from '../ui/Button'
import type { ClientInfo, EstimateResult, EstimateSelections } from '../../types'
import { formatCurrency, formatDate, formatHours, formatSignedCurrency } from '../../utils/format'
import { buildEstimateText } from '../../utils/estimateText'
import { copyToClipboard } from '../../utils/clipboard'
import { useToast } from '../../hooks/useToast'
import { pricingConfig } from '../../config/pricingConfig'

interface EstimateSummaryProps {
  client: ClientInfo
  selections: EstimateSelections
  result: EstimateResult
  estimateNumber: string
  createdAt: string
  onSave: () => void
}

export function EstimateSummary({ client, selections, result, estimateNumber, createdAt, onSave }: EstimateSummaryProps) {
  const printRef = useRef<HTMLDivElement>(null)
  const { showToast } = useToast()
  const [exporting, setExporting] = useState(false)

  const vehicleLine = [client.vehicleYear, client.vehicleMake, client.vehicleModel].filter(Boolean).join(' ')

  async function handleCopy() {
    const text = buildEstimateText(estimateNumber, createdAt, client, selections, result)
    const ok = await copyToClipboard(text)
    showToast(ok ? 'Estimate copied to clipboard' : 'Could not copy estimate', ok ? 'success' : 'error')
  }

  function handlePrint() {
    window.print()
  }

  async function handleExportPdf() {
    if (!printRef.current) return
    setExporting(true)
    try {
      const { exportNodeToPdf } = await import('../../utils/pdfExport')
      await exportNodeToPdf(printRef.current, `${estimateNumber}.pdf`)
      showToast('PDF exported', 'success')
    } catch {
      showToast('Could not export PDF', 'error')
    } finally {
      setExporting(false)
    }
  }

  return (
    <GlassPanel className="sticky top-24 overflow-hidden p-0" delay={0.1}>
      <div id="hh-print-area" ref={printRef} className="bg-transparent">
        {/* Header */}
        <div className="border-b border-white/10 px-6 py-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#C9A227]/80">
            {pricingConfig.company.name} · Estimate {estimateNumber}
          </p>
          <p className="mt-0.5 text-xs text-slate-500">{formatDate(createdAt)}</p>
          {(client.clientName || vehicleLine) && (
            <div className="mt-3 space-y-0.5 text-sm">
              {client.clientName && <p className="font-medium text-slate-100">{client.clientName}</p>}
              {vehicleLine && (
                <p className="text-slate-400">
                  {vehicleLine}
                  {client.vehicleColor ? ` · ${client.vehicleColor}` : ''}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Total */}
        <div className="px-6 py-6 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-500">Estimated Total</p>
          <AnimatedNumber
            value={result.total}
            format={formatCurrency}
            className="hh-gold-text block font-serif text-5xl font-bold tracking-tight"
          />
        </div>

        <div className="hh-divider mx-6" />

        {/* Itemized breakdown */}
        <div className="px-6 py-4">
          <StatRow label={`Base Service — ${result.baseService.label}`} value={formatCurrency(result.baseService.amount)} />
          <StatRow label={`Vehicle Type — ${result.vehicleTypeAdjustment.label}`} value={formatSignedCurrency(result.vehicleTypeAdjustment.amount)} muted />
          <StatRow label={`Vehicle Size — ${result.vehicleSizeAdjustment.label}`} value={formatSignedCurrency(result.vehicleSizeAdjustment.amount)} muted />
          <StatRow label={`Condition — ${result.conditionAdjustment.label}`} value={formatSignedCurrency(result.conditionAdjustment.amount)} muted />

          {result.addOnLineItems.length > 0 && (
            <div className="mt-2 border-t border-white/5 pt-2">
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

        <div className="hh-divider mx-6" />

        {/* Labor / crew estimates */}
        <div className="grid grid-cols-3 gap-2 px-6 py-5 text-center">
          <div>
            <Wrench className="mx-auto mb-1 h-4 w-4 text-[#C9A227]" />
            <p className="text-sm font-semibold text-slate-100">{formatHours(result.laborHours)}</p>
            <p className="text-[10px] uppercase tracking-wider text-slate-500">Labor</p>
          </div>
          <div>
            <Users className="mx-auto mb-1 h-4 w-4 text-[#C9A227]" />
            <p className="text-sm font-semibold text-slate-100">{result.teamSizeLabel}</p>
            <p className="text-[10px] uppercase tracking-wider text-slate-500">Team</p>
          </div>
          <div>
            <Clock3 className="mx-auto mb-1 h-4 w-4 text-[#C9A227]" />
            <p className="text-sm font-semibold text-slate-100">{formatHours(result.appointmentLengthHours)}</p>
            <p className="text-[10px] uppercase tracking-wider text-slate-500">Appointment</p>
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

      {/* Actions — excluded from print/export via data-print-hide */}
      <div data-print-hide className="grid grid-cols-2 gap-2 border-t border-white/10 bg-black/20 p-4">
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
      <p data-print-hide className="border-t border-white/5 px-4 py-2.5 text-center text-[10px] tracking-wide text-slate-600">
        <kbd className="text-slate-500">⌘S</kbd> Save · <kbd className="text-slate-500">⌘K</kbd> Copy ·{' '}
        <kbd className="text-slate-500">⌘P</kbd> Print · <kbd className="text-slate-500">⌘N</kbd> New Estimate
      </p>
    </GlassPanel>
  )
}
