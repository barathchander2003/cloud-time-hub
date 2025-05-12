
import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthState, User, UserRole } from "@/types/auth";

// Mock data for initial development
const mockUsers: Record<string, User> = {
  "admin@example.com": {
    id: "1",
    email: "admin@example.com",
    firstName: "Admin",
    lastName: "User",
    role: "admin",
    avatar: "/placeholder.svg",
  },
  "hr@example.com": {
    id: "2",
    email: "hr@example.com",
    firstName: "HR",
    lastName: "Manager",
    role: "hr",
    avatar: "/placeholder.svg",
  },
  "manager@example.com": {
    id: "3",
    email: "manager@example.com",
    firstName: "Team",
    lastName: "Manager",
    role: "manager",
    avatar: "/placeholder.svg",
  },
};

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check for stored session on initial load
    const storedUser = localStorage.getItem("timesheet_user");
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as User;
        setState({
          user: parsedUser,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("timesheet_user");
        setState({ user: null, isAuthenticated: false, isLoading: false });
      }
    } else {
      setState({ user: null, isAuthenticated: false, isLoading: false });
    }
  }, []);

  const login = async (email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    
    // In a real app, this would make an API request
    // For now we'll simulate a delay and use mock data
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const lowercaseEmail = email.toLowerCase();
    const user = mockUsers[lowercaseEmail];
    
    if (user && password === "password") {
      localStorage.setItem("timesheet_user", JSON.stringify(user));
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      throw new Error("Invalid email or password");
    }
  };

  const logout = async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    
    // Simulate delay for API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    localStorage.removeItem("timesheet_user");
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
