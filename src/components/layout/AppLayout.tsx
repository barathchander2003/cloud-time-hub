
import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";

export function AppLayout() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  // Add debugging
  useEffect(() => {
    console.log("AppLayout auth state:", { user, isAuthenticated, isLoading });
  }, [user, isAuthenticated, isLoading]);
  
  // Show loader while checking authentication, but add a timeout to prevent infinite loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    toast({
      title: "Authentication required",
      description: "Please log in to access this page.",
    });
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-x-hidden">
          <AppHeader />
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
