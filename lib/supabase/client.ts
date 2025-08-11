import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// Check if Supabase environment variables are available
export const isSupabaseConfigured =
  typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_URL.length > 0 &&
  typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length > 0

// Create a singleton instance of the Supabase client for Client Components
export const supabase = createClientComponentClient()

// Database types
export interface User {
  id: string
  email: string
  full_name?: string
  role: "admin" | "user" | "employee"
  created_at: string
  updated_at: string
}

export interface Client {
  id: string
  name: string
  email?: string
  phone?: string
  address?: string
  created_by: string
  created_at: string
  updated_at: string
}

export interface Expense {
  id: string
  title: string
  amount: number
  category: string
  description?: string
  date: string
  receipt_url?: string
  status: "pending" | "approved" | "rejected"
  client_id?: string
  created_by: string
  created_at: string
  updated_at: string
  client?: Client
}

export interface Payment {
  id: string
  amount: number
  payment_date: string
  payment_method: string
  description?: string
  client_id?: string
  created_by: string
  created_at: string
  updated_at: string
  client?: Client
}

export interface Employee {
  id: string
  user_id: string
  employee_id: string
  department?: string
  position?: string
  salary?: number
  hire_date?: string
  created_at: string
  updated_at: string
  user?: User
}
