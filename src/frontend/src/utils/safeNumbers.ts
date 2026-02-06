/**
 * Safe numeric conversion and formatting utilities for defensive rendering
 */

/**
 * Safely convert bigint to number, clamping non-finite results to 0
 */
export function safeBigIntToNumber(value: bigint | undefined | null): number {
  if (value === undefined || value === null) return 0;
  
  try {
    const num = Number(value);
    // Check for NaN, Infinity, or -Infinity
    if (!Number.isFinite(num)) return 0;
    return num;
  } catch {
    return 0;
  }
}

/**
 * Safely format a number with fixed decimal places, never throwing
 */
export function safeFixed(value: number, decimals: number = 2): string {
  if (!Number.isFinite(value)) return '0.' + '0'.repeat(decimals);
  
  try {
    return value.toFixed(decimals);
  } catch {
    return '0.' + '0'.repeat(decimals);
  }
}

/**
 * Safely convert value to display string, handling all edge cases
 */
export function safeToString(value: bigint | number | undefined | null): string {
  if (value === undefined || value === null) return '0';
  
  try {
    if (typeof value === 'bigint') {
      return value.toString();
    }
    
    if (!Number.isFinite(value)) return '0';
    return value.toString();
  } catch {
    return '0';
  }
}

/**
 * Validate and sanitize chart data point
 */
export function sanitizeChartValue(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}
