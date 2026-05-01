import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Building2, Wrench, FlaskConical, Rocket, Shield, Globe2, Plane, Moon,
} from "lucide-react";
import { PlanetPanel } from "./PlanetPanel";
import { useLocation } from "@/lib/location-store";

const navItems = [
  { to: "/", label: "Visão Geral", icon: LayoutDashboard },
  { to: "/buildings", label: "Edifícios", icon: Building2 },
  { to: "/facilities", label: "Instalações", icon: Wrench },
  { to: "/research", label: "Pesquisas", icon: FlaskConical },
  { to: "/shipyard", label: "Hangar", icon: Rocket },
  { to: "/defense", label: "Defesa", icon: Shield },
  { to: "/moon", label: "Lua", icon: Moon },
  { to: "/galaxy", label: "Galáxia", icon: Globe2 },
  { to: "/fleet", label: "Frotas", icon: Plane },
] as const;

export function GameSidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { planet } = useLocation();

  return (
    <aside className="w-60 shrink-0 bg-surface/60 border-r border-border flex flex-col">
      <div className="px-5 py-5 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded bg-primary/20 border border-primary/40 flex items-center justify-center">
            <span className="text-primary font-display font-bold text-lg">Ω</span>
          </div>
          <div>
            <div className="text-display font-bold text-sm tracking-widest text-foreground">OGAME</div>
            <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">Comando v3.42</div>
          </div>
        </div>
      </div>

      <PlanetPanel />

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon }) => {
          const active = path === to;
          return (
            <Link
              key={to}
              to={to}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all relative ${
                active
                  ? "bg-primary/15 text-primary border border-primary/30"
                  : "text-muted-foreground hover:bg-surface-elevated hover:text-foreground border border-transparent"
              }`}
            >
              {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-r" />}
              <Icon className="w-4 h-4 shrink-0" strokeWidth={active ? 2.4 : 1.8} />
              <span className="font-display tracking-wider text-xs uppercase">{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border">
        <div className="px-3 py-2 rounded-md bg-surface-elevated/50 border border-border">
          <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Comandante</div>
          <div className="text-sm font-display text-foreground">Almirante Krix</div>
          <div className="text-[10px] font-mono text-accent mt-1">Rank 247 • 1.2M pts</div>
        </div>
      </div>
    </aside>
  );
}
