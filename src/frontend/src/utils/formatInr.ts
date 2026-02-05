/**
 * Format a bigint/Nat amount as INR currency
 * @param amount - The amount in smallest currency unit (paise)
 * @returns Formatted string with ₹ symbol
 */
export function formatInr(amount: bigint | number): string {
  const numAmount = typeof amount === 'bigint' ? Number(amount) : amount;
  return `₹${numAmount.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}
