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
  user?: {
    id: string
    email: string
    full_name?: string
    role: string
  }
}

export interface EmployeeInput {
  user_id: string
  employee_id: string
  department?: string
  position?: string
  salary?: number
  hire_date?: string
}

export interface IEmployee {
  id: string
  userId?: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  position?: string
  hireDate?: Date
  salary?: number
  skills: string[]
  workExpertise: string
  assignedClients: string[]
  assignedClientNames: string[]
  status: "active" | "inactive" | "on-leave"
  joinDate: Date
  createdAt: Date
  updatedAt: Date
}

export function transformEmployeeToSupabase(employee: IEmployee): EmployeeInput {
  return {
    user_id: employee.userId || employee.id,
    employee_id: employee.id,
    department: employee.workExpertise,
    position: employee.position,
    salary: employee.salary,
    hire_date: employee.hireDate?.toISOString().split("T")[0],
  }
}

export function transformSupabaseToEmployee(supabaseEmployee: Employee): IEmployee {
  return {
    id: supabaseEmployee.employee_id,
    userId: supabaseEmployee.user_id,
    firstName: supabaseEmployee.user?.full_name?.split(" ")[0] || "",
    lastName: supabaseEmployee.user?.full_name?.split(" ").slice(1).join(" ") || "",
    email: supabaseEmployee.user?.email || "",
    phone: "",
    position: supabaseEmployee.position,
    hireDate: supabaseEmployee.hire_date ? new Date(supabaseEmployee.hire_date) : undefined,
    salary: supabaseEmployee.salary,
    skills: [],
    workExpertise: supabaseEmployee.department || "",
    assignedClients: [],
    assignedClientNames: [],
    status: "active" as const,
    joinDate: new Date(supabaseEmployee.created_at),
    createdAt: new Date(supabaseEmployee.created_at),
    updatedAt: new Date(supabaseEmployee.updated_at),
  }
}
