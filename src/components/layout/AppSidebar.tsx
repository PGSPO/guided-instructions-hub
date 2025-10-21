import { Home, FileText, BarChart3, AlertCircle } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

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

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: FileText, label: "All Incidents", href: "/incidents" },
  { icon: AlertCircle, label: "All Issues", href: "/issues" },
  { icon: BarChart3, label: "Risk Assessment", href: "/risk-assessment" },
];

export const AppSidebar = () => {
  const { open } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarContent className="bg-sidebar">
        <div className="flex items-center justify-between px-4 py-6 border-b border-sidebar-border">
          <SidebarGroupLabel className="text-base font-semibold">
            {open ? "Enterprise Risk Management" : "ERM"}
          </SidebarGroupLabel>
          <SidebarTrigger className="ml-auto" />
        </div>
        
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 p-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={active} className="w-full">
                      <NavLink to={item.href}>
                        <Icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-4 border-t border-sidebar-border">
          <div className="text-xs text-sidebar-foreground/60">
            {open ? "Version 1.0.0" : "v1.0"}
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};
