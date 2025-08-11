import { createClient } from "@/lib/supabase/client"
import { createClient as createServerClient } from "@/lib/supabase/server"
import type { Client, Expense, Payment, Employee } from "@/lib/supabase/client"

// Client-side database operations
export class SupabaseClient {
  private supabase = createClient()

  // Expenses
  async getExpenses() {
    const { data, error } = await this.supabase
      .from("expenses")
      .select(`
        *,
        client:clients(*)
      `)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data as (Expense & { client: Client })[]
  }

  async createExpense(expense: Omit<Expense, "id" | "created_at" | "updated_at" | "created_by">) {
    const {
      data: { user },
    } = await this.supabase.auth.getUser()
    if (!user) throw new Error("User not authenticated")

    const { data, error } = await this.supabase
      .from("expenses")
      .insert({ ...expense, created_by: user.id })
      .select()
      .single()

    if (error) throw error
    return data as Expense
  }

  async updateExpense(id: string, updates: Partial<Expense>) {
    const { data, error } = await this.supabase.from("expenses").update(updates).eq("id", id).select().single()

    if (error) throw error
    return data as Expense
  }

  async deleteExpense(id: string) {
    const { error } = await this.supabase.from("expenses").delete().eq("id", id)

    if (error) throw error
  }

  // Clients
  async getClients() {
    const { data, error } = await this.supabase.from("clients").select("*").order("created_at", { ascending: false })

    if (error) throw error
    return data as Client[]
  }

  async createClient(client: Omit<Client, "id" | "created_at" | "updated_at" | "created_by">) {
    const {
      data: { user },
    } = await this.supabase.auth.getUser()
    if (!user) throw new Error("User not authenticated")

    const { data, error } = await this.supabase
      .from("clients")
      .insert({ ...client, created_by: user.id })
      .select()
      .single()

    if (error) throw error
    return data as Client
  }

  async updateClient(id: string, updates: Partial<Client>) {
    const { data, error } = await this.supabase.from("clients").update(updates).eq("id", id).select().single()

    if (error) throw error
    return data as Client
  }

  async deleteClient(id: string) {
    const { error } = await this.supabase.from("clients").delete().eq("id", id)

    if (error) throw error
  }

  // Payments
  async getPayments() {
    const { data, error } = await this.supabase
      .from("payments")
      .select(`
        *,
        client:clients(*)
      `)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data as (Payment & { client: Client })[]
  }

  async createPayment(payment: Omit<Payment, "id" | "created_at" | "updated_at" | "created_by">) {
    const {
      data: { user },
    } = await this.supabase.auth.getUser()
    if (!user) throw new Error("User not authenticated")

    const { data, error } = await this.supabase
      .from("payments")
      .insert({ ...payment, created_by: user.id })
      .select()
      .single()

    if (error) throw error
    return data as Payment
  }

  async updatePayment(id: string, updates: Partial<Payment>) {
    const { data, error } = await this.supabase.from("payments").update(updates).eq("id", id).select().single()

    if (error) throw error
    return data as Payment
  }

  async deletePayment(id: string) {
    const { error } = await this.supabase.from("payments").delete().eq("id", id)

    if (error) throw error
  }

  // Employees
  async getEmployees() {
    const { data, error } = await this.supabase
      .from("employees")
      .select(`
        *,
        user:users(*)
      `)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data as (Employee & { user: any })[]
  }

  async createEmployee(employee: Omit<Employee, "id" | "created_at" | "updated_at">) {
    const { data, error } = await this.supabase.from("employees").insert(employee).select().single()

    if (error) throw error
    return data as Employee
  }

  async updateEmployee(id: string, updates: Partial<Employee>) {
    const { data, error } = await this.supabase.from("employees").update(updates).eq("id", id).select().single()

    if (error) throw error
    return data as Employee
  }

  async deleteEmployee(id: string) {
    const { error } = await this.supabase.from("employees").delete().eq("id", id)

    if (error) throw error
  }
}

// Server-side database operations
export class SupabaseServerClient {
  private supabase = createServerClient()

  async getExpenses() {
    const { data, error } = await this.supabase
      .from("expenses")
      .select(`
        *,
        client:clients(*)
      `)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data
  }

  async getClients() {
    const { data, error } = await this.supabase.from("clients").select("*").order("created_at", { ascending: false })

    if (error) throw error
    return data
  }

  async getPayments() {
    const { data, error } = await this.supabase
      .from("payments")
      .select(`
        *,
        client:clients(*)
      `)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data
  }

  async getEmployees() {
    const { data, error } = await this.supabase
      .from("employees")
      .select(`
        *,
        user:users(*)
      `)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data
  }
}

// Export singleton instances
export const db = new SupabaseClient()
export const serverDb = new SupabaseServerClient()
