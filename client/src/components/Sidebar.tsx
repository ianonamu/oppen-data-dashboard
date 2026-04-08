/*
 * DESIGN: Data Observatory — Persistent left sidebar
 * Dark sidebar with teal accent, icon + label nav items, live indicator
 */
import { Link, useLocation } from "wouter";
import {
  BarChart3,
  Users,
  MapPin,
  Briefcase,
  Info,
  Database,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Översikt", icon: BarChart3 },
  { href: "/befolkning", label: "Befolkning", icon: Users },
  { href: "/kommuner", label: "Kommuner", icon: MapPin },
  { href: "/arbetsmarknad", label: "Arbetsmarknad", icon: Briefcase },
  { href: "/malmo", label: "Malmö", icon: MapPin },
  { href: "/om", label: "Om projektet", icon: Info },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="w-60 min-h-screen flex flex-col border-r border-border bg-sidebar shrink-0">
      {/* Logo / Brand */}
      <div className="px-5 py-6 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-primary/20 flex items-center justify-center">
            <Database className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Öppen Data
            </p>
            <p className="text-xs text-muted-foreground">Sverige</p>
          </div>
        </div>
      </div>

      {/* Live indicator */}
      <div className="px-5 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="live-dot" />
          <span className="text-xs text-muted-foreground">Live data från SCB</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="px-2 pb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Utforska
        </p>
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = location === href;
          return (
            <Link key={href} href={href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all duration-200",
                  isActive
                    ? "bg-primary/15 text-primary font-medium border border-primary/25"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-primary" : "")} />
                {label}
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          Källa: SCB, Arbetsförmedlingen
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Byggd av Ian Onamu
        </p>
      </div>
    </aside>
  );
}
