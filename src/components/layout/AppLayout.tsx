
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";
import { Toaster } from "@/components/ui/toaster";

const AppLayout = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // If auth is being checked, show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // If no user and not on auth pages, redirect to login
  if (!user && !location.pathname.includes("/login")) {
    return <Navigate to="/login" />;
  }

  // For auth pages when already logged in, redirect to dashboard
  if (user && location.pathname.includes("/login")) {
    return <Navigate to="/" />;
  }

  // If on auth pages or no user, don't show layout
  if (location.pathname.includes("/login") || !user) {
    return (
      <>
        <Outlet />
        <Toaster />
      </>
    );
  }

  // Main app layout with sidebar and header
  return (
    <div className="min-h-screen bg-background flex">
      <AppSidebar />
      <div className="flex flex-col flex-1">
        <AppHeader />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
      <Toaster />
    </div>
  );
};

export default AppLayout;
