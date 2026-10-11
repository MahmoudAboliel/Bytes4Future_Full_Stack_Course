import { forwardRef, useEffect, useRef } from 'react';
import { cn } from '../utils/cn';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ indeterminate, className, ...props }, ref) => {
    const innerRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
      if (innerRef.current) innerRef.current.indeterminate = !!indeterminate;
    }, [indeterminate]);

    return (
      <input
        type="checkbox"
        ref={(el) => {
          innerRef.current = el;
          if (typeof ref === 'function') ref(el);
          else if (ref) ref.current = el;
        }}
        className={cn(
          'h-4 w-4 shrink-0 cursor-pointer rounded border-gray-300 text-indigo-600',
          'focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:focus:ring-indigo-600',
          className,
        )}
        {...props}
      />
    );
  },
);
Checkbox.displayName = 'Checkbox';
