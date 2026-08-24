import type { InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export function Input({
  className,
  type = 'text',
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type={type}
      className={cn(
        'h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 shadow-xs transition-colors',
        'placeholder:text-slate-400',
        'focus:border-emerald-500 focus:outline-2 focus:outline-offset-0 focus:outline-emerald-500/40',
        'disabled:cursor-not-allowed disabled:bg-slate-50',
        'aria-invalid:border-red-500 aria-invalid:focus:outline-red-500/40',
        'dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100',
        className,
      )}
      {...props}
    />
  )
}
