
export type UserRole = "admin" | "hr" | "manager" | "employee";

export interface User {
  id: string;
  email: string | undefined;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
