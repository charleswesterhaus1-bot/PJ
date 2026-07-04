// The physical print output — rendered via a portal into #print-root (see
// index.css), a sibling of #root rather than a descendant of it. Deliberately
// plain, light, ink-friendly markup: no dark glass theme, no internal
// profitability data (it's simply never passed in).

import { pricingConfig } from '../../config/pricingConfig'
import { formatCurrency, formatDate, formatSignedCurrency } from '../../utils/format'
import type { ClientDraft, EstimateResult, EstimateSelections, VehicleInfo } from '../../types'

interface PrintableEstimateProps {
  client: ClientDraft
  vehicle: VehicleInfo
  selections: EstimateSelections
  result: EstimateResult
  estimateNumber: string
  createdAt: string
}

export function PrintableEstimate({ client, vehicle, selections, result, estimateNumber, createdAt }: PrintableEstimateProps) {
  const vehicleLine = [vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(' ')
  const vehicleTypeLabel = pricingConfig.vehicleTypes.find((t) => t.id === selections.vehicleTypeId)?.label

  return (
    <div className="mx-auto max-w-2xl bg-white px-10 py-10 text-[#1a1d29]" style={{ fontFamily: 'Georgia, serif' }}>
      <div className="mb-6 border-b-2 border-[#0B1B3A] pb-4">
        <p className="text-2xl font-bold tracking-wide text-[#0B1B3A]">{pricingConfig.company.name.toUpperCase()}</p>
        <p className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-gray-500">Exotic &amp; High-Performance Vehicle Detailing</p>
        <div className="mt-3 flex justify-between text-sm">
          <span className="font-semibold">Estimate {estimateNumber}</span>
          <span className="text-gray-500">{formatDate(createdAt)}</span>
        </div>
      </div>

      {(client.name || vehicleLine) && (
        <div className="mb-6">
          {client.name && <p className="text-base font-semibold">{client.name}</p>}
          {vehicleLine && (
            <p className="text-sm text-gray-600">
              {vehicleLine}
              {vehicle.color ? ` · ${vehicle.color}` : ''}
              {vehicleTypeLabel ? ` · ${vehicleTypeLabel}` : ''}
            </p>
          )}
        </div>
      )}

      <div className="mb-6 border-t border-gray-200 pt-6 text-center">
        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500">Estimated Total</p>
        <p className="mt-1 text-4xl font-bold text-[#8a6a15]">{formatCurrency(result.total)}</p>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8a6a15]">Pricing</p>

        <Row label={`Base Service — ${result.baseService.label}`} value={formatCurrency(result.baseService.amount)} />

        <Row label={`Vehicle Complexity — ${result.vehicleComplexity.label}`} value={formatSignedCurrency(result.vehicleComplexity.amount)} muted />
        {result.vehicleComplexity.factors && result.vehicleComplexity.factors.length > 0 && <Note text={result.vehicleComplexity.factors.join(' · ')} />}

        {(result.sizeAccess.amount !== 0 || (result.sizeAccess.factors?.length ?? 0) > 0) && (
          <>
            <Row label={`Size & Access — ${result.sizeAccess.label}`} value={formatSignedCurrency(result.sizeAccess.amount)} muted />
            {result.sizeAccess.factors && result.sizeAccess.factors.length > 0 && <Note text={result.sizeAccess.factors.join(' · ')} />}
          </>
        )}

        <Row label={`Condition & Findings — ${result.conditionFindings.label}`} value={formatSignedCurrency(result.conditionFindings.amount)} muted />
        {result.conditionFindings.factors && result.conditionFindings.factors.length > 0 && <Note text={result.conditionFindings.factors.join(' · ')} />}

        {result.addOnLineItems.length > 0 && (
          <div className="mt-2 border-t border-gray-100 pt-2">
            {result.addOnLineItems.map((item) => (
              <div key={item.label}>
                <Row label={item.label} value={formatCurrency(item.amount)} muted />
                {item.reason && <Note text={item.reason} />}
              </div>
            ))}
          </div>
        )}

        <div className="mt-2 border-t border-gray-100 pt-2">
          <Row label={`Travel Fee (${result.travelMilesBilled} billable mi)`} value={formatCurrency(result.travelFee)} muted />
        </div>

        <div className="mt-2 border-t border-gray-300 pt-2">
          <Row label="Subtotal" value={formatCurrency(result.subtotal)} bold />
          {result.discountAmount > 0 && <Row label={`Discount — ${result.discountLabel}`} value={`-${formatCurrency(result.discountAmount)}`} />}
        </div>
      </div>

      {client.notes && (
        <div className="mt-6 border-t border-gray-200 pt-4">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">Notes</p>
          <p className="text-sm text-gray-700">{client.notes}</p>
        </div>
      )}

      <p className="mt-10 text-center text-[10px] text-gray-400">
        {pricingConfig.company.name} · Estimate {estimateNumber}
      </p>
    </div>
  )
}

function Row({ label, value, muted, bold }: { label: string; value: string; muted?: boolean; bold?: boolean }) {
  return (
    <div className={`flex items-baseline justify-between py-1 text-sm ${muted ? 'text-gray-600' : 'text-[#1a1d29]'} ${bold ? 'font-bold' : ''}`}>
      <span>{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  )
}

function Note({ text }: { text: string }) {
  return <p className="pb-1 text-xs italic text-gray-500">{text}</p>
}
