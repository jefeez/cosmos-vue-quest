import { useState } from "react";
import { ChevronDown, Globe, Thermometer, Maximize2, MapPin, Sun, Moon } from "lucide-react";

const planets = [
  { id: "p1", name: "Aetheria Prime", coords: "[1:147:8]", current: true },
  { id: "p2", name: "Vexor", coords: "[1:147:6]", current: false },
  { id: "p3", name: "Krios", coords: "[2:241:11]", current: false },
];

export function PlanetPanel() {
  const [open, setOpen] = useState(true);
  const [selected, setSelected] = useState(planets[0]);
  const usedFields = 142;
  const totalFields = 188;
  const fieldPct = (usedFields / totalFields) * 100;

  return (
    <div className="border-b border-border bg-surface/40">
      {/* Planet selector */}
      <div className="px-3 py-2.5 border-b border-border">
        <div className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground mb-1.5">
          Planeta Atual
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-10 h-10 rounded-full shrink-0 overflow-hidden border border-primary/40"
               style={{
                 background: "radial-gradient(circle at 30% 30%, oklch(0.7 0.12 50), oklch(0.35 0.08 30) 70%, oklch(0.2 0.04 25))",
                 boxShadow: "inset -3px -3px 6px oklch(0 0 0 / 0.5), 0 0 12px oklch(0.68 0.16 50 / 0.3)",
               }}>
            <div className="absolute inset-0 opacity-40"
                 style={{ background: "radial-gradient(circle at 70% 60%, transparent 30%, oklch(0.15 0.02 30 / 0.6) 60%)" }} />
          </div>
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex-1 flex items-center justify-between text-left group"
          >
            <div className="min-w-0">
              <div className="font-display text-xs uppercase tracking-wider truncate text-foreground">
                {selected.name}
              </div>
              <div className="font-mono text-[10px] text-primary tabular-nums">{selected.coords}</div>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Planet list */}
        {open && (
          <div className="mt-2 space-y-0.5">
            {planets.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelected(p)}
                className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-[11px] font-mono transition-colors ${
                  selected.id === p.id
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-surface-elevated hover:text-foreground"
                }`}
              >
                <span className="truncate">{p.name}</span>
                <span className="tabular-nums shrink-0 ml-2">{p.coords}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Planet stats */}
      <div className="px-3 py-3 space-y-2.5">
        {/* Fields */}
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
                  : "linear-gradient(90deg, var(--primary), var(--accent))",
              }}
            />
          </div>
        </div>

        {/* Temperature */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Thermometer className="w-3 h-3 text-muted-foreground" />
            <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">Temp.</span>
          </div>
          <div className="font-mono text-[10px] tabular-nums flex items-center gap-1">
            <Moon className="w-2.5 h-2.5 text-crystal" />
            <span className="text-crystal">-23°</span>
            <span className="text-muted-foreground">/</span>
            <Sun className="w-2.5 h-2.5 text-warning" />
            <span className="text-warning">47°</span>
          </div>
        </div>

        {/* Diameter */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Globe className="w-3 h-3 text-muted-foreground" />
            <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">Diâmetro</span>
          </div>
          <span className="font-mono text-[10px] tabular-nums text-foreground">12.742 km</span>
        </div>

        {/* Position */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3 h-3 text-muted-foreground" />
            <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">Posição</span>
          </div>
          <span className="font-mono text-[10px] tabular-nums text-foreground">8 / 15</span>
        </div>

        {/* Moon indicator */}
        <div className="mt-1 pt-2 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-crystal/70" style={{ boxShadow: "0 0 6px var(--crystal)" }} />
            <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">Lua Selene</span>
          </div>
          <span className="font-mono text-[10px] text-crystal">8.420 km</span>
        </div>
      </div>
    </div>
  );
}
