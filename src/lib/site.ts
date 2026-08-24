/** Configuración global del sitio. Cambiar aquí renombra toda la marca. */
export const site = {
  name: 'Nomadea',
  tagline: 'Encuentra tu próximo trabajo remoto',
  description:
    'Buscador de empleos remotos en español: tecnología, diseño, marketing y más. Filtra por categoría, experiencia y salario. Crea alertas personalizadas.',
} as const

export const siteUrl = (): string =>
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, '') ?? 'http://localhost:3000'
