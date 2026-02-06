/**
 * Masks Aadhaar number to show only the last 4 digits
 * @param aadhaar - Full Aadhaar number
 * @returns Masked Aadhaar string (e.g., "XXXX-XXXX-1234")
 */
export function maskAadhaar(aadhaar: string): string {
  if (!aadhaar || aadhaar.length < 4) {
    return 'XXXX-XXXX-XXXX';
  }
  
  const lastFour = aadhaar.slice(-4);
  return `XXXX-XXXX-${lastFour}`;
}
