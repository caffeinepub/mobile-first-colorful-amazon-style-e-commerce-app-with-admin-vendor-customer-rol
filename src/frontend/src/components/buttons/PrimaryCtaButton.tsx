import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import * as React from 'react';

export default function PrimaryCtaButton({ 
  className, 
  children, 
  ...props 
}: React.ComponentPropsWithoutRef<typeof Button>) {
  return (
    <Button
      className={cn('gradient-primary-cta', className)}
      {...props}
    >
      {children}
    </Button>
  );
}
