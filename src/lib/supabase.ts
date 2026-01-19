import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types based on Supabase schema
export interface Driver {
  id: string
  first_name: string
  last_name: string
  national_number: string
  date_of_birth: string
  place_of_birth: string
  country: string
  city: string
  address: string
  phone: string
  email: string
  license_number: string
  license_type: number
  license_issue_date: string
  license_expiry_date: string
  is_verified: boolean
  updated_at: string
}

export interface LicenseType {
  id: number
  name_en: string
  name_ar: string
}

export interface Role {
  id: number
  name: string
  name_en: string
  name_ar: string
  description?: string
  created_at: string
}

