import { forwardRef } from 'react';
import { clsx } from 'clsx';

/**
 * Accessible text input with label, error, and hint support.
 */
const Input = forwardRef(function Input(
  { label, error, hint, className = '', id, required, ...rest },
  ref,
) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 select-none"
        >
          {label}
          {required && (
            <span className="text-rose-500 ml-0.5" aria-hidden="true">
              {' '}*
            </span>
          )}
        </label>
      )}

      <input
        ref={ref}
        id={inputId}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        className={clsx(
          'w-full rounded-xl border px-4 py-3 text-sm text-gray-800 placeholder-gray-400',
          'bg-white transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:border-transparent',
          error
            ? 'border-red-400 focus:ring-red-400'
            : 'border-gray-200 hover:border-gray-300 focus:ring-pink-400',
          className,
        )}
        {...rest}
      />

      {error && (
        <p
          id={`${inputId}-error`}
          role="alert"
          className="flex items-center gap-1 text-xs text-red-500"
        >
          <span aria-hidden="true">⚠️</span> {error}
        </p>
      )}

      {hint && !error && (
        <p id={`${inputId}-hint`} className="text-xs text-gray-400">
          {hint}
        </p>
      )}
    </div>
  );
});

export default Input;
