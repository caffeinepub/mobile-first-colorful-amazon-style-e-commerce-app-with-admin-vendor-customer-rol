import { Badge } from '@/components/ui/badge';
import { getOrderStatusClassName, getOrderStatusText } from '../../utils/statusStyles';

interface OrderStatusBadgeProps {
  status: any;
  className?: string;
}

export default function OrderStatusBadge({ status, className = '' }: OrderStatusBadgeProps) {
  return (
    <Badge className={`${getOrderStatusClassName(status)} ${className}`}>
      {getOrderStatusText(status)}
    </Badge>
  );
}
