/**
 * Formats a duration in seconds to a human-readable string.
 * @example formatDuration(5400) => "1h 30m 0s"
 */
export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const parts = [];
  if (h > 0) parts.push(`${h}h`);
  if (m > 0 || h > 0) parts.push(`${m}m`);
  parts.push(`${s}s`);

  return parts.join(' ');
}

/**
 * Calculates earnings based on duration and hourly rate.
 * @param durationSeconds - Duration in seconds
 * @param hourlyRate - Rate in currency per hour
 */
export function calculateEarnings(durationSeconds: number, hourlyRate: number): number {
  return (durationSeconds / 3600) * hourlyRate;
}

/**
 * Formats a number as a currency string.
 * @example formatCurrency(1234.5) => "$1234.50"
 */
export function formatCurrency(amount: number, currency: 'ARS' | 'USD' = 'USD'): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: currency === 'ARS' ? 0 : 2,
    maximumFractionDigits: currency === 'ARS' ? 0 : 2,
  }).format(amount);
}
