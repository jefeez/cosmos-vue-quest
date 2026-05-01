import { useState } from "react";
import { ChevronDown, Globe, Thermometer, Maximize2, MapPin, Sun, Moon } from "lucide-react";
import { useLocation, locationStore, planetList } from "@/lib/location-store";
import { moonStats } from "@/lib/moon-data";
import { Link } from "@tanstack/react-router";

export function PlanetPanel() {
  const [open, setOpen] = useState(false);
  const { planet, kind } = useLocation();

  const isMoon = kind === "moon";
  const usedFields = isMoon ? moonStats.usedFields : 142;
  const totalFields = isMoon ? moonStats.totalFields : 188;
  const fieldPct = (usedFields / totalFields) * 100;

  return (
    <div className="border-b border-border bg-surface/40">
      {/* Planet selector */}
      <div className="px-3 py-2.5 border-b border-border">
        <div className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground mb-1.5">
          {isMoon ? "Lua Atual" : "Planeta Atual"}
        </div>
        <div className="flex items-center gap-2">
          {isMoon ? (
            <div className="relative w-10 h-10 rounded-full shrink-0 overflow-hidden border border-crystal/40"
                 style={{
                   background: "radial-gradient(circle at 30% 30%, oklch(0.78 0.02 240), oklch(0.45 0.01 240) 70%, oklch(0.25 0.005 240))",
                   boxShadow: "inset -3px -3px 6px oklch(0 0 0 / 0.5), 0 0 12px oklch(0.75 0.15 220 / 0.4)",
                 }}>
              <div className="absolute inset-0 opacity-50"
                   style={{ background: "radial-gradient(circle at 70% 60%, transparent 30%, oklch(0.2 0.005 240 / 0.7) 60%)" }} />
            </div>
          ) : (
            <div className="relative w-10 h-10 rounded-full shrink-0 overflow-hidden border border-primary/40"
                 style={{
                   background: "radial-gradient(circle at 30% 30%, oklch(0.7 0.12 50), oklch(0.35 0.08 30) 70%, oklch(0.2 0.04 25))",
                   boxShadow: "inset -3px -3px 6px oklch(0 0 0 / 0.5), 0 0 12px oklch(0.68 0.16 50 / 0.3)",
                 }}>
              <div className="absolute inset-0 opacity-40"
                   style={{ background: "radial-gradient(circle at 70% 60%, transparent 30%, oklch(0.15 0.02 30 / 0.6) 60%)" }} />
            </div>
          )}
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex-1 flex items-center justify-between text-left group min-w-0"
          >
            <div className="min-w-0">
              <div className="font-display text-xs uppercase tracking-wider truncate text-foreground">
                {isMoon ? planet.moonName : planet.name}
              </div>
              <div className="font-mono text-[10px] text-primary tabular-nums">{planet.coords}</div>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform shrink-0 ${open ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Planet/Moon switcher tabs */}
        <div className="mt-2 grid grid-cols-2 gap-1 p-0.5 bg-background/60 rounded border border-border">
          <button
            onClick={() => locationStore.setKind("planet")}
            className={`flex items-center justify-center gap-1 px-2 py-1 rounded text-[10px] font-display uppercase tracking-wider transition-colors ${
              !isMoon ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Globe className="w-3 h-3" /> Planeta
          </button>
          <button
            onClick={() => planet.hasMoon && locationStore.setKind("moon")}
            disabled={!planet.hasMoon}
            className={`flex items-center justify-center gap-1 px-2 py-1 rounded text-[10px] font-display uppercase tracking-wider transition-colors ${
              isMoon ? "bg-crystal/20 text-crystal" : "text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
            }`}
            title={planet.hasMoon ? "Ir para lua" : "Sem lua neste planeta"}
          >
            <Moon className="w-3 h-3" /> Lua
          </button>
        </div>

        {/* Planet list */}
        {open && (
          <div className="mt-2 space-y-0.5">
            {planetList.map((p) => (
              <button
                key={p.id}
                onClick={() => { locationStore.setPlanet(p.id); setOpen(false); }}
                className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-[11px] font-mono transition-colors ${
                  planet.id === p.id
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-surface-elevated hover:text-foreground"
                }`}
              >
                <span className="truncate flex items-center gap-1.5">
                  {p.name}
                  {p.hasMoon && <Moon className="w-2.5 h-2.5 text-crystal/70" />}
                </span>
                <span className="tabular-nums shrink-0 ml-2">{p.coords}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="px-3 py-3 space-y-2.5">
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <Maximize2 className="w-3 h-3 text-muted-foreground" />
              <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">Campos</span>
            </div>
            <span className="font-mono text-[10px] tabular-nums text-foreground">
              {usedFields}<span className="text-muted-foreground"> / {totalFields}</span>
            </span>
          </div>
          <div className="h-1 bg-background rounded-full overflow-hidden">
            <div
              className="h-full transition-all"
              style={{
                width: `${fieldPct}%`,
                background: fieldPct > 85
                  ? "linear-gradient(90deg, var(--warning), var(--danger))"
                  : isMoon
                    ? "linear-gradient(90deg, var(--crystal), var(--accent))"
                    : "linear-gradient(90deg, var(--primary), var(--accent))",
              }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Thermometer className="w-3 h-3 text-muted-foreground" />
            <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">Temp.</span>
          </div>
          <div className="font-mono text-[10px] tabular-nums flex items-center gap-1">
            <Moon className="w-2.5 h-2.5 text-crystal" />
            <span className="text-crystal">{isMoon ? moonStats.tempMin : -23}°</span>
            <span className="text-muted-foreground">/</span>
            <Sun className="w-2.5 h-2.5 text-warning" />
            <span className="text-warning">{isMoon ? moonStats.tempMax : 47}°</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Globe className="w-3 h-3 text-muted-foreground" />
            <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">Diâmetro</span>
          </div>
          <span className="font-mono text-[10px] tabular-nums text-foreground">
            {isMoon ? planet.moonDiameter?.toLocaleString("pt-BR") : "12.742"} km
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3 h-3 text-muted-foreground" />
            <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">Posição</span>
          </div>
          <span className="font-mono text-[10px] tabular-nums text-foreground">8 / 15</span>
        </div>

        {/* Moon shortcut when on planet */}
        {!isMoon && planet.hasMoon && (
          <Link
            to="/moon"
            onClick={() => locationStore.setKind("moon")}
            className="mt-1 pt-2 border-t border-border flex items-center justify-between hover:text-crystal transition-colors group"
          >
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-crystal/70" style={{ boxShadow: "0 0 6px var(--crystal)" }} />
              <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground group-hover:text-crystal">
                Lua {planet.moonName}
              </span>
            </div>
            <span className="font-mono text-[10px] text-crystal">{planet.moonDiameter?.toLocaleString("pt-BR")} km →</span>
          </Link>
        )}

        {isMoon && (
          <button
            onClick={() => locationStore.setKind("planet")}
            className="mt-1 pt-2 border-t border-border flex items-center justify-between w-full hover:text-primary transition-colors group"
          >
            <div className="flex items-center gap-1.5">
              <Globe className="w-3 h-3 text-muted-foreground group-hover:text-primary" />
              <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground group-hover:text-primary">
                Voltar ao planeta
              </span>
            </div>
            <span className="font-mono text-[10px] text-primary">←</span>
          </button>
        )}
      </div>
    </div>
  );
}
