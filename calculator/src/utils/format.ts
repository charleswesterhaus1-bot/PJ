// Centralized display formatting so every component renders numbers the
// same way (currency, hours, percentages).

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatCurrency(amount: number): string {
  return currencyFormatter.format(amount)
}

export function formatSignedCurrency(amount: number): string {
  if (Math.abs(amount) < 0.005) return formatCurrency(0)
  const sign = amount > 0 ? '+' : '-'
  return `${sign}${currencyFormatter.format(Math.abs(amount))}`
}

export function formatHours(hours: number): string {
  const rounded = Math.round(hours * 100) / 100
  return `${rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(2)} hr${rounded === 1 ? '' : 's'}`
}

export function formatDate(iso: string): string {
  const date = new Date(iso)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export function formatDateShort(iso: string): string {
  const date = new Date(iso)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
