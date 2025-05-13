export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      approvals: {
        Row: {
          amount: number | null
          created_at: string | null
          document_url: string | null
          employee_id: string
          employee_name: string
          end_date: string | null
          id: string
          notes: string | null
          period: string | null
          reviewed_at: string | null
          reviewer_id: string | null
          start_date: string | null
          status: string | null
          submitted_at: string | null
          type: string
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          document_url?: string | null
          employee_id: string
          employee_name: string
          end_date?: string | null
          id?: string
          notes?: string | null
          period?: string | null
          reviewed_at?: string | null
          reviewer_id?: string | null
          start_date?: string | null
          status?: string | null
          submitted_at?: string | null
          type: string
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          document_url?: string | null
          employee_id?: string
          employee_name?: string
          end_date?: string | null
          id?: string
          notes?: string | null
          period?: string | null
          reviewed_at?: string | null
          reviewer_id?: string | null
          start_date?: string | null
          status?: string | null
          submitted_at?: string | null
          type?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          file_name: string | null
          file_url: string | null
          id: number
          uploaded_at: string | null
          user_id: string | null
        }
        Insert: {
          file_name?: string | null
          file_url?: string | null
          id?: number
          uploaded_at?: string | null
          user_id?: string | null
        }
        Update: {
          file_name?: string | null
          file_url?: string | null
          id?: number
          uploaded_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      employees: {
        Row: {
          client_manager: string | null
          client_name: string | null
          created_at: string | null
          created_by: string | null
          currency: string | null
          email: string
          employee_number: string | null
          employment_type: string | null
          end_date: string | null
          first_name: string
          id: string
          job_role: string
          last_name: string
          organization: string | null
          payment_rate: number | null
          payment_type: string | null
          start_date: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
          work_location: string | null
        }
        Insert: {
          client_manager?: string | null
          client_name?: string | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          email: string
          employee_number?: string | null
          employment_type?: string | null
          end_date?: string | null
          first_name: string
          id?: string
          job_role: string
          last_name: string
          organization?: string | null
          payment_rate?: number | null
          payment_type?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          work_location?: string | null
        }
        Update: {
          client_manager?: string | null
          client_name?: string | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          email?: string
          employee_number?: string | null
          employment_type?: string | null
          end_date?: string | null
          first_name?: string
          id?: string
          job_role?: string
          last_name?: string
          organization?: string | null
          payment_rate?: number | null
          payment_type?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          work_location?: string | null
        }
        Relationships: []
      }
      leave_requests: {
        Row: {
          created_at: string
          document_url: string | null
          end_date: string
          id: string
          reason: string | null
          reviewed_at: string | null
          reviewer_id: string | null
          start_date: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          document_url?: string | null
          end_date: string
          id?: string
          reason?: string | null
          reviewed_at?: string | null
          reviewer_id?: string | null
          start_date: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          document_url?: string | null
          end_date?: string
          id?: string
          reason?: string | null
          reviewed_at?: string | null
          reviewer_id?: string | null
          start_date?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          department: string | null
          first_name: string | null
          id: string
          last_name: string | null
          position: string | null
          role: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          position?: string | null
          role?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          position?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      timesheets: {
        Row: {
          created_at: string | null
          date: string
          description: string | null
          hours_worked: number
          id: number
          status: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          description?: string | null
          hours_worked: number
          id?: number
          status?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          description?: string | null
          hours_worked?: number
          id?: number
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          password: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          password: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          password?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
