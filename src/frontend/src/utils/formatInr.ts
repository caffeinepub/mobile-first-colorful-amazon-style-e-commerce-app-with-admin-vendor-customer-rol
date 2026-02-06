/**
 * Format a bigint/Nat amount as INR currency
 * @param amount - The amount in smallest currency unit (paise)
 * @returns Formatted string with ₹ symbol
 */
export function formatInr(amount: bigint | number): string {
  let numAmount: number;
  
  if (typeof amount === 'bigint') {
    numAmount = Number(amount);
  } else {
    numAmount = amount;
  }
  
  // Coerce non-finite inputs to 0 to prevent crashes
  if (!Number.isFinite(numAmount)) {
    numAmount = 0;
  }
  
  return `₹${numAmount.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}
