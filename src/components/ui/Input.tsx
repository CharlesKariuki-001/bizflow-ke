import React, { forwardRef } from 'react';
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, leftIcon, ...props }, ref) => {
    return (
      <div className="w-full">
        {label &&
        <label className="block text-sm font-medium text-text mb-1.5">
            {label}
          </label>
        }
        <div className="relative">
          {leftIcon &&
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
              {leftIcon}
            </div>
          }
          <input
            ref={ref}
            className={`flex h-11 w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-text transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:cursor-not-allowed disabled:opacity-50 ${leftIcon ? 'pl-10' : ''} ${error ? 'border-accent focus-visible:ring-accent' : ''} ${className}`}
            {...props} />
          
        </div>
        {error && <p className="mt-1.5 text-sm text-accent">{error}</p>}
      </div>);

  }
);
Input.displayName = 'Input';