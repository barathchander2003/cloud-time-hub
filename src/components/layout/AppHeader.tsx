
import React from "react";
import { Bell, Menu, Search } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";

export function AppHeader() {
  const { user } = useAuth();
  
  if (!user) return null;
  
  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-4 sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="text-gray-500">
          <Menu className="h-5 w-5" />
        </SidebarTrigger>
        
        <div className="hidden md:block">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search..."
              className="w-64 pl-8 rounded-full bg-gray-50 border-gray-200"
            />
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full relative"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500"></span>
        </Button>
        
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="font-medium text-sm">{user.firstName} {user.lastName}</div>
            <div className="text-xs text-gray-500 capitalize">{user.role}</div>
          </div>
          
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-bold">
            {user.firstName[0]}
          </div>
        </div>
      </div>
    </header>
  );
}
