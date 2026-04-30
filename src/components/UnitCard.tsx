import type { UnitItem } from "@/lib/game-data";
import { useState } from "react";

const fmt = (n: number) => n.toLocaleString("pt-BR");

export function UnitCard({ item }: { item: UnitItem }) {
  const Icon = item.icon;
  const [qty, setQty] = useState(0);

  return (
    <div className="panel panel-glow rounded-md p-4 transition-all relative overflow-hidden">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-14 h-14 rounded bg-surface-elevated border border-border flex items-center justify-center shrink-0">
          <Icon className="w-7 h-7 text-primary" strokeWidth={1.6} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-display text-sm font-semibold tracking-wide uppercase truncate">{item.name}</h3>
            <span className="font-mono text-lg font-bold text-accent tabular-nums">{fmt(item.count)}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{item.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1.5 mb-3 text-center">
        <div className="bg-surface-elevated/50 rounded px-1 py-1.5">
          <div className="text-[9px] font-mono uppercase text-muted-foreground tracking-wider">ATK</div>
          <div className="text-xs font-mono font-bold tabular-nums text-destructive">{fmt(item.attack)}</div>
        </div>
        <div className="bg-surface-elevated/50 rounded px-1 py-1.5">
          <div className="text-[9px] font-mono uppercase text-muted-foreground tracking-wider">ESC</div>
          <div className="text-xs font-mono font-bold tabular-nums text-crystal">{fmt(item.shield)}</div>
        </div>
        <div className="bg-surface-elevated/50 rounded px-1 py-1.5">
          <div className="text-[9px] font-mono uppercase text-muted-foreground tracking-wider">VEL</div>
          <div className="text-xs font-mono font-bold tabular-nums text-accent">{item.speed ? fmt(item.speed) : "—"}</div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 mb-2 text-[10px] font-mono">
        <span className="text-muted-foreground">Custo unitário</span>
        <div className="flex gap-2">
          <span className="text-metal">M:{fmt(item.cost.metal)}</span>
          <span className="text-crystal">C:{fmt(item.cost.crystal)}</span>
          {item.cost.deuterium ? <span className="text-deuterium">D:{fmt(item.cost.deuterium)}</span> : null}
        </div>
      </div>

      <div className="flex gap-2">
        <input
          type="number"
          min={0}
          value={qty || ""}
          onChange={(e) => setQty(Math.max(0, +e.target.value))}
          placeholder="Qtd"
          className="flex-1 bg-surface-elevated border border-border rounded px-2 py-1.5 text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
        />
        <button className="px-3 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-display font-semibold uppercase tracking-wider rounded transition-all">
          Construir
        </button>
      </div>
    </div>
  );
}
