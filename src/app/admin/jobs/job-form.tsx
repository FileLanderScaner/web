'use client'

import { useActionState } from 'react'
import { createJobAction, type JobFormState } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert } from '@/components/ui/alert'

const initialState: JobFormState = {}

export function JobForm({
  companies,
  categories,
}: {
  companies: { id: string; name: string }[]
  categories: { id: string; name: string }[]
}) {
  const [state, formAction, pending] = useActionState(createJobAction, initialState)

  return (
    <form action={formAction} className="space-y-5">
      {state.error && <Alert tone="error">{state.error}</Alert>}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="title">Título del empleo *</Label>
          <Input id="title" name="title" required placeholder="Ej: Desarrollador Full Stack React" />
        </div>

        <div>
          <Label htmlFor="company_id">Empresa *</Label>
          <select id="company_id" name="company_id" required className="input">
            <option value="">Seleccionar empresa</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="category_id">Categoría</Label>
          <select id="category_id" name="category_id" className="input">
            <option value="">Sin categoría</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="description">Descripción *</Label>
          <textarea id="description" name="description" rows={6} required className="input resize-none" placeholder="Describe el empleo, responsabilidades, etc." />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="requirements">Requisitos</Label>
          <textarea id="requirements" name="requirements" rows={4} className="input resize-none" placeholder="Requisitos y cualificaciones..." />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="benefits">Beneficios</Label>
          <textarea id="benefits" name="benefits" rows={3} className="input resize-none" placeholder="Beneficios que ofrece el empleo..." />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="skills">Habilidades (separadas por coma)</Label>
          <Input id="skills" name="skills" placeholder="Ej: React, TypeScript, Node.js" />
        </div>

        <div>
          <Label htmlFor="location">Ubicación</Label>
          <Input id="location" name="location" placeholder="Ej: Ciudad de México" />
        </div>

        <div>
          <Label htmlFor="employment_type">Tipo de contrato</Label>
          <select id="employment_type" name="employment_type" className="input">
            <option value="full_time">Tiempo completo</option>
            <option value="part_time">Medio tiempo</option>
            <option value="contract">Contrato</option>
            <option value="freelance">Freelance</option>
            <option value="internship">Pasantía</option>
            <option value="temporary">Temporal</option>
          </select>
        </div>

        <div>
          <Label htmlFor="experience_level">Nivel de experiencia</Label>
          <select id="experience_level" name="experience_level" className="input">
            <option value="">No especificado</option>
            <option value="junior">Junior</option>
            <option value="mid">Mid-level</option>
            <option value="senior">Senior</option>
            <option value="lead">Lead</option>
          </select>
        </div>

        <div className="flex items-end gap-4">
          <div className="flex-1">
            <Label htmlFor="salary_min">Salario mínimo</Label>
            <Input id="salary_min" name="salary_min" type="number" placeholder="0" />
          </div>
          <div className="flex-1">
            <Label htmlFor="salary_max">Salario máximo</Label>
            <Input id="salary_max" name="salary_max" type="number" placeholder="0" />
          </div>
        </div>

        <div>
          <Label htmlFor="salary_currency">Moneda</Label>
          <Input id="salary_currency" name="salary_currency" defaultValue="USD" />
        </div>

        <div>
          <Label htmlFor="source_url">URL fuente</Label>
          <Input id="source_url" name="source_url" type="url" placeholder="https://..." />
        </div>

        <div className="flex items-center gap-2">
          <input id="remote" name="remote" type="checkbox" value="true" className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
          <Label htmlFor="remote">100% Remoto</Label>
        </div>
      </div>

      <Button type="submit" loading={pending} className="w-full sm:w-auto">
        Crear empleo
      </Button>
    </form>
  )
}
