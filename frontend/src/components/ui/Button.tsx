import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transform hover:scale-105 active:scale-95',
        secondary:
          'bg-slate-800/50 text-cyan-300 border border-cyan-500/30 hover:bg-slate-700/50 hover:border-cyan-400/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]',
        ghost:
          'text-cyan-300 hover:bg-cyan-500/10 hover:text-cyan-200',
        danger:
          'bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-400 hover:to-pink-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]',
      },
      size: {
        sm: 'h-9 px-3',
        default: 'h-11 px-8',
        lg: 'h-12 px-10 text-base',
        xl: 'h-14 px-12 text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, disabled, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {/* Animated background effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
        
        {/* Content */}
        <div className="relative flex items-center gap-2">
          {loading && (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          )}
          {children}
        </div>
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
export type { ButtonProps }; 