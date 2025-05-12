
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useSidebar, Sidebar, SidebarContent, SidebarTrigger } from "@/components/ui/sidebar";
import { 
  BarChart3,
  ClipboardCheck,
  FileText,
  Home,
  Settings,
  Users 
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function AppSidebar() {
  const { isCollapsed, setCollapsed } = useSidebar();
  const { user } = useAuth();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
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

  return (
    <Sidebar className={isCollapsed ? "w-16" : "w-64"}>
      <div className="flex h-14 items-center px-4 border-b">
        <div className="flex items-center gap-2">
          {!isCollapsed && (
            <span className="text-xl font-bold">TimeTrack</span>
          )}
        </div>
      </div>
      
      <SidebarContent className="p-2">
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
      
      <div className="mt-auto p-4 border-t">
        <SidebarTrigger asChild>
          <div className="p-2 rounded-md hover:bg-muted flex justify-center cursor-pointer" onClick={() => setCollapsed(!isCollapsed)}>
            <div className={`w-5 h-5 border-t-2 border-l-2 transform transition-transform ${isCollapsed ? "rotate-135" : "-rotate-45"}`} />
          </div>
        </SidebarTrigger>
      </div>
    </Sidebar>
  );
}
