/**
 * Tipos de la base de datos para supabase-js.
 *
 * ⚠️ Mantener sincronizado con supabase/migrations/.
 * Una vez vinculado el proyecto (`supabase link`), regenerar con:
 *   npx supabase gen types typescript --linked > src/types/database.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: string
          full_name: string | null
          headline: string | null
          bio: string | null
          location: string | null
          website_url: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role?: string
          full_name?: string | null
          headline?: string | null
          bio?: string | null
          location?: string | null
          website_url?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          role?: string
          full_name?: string | null
          headline?: string | null
          bio?: string | null
          location?: string | null
          website_url?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      companies: {
        Row: {
          id: string
          slug: string
          name: string
          description: string | null
          logo_url: string | null
          website_url: string | null
          hq_location: string | null
          size: string | null
          verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          description?: string | null
          logo_url?: string | null
          website_url?: string | null
          hq_location?: string | null
          size?: string | null
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          description?: string | null
          logo_url?: string | null
          website_url?: string | null
          hq_location?: string | null
          size?: string | null
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          id: string
          slug: string
          name: string
          description: string | null
          parent_id: string | null
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          description?: string | null
          parent_id?: string | null
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          description?: string | null
          parent_id?: string | null
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'categories_parent_id_fkey'
            columns: ['parent_id']
            isOneToOne: false
            referencedRelation: 'categories'
            referencedColumns: ['id']
          },
        ]
      }
      job_sources: {
        Row: {
          id: string
          slug: string
          name: string
          type: Database['public']['Enums']['source_type']
          base_url: string | null
          config: Json
          active: boolean
          last_imported_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          type?: Database['public']['Enums']['source_type']
          base_url?: string | null
          config?: Json
          active?: boolean
          last_imported_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          type?: Database['public']['Enums']['source_type']
          base_url?: string | null
          config?: Json
          active?: boolean
          last_imported_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      jobs: {
        Row: {
          id: string
          slug: string
          title: string
          company_id: string
          description: string
          requirements: string | null
          benefits: string | null
          location: string | null
          remote: boolean
          employment_type: Database['public']['Enums']['employment_type']
          salary_min: number | null
          salary_max: number | null
          salary_currency: string
          experience_level: Database['public']['Enums']['experience_level'] | null
          skills: string[]
          source_id: string | null
          source_url: string | null
          published_at: string | null
          expires_at: string | null
          status: Database['public']['Enums']['job_status']
          featured: boolean
          featured_until: string | null
          sponsored_until: string | null
          view_count: number
          search_vector: unknown
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          company_id: string
          description: string
          requirements?: string | null
          benefits?: string | null
          location?: string | null
          remote?: boolean
          employment_type?: Database['public']['Enums']['employment_type']
          salary_min?: number | null
          salary_max?: number | null
          salary_currency?: string
          experience_level?: Database['public']['Enums']['experience_level'] | null
          skills?: string[]
          source_id?: string | null
          source_url?: string | null
          published_at?: string | null
          expires_at?: string | null
          status?: Database['public']['Enums']['job_status']
          featured?: boolean
          featured_until?: string | null
          sponsored_until?: string | null
          view_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          company_id?: string
          description?: string
          requirements?: string | null
          benefits?: string | null
          location?: string | null
          remote?: boolean
          employment_type?: Database['public']['Enums']['employment_type']
          salary_min?: number | null
          salary_max?: number | null
          salary_currency?: string
          experience_level?: Database['public']['Enums']['experience_level'] | null
          skills?: string[]
          source_id?: string | null
          source_url?: string | null
          published_at?: string | null
          expires_at?: string | null
          status?: Database['public']['Enums']['job_status']
          featured?: boolean
          featured_until?: string | null
          sponsored_until?: string | null
          view_count?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'jobs_company_id_fkey'
            columns: ['company_id']
            isOneToOne: false
            referencedRelation: 'companies'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'jobs_source_id_fkey'
            columns: ['source_id']
            isOneToOne: false
            referencedRelation: 'job_sources'
            referencedColumns: ['id']
          },
        ]
      }
      job_categories: {
        Row: {
          job_id: string
          category_id: string
        }
        Insert: {
          job_id: string
          category_id: string
        }
        Update: {
          job_id?: string
          category_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'job_categories_job_id_fkey'
            columns: ['job_id']
            isOneToOne: false
            referencedRelation: 'jobs'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'job_categories_category_id_fkey'
            columns: ['category_id']
            isOneToOne: false
            referencedRelation: 'categories'
            referencedColumns: ['id']
          },
        ]
      }
      saved_jobs: {
        Row: {
          user_id: string
          job_id: string
          created_at: string
        }
        Insert: {
          user_id: string
          job_id: string
          created_at?: string
        }
        Update: {
          user_id?: string
          job_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'saved_jobs_job_id_fkey'
            columns: ['job_id']
            isOneToOne: false
            referencedRelation: 'jobs'
            referencedColumns: ['id']
          },
        ]
      }
      applications: {
        Row: {
          id: string
          user_id: string
          job_id: string
          status: string
          notes: string | null
          applied_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          job_id: string
          status?: string
          notes?: string | null
          applied_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          job_id?: string
          status?: string
          notes?: string | null
          applied_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'applications_job_id_fkey'
            columns: ['job_id']
            isOneToOne: false
            referencedRelation: 'jobs'
            referencedColumns: ['id']
          },
        ]
      }
      job_alerts: {
        Row: {
          id: string
          user_id: string
          name: string
          query: string | null
          location: string | null
          remote_only: boolean
          category_id: string | null
          employment_type: Database['public']['Enums']['employment_type'] | null
          experience_level: Database['public']['Enums']['experience_level'] | null
          min_salary: number | null
          frequency: Database['public']['Enums']['alert_frequency']
          active: boolean
          last_sent_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          query?: string | null
          location?: string | null
          remote_only?: boolean
          category_id?: string | null
          employment_type?: Database['public']['Enums']['employment_type'] | null
          experience_level?: Database['public']['Enums']['experience_level'] | null
          min_salary?: number | null
          frequency?: Database['public']['Enums']['alert_frequency']
          active?: boolean
          last_sent_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          query?: string | null
          location?: string | null
          remote_only?: boolean
          category_id?: string | null
          employment_type?: Database['public']['Enums']['employment_type'] | null
          experience_level?: Database['public']['Enums']['experience_level'] | null
          min_salary?: number | null
          frequency?: Database['public']['Enums']['alert_frequency']
          active?: boolean
          last_sent_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'job_alerts_category_id_fkey'
            columns: ['category_id']
            isOneToOne: false
            referencedRelation: 'categories'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<string, never>
        Returns: boolean
      }
    }
    Enums: {
      employment_type:
        | 'full_time'
        | 'part_time'
        | 'contract'
        | 'freelance'
        | 'internship'
        | 'temporary'
      experience_level: 'junior' | 'mid' | 'senior' | 'lead'
      job_status: 'draft' | 'published' | 'expired' | 'archived'
      alert_frequency: 'instant' | 'daily' | 'weekly'
      source_type: 'manual' | 'rss' | 'api'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  T extends keyof Database['public']['Tables'],
> = Database['public']['Tables'][T]['Row']

export type TablesInsert<
  T extends keyof Database['public']['Tables'],
> = Database['public']['Tables'][T]['Insert']

export type TablesUpdate<
  T extends keyof Database['public']['Tables'],
> = Database['public']['Tables'][T]['Update']

export type Enums<T extends keyof Database['public']['Enums']> =
  Database['public']['Enums'][T]

// ---------------------------------------------------------------------------
// Alias de dominio
// ---------------------------------------------------------------------------
export type Profile = Tables<'profiles'>
export type Company = Tables<'companies'>
export type Category = Tables<'categories'>
export type JobSource = Tables<'job_sources'>
export type Job = Tables<'jobs'>
export type SavedJob = Tables<'saved_jobs'>
export type Application = Tables<'applications'>
export type JobAlert = Tables<'job_alerts'>

export type EmploymentType = Enums<'employment_type'>
export type ExperienceLevel = Enums<'experience_level'>
export type JobStatus = Enums<'job_status'>
export type AlertFrequency = Enums<'alert_frequency'>

/** Empleo con su empresa embebida (select anidado de Supabase). */
export type JobWithCompany = Job & {
  companies: Pick<Company, 'slug' | 'name' | 'logo_url'> | null
}
