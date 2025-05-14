
import React from "react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  ClipboardList,
  Home,
  Settings,
  Users,
  FileCheck,
  BarChart3,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useMobile } from "@/hooks/use-mobile";

const AppSidebar = () => {
  const { logout } = useAuth();
  const { isMobile, isSidebarOpen, toggleSidebar } = useMobile();
  
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  
  if (isMobile && !isSidebarOpen) {
    return null;
  }

  return (
    <aside
      className={cn(
        "bg-card text-card-foreground h-screen border-r flex flex-col",
        isSidebarOpen ? "w-64" : "w-0",
        isMobile ? "fixed z-50" : "relative"
      )}
    >
      <div className="flex items-center h-16 px-6 border-b">
        <h1 className="text-xl font-bold tracking-tight">HRMS</h1>
      </div>
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <div className="space-y-1">
          <NavLink to="/" end>
            {({ isActive }) => (
              <Button
                variant={isActive ? "default" : "ghost"}
                size="lg"
                className={cn("w-full justify-start", isActive && "bg-primary text-primary-foreground")}
              >
                <Home className="mr-3 h-5 w-5" />
                Dashboard
              </Button>
            )}
          </NavLink>
          <NavLink to="/timesheets">
            {({ isActive }) => (
              <Button
                variant={isActive ? "default" : "ghost"}
                size="lg"
                className={cn("w-full justify-start", isActive && "bg-primary text-primary-foreground")}
              >
                <Calendar className="mr-3 h-5 w-5" />
                Timesheets
              </Button>
            )}
          </NavLink>
          <NavLink to="/approvals">
            {({ isActive }) => (
              <Button
                variant={isActive ? "default" : "ghost"}
                size="lg"
                className={cn("w-full justify-start", isActive && "bg-primary text-primary-foreground")}
              >
                <FileCheck className="mr-3 h-5 w-5" />
                Approvals
              </Button>
            )}
          </NavLink>
          <NavLink to="/employees">
            {({ isActive }) => (
              <Button
                variant={isActive ? "default" : "ghost"}
                size="lg"
                className={cn("w-full justify-start", isActive && "bg-primary text-primary-foreground")}
              >
                <Users className="mr-3 h-5 w-5" />
                Employees
              </Button>
            )}
          </NavLink>
          <NavLink to="/reports">
            {({ isActive }) => (
              <Button
                variant={isActive ? "default" : "ghost"}
                size="lg"
                className={cn("w-full justify-start", isActive && "bg-primary text-primary-foreground")}
              >
                <BarChart3 className="mr-3 h-5 w-5" />
                Reports
              </Button>
            )}
          </NavLink>
          <NavLink to="/settings">
            {({ isActive }) => (
              <Button
                variant={isActive ? "default" : "ghost"}
                size="lg"
                className={cn("w-full justify-start", isActive && "bg-primary text-primary-foreground")}
              >
                <Settings className="mr-3 h-5 w-5" />
                Settings
              </Button>
            )}
          </NavLink>
        </div>
      </nav>
      <div className="p-4 border-t">
        <Button
          variant="outline"
          size="lg"
          className="w-full justify-start"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Log out
        </Button>
      </div>
    </aside>
  );
};

export default AppSidebar;
