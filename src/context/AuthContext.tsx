
import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { AuthState, UserRole } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Mock data for initial development
const mockUsers: Record<string, User> = {
  "admin@example.com": {
    id: "1",
    email: "admin@example.com",
    user_metadata: {
      firstName: "Admin",
      lastName: "User",
      role: "admin",
    },
    app_metadata: {},
    aud: "authenticated",
    created_at: "",
  },
  "hr@example.com": {
    id: "2",
    email: "hr@example.com",
    user_metadata: {
      firstName: "HR",
      lastName: "Manager",
      role: "hr",
    },
    app_metadata: {},
    aud: "authenticated",
    created_at: "",
  },
  "manager@example.com": {
    id: "3",
    email: "manager@example.com",
    user_metadata: {
      firstName: "Team",
      lastName: "Manager",
      role: "manager",
    },
    app_metadata: {},
    aud: "authenticated",
    created_at: "",
  },
};

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  session: Session | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  session: null,
  login: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

// Helper function to clean up auth state
const cleanupAuthState = () => {
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  // Remove from sessionStorage if in use
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession?.user?.email);
        setSession(currentSession);
        
        if (currentSession?.user) {
          setState({
            user: currentSession.user,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          setState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("Initial session check:", currentSession?.user?.email);
      setSession(currentSession);
      
      if (currentSession?.user) {
        setState({
          user: currentSession.user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        setState({ 
          user: null, 
          isAuthenticated: false, 
          isLoading: false 
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    
    try {
      // Clean up existing state
      cleanupAuthState();
      
      // Try to sign out first to ensure clean state
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }
      
      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (data.user) {
        setState({
          user: data.user,
          isAuthenticated: true,
          isLoading: false,
        });
        setSession(data.session);
        
        return;
      }
      
      // Fallback to mock data (for development)
      if (mockUsers[email.toLowerCase()] && password === "password") {
        const mockUser = mockUsers[email.toLowerCase()];
        setState({
          user: mockUser,
          isAuthenticated: true,
          isLoading: false,
        });
        return;
      }
      
      throw new Error("Invalid email or password");
    } catch (error: any) {
      console.error("Login error:", error);
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      throw error;
    }
  };

  const logout = async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    
    try {
      // Clean up auth state
      cleanupAuthState();
      
      // Sign out from Supabase
      await supabase.auth.signOut({ scope: 'global' });
      
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      setSession(null);
      
      // Force page reload for a clean state
      window.location.href = '/login';
    } catch (error: any) {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, session }}>
      {children}
    </AuthContext.Provider>
  );
};
