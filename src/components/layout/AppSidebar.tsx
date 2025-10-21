import { Home, FileText, BarChart3, AlertCircle, ChevronRight } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
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
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarContent className="bg-sidebar">
        <div className="flex items-center justify-between px-6 py-5 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold text-sm">ERM</span>
            </div>
            {open && (
              <span className="font-semibold text-sidebar-foreground">
                Enterprise Risk Management
              </span>
            )}
          </div>
          {open && <SidebarTrigger className="ml-auto" />}
        </div>

        {!open && (
          <div className="flex justify-center py-4">
            <SidebarTrigger />
          </div>
        )}
        
        <SidebarGroup className="px-3 py-4">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                
                return (
                  <SidebarMenuItem key={item.href}>
                    <NavLink to={item.href} className="block">
                      <SidebarMenuButton 
                        isActive={active}
                        className={`
                          relative w-full h-10 px-3 rounded-lg
                          transition-all duration-200
                          ${active 
                            ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium before:absolute before:left-0 before:top-1 before:bottom-1 before:w-1 before:bg-primary before:rounded-r' 
                            : 'hover:bg-sidebar-accent/50 text-sidebar-foreground/80 hover:text-sidebar-foreground'
                          }
                        `}
                      >
                        <Icon className={`h-5 w-5 ${active ? 'text-primary' : ''}`} />
                        {open && <span className="ml-3">{item.label}</span>}
                      </SidebarMenuButton>
                    </NavLink>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto px-6 py-4 border-t border-sidebar-border">
          <div className="text-xs text-sidebar-foreground/60">
            {open ? "Version 1.0.0" : "v1.0"}
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};
