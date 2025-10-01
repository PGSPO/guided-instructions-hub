import { Home, FileText, BarChart3, AlertCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface AppSidebarProps {
  isOpen: boolean;
}

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: FileText, label: "All Incidents", href: "/incidents" },
  { icon: AlertCircle, label: "All Issues", href: "/issues" },
  { icon: BarChart3, label: "Risk Assessment", href: "/reports", disabled: true },
];

export const AppSidebar = ({ isOpen }: AppSidebarProps) => {
  const location = useLocation();

  if (!isOpen) return null;

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <h2 className="text-lg font-semibold text-sidebar-foreground">Navigation</h2>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <li key={item.href}>
                {item.disabled ? (
                  <div
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg",
                      "text-sidebar-foreground/40 cursor-not-allowed"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                    <span className="ml-auto text-xs bg-muted/60 text-muted-foreground px-2 py-1 rounded">Coming Soon</span>
                  </div>
                ) : (
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                      "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                        : "text-sidebar-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="px-4 py-2 text-xs text-sidebar-foreground/60">
          Version 1.0.0
        </div>
      </div>
    </aside>
  );
};
