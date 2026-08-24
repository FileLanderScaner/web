import { cn } from '@/lib/utils'

type Tone = 'error' | 'success' | 'info'

const tones: Record<Tone, string> = {
  error:
    'border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-300',
  success:
    'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300',
  info: 'border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-300',
}

const roles: Record<Tone, 'alert' | 'status'> = {
  error: 'alert',
  success: 'status',
  info: 'status',
}

export function Alert({
  tone = 'info',
  children,
  className,
}: {
  tone?: Tone
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      role={roles[tone]}
      className={cn(
        'rounded-lg border px-3 py-2.5 text-sm break-words',
        tones[tone],
        className,
      )}
    >
      {children}
    </div>
  )
}
