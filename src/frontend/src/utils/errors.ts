/**
 * Shared helper to extract a user-friendly English message from unknown errors
 * (including backend trap/reject messages) for reuse across admin diagnostics.
 */
export function extractErrorMessage(error: unknown): string {
  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }

  // Handle Error objects and error-like objects
  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as { message: string }).message;

    // Backend traps often come through as "Call was rejected: ..." with the actual message
    // Extract the actual error message after "rejected:" or "trap:"
    const rejectedMatch = message.match(/rejected:\s*(.+?)(?:\n|$)/i);
    if (rejectedMatch) {
      return rejectedMatch[1].trim();
    }

    const trapMatch = message.match(/trap:\s*(.+?)(?:\n|$)/i);
    if (trapMatch) {
      return trapMatch[1].trim();
    }

    return message;
  }

  return 'An unknown error occurred';
}

/**
 * Format an error for display in diagnostics panels
 */
export function formatErrorForDiagnostics(error: unknown): string {
  const message = extractErrorMessage(error);
  
  // Truncate very long error messages for display
  if (message.length > 200) {
    return message.substring(0, 197) + '...';
  }
  
  return message;
}
