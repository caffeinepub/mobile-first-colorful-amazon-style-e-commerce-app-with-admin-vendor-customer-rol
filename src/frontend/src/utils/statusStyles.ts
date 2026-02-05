/**
 * Shared status styling utilities for consistent badge/pill appearance across the app
 */

export type OrderStatusType = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type UIStatusType = 'success' | 'error' | 'warning' | 'info' | 'muted';

/**
 * Maps order status to consistent className for badges
 */
export function getOrderStatusClassName(status: any): string {
  if ('delivered' in status) return 'bg-success text-success-foreground';
  if ('shipped' in status) return 'bg-secondary text-secondary-foreground';
  if ('processing' in status) return 'bg-info text-info-foreground';
  if ('cancelled' in status) return 'bg-destructive text-destructive-foreground';
  return 'bg-warning text-warning-foreground'; // pending
}

/**
 * Maps order status to human-readable text
 */
export function getOrderStatusText(status: any): string {
  if ('delivered' in status) return 'Delivered';
  if ('shipped' in status) return 'Shipped';
  if ('processing' in status) return 'Processing';
  if ('cancelled' in status) return 'Cancelled';
  return 'Pending';
}

/**
 * Maps UI status types to consistent className
 */
export function getUIStatusClassName(status: UIStatusType): string {
  switch (status) {
    case 'success':
      return 'bg-success text-success-foreground';
    case 'error':
      return 'bg-destructive text-destructive-foreground';
    case 'warning':
      return 'bg-warning text-warning-foreground';
    case 'info':
      return 'bg-info text-info-foreground';
    case 'muted':
    default:
      return 'bg-muted text-muted-foreground';
  }
}

/**
 * Get availability status styling
 */
export function getAvailabilityStatus(stock: number): {
  text: string;
  className: string;
} {
  if (stock === 0) {
    return {
      text: 'Out of Stock',
      className: 'bg-destructive text-destructive-foreground',
    };
  }
  if (stock < 10) {
    return {
      text: 'Low Stock',
      className: 'bg-warning text-warning-foreground',
    };
  }
  return {
    text: 'In Stock',
    className: 'bg-success text-success-foreground',
  };
}
