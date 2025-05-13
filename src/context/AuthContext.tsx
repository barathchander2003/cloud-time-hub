
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

      if (error) {
        console.error("Error fetching profile data:", error);
        return null;
      }

      if (!data) {
        console.warn("No profile data found for user:", userId);
        return null;
      }

      return {
        id: data.id,
        email: session?.user?.email || "", // Use email from session
        firstName: data.first_name || "",
        lastName: data.last_name || "",
        role: (data.role as UserRole) || "employee",
        avatar: data.avatar_url,
      };
    } catch (error) {
      console.error("Exception in fetchProfileData:", error);
      return null;
    }
  };

  const setUserStateFromSession = async (currentSession: Session | null) => {
    if (currentSession?.user) {
      try {
        const userData = await fetchProfileData(currentSession.user.id);
        const defaultUser: User = {
          id: currentSession.user.id,
          email: currentSession.user.email || "",
          firstName: currentSession.user.user_metadata?.first_name || "",
          lastName: currentSession.user.user_metadata?.last_name || "",
          role: currentSession.user.user_metadata?.role || "employee",
        };
        
        setState({
          user: userData || defaultUser,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        console.error("Error in setUserStateFromSession:", error);
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } else {
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  };

  useEffect(() => {
    console.log("Setting up auth state listener");
    
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession?.user?.email);
        
        // Update session state immediately
        setSession(currentSession);
        
        // Defer profile data fetching
        setTimeout(() => {
          setUserStateFromSession(currentSession);
        }, 0);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log("Initial session check:", session?.user?.email);
      setSession(session);
      
      // Set a timeout to prevent deadlocks
      setTimeout(() => {
        setUserStateFromSession(session);
      }, 0);
    });

    return () => {
      console.log("Cleaning up auth state listener");
      subscription.unsubscribe();
    };
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
          console.log("Using mock user:", email);
          setState({
            user: mockUsers[email.toLowerCase()],
            isAuthenticated: true,
            isLoading: false,
          });
          return;
        }
        throw error || new Error("Invalid login credentials.");
      }

      // Session is handled by the onAuthStateChange listener
      setSession(data.session);
      
      // Still set the user here for immediate feedback
      const defaultUser: User = {
        id: data.user.id,
        email: data.user.email || "",
        firstName: data.user.user_metadata?.first_name || "",
        lastName: data.user.user_metadata?.last_name || "",
        role: data.user.user_metadata?.role || "employee",
      };
      
      setState({
        user: defaultUser,
        isAuthenticated: true,
        isLoading: false,
      });
      
      console.log("Login successful for:", data.user.email);
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
      console.error("Logout error:", error.message);
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
