import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Building2, Wrench, FlaskConical, Rocket, Shield, Globe2, Plane, Moon,
  ChevronsLeft, LogOut, Settings,
} from "lucide-react";
import { useState } from "react";
import { PlanetPanel } from "./PlanetPanel";
import { useLocation } from "@/lib/location-store";

const navGroups = [
  {
    label: "Comando",
    items: [
      { to: "/", label: "Visão Geral", icon: LayoutDashboard, theme: "primary" },
    ],
  },
  {
    label: "Império",
    items: [
      { to: "/buildings",  label: "Edifícios",    icon: Building2,    theme: "metal" },
      { to: "/facilities", label: "Instalações",  icon: Wrench,       theme: "amber" },
      { to: "/research",   label: "Pesquisas",    icon: FlaskConical, theme: "deuterium" },
    ],
  },
  {
    label: "Militar",
    items: [
      { to: "/shipyard", label: "Hangar", icon: Rocket, theme: "crystal" },
      { to: "/defense",  label: "Defesa", icon: Shield, theme: "destructive" },
    ],
  },
  {
    label: "Universo",
    items: [
      { to: "/moon",   label: "Lua",     icon: Moon,   theme: "crystal" },
      { to: "/galaxy", label: "Galáxia", icon: Globe2, theme: "energy" },
      { to: "/fleet",  label: "Frotas",  icon: Plane,  theme: "amber" },
    ],
  },
] as const;

const themeMap: Record<string, { dot: string; text: string; bg: string; border: string }> = {
  primary:     { dot: "bg-primary",     text: "text-primary",     bg: "bg-primary/10",     border: "border-primary/40" },
  metal:       { dot: "bg-metal",       text: "text-metal",       bg: "bg-metal/10",       border: "border-metal/40" },
  amber:       { dot: "bg-accent",      text: "text-accent",      bg: "bg-accent/10",      border: "border-accent/40" },
  deuterium:   { dot: "bg-deuterium",   text: "text-deuterium",   bg: "bg-deuterium/10",   border: "border-deuterium/40" },
  crystal:     { dot: "bg-crystal",     text: "text-crystal",     bg: "bg-crystal/10",     border: "border-crystal/40" },
  destructive: { dot: "bg-destructive", text: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/40" },
  energy:      { dot: "bg-energy",      text: "text-energy",      bg: "bg-energy/10",      border: "border-energy/40" },
};

export function GameSidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { planet } = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`${collapsed ? "w-[68px]" : "w-60"} shrink-0 flex flex-col border-r border-border transition-[width] duration-200 relative`}
      style={{
        background:
          "linear-gradient(180deg, oklch(0.20 0.01 60 / 0.85), oklch(0.16 0.005 60 / 0.85))",
      }}
    >
      {/* Brand */}
      <div className="px-4 py-4 border-b border-border flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded bg-primary/15 border border-primary/40 flex items-center justify-center shadow-[0_0_18px_-4px] shadow-primary/40 shrink-0">
            <span className="text-primary font-display font-bold text-lg">Ω</span>
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="text-display font-bold text-sm tracking-widest text-foreground">OGAME</div>
              <div className="text-[9px] text-muted-foreground font-mono uppercase tracking-wider">Comando v3.42</div>
            </div>
          )}
        </Link>
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="w-6 h-6 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-surface-elevated transition-colors shrink-0"
          title={collapsed ? "Expandir" : "Recolher"}
        >
          <ChevronsLeft className={`w-3.5 h-3.5 transition-transform ${collapsed ? "rotate-180" : ""}`} />
        </button>
      </div>

      {!collapsed && <PlanetPanel />}

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 overflow-y-auto space-y-4">
        {navGroups.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <div className="px-2.5 pb-1.5 text-[9px] font-mono uppercase tracking-widest text-muted-foreground/70">
                {group.label}
              </div>
            )}
            <div className="space-y-0.5">
              {group.items.map(({ to, label, icon: Icon, theme }) => {
                const active = path === to;
                const t = themeMap[theme];
                const dimmed = to === "/moon" && !planet.hasMoon;

                return (
                  <Link
                    key={to}
                    to={to}
                    title={collapsed ? label : undefined}
                    className={`group relative flex items-center gap-2.5 ${collapsed ? "justify-center px-0 mx-1.5" : "px-2.5"} py-2 rounded-md text-sm transition-all ${
                      active
                        ? `${t.bg} ${t.text} border ${t.border} shadow-[inset_0_1px_0_0_oklch(1_0_0_/_0.04)]`
                        : "text-muted-foreground hover:bg-surface-elevated hover:text-foreground border border-transparent"
                    } ${dimmed ? "opacity-40" : ""}`}
                  >
                    {active && !collapsed && (
                      <span className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 ${t.dot} rounded-r`} />
                    )}
                    <Icon className={`w-4 h-4 shrink-0 ${active ? t.text : ""}`} strokeWidth={active ? 2.4 : 1.8} />
                    {!collapsed && (
                      <>
                        <span className="font-display tracking-wider text-[11px] uppercase">{label}</span>
                        {to === "/moon" && !planet.hasMoon && (
                          <span className="ml-auto text-[8px] font-mono uppercase text-muted-foreground/60">N/D</span>
                        )}
                      </>
                    )}
                    {collapsed && active && (
                      <span className={`absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-5 ${t.dot} rounded-l`} />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Commander footer */}
      <div className="p-2 border-t border-border">
        {collapsed ? (
          <button
            title="Almirante Krix"
            className="w-full aspect-square rounded-md bg-surface-elevated border border-border flex items-center justify-center text-primary font-display font-bold"
          >
            K
          </button>
        ) : (
          <div className="rounded-md bg-surface-elevated/60 border border-border p-2.5">
            <div className="flex items-center gap-2.5">
              <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0 shadow-[0_0_14px_-4px] shadow-primary/60">
                <span className="text-background font-display font-bold text-sm">K</span>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-deuterium border-2 border-surface" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Comandante</div>
                <div className="text-xs font-display text-foreground truncate">Alm. Krix</div>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between text-[9px] font-mono uppercase tracking-widest">
              <span className="text-accent">#247</span>
              <span className="text-muted-foreground">1.24M pts</span>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-1">
              <Link
                to="/universes"
                className="flex items-center justify-center gap-1 h-6 rounded bg-background/50 border border-border text-[9px] font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground hover:border-primary/40"
              >
                <Settings className="w-2.5 h-2.5" /> Univ.
              </Link>
              <Link
                to="/login"
                className="flex items-center justify-center gap-1 h-6 rounded bg-background/50 border border-border text-[9px] font-mono uppercase tracking-widest text-muted-foreground hover:text-destructive hover:border-destructive/40"
              >
                <LogOut className="w-2.5 h-2.5" /> Sair
              </Link>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
