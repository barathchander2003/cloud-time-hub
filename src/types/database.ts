
// Custom types for database tables not included in the auto-generated Supabase types
import { Database } from '@/integrations/supabase/types';

// Extend the Database type with our custom tables
export type CustomDatabase = Database & {
  public: {
    Tables: {
      approvals: {
        Row: {
          id: string;
          type: string;
          employee_id: string;
          employee_name: string;
          submitted_at: string | null;
          start_date: string | null;
          end_date: string | null;
          amount: number | null;
          period: string | null;
          status: string | null;
          notes: string | null;
          document_url: string | null;
          reviewed_at: string | null;
          reviewer_id: string | null;
          created_at: string | null;
        };
      };
      employees: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          email: string;
          job_role: string;
          organization: string | null;
          employment_type: string | null;
          payment_type: string | null;
          payment_rate: number | null;
          currency: string | null;
          client_name: string | null;
          client_manager: string | null;
          employee_number: string | null;
          work_location: string | null;
          start_date: string | null;
          end_date: string | null;
          status: string | null;
          user_id: string | null;
          created_by: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
      };
    } & Database['public']['Tables'];
  };
};

// Helper type for accessing our custom tables
export type Tables<T extends keyof CustomDatabase['public']['Tables']> = CustomDatabase['public']['Tables'][T]['Row'];

// Type for approval data consistent with the UI
export interface ApprovalData {
  id: string;
  type: string;
  employee: string;
  employeeId: string;
  submitted: string;
  startDate?: string;
  endDate?: string;
  amount?: number;
  period?: string;
  status: string;
  notes?: string;
  document?: string | null;
  approvedBy?: string;
  rejectedReason?: string;
}

// Type for employee data consistent with the UI
export interface EmployeeData {
  id: string;
  name: string;
  email: string;
  role: string;
  organization: string;
  employmentType: string;
  status: string;
}

// Function to format database approval to UI format
export const formatApprovalForUI = (approval: Tables<'approvals'>): ApprovalData => {
  return {
    id: approval.id,
    type: approval.type,
    employee: approval.employee_name,
    employeeId: approval.employee_id,
    submitted: approval.submitted_at || new Date().toISOString(),
    startDate: approval.start_date || undefined,
    endDate: approval.end_date || undefined,
    amount: approval.amount || undefined,
    period: approval.period || undefined,
    status: approval.status || 'pending',
    notes: approval.notes || undefined,
    document: approval.document_url,
  };
};

// Function to format database employee to UI format
export const formatEmployeeForUI = (employee: Tables<'employees'>): EmployeeData => {
  return {
    id: employee.id,
    name: `${employee.first_name} ${employee.last_name}`,
    email: employee.email,
    role: employee.job_role,
    organization: employee.organization || 'Unknown',
    employmentType: employee.employment_type || 'fulltime',
    status: employee.status || 'active'
  };
};
