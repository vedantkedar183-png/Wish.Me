import { forwardRef } from 'react';
import { clsx } from 'clsx';

/**
 * Accessible select dropdown with label, error, and hint.
 *
 * @param {{ value: string, label: string }[]} options
 */
const Select = forwardRef(function Select(
  { label, error, hint, options = [], className = '', id, required, ...rest },
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

      <div className="relative">
        <select
          ref={ref}
          id={inputId}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
          }
          className={clsx(
            'w-full rounded-xl border px-4 py-3 pr-10 text-sm text-gray-800',
            'bg-white transition-all duration-200 appearance-none cursor-pointer',
            'focus:outline-none focus:ring-2 focus:border-transparent',
            error
              ? 'border-red-400 focus:ring-red-400'
              : 'border-gray-200 hover:border-gray-300 focus:ring-pink-400',
            className,
          )}
          {...rest}
        >
          {options.map((opt) => (
            <option key={opt.value ?? opt.id} value={opt.value ?? opt.id}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Custom chevron */}
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

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

export default Select;
