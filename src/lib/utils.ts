/** Une clases condicionales filtrando valores falsos. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}

/** Extrae el primer mensaje de error legible de un ZodError. */
export function firstZodMessage(error: {
  issues: ReadonlyArray<{ message: string }>
}): string {
  return error.issues[0]?.message ?? 'Datos inválidos.'
}
