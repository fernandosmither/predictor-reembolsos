import { forwardRef, useState, useCallback } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  error?: string;
  currency?: boolean;
  onChange?: (value: string) => void;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, currency = false, onChange, value, ...props }, ref) => {
    const [focused, setFocused] = useState(false);

    const formatCurrency = useCallback((value: string) => {
      // Remove all non-digits
      const numbers = value.replace(/\D/g, '');
      // Add thousands separators
      return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let newValue = e.target.value;
      
      if (currency) {
        newValue = formatCurrency(newValue);
      }
      
      onChange?.(newValue);
    };

    const displayValue = currency && value ? `$${value}` : value;

    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-cyan-200 transition-colors duration-200">
            {label}
          </label>
        )}
        
        <div className="relative">
          <input
            ref={ref}
            className={cn(
              'flex h-12 w-full rounded-lg border px-4 py-3 text-base transition-all duration-300',
              'bg-slate-800/50 border-slate-600/50 text-cyan-100 placeholder:text-slate-400',
              'backdrop-blur-sm',
              'hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)]',
              'focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_20px_rgba(6,182,212,0.2)]',
              'disabled:cursor-not-allowed disabled:opacity-50',
              {
                'border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.2)]': focused,
                'border-red-500/50 focus:border-red-500': error,
              },
              className
            )}
            value={displayValue || ''}
            onChange={handleChange}
            onFocus={(e) => {
              setFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />
          
          {/* Animated border effect */}
          <div className={cn(
            'absolute inset-0 rounded-lg border-2 border-cyan-400/30 opacity-0 transition-opacity duration-300 pointer-events-none',
            focused && 'opacity-100 animate-pulse'
          )} />
          
          {/* Currency indicator */}
          {currency && !value && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors duration-200 text-sm">
              CLP
            </div>
          )}
        </div>

        {error && (
          <p className="text-sm text-red-400 animate-in fade-in duration-200">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
export type { InputProps }; 