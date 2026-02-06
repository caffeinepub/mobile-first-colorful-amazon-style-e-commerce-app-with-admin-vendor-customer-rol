/**
 * Shared helper utilities to extract user-friendly English messages from unknown errors
 * (including backend trap/reject messages) for reuse across admin diagnostics and error displays.
 */

/**
 * Extract a user-friendly English message from unknown errors
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

/**
 * Create a copyable diagnostics text block with error details
 */
export function createDiagnosticsText(
  error: unknown,
  context?: {
    componentStack?: string;
    timestamp?: Date;
    userAgent?: string;
  }
): string {
  const lines: string[] = [];
  
  lines.push('Error Diagnostics');
  lines.push('═══════════════');
  lines.push('');
  
  lines.push('Error Message:');
  lines.push(extractErrorMessage(error));
  lines.push('');
  
  if (context?.componentStack) {
    lines.push('Component Stack:');
    lines.push(context.componentStack.trim());
    lines.push('');
  }
  
  if (context?.timestamp) {
    lines.push('Timestamp: ' + context.timestamp.toISOString());
  }
  
  if (context?.userAgent) {
    lines.push('User Agent: ' + context.userAgent);
  }
  
  return lines.join('\n');
}
