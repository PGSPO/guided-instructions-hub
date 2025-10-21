import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Home", href: "/" },
  { label: "All Incidents", href: "/incidents" },
  { label: "All Issues", href: "/issues" },
  { label: "Risk Assessment", href: "/risk-assessment" },
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

        <nav className="flex items-center gap-6 border-b border-transparent">
          {navItems.map((item) => {
            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  `relative px-2 py-4 font-sans font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  } after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:transition-all after:duration-200 ${
                    isActive
                      ? 'after:bg-primary'
                      : 'after:bg-transparent'
                  }`
                }
              >
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
