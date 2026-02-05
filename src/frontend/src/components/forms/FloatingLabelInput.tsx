import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FloatingLabelInputProps extends React.ComponentPropsWithoutRef<typeof Input> {
  label: string;
  id: string;
}

export default function FloatingLabelInput({ label, id, className, ...props }: FloatingLabelInputProps) {
  return (
    <div className="floating-label-container relative">
      <Input
        id={id}
        placeholder=" "
        className={cn(
          'h-14 text-base rounded-xl border-2 focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all peer',
          className
        )}
        {...props}
      />
      <Label
        htmlFor={id}
        className="floating-label absolute left-3 top-1/2 -translate-y-1/2 bg-card px-1 text-base text-muted-foreground pointer-events-none transition-all peer-focus:top-0 peer-focus:text-xs peer-focus:text-secondary peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-secondary"
      >
        {label}
      </Label>
    </div>
  );
}
