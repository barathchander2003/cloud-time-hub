
import React from "react";
import { NavLink } from "react-router-dom";
import {
  Calendar,
  ClipboardList,
  FileText,
  Home,
  LogOut,
  Settings,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";

export function AppSidebar() {
  const { collapsed } = useSidebar();
  const { user, logout } = useAuth();
  
  if (!user) return null;
  
  return (
    <Sidebar
      className={collapsed ? "w-14" : "w-60"}
      collapsible
    >
      <SidebarTrigger className="m-2 self-end text-white" />

      <SidebarContent>
        <div className="py-4 flex flex-col items-center">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-primary font-bold text-xl">
            {user.firstName[0]}
          </div>
          {!collapsed && (
            <div className="mt-2 text-center text-white">
              <div className="font-medium">{user.firstName} {user.lastName}</div>
              <div className="text-xs text-white/70 capitalize">{user.role}</div>
            </div>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-white/70">
            {!collapsed && "Navigation"}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/dashboard" 
                    className={({ isActive }) => 
                      `nav-link ${isActive ? 'nav-link-active' : 'nav-link-inactive'}`
                    }
                  >
                    <Home className="h-5 w-5" />
                    {!collapsed && <span>Dashboard</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/employees" 
                    className={({ isActive }) => 
                      `nav-link ${isActive ? 'nav-link-active' : 'nav-link-inactive'}`
                    }
                  >
                    <Users className="h-5 w-5" />
                    {!collapsed && <span>Employees</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/timesheets" 
                    className={({ isActive }) => 
                      `nav-link ${isActive ? 'nav-link-active' : 'nav-link-inactive'}`
                    }
                  >
                    <Calendar className="h-5 w-5" />
                    {!collapsed && <span>Timesheets</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/approvals" 
                    className={({ isActive }) => 
                      `nav-link ${isActive ? 'nav-link-active' : 'nav-link-inactive'}`
                    }
                  >
                    <ClipboardList className="h-5 w-5" />
                    {!collapsed && <span>Approvals</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/reports" 
                    className={({ isActive }) => 
                      `nav-link ${isActive ? 'nav-link-active' : 'nav-link-inactive'}`
                    }
                  >
                    <FileText className="h-5 w-5" />
                    {!collapsed && <span>Reports</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/settings" 
                    className={({ isActive }) => 
                      `nav-link ${isActive ? 'nav-link-active' : 'nav-link-inactive'}`
                    }
                  >
                    <Settings className="h-5 w-5" />
                    {!collapsed && <span>Settings</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button 
                    onClick={() => logout()}
                    className="nav-link nav-link-inactive w-full text-left"
                  >
                    <LogOut className="h-5 w-5" />
                    {!collapsed && <span>Logout</span>}
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
