import { forwardRef } from 'react';
import { clsx } from 'clsx';

/**
 * Accessible textarea with label, character counter, error, and hint.
 */
const Textarea = forwardRef(function Textarea(
  {
    label,
    error,
    hint,
    maxLength,
    value = '',
    className = '',
    id,
    required,
    rows = 4,
    ...rest
  },
  ref,
) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  const charCount = typeof value === 'string' ? value.length : 0;
  const nearLimit = maxLength && charCount > maxLength * 0.85;
  const atLimit = maxLength && charCount >= maxLength;

  return (
    <div className="space-y-1.5">
      {label && (
        <div className="flex items-center justify-between">
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

          {maxLength !== undefined && (
            <span
              className={clsx(
                'text-xs tabular-nums transition-colors',
                atLimit
                  ? 'text-red-500 font-semibold'
                  : nearLimit
                  ? 'text-amber-500'
                  : 'text-gray-400',
              )}
              aria-live="polite"
              aria-label={`${charCount} of ${maxLength} characters used`}
            >
              {charCount}/{maxLength}
            </span>
          )}
        </div>
      )}

      <textarea
        ref={ref}
        id={inputId}
        value={value}
        maxLength={maxLength}
        rows={rows}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={
          error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
        }
        className={clsx(
          'w-full rounded-xl border px-4 py-3 text-sm text-gray-800 placeholder-gray-400',
          'bg-white transition-all duration-200 resize-none',
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

export default Textarea;
