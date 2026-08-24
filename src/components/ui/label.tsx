import type { LabelHTMLAttributes } from 'react'

export function Label(props: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
      {...props}
    />
  )
}
