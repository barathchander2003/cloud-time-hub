import React, { createContext, useContext, useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { AuthState, UserRole, User } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Cleanup auth state
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

  const fetchProfileData = async (userId: string): Promise<User | null> => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }

      if (data) {
        return {
          id: data.id,
          email: data.email,
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          role: (data.role as UserRole) || "employee",
          avatar: data.avatar_url,
        };
      }
      return null;
    } catch (err) {
      console.error("Error in fetchProfileData:", err);
      return null;
    }
  };

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

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        if (currentSession?.user) {
          try {
            const userData = await fetchProfileData(currentSession.user.id);
            if (userData) {
              setState({
                user: userData,
                isAuthenticated: true,
                isLoading: false,
              });
            } else {
              const defaultUser: User = {
                id: currentSession.user.id,
                email: currentSession.user.email,
                firstName: currentSession.user.user_metadata?.first_name || "",
                lastName: currentSession.user.user_metadata?.last_name || "",
                role: currentSession.user.user_metadata?.role || "employee",
              };
              setState({
                user: defaultUser,
                isAuthenticated: true,
                isLoading: false,
              });
            }
          } catch (error) {
            console.error("Auth change error:", error);
            setState({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        } else {
          setState({ user: null, isAuthenticated: false, isLoading: false });
        }
      }
    );

    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      setSession(currentSession);
      if (currentSession?.user) {
        try {
          const userData = await fetchProfileData(currentSession.user.id);
          if (userData) {
            setState({
              user: userData,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            const defaultUser: User = {
              id: currentSession.user.id,
              email: currentSession.user.email,
              firstName: currentSession.user.user_metadata?.first_name || "",
              lastName: currentSession.user.user_metadata?.last_name || "",
              role: currentSession.user.user_metadata?.role || "employee",
            };
            setState({
              user: defaultUser,
              isAuthenticated: true,
              isLoading: false,
            });
          }
        } catch (error) {
          console.error("Session error:", error);
          setState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } else {
        setState({ user: null, isAuthenticated: false, isLoading: false });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      cleanupAuthState();
      await supabase.auth.signOut({ scope: "global" }).catch(() => {});
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      if (data.user) {
        try {
          const userData = await fetchProfileData(data.user.id);
          if (userData) {
            setState({
              user: userData,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            const defaultUser: User = {
              id: data.user.id,
              email: data.user.email,
              firstName: data.user.user_metadata?.first_name || "",
              lastName: data.user.user_metadata?.last_name || "",
              role: data.user.user_metadata?.role || "employee",
            };
            setState({
              user: defaultUser,
              isAuthenticated: true,
              isLoading: false,
            });
          }
          setSession(data.session);
          return;
        } catch (err) {
          console.error("Login fetch error:", err);
          setState({
            user: {
              id: data.user.id,
              email: data.user.email,
              firstName: "",
              lastName: "",
              role: "employee",
            },
            isAuthenticated: true,
            isLoading: false,
          });
        }
      }

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
      cleanupAuthState();
      await supabase.auth.signOut({ scope: "global" });
      setState({ user: null, isAuthenticated: false, isLoading: false });
      setSession(null);
      window.location.href = "/login";
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
