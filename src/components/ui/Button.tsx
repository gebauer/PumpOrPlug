import type { ButtonHTMLAttributes } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  fullWidth?: boolean
}

export function Button({ variant = 'primary', fullWidth, className = '', children, ...rest }: Props) {
  const base = 'inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 disabled:opacity-40'

  const variants = {
    primary: 'bg-green-500 text-slate-900 hover:bg-green-400 active:bg-green-600',
    secondary: 'bg-slate-700 text-slate-100 hover:bg-slate-600 active:bg-slate-800',
    ghost: 'text-slate-400 hover:text-slate-100 hover:bg-slate-800',
  }

  return (
    <button
      className={`${base} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
