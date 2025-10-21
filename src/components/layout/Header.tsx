import { Home, FileText, BarChart3, AlertCircle } from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: FileText, label: "All Incidents", href: "/incidents" },
  { icon: AlertCircle, label: "All Issues", href: "/issues" },
  { icon: BarChart3, label: "Risk Assessment", href: "/risk-assessment" },
];

export const Header = () => {
  return (
    <header className="border-b border-border bg-background sticky top-0 z-50 shadow-sm">
      <div className="flex items-center justify-between px-6 h-16">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-serif font-bold text-sm">ERM</span>
          </div>
          <h1 className="font-serif text-xl font-semibold text-foreground">
            Enterprise Risk Management
          </h1>
        </div>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            
            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                <span className="font-sans">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="text-xs text-muted-foreground font-sans">
          Version 1.0.0
        </div>
      </div>
    </header>
  );
};
