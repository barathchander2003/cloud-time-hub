
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useSidebar, Sidebar, SidebarContent, SidebarTrigger } from "@/components/ui/sidebar";
import { 
  BarChart3,
  ClipboardCheck,
  FileText,
  Home,
  LogOut,
  Settings,
  Users 
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

export function AppSidebar() {
  const { state: sidebarState, toggleSidebar } = useSidebar();
  const { user, logout } = useAuth();
  const location = useLocation();
  
  const isCollapsed = sidebarState === "collapsed";
  
  const navItems = [
    { 
      label: "Dashboard", 
      icon: <Home className="h-5 w-5" />,
      href: "/dashboard" 
    },
    { 
      label: "Employees", 
      icon: <Users className="h-5 w-5" />, 
      href: "/employees" 
    },
    { 
      label: "Timesheets", 
      icon: <FileText className="h-5 w-5" />, 
      href: "/timesheets"
    },
    { 
      label: "Approvals", 
      icon: <ClipboardCheck className="h-5 w-5" />, 
      href: "/approvals"
    },
    { 
      label: "Reports", 
      icon: <BarChart3 className="h-5 w-5" />, 
      href: "/reports"
    },
    { 
      label: "Settings", 
      icon: <Settings className="h-5 w-5" />, 
      href: "/settings"
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <Sidebar className={`${isCollapsed ? "w-16" : "w-64"} transition-all duration-300 h-screen flex flex-col`}>
      <div className="flex h-14 items-center px-4 border-b">
        <div className="flex items-center gap-2">
          {!isCollapsed && (
            <span className="text-xl font-bold">TimeTrack</span>
          )}
        </div>
      </div>
      
      <SidebarContent className="p-2 flex flex-col flex-1">
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2 rounded-md transition-colors
                ${isActive ? "bg-primary/10 text-primary" : "hover:bg-muted"}
              `}
            >
              {item.icon}
              {!isCollapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </SidebarContent>
      
      <div className="p-4 border-t">
        <Button 
          variant="ghost" 
          className="w-full flex justify-center items-center gap-2" 
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          {!isCollapsed && <span>Logout</span>}
        </Button>
        <div 
          className="p-2 mt-2 rounded-md hover:bg-muted flex justify-center cursor-pointer"
          onClick={toggleSidebar}
        >
          <div className={`w-5 h-5 border-t-2 border-l-2 transform transition-transform ${isCollapsed ? "rotate-135" : "-rotate-45"}`} />
        </div>
      </div>
    </Sidebar>
  );
}
