import type { InputHTMLAttributes } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  unit?: string
  error?: string
}

export function Input({ label, unit, error, className = '', id, ...rest }: Props) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          className={`w-full rounded-xl bg-slate-800 px-4 py-3 text-slate-100 placeholder-slate-500 outline-none ring-1 ring-slate-700 focus:ring-green-500 ${unit ? 'pr-16' : ''} ${className}`}
          {...rest}
        />
        {unit && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">{unit}</span>
        )}
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}
