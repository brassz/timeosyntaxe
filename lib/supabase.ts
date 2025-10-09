import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos do banco de dados
export interface User {
  id: string
  email: string
  name: string
  created_at: string
}

export interface Appointment {
  id: string
  user_id: string
  title: string
  client_name: string
  service: string
  start_time: string
  end_time: string
  duration: number
  status: 'scheduled' | 'completed' | 'cancelled'
  created_at: string
}

export interface Subscription {
  id: string
  user_id: string
  plan: 'monthly' | 'quarterly' | 'annual'
  status: 'active' | 'cancelled' | 'expired'
  start_date: string
  end_date: string
  price: number
  created_at: string
}
