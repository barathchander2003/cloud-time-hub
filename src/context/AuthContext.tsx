import React, { createContext, useContext, useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { AuthState, User, UserRole } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const cleanupAuthState = () => {
  localStorage.removeItem("supabase.auth.token");
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("supabase.auth.") || key.includes("sb-")) {
      localStorage.removeItem(key);
    }
  });
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith("supabase.auth.") || key.includes("sb-")) {
      sessionStorage.removeItem(key);
    }
  });
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });
  const [session, setSession] = useState<Session | null>(null);

  const mockUsers: Record<string, User> = {
    "admin@example.com": {
      id: "1",
      email: "admin@example.com",
      firstName: "Admin",
      lastName: "User",
      role: "admin",
    },
    "hr@example.com": {
      id: "2",
      email: "hr@example.com",
      firstName: "HR",
      lastName: "Manager",
      role: "hr",
    },
    "manager@example.com": {
      id: "3",
      email: "manager@example.com",
      firstName: "Team",
      lastName: "Manager",
      role: "manager",
    },
  };

  const fetchProfileData = async (userId: string): Promise<User | null> => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) return null;

      return {
        id: data.id,
        email: data.email,
        firstName: data.first_name || "",
        lastName: data.last_name || "",
        role: (data.role as UserRole) || "employee",
        avatar: data.avatar_url,
      };
    } catch {
      return null;
    }
  };

  const setUserStateFromSession = async (currentSession: Session | null) => {
    if (currentSession?.user) {
      const userData = await fetchProfileData(currentSession.user.id);
      const defaultUser: User = {
        id: currentSession.user.id,
        email: currentSession.user.email,
        firstName: currentSession.user.user_metadata?.first_name || "",
        lastName: currentSession.user.user_metadata?.last_name || "",
        role: currentSession.user.user_metadata?.role || "employee",
      };
      setState({
        user: userData || defaultUser,
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
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_, currentSession) => {
        setSession(currentSession);
        await setUserStateFromSession(currentSession);
      }
    );

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      await setUserStateFromSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      cleanupAuthState();
      await supabase.auth.signOut({ scope: "global" });

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.user) {
        // Fallback mock login for dev
        if (mockUsers[email.toLowerCase()] && password === "password") {
          setState({
            user: mockUsers[email.toLowerCase()],
            isAuthenticated: true,
            isLoading: false,
          });
          return;
        }
        throw error || new Error("Invalid login credentials.");
      }

      const userData = await fetchProfileData(data.user.id);
      const defaultUser: User = {
        id: data.user.id,
        email: data.user.email,
        firstName: data.user.user_metadata?.first_name || "",
        lastName: data.user.user_metadata?.last_name || "",
        role: data.user.user_metadata?.role || "employee",
      };

      setState({
        user: userData || defaultUser,
        isAuthenticated: true,
        isLoading: false,
      });
      setSession(data.session);
    } catch (error: any) {
      console.error("Login error:", error.message);
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
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
      cleanupAuthState();
      await supabase.auth.signOut({ scope: "global" });
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      setSession(null);
      window.location.href = "/login";
    } catch (error: any) {
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
